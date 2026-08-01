import {
  Archive,
  BookOpen,
  Calculator,
  FileText,
  ShieldCheck,
  Users,
  type LucideIcon,
} from "lucide-react";

/** Named icons referenced as strings from the data files. */
export const icons: Record<string, LucideIcon> = {
  Archive,
  BookOpen,
  Calculator,
  FileText,
  ShieldCheck,
  Users,
};

export const getIcon = (name: string): LucideIcon => icons[name] ?? FileText;
