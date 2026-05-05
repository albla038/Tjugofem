"use client";

import TransactionAddForm from "@/app/(dashboard)/transactions/_components/add-form";
import TransactionGroup from "@/app/(dashboard)/transactions/_components/transaction-group";
import TransactionItem from "@/app/(dashboard)/transactions/_components/transaction-item";
import Drawer from "@/components/drawer";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TransactionWithCategory } from "@/data/transaction/queries";
import { Category } from "@/lib/generated/prisma/client";
import { TransactionFormInput } from "@/schemas/transaction";
import { Plus } from "lucide-react";
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

const INITAL_FORM_VALUES = {
  amount: "",
  type: "EXPENSE",
  name: "",
  date: new Date(),
  categoryId: "",
} as const;

type TransactionsListProps = {
  transactions: TransactionWithCategory[];
  categories: Category[];
};

export default function TransactionList({
  transactions,
  categories,
}: TransactionsListProps) {
  const [isAddDrawerOpen, setAddDrawerOpen] = useState(false);
  const [defaultFormValues, setDefaultFormValues] =
    useState<TransactionFormInput>(INITAL_FORM_VALUES);

  const monthGroups = groupTransactionsByMonth(transactions);

  function handleDuplicateTransaction(transaction: TransactionWithCategory) {
    setDefaultFormValues({
      ...transaction,
      amount: (transaction.amountInCents / 100).toString(),
      date: new Date(),
    });
    setAddDrawerOpen(true);
  }

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
                onDuplicate={handleDuplicateTransaction}
              />
            ))}
          </TransactionGroup>
        ))}
      </ScrollArea>

      <Button
        size="icon-lg"
        className="fixed right-4 bottom-4 z-20 rounded-full"
        onClick={() => {
          setDefaultFormValues(INITAL_FORM_VALUES);
          setAddDrawerOpen(true);
        }}
      >
        <Plus />
      </Button>

      <Drawer
        title="Ny transaktion"
        description="Lägg till ny utgift, inkomst eller besparing"
        open={isAddDrawerOpen}
        onOpenChange={setAddDrawerOpen}
      >
        <TransactionAddForm
          defaultValues={defaultFormValues}
          categories={categories}
          onClose={() => setAddDrawerOpen(false)}
        />
      </Drawer>
    </>
  );
}
