"use client";

import { useRouter } from "next/navigation";
import { useOptimistic, useState, useTransition } from "react";

import type { SetRecord } from "@/app/generated/prisma/client";
import { recordSetAction } from "@/modules/sessions/actions/session.actions";
import { SetLoggerForm } from "@/modules/sessions/components/set-logger-form";
import { SetRecordList } from "@/modules/sessions/components/set-record-list";

type OptimisticSetRecord = SetRecord & {
  isOptimistic?: boolean;
};

type RecordSetResult =
  | { success: true; recordId: string }
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
  const [sheetHeight, setSheetHeight] = useState(480);
  const [isPending, startTransition] = useTransition();
  const [optimisticSets, addOptimisticSet] = useOptimistic(
    initialSets,
    (state, newSet: OptimisticSetRecord) => [...state, newSet],
  );

  const nextSetNumber = getNextSetNumber(optimisticSets);
  const lastSet = getLastSet(optimisticSets);

  function scrollToSetRecord(recordId: string) {
    window.setTimeout(() => {
      document.getElementById(`set-record-${recordId}`)?.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }, 320);
  }

  function handleRecordSet(weight: string, reps: string): Promise<RecordSetResult> {
    return new Promise((resolve) => {
      startTransition(async () => {
        const parsedWeight = Number.parseFloat(weight);
        const parsedReps = Number.parseInt(reps, 10);
        const recordId = `optimistic-${Date.now()}`;

        addOptimisticSet({
          id: recordId,
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
        resolve({ success: true, recordId });
      });
    });
  }

  function handleRecordSuccess(recordId: string) {
    scrollToSetRecord(recordId);
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
        <div
          aria-hidden="true"
          className="pointer-events-none"
          style={{ height: sheetHeight }}
        />
      ) : null}

      {isActive ? (
        <SetLoggerForm
          workoutId={workoutId}
          sessionId={sessionId}
          nextSetNumber={nextSetNumber}
          lastSet={lastSet}
          onRecordSet={handleRecordSet}
          onRecordSuccess={handleRecordSuccess}
          onSheetHeightChange={setSheetHeight}
          isSubmitting={isPending}
        />
      ) : null}
    </>
  );
}
