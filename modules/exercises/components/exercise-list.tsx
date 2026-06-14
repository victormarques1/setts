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
      <Card className="w-full max-w-lg">
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
    <ul className="flex w-full max-w-lg flex-col gap-3">
      {exercises.map((exercise) => (
        <li key={exercise.id}>
          <Card className="py-4">
            <CardContent className="flex items-center justify-between gap-4 px-6 py-0">
              <span className="font-medium">{exercise.name}</span>
            </CardContent>
          </Card>
        </li>
      ))}
    </ul>
  );
}
