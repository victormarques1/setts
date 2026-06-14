"use client";

import { useRouter } from "next/navigation";
import { useOptimistic, useTransition } from "react";

import type { SetRecord } from "@/app/generated/prisma/client";
import { recordSetAction } from "@/modules/sessions/actions/session.actions";
import { SetLoggerForm } from "@/modules/sessions/components/set-logger-form";
import { SetRecordList } from "@/modules/sessions/components/set-record-list";

type OptimisticSetRecord = SetRecord & {
  isOptimistic?: boolean;
};

type RecordSetResult =
  | { success: true }
  | { success: false; error: string };

type ExerciseLoggerPanelProps = {
  workoutId: string;
  sessionId: string;
  exerciseId: string;
  initialSets: SetRecord[];
  isActive: boolean;
};

function getNextSetNumber(sets: SetRecord[]) {
  if (sets.length === 0) {
    return 1;
  }

  return sets[sets.length - 1].setNumber + 1;
}

function getLastSet(sets: SetRecord[]) {
  if (sets.length === 0) {
    return null;
  }

  const last = sets[sets.length - 1];

  return {
    weight: last.weight,
    reps: last.reps,
  };
}

export function ExerciseLoggerPanel({
  workoutId,
  sessionId,
  exerciseId,
  initialSets,
  isActive,
}: ExerciseLoggerPanelProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [optimisticSets, addOptimisticSet] = useOptimistic(
    initialSets,
    (state, newSet: OptimisticSetRecord) => [...state, newSet],
  );

  const nextSetNumber = getNextSetNumber(optimisticSets);
  const lastSet = getLastSet(optimisticSets);

  function handleRecordSet(weight: string, reps: string): Promise<RecordSetResult> {
    return new Promise((resolve) => {
      startTransition(async () => {
        const parsedWeight = Number.parseFloat(weight);
        const parsedReps = Number.parseInt(reps, 10);

        addOptimisticSet({
          id: `optimistic-${Date.now()}`,
          sessionId,
          exerciseId,
          setNumber: nextSetNumber,
          weight: Number.isNaN(parsedWeight) ? 0 : parsedWeight,
          reps: Number.isNaN(parsedReps) ? 1 : parsedReps,
          isOptimistic: true,
        });

        const result = await recordSetAction(workoutId, sessionId, exerciseId, {
          weight,
          reps,
        });

        if (!result.success) {
          resolve(result);
          return;
        }

        router.refresh();
        resolve({ success: true });
      });
    });
  }

  return (
    <>
      <SetRecordList
        workoutId={workoutId}
        sessionId={sessionId}
        exerciseId={exerciseId}
        sets={optimisticSets}
      />

      {isActive ? (
        <div className="fixed-above-nav-form">
          <SetLoggerForm
            workoutId={workoutId}
            sessionId={sessionId}
            nextSetNumber={nextSetNumber}
            lastSet={lastSet}
            onRecordSet={handleRecordSet}
            isSubmitting={isPending}
          />
        </div>
      ) : null}
    </>
  );
}
