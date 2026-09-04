import { randomBytes } from "node:crypto";
import { mkdir, readFile, rename, unlink, writeFile } from "node:fs/promises";
import path from "node:path";

const CONFIG_FILENAME = "indexnow-key.json";
const KEY_PATTERN = /^[a-f0-9]{32}$/;

function repositoryRoot(args) {
  if (args.length === 0) return process.cwd();
  if (args.length === 2 && args[0] === "--root") {
    return path.resolve(args[1]);
  }

  throw new Error("Usage: pnpm indexnow:key [--root <repository-path>]");
}

async function readCurrentConfig(root) {
  const configPath = path.join(root, CONFIG_FILENAME);

  try {
    const config = JSON.parse(await readFile(configPath, "utf8"));
    if (
      !config ||
      typeof config !== "object" ||
      !KEY_PATTERN.test(config.key) ||
      config.keyFile !== `public/${config.key}.txt`
    ) {
      throw new Error(`${CONFIG_FILENAME} contains an invalid IndexNow key.`);
    }
    return config;
  } catch (error) {
    if (error && typeof error === "object" && error.code === "ENOENT") {
      return null;
    }
    throw error;
  }
}

async function generateKey(root) {
  const publicDirectory = path.join(root, "public");
  const previous = await readCurrentConfig(root);

  await mkdir(publicDirectory, { recursive: true });

  let key;
  let keyPath;
  while (true) {
    key = randomBytes(16).toString("hex");
    keyPath = path.join(publicDirectory, `${key}.txt`);
    try {
      await writeFile(keyPath, key, { encoding: "utf8", flag: "wx" });
      break;
    } catch (error) {
      if (!error || typeof error !== "object" || error.code !== "EEXIST") {
        throw error;
      }
    }
  }

  const config = {
    key,
    keyFile: `public/${key}.txt`,
  };
  const configPath = path.join(root, CONFIG_FILENAME);
  const temporaryConfigPath = `${configPath}.tmp`;
  await writeFile(
    temporaryConfigPath,
    `${JSON.stringify(config, null, 2)}\n`,
    "utf8",
  );
  await rename(temporaryConfigPath, configPath);

  if (previous && previous.key !== key) {
    try {
      await unlink(path.join(root, previous.keyFile));
    } catch (error) {
      if (!error || typeof error !== "object" || error.code !== "ENOENT") {
        throw error;
      }
    }
  }

  return config;
}

try {
  const root = repositoryRoot(process.argv.slice(2));
  const config = await generateKey(root);
  console.log(`Generated IndexNow key: ${config.key}`);
  console.log(`Published by Next.js at: /${config.key}.txt`);
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
}
