"use client";

import { Drawer as DrawerPrimitive } from "@base-ui/react/drawer";

import { cn } from "@/lib/utils";

function DrawerRoot({ ...props }: DrawerPrimitive.Root.Props) {
  return <DrawerPrimitive.Root {...props} />;
}

function DrawerPortal({ ...props }: DrawerPrimitive.Portal.Props) {
  return <DrawerPrimitive.Portal {...props} />;
}

function DrawerViewport({
  className,
  ...props
}: DrawerPrimitive.Viewport.Props) {
  return (
    <DrawerPrimitive.Viewport
      className={cn("set-logger-sheet-viewport", className)}
      {...props}
    />
  );
}

function DrawerPopup({
  className,
  ...props
}: DrawerPrimitive.Popup.Props) {
  return (
    <DrawerPrimitive.Popup
      className={cn(
        "set-logger-sheet-popup mx-auto w-full max-w-2xl outline-none",
        "rounded-t-2xl border border-border/70 border-b-0 bg-card",
        "shadow-[0_-4px_24px_-4px_oklch(0_0_0/50%)]",
        "data-[swipe-direction=down]:translate-y-[calc(var(--drawer-snap-point-offset)+var(--drawer-swipe-movement-y))]",
        "transition-transform duration-300 ease-out will-change-transform",
        "data-[swiping]:transition-none",
        className,
      )}
      {...props}
    />
  );
}

function DrawerContent({
  className,
  ...props
}: DrawerPrimitive.Content.Props) {
  return (
    <DrawerPrimitive.Content
      className={cn("flex max-h-[inherit] flex-col overflow-hidden", className)}
      {...props}
    />
  );
}

export { DrawerRoot, DrawerPortal, DrawerViewport, DrawerPopup, DrawerContent };

export type DrawerSnapPoint = DrawerPrimitive.Root.SnapPoint;
