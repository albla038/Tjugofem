"use client";

import { updateBudgetOpeningBalanceAction } from "@/app/(dashboard)/budget/[year]/[month]/action";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldContent,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group";
import { Spinner } from "@/components/ui/spinner";
import { MUTATION_ERROR_MESSAGE_FALLBACK } from "@/lib/error-message-fallbacks";
import { formatCentsToSEK } from "@/lib/utils";
import {
  BudgetOpeningBalanceUpdate,
  BudgetOpeningBalanceUpdateForm,
  budgetOpeningBalanceUpdateFormSchema,
} from "@/schemas/budget";
import { ActionErrorCode } from "@/types/error-codes";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

function getErrorMessage(errorCode: ActionErrorCode) {
  switch (errorCode) {
    case "UNAUTHORIZED":
      return "Du måste vara inloggad för att redigera budgeten.";
    case "VALIDATION_FAILED":
      return "Något gick fel med de angivna uppgifterna. Kontrollera och försök igen.";
    case "NOT_FOUND":
      return "Vi hittade inte den här budgeten. Den kanske har tagits bort?";
    default:
      return MUTATION_ERROR_MESSAGE_FALLBACK;
  }
}

type EditBudgetOpeningBalanceFormProps = {
  budgetId: string;
  currentOpeningBalanceInCents: number;
  prevMonthClosingBalanceInCents: number | null;
  onClose: () => void;
};

export default function EditBudgetOpeningBalanceForm({
  budgetId,
  currentOpeningBalanceInCents,
  prevMonthClosingBalanceInCents,
  onClose,
}: EditBudgetOpeningBalanceFormProps) {
  const form = useForm({
    resolver: zodResolver(budgetOpeningBalanceUpdateFormSchema),
    defaultValues: {
      newOpeningBalance: (currentOpeningBalanceInCents / 100).toString(),
    },
  });

  const [isPending, startTransition] = useTransition();

  const isOpeningBalanceDifferent =
    prevMonthClosingBalanceInCents !== null
      ? prevMonthClosingBalanceInCents !== currentOpeningBalanceInCents
      : false;

  const prevMonthClosingBalanceString =
    prevMonthClosingBalanceInCents !== null
      ? formatCentsToSEK(prevMonthClosingBalanceInCents)
      : null;

  function handleSubmit(data: BudgetOpeningBalanceUpdateForm) {
    const transformedData: BudgetOpeningBalanceUpdate = {
      budgetId,
      newOpeningBalanceInCents: Math.round(data.newOpeningBalance * 100),
    };

    startTransition(async () => {
      const response = await updateBudgetOpeningBalanceAction(transformedData);

      if (!response.success) {
        toast.error(getErrorMessage(response.errorCode));
        return;
      }

      toast.success("Budgeten uppdaterades");
      onClose();
    });
  }

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} noValidate>
      <FieldGroup>
        {/* Amount */}
        <Controller
          control={form.control}
          name="newOpeningBalance"
          render={({ field, fieldState }) => (
            <Field>
              <FieldContent>
                <FieldLabel htmlFor={field.name}>Ingående saldo</FieldLabel>
              </FieldContent>

              <InputGroup>
                <InputGroupInput
                  {...field}
                  id={field.name}
                  placeholder={(currentOpeningBalanceInCents / 100).toString()}
                  autoComplete="off"
                  type="number"
                  step="0.01"
                  aria-invalid={fieldState.invalid}
                />

                <InputGroupAddon align="inline-end">
                  <InputGroupText>SEK</InputGroupText>
                </InputGroupAddon>
              </InputGroup>

              {isOpeningBalanceDifferent && (
                <Button
                  variant="outline"
                  size="sm"
                  type="button"
                  onClick={() =>
                    field.onChange(
                      prevMonthClosingBalanceInCents !== null
                        ? (prevMonthClosingBalanceInCents / 100).toString()
                        : 0
                    )
                  }
                >
                  Sätt till{" "}
                  <span className="font-semibold tabular-nums">
                    {prevMonthClosingBalanceString}
                  </span>
                </Button>
              )}

              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        {/* Action buttons */}
        <Field>
          <Button type="submit" disabled={isPending}>
            {isPending ? (
              <>
                <Spinner /> Sparar...
              </>
            ) : (
              "Spara"
            )}
          </Button>
          <Button variant="outline" type="button" onClick={onClose}>
            Avbryt
          </Button>
        </Field>
      </FieldGroup>
    </form>
  );
}
