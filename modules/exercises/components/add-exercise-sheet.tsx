"use client";

import { Loader2, Plus, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState, useTransition } from "react";

import { ErrorFeedback } from "@/components/feedback/error-feedback";
import { Button } from "@/components/ui/button";
import {
  DialogBackdrop,
  DialogClose,
  DialogDescription,
  DialogPopup,
  DialogPortal,
  DialogRoot,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  addExerciseToWorkoutAction,
  createCustomExerciseAndAddAction,
  searchExerciseCatalogAction,
} from "@/modules/exercises/actions/exercise-catalog.actions";
import type { ExerciseCatalogItem } from "@/modules/exercises/services/exercise-catalog.service";

type AddExerciseSheetProps = {
  workoutId: string;
  open: boolean;
  onClose: () => void;
};

type SheetView = "picker" | "create";

function groupCatalogItems(items: ExerciseCatalogItem[]) {
  const publicItems: ExerciseCatalogItem[] = [];
  const customItems: ExerciseCatalogItem[] = [];

  for (const item of items) {
    if (item.isCustom) {
      customItems.push(item);
    } else {
      publicItems.push(item);
    }
  }

  return { publicItems, customItems };
}

function filterCatalogItems(
  items: ExerciseCatalogItem[],
  query: string,
): ExerciseCatalogItem[] {
  const normalizedQuery = query.trim().toLowerCase();

  if (!normalizedQuery) {
    return items;
  }

  return items.filter(
    (item) =>
      item.name.toLowerCase().includes(normalizedQuery) ||
      item.muscleGroup?.toLowerCase().includes(normalizedQuery),
  );
}

