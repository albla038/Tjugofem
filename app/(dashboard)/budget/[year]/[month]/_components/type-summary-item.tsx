import {
  Item,
  ItemContent,
  ItemDescription,
  ItemFooter,
} from "@/components/ui/item";
import BudgetBar from "./budget-bar";
import { formatCentsToStrSEK } from "@/lib/utils";

type TypeSummaryItemProps = {
  name: string;
  currentValueInCents: number;
  plannedValueInCents: number;
};

export default function TypeSummaryItem({
  name,
  currentValueInCents,
  plannedValueInCents,
}: TypeSummaryItemProps) {
  const percentage =
    plannedValueInCents === 0
      ? 100
      : Math.round(100 * (currentValueInCents / plannedValueInCents));

  const plannedValueString = formatCentsToStrSEK(plannedValueInCents, 0);

  return (
    <Item variant="muted">
      <ItemContent>
        <ItemDescription className="tracking-wider text-muted-foreground uppercase">
          {name}
        </ItemDescription>
        <span className="pb-2 text-2xl font-semibold tabular-nums">
          {plannedValueString}
        </span>
        <ItemFooter>
          <BudgetBar
            spent={currentValueInCents / 100}
            target={plannedValueInCents / 100}
            color={"#0a0a0a"}
            reduceOpacity={false}
          />
          <span className="flex min-w-10 shrink-0 justify-end text-sm tabular-nums">
            {percentage}%
          </span>
        </ItemFooter>
      </ItemContent>
    </Item>
  );
}
