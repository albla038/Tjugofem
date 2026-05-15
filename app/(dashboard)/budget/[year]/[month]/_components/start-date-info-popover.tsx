import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Info } from "lucide-react";

export default function StartDateInfoPopover() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button size="icon-xs" variant="ghost" type="button" className="">
          <Info />
        </Button>
      </PopoverTrigger>

      <PopoverContent side="top" collisionPadding={{ left: 16, right: 16 }}>
        <PopoverHeader>
          <PopoverTitle>Budgetperiod</PopoverTitle>
          <PopoverDescription>
            Budgeten gäller från startdatumet till och med sista dagen i
            månaden, eller till nästa budgets startdatum
          </PopoverDescription>
        </PopoverHeader>
      </PopoverContent>
    </Popover>
  );
}
