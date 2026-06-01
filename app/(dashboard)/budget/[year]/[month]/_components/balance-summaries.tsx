"use client";

import { Separator } from "@/components/ui/separator";
import { BadgeAlert, Pen, TrendingDown, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import Drawer from "@/components/drawer";
import EditBudgetOpeningBalanceForm from "@/app/(dashboard)/budget/[year]/[month]/_components/edit-opening-balance-form";
import { BudgetSummary } from "@/types/budget";
import { formatCentsToSEK } from "@/lib/utils";

type BalanceSummariesProps = {
  budgetData: BudgetSummary;
  prevMonthClosingBalanceInCents: number | null;
};

export default function BalanceSummaries({
  budgetData,
  prevMonthClosingBalanceInCents,
}: BalanceSummariesProps) {
  const {
    currentBalanceInCents,
    openingBalanceInCents,
    plannedClosingBalanceInCents,
  } = budgetData;

  const [isEditingOpeningBalance, setIsEditingOpeningBalance] = useState(false);

  const isOpeningBalanceDifferent =
    prevMonthClosingBalanceInCents !== null
      ? prevMonthClosingBalanceInCents !== openingBalanceInCents
      : false;

  const savedPercentage =
    openingBalanceInCents !== 0
      ? Math.round(
          100 *
            ((currentBalanceInCents - openingBalanceInCents) /
              Math.abs(openingBalanceInCents))
        )
      : null;

  const openingBalanceString = formatCentsToSEK(openingBalanceInCents);
  const currentBalanceString = formatCentsToSEK(currentBalanceInCents);
  const plannedClosingBalanceString = formatCentsToSEK(
    plannedClosingBalanceInCents
  );

  const prevMonthClosingBalanceString =
    prevMonthClosingBalanceInCents !== null
      ? formatCentsToSEK(prevMonthClosingBalanceInCents)
      : null;

  return (
    <>
      <div className="w-full">
        <div
          className="flex w-full items-center justify-between py-3"
          onClick={() => setIsEditingOpeningBalance(true)}
        >
          <span className="flex items-center gap-1">
            <span className="text-sm text-muted-foreground">
              Ingående saldo
            </span>
            {isOpeningBalanceDifferent ? (
              <Badge className="bg-yellow-50 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300">
                <BadgeAlert /> <Pen />
              </Badge>
            ) : (
              <Badge variant="secondary">
                <Pen />
              </Badge>
            )}
          </span>

          <span className="flex items-center gap-1">
            <span className="text-sm font-semibold tabular-nums">
              {openingBalanceString}
            </span>
          </span>
        </div>

        <Separator />

        <div className="flex w-full items-center justify-between py-3">
          <span className="flex items-center gap-1">
            <span className="text-sm text-muted-foreground">
              Utgående saldo
            </span>
            {savedPercentage ? (
              <Badge className="bg-foreground text-background">
                {savedPercentage > 0 ? <TrendingUp /> : <TrendingDown />}
              </Badge>
            ) : null}
          </span>

          <span className="flex items-center gap-1">
            <span className="text-sm font-semibold tabular-nums">
              {currentBalanceString}
            </span>
          </span>
        </div>

        <Separator />

        <div className="flex w-full items-center justify-between py-3">
          <span className="text-sm text-muted-foreground">
            Planerat resultat
          </span>

          <span className="text-sm font-semibold tabular-nums">
            {plannedClosingBalanceString}
          </span>
        </div>
      </div>

      <Drawer
        open={isEditingOpeningBalance}
        onOpenChange={setIsEditingOpeningBalance}
        title="Ingående saldo"
        description="Här kan redigera månadens ingående saldo"
      >
        <div className="flex flex-col gap-6">
          {prevMonthClosingBalanceString && (
            <div className="flex flex-col gap-2">
              <p>
                Föregående månads utgående saldo:{" "}
                {isOpeningBalanceDifferent ? (
                  <Badge className="bg-yellow-50 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300">
                    <span className="font-semibold tabular-nums">
                      {prevMonthClosingBalanceString}
                    </span>
                    <BadgeAlert />
                  </Badge>
                ) : (
                  <span className="font-semibold tabular-nums">
                    {prevMonthClosingBalanceString}
                  </span>
                )}
              </p>
              {isOpeningBalanceDifferent && (
                <>
                  <p>
                    Ingående saldo överrensstämmer inte med föregående månads
                    utgående saldo.
                  </p>
                  <p> Om det är avsiktligt så kan du ignorera detta.</p>
                </>
              )}
            </div>
          )}

          <EditBudgetOpeningBalanceForm
            budgetId={budgetData.id}
            currentOpeningBalanceInCents={openingBalanceInCents}
            prevMonthClosingBalanceInCents={prevMonthClosingBalanceInCents}
            onClose={() => setIsEditingOpeningBalance(false)}
          />
        </div>
      </Drawer>
    </>
  );
}
