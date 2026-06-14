"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function SessionRefreshOnShow() {
  const router = useRouter();

  useEffect(() => {
    function handlePageShow(event: PageTransitionEvent) {
      if (event.persisted) {
        router.refresh();
      }
    }

    window.addEventListener("pageshow", handlePageShow);

    return () => {
      window.removeEventListener("pageshow", handlePageShow);
    };
  }, [router]);

  return null;
}
