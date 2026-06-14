import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { ExerciseSummary } from "@/modules/exercises/services/exercise.service";

type ExerciseListProps = {
  workoutId: string;
  exercises: ExerciseSummary[];
};

function formatWeight(weight: number) {
  return Number.isInteger(weight) ? String(weight) : weight.toFixed(1);
}

function formatLastLoad(lastLoad: ExerciseSummary["lastLoad"]) {
  if (!lastLoad) {
    return "sem registro";
  }

  return `${formatWeight(lastLoad.weight)} kg × ${lastLoad.reps} reps`;
}

export function ExerciseList({ workoutId, exercises }: ExerciseListProps) {
  if (exercises.length === 0) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Nenhum exercício cadastrado</CardTitle>
          <CardDescription>
            Adicione exercícios a este treino para registrar séries e cargas.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            render={<Link href={`/workouts/${workoutId}/exercises/new`} />}
            nativeButton={false}
          >
            Criar exercício
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <ul className="flex w-full flex-col gap-3">
      {exercises.map((exercise) => (
        <li key={exercise.id}>
          <Card className="min-h-11 py-4">
            <CardContent className="flex min-h-11 flex-col justify-center gap-1 py-0">
              <span className="min-w-0 truncate font-medium" title={exercise.name}>
                {exercise.name}
              </span>
              <span className="text-muted-foreground text-sm">
                Última carga: {formatLastLoad(exercise.lastLoad)}
              </span>
            </CardContent>
          </Card>
        </li>
      ))}
    </ul>
  );
}
