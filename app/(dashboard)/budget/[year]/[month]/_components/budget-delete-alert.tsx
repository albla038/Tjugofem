"use client";

import { deleteBudgetAction } from "@/app/(dashboard)/budget/[year]/[month]/action";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Spinner } from "@/components/ui/spinner";
import { MUTATION_ERROR_MESSAGE_FALLBACK } from "@/lib/error-message-fallbacks";
import { ActionErrorCode } from "@/types/error-codes";
import { Trash2 } from "lucide-react";
import { useTransition } from "react";
import { toast } from "sonner";

function getErrorMessage(errorCode: ActionErrorCode) {
  switch (errorCode) {
    case "NOT_FOUND":
      return "Vi kunde inte hitta budgeten du försöker radera. Den kanske redan har tagits bort.";
    case "VALIDATION_FAILED":
      return "Något gick fel med de angivna uppgifterna. Kontrollera och försök igen.";
    default:
      return MUTATION_ERROR_MESSAGE_FALLBACK;
  }
}

type BudgetDeleteAlertProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  name: string;
  budgetId: string;
};

export default function BudgetDeleteAlert({
  open,
  onOpenChange,
  name,
  budgetId,
}: BudgetDeleteAlertProps) {
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    startTransition(async () => {
      const response = await deleteBudgetAction(budgetId);

      if (!response.success) {
        toast.error(getErrorMessage(response.errorCode));
        return;
      }

      toast.success("Budgeten raderades");
      onOpenChange(false);
    });
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent size="sm">
        <AlertDialogHeader>
          <AlertDialogMedia className="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive">
            <Trash2 />
          </AlertDialogMedia>
          <AlertDialogTitle>Ta bort budget?</AlertDialogTitle>
          <AlertDialogDescription>
            Budgeten för {name} tas bort permanent och kan inte återställas
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel variant="outline">Avbryt</AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            onClick={handleDelete}
            disabled={isPending}
          >
            {isPending ? (
              <>
                <Spinner /> Tar bort...
              </>
            ) : (
              "Ta bort"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
