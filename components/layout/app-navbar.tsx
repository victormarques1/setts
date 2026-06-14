"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { LogoutButton } from "@/modules/auth/components/logout-button";

type NavItem = {
  href: string;
  label: string;
  shortLabel: string;
  isActive: (pathname: string) => boolean;
};

const navItems: NavItem[] = [
  {
    href: "/workouts",
    label: "Treinos",
    shortLabel: "Treinos",
    isActive: (pathname) =>
      pathname === "/workouts" || pathname.startsWith("/workouts/"),
  },
  {
    href: "/history",
    label: "Histórico",
    shortLabel: "Histórico",
    isActive: (pathname) =>
      pathname === "/history" || pathname.startsWith("/history/"),
  },
  {
    href: "/progress",
    label: "Progressão",
    shortLabel: "Progresso",
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

  if (variant === "bottom") {
    return (
      <Link
        href={item.href}
        aria-current={active ? "page" : undefined}
        className={cn(
          "flex min-h-[3.25rem] flex-1 flex-col items-center justify-center gap-0.5 px-2 py-2.5 text-xs font-medium transition-colors",
          active
            ? "text-primary"
            : "text-muted-foreground active:bg-accent/60",
        )}
      >
        <span className="truncate">{item.shortLabel}</span>
      </Link>
    );
  }

  return (
    <Link
      href={item.href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "min-h-11 rounded-md px-3 py-2 text-sm font-medium transition-colors",
        active
          ? "bg-primary/15 text-primary"
          : "text-muted-foreground hover:bg-accent/60 hover:text-accent-foreground",
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
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 pt-[env(safe-area-inset-top,0px)] backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="shell-x mx-auto flex h-12 max-w-2xl items-center justify-between gap-3 sm:h-14">
          <Link
            href="/workouts"
            className="text-primary shrink-0 text-base font-semibold tracking-tight sm:text-lg"
          >
            weightzz
          </Link>

          <nav
            aria-label="Navegação principal"
            className="hidden items-center gap-1 md:flex"
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
              <span className="text-muted-foreground hidden max-w-32 truncate text-sm lg:inline">
                {userName}
              </span>
            ) : null}
            <LogoutButton />
          </div>
        </div>
      </header>

      <nav
        aria-label="Navegação principal"
        className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 md:hidden"
      >
        <div className="shell-x mx-auto flex max-w-2xl items-stretch pb-[max(0.625rem,env(safe-area-inset-bottom))] pt-1.5">
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
