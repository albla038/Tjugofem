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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CATEGORY_ICON_MAP } from "@/lib/category-icon-map";
import { transactionTypeTitleSingular } from "@/lib/constants";
import { TransactionType } from "@/lib/generated/prisma/enums";
import { CategoryCreate, categoryCreateSchema } from "@/schemas/category";
import { zodResolver } from "@hookform/resolvers/zod";
import { House, LucideIcon, Palette, Pen } from "lucide-react";
import { Controller, useForm } from "react-hook-form";

const DEFAULT_COLOR = "#1447e6";

type CategoryAddFormProps = {
  onClose: () => void;
};

export default function CategoryAddForm({ onClose }: CategoryAddFormProps) {
  const form = useForm({
    resolver: zodResolver(categoryCreateSchema),
    defaultValues: {
      name: "",
      type: "EXPENSE" as const,
      color: DEFAULT_COLOR,
      icon: "Home",
    },
  });

  function onSubmit(data: CategoryCreate) {
    // Return early if no changes were made
    if (!form.formState.isDirty) return;

    if (data.color === DEFAULT_COLOR) {
      data.color = undefined;
    }
    console.log(data);

    // Call Server Action

    // Close form
  }
  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="p-4">
      <FieldGroup>
        <div className="grid gap-2">
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
                  <InputGroupAddon align="inline-end">
                    <Pen />
                  </InputGroupAddon>
                </InputGroup>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
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

        <div className="grid grid-cols-2 gap-4">
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
          <Button type="submit" disabled={!form.formState.isDirty}>
            Spara
          </Button>
          <Button type="button" variant="outline" onClick={onClose}>
            Avbryt
          </Button>
        </Field>
      </FieldGroup>
    </form>
  );
}
