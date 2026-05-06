"use client";

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
import { Trash2 } from "lucide-react";
import { useTransition } from "react";
import { deleteCategoryAction } from "../actions";
import { toast } from "sonner";
import { ActionErrorCode } from "@/types/error-codes";
import { MUTATION_ERROR_MESSAGE_FALLBACK } from "@/lib/error-message-fallbacks";

type CategoryDeleteProps = {
  open: boolean;
  onOpenChange: (value: boolean) => void;
  categoryId: string;
  categoryName: string;
};

function getErrorMessage(errorCode: ActionErrorCode) {
  switch (errorCode) {
    case "NOT_FOUND":
      return "Vi kunde inte hitta kategorin du försöker radera. Den kanske redan har tagits bort.";
    case "VALIDATION_FAILED":
      return "Något gick fel med de angivna uppgifterna. Kontrollera och försök igen.";
    default:
      return MUTATION_ERROR_MESSAGE_FALLBACK;
  }
}

export default function CategoryDeleteAlert({
  open,
  onOpenChange,
  categoryId,
  categoryName,
}: CategoryDeleteProps) {
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    startTransition(async () => {
      const response = await deleteCategoryAction(categoryId);

      // Return early if unsuccessful
      if (!response.success) {
        toast.error(getErrorMessage(response.errorCode));
        return;
      }

      toast.success("Kategorin raderades");
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
          <AlertDialogTitle>Ta bort kategori?</AlertDialogTitle>
          <AlertDialogDescription>
            {categoryName} tas bort permanent och kan inte återställas
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
