"use client";

import Link from "next/link";
import { useState } from "react";
import { ExternalLink, Pencil, Star, Trash2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { Post } from "@/lib/supabase/types";
import { cn, formatDate } from "@/lib/utils";

export default function PostsTable({ initialPosts }: { initialPosts: Post[] }) {
  const supabase = createClient();
  const [posts, setPosts] = useState(initialPosts);

  async function remove(id: string, title: string) {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
    const previous = posts;
    setPosts((prev) => prev.filter((p) => p.id !== id));
    const { error } = await supabase.from("posts").delete().eq("id", id);
    if (error) {
      console.error("[posts] delete failed:", error.message);
      setPosts(previous);
    }
  }

  if (posts.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border bg-white p-12 text-center">
        <h2 className="text-lg">No articles yet</h2>
        <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-ink-muted">
          Create your first article and it will appear on the public Insights page
          as soon as you publish it.
        </p>
        <Link
          href="/admin/posts/new"
          className="mt-5 inline-block text-sm font-semibold text-navy underline underline-offset-4"
        >
          Write the first article
        </Link>
      </div>
    );
  }

  return (
    <div className="scroll-x">
      <table className="w-full min-w-[48rem] overflow-hidden rounded-xl border border-border bg-white text-left">
        <thead className="bg-muted/60 text-xs uppercase tracking-wide text-ink-muted">
          <tr>
            <th scope="col" className="px-5 py-3 font-semibold">Title</th>
            <th scope="col" className="px-5 py-3 font-semibold">Category</th>
            <th scope="col" className="px-5 py-3 font-semibold">Status</th>
            <th scope="col" className="px-5 py-3 font-semibold">Published</th>
            <th scope="col" className="px-5 py-3 text-right font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {posts.map((post) => (
            <tr key={post.id} className="text-sm">
              <td className="px-5 py-4">
                <span className="flex items-center gap-2 font-medium text-navy">
                  {post.is_featured && (
                    <Star className="h-3.5 w-3.5 fill-gold text-gold" aria-label="Featured" />
                  )}
                  {post.title}
                </span>
                <span className="mt-0.5 block text-xs text-ink-muted">/blog/{post.slug}</span>
              </td>
              <td className="px-5 py-4 text-ink-muted">{post.category}</td>
              <td className="px-5 py-4">
                <span
                  className={cn(
                    "rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize",
                    post.status === "published"
                      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                      : "border-border bg-muted text-ink-muted"
                  )}
                >
                  {post.status}
                </span>
              </td>
              <td className="px-5 py-4 text-ink-muted">
                {post.published_at ? formatDate(post.published_at) : "—"}
              </td>
              <td className="px-5 py-4">
                <div className="flex items-center justify-end gap-1">
                  {post.status === "published" && (
                    <a
                      href={`/blog/${post.slug}`}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={`View ${post.title} on the live site`}
                      className="rounded p-1.5 text-ink-muted transition-colors hover:text-navy"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  )}
                  <Link
                    href={`/admin/posts/${post.id}`}
                    aria-label={`Edit ${post.title}`}
                    className="rounded p-1.5 text-ink-muted transition-colors hover:text-navy"
                  >
                    <Pencil className="h-4 w-4" />
                  </Link>
                  <button
                    type="button"
                    onClick={() => remove(post.id, post.title)}
                    aria-label={`Delete ${post.title}`}
                    className="rounded p-1.5 text-ink-muted transition-colors hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
