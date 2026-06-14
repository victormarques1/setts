import type { SetRecord } from "@/app/generated/prisma/client";

type SetRecordListProps = {
  sets: SetRecord[];
};

export function SetRecordList({ sets }: SetRecordListProps) {
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
          <li key={set.id}>
            <div className="list-card px-4 py-3">
              <div className="flex min-h-10 items-center justify-between gap-3">
                <span className="text-sm font-semibold">
                  Série {set.setNumber}
                </span>
                <span className="metric-value-primary text-base">
                  {set.weight}
                  <span className="text-sm font-semibold text-primary/80">
                    {" "}
                    kg
                  </span>
                  <span className="text-muted-foreground text-sm font-medium">
                    {" "}
                    × {set.reps}
                  </span>
                </span>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
