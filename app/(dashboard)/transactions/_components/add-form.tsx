"use client";

import { createTransactionAction } from "@/app/(dashboard)/transactions/actions";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Field,
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CATEGORY_ICON_MAP } from "@/lib/category-icon-map";
import { transactionTypeTitleSingular } from "@/lib/constants";
import { MUTATION_ERROR_MESSAGE_FALLBACK } from "@/lib/error-message-fallbacks";
import { Category } from "@/lib/generated/prisma/client";
import { TransactionType } from "@/lib/generated/prisma/enums";
import {
  TransactionCreate,
  TransactionCreateForm,
  transactionCreateFormSchema,
} from "@/schemas/transaction";
import { ActionErrorCode } from "@/types/error-codes";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { sv } from "date-fns/locale";
import { CalendarIcon, CircleDashed, Coins, Pen } from "lucide-react";
import { useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
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
  onClose: () => void;
};

export default function TransactionAddForm({
  categories,
  onClose,
}: TransactionAddFormProps) {
  const form = useForm({
    resolver: zodResolver(transactionCreateFormSchema),
    defaultValues: {
      amount: "",
      type: "EXPENSE" as const,
      name: "",
      date: new Date(),
      categoryId: "",
    },
  });

  const [isPending, startTransition] = useTransition();

  function onSubmit(data: TransactionCreateForm) {
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

      form.reset();
      toast.success(`${transactionTypeTitleSingular[data.type]} tillagd!`);
    });
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
      <FieldGroup>
        <div className="grid gap-2">
          {/* Amount */}
          <Controller
            control={form.control}
            name="amount"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Belopp</FieldLabel>
                <InputGroup>
                  <InputGroupInput
                    {...field}
                    id={field.name}
                    placeholder="200"
                    autoComplete="off"
                    type="number"
                    step="0.01"
                    aria-invalid={fieldState.invalid}
                  />
                  <InputGroupAddon align="inline-start">
                    <Coins />
                  </InputGroupAddon>
                  <InputGroupAddon align="inline-end">
                    <InputGroupText>SEK</InputGroupText>
                  </InputGroupAddon>
                </InputGroup>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          {/* Transaction type  */}
          <Controller
            control={form.control}
            name={"type"}
            render={({ field }) => (
              <Field>
                <Tabs {...field} onValueChange={field.onChange}>
                  <TabsList>
                    {Object.keys(TransactionType).map((key) => (
                      <TabsTrigger value={key} key={key}>
                        {transactionTypeTitleSingular[key as TransactionType]}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </Tabs>
              </Field>
            )}
          />
        </div>

        {/* Name */}
        <Controller
          control={form.control}
          name="name"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Namn</FieldLabel>
              <InputGroup>
                <InputGroupInput
                  {...field}
                  id={field.name}
                  autoComplete="off"
                  placeholder="Ange fritext..."
                  aria-invalid={fieldState.invalid}
                />
                <InputGroupAddon>
                  <Pen />
                </InputGroupAddon>
              </InputGroup>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          {/* Date */}
          <Controller
            control={form.control}
            name="date"
            render={({ field }) => (
              <Field>
                <FieldLabel htmlFor={field.name}>Datum</FieldLabel>
                <Popover>
                  <PopoverTrigger asChild id={field.name}>
                    <Button
                      variant="outline"
                      data-empty={!field.value}
                      className="justify-start font-normal data-[empty=true]:text-muted-foreground"
                    >
                      <CalendarIcon />
                      {format(field.value, "PP", { locale: sv })}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      defaultMonth={field.value}
                      captionLayout="dropdown"
                      fixedWeeks
                    />
                  </PopoverContent>
                </Popover>
              </Field>
            )}
          />

          {/* Category */}
          <Controller
            control={form.control}
            name="categoryId"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Kategori</FieldLabel>
                <Select {...field} onValueChange={field.onChange}>
                  <SelectTrigger id={field.name}>
                    <SelectValue placeholder="Välj kategori..." />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => {
                      const Icon =
                        category.icon && CATEGORY_ICON_MAP[category.icon];
                      return (
                        <SelectItem value={category.id} key={category.id}>
                          {Icon ? <Icon /> : <CircleDashed />}
                          {category.name}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </div>

        <Field>
          <Button type="submit" disabled={isPending}>
            {isPending ? (
              <>
                <Spinner /> Lägger till...
              </>
            ) : (
              "Lägg till"
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
