"use client";

import { Pause, Play, RotateCcw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useRestTimer } from "@/modules/sessions/hooks/use-rest-timer";

type RestTimerPanelProps = {
  sessionId: string;
};

export function RestTimerPanel({ sessionId }: RestTimerPanelProps) {
  const {
    formattedTime,
    hasTime,
    isRunning,
    start,
    pause,
    reset,
  } = useRestTimer(sessionId);

  return (
    <div className="flex h-full flex-col justify-center gap-4 py-1">
      <div className="flex flex-col items-center gap-1.5">
        <span
          aria-live="polite"
          aria-atomic="true"
          aria-label={`Tempo de descanso: ${formattedTime}`}
          className={cn(
            "text-4xl font-bold tabular-nums tracking-tight transition-colors duration-300",
            isRunning ? "text-primary" : "text-foreground",
          )}
        >
          {formattedTime}
        </span>

        {isRunning ? (
          <p className="text-primary text-xs">Em andamento</p>
        ) : hasTime ? (
          <p className="text-muted-foreground text-xs">Pausado</p>
        ) : (
          <p className="text-muted-foreground text-xs" aria-hidden="true">
            &nbsp;
          </p>
        )}
      </div>

      <div className="flex justify-center gap-2">
        {isRunning ? (
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="min-h-10 min-w-22 transition-transform active:scale-95"
            onClick={pause}
            aria-label="Pausar cronômetro de descanso"
          >
            <Pause className="size-4" aria-hidden="true" />
            Pausar
          </Button>
        ) : (
          <Button
            type="button"
            variant="default"
            size="sm"
            className="min-h-10 min-w-22 transition-transform active:scale-95"
            onClick={start}
            aria-label="Iniciar cronômetro de descanso"
          >
            <Play className="size-4" aria-hidden="true" />
            Iniciar
          </Button>
        )}

        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="text-muted-foreground hover:text-foreground min-h-10 min-w-22 transition-transform active:scale-95"
          onClick={reset}
          aria-label="Zerar cronômetro de descanso"
          disabled={!hasTime && !isRunning}
        >
          <RotateCcw className="size-4" aria-hidden="true" />
          Zerar
        </Button>
      </div>
    </div>
  );
}
