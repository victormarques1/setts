import { Dumbbell } from "lucide-react";
import Link from "next/link";

import { cn } from "@/lib/utils";

type AppLogoProps = {
  href?: string;
  size?: "sm" | "lg";
  className?: string;
};

const sizeStyles = {
  sm: {
    wrapper: "text-base sm:text-lg",
    icon: "size-5",
    iconWrap: "size-8",
  },
  lg: {
    wrapper: "text-3xl sm:text-4xl",
    icon: "size-7 sm:size-8",
    iconWrap: "size-14 sm:size-16",
  },
} as const;

function LogoContent({ size }: { size: "sm" | "lg" }) {
  const styles = sizeStyles[size];

  return (
    <>
      <span
        className={cn(
          "flex shrink-0 items-center justify-center rounded-xl bg-primary/12",
          styles.iconWrap,
        )}
      >
        <Dumbbell
          className={cn("text-primary", styles.icon)}
          aria-hidden="true"
          strokeWidth={2.5}
        />
      </span>
      <span className="tracking-tight">weightzz</span>
    </>
  );
}

export function AppLogo({ href, size = "sm", className }: AppLogoProps) {
  const styles = sizeStyles[size];
  const wrapperClassName = cn(
    "text-foreground inline-flex items-center gap-2.5 font-bold tracking-tight",
    styles.wrapper,
    className,
  );

  if (href) {
    return (
      <Link href={href} className={cn(wrapperClassName, "shrink-0")}>
        <LogoContent size={size} />
      </Link>
    );
  }

  return (
    <h1 className={wrapperClassName}>
      <LogoContent size={size} />
    </h1>
  );
}
