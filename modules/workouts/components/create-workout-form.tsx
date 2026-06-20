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
import { createWorkoutAction } from "@/modules/workouts/actions/workout.actions";

export function CreateWorkoutForm() {
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
      const result = await createWorkoutAction({ name });

      if (!result.success) {
        setError(result.error);
        return;
      }

      router.push(`/workouts/${result.data.id}`);
      router.refresh();
    });
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Novo treino</CardTitle>
        <CardDescription>
          Dê um nome ao treino, como Treino A, Treino B ou Treino Superior.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="name">Nome</Label>
            <Input
              id="name"
              name="name"
              placeholder="Ex.: Treino A"
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
          <div className="flex flex-col gap-2 sm:flex-row">
            <Button className="w-full sm:w-auto" type="submit" disabled={isPending}>
              {isPending ? "Salvando..." : "Criar treino"}
            </Button>
            <Button
              className="w-full sm:w-auto"
              variant="outline"
              render={<Link href="/workouts" />}
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
