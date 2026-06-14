"use client";

import { useEffect } from "react";

import { useAppChrome } from "@/components/layout/app-chrome-context";

type AppChromeSetterProps = {
  hideBottomNav: boolean;
  children: React.ReactNode;
};

export function AppChromeSetter({
  hideBottomNav,
  children,
}: AppChromeSetterProps) {
  const { setHideBottomNav } = useAppChrome();

  useEffect(() => {
    setHideBottomNav(hideBottomNav);

    return () => {
      setHideBottomNav(false);
    };
  }, [hideBottomNav, setHideBottomNav]);

  return (
    <div data-hide-bottom-nav={hideBottomNav ? "" : undefined}>
      {children}
    </div>
  );
}
