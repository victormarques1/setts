"use client";

import { ChevronDown, ChevronRight, Minus, Plus } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Collapsible,
  CollapsiblePanel,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { formatWeight } from "@/lib/format-weight";

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
  onOpenChange?: (open: boolean) => void;
  isSubmitting: boolean;
};

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

export function SetLoggerForm({
  workoutId,
  sessionId,
  nextSetNumber,
  lastSet,
  onRecordSet,
  onRecordSuccess,
  onOpenChange,
  isSubmitting,
}: SetLoggerFormProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [weight, setWeight] = useState(() =>
    lastSet ? formatWeight(lastSet.weight) : "",
  );
  const [reps, setReps] = useState("");
  const [error, setError] = useState<string | null>(null);

  function handleOpenChange(open: boolean) {
    setIsOpen(open);
    onOpenChange?.(open);
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

    handleOpenChange(false);
    onRecordSuccess?.(result.recordId);
    setReps("");
  }

  return (
    <Card className="w-full gap-0 border-primary/15 py-0 shadow-[0_-4px_24px_-4px_oklch(0_0_0/50%)]">
      <Collapsible open={isOpen} onOpenChange={handleOpenChange}>
        <div className="px-4 pt-4 sm:px-5">
          <CollapsibleTrigger
            aria-expanded={isOpen}
            disabled={isSubmitting}
            className="gap-3 py-1"
          >
            <div className="min-w-0 flex-1">
              {isOpen ? (
                <span className="text-base font-bold tracking-tight">
                  Registrar nova série
                </span>
              ) : (
                <CollapsedSummary lastSet={lastSet} />
              )}
            </div>
            {isOpen ? (
              <ChevronDown
                className="text-muted-foreground size-5 shrink-0"
                aria-hidden="true"
              />
            ) : (
              <ChevronRight
                className="text-muted-foreground size-5 shrink-0"
                aria-hidden="true"
              />
            )}
          </CollapsibleTrigger>
        </div>

        <CollapsiblePanel>
          <CardContent className="pt-3 pb-5">
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
                  <Link href={`/workouts/${workoutId}/sessions/${sessionId}`} />
                }
                nativeButton={false}
                disabled={isSubmitting}
              >
                Finalizar exercício
              </Button>
            </form>
          </CardContent>
        </CollapsiblePanel>
      </Collapsible>
    </Card>
  );
}
