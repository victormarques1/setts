import { Pencil } from "lucide-react";

import { Button } from "@/components/ui/button";

type EditActionButtonProps = {
  entityName: string;
  onClick: () => void;
};

export function EditActionButton({ entityName, onClick }: EditActionButtonProps) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon-sm"
      aria-label={`Editar ${entityName}`}
      onClick={onClick}
    >
      <Pencil aria-hidden="true" />
    </Button>
  );
}
