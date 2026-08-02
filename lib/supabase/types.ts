export type LeadStatus = "new" | "contacted" | "qualified" | "won" | "lost" | "archived";
export type PostStatus = "draft" | "published";
export type UploadStatus = "new" | "downloaded" | "archived";

export type Lead = {
  id: string;
  created_at: string;
  name: string;
  email: string;
  company: string | null;
  phone: string | null;
  services: string[];
  message: string | null;
  source_page: string | null;
  status: LeadStatus;
  notes: string | null;
};

export type Post = {
  id: string;
  created_at: string;
  updated_at: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  author: string;
  cover_url: string | null;
  cover_alt: string | null;
  meta_title: string | null;
  meta_description: string | null;
  is_featured: boolean;
  status: PostStatus;
  published_at: string | null;
};

export type UploadedFile = {
  name: string;
  path: string;
  size: number;
  type: string;
};

export type DocumentSubmission = {
  id: string;
  created_at: string;
  name: string;
  email: string;
  company: string | null;
  phone: string | null;
  notes: string | null;
  files: UploadedFile[];
  total_size: number;
  status: UploadStatus;
};

export type ResourceKind = "case_study" | "event" | "guide";

export type Resource = {
  id: string;
  created_at: string;
  updated_at: string;
  kind: ResourceKind;
  slug: string;
  title: string;
  summary: string;
  content: string;
  cover_url: string | null;
  cover_alt: string | null;
  client_name: string | null;
  industry: string | null;
  outcome: string | null;
  starts_at: string | null;
  location: string | null;
  registration_url: string | null;
  file_url: string | null;
  gated: boolean;
  meta_title: string | null;
  meta_description: string | null;
  is_featured: boolean;
  status: PostStatus;
  published_at: string | null;
};

export type GuideDownload = {
  id: string;
  created_at: string;
  resource_id: string | null;
  title: string;
  name: string;
  email: string;
  company: string | null;
  phone: string | null;
};

export type NewsletterSubscriber = {
  id: string;
  created_at: string;
  email: string;
  source_page: string | null;
  status: "subscribed" | "unsubscribed";
};

export type SiteSetting = {
  key: string;
  value: string | null;
  label: string;
  group_name: string;
  sort_order: number;
  updated_at: string;
};

/**
 * Hand-written to match what supabase-js expects from `supabase gen types`.
 * The Views/Functions/Enums/CompositeTypes keys and the per-table Relationships
 * key are required by the generic — omit them and every `.insert()` argument
 * degrades to `never[]`.
 */
export type Database = {
  public: {
    Tables: {
      leads: {
        Row: Lead;
        Insert: Partial<Lead> & Pick<Lead, "name" | "email">;
        Update: Partial<Lead>;
        Relationships: [];
      };
      posts: {
        Row: Post;
        Insert: Partial<Post> & Pick<Post, "slug" | "title">;
        Update: Partial<Post>;
        Relationships: [];
      };
      document_submissions: {
        Row: DocumentSubmission;
        Insert: Partial<Omit<DocumentSubmission, "files">> &
          Pick<DocumentSubmission, "name" | "email"> & { files?: UploadedFile[] };
        Update: Partial<DocumentSubmission>;
        Relationships: [];
      };
      site_settings: {
        Row: SiteSetting;
        Insert: Partial<SiteSetting> & Pick<SiteSetting, "key" | "label">;
        Update: Partial<SiteSetting>;
        Relationships: [];
      };
      resources: {
        Row: Resource;
        Insert: Partial<Resource> & Pick<Resource, "kind" | "slug" | "title">;
        Update: Partial<Resource>;
        Relationships: [];
      };
      guide_downloads: {
        Row: GuideDownload;
        Insert: Partial<GuideDownload> & Pick<GuideDownload, "title" | "name" | "email">;
        Update: Partial<GuideDownload>;
        Relationships: [];
      };
      newsletter_subscribers: {
        Row: NewsletterSubscriber;
        Insert: Partial<NewsletterSubscriber> & Pick<NewsletterSubscriber, "email">;
        Update: Partial<NewsletterSubscriber>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
