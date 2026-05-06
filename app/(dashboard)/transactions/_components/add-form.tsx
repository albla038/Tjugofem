"use client";

import TransactionFormUI from "@/app/(dashboard)/transactions/_components/form-ui";
import { createTransactionAction } from "@/app/(dashboard)/transactions/actions";
import { transactionTypeTitleSingular } from "@/lib/constants";
import { MUTATION_ERROR_MESSAGE_FALLBACK } from "@/lib/error-message-fallbacks";
import { Category } from "@/lib/generated/prisma/client";
import {
  TransactionCreate,
  TransactionForm,
  TransactionFormInput,
} from "@/schemas/transaction";
import { ActionErrorCode } from "@/types/error-codes";
import { useTransition } from "react";
import { toast } from "sonner";

function getErrorMessage(errorCode: ActionErrorCode) {
  switch (errorCode) {
    case "UNAUTHORIZED":
      return "Du måste vara inloggad för att skapa en transaktion.";
    case "VALIDATION_FAILED":
      return "Något gick fel med de angivna uppgifterna. Kontrollera och försök igen.";
    default:
      return MUTATION_ERROR_MESSAGE_FALLBACK;
  }
}

type TransactionAddFormProps = {
  categories: Category[];
  defaultValues: TransactionFormInput;
  onClose: () => void;
};

export default function TransactionAddForm({
  categories,
  defaultValues,
  onClose,
}: TransactionAddFormProps) {
  const [isPending, startTransition] = useTransition();

  function handleSubmit(data: TransactionForm) {
    const transformedData: TransactionCreate = {
      ...data,
      amountInCents: Math.round(data.amount * 100),
    };

    startTransition(async () => {
      const response = await createTransactionAction(transformedData);

      if (!response.success) {
        toast.error(getErrorMessage(response.errorCode));
        return;
      }

      toast.success(`${transactionTypeTitleSingular[data.type]} tillagd!`);
      onClose();
    });
  }

  return (
    <TransactionFormUI
      defaultValues={defaultValues}
      isPending={isPending}
      onSubmit={handleSubmit}
      categories={categories}
      onClose={onClose}
    />
  );
}
