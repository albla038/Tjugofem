"use client";

import NewBudgetForm from "@/app/(dashboard)/budget/[year]/[month]/_components/new-budget-form";
import Drawer from "@/components/drawer";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { sv } from "date-fns/locale";
import { CalendarX } from "lucide-react";
import { useState } from "react";

type NewBudgetProps = {
  currentMonthDate: Date;
  hasPrevMonthBudget: boolean;
};

export default function NewBudget({
  currentMonthDate,
  hasPrevMonthBudget,
}: NewBudgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copyPrevMonth, setCopyPrevMonth] = useState(false);

  const currentMonthString = format(currentMonthDate, "MMMM yyyy", {
    locale: sv,
  });

  const currentMonthStringCapitalized =
    currentMonthString.charAt(0).toUpperCase() + currentMonthString.slice(1);

  return (
    <>
      <Drawer
        title="Skapa ny budget"
        description={`${currentMonthStringCapitalized}${copyPrevMonth ? ", (kopia från föregående månad)" : ""}`}
        open={isOpen}
        onOpenChange={setIsOpen}
      >
        <NewBudgetForm
          currentMonthDate={currentMonthDate}
          onClose={() => setIsOpen(false)}
          copyPrevMonth={copyPrevMonth}
        />
      </Drawer>

      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <CalendarX />
          </EmptyMedia>
          <EmptyTitle>Budget saknas</EmptyTitle>
          <EmptyDescription>
            {currentMonthStringCapitalized} saknar budget. Skapa en ny budget
            för att komma igång.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent className="gap-2">
          <Button
            className="w-full"
            onClick={() => {
              setCopyPrevMonth(false);
              setIsOpen(true);
            }}
          >
            Ny budget
          </Button>

          <Button
            variant="outline"
            disabled={!hasPrevMonthBudget}
            className={cn("w-full", {
              "opacity-0!": !hasPrevMonthBudget,
            })}
            onClick={() => {
              setCopyPrevMonth(true);
              setIsOpen(true);
            }}
          >
            Kopiera från föregående månad
          </Button>
        </EmptyContent>
      </Empty>
    </>
  );
}
