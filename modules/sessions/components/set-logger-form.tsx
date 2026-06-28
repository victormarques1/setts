"use client";

import { Minus, Plus } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  DrawerContent,
  DrawerPopup,
  DrawerPortal,
  DrawerRoot,
  DrawerViewport,
  type DrawerSnapPoint,
} from "@/components/ui/drawer";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { formatWeight } from "@/lib/format-weight";

const COLLAPSED_SNAP = "88px";
const EXPANDED_SNAP = 0.58;
const SNAP_POINTS: DrawerSnapPoint[] = [COLLAPSED_SNAP, EXPANDED_SNAP];

type LastSet = {
  weight: number;
  reps: number;
};

type RecordSetResult =
  | { success: true; recordId: string }
  | { success: false; error: string };

type SetLoggerFormProps = {
  workoutId: string;
  sessionId: string;
  nextSetNumber: number;
  lastSet: LastSet | null;
  onRecordSet: (weight: string, reps: string) => Promise<RecordSetResult>;
  onRecordSuccess?: (recordId: string) => void;
  onSheetHeightChange?: (height: number) => void;
  isSubmitting: boolean;
};

function resolveSheetHeight(snapPoint: DrawerSnapPoint | null): number {
  if (!snapPoint || snapPoint === COLLAPSED_SNAP) {
    return 88;
  }

  if (typeof snapPoint === "number") {
    if (snapPoint <= 1) {
      return Math.round(window.innerHeight * snapPoint);
    }

    return snapPoint;
  }

  if (typeof snapPoint === "string" && snapPoint.endsWith("px")) {
    return Number.parseFloat(snapPoint);
  }

  return Math.round(window.innerHeight * EXPANDED_SNAP);
}

function isCollapsedSnap(snapPoint: DrawerSnapPoint | null): boolean {
  return snapPoint === COLLAPSED_SNAP;
}

function StepperField({
  id,
  label,
  value,
  onStep,
  disabled,
  hasError,
}: {
  id: string;
  label: string;
  value: string;
  onStep: (delta: number) => void;
  disabled: boolean;
  hasError: boolean;
}) {
  const displayValue = value || "—";

  return (
    <div className="flex flex-col gap-2">
      <Label id={`${id}-label`}>{label}</Label>
      <div
        className="flex items-center justify-center gap-1"
        role="group"
        aria-labelledby={`${id}-label`}
      >
        <Button
          type="button"
          variant="outline"
          className="size-12 min-h-12 min-w-12 shrink-0 rounded-full"
          onClick={() => onStep(-1)}
          disabled={disabled}
          aria-label={`Diminuir ${label.toLowerCase()}`}
        >
          <Minus className="size-5" aria-hidden="true" />
        </Button>
        <span
          id={id}
          aria-live="polite"
          aria-invalid={hasError ? true : undefined}
          className={cn(
            "min-w-[5.5rem] px-2 text-center text-4xl font-bold tabular-nums tracking-tight",
            value ? "text-foreground" : "text-muted-foreground",
          )}
        >
          {displayValue}
        </span>
        <Button
          type="button"
          variant="outline"
          className="size-12 min-h-12 min-w-12 shrink-0 rounded-full"
          onClick={() => onStep(1)}
          disabled={disabled}
          aria-label={`Aumentar ${label.toLowerCase()}`}
        >
          <Plus className="size-5" aria-hidden="true" />
        </Button>
      </div>
    </div>
  );
}

function CollapsedSummary({ lastSet }: { lastSet: LastSet | null }) {
  if (!lastSet) {
    return (
      <span className="text-base font-bold tracking-tight">
        Registrar primeira série
      </span>
    );
  }

  return (
    <div className="flex min-w-0 flex-col gap-0.5">
      <span className="text-base font-bold tracking-tight">Registrar Série</span>
      <span className="text-muted-foreground truncate text-xs">
        Última registrada:{" "}
        <span className="font-semibold text-primary">
          {formatWeight(lastSet.weight)}kg × {lastSet.reps} reps
        </span>
      </span>
    </div>
  );
}

function SheetDragHandle() {
  return (
    <div
      className="flex shrink-0 justify-center pt-2.5 pb-1"
      aria-hidden="true"
    >
      <div className="bg-muted-foreground/35 h-1 w-10 rounded-full" />
    </div>
  );
}

