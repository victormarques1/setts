"use client";

import { Minus, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
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

function formatWeight(value: number) {
  return Number.isInteger(value) ? String(value) : value.toFixed(1);
}

function StepperField({
  id,
  label,
  value,
  onChange,
  onStep,
  inputMode,
  step,
  min,
  disabled,
  hasError,
  autoFocus,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  onStep: (delta: number) => void;
  inputMode: "decimal" | "numeric";
  step: string;
  min: string;
  disabled: boolean;
  hasError: boolean;
  autoFocus?: boolean;
}) {
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={id}>{label}</Label>
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="shrink-0"
          onClick={() => onStep(-1)}
          disabled={disabled}
          aria-label={`Diminuir ${label.toLowerCase()}`}
        >
          <Minus className="size-4" />
        </Button>
        <Input
          id={id}
          name={id}
          type="number"
          inputMode={inputMode}
          step={step}
          min={min}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="0"
          required
          disabled={disabled}
          autoFocus={autoFocus}
          aria-invalid={hasError ? true : undefined}
          className="text-center"
        />
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="shrink-0"
          onClick={() => onStep(1)}
          disabled={disabled}
          aria-label={`Aumentar ${label.toLowerCase()}`}
        >
          <Plus className="size-4" />
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
    <Card className="w-full shadow-lg">
      <CardHeader className="gap-2 pb-3">
        <div className="flex items-center justify-between gap-3">
          <CardTitle className="text-base">Série {nextSetNumber}</CardTitle>
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
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="grid grid-cols-1 gap-4 min-[400px]:grid-cols-2">
            <StepperField
              id="weight"
              label="Peso (kg)"
              value={weight}
              onChange={setWeight}
              onStep={adjustWeight}
              inputMode="decimal"
              step="0.5"
              min="0"
              disabled={isPending}
              hasError={error !== null}
              autoFocus
            />
            <StepperField
              id="reps"
              label="Repetições"
              value={reps}
              onChange={setReps}
              onStep={adjustReps}
              inputMode="numeric"
              step="1"
              min="1"
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
              <p className="text-sm text-primary">{successMessage}</p>
            ) : null}
          </div>

          <Button className="w-full" type="submit" disabled={isPending}>
            {isPending ? "Salvando..." : "Registrar série"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
