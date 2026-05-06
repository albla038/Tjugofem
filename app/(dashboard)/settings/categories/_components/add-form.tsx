import { CategoryCreate } from "@/schemas/category";
import CategoryFormUI from "./form-ui";
import { TransactionType } from "@/lib/generated/prisma/enums";
import { createCategoryAction } from "../actions";
import { useTransition } from "react";
import { toast } from "sonner";
import { ActionErrorCode } from "@/types/error-codes";
import { MUTATION_ERROR_MESSAGE_FALLBACK } from "@/lib/error-message-fallbacks";

type AddCategoryFormProps = {
  onOpenChange: (open: boolean) => void;
  categoryType: TransactionType;
};

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

export default function AddCategoryForm({
  onOpenChange,
  categoryType,
}: AddCategoryFormProps) {
  const defaultValues = {
    name: "",
    type: categoryType,
    color: "#FFFFFF",
    icon: "Home",
  };

  const [isPending, startTransition] = useTransition();

  function handleSubmit(data: CategoryCreate) {
    startTransition(async () => {
      const response = await createCategoryAction(data);

      if (!response.success) {
        toast.error(getErrorMessage(response.errorCode));
        return;
      }
      toast.success(`${data.name} tillagd`);
      onOpenChange(false);
    });
  }

  return (
    <CategoryFormUI
      defaultValues={defaultValues}
      onSubmit={handleSubmit}
      isPending={isPending}
      onOpenChange={onOpenChange}
    />
  );
}
