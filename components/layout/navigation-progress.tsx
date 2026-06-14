"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

function isInternalNavigationLink(anchor: HTMLAnchorElement, pathname: string) {
  const href = anchor.getAttribute("href");

  if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) {
    return false;
  }

  if (anchor.target === "_blank" || anchor.hasAttribute("download")) {
    return false;
  }

  if (href.startsWith("http://") || href.startsWith("https://")) {
    return false;
  }

  const url = new URL(href, window.location.origin);

  if (url.origin !== window.location.origin) {
    return false;
  }

  return url.pathname !== pathname || url.search !== window.location.search;
}

export function NavigationProgress() {
  const pathname = usePathname();
  const [isNavigating, setIsNavigating] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      setIsNavigating(false);
    });

    return () => {
      cancelAnimationFrame(frame);
    };
  }, [pathname]);

  useEffect(() => {
    function handleClick(event: MouseEvent) {
      if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
        return;
      }

      const target = event.target;

      if (!(target instanceof Element)) {
        return;
      }

      const anchor = target.closest("a");

      if (!(anchor instanceof HTMLAnchorElement)) {
        return;
      }

      if (isInternalNavigationLink(anchor, pathname)) {
        setIsNavigating(true);
      }
    }

    document.addEventListener("click", handleClick, true);

    return () => {
      document.removeEventListener("click", handleClick, true);
    };
  }, [pathname]);

  return (
    <div
      className={cn(
        "pointer-events-none fixed inset-x-0 top-0 z-[100] h-0.5 overflow-hidden bg-transparent transition-opacity duration-200",
        isNavigating ? "opacity-100" : "opacity-0",
      )}
      role="progressbar"
      aria-hidden={!isNavigating}
      aria-valuetext="Carregando página"
    >
      <div className="nav-progress-bar h-full bg-primary" />
    </div>
  );
}
