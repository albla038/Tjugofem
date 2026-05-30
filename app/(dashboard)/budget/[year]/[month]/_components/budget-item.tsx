"use client";

import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemFooter,
  ItemTitle,
} from "@/components/ui/item";
import BudgetBar from "./budget-bar";
import CategoryIcon from "@/components/category-icon";
import { BudgetItemWithCategoryAndSum } from "@/types/budget";
import { useState } from "react";
import Drawer from "@/components/drawer";
import EditBudgetItemLimitForm from "./edit-item-limit-form";
import { MoreVertical } from "lucide-react";

export default function BudgetItem({
  item,
}: {
  item: BudgetItemWithCategoryAndSum;
}) {
  const { category, sumInCents, limitInCents, id } = item;
  const [isEditing, setIsEditing] = useState(false);

  let spendingPercentage: number;
  let categoryTranslated: string;

  switch (category.type) {
    case "EXPENSE":
      categoryTranslated = "utgift";
      break;
    case "INCOME":
      categoryTranslated = "inkomst";
      break;
    default:
      categoryTranslated = "besparing";
  }

  // Calculate percentages and division by zero
  if (limitInCents === 0 && sumInCents === 0) {
    spendingPercentage = 100;
  } else if (limitInCents === 0) {
    spendingPercentage = 0;
  } else {
    spendingPercentage = Math.round((100 * sumInCents) / limitInCents);
  }

  return (
    <>
      <Item
        variant="outline"
        className="gap-2"
        onClick={() => setIsEditing(true)}
      >
        <ItemContent className="flex-row items-start gap-2">
          <CategoryIcon category={item.category} />
          <div className="w-full">
            <ItemDescription className="line-clamp-1 text-xs tracking-wider text-muted-foreground uppercase">
              {category.name}
            </ItemDescription>
            <ItemTitle className="text-2xl font-semibold tabular-nums">
              {(limitInCents / 100).toLocaleString("sv-SE", {
                style: "currency",
                currency: "SEK",
                maximumFractionDigits: 0,
              })}
            </ItemTitle>
          </div>
          <ItemActions>
            <MoreVertical className="size-4" />
          </ItemActions>
        </ItemContent>
        <ItemFooter>
          <BudgetBar
            spent={sumInCents / 100}
            target={limitInCents / 100}
            color={category.color}
            reduceOpacity={true}
          />
          <span className="flex min-w-10 shrink-0 justify-end text-sm tabular-nums">
            {spendingPercentage}%
          </span>
        </ItemFooter>
      </Item>

      <Drawer
        title={`Redigera ${categoryTranslated}`}
        description={`Ange ny summa för ${category.name}`}
        open={isEditing}
        onOpenChange={setIsEditing}
      >
        <EditBudgetItemLimitForm
          budgetItemId={id}
          currentLimitInCents={limitInCents}
          onClose={() => setIsEditing(false)}
        />
      </Drawer>
    </>
  );
}
