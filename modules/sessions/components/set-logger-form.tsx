"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { recordSetAction } from "@/modules/sessions/actions/session.actions";

type SetLoggerFormProps = {
  workoutId: string;
  sessionId: string;
  exerciseId: string;
  nextSetNumber: number;
};

export function SetLoggerForm({
  workoutId,
  sessionId,
  exerciseId,
  nextSetNumber,
}: SetLoggerFormProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    const weight = formData.get("weight");
    const reps = formData.get("reps");

    if (typeof weight !== "string" || typeof reps !== "string") {
      setError("Peso e repetições são obrigatórios.");
      return;
    }

    setError(null);

    startTransition(async () => {
      const result = await recordSetAction(workoutId, sessionId, exerciseId, {
        weight,
        reps,
      });

      if (!result.success) {
        setError(result.error);
        return;
      }

      router.refresh();
    });
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Registrar série {nextSetNumber}</CardTitle>
        <CardDescription>
          Informe o peso utilizado e quantas repetições foram executadas.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={handleSubmit} className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="weight">Peso (kg)</Label>
              <Input
                id="weight"
                name="weight"
                type="number"
                inputMode="decimal"
                step="0.5"
                min="0"
                placeholder="0"
                required
                disabled={isPending}
                aria-invalid={error ? true : undefined}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="reps">Repetições</Label>
              <Input
                id="reps"
                name="reps"
                type="number"
                inputMode="numeric"
                step="1"
                min="1"
                placeholder="0"
                required
                disabled={isPending}
                aria-invalid={error ? true : undefined}
              />
            </div>
          </div>
          {error ? (
            <p className="text-sm text-destructive" role="alert">
              {error}
            </p>
          ) : null}
          <Button className="w-full" type="submit" disabled={isPending}>
            {isPending ? "Salvando..." : "Registrar série"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
