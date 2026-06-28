"use client";

import { ChevronDown, Minus, Plus } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { formatWeight } from "@/lib/format-weight";

type LastSet = {
  weight: number;
  reps: number;
};

type RecordSetResult =
  | { success: true }
  | { success: false; error: string };

type SetLoggerFormProps = {
  workoutId: string;
  sessionId: string;
  nextSetNumber: number;
  lastSet: LastSet | null;
  onRecordSet: (weight: string, reps: string) => Promise<RecordSetResult>;
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

export function SetLoggerForm({
  workoutId,
  sessionId,
  nextSetNumber,
  lastSet,
  onRecordSet,
  isSubmitting,
}: SetLoggerFormProps) {
  const [weight, setWeight] = useState(() =>
    lastSet ? formatWeight(lastSet.weight) : "",
  );
  const [reps, setReps] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isCollapsed, setIsCollapsed] = useState(false);

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
    setSuccessMessage(null);

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

    setSuccessMessage(
      `Série ${nextSetNumber} registrada — ${submittedWeight} kg × ${submittedReps} reps`,
    );
    setReps("");
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
            isCollapsed ? "Expandir formulário de série" : "Recolher formulário de série"
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
          <CardTitle>Série {nextSetNumber}</CardTitle>
          {lastSet && !isCollapsed ? (
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
          <p className="text-muted-foreground text-xs">
            Última:{" "}
            <span className="font-semibold text-primary">
              {formatWeight(lastSet.weight)} kg × {lastSet.reps}
            </span>
          </p>
        ) : null}
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
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
                className={cn("min-h-5", !error && !successMessage && "sr-only")}
              >
                {error ? (
                  <p className="text-sm text-destructive" role="alert">
                    {error}
                  </p>
                ) : null}
                {successMessage ? (
                  <p className="text-sm font-medium text-primary">{successMessage}</p>
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
        </div>
      </div>
    </Card>
  );
}
