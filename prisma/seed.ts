import "dotenv/config";

import { PrismaClient } from "../app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is required to run the seed.");
}

const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const publicExercises = [
  { name: "Supino Reto", muscleGroup: "Peito" },
  { name: "Supino Reto Halteres", muscleGroup: "Peito" },
  { name: "Supino Inclinado", muscleGroup: "Peito" },
  { name: "Supino Inclinado Halteres", muscleGroup: "Peito" },
  { name: "Supino Declinado", muscleGroup: "Peito" },
  { name: "Crucifixo", muscleGroup: "Peito" },
  { name: "Crucifixo Inclinado", muscleGroup: "Peito" },
  { name: "Voador", muscleGroup: "Peito" },
  { name: "Crossover", muscleGroup: "Peito" },
  { name: "Remada Curvada", muscleGroup: "Costas" },
  { name: "Barra Fixa", muscleGroup: "Costas" },
  { name: "Pulley", muscleGroup: "Costas" },
  { name: "Puxada Alta", muscleGroup: "Costas" },
  { name: "Remada Unilateral", muscleGroup: "Costas" },
  { name: "Pull Down", muscleGroup: "Costas" },
  { name: "Remada Baixa", muscleGroup: "Costas" },
  { name: "Voador Inverso", muscleGroup: "Costas" },
  { name: "Agachamento Livre", muscleGroup: "Pernas" },
  { name: "Leg Press", muscleGroup: "Pernas" },
  { name: "Leg Press 45°", muscleGroup: "Pernas" },
  { name: "Cadeira Extensora", muscleGroup: "Pernas" },
  { name: "Mesa Flexora", muscleGroup: "Pernas" },
  { name: "Cadeira Flexora", muscleGroup: "Pernas" },
  { name: "Cadeira Adutora", muscleGroup: "Pernas" },
  { name: "Cadeira Abdutora", muscleGroup: "Pernas" },
  { name: "Agachamento Búlgaro", muscleGroup: "Pernas" },
  { name: "Agachamento Smith", muscleGroup: "Pernas" },
  { name: "Agachamento Sumô", muscleGroup: "Pernas" },
  { name: "Elevação Pélvica", muscleGroup: "Pernas" },
  { name: "Panturrilha Sentado", muscleGroup: "Pernas" },
  { name: "Panturrilha Smith", muscleGroup: "Pernas" },
  { name: "Stiff", muscleGroup: "Pernas" },
  { name: "Hack Squat", muscleGroup: "Pernas" },
  { name: "Afundo", muscleGroup: "Pernas" },
  { name: "Desenvolvimento Halteres", muscleGroup: "Ombros" },
  { name: "Desenvolvimento Barra", muscleGroup: "Ombros" },
  { name: "Elevação Lateral Halteres", muscleGroup: "Ombros" },
  { name: "Elevação Lateral Polia", muscleGroup: "Ombros" },
  { name: "Elevação Frontal Halteres", muscleGroup: "Ombros" },
  { name: "Elevação Frontal Polia", muscleGroup: "Ombros" },
  { name: "Rosca Direta", muscleGroup: "Bíceps" },
  { name: "Rosca Martelo", muscleGroup: "Bíceps" },
  { name: "Rosca Scott", muscleGroup: "Bíceps" },
  { name: "Rosca 45°", muscleGroup: "Bíceps" },
  { name: "Rosca Alternada", muscleGroup: "Bíceps" },
  { name: "Tríceps Testa", muscleGroup: "Tríceps" },
  { name: "Tríceps Corda", muscleGroup: "Tríceps" },
  { name: "Tríceps Barra", muscleGroup: "Tríceps" },
  { name: "Tríceps Coice", muscleGroup: "Tríceps" },
  { name: "Mergulho", muscleGroup: "Tríceps" },
  { name: "Abdominal Crunch", muscleGroup: "Core" },
  { name: "Prancha", muscleGroup: "Core" },
  { name: "Elevação de Panturrilha", muscleGroup: "Panturrilha" },
  { name: "Levantamento Terra", muscleGroup: "Posterior" },
] as const;

async function main() {
  for (const exercise of publicExercises) {
    const existing = await prisma.exerciseCatalog.findFirst({
      where: {
        isPublic: true,
        name: { equals: exercise.name, mode: "insensitive" },
      },
    });

    if (existing) {
      continue;
    }

    await prisma.exerciseCatalog.create({
      data: {
        name: exercise.name,
        muscleGroup: exercise.muscleGroup,
        isPublic: true,
      },
    });
  }

  console.log(`Seeded ${publicExercises.length} public exercises.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