export function SetLoggerForm({
  workoutId,
  sessionId,
  nextSetNumber,
  lastSet,
  onRecordSet,
  onRecordSuccess,
  onSheetHeightChange,
  isSubmitting,
}: SetLoggerFormProps) {
  const [snapPoint, setSnapPoint] = useState<DrawerSnapPoint>(EXPANDED_SNAP);
  const [weight, setWeight] = useState(() =>
    lastSet ? formatWeight(lastSet.weight) : "",
  );
  const [reps, setReps] = useState("");
  const [error, setError] = useState<string | null>(null);

  const isExpanded = !isCollapsedSnap(snapPoint);

  const notifyHeightChange = useCallback(
    (nextSnapPoint: DrawerSnapPoint | null) => {
      onSheetHeightChange?.(resolveSheetHeight(nextSnapPoint));
    },
    [onSheetHeightChange],
  );

  useEffect(() => {
    notifyHeightChange(snapPoint);

    function handleResize() {
      notifyHeightChange(snapPoint);
    }

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [notifyHeightChange, snapPoint]);

  function collapseSheet() {
    setSnapPoint(COLLAPSED_SNAP);
    notifyHeightChange(COLLAPSED_SNAP);
  }

  function expandSheet() {
    setSnapPoint(EXPANDED_SNAP);
    notifyHeightChange(EXPANDED_SNAP);
  }

  function handleSnapPointChange(nextSnapPoint: DrawerSnapPoint | null) {
    if (!nextSnapPoint) {
      return;
    }

    setSnapPoint(nextSnapPoint);
    notifyHeightChange(nextSnapPoint);
  }

  function adjustWeight(delta: number) {
    setWeight((current) => {
      const parsed = Number.parseFloat(current);
      const base = Number.isNaN(parsed) ? 0 : parsed;
      return formatWeight(Math.max(0, base + delta * 2.5));
    });
  }

  function adjustReps(delta: number) {
    setReps((current) => {
      const parsed = Number.parseInt(current, 10);
      const base = Number.isNaN(parsed) ? 0 : parsed;
      return String(Math.max(1, base + delta));
    });
  }

  function handleRepeatLast() {
    if (!lastSet) {
      return;
    }

    setWeight(formatWeight(lastSet.weight));
    setReps(String(lastSet.reps));
    setError(null);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!weight || !reps) {
      setError("Peso e repetições são obrigatórios.");
      return;
    }

    setError(null);

    const submittedWeight = weight;
    const submittedReps = reps;
    const result = await onRecordSet(submittedWeight, submittedReps);

    if (!result.success) {
      setError(result.error);
      return;
    }

    if (typeof navigator !== "undefined" && "vibrate" in navigator) {
      navigator.vibrate(10);
    }

    collapseSheet();
    onRecordSuccess?.(result.recordId);
    setReps("");
  }

  return (
    <DrawerRoot
      defaultOpen
      modal={false}
      disablePointerDismissal
      snapPoints={SNAP_POINTS}
      snapPoint={snapPoint}
      onSnapPointChange={handleSnapPointChange}
      snapToSequentialPoints
      swipeDirection="down"
      onOpenChange={(open, eventDetails) => {
        if (!open) {
          eventDetails.cancel();
          collapseSheet();
        }
      }}
    >
      <DrawerPortal>
        <DrawerViewport>
          <DrawerPopup initialFocus={false}>
            <DrawerContent>
              <button
                type="button"
                className="flex w-full shrink-0 flex-col px-4 text-left outline-none focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:ring-inset sm:px-5"
                aria-expanded={isExpanded}
                aria-label={
                  isExpanded
                    ? "Recolher formulário de série"
                    : "Expandir formulário de série"
                }
                onClick={() => {
                  if (isExpanded) {
                    collapseSheet();
                    return;
                  }

                  expandSheet();
                }}
                disabled={isSubmitting}
              >
                <SheetDragHandle />
                <div className="min-h-11 pb-2">
                  {isExpanded ? (
                    <span className="text-base font-bold tracking-tight">
                      Registrar nova série
                    </span>
                  ) : (
                    <CollapsedSummary lastSet={lastSet} />
                  )}
                </div>
              </button>

              <div
                className={cn(
                  "flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-contain px-4 pb-5 sm:px-5",
                  !isExpanded && "pointer-events-none opacity-0",
                )}
                aria-hidden={!isExpanded}
              >
                <form
                  onSubmit={handleSubmit}
                  className="flex flex-col gap-4"
                  data-base-ui-swipe-ignore
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-base font-bold tracking-tight">
                      Série {nextSetNumber}
                    </p>
                    {lastSet ? (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleRepeatLast}
                        disabled={isSubmitting}
                      >
                        Repetir última
                      </Button>
                    ) : null}
                  </div>

                  {lastSet ? (
                    <p className="text-muted-foreground -mt-2 text-xs">
                      Última:{" "}
                      <span className="font-semibold text-primary">
                        {formatWeight(lastSet.weight)} kg × {lastSet.reps}
                      </span>
                    </p>
                  ) : null}

                  <div className="grid grid-cols-1 gap-4 min-[400px]:grid-cols-2">
                    <StepperField
                      id="weight"
                      label="Peso (kg)"
                      value={weight}
                      onStep={adjustWeight}
                      disabled={isSubmitting}
                      hasError={error !== null}
                    />
                    <StepperField
                      id="reps"
                      label="Repetições"
                      value={reps}
                      onStep={adjustReps}
                      disabled={isSubmitting}
                      hasError={error !== null}
                    />
                  </div>

                  <div
                    aria-live="polite"
                    className={cn("min-h-5", !error && "sr-only")}
                  >
                    {error ? (
                      <p className="text-sm text-destructive" role="alert">
                        {error}
                      </p>
                    ) : null}
                  </div>

                  <Button
                    className="w-full"
                    size="lg"
                    type="submit"
                    disabled={isSubmitting}
                    aria-busy={isSubmitting}
                  >
                    {isSubmitting ? "Salvando..." : "Registrar série"}
                  </Button>

                  <Button
                    className="w-full"
                    size="lg"
                    variant="outline"
                    render={
                      <Link
                        href={`/workouts/${workoutId}/sessions/${sessionId}`}
                      />
                    }
                    nativeButton={false}
                    disabled={isSubmitting}
                  >
                    Finalizar exercício
                  </Button>
                </form>
              </div>
            </DrawerContent>
          </DrawerPopup>
        </DrawerViewport>
      </DrawerPortal>
    </DrawerRoot>
  );
}
