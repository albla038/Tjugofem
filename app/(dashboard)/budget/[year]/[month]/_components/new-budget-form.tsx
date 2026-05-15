"use client";

import StartDateInfoPopover from "@/app/(dashboard)/budget/[year]/[month]/_components/start-date-info-popover";
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
import { BudgetCreate, budgetCreateSchema } from "@/schemas/budget";
import { zodResolver } from "@hookform/resolvers/zod";
import { format, subDays } from "date-fns";
import { sv } from "date-fns/locale";
import { useTransition } from "react";
import { Controller, useForm } from "react-hook-form";

const DAYS_BEFORE_FIRST = 11;

type NewBudgetFormProps = {
  currentMonthDate: Date;
  onClose: () => void;
  prevMonthResultCents?: number;
};

export default function NewBudgetForm({
  currentMonthDate,
  onClose,
  prevMonthResultCents,
}: NewBudgetFormProps) {
  const prevMonthResult = prevMonthResultCents
    ? prevMonthResultCents / 100
    : undefined;

  const form = useForm({
    resolver: zodResolver(budgetCreateSchema),
    defaultValues: {
      openingBalance: prevMonthResult?.toString() ?? "0",
      startDay: "25",
    },
  });

  const [isPending, startTransition] = useTransition();

  function handleSubmit(data: BudgetCreate) {
    const transformedData = {
      startDay: data.startDay,
      openingBalanceInCents: Math.round(data.openingBalance * 100),
    };

    startTransition(async () => {
      console.log("Form submitted!");
      console.log(transformedData);
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
