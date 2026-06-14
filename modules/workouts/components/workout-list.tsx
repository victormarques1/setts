import Link from "next/link";

import { Button } from "@/components/ui/button";
import { WorkoutListItem } from "@/modules/workouts/components/workout-list-item";
import type { WorkoutSummary } from "@/modules/workouts/services/workout.service";

type WorkoutListProps = {
  workouts: WorkoutSummary[];
};

export function WorkoutList({ workouts }: WorkoutListProps) {
  if (workouts.length === 0) {
    return (
      <div className="empty-state-card w-full">
        <div className="flex flex-col gap-1.5">
          <p className="empty-state-title">Nenhum treino cadastrado</p>
          <p className="empty-state-description">
            Crie seu primeiro treino para começar a registrar cargas e ver sua
            evolução.
          </p>
        </div>
        <Button render={<Link href="/workouts/new" />} nativeButton={false}>
          Criar treino
        </Button>
      </div>
    );
  }

  return (
    <ul className="flex w-full flex-col gap-2.5 px-0.5">
      {workouts.map((workout) => (
        <WorkoutListItem key={workout.id} workout={workout} />
      ))}
    </ul>
  );
}
