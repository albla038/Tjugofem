import { MUTATION_ERROR_MESSAGE_FALLBACK } from "@/lib/error-message-fallbacks";
import { Category } from "@/lib/generated/prisma/client";
import { CategoryCreate, CategoryUpdate } from "@/schemas/category";
import { ActionErrorCode } from "@/types/error-codes";
import { useTransition } from "react";
import { updateCategoryAction } from "../actions";
import { toast } from "sonner";
import CategoryFormUI from "./form-ui";

function getErrorMessage(errorCode: ActionErrorCode) {
  switch (errorCode) {
    case "UNAUTHORIZED":
      return "Du måste vara inloggad för att skapa en kategori";
    case "VALIDATION_FAILED":
      return "Något gick fel med de angivna uppgifterna. Kontrollera och försök igen.";
    default:
      return MUTATION_ERROR_MESSAGE_FALLBACK;
  }
}

type CategoryEditFormProps = {
  category: Category;
  onOpenChange: (open: boolean) => void;
};

export default function CategoryEditForm({
  category,
  onOpenChange,
}: CategoryEditFormProps) {
  const [isPending, startTransition] = useTransition();

  const initialData = {
    name: category.name,
    type: category.type,
    icon: category.icon ? category.icon : undefined,
    // color: undefined,
  };

  function handleSubmit(data: CategoryCreate) {
    const newData: CategoryUpdate = {
      ...data,
      id: category.id,
    };

    startTransition(async () => {
      const response = await updateCategoryAction(newData);

      if (!response.success) {
        toast.error(getErrorMessage(response.errorCode));
        return;
      }

      toast.success("Kategorin uppdaterades");
      onOpenChange(false);
    });
  }

  return (
    <CategoryFormUI
      defaultValues={initialData}
      onSubmit={handleSubmit}
      isPending={isPending}
      onOpenChange={onOpenChange}
    />
  );
}
