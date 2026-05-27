import NewBudget from "@/app/(dashboard)/budget/[year]/[month]/_components/new-budget";
import { paramsSchema } from "@/app/(dashboard)/budget/[year]/[month]/schemas";
import {
  calculateBudgetSummary,
  checkIfBudgetExists,
} from "@/data/budget/queries";
import { requireUser } from "@/data/user/verify-user";
import { getPrevMonth } from "@/lib/utils";
import { notFound } from "next/navigation";

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
      <main className="flex h-full flex-col items-center justify-center gap-2 p-4">
        <NewBudget
          currentMonthDate={currentMonthDate}
          hasPrevMonthBudget={hasPrevMonthBudget}
        />
      </main>
    );
  }

  return (
    <main>
      <pre>{JSON.stringify(budgetData, null, 2)}</pre>
    </main>
  );
}
