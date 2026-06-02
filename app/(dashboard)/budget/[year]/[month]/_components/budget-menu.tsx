"use client";

import BudgetDeleteAlert from "@/app/(dashboard)/budget/[year]/[month]/_components/budget-delete-alert";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical, Trash2 } from "lucide-react";
import { useState } from "react";

type BudgetMenuProps = {
  budgetId: string;
  name: string;
};

export default function BudgetMenu({ budgetId, name }: BudgetMenuProps) {
  const [isDeleteAlertOpen, setDeleteAlertOpen] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost">
            <MoreVertical />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-fit">
          <DropdownMenuGroup>
            <DropdownMenuLabel>Budgetalternativ</DropdownMenuLabel>
            <DropdownMenuItem
              variant="destructive"
              onClick={() => setDeleteAlertOpen(true)}
            >
              <Trash2 /> Ta bort
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      <BudgetDeleteAlert
        open={isDeleteAlertOpen}
        onOpenChange={setDeleteAlertOpen}
        name={name}
        budgetId={budgetId}
      />
    </>
  );
}
