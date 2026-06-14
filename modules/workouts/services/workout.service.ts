import { workoutRepository } from "@/modules/workouts/repositories/workout.repository";
import {
  createWorkoutSchema,
  type CreateWorkoutInput,
} from "@/modules/workouts/validations/workout.schema";

export type WorkoutSummary = {
  id: string;
  name: string;
  exerciseCount: number;
  lastSessionAt: Date | null;
};

export const workoutService = {
  listByUserId(userId: string) {
    return workoutRepository.findByUserId(userId);
  },

  async listSummariesByUserId(userId: string): Promise<WorkoutSummary[]> {
    const workouts = await workoutRepository.findSummariesByUserId(userId);

    return workouts.map((workout) => ({
      id: workout.id,
      name: workout.name,
      exerciseCount: workout._count.exercises,
      lastSessionAt: workout.sessions[0]?.performedAt ?? null,
    }));
  },

  getById(id: string) {
    return workoutRepository.findById(id);
  },

  getByIdForUser(id: string, userId: string) {
    return workoutRepository.findByIdForUser(id, userId);
  },

  create(input: CreateWorkoutInput) {
    const data = createWorkoutSchema.parse(input);
    return workoutRepository.create(data);
  },
};
