"use client";

import { Button } from "@/components/ui/button";
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
} from "@/components/ui/input-group";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CATEGORY_ICON_MAP } from "@/lib/category-icon-map";
import { transactionTypeTitleSingular } from "@/lib/constants";
import { TransactionType } from "@/lib/generated/prisma/enums";
import { CategoryCreate, categoryCreateSchema } from "@/schemas/category";
import { zodResolver } from "@hookform/resolvers/zod";
import { Palette, Pen } from "lucide-react";
import { Controller, useForm } from "react-hook-form";

type CategoryFormUIProps = {
  defaultValues: CategoryCreate;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: CategoryCreate) => void;
  isPending: boolean;
};

export default function CategoryFormUI({
  defaultValues,
  onOpenChange,
  onSubmit,
  isPending,
}: CategoryFormUIProps) {
  const form = useForm({
    resolver: zodResolver(categoryCreateSchema),
    defaultValues,
  });

  return (
    <form
      onSubmit={form.handleSubmit((data) => {
        // Prevent submission if no changes have been made
        if (!form.formState.isDirty) return;

        onSubmit(data);
      })}
      noValidate
    >
      <FieldGroup className="gap-1">
        <div className="grid h-[135.25px]">
          {/* Name */}
          <Controller
            control={form.control}
            name="name"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Namn</FieldLabel>
                <div className="grid gap-1">
                  <InputGroup>
                    <InputGroupInput
                      {...field}
                      id={field.name}
                      autoComplete="off"
                      placeholder="Ange fritext..."
                      aria-invalid={fieldState.invalid}
                    />
                    <InputGroupAddon align="inline-end">
                      <Pen />
                    </InputGroupAddon>
                  </InputGroup>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} className="mb-2" />
                  )}
                </div>
              </Field>
            )}
          />

          {/* Transaction type */}
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

        <div className="grid grid-cols-2 gap-4 mb-6">
          {/* Color */}
          <Controller
            control={form.control}
            name="color"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Färg</FieldLabel>
                <InputGroup>
                  <InputGroupInput
                    {...field}
                    id={field.name}
                    autoComplete="off"
                    type="color"
                    aria-invalid={fieldState.invalid}
                  />
                  <InputGroupAddon>
                    <Palette />
                  </InputGroupAddon>
                </InputGroup>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          {/* Icon*/}
          <Controller
            control={form.control}
            name="icon"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>Ikon</FieldLabel>
                <Select {...field} onValueChange={field.onChange}>
                  {/* <Select> */}
                  <SelectTrigger>
                    <SelectValue placeholder="Välj ikon" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {Object.keys(CATEGORY_ICON_MAP).map((key) => {
                        const Icon = CATEGORY_ICON_MAP[key];
                        return (
                          <SelectItem value={key} key={key}>
                            <Icon />
                          </SelectItem>
                        );
                      })}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </Field>
            )}
          />
        </div>

        {/* Action buttons */}
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
          <Button
            type="button"
            variant="outline"
            className="cursor-pointer"
            onClick={() => onOpenChange(false)}
          >
            Avbryt
          </Button>
        </Field>
      </FieldGroup>
    </form>
  );
}
