"use client";

import { updateBudgetItemLimitAction } from "@/app/(dashboard)/budget/[year]/[month]/action";
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
import {
  BudgetItemLimitUpdate,
  BudgetItemLimitUpdateForm,
  budgetItemLimitUpdateFormSchema,
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
      return "Vi hittade inte den här budgetkategorin. Den kanske har tagits bort?";
    default:
      return MUTATION_ERROR_MESSAGE_FALLBACK;
  }
}

type EditBudgetItemLimitFormProps = {
  budgetItemId: string;
  currentLimitInCents: number;
  onClose: () => void;
};

export default function EditBudgetItemLimitForm({
  budgetItemId,
  currentLimitInCents,
  onClose,
}: EditBudgetItemLimitFormProps) {
  const form = useForm({
    resolver: zodResolver(budgetItemLimitUpdateFormSchema),
    defaultValues: {
      newLimitInCents: (currentLimitInCents / 100).toString(),
    },
  });

  const [isPending, startTransition] = useTransition();

  function handleSubmit(data: BudgetItemLimitUpdateForm) {
    const transformedData: BudgetItemLimitUpdate = {
      budgetItemId,
      newLimitInCents: Math.round(data.newLimitInCents * 100),
    };

    startTransition(async () => {
      const response = await updateBudgetItemLimitAction(transformedData);

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
          name="newLimitInCents"
          render={({ field, fieldState }) => (
            <Field>
              <FieldContent>
                <FieldLabel htmlFor={field.name}>Ange ny gräns</FieldLabel>
              </FieldContent>

              <InputGroup>
                <InputGroupInput
                  {...field}
                  id={field.name}
                  placeholder={(currentLimitInCents / 100).toString()}
                  autoComplete="off"
                  type="number"
                  step="0.01"
                  aria-invalid={fieldState.invalid}
                />

                <InputGroupAddon align="inline-end">
                  <InputGroupText>SEK</InputGroupText>
                </InputGroupAddon>
              </InputGroup>

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
