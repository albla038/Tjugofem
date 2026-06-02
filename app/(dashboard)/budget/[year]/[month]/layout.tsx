import { paramsSchema } from "@/app/(dashboard)/budget/[year]/[month]/schemas";
import Header from "@/components/header";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from "date-fns";
import { sv } from "date-fns/locale";
import { ChevronLeft, ChevronRight, MoreVertical } from "lucide-react";
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

      <ScrollArea className="h-full min-h-0">{children}</ScrollArea>
    </div>
  );
}
