"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { AddExerciseSheet } from "@/modules/exercises/components/add-exercise-sheet";

type AddExerciseButtonProps = {
  workoutId: string;
  label?: string;
  variant?: "default" | "outline";
  className?: string;
};

export function AddExerciseButton({
  workoutId,
  label = "Adicionar exercício",
  variant = "default",
  className,
}: AddExerciseButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button
        type="button"
        variant={variant}
        className={className}
        onClick={() => setIsOpen(true)}
      >
        {label}
      </Button>
      <AddExerciseSheet
        workoutId={workoutId}
        open={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </>
  );
}
