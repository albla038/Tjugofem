import { ItemGroup } from "@/components/ui/item";
import { ReactNode } from "react";

type TransactionGroupProps = {
  groupTitle: string;
  children: ReactNode;
};

export default function TransactionGroup({
  groupTitle,
  children,
}: TransactionGroupProps) {
  return (
    <div>
      <div className="sticky top-0 z-10 border-b border-border bg-background px-4 pt-1 pb-0.5 text-sm text-muted-foreground">
        {groupTitle}
      </div>

      <ItemGroup>{children}</ItemGroup>
    </div>
  );
}
