import BudgetMenu from "@/app/(dashboard)/budget/[year]/[month]/_components/budget-menu";
import Header from "@/components/header";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { sv } from "date-fns/locale";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

type BudgetHeaderProps = {
  currentMonthDate: Date;
  budgetId?: string;
};

export default function BudgetHeader({
  currentMonthDate,
  budgetId,
}: BudgetHeaderProps) {
  const previousMonthDate = new Date(
    currentMonthDate.getFullYear(),
    currentMonthDate.getMonth() - 1
  );
  const nextMonthDate = new Date(
    currentMonthDate.getFullYear(),
    currentMonthDate.getMonth() + 1
  );

  const currentMonthString = format(currentMonthDate, "MMM yyyy", {
    locale: sv,
  });

  return (
    <Header>
      <div className="flex items-center">
        <h1 className="font-bold">
          Budget{" "}
          {currentMonthString.charAt(0).toLocaleUpperCase() +
            currentMonthString.slice(1)}
        </h1>

        <div className="flex items-center">
          <Button asChild variant="ghost" className="pr-1">
            <Link
              href={`/budget/${previousMonthDate.getFullYear()}/${previousMonthDate.getMonth() + 1}`}
            >
              <ChevronLeft className="size-4" />
            </Link>
          </Button>

          <Button asChild variant="ghost" className="pl-1">
            <Link
              href={`/budget/${nextMonthDate.getFullYear()}/${nextMonthDate.getMonth() + 1}`}
            >
              <ChevronRight className="size-4" />
            </Link>
          </Button>
        </div>
      </div>

      {!!budgetId && (
        <div className="ml-auto">
          <BudgetMenu budgetId={budgetId} name={currentMonthString} />
        </div>
      )}
    </Header>
  );
}
