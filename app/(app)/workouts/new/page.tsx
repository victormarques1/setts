import Link from "next/link";

import { Button } from "@/components/ui/button";
import { CreateWorkoutForm } from "@/modules/workouts/components/create-workout-form";

export default function NewWorkoutPage() {
  return (
    <div className="page-shell">
      <div className="flex flex-col gap-4">
        <Button
          variant="ghost"
          className="back-link"
          render={<Link href="/workouts" />}
          nativeButton={false}
        >
          ← Voltar
        </Button>
        <div className="flex flex-col gap-1">
          <h1 className="page-title">Criar treino</h1>
          <p className="page-subtitle">
            Cada treino pertence a você e pode conter vários exercícios.
          </p>
        </div>
      </div>
      <CreateWorkoutForm />
    </div>
  );
}
