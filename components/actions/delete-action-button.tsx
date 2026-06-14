import { Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";

type DeleteActionButtonProps = {
  entityName: string;
  onClick: () => void;
};

export function DeleteActionButton({
  entityName,
  onClick,
}: DeleteActionButtonProps) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon-sm"
      aria-label={`Excluir ${entityName}`}
      onClick={onClick}
    >
      <Trash2 aria-hidden="true" />
    </Button>
  );
}
