"use client";

import TransactionAddForm from "@/app/(dashboard)/transactions/_components/add-form";
import TransactionGroup from "@/app/(dashboard)/transactions/_components/transaction-group";
import TransactionItem from "@/app/(dashboard)/transactions/_components/transaction-item";
import Drawer from "@/components/drawer";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TransactionWithCategory } from "@/data/transaction/queries";
import { Category } from "@/lib/generated/prisma/client";
import { MoreVertical, Plus } from "lucide-react";
import { useState } from "react";

function groupTransactionsByMonth(transactions: TransactionWithCategory[]) {
  const groups = new Map<string, TransactionWithCategory[]>();

  // Add transactions to their respective month groups
  transactions.forEach((transaction) => {
    const monthKey = transaction.date.toLocaleDateString("sv-SE", {
      year: "numeric",
      month: "long",
    });

    // Add empty array for the month if it doesn't exist
    if (!groups.get(monthKey)) {
      groups.set(monthKey, []);
    }

    const transactionsForMonth = groups.get(monthKey)!;
    transactionsForMonth.push(transaction);
  });

  // Convert to array for rendering
  return [...groups].map(([monthKey, transactions]) => ({
    monthKey,
    transactions,
  }));
}

type TransactionsListProps = {
  transactions: TransactionWithCategory[];
  categories: Category[];
};

export default function TransactionList({
  transactions,
  categories,
}: TransactionsListProps) {
  const [isAddDrawerOpen, setAddDrawerOpen] = useState(false);

  const monthGroups = groupTransactionsByMonth(transactions);

  return (
    <>
      <ScrollArea className="h-svh">
        {monthGroups.map(({ monthKey, transactions }) => (
          <TransactionGroup
            key={monthKey}
            groupTitle={monthKey.charAt(0).toUpperCase() + monthKey.slice(1)}
          >
            {transactions.map((transaction) => (
              <TransactionItem
                key={transaction.id}
                item={transaction}
                categories={categories}
              />
            ))}
          </TransactionGroup>
        ))}
      </ScrollArea>

      <Button
        size="icon-lg"
        className="fixed right-4 bottom-4 z-20 rounded-full"
        onClick={() => setAddDrawerOpen(true)}
      >
        <Plus />
      </Button>

      <Drawer
        title="Ny transaktion"
        description="Lägg till ny utgift, inkomst eller besparing"
        open={isAddDrawerOpen}
        onOpenChange={setAddDrawerOpen}
        drawerAction={
          // TODO: Add dropdownMenu
          <Button size="icon" variant="ghost" disabled>
            <MoreVertical />
          </Button>
        }
      >
        <TransactionAddForm
          categories={categories}
          onClose={() => setAddDrawerOpen(false)}
        />
      </Drawer>
    </>
  );
}
