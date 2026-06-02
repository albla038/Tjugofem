import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Wallet } from "lucide-react";

export default function EmptyTransactionList() {
  return (
    <div className="flex h-[calc(100svh-170px)] items-center justify-center">
      <Empty>
        <EmptyHeader>
          <EmptyMedia>
            <Wallet className="bg-none" />
          </EmptyMedia>
          <EmptyTitle>Du har inga transaktioner ännu</EmptyTitle>
          <EmptyDescription>
            Skapa en ny transaktion för att komma igång
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    </div>
  );
}
