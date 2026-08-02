import {
  Archive,
  BookOpen,
  Calculator,
  FileCheck,
  FileText,
  Receipt,
  ShieldCheck,
  TrendingUp,
  Users,
  type LucideIcon,
} from "lucide-react";

/** Named icons referenced as strings from the data files. */
export const icons: Record<string, LucideIcon> = {
  Archive,
  BookOpen,
  Calculator,
  FileCheck,
  FileText,
  Receipt,
  ShieldCheck,
  TrendingUp,
  Users,
};

export const getIcon = (name: string): LucideIcon => icons[name] ?? FileText;
