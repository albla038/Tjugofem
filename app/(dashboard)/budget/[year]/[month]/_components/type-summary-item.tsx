import {
  Item,
  ItemContent,
  ItemDescription,
  ItemFooter,
  ItemTitle,
} from "@/components/ui/item";
import { formatCentsToStrSEK } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";

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
  // Calculate percentages and handle division by zero
  let percentage: number | null;
  if (plannedValueInCents === 0 && currentValueInCents > 0) {
    percentage = null;
  } else if (plannedValueInCents === 0) {
    percentage = 0;
  } else {
    percentage = Math.round((100 * currentValueInCents) / plannedValueInCents);
  }

  return (
    <Item variant="muted" className="gap-2">
      <ItemContent className="gap-3">
        <div>
          <ItemDescription className="tracking-wider text-muted-foreground uppercase">
            {name}
          </ItemDescription>
          <ItemTitle className="text-2xl font-semibold tabular-nums">
            {formatCentsToStrSEK(currentValueInCents)}
          </ItemTitle>
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
          {formatCentsToStrSEK(plannedValueInCents, 0)}
        </span>
      </ItemFooter>
    </Item>
  );
}
