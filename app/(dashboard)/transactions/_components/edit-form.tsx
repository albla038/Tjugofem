"use client";

import TransactionFormUI from "@/app/(dashboard)/transactions/_components/form-ui";
import { updateTransactionAction } from "@/app/(dashboard)/transactions/actions";
import { MUTATION_ERROR_MESSAGE_FALLBACK } from "@/lib/error-message-fallbacks";
import { Category, Transaction } from "@/lib/generated/prisma/client";
import { TransactionForm, TransactionUpdate } from "@/schemas/transaction";
import { ActionErrorCode } from "@/types/error-codes";
import { useTransition } from "react";
import { toast } from "sonner";

function getErrorMessage(errorCode: ActionErrorCode) {
  switch (errorCode) {
    case "NOT_FOUND":
      return "Vi kunde inte hitta transaktionen du försöker redigera. Den kanske har tagits bort.";
    case "UNAUTHORIZED":
      return "Du måste vara inloggad för att redigera en transaktion.";
    case "VALIDATION_FAILED":
      return "Något gick fel med de angivna uppgifterna. Kontrollera och försök igen.";
    default:
      return MUTATION_ERROR_MESSAGE_FALLBACK;
  }
}

type TransactionEditFormProps = {
  transaction: Transaction;
  categories: Category[];
  onClose: () => void;
};

export default function TransactionEditForm({
  transaction,
  categories,
  onClose,
}: TransactionEditFormProps) {
  const initialValues = {
    amount: (transaction.amountInCents / 100).toString(),
    ...transaction,
  };

  const [isPending, startTransition] = useTransition();

  function handleSubmit(data: TransactionForm) {
    const newData: TransactionUpdate = {
      ...data,
      amountInCents: Math.round(data.amount * 100),
      id: transaction.id,
    };

    startTransition(async () => {
      const response = await updateTransactionAction(newData);

      if (!response.success) {
        toast.error(getErrorMessage(response.errorCode));
        return;
      }

      toast.success("Transaktionen uppdaterades");
      onClose();
    });
  }

  return (
    <TransactionFormUI
      defaultValues={initialValues}
      onSubmit={handleSubmit}
      isPending={isPending}
      categories={categories}
      onClose={onClose}
    />
  );
}
