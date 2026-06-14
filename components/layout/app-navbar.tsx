"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { LogoutButton } from "@/modules/auth/components/logout-button";

type NavItem = {
  href: string;
  label: string;
  isActive: (pathname: string) => boolean;
};

const navItems: NavItem[] = [
  {
    href: "/workouts",
    label: "Treinos",
    isActive: (pathname) =>
      pathname === "/workouts" || pathname.startsWith("/workouts/"),
  },
  {
    href: "/history",
    label: "Histórico",
    isActive: (pathname) =>
      pathname === "/history" || pathname.startsWith("/history/"),
  },
];

type AppNavbarProps = {
  userName?: string | null;
};

export function AppNavbar({ userName }: AppNavbarProps) {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-14 max-w-2xl items-center justify-between gap-4 px-6">
        <div className="flex min-w-0 items-center gap-6">
          <Link
            href="/workouts"
            className="text-primary shrink-0 font-semibold tracking-tight"
          >
            weightzz
          </Link>
          <nav
            aria-label="Navegação principal"
            className="flex items-center gap-1"
          >
            {navItems.map((item) => {
              const active = item.isActive(pathname);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                    active
                      ? "bg-primary/15 text-primary"
                      : "text-muted-foreground hover:bg-accent/60 hover:text-accent-foreground",
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
        <div className="flex shrink-0 items-center gap-3">
          {userName ? (
            <span className="text-muted-foreground hidden max-w-32 truncate text-sm sm:inline">
              {userName}
            </span>
          ) : null}
          <LogoutButton />
        </div>
      </div>
    </header>
  );
}
