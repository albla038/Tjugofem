import NavSheet from "@/components/nav-sheet";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

type HeaderProps = {
  children: ReactNode;
  className?: string;
};

export default function Header({ children, className }: HeaderProps) {
  return (
    <header
      className={cn(
        "sticky top-0 z-10 box-border flex h-[52px] items-center gap-2 border-b border-border bg-background p-2 shadow-xs",
        className
      )}
    >
      <NavSheet />

      {children}
    </header>
  );
}
