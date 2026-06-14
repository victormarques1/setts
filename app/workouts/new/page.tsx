import Link from "next/link";

import { Button } from "@/components/ui/button";
import { CreateWorkoutForm } from "@/modules/workouts/components/create-workout-form";

export default function NewWorkoutPage() {
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-8 px-6 py-12">
      <div className="flex flex-col gap-4">
        <Button
          variant="ghost"
          className="w-fit px-0 hover:bg-transparent"
          render={<Link href="/workouts" />}
          nativeButton={false}
        >
          ← Voltar
        </Button>
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-semibold tracking-tight">Criar treino</h1>
          <p className="text-muted-foreground">
            Cada treino pertence a você e pode conter vários exercícios.
          </p>
        </div>
      </div>
      <CreateWorkoutForm />
    </div>
  );
}
