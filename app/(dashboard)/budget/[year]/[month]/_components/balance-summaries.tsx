"use client";

import { Separator } from "@/components/ui/separator";
import { BadgeAlert, Pen, TrendingDown, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";

type BalanceSummariesProps = {
  openingBalanceInCents: number;
  currentBalanceInCents: number;
  plannedClosingBalanceInCents: number;
  prevMonthClosingBalanceInCents: number | null;
};

export default function BalanceSummaries({
  currentBalanceInCents,
  openingBalanceInCents,
  plannedClosingBalanceInCents,
  prevMonthClosingBalanceInCents,
}: BalanceSummariesProps) {
  const isOpeningBalanceDifferent = prevMonthClosingBalanceInCents
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

  const openingBalanceString = (openingBalanceInCents / 100).toLocaleString(
    "sv-SE",
    {
      style: "currency",
      currency: "SEK",
      maximumFractionDigits: 0,
    }
  );

  const currentBalanceString = (currentBalanceInCents / 100).toLocaleString(
    "sv-SE",
    {
      style: "currency",
      currency: "SEK",
      maximumFractionDigits: 0,
    }
  );

  const plannedClosingBalanceString = (
    plannedClosingBalanceInCents / 100
  ).toLocaleString("sv-SE", {
    style: "currency",
    currency: "SEK",
    maximumFractionDigits: 0,
  });

  return (
    <div>
      <div className="flex w-full items-center justify-between py-3">
        <span className="flex items-center gap-1">
          <span className="text-sm text-muted-foreground">Ingående saldo</span>
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
          <span className="text-sm text-muted-foreground">Utgående saldo</span>
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
        <span className="text-sm text-muted-foreground">Planerat resultat</span>

        <span className="text-sm font-semibold tabular-nums">
          {plannedClosingBalanceString}
        </span>
      </div>
    </div>
  );
}
