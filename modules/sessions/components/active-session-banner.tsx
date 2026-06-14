"use client";

import Link from "next/link";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { CancelSessionDialog } from "@/modules/sessions/components/cancel-session-dialog";

type ActiveSessionBannerProps = {
  workoutId: string;
  sessionId: string;
};

export function ActiveSessionBanner({
  workoutId,
  sessionId,
}: ActiveSessionBannerProps) {
  const [isCancelOpen, setIsCancelOpen] = useState(false);

  return (
    <>
      <div className="list-card flex w-full flex-col gap-3 px-4 py-3.5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-0.5">
          <p className="font-semibold tracking-tight">Treino em andamento</p>
          <p className="text-muted-foreground text-sm">
            Você tem uma sessão aberta neste treino.
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:shrink-0">
          <Button
            className="w-full sm:w-auto"
            render={
              <Link href={`/workouts/${workoutId}/sessions/${sessionId}`} />
            }
            nativeButton={false}
          >
            Continuar treino
          </Button>
          <Button
            type="button"
            className="w-full sm:w-auto"
            variant="outline"
            onClick={() => setIsCancelOpen(true)}
          >
            Cancelar sessão
          </Button>
        </div>
      </div>
      {isCancelOpen ? (
        <CancelSessionDialog
          workoutId={workoutId}
          sessionId={sessionId}
          onClose={() => setIsCancelOpen(false)}
        />
      ) : null}
    </>
  );
}
