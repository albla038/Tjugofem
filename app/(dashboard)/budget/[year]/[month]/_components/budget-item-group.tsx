"use client";

import BudgetItem from "@/app/(dashboard)/budget/[year]/[month]/_components/budget-item";
import { ItemGroup } from "@/components/ui/item";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BudgetItemWithCategoryAndSum } from "@/types/budget";
import { ArrowUpDown } from "lucide-react";
import { useMemo, useState } from "react";

type SelectOption = "limit" | "sum" | "name";

type BudgetItemGroupProps = {
  title: string;
  items: BudgetItemWithCategoryAndSum[];
};

export default function BudgetItemGroup({
  title,
  items,
}: BudgetItemGroupProps) {
  const [sortOption, setSortOption] = useState<SelectOption>("limit");

  const sortedItems = useMemo(
    () =>
      items.sort((a, b) => {
        switch (sortOption) {
          case "limit":
            return b.limitInCents - a.limitInCents;
          case "sum":
            return b.sumInCents - a.sumInCents;
          case "name":
            return a.category.name.localeCompare(b.category.name);
          default:
            return 0;
        }
      }),
    [items, sortOption]
  );

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between gap-2">
        <div className="text-2xl font-semibold">{title}</div>

        <Select
          value={sortOption}
          onValueChange={(value) => setSortOption(value as SelectOption)}
        >
          <SelectTrigger size="sm" className="border-none shadow-none">
            <ArrowUpDown className="" />
            <SelectValue placeholder="Sortera efter" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Sortera efter</SelectLabel>
              <SelectItem value="limit">Planerat</SelectItem>
              <SelectItem value="sum">Faktiskt</SelectItem>
              <SelectItem value="name">Namn</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <ItemGroup>
        {sortedItems.map((item) => (
          <BudgetItem item={item} key={item.categoryId} />
        ))}
      </ItemGroup>
    </div>
  );
}
