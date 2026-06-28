"use client";

import { useState } from "react";

import { EditActionButton } from "@/components/actions/edit-action-button";
import { DeleteActionButton } from "@/components/actions/delete-action-button";
import { formatWeight } from "@/lib/format-weight";
import { DeleteSetRecordDialog } from "@/modules/sessions/components/delete-set-record-dialog";
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
  isOptimistic?: boolean;
};

function formatSetLabel(setNumber: number, weight: number, reps: number) {
  return `Série ${setNumber}: ${formatWeight(weight)} kg × ${reps}`;
}

export function SetRecordListItem({
  workoutId,
  sessionId,
  exerciseId,
  set,
  isOptimistic = false,
}: SetRecordListItemProps) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const entityName = formatSetLabel(set.setNumber, set.weight, set.reps);

  return (
    <>
      <li>
        <div
          className={isOptimistic ? "list-card px-4 py-3.5 opacity-60" : "list-card px-4 py-3.5"}
          aria-busy={isOptimistic ? true : undefined}
        >
          <div className="flex min-h-11 items-center justify-between gap-3">
            <span className="text-sm font-semibold">
              Série {set.setNumber}
              {isOptimistic ? (
                <span className="text-muted-foreground ml-2 text-xs font-medium">
                  Salvando…
                </span>
              ) : null}
            </span>
            <div className="flex shrink-0 items-center gap-2">
              <span className="metric-value-primary text-base">
                {formatWeight(set.weight)}
                <span className="text-sm font-semibold text-primary/80"> kg</span>
                <span className="text-muted-foreground text-sm font-medium">
                  {" "}
                  × {set.reps}
                </span>
              </span>
              {!isOptimistic ? (
                <>
                  <EditActionButton
                    entityName={entityName}
                    onClick={() => setIsEditOpen(true)}
                  />
                  <DeleteActionButton
                    entityName={entityName}
                    onClick={() => setIsDeleteOpen(true)}
                  />
                </>
              ) : null}
            </div>
          </div>
        </div>
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
      {isDeleteOpen ? (
        <DeleteSetRecordDialog
          workoutId={workoutId}
          sessionId={sessionId}
          exerciseId={exerciseId}
          setRecordId={set.id}
          setNumber={set.setNumber}
          weight={set.weight}
          reps={set.reps}
          onClose={() => setIsDeleteOpen(false)}
        />
      ) : null}
    </>
  );
}
