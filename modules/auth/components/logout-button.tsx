"use client";

import { useTransition } from "react";

import { Button } from "@/components/ui/button";
import { logoutAction } from "@/modules/auth/actions/logout.action";

export function LogoutButton() {
  const [isPending, startTransition] = useTransition();

  function handleLogout() {
    startTransition(async () => {
      await logoutAction();
    });
  }

  return (
    <Button
      type="button"
      variant="ghost"
      className="touch-target"
      onClick={handleLogout}
      disabled={isPending}
      aria-busy={isPending}
    >
      {isPending ? "Saindo..." : "Sair"}
    </Button>
  );
}
