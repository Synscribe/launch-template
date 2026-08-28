"use client";

import {
  type ReactNode,
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";

const SCRIPT_SRC =
  "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";

type TurnstileApi = {
  remove: (widgetId: string) => void;
  render: (
    element: HTMLElement,
    options: {
      action: string;
      callback: (token: string) => void;
      "error-callback": () => void;
      "expired-callback": () => void;
      sitekey: string;
      theme: "auto";
    },
  ) => string;
  reset: (widgetId: string) => void;
};

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

type TurnstileHandle = {
  reset: () => void;
};

let scriptPromise: Promise<void> | null = null;

function loadTurnstileScript(): Promise<void> {
  if (window.turnstile) return Promise.resolve();
  if (scriptPromise) return scriptPromise;

  scriptPromise = new Promise<void>((resolve, reject) => {
    const script = document.createElement("script");
    script.src = SCRIPT_SRC;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => {
      scriptPromise = null;
      reject(new Error("Turnstile script failed to load"));
    };
    document.head.appendChild(script);
  });

  return scriptPromise;
}

const Turnstile = forwardRef<
  TurnstileHandle,
  {
    action: string;
    onError: () => void;
    onToken: (token: string | null) => void;
    siteKey: string;
  }
>(function Turnstile({ action, onError, onToken, siteKey }, ref) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);
  const onErrorRef = useRef(onError);
  const onTokenRef = useRef(onToken);

  useEffect(() => {
    onErrorRef.current = onError;
    onTokenRef.current = onToken;
  }, [onError, onToken]);

  useImperativeHandle(ref, () => ({
    reset() {
      const widgetId = widgetIdRef.current;
      if (!widgetId || !window.turnstile) return;
      window.turnstile.reset(widgetId);
      onTokenRef.current(null);
    },
  }));

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let cancelled = false;
    loadTurnstileScript()
      .then(() => {
        if (cancelled || !window.turnstile) return;
        widgetIdRef.current = window.turnstile.render(container, {
          action,
          callback: (token) => onTokenRef.current(token),
          "error-callback": () => {
            onTokenRef.current(null);
            onErrorRef.current();
          },
          "expired-callback": () => onTokenRef.current(null),
          sitekey: siteKey,
          theme: "auto",
        });
      })
      .catch(() => {
        if (!cancelled) onErrorRef.current();
      });

    return () => {
      cancelled = true;
      const widgetId = widgetIdRef.current;
      if (widgetId && window.turnstile) window.turnstile.remove(widgetId);
      widgetIdRef.current = null;
    };
  }, [action, siteKey]);

  return <div className="mt-6" ref={containerRef} />;
});

export function useTurnstile({
  action,
  siteKey,
}: {
  action?: string;
  siteKey?: string;
}): {
  enabled: boolean;
  error: string;
  reset: () => void;
  token: string | null;
  widget: ReactNode;
} {
  const [token, setToken] = useState<string | null>(null);
  const [error, setError] = useState("");
  const handleRef = useRef<TurnstileHandle>(null);
  const reset = useCallback(() => {
    handleRef.current?.reset();
    setToken(null);
  }, []);

  if (!siteKey || !action) {
    return { enabled: false, error: "", reset, token: null, widget: null };
  }

  return {
    enabled: true,
    error,
    reset,
    token,
    widget: (
      <Turnstile
        action={action}
        onError={() => {
          setError(
            "Bot verification could not load. Check your connection and try again.",
          );
        }}
        onToken={(nextToken) => {
          setError("");
          setToken(nextToken);
        }}
        ref={handleRef}
        siteKey={siteKey}
      />
    ),
  };
}
