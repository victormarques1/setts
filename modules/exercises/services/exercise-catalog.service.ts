import { exerciseCatalogRepository } from "@/modules/exercises/repositories/exercise-catalog.repository";
import {
  createCustomExerciseSchema,
  searchExerciseCatalogSchema,
  type CreateCustomExerciseInput,
} from "@/modules/exercises/validations/exercise-catalog.schema";

export class ExerciseCatalogDuplicateError extends Error {
  constructor() {
    super("Você já possui um exercício com esse nome.");
    this.name = "ExerciseCatalogDuplicateError";
  }
}

export type ExerciseCatalogItem = {
  id: string;
  name: string;
  muscleGroup: string | null;
  isPublic: boolean;
  isCustom: boolean;
};

export const exerciseCatalogService = {
  async search(
    userId: string,
    query: string,
    excludeCatalogIds: string[] = [],
  ): Promise<ExerciseCatalogItem[]> {
    const data = searchExerciseCatalogSchema.parse({ query });
    const excludeSet = new Set(excludeCatalogIds);

    const items = await exerciseCatalogRepository.searchForUser(
      userId,
      data.query,
    );

    return items
      .filter((item) => !excludeSet.has(item.id))
      .map((item) => ({
        id: item.id,
        name: item.name,
        muscleGroup: item.muscleGroup,
        isPublic: item.isPublic,
        isCustom: !item.isPublic,
      }));
  },

  async createCustom(input: CreateCustomExerciseInput, userId: string) {
    const data = createCustomExerciseSchema.parse(input);

    const duplicate = await exerciseCatalogRepository.findCustomByNameForUser(
      data.name,
      userId,
    );

    if (duplicate) {
      throw new ExerciseCatalogDuplicateError();
    }

    return exerciseCatalogRepository.create({
      name: data.name,
      muscleGroup: data.muscleGroup ?? null,
      isPublic: false,
      createdByUserId: userId,
    });
  },

  getAccessibleById(id: string, userId: string) {
    return exerciseCatalogRepository.findAccessibleById(id, userId);
  },
};
