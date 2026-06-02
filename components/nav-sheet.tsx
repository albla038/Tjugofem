"use client";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Calendar1, Menu, ReceiptEuro, Shapes } from "lucide-react";
import Link from "next/link";

export default function NavSheet() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost">
          <Menu />
        </Button>
      </SheetTrigger>

      <SheetContent side="left" className="">
        <SheetHeader>
          <SheetTitle className="uppercase">Tjugofem</SheetTitle>
          <SheetDescription>Privatekonomi på ett ställe</SheetDescription>
        </SheetHeader>

        <nav className="flex flex-col gap-4 px-4">
          <Link
            href="/budget"
            className="flex items-center gap-2 text-xl font-medium"
          >
            <Calendar1 /> Månadsbudgetar
          </Link>
          <Link
            href="/transactions"
            className="flex items-center gap-2 text-xl font-medium"
          >
            <ReceiptEuro />
            Transaktioner
          </Link>
          <Link
            href="/settings/categories"
            className="flex items-center gap-2 text-xl font-medium"
          >
            <Shapes />
            Kategorier
          </Link>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
