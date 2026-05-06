import {
  Activity,
  Banknote,
  BookOpenText,
  Bus,
  CalendarSync,
  Car,
  Coffee,
  Coins,
  CookingPot,
  Droplets,
  Dumbbell,
  Film,
  Gift,
  GraduationCap,
  HandCoins,
  Home,
  Music,
  PawPrint,
  PiggyBank,
  Plane,
  ShieldCheck,
  Shirt,
  ShoppingBag,
  ShoppingCart,
  Smartphone,
  Utensils,
  Wallet,
  Wifi,
  Zap,
  type LucideIcon,
} from "lucide-react";

export const CATEGORY_ICON_MAP: Record<string, LucideIcon> = {
  // Food & Drink
  Coffee,
  CookingPot,
  ShoppingCart, // Groceries
  Utensils, // Restaurants

  // Housing & Utilities
  Home, // Rent/Mortgage
  Zap, // Electricity
  Droplets, // Water
  Wifi, // Internet
  ShieldCheck, // Insurance
  CalendarSync, // Subscriptions (e.g., Netflix, Spotify)

  // Transportation
  Car, // Gas/Car Maintenance
  Bus, // Public Transit
  Plane, // Travel

  // Shopping & Lifestyle
  ShoppingBag, // General Shopping
  Shirt, // Clothing
  Smartphone, // Electronics/Phone bill
  Gift, // Gifts

  // Health & Fitness
  Activity, // Healthcare
  Dumbbell, // Gym

  // Entertainment & Education
  Film, // Movies/Subscriptions
  Music, // Music
  BookOpenText, // Books
  GraduationCap, // Education/Student Loans

  // Miscellaneous
  PawPrint, // Pets

  // Finance & Income
  Banknote, // Salary
  Coins, // Savings
  PiggyBank, // Investments
  Wallet, // General/Cash
  HandCoins
};
