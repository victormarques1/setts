type ProgressWorkoutChipsProps = {
  workouts: string[];
  selectedWorkout: string | null;
  onSelect: (workout: string | null) => void;
};

export function ProgressWorkoutChips({
  workouts,
  selectedWorkout,
  onSelect,
}: ProgressWorkoutChipsProps) {
  return (
    <div
      className="filter-chips-scroll -mx-[var(--page-gutter)] px-[var(--page-gutter)]"
      role="group"
      aria-label="Filtrar por treino"
    >
      <button
        type="button"
        onClick={() => onSelect(null)}
        className={
          selectedWorkout === null ? "filter-chip filter-chip-active" : "filter-chip"
        }
        aria-pressed={selectedWorkout === null}
      >
        Todos
      </button>
      {workouts.map((workout) => (
        <button
          key={workout}
          type="button"
          onClick={() => onSelect(workout)}
          className={
            selectedWorkout === workout
              ? "filter-chip filter-chip-active"
              : "filter-chip"
          }
          aria-pressed={selectedWorkout === workout}
        >
          {workout}
        </button>
      ))}
    </div>
  );
}