function CatalogSection({
  title,
  items,
  isSubmitting,
  onSelect,
}: {
  title: string;
  items: ExerciseCatalogItem[];
  isSubmitting: boolean;
  onSelect: (exerciseCatalogId: string) => void;
}) {
  if (items.length === 0) {
    return null;
  }

  return (
    <section className="flex flex-col gap-2">
      <h3 className="text-muted-foreground px-1 text-xs font-semibold tracking-wide uppercase">
        {title}
      </h3>
      <ul className="flex flex-col gap-1.5">
        {items.map((item) => (
          <li key={item.id}>
            <button
              type="button"
              className="list-card-interactive w-full px-4 py-3 text-left disabled:opacity-60"
              disabled={isSubmitting}
              onClick={() => onSelect(item.id)}
            >
              <div className="flex min-w-0 items-center justify-between gap-3">
                <span className="truncate font-semibold tracking-tight">
                  {item.name}
                </span>
                {item.muscleGroup ? (
                  <span className="text-muted-foreground shrink-0 text-xs font-medium">
                    {item.muscleGroup}
                  </span>
                ) : null}
              </div>
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function AddExerciseSheet({
  workoutId,
  open,
  onClose,
}: AddExerciseSheetProps) {
  const router = useRouter();
  const [view, setView] = useState<SheetView>("picker");
  const [query, setQuery] = useState("");
  const [catalogItems, setCatalogItems] = useState<ExerciseCatalogItem[]>([]);
  const [isLoadingCatalog, setIsLoadingCatalog] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, startSubmitTransition] = useTransition();

  const filteredItems = useMemo(
    () => filterCatalogItems(catalogItems, query),
    [catalogItems, query],
  );

  const { publicItems, customItems } = useMemo(
    () => groupCatalogItems(filteredItems),
    [filteredItems],
  );

  useEffect(() => {
    if (!open || view !== "picker") {
      return;
    }

    let cancelled = false;

    async function loadCatalog() {
      setIsLoadingCatalog(true);

      const result = await searchExerciseCatalogAction(workoutId, "");

      if (cancelled) {
        return;
      }

      if (!result.success) {
        setError(result.error);
        setCatalogItems([]);
      } else {
        setError(null);
        setCatalogItems(result.data);
      }

      setIsLoadingCatalog(false);
    }

    void loadCatalog();

    return () => {
      cancelled = true;
    };
  }, [open, view, workoutId]);

  function resetState() {
    setView("picker");
    setQuery("");
    setCatalogItems([]);
    setError(null);
  }

  function handleOpenChange(nextOpen: boolean) {
    if (!nextOpen && !isSubmitting) {
      resetState();
      onClose();
    }
  }

  function handleSuccess() {
    resetState();
    onClose();
    router.refresh();
  }

  function handleSelect(exerciseCatalogId: string) {
    setError(null);

    startSubmitTransition(async () => {
      const result = await addExerciseToWorkoutAction(
        workoutId,
        exerciseCatalogId,
      );

      if (!result.success) {
        setError(result.error);
        return;
      }

      handleSuccess();
    });
  }

  function handleCreateSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const formData = new FormData(event.currentTarget);
    const name = formData.get("name");
    const muscleGroup = formData.get("muscleGroup");

    if (typeof name !== "string") {
      setError("Nome é obrigatório.");
      return;
    }

    startSubmitTransition(async () => {
      const result = await createCustomExerciseAndAddAction(workoutId, {
        name,
        muscleGroup:
          typeof muscleGroup === "string" && muscleGroup.trim().length > 0
            ? muscleGroup
            : undefined,
      });

      if (!result.success) {
        setError(result.error);
        return;
      }

      handleSuccess();
    });
  }

  const showEmptyState =
    !isLoadingCatalog &&
    catalogItems.length > 0 &&
    filteredItems.length === 0;

  const showNoCatalogState =
    !isLoadingCatalog && catalogItems.length === 0 && !error;

  return (
    <DialogRoot open={open} onOpenChange={handleOpenChange}>
      <DialogPortal>
        <DialogBackdrop />
        <DialogPopup className="gap-5">
          {view === "picker" ? (
            <>
              <div className="flex flex-col gap-1.5">
                <DialogTitle>Adicionar exercício</DialogTitle>
                <DialogDescription>
                  Escolha um exercício do catálogo ou crie um personalizado.
                </DialogDescription>
              </div>

              <div className="search-input-wrapper">
                <Search
                  className="pointer-events-none absolute top-1/2 left-3.5 size-[1.125rem] -translate-y-1/2 text-muted-foreground"
                  aria-hidden
                />
                <Input
                  type="search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Buscar exercício..."
                  aria-label="Buscar exercício"
                  className="search-input"
                  disabled={isLoadingCatalog}
                  autoFocus
                />
              </div>

              {error ? <ErrorFeedback message={error} /> : null}

              <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto">
                {isLoadingCatalog ? (
                  <div className="text-muted-foreground flex items-center gap-2 px-1 text-sm">
                    <Loader2
                      className="size-4 shrink-0 animate-spin"
                      aria-hidden="true"
                    />
                    Carregando catálogo...
                  </div>
                ) : null}

                {showEmptyState ? (
                  <p className="text-muted-foreground px-1 text-sm">
                    Nenhum exercício encontrado para &quot;{query.trim()}&quot;.
                  </p>
                ) : null}

                {showNoCatalogState ? (
                  <p className="text-muted-foreground px-1 text-sm">
                    Nenhum exercício disponível para adicionar.
                  </p>
                ) : null}

                {!isLoadingCatalog ? (
                  <>
                    <CatalogSection
                      title="Catálogo padrão"
                      items={publicItems}
                      isSubmitting={isSubmitting}
                      onSelect={handleSelect}
                    />

                    <CatalogSection
                      title="Meus exercícios"
                      items={customItems}
                      isSubmitting={isSubmitting}
                      onSelect={handleSelect}
                    />
                  </>
                ) : null}
              </div>

              <Button
                type="button"
                variant="outline"
                className="w-full"
                disabled={isSubmitting || isLoadingCatalog}
                onClick={() => {
                  setError(null);
                  setView("create");
                }}
              >
                <Plus className="size-4" aria-hidden="true" />
                Criar novo exercício
              </Button>
            </>
          ) : (
            <>
              <div className="flex flex-col gap-1.5">
                <DialogTitle>Criar exercício</DialogTitle>
                <DialogDescription>
                  O exercício será adicionado automaticamente a este treino.
                </DialogDescription>
              </div>

              <form
                onSubmit={handleCreateSubmit}
                className="flex flex-col gap-4"
              >
                <div className="flex flex-col gap-2">
                  <Label htmlFor="custom-exercise-name">Nome</Label>
                  <Input
                    id="custom-exercise-name"
                    name="name"
                    placeholder="Ex.: Supino com Halteres"
                    maxLength={100}
                    required
                    disabled={isSubmitting}
                    autoFocus
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="custom-exercise-muscle-group">
                    Grupo muscular (opcional)
                  </Label>
                  <Input
                    id="custom-exercise-muscle-group"
                    name="muscleGroup"
                    placeholder="Ex.: Peito"
                    maxLength={50}
                    disabled={isSubmitting}
                  />
                </div>

                {error ? <ErrorFeedback message={error} /> : null}

                <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full sm:w-auto"
                    disabled={isSubmitting}
                    onClick={() => {
                      setError(null);
                      setView("picker");
                    }}
                  >
                    Voltar
                  </Button>
                  <Button
                    type="submit"
                    className="w-full sm:w-auto"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Criando..." : "Criar e adicionar"}
                  </Button>
                </div>
              </form>
            </>
          )}

          {view === "picker" ? (
            <DialogClose
              render={
                <Button
                  type="button"
                  variant="ghost"
                  className="w-full"
                  disabled={isSubmitting}
                />
              }
            >
              Cancelar
            </DialogClose>
          ) : null}
        </DialogPopup>
      </DialogPortal>
    </DialogRoot>
  );
}
