"use client";

import TransactionItem from "@/app/(dashboard)/transactions/_components/transaction-item";
import { ItemGroup } from "@/components/ui/item";
import { TransactionWithCategory } from "@/data/transaction/queries";

type TransactionGroupProps = {
  groupTitle: string;
  transactions: TransactionWithCategory[];
};

export default function TransactionGroup({
  groupTitle,
  transactions,
}: TransactionGroupProps) {
  return (
    <div>
      <div className="sticky top-0 z-10 border-b border-border bg-background px-4 pt-1 pb-0.5 text-sm text-muted-foreground">
        {groupTitle}
      </div>

      <ItemGroup>
        {transactions.map((transaction) => (
          <TransactionItem key={transaction.id} item={transaction} />
        ))}
      </ItemGroup>
    </div>
  );
}
