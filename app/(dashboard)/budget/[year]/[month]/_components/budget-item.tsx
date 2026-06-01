"use client";

import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemFooter,
  ItemTitle,
} from "@/components/ui/item";
import CategoryIcon from "@/components/category-icon";
import { BudgetItemWithCategoryAndSum } from "@/types/budget";
import { useState } from "react";
import Drawer from "@/components/drawer";
import EditBudgetItemLimitForm from "./edit-item-limit-form";
import { MoreVertical } from "lucide-react";
import { formatCentsToStrSEK } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";

export default function BudgetItem({
  item,
}: {
  item: BudgetItemWithCategoryAndSum;
}) {
  const { category, sumInCents, limitInCents, id } = item;

  const [isEditing, setIsEditing] = useState(false);

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

  // Calculate percentages and handle division by zero
  let percentage: number | null;
  if (limitInCents === 0 && sumInCents > 0) {
    percentage = null;
  } else if (limitInCents === 0) {
    percentage = 0;
  } else {
    percentage = Math.round((100 * sumInCents) / limitInCents);
  }

  return (
    <>
      <Item
        variant="outline"
        className="gap-2"
        onClick={() => setIsEditing(true)}
      >
        <ItemContent className="gap-3">
          <div className="flex items-start gap-2">
            <CategoryIcon category={item.category} />
            <div className="w-full">
              <ItemDescription className="line-clamp-1 text-xs tracking-wider text-muted-foreground uppercase">
                {category.name}
              </ItemDescription>
              <ItemTitle className="text-2xl font-semibold tabular-nums">
                {formatCentsToStrSEK(sumInCents)}
              </ItemTitle>
            </div>
            <ItemActions>
              <MoreVertical className="size-4" />
            </ItemActions>
          </div>
          <Progress
            value={percentage !== null ? percentage : 100}
            indicatorClassName="bg-chart-3"
          />
        </ItemContent>

        <ItemFooter>
          <span className="text-sm text-muted-foreground">
            {percentage !== null ? <span>{percentage}</span> : ">100"}%
          </span>
          <span className="text-sm font-medium tabular-nums">
            {formatCentsToStrSEK(limitInCents, 0)}
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
