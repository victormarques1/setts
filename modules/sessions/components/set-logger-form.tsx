"use client";

import { Minus, Plus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

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
import { recordSetAction } from "@/modules/sessions/actions/session.actions";

type LastSet = {
  weight: number;
  reps: number;
};

type SetLoggerFormProps = {
  workoutId: string;
  sessionId: string;
  exerciseId: string;
  nextSetNumber: number;
  lastSet: LastSet | null;
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
  exerciseId,
  nextSetNumber,
  lastSet,
}: SetLoggerFormProps) {
  const router = useRouter();
  const [weight, setWeight] = useState(() =>
    lastSet ? formatWeight(lastSet.weight) : "",
  );
  const [reps, setReps] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

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

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!weight || !reps) {
      setError("Peso e repetições são obrigatórios.");
      return;
    }

    setError(null);
    setSuccessMessage(null);

    startTransition(async () => {
      const result = await recordSetAction(workoutId, sessionId, exerciseId, {
        weight,
        reps,
      });

      if (!result.success) {
        setError(result.error);
        return;
      }

      setSuccessMessage(`Série ${nextSetNumber} registrada — ${weight} kg × ${reps} reps`);
      setReps("");
      router.refresh();
    });
  }

  return (
    <Card className="w-full border-primary/15 shadow-[0_-4px_24px_-4px_oklch(0_0_0/50%)]">
      <CardHeader className="gap-2 pb-2">
        <div className="flex items-center justify-between gap-3">
          <CardTitle>Série {nextSetNumber}</CardTitle>
          {lastSet ? (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleRepeatLast}
              disabled={isPending}
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
      <CardContent>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="grid grid-cols-1 gap-4 min-[400px]:grid-cols-2">
            <StepperField
              id="weight"
              label="Peso (kg)"
              value={weight}
              onStep={adjustWeight}
              disabled={isPending}
              hasError={error !== null}
            />
            <StepperField
              id="reps"
              label="Repetições"
              value={reps}
              onStep={adjustReps}
              disabled={isPending}
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

          <Button className="w-full" size="lg" type="submit" disabled={isPending} aria-busy={isPending}>
            {isPending ? "Salvando..." : "Registrar série"}
          </Button>

          <Button
            className="w-full"
            size="lg"
            variant="outline"
            render={
              <Link href={`/workouts/${workoutId}/sessions/${sessionId}`} />
            }
            nativeButton={false}
            disabled={isPending}
          >
            Finalizar exercício
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
