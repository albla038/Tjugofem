import TransactionGroup from "@/app/(dashboard)/transactions/_components/transaction-group";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TransactionWithCategory } from "@/data/transaction/queries";

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
};

export default function TransactionList({
  transactions,
}: TransactionsListProps) {
  const monthGroups = groupTransactionsByMonth(transactions);

  return (
    <ScrollArea className="h-svh">
      {monthGroups.map(({ monthKey, transactions }) => (
        <TransactionGroup
          key={monthKey}
          groupTitle={monthKey.charAt(0).toUpperCase() + monthKey.slice(1)}
          transactions={transactions}
        />
      ))}
    </ScrollArea>
  );
}
