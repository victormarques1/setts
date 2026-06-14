"use client";

import Link from "next/link";
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
import { createExerciseAction } from "@/modules/exercises/actions/exercise.actions";

type CreateExerciseFormProps = {
  workoutId: string;
};

export function CreateExerciseForm({ workoutId }: CreateExerciseFormProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    const name = formData.get("name");

    if (typeof name !== "string") {
      setError("Nome é obrigatório.");
      return;
    }

    setError(null);

    startTransition(async () => {
      const result = await createExerciseAction(workoutId, { name });

      if (!result.success) {
        setError(result.error);
        return;
      }

      router.push(`/workouts/${workoutId}`);
      router.refresh();
    });
  }

  return (
    <Card className="w-full max-w-lg">
      <CardHeader>
        <CardTitle>Novo exercício</CardTitle>
        <CardDescription>
          Adicione um exercício ao treino, como Supino Reto ou Agachamento.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="name">Nome</Label>
            <Input
              id="name"
              name="name"
              placeholder="Ex.: Supino Reto"
              maxLength={100}
              required
              disabled={isPending}
              aria-invalid={error ? true : undefined}
            />
            {error ? (
              <p className="text-sm text-destructive" role="alert">
                {error}
              </p>
            ) : null}
          </div>
          <div className="flex gap-2">
            <Button type="submit" disabled={isPending}>
              {isPending ? "Salvando..." : "Criar exercício"}
            </Button>
            <Button
              variant="outline"
              render={<Link href={`/workouts/${workoutId}`} />}
              nativeButton={false}
            >
              Cancelar
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
