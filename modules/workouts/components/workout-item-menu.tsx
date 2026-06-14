"use client";

import { Menu } from "@base-ui/react/menu";
import { MoreVertical, Pencil, Trash2 } from "lucide-react";

import { cn } from "@/lib/utils";

type WorkoutItemMenuProps = {
  workoutName: string;
  onEdit: () => void;
  onDelete: () => void;
};

export function WorkoutItemMenu({
  workoutName,
  onEdit,
  onDelete,
}: WorkoutItemMenuProps) {
  return (
    <Menu.Root>
      <Menu.Trigger
        className={cn(
          "absolute top-1/2 right-1 z-10 -translate-y-1/2",
          "inline-flex min-h-12 min-w-12 items-center justify-center rounded-xl",
          "text-muted-foreground transition-colors hover:text-foreground",
          "focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
        )}
        aria-label={`Ações de ${workoutName}`}
      >
        <MoreVertical className="size-5" aria-hidden="true" />
      </Menu.Trigger>
      <Menu.Portal>
        <Menu.Positioner side="bottom" align="end" sideOffset={4}>
          <Menu.Popup
            className={cn(
              "z-50 min-w-40 rounded-xl border border-border/70 bg-card p-1",
              "shadow-[0_8px_32px_-8px_oklch(0_0_0/55%)] outline-none",
              "transition-[opacity,transform] duration-150",
              "data-starting-style:scale-95 data-starting-style:opacity-0",
              "data-ending-style:scale-95 data-ending-style:opacity-0",
            )}
          >
            <Menu.Item
              className={cn(
                "flex cursor-default items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium",
                "outline-none data-highlighted:bg-muted/80",
              )}
              onClick={onEdit}
            >
              <Pencil className="size-4 shrink-0" aria-hidden="true" />
              Editar
            </Menu.Item>
            <Menu.Item
              className={cn(
                "flex cursor-default items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-destructive",
                "outline-none data-highlighted:bg-destructive/12",
              )}
              onClick={onDelete}
            >
              <Trash2 className="size-4 shrink-0" aria-hidden="true" />
              Excluir
            </Menu.Item>
          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>
  );
}
