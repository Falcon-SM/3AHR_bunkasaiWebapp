"use client";

import { useEffect } from "react";

export default function ErrorLogger() {
  useEffect(() => {
    const onError = (event: ErrorEvent) => {
      // Log detailed info for debugging
      console.warn("[ErrorLogger] window.error captured:", {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        error: event.error,
      });
    };

    const onRejection = (event: PromiseRejectionEvent) => {
      console.warn("[ErrorLogger] unhandledrejection:", event.reason);
    };

    const onResourceError = (e: Event) => {
      const target = e.target as Element | null;
      if (!target) return;
      const info: Record<string, string | undefined> = { tag: target.tagName };
      if (target instanceof HTMLScriptElement) info.src = target.src;
      else if (target instanceof HTMLImageElement) info.src = target.src;
      else if (target instanceof HTMLLinkElement) info.href = target.href;
      else if (target instanceof HTMLAnchorElement) info.href = target.href;
      console.warn("[ErrorLogger] resource error:", info);
    };

    window.addEventListener("error", onError);
    window.addEventListener("unhandledrejection", onRejection);
    // capture resource loading errors at capture phase
    window.addEventListener("error", onResourceError, true);

    return () => {
      window.removeEventListener("error", onError);
      window.removeEventListener("unhandledrejection", onRejection);
      window.removeEventListener("error", onResourceError, true);
    };
  }, []);

  return null;
}
