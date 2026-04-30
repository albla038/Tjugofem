"use client";

import TransactionDeleteAlert from "@/app/(dashboard)/transactions/_components/delete-alert";
import TransactionEditForm from "@/app/(dashboard)/transactions/_components/edit-form";
import CategoryIcon from "@/components/category-icon";
import Drawer from "@/components/drawer";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import { TransactionWithCategory } from "@/data/transaction/queries";
import { Category } from "@/lib/generated/prisma/client";
import { cn } from "@/lib/utils";
import { MoreVertical, Trash2 } from "lucide-react";
import { useState } from "react";

type TransactionItemProps = {
  item: TransactionWithCategory;
  categories: Category[];
};

export default function TransactionItem({
  item,
  categories,
}: TransactionItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleteAlertOpen, setDeleteAlertOpen] = useState(false);

  const date = item.date.toLocaleDateString("sv-SE");
  const amount = (item.amountInCents / 100).toLocaleString("sv-SE", {
    style: "currency",
    currency: "SEK",
  });
  const isExpense = item.type === "EXPENSE";
  const amountString = isExpense ? `-${amount}` : amount;

  return (
    <>
      <Item
        size="sm"
        className="cursor-pointer"
        onClick={() => setIsEditing(true)}
      >
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
          className={cn(
            "tabular-nums",
            item.type === "INCOME"
              ? "text-green-400"
              : item.type === "SAVING"
                ? "text-blue-400"
                : ""
          )}
        >
          {amountString}
        </ItemActions>
      </Item>

      <Drawer
        title="Redigera transaktion"
        description="Redigera koperia eller länka transaktion" // TODO: Is all of this implemented?
        open={isEditing}
        onOpenChange={setIsEditing}
        drawerAction={
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="icon" variant="ghost">
                <MoreVertical />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
              <DropdownMenuItem
                variant="destructive"
                onClick={() => setDeleteAlertOpen(true)}
              >
                <Trash2 /> Ta bort
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        }
      >
        <TransactionEditForm
          transaction={item}
          categories={categories}
          onClose={() => setIsEditing(false)}
        />
      </Drawer>

      <TransactionDeleteAlert
        open={isDeleteAlertOpen}
        onOpenChange={setDeleteAlertOpen}
        transactionId={item.id}
      />
    </>
  );
}
