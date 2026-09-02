#!/usr/bin/env node

import { spawn, spawnSync } from "node:child_process";
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readdirSync,
  rmSync,
  unlinkSync,
  writeFileSync,
} from "node:fs";
import { createServer } from "node:net";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import WebSocket from "ws";

const SCRIPT = fileURLToPath(import.meta.url);
const ROOT = resolve(dirname(SCRIPT), "..");
const OUT = join(ROOT, "artifacts", "launch-assets");
const NEXT = join(ROOT, "node_modules", ".bin", "next");

const args = process.argv.slice(2);
const onlyIndex = args.indexOf("--only");
const only = onlyIndex >= 0 ? args[onlyIndex + 1] : undefined;
const skipBuild = args.includes("--skip-build");

if (onlyIndex >= 0 && (!only || only.startsWith("--"))) {
  throw new Error("--only requires an asset ID");
}

const sleep = (milliseconds) =>
  new Promise((resolveSleep) => setTimeout(resolveSleep, milliseconds));

const chrome = [
  process.env.CHROME,
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/Applications/Chromium.app/Contents/MacOS/Chromium",
  "/usr/bin/google-chrome",
  "/usr/bin/chromium",
  process.env.LOCALAPPDATA
    ? join(
        process.env.LOCALAPPDATA,
        "Google",
        "Chrome",
        "Application",
        "chrome.exe",
      )
    : undefined,
]
  .filter(Boolean)
  .find((candidate) => existsSync(candidate));

if (!chrome) {
  throw new Error(
    "Could not find Chrome. Install it or set CHROME=/absolute/path/to/chrome.",
  );
}

const PROFILE = mkdtempSync(join(tmpdir(), "launch-assets-chrome-"));

function availablePort() {
  return new Promise((resolvePort, rejectPort) => {
    const server = createServer();
    server.unref();
    server.on("error", rejectPort);
    server.listen(0, "127.0.0.1", () => {
      const address = server.address();
      if (!address || typeof address === "string") {
        server.close();
        rejectPort(new Error("Could not allocate a local port."));
        return;
      }
      server.close(() => resolvePort(address.port));
    });
  });
}

const children = [];
let socket;

function cleanup() {
  if (socket?.readyState === WebSocket.OPEN) socket.close();
  for (const child of children) {
    try {
      child.kill();
    } catch {}
  }
  try {
    rmSync(PROFILE, { force: true, recursive: true });
  } catch {}
}

process.once("SIGINT", () => {
  cleanup();
  process.exit(130);
});
process.once("SIGTERM", () => {
  cleanup();
  process.exit(143);
});

async function waitFor(label, check) {
  for (let attempt = 0; attempt < 120; attempt += 1) {
    try {
      if (await check()) return;
    } catch {}
    await sleep(250);
  }
  throw new Error(`${label} never became ready.`);
}

function assertPng(buffer, expectedWidth, expectedHeight) {
  const signature = buffer.subarray(0, 8).toString("hex");
  if (signature !== "89504e470d0a1a0a") {
    throw new Error("Chrome returned data that is not a PNG.");
  }

  const width = buffer.readUInt32BE(16);
  const height = buffer.readUInt32BE(20);
  if (width !== expectedWidth || height !== expectedHeight) {
    throw new Error(
      `Expected ${expectedWidth}x${expectedHeight}, received ${width}x${height}.`,
    );
  }
}

