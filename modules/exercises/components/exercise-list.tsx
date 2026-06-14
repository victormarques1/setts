import Link from "next/link";

import type { Exercise } from "@/app/generated/prisma/client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type ExerciseListProps = {
  workoutId: string;
  exercises: Exercise[];
};

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
            <CardContent className="flex min-h-11 items-center px-4 py-0 sm:px-6">
              <span className="min-w-0 truncate font-medium">{exercise.name}</span>
            </CardContent>
          </Card>
        </li>
      ))}
    </ul>
  );
}
