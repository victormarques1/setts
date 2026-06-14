"use client";

import { cn } from "@/lib/utils";
import { useAppChrome } from "@/components/layout/app-chrome-context";

type AppMainProps = {
  children: React.ReactNode;
};

export function AppMain({ children }: AppMainProps) {
  const { hideBottomNav } = useAppChrome();

  return (
    <div
      className={cn(
        "flex flex-1 flex-col md:pb-0",
        hideBottomNav
          ? "pb-0"
          : "pb-[calc(4.25rem+env(safe-area-inset-bottom))]",
      )}
    >
      {children}
    </div>
  );
}
