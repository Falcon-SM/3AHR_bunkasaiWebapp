"use client";

import { useEffect } from "react";

export default function ErrorLogger() {
  useEffect(() => {
    const onError = (event: ErrorEvent) => {
      // Log detailed info for debugging
      // eslint-disable-next-line no-console
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
      const target = e.target as HTMLElement & { src?: string; href?: string };
      if (!target) return;
      const info: any = { tag: target.tagName };
      if ((target as any).src) info.src = (target as any).src;
      if ((target as any).href) info.href = (target as any).href;
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
