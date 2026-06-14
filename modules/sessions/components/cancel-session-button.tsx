"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { CancelSessionDialog } from "@/modules/sessions/components/cancel-session-dialog";

type CancelSessionButtonProps = {
  workoutId: string;
  sessionId: string;
};

export function CancelSessionButton({
  workoutId,
  sessionId,
}: CancelSessionButtonProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        className="inline-flex min-h-12 min-w-12 shrink-0 items-center justify-center px-3 text-sm font-medium text-gray-300 transition-colors hover:text-gray-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
        onClick={() => setIsOpen(true)}
      >
        Cancelar
      </button>
      {isOpen ? (
        <CancelSessionDialog
          workoutId={workoutId}
          sessionId={sessionId}
          onClose={() => setIsOpen(false)}
          onSuccess={() => {
            router.push(`/workouts/${workoutId}`);
            router.refresh();
          }}
        />
      ) : null}
    </>
  );
}
