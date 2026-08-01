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
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
