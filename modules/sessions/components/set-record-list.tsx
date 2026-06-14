import type { SetRecord } from "@/app/generated/prisma/client";
import { SetRecordListItem } from "@/modules/sessions/components/set-record-list-item";

type SetRecordListProps = {
  workoutId: string;
  sessionId: string;
  exerciseId: string;
  sets: Array<SetRecord & { isOptimistic?: boolean }>;
};

export function SetRecordList({
  workoutId,
  sessionId,
  exerciseId,
  sets,
}: SetRecordListProps) {
  if (sets.length === 0) {
    return (
      <div className="empty-state-card w-full">
        <div className="flex flex-col gap-1.5">
          <p className="empty-state-title">Nenhuma série registrada</p>
          <p className="empty-state-description">
            Use o formulário abaixo para registrar peso e repetições de cada
            série executada.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col gap-2.5">
      <h2 className="metric-label px-0.5">Séries registradas</h2>
      <ul className="flex flex-col gap-2">
        {sets.map((set) => (
          <SetRecordListItem
            key={set.id}
            workoutId={workoutId}
            sessionId={sessionId}
            exerciseId={exerciseId}
            set={set}
            isOptimistic={set.isOptimistic === true}
          />
        ))}
      </ul>
    </div>
  );
}
