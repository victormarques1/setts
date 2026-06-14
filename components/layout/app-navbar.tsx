"use client";

import { Dumbbell, History, TrendingUp, type LucideIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { AppLogo } from "@/components/layout/app-logo";
import { cn } from "@/lib/utils";
import { LogoutButton } from "@/modules/auth/components/logout-button";

type NavItem = {
  href: string;
  label: string;
  shortLabel: string;
  icon: LucideIcon;
  isActive: (pathname: string) => boolean;
};

const navItems: NavItem[] = [
  {
    href: "/workouts",
    label: "Treinos",
    shortLabel: "Treinos",
    icon: Dumbbell,
    isActive: (pathname) =>
      pathname === "/workouts" || pathname.startsWith("/workouts/"),
  },
  {
    href: "/history",
    label: "Histórico",
    shortLabel: "Histórico",
    icon: History,
    isActive: (pathname) =>
      pathname === "/history" || pathname.startsWith("/history/"),
  },
  {
    href: "/progress",
    label: "Progressão",
    shortLabel: "Progresso",
    icon: TrendingUp,
    isActive: (pathname) =>
      pathname === "/progress" || pathname.startsWith("/progress/"),
  },
];

type AppNavbarProps = {
  userName?: string | null;
};

function NavLink({
  item,
  pathname,
  variant,
}: {
  item: NavItem;
  pathname: string;
  variant: "header" | "bottom";
}) {
  const active = item.isActive(pathname);
  const Icon = item.icon;

  if (variant === "bottom") {
    return (
      <Link
        href={item.href}
        aria-current={active ? "page" : undefined}
        className={cn(
          "relative flex min-h-[3.5rem] flex-1 flex-col items-center justify-center gap-1 px-2 py-2 text-xs font-semibold transition-colors nav-focus-ring rounded-lg",
          active
            ? "text-primary"
            : "text-muted-foreground active:text-foreground",
        )}
      >
        {active ? (
          <span
            className="absolute top-1.5 h-0.5 w-5 rounded-full bg-primary"
            aria-hidden="true"
          />
        ) : null}
        <Icon
          className={cn("size-[1.375rem] shrink-0", active && "stroke-[2.5]")}
          aria-hidden={true}
        />
        <span className="truncate">{item.shortLabel}</span>
      </Link>
    );
  }

  return (
    <Link
      href={item.href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "min-h-10 rounded-xl px-3.5 py-2 text-sm font-semibold transition-colors nav-focus-ring",
        active
          ? "bg-primary/12 text-primary"
          : "text-muted-foreground hover:bg-surface-elevated hover:text-foreground",
      )}
    >
      {item.label}
    </Link>
  );
}

export function AppNavbar({ userName }: AppNavbarProps) {
  const pathname = usePathname();

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-border/60 bg-background/90 pt-[env(safe-area-inset-top,0px)] backdrop-blur-md supports-[backdrop-filter]:bg-background/75">
        <div className="shell-x mx-auto flex h-12 max-w-2xl items-center justify-between gap-3 sm:h-14">
          <AppLogo href="/workouts" />

          <nav
            aria-label="Navegação principal"
            className="hidden items-center gap-0.5 md:flex"
          >
            {navItems.map((item) => (
              <NavLink
                key={item.href}
                item={item}
                pathname={pathname}
                variant="header"
              />
            ))}
          </nav>

          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            {userName ? (
              <span className="text-muted-foreground hidden max-w-32 truncate text-sm font-medium lg:inline">
                {userName}
              </span>
            ) : null}
            <LogoutButton />
          </div>
        </div>
      </header>

      <nav
        aria-label="Navegação principal"
        className="fixed inset-x-0 bottom-0 z-50 border-t border-border/60 bg-background/90 backdrop-blur-md supports-[backdrop-filter]:bg-background/75 md:hidden"
      >
        <div className="shell-x mx-auto flex max-w-2xl items-stretch pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-1">
          {navItems.map((item) => (
            <NavLink
              key={item.href}
              item={item}
              pathname={pathname}
              variant="bottom"
            />
          ))}
        </div>
      </nav>
    </>
  );
}
