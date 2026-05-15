"use client";

import StartDateInfoPopover from "@/app/(dashboard)/budget/[year]/[month]/_components/start-date-info-popover";
import { createBudgetAction } from "@/app/(dashboard)/budget/[year]/[month]/action";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { MUTATION_ERROR_MESSAGE_FALLBACK } from "@/lib/error-message-fallbacks";
import { BudgetCreateForm, budgetFormSchema } from "@/schemas/budget";
import { ActionErrorCode } from "@/types/error-codes";
import { zodResolver } from "@hookform/resolvers/zod";
import { format, subDays } from "date-fns";
import { sv } from "date-fns/locale";
import { useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

function getErrorMessage(errorCode: ActionErrorCode) {
  switch (errorCode) {
    case "UNAUTHORIZED":
      return "Du måste vara inloggad för att skapa en budget.";
    case "VALIDATION_FAILED":
      return "Något gick fel med de angivna uppgifterna. Kontrollera och försök igen.";
    case "NOT_FOUND":
      return "Det gick inte att hitta föregående månads budget att kopiera. Den kanske har tagits bort?";
    default:
      return MUTATION_ERROR_MESSAGE_FALLBACK;
  }
}

const DAYS_BEFORE_FIRST = 11;

type NewBudgetFormProps = {
  currentMonthDate: Date;
  onClose: () => void;
  copyPrevMonth: boolean;
  prevMonthResultCents?: number;
};

export default function NewBudgetForm({
  currentMonthDate,
  onClose,
  copyPrevMonth,
  prevMonthResultCents,
}: NewBudgetFormProps) {
  const prevMonthResult = prevMonthResultCents
    ? prevMonthResultCents / 100
    : undefined;

  const form = useForm({
    resolver: zodResolver(budgetFormSchema),
    defaultValues: {
      openingBalance: prevMonthResult?.toString() ?? "0",
      startDay: "25",
    },
  });

  const [isPending, startTransition] = useTransition();

  function handleSubmit(data: BudgetCreateForm) {
    const transformedData = {
      startDay: data.startDay,
      openingBalanceInCents: Math.round(data.openingBalance * 100),
    };

    startTransition(async () => {
      const response = await createBudgetAction({
        ...transformedData,
        year: currentMonthDate.getFullYear(),
        monthIndex: currentMonthDate.getMonth(),
        copyPrevMonth,
      });

      if (!response.success) {
        toast.error(getErrorMessage(response.errorCode));
        return;
      }

      toast.success("Budget skapad");
      onClose();
    });
  }

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} noValidate>
      <FieldGroup>
        {/* Amount */}
        <Controller
          control={form.control}
          name="openingBalance"
          render={({ field, fieldState }) => (
            <Field>
              <FieldContent>
                <FieldLabel htmlFor={field.name}>Ingående saldo</FieldLabel>
                <FieldDescription>
                  <span className="block">Ange ett ingående saldo.</span>
                  {prevMonthResult && (
                    <span>
                      {`Förra månadens resultat: ${prevMonthResult.toLocaleString(
                        "sv-SE",
                        {
                          style: "currency",
                          currency: "SEK",
                        }
                      )}`}
                    </span>
                  )}
                </FieldDescription>
              </FieldContent>

              <InputGroup>
                <InputGroupInput
                  {...field}
                  id={field.name}
                  placeholder={
                    prevMonthResult
                      ? prevMonthResult.toLocaleString("sv-SE")
                      : "0"
                  }
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

        <FieldSeparator />

        {/* Start day */}
        <Controller
          control={form.control}
          name="startDay"
          render={({ field, fieldState }) => (
            <Field>
              <FieldContent>
                <div className="flex items-end">
                  <FieldLabel htmlFor={field.name}>Startdatum</FieldLabel>
                  <StartDateInfoPopover />
                </div>

                <FieldDescription>
                  Välj dagen då budgeten börjar gälla
                </FieldDescription>
              </FieldContent>
              <Select {...field} onValueChange={field.onChange}>
                <SelectTrigger id={field.name}>
                  <SelectValue placeholder="Ange startdatum" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: DAYS_BEFORE_FIRST }, (_, i) => {
                    const daysToSubtract = DAYS_BEFORE_FIRST - 1 - i;
                    const date = subDays(currentMonthDate, daysToSubtract);
                    const dayLabel = format(date, "d MMMM", { locale: sv });
                    const dayKey = format(date, "d", { locale: sv });

                    return (
                      <SelectItem key={dayKey} value={dayKey}>
                        {dayLabel}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>

              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Field>
          <Button type="submit" disabled={isPending}>
            {isPending ? (
              <>
                <Spinner /> Skapar budget...
              </>
            ) : (
              "Skapa budget"
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
