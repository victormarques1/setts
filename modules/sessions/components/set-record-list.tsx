import type { SetRecord } from "@/app/generated/prisma/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type SetRecordListProps = {
  sets: SetRecord[];
};

export function SetRecordList({ sets }: SetRecordListProps) {
  if (sets.length === 0) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Nenhuma série registrada</CardTitle>
          <CardDescription>
            Registre peso e repetições para cada série executada.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="flex w-full flex-col gap-3">
      <h2 className="text-sm font-medium text-muted-foreground">
        Séries registradas
      </h2>
      <ul className="flex flex-col gap-2">
        {sets.map((set) => (
          <li key={set.id}>
            <Card className="min-h-11 py-3">
              <CardContent className="flex min-h-11 items-center justify-between gap-3 py-0 text-sm">
                <span className="font-medium">Série {set.setNumber}</span>
                <span className="text-muted-foreground shrink-0">
                  {set.weight} kg × {set.reps} reps
                </span>
              </CardContent>
            </Card>
          </li>
        ))}
      </ul>
    </div>
  );
}
