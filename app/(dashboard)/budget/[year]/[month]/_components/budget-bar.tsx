"use client";

import { cn, getContrastColor } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";

type BudgetBarProps = {
  target: number;
  spent: number;
  color: string;
  reduceOpacity?: boolean;
};

export default function BudgetBar({
  target,
  spent,
  color,
  reduceOpacity = false,
}: BudgetBarProps) {
  const spentTextRef = useRef<HTMLSpanElement>(null);
  const remainingTextRef = useRef<HTMLSpanElement>(null);

  const [textWidths, setTextWidths] = useState({ spent: 0, remaining: 0 });

  const barColor = reduceOpacity ? color + "66" : color;
  const textColor = getContrastColor(barColor);

  useEffect(() => {
    if (!spentTextRef.current || !remainingTextRef.current) {
      return;
    }

    setTextWidths({
      spent: spentTextRef.current.clientWidth,
      remaining: remainingTextRef.current.clientWidth,
    });
  }, [target, spent]);

  const fraction = target === 0 ? 100 : Math.min((spent / target) * 100, 100);
  const includeTarget = fraction < 80;

  const remaining = target - spent;

  return (
    <>
      <div className="relative h-fit w-full rounded-full border border-border">
        <div
          className="h-6 rounded-[inherit]"
          style={{
            width: `${fraction}%`,
            minWidth: `${2 * 12 + textWidths.spent}px`,
            background: barColor,
            border: barColor,
          }}
        />

        <div className="absolute inset-0 flex items-center justify-between px-3">
          <span ref={spentTextRef} style={{ color: textColor }}>
            {spent.toLocaleString("sv-SE", {
              style: "currency",
              currency: "SEK",
            })}
          </span>
          <span
            ref={remainingTextRef}
            className={cn("text-muted-foreground", {
              "opacity-0": !includeTarget,
            })}
          >
            {remaining.toLocaleString("sv-SE", {
              style: "currency",
              currency: "SEK",
              maximumFractionDigits: 0,
            })}
          </span>
        </div>
      </div>
    </>
  );
}
