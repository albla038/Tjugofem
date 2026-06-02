import NewBudget from "@/app/(dashboard)/budget/[year]/[month]/_components/new-budget";
import { paramsSchema } from "@/app/(dashboard)/budget/[year]/[month]/schemas";
import {
  calculateBudgetClosingBalance,
  calculateBudgetSummary,
  checkIfBudgetExists,
} from "@/data/budget/queries";
import { requireUser } from "@/data/user/verify-user";
import { getPrevMonth } from "@/lib/utils";
import { notFound } from "next/navigation";
import TypeSummaryItem from "./_components/type-summary-item";
import { ItemGroup } from "@/components/ui/item";
import BalanceSummaries from "@/app/(dashboard)/budget/[year]/[month]/_components/balance-summaries";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import RadialChart from "./_components/radial-chart";
import BudgetItemGroup from "@/app/(dashboard)/budget/[year]/[month]/_components/budget-item-group";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import Header from "@/components/header";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { format } from "date-fns";
import { sv } from "date-fns/locale";
import { ChevronLeft, ChevronRight, MoreVertical } from "lucide-react";

export default async function BudgetPage({
  params,
}: PageProps<"/budget/[year]/[month]">) {
  await requireUser();

  const validatedParams = paramsSchema.safeParse(await params);
  if (!validatedParams.success) {
    notFound();
  }
  const { year, month } = validatedParams.data;

  const monthIndex = month - 1;

  const currentMonthDate = new Date(year, monthIndex);

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

  // Fetch data for the budget month
  const budgetData = await calculateBudgetSummary(year, monthIndex);

  // Display create new budget if no budget exists for the month
  if (!budgetData) {
    const { year: prevMonthYear, monthIndex: prevMonthIndex } = getPrevMonth(
      year,
      monthIndex
    );
    const hasPrevMonthBudget = await checkIfBudgetExists(
      prevMonthYear,
      prevMonthIndex
    );

    return (
      <main className="flex h-full min-h-[calc(100svh-100px)] flex-col items-center justify-center gap-2 p-4">
        <NewBudget
          currentMonthDate={currentMonthDate}
          hasPrevMonthBudget={hasPrevMonthBudget}
        />
      </main>
    );
  }

  const { year: prevMonthYear, monthIndex: prevMonthIndex } = getPrevMonth(
    year,
    monthIndex
  );

  const prevMonthClosingBalanceInCents = await calculateBudgetClosingBalance({
    monthIndex: prevMonthIndex,
    year: prevMonthYear,
  });

  return (
    <div className="flex h-svh flex-col">
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

        <div className="ml-auto">
          {/* // TODO: Add dropdown menu */}
          <Button variant="ghost">
            <MoreVertical />
          </Button>
        </div>
      </Header>

      <ScrollArea className="h-full min-h-0">
        <main className="flex flex-col gap-8 p-4">
          {/* Display card with a summary card of the current balance vs the budget result */}
          <Card className="flex flex-col">
            <CardHeader className="justify-center text-center">
              <CardTitle className="tracking-wider text-muted-foreground uppercase">
                Summa utgifter
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 pb-0">
              <RadialChart
                valueInCents={budgetData.current.expenseSumInCents}
                maxValueInCents={budgetData.planned.expenseSumInCents}
                label="utgifter"
                showPercentage={true}
              />
            </CardContent>
            <CardFooter>
              <BalanceSummaries
                budgetData={budgetData}
                prevMonthClosingBalanceInCents={prevMonthClosingBalanceInCents}
              />
            </CardFooter>
          </Card>

          {/* Display summary items for income and savings */}
          <ItemGroup>
            <TypeSummaryItem
              name="Summa inkomster"
              currentValueInCents={budgetData.current.incomeSumInCents}
              plannedValueInCents={budgetData.planned.incomeSumInCents}
            />

            <TypeSummaryItem
              name="Summa sparande"
              currentValueInCents={budgetData.current.savingsSumInCents}
              plannedValueInCents={budgetData.planned.savingsSumInCents}
            />
          </ItemGroup>

          <Separator />

          {/* Display budget standings for each category */}
          <section className="flex flex-col gap-8">
            <BudgetItemGroup
              title="Inkomster"
              items={budgetData.budgetItems.INCOME}
            />

            <Separator />

            <BudgetItemGroup
              title="Utgifter"
              items={budgetData.budgetItems.EXPENSE}
            />

            <Separator />

            <BudgetItemGroup
              title="Sparande"
              items={budgetData.budgetItems.SAVING}
            />
          </section>
        </main>
      </ScrollArea>
    </div>
  );
}
