import { z } from "zod";

export const serviceOptions = [
  "Tax Preparation",
  "Back Year Tax Services",
  "Accounting & Bookkeeping",
  "CAAS / Client Advisory",
  "Audit Support",
  "Offshore Staffing",
  "Not sure yet",
] as const;

export const leadSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name").max(120),
  email: z.string().trim().email("Please enter a valid work email").max(200),
  company: z.string().trim().max(160).optional().or(z.literal("")),
  phone: z.string().trim().max(40).optional().or(z.literal("")),
  services: z.array(z.string().max(80)).max(10).default([]),
  message: z.string().trim().min(10, "Please tell us a little about the work").max(4000),
  sourcePage: z.string().max(300).optional().or(z.literal("")),
  consent: z.literal(true, {
    errorMap: () => ({ message: "Please confirm you agree to be contacted" }),
  }),
  /** Honeypot — must stay empty. Hidden from users, irresistible to bots. */
  website: z.string().max(0).optional().or(z.literal("")),
});

export type LeadInput = z.infer<typeof leadSchema>;

export const uploadMetaSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(200),
  company: z.string().trim().max(160).optional().or(z.literal("")),
  phone: z.string().trim().max(40).optional().or(z.literal("")),
  notes: z.string().trim().max(2000).optional().or(z.literal("")),
});

export const postSchema = z.object({
  title: z.string().trim().min(3, "Title is required").max(200),
  slug: z
    .string()
    .trim()
    .min(3, "Slug is required")
    .max(200)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers and hyphens only"),
  excerpt: z.string().trim().max(400),
  content: z.string(),
  category: z.string().trim().min(1).max(60),
  author: z.string().trim().min(1).max(120),
  cover_url: z.string().trim().url().or(z.literal("")).nullable().optional(),
  cover_alt: z.string().trim().max(200).optional().or(z.literal("")),
  meta_title: z.string().trim().max(70).optional().or(z.literal("")),
  meta_description: z.string().trim().max(165).optional().or(z.literal("")),
  is_featured: z.boolean(),
  status: z.enum(["draft", "published"]),
});
