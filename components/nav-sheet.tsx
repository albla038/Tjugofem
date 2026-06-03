"use client";

import { Button } from "@/components/ui/button";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { authClient } from "@/lib/auth-client";
import { Calendar1, Menu, Shapes, Wallet } from "lucide-react";
import Link from "next/link";
import NavUser from "./nav-user";

export default function NavSheet() {
  const { data: session } = authClient.useSession();

  const user = session?.user;

  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth() + 1;

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
            href={`/budget/${year}/${month}`}
            className="flex items-center gap-2 text-xl font-medium"
          >
            <Calendar1 /> Månadsbudgetar
          </Link>
          <Link
            href="/transactions"
            className="flex items-center gap-2 text-xl font-medium"
          >
            <Wallet />
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

        {!!user && (
          <SheetFooter>
            <NavUser user={user} />
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
}
