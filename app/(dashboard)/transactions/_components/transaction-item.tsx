"use client";

import CategoryIcon from "@/components/category-icon";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import { TransactionWithCategory } from "@/data/transaction/queries";

type TransactionItemProps = {
  item: TransactionWithCategory;
  onClick: (id: string) => void;
};

export default function TransactionItem({
  item,
  onClick,
}: TransactionItemProps) {
  const date = item.date.toLocaleDateString("sv-SV");
  const amount = (item.amountInCents / 100).toLocaleString("sv-SV", {
    style: "currency",
    currency: "SEK",
  });
  const isExpense = item.type === "EXPENSE";
  const amountString = isExpense ? `-${amount}` : amount;

  return (
    <Item onClick={() => onClick(item.id)}>
      <ItemMedia>
        <CategoryIcon category={item.category} />
      </ItemMedia>
      <ItemContent>
        <ItemTitle>{item.name}</ItemTitle>
        <ItemDescription className="line-clamp-1">
          {date} • {item.category.name}
        </ItemDescription>
      </ItemContent>
      <ItemActions
        className={
          isExpense
            ? "text-red-400"
            : item.type === "INCOME"
              ? "text-green-400"
              : "text-blue-400"
        }
      >
        {amountString}
      </ItemActions>
    </Item>
  );
}
