"use client";

import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type AppChromeContextValue = {
  hideBottomNav: boolean;
  setHideBottomNav: (value: boolean) => void;
};

const AppChromeContext = createContext<AppChromeContextValue | null>(null);

export function AppChromeProvider({ children }: { children: ReactNode }) {
  const [hideBottomNav, setHideBottomNav] = useState(false);
  const value = useMemo(
    () => ({ hideBottomNav, setHideBottomNav }),
    [hideBottomNav],
  );

  return (
    <AppChromeContext.Provider value={value}>
      {children}
    </AppChromeContext.Provider>
  );
}

export function useAppChrome() {
  const context = useContext(AppChromeContext);

  if (!context) {
    throw new Error("useAppChrome must be used within AppChromeProvider");
  }

  return context;
}
