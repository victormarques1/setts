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
  },
  lg: {
    wrapper: "text-3xl sm:text-4xl",
    icon: "size-8 sm:size-9",
  },
} as const;

function LogoContent({ size }: { size: "sm" | "lg" }) {
  const styles = sizeStyles[size];

  return (
    <>
      <Dumbbell
        className={cn("shrink-0", styles.icon)}
        aria-hidden="true"
        strokeWidth={2.25}
      />
      <span>weightzz</span>
    </>
  );
}

export function AppLogo({ href, size = "sm", className }: AppLogoProps) {
  const styles = sizeStyles[size];
  const wrapperClassName = cn(
    "text-primary inline-flex items-center gap-2 font-semibold tracking-tight",
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
