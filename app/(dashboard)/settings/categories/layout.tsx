import Header from "@/components/header";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ReactNode } from "react";

export default function CategoriesLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <ScrollArea className="flex h-svh flex-col">
      <Header>
        <h1 className="font-bold">Kategorier</h1>
      </Header>

      {children}
    </ScrollArea>
  );
}
