"use client";

import { ChevronDown, ClipboardPen, Timer } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { RegisterSetPanel } from "@/modules/sessions/components/register-set-panel";
import { RestTimerPanel } from "@/modules/sessions/components/rest-timer-panel";

type TrainingPanelMode = "register" | "rest";

type LastSet = {
  weight: number;
  reps: number;
};

type RecordSetResult =
  | { success: true }
  | { success: false; error: string };

type TrainingPanelProps = {
  workoutId: string;
  sessionId: string;
  nextSetNumber: number;
  lastSet: LastSet | null;
  onRecordSet: (weight: string, reps: string) => Promise<RecordSetResult>;
  isSubmitting: boolean;
};

export function TrainingPanel({
  workoutId,
  sessionId,
  nextSetNumber,
  lastSet,
  onRecordSet,
  isSubmitting,
}: TrainingPanelProps) {
  const [mode, setMode] = useState<TrainingPanelMode>("register");
  const [isCollapsed, setIsCollapsed] = useState(false);
  const registerPanelRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState<number>(0);

  const isRegisterMode = mode === "register";

  useEffect(() => {
    const panel = registerPanelRef.current;

    if (!panel || isCollapsed) {
      return;
    }

    const updateHeight = () => {
      setContentHeight(panel.offsetHeight);
    };

    updateHeight();

    const resizeObserver = new ResizeObserver(updateHeight);
    resizeObserver.observe(panel);

    return () => {
      resizeObserver.disconnect();
    };
  }, [isCollapsed, nextSetNumber, lastSet]);

  function handleToggleMode() {
    setMode((current) => (current === "register" ? "rest" : "register"));
  }

  return (
    <Card className="w-full gap-0 border-primary/15 py-0 shadow-[0_-4px_24px_-4px_oklch(0_0_0/50%)]">
      <div className="flex justify-center pt-2">
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          className="text-muted-foreground hover:text-foreground size-9 min-h-9 min-w-9 rounded-full"
          aria-expanded={!isCollapsed}
          aria-label={
            isCollapsed
              ? "Expandir painel de treino"
              : "Recolher painel de treino"
          }
          onClick={() => setIsCollapsed((current) => !current)}
          disabled={isSubmitting}
        >
          <ChevronDown
            className={cn(
              "size-5 transition-transform duration-200",
              isCollapsed && "rotate-180",
            )}
            aria-hidden="true"
          />
        </Button>
      </div>

      <CardHeader className="gap-2 pt-0 pb-2">
        <div className="flex items-center justify-between gap-3">
          <CardTitle className="flex items-center gap-2">
            {isRegisterMode ? (
              <>Série {nextSetNumber}</>
            ) : (
              <>
                <span aria-hidden="true">⏱</span>
                <span>Descanso</span>
              </>
            )}
          </CardTitle>

          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className="text-muted-foreground hover:text-foreground size-9 min-h-9 min-w-9 shrink-0 rounded-full transition-transform active:scale-95"
            onClick={handleToggleMode}
            disabled={isSubmitting}
            aria-pressed={!isRegisterMode}
            aria-label={
              isRegisterMode
                ? "Alternar para cronômetro de descanso"
                : "Alternar para registro de série"
            }
          >
            {isRegisterMode ? (
              <Timer className="size-5" aria-hidden="true" />
            ) : (
              <ClipboardPen className="size-5" aria-hidden="true" />
            )}
          </Button>
        </div>
      </CardHeader>

      <div
        className={cn(
          "grid transition-[grid-template-rows] duration-200 ease-out",
          isCollapsed ? "grid-rows-[0fr]" : "grid-rows-[1fr]",
        )}
        aria-hidden={isCollapsed}
      >
        <div className="min-h-0 overflow-hidden">
          <CardContent className="pt-0">
            <div
              className="relative"
              style={contentHeight > 0 ? { minHeight: contentHeight } : undefined}
            >
              <div
                ref={registerPanelRef}
                className={cn(
                  "transition-[opacity,transform] duration-200 ease-out",
                  isRegisterMode
                    ? "relative opacity-100 translate-x-0"
                    : "pointer-events-none absolute inset-x-0 top-0 opacity-0 -translate-x-2",
                )}
                aria-hidden={!isRegisterMode}
              >
                <RegisterSetPanel
                  workoutId={workoutId}
                  sessionId={sessionId}
                  nextSetNumber={nextSetNumber}
                  lastSet={lastSet}
                  onRecordSet={onRecordSet}
                  isSubmitting={isSubmitting}
                />
              </div>

              <div
                className={cn(
                  "transition-[opacity,transform] duration-200 ease-out",
                  !isRegisterMode
                    ? "relative opacity-100 translate-x-0"
                    : "pointer-events-none absolute inset-x-0 top-0 opacity-0 translate-x-2",
                )}
                aria-hidden={isRegisterMode}
              >
                <RestTimerPanel sessionId={sessionId} />
              </div>
            </div>
          </CardContent>
        </div>
      </div>
    </Card>
  );
}
