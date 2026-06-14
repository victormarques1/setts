"use client";

import { useState } from "react";

import { formatWeight } from "@/lib/format-weight";
import { EditSetRecordDialog } from "@/modules/sessions/components/edit-set-record-dialog";

type SetRecordItem = {
  id: string;
  setNumber: number;
  weight: number;
  reps: number;
};

type SetRecordListItemProps = {
  workoutId: string;
  sessionId: string;
  exerciseId: string;
  set: SetRecordItem;
};

function formatSetLabel(weight: number, reps: number) {
  return `${formatWeight(weight)}kg × ${reps}`;
}

export function SetRecordListItem({
  workoutId,
  sessionId,
  exerciseId,
  set,
}: SetRecordListItemProps) {
  const [isEditOpen, setIsEditOpen] = useState(false);

  return (
    <>
      <li>
        <button
          type="button"
          className="list-card-interactive w-full px-4 py-3 text-left"
          aria-label={`Editar série ${set.setNumber}: ${formatSetLabel(set.weight, set.reps)}`}
          onClick={() => setIsEditOpen(true)}
        >
          <div className="flex min-h-10 items-center justify-between gap-3">
            <span className="text-sm font-semibold">Série {set.setNumber}</span>
            <span className="metric-value-primary text-base">
              {formatWeight(set.weight)}
              <span className="text-sm font-semibold text-primary/80"> kg</span>
              <span className="text-muted-foreground text-sm font-medium">
                {" "}
                × {set.reps}
              </span>
            </span>
          </div>
        </button>
      </li>
      {isEditOpen ? (
        <EditSetRecordDialog
          workoutId={workoutId}
          sessionId={sessionId}
          exerciseId={exerciseId}
          setRecordId={set.id}
          setNumber={set.setNumber}
          initialWeight={set.weight}
          initialReps={set.reps}
          onClose={() => setIsEditOpen(false)}
        />
      ) : null}
    </>
  );
}
