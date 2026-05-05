"use client";

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
import { Category } from "@/lib/generated/prisma/client";
import { TransactionType } from "@/lib/generated/prisma/enums";
import {
  TransactionForm,
  TransactionFormInput,
  transactionFormSchema,
} from "@/schemas/transaction";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { sv } from "date-fns/locale";
import { CalendarIcon, CircleDashed, Coins, Pen } from "lucide-react";
import { Controller, useForm } from "react-hook-form";

type TransactionFormUIProps = {
  defaultValues: TransactionFormInput;
  onSubmit: (data: TransactionForm, resetForm: () => void) => void;
  isPending: boolean;
  categories: Category[];
  onClose: () => void;
};

export default function TransactionFormUI({
  defaultValues,
  onSubmit,
  isPending,
  categories,
  onClose,
}: TransactionFormUIProps) {
  const form = useForm({
    resolver: zodResolver(transactionFormSchema),
    defaultValues,
  });

  return (
    <form
      onSubmit={form.handleSubmit((data) => {
        // Prevent submission if no changes have been made
        if (!form.formState.isDirty) return;

        onSubmit(data, form.reset);
      })}
      noValidate
    >
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
          <Button type="submit" disabled={isPending || !form.formState.isDirty}>
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
