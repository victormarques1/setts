import { prisma } from "@/lib/prisma";

type CreateCatalogInput = {
  name: string;
  muscleGroup?: string | null;
  isPublic: boolean;
  createdByUserId?: string | null;
};

export const exerciseCatalogRepository = {
  findAccessibleById(id: string, userId: string) {
    return prisma.exerciseCatalog.findFirst({
      where: {
        id,
        OR: [{ isPublic: true }, { createdByUserId: userId }],
      },
    });
  },

  findCustomByNameForUser(name: string, userId: string) {
    return prisma.exerciseCatalog.findFirst({
      where: {
        createdByUserId: userId,
        isPublic: false,
        name: { equals: name, mode: "insensitive" },
      },
    });
  },

  searchForUser(userId: string, query: string) {
    const normalizedQuery = query.trim();

    return prisma.exerciseCatalog.findMany({
      where: {
        OR: [{ isPublic: true }, { createdByUserId: userId }],
        ...(normalizedQuery
          ? {
              name: {
                contains: normalizedQuery,
                mode: "insensitive" as const,
              },
            }
          : {}),
      },
      orderBy: { name: "asc" },
    });
  },

  create(data: CreateCatalogInput) {
    return prisma.exerciseCatalog.create({ data });
  },

  update(id: string, data: { name: string; muscleGroup?: string | null }) {
    return prisma.exerciseCatalog.update({
      where: { id },
      data,
    });
  },

  findByIdForUser(id: string, userId: string) {
    return prisma.exerciseCatalog.findFirst({
      where: {
        id,
        isPublic: false,
        createdByUserId: userId,
      },
    });
  },
};
