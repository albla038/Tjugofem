import { paramsSchema } from "@/app/(dashboard)/budget/[year]/[month]/schemas";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from "date-fns";
import { sv } from "date-fns/locale";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function BudgetLayout({
  children,
  params,
}: LayoutProps<"/budget/[year]/[month]">) {
  const validatedParams = paramsSchema.safeParse(await params);

  if (!validatedParams.success) {
    notFound();
  }

  const { year, month } = validatedParams.data;

  const currentMonthDate = new Date(year, month - 1);

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
    <ScrollArea className="flex h-svh flex-col">
      <div className="flex justify-center">
        <div className="flex items-center">
          <Button asChild variant="ghost" size="icon-lg">
            <Link
              href={`/budget/${previousMonthDate.getFullYear()}/${previousMonthDate.getMonth() + 1}`}
            >
              <ChevronLeft className="size-4" />
            </Link>
          </Button>
          <h1 className="w-24 text-center font-bold">
            {currentMonthString.charAt(0).toLocaleUpperCase() +
              currentMonthString.slice(1)}
          </h1>
          <Button asChild variant="ghost" size="icon">
            <Link
              href={`/budget/${nextMonthDate.getFullYear()}/${nextMonthDate.getMonth() + 1}`}
            >
              <ChevronRight className="size-4" />
            </Link>
          </Button>
        </div>
      </div>

      {children}
    </ScrollArea>
  );
}