async function run() {
  const [serverPort, cdpPort] = await Promise.all([
    availablePort(),
    availablePort(),
  ]);

  if (!skipBuild) {
    console.log("· building the production app …");
    const build = spawnSync(NEXT, ["build"], {
      cwd: ROOT,
      env: process.env,
      stdio: "inherit",
    });
    if (build.status !== 0) {
      throw new Error(
        `Next.js build failed with status ${build.status ?? "unknown"}.`,
      );
    }
  }

  console.log(`· serving the gated visual workspace on :${serverPort} …`);
  children.push(
    spawn(NEXT, ["start", "-H", "127.0.0.1", "-p", String(serverPort)], {
      cwd: ROOT,
      env: { ...process.env, VISUAL_REVIEW_ENABLED: "true" },
      stdio: "ignore",
    }),
  );

  const galleryUrl = `http://127.0.0.1:${serverPort}/dev/launch-assets`;
  await waitFor("Next.js server", async () => (await fetch(galleryUrl)).ok);

  console.log("· starting isolated Chrome …");
  children.push(
    spawn(
      chrome,
      [
        "--headless=new",
        "--enable-unsafe-swiftshader",
        "--no-first-run",
        "--no-default-browser-check",
        "--disable-extensions",
        "--disable-background-networking",
        "--disable-features=PaintHolding",
        "--disable-sync",
        "--hide-scrollbars",
        `--user-data-dir=${PROFILE}`,
        `--remote-debugging-port=${cdpPort}`,
        "about:blank",
      ],
      { stdio: "ignore" },
    ),
  );

  let webSocketUrl;
  await waitFor("Chrome", async () => {
    const response = await fetch(`http://127.0.0.1:${cdpPort}/json/version`);
    if (!response.ok) return false;
    webSocketUrl = (await response.json()).webSocketDebuggerUrl;
    return Boolean(webSocketUrl);
  });

  socket = new WebSocket(webSocketUrl);
  await new Promise((resolveSocket, rejectSocket) => {
    socket.once("open", resolveSocket);
    socket.once("error", rejectSocket);
  });

  let messageId = 0;
  const pending = new Map();

  socket.on("message", (data) => {
    const message = JSON.parse(data.toString());
    if (!message.id || !pending.has(message.id)) return;
    const request = pending.get(message.id);
    pending.delete(message.id);
    if (message.error) request.reject(new Error(message.error.message));
    else request.resolve(message.result);
  });

  function send(method, params = {}, sessionId) {
    const id = ++messageId;
    return new Promise((resolveRequest, rejectRequest) => {
      pending.set(id, { reject: rejectRequest, resolve: resolveRequest });
      socket.send(
        JSON.stringify({
          id,
          method,
          params,
          ...(sessionId ? { sessionId } : {}),
        }),
      );
      setTimeout(() => {
        if (pending.delete(id)) {
          rejectRequest(new Error(`${method} timed out.`));
        }
      }, 60_000).unref();
    });
  }

  let { targetId } = await send("Target.createTarget", {
    url: "about:blank",
  });
  let { sessionId } = await send("Target.attachToTarget", {
    flatten: true,
    targetId,
  });

  async function configurePage(width, height) {
    await send("Page.enable", {}, sessionId);
    await send("Runtime.enable", {}, sessionId);
    await send(
      "Emulation.setDeviceMetricsOverride",
      { deviceScaleFactor: 1, height, mobile: false, width },
      sessionId,
    );
    await send(
      "Emulation.setEmulatedMedia",
      { features: [{ name: "prefers-reduced-motion", value: "reduce" }] },
      sessionId,
    );
  }

  await configurePage(1440, 900);

  async function evaluate(expression, awaitPromise = false) {
    const response = await send(
      "Runtime.evaluate",
      { awaitPromise, expression, returnByValue: true },
      sessionId,
    );
    if (response.exceptionDetails) {
      throw new Error(
        response.exceptionDetails.exception?.description ??
          response.exceptionDetails.text ??
          "Browser evaluation failed.",
      );
    }
    return response.result.value;
  }

  async function navigate(url) {
    const result = await send("Page.navigate", { url }, sessionId);
    if (result.errorText) throw new Error(result.errorText);
    await waitFor("Page", async () =>
      evaluate(
        `location.href === ${JSON.stringify(url)} && document.readyState === 'complete'`,
      ),
    );
  }

  async function settlePage() {
    await evaluate(
      `(async () => {
        await document.fonts.ready;
        await Promise.all([...document.images].map((image) =>
          image.complete ? Promise.resolve() : image.decode().catch(() => undefined)
        ));
        await new Promise((resolve) => requestAnimationFrame(() =>
          requestAnimationFrame(resolve)
        ));
        return true;
      })()`,
      true,
    );
    await sleep(300);
  }

  await navigate(galleryUrl);
  await settlePage();

  const assets = JSON.parse(
    await evaluate(`JSON.stringify(
      [...document.querySelectorAll('[data-launch-asset]')].map((element) => ({
        id: element.dataset.launchAsset,
        width: Number(element.dataset.exportWidth),
        height: Number(element.dataset.exportHeight),
      }))
    )`),
  );

  if (assets.length === 0) {
    throw new Error("The launch gallery exposed no exportable assets.");
  }
  for (const asset of assets) {
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(asset.id)) {
      throw new Error(`Invalid asset ID: ${asset.id}`);
    }
    if (!Number.isInteger(asset.width) || !Number.isInteger(asset.height)) {
      throw new Error(`Invalid dimensions for ${asset.id}.`);
    }
  }

  const targets = only ? assets.filter((asset) => asset.id === only) : assets;
  if (targets.length === 0) {
    throw new Error(
      `Unknown asset "${only}". Known assets: ${assets.map((asset) => asset.id).join(", ")}`,
    );
  }

  mkdirSync(OUT, { recursive: true });
  if (!only) {
    for (const file of readdirSync(OUT)) {
      if (file.endsWith(".png")) unlinkSync(join(OUT, file));
    }
  }

  await send("Target.closeTarget", { targetId });

  if (!only) {
    // Chromium can reuse painted layers across related pages. A separate process per
    // frame keeps a full-set export as reliable as exporting each asset on its own.
    cleanup();
    console.log(
      `· exporting ${targets.length} assets in isolated browser processes …`,
    );
    for (const asset of targets) {
      const child = spawnSync(
        process.execPath,
        [SCRIPT, "--skip-build", "--only", asset.id],
        {
          cwd: ROOT,
          env: process.env,
          stdio: "inherit",
        },
      );
      if (child.status !== 0) {
        throw new Error(
          `Export failed for ${asset.id} with status ${child.status ?? "unknown"}.`,
        );
      }
    }
    console.log(`\nDone. PNG files are in ${OUT}`);
    return;
  }

  console.log(
    `· exporting ${targets.length} asset${targets.length === 1 ? "" : "s"} …`,
  );
  for (const asset of targets) {
    ({ targetId } = await send("Target.createTarget", { url: "about:blank" }));
    ({ sessionId } = await send("Target.attachToTarget", {
      flatten: true,
      targetId,
    }));
    await configurePage(asset.width, asset.height + 240);
    await navigate(`${galleryUrl}?asset=${encodeURIComponent(asset.id)}`);
    await settlePage();
    // Invalidate and settle the complete frame before taking a surface screenshot.
    await evaluate(
      `(async () => {
        const frame = document.querySelector('[data-launch-asset]');
        frame.style.transform = 'translateZ(0)';
        void frame.offsetHeight;
        await new Promise((resolve) => requestAnimationFrame(() =>
          requestAnimationFrame(resolve)
        ));
        return true;
      })()`,
      true,
    );

    const reducedMotion = await evaluate(
      "matchMedia('(prefers-reduced-motion: reduce)').matches",
    );
    if (!reducedMotion) {
      throw new Error("Chrome did not apply reduced-motion emulation.");
    }

    const bounds = JSON.parse(
      await evaluate(`(() => {
        const element = document.querySelector('[data-launch-asset="${asset.id}"]');
        if (!element) throw new Error('Asset element not found');
        const rect = element.getBoundingClientRect();
        return JSON.stringify({
          x: rect.x + window.scrollX,
          y: rect.y + window.scrollY,
          width: rect.width,
          height: rect.height,
        });
      })()`),
    );

    if (
      Math.round(bounds.width) !== asset.width ||
      Math.round(bounds.height) !== asset.height
    ) {
      throw new Error(
        `${asset.id} rendered at ${bounds.width}x${bounds.height}, expected ${asset.width}x${asset.height}.`,
      );
    }

    const screenshot = await send(
      "Page.captureScreenshot",
      {
        captureBeyondViewport: false,
        clip: { ...bounds, scale: 1 },
        format: "png",
        fromSurface: true,
      },
      sessionId,
    );
    const png = Buffer.from(screenshot.data, "base64");
    assertPng(png, asset.width, asset.height);

    const order = String(
      assets.findIndex((item) => item.id === asset.id) + 1,
    ).padStart(2, "0");
    const fileName = `${order}-${asset.id}.png`;
    writeFileSync(join(OUT, fileName), png);
    console.log(`  ✓ ${fileName}`);
    await send("Target.closeTarget", { targetId });
  }

  console.log(`\nDone. PNG files are in ${OUT}`);
}

try {
  await run();
} finally {
  cleanup();
}
