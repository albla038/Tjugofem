import { TransactionType } from "./generated/prisma/enums";

export const transactionTypeTitlePlural: Record<TransactionType, string> = {
  EXPENSE: "Utgifter",
  INCOME: "Inkomster",
  SAVING: "Sparande",
};

export const transactionTypeTitleSingular: Record<TransactionType, string> = {
  EXPENSE: "Utgift",
  INCOME: "Inkomst",
  SAVING: "Besparing",
};
