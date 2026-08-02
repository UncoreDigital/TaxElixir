"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { EditorContent, useEditor, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import ImageExt from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import LinkExt from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Highlight from "@tiptap/extension-highlight";
import Color from "@tiptap/extension-color";
import { TextStyle } from "@tiptap/extension-text-style";
import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  Bold,
  Heading2,
  Heading3,
  Heading4,
  Highlighter,
  ImagePlus,
  Italic,
  Link as LinkIcon,
  List,
  ListOrdered,
  Loader2,
  Minus,
  Palette,
  Quote,
  Redo2,
  RemoveFormatting,
  Type,
  Underline as UnderlineIcon,
  Undo2,
  Unlink,
} from "lucide-react";
import { FontSize } from "@/components/admin/extensions/FontSize";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

/**
 * Admin rich-text editor, ported from the Anchor build and extended.
 *
 * Beyond Anchor's toolbar it adds drag-and-drop and paste image upload straight
 * into the `post-media` bucket, and it constrains headings to H2–H4 — the page
 * already owns the single H1, and letting an author insert a second one from
 * the editor is how a CMS quietly breaks a site's heading structure.
 */

const COLORS = [
  "#0C2748", "#1B3D66", "#46586F", "#7A8798",
  "#C0A854", "#CBA85A", "#D8B460", "#8A6F2E",
  "#1E7A5E", "#A4353A", "#2563EB", "#111827",
];

const HIGHLIGHTS = [
  "#FEF3C7", "#FDE68A", "#D9F99D", "#A7F3D0",
  "#BFDBFE", "#DDD6FE", "#FBCFE8", "#FFFFFF",
];

const FONT_SIZES = [
  { label: "Small", value: "14px" },
  { label: "Normal", value: "16px" },
  { label: "Medium", value: "18px" },
  { label: "Large", value: "20px" },
  { label: "Extra large", value: "24px" },
];

function TB({
  onClick,
  active,
  label,
  disabled,
  children,
}: {
  onClick: () => void;
  active?: boolean;
  label: string;
  disabled?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      aria-pressed={active}
      title={label}
      className={cn(
        "rounded p-2 text-ink-muted transition-colors hover:bg-slate-100 hover:text-navy disabled:opacity-35",
        active && "bg-navy text-white hover:bg-navy hover:text-white"
      )}
    >
      {children}
    </button>
  );
}

const Divider = () => <span className="mx-1 h-6 w-px bg-slate-200" aria-hidden="true" />;

function Toolbar({
  editor,
  onPickImage,
  uploading,
}: {
  editor: Editor;
  onPickImage: () => void;
  uploading: boolean;
}) {
  const [colorOpen, setColorOpen] = useState(false);
  const [highlightOpen, setHighlightOpen] = useState(false);
  const [sizeOpen, setSizeOpen] = useState(false);

  const setLink = () => {
    const previous = editor.getAttributes("link").href as string | undefined;
    const url = window.prompt("Link URL", previous ?? "https://");
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor
      .chain()
      .focus()
      .extendMarkRange("link")
      .setLink({ href: url, target: "_blank", rel: "noopener noreferrer" })
      .run();
  };

  return (
    <div className="sticky top-0 z-10 flex flex-wrap items-center gap-0.5 border-b border-slate-200 bg-slate-50/95 p-1.5 backdrop-blur-sm">
      {/* Font size */}
      <div className="relative">
        <TB onClick={() => setSizeOpen((v) => !v)} label="Font size" active={sizeOpen}>
          <Type className="h-4 w-4" />
        </TB>
        {sizeOpen && (
          <div className="absolute left-0 top-full z-20 mt-1 w-44 rounded-lg border border-slate-200 bg-white p-1 shadow-lift">
            {FONT_SIZES.map((s) => (
              <button
                key={s.value}
                type="button"
                onClick={() => {
                  editor.chain().focus().setFontSize(s.value).run();
                  setSizeOpen(false);
                }}
                className="flex w-full items-center justify-between rounded px-3 py-2 text-sm text-ink hover:bg-slate-100"
              >
                {s.label}
                <span className="text-xs text-ink-muted">{s.value}</span>
              </button>
            ))}
            <button
              type="button"
              onClick={() => {
                editor.chain().focus().unsetFontSize().run();
                setSizeOpen(false);
              }}
              className="w-full rounded px-3 py-2 text-left text-sm text-ink-muted hover:bg-slate-100"
            >
              Reset
            </button>
          </div>
        )}
      </div>

      {/* Text colour */}
      <div className="relative">
        <TB onClick={() => setColorOpen((v) => !v)} label="Text colour" active={colorOpen}>
          <Palette className="h-4 w-4" />
        </TB>
        {colorOpen && (
          <div className="absolute left-0 top-full z-20 mt-1 rounded-lg border border-slate-200 bg-white p-2 shadow-lift">
            <div className="grid grid-cols-4 gap-1.5">
              {COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  aria-label={`Set text colour ${c}`}
                  onClick={() => {
                    editor.chain().focus().setColor(c).run();
                    setColorOpen(false);
                  }}
                  className="h-6 w-6 rounded border border-slate-200 transition-transform hover:scale-110"
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
            <button
              type="button"
              onClick={() => {
                editor.chain().focus().unsetColor().run();
                setColorOpen(false);
              }}
              className="mt-2 w-full rounded px-2 py-1.5 text-xs text-ink-muted hover:bg-slate-100"
            >
              Remove colour
            </button>
          </div>
        )}
      </div>

      {/* Highlight */}
      <div className="relative">
        <TB onClick={() => setHighlightOpen((v) => !v)} label="Highlight" active={highlightOpen}>
          <Highlighter className="h-4 w-4" />
        </TB>
        {highlightOpen && (
          <div className="absolute left-0 top-full z-20 mt-1 rounded-lg border border-slate-200 bg-white p-2 shadow-lift">
            <div className="grid grid-cols-4 gap-1.5">
              {HIGHLIGHTS.map((c) => (
                <button
                  key={c}
                  type="button"
                  aria-label={c === "#FFFFFF" ? "Remove highlight" : `Highlight ${c}`}
                  onClick={() => {
                    if (c === "#FFFFFF") editor.chain().focus().unsetHighlight().run();
                    else editor.chain().focus().setHighlight({ color: c }).run();
                    setHighlightOpen(false);
                  }}
                  className="h-6 w-6 rounded border border-slate-200 transition-transform hover:scale-110"
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      <Divider />

      <TB onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive("bold")} label="Bold">
        <Bold className="h-4 w-4" />
      </TB>
      <TB onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive("italic")} label="Italic">
        <Italic className="h-4 w-4" />
      </TB>
      <TB onClick={() => editor.chain().focus().toggleUnderline().run()} active={editor.isActive("underline")} label="Underline">
        <UnderlineIcon className="h-4 w-4" />
      </TB>

      <Divider />

      {/* H1 is deliberately absent — the page owns it. */}
      <TB onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive("heading", { level: 2 })} label="Heading 2">
        <Heading2 className="h-4 w-4" />
      </TB>
      <TB onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} active={editor.isActive("heading", { level: 3 })} label="Heading 3">
        <Heading3 className="h-4 w-4" />
      </TB>
      <TB onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()} active={editor.isActive("heading", { level: 4 })} label="Heading 4">
        <Heading4 className="h-4 w-4" />
      </TB>

      <Divider />

      <TB onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive("bulletList")} label="Bullet list">
        <List className="h-4 w-4" />
      </TB>
      <TB onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive("orderedList")} label="Numbered list">
        <ListOrdered className="h-4 w-4" />
      </TB>
      <TB onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive("blockquote")} label="Quote">
        <Quote className="h-4 w-4" />
      </TB>
      <TB onClick={() => editor.chain().focus().setHorizontalRule().run()} label="Horizontal rule">
        <Minus className="h-4 w-4" />
      </TB>

      <Divider />

      <TB onClick={() => editor.chain().focus().setTextAlign("left").run()} active={editor.isActive({ textAlign: "left" })} label="Align left">
        <AlignLeft className="h-4 w-4" />
      </TB>
      <TB onClick={() => editor.chain().focus().setTextAlign("center").run()} active={editor.isActive({ textAlign: "center" })} label="Align centre">
        <AlignCenter className="h-4 w-4" />
      </TB>
      <TB onClick={() => editor.chain().focus().setTextAlign("right").run()} active={editor.isActive({ textAlign: "right" })} label="Align right">
        <AlignRight className="h-4 w-4" />
      </TB>
      <TB onClick={() => editor.chain().focus().setTextAlign("justify").run()} active={editor.isActive({ textAlign: "justify" })} label="Justify">
        <AlignJustify className="h-4 w-4" />
      </TB>

      <Divider />

      <TB onClick={setLink} active={editor.isActive("link")} label="Add link">
        <LinkIcon className="h-4 w-4" />
      </TB>
      <TB onClick={() => editor.chain().focus().unsetLink().run()} label="Remove link">
        <Unlink className="h-4 w-4" />
      </TB>
      <TB onClick={onPickImage} label="Insert image" disabled={uploading}>
        {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ImagePlus className="h-4 w-4" />}
      </TB>

      <span className="flex-1" />

      <TB onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()} label="Clear formatting">
        <RemoveFormatting className="h-4 w-4" />
      </TB>
      <Divider />
      <TB onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()} label="Undo">
        <Undo2 className="h-4 w-4" />
      </TB>
      <TB onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()} label="Redo">
        <Redo2 className="h-4 w-4" />
      </TB>
    </div>
  );
}

export default function RichTextEditor({
  value,
  onChange,
}: {
  value: string;
  onChange: (html: string) => void;
}) {
  const supabase = createClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadImage = useCallback(
    async (file: File, editor: Editor) => {
      if (!file.type.startsWith("image/")) return;
      setUploading(true);
      setError(null);

      const ext = file.name.split(".").pop() ?? "png";
      const name = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

      const { data, error: uploadError } = await supabase.storage
        .from("post-media")
        .upload(name, file, { cacheControl: "31536000", upsert: false });

      if (uploadError || !data) {
        setError(uploadError?.message ?? "Upload failed.");
        setUploading(false);
        return;
      }

      const { data: pub } = supabase.storage.from("post-media").getPublicUrl(data.path);
      if (pub?.publicUrl) {
        // Alt is left empty for the author to fill via the image's own markup;
        // an auto-generated filename as alt text is worse than none.
        editor.chain().focus().setImage({ src: pub.publicUrl, alt: "" }).run();
      }
      setUploading(false);
    },
    [supabase]
  );

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({ heading: { levels: [2, 3, 4] } }),
      TextStyle,
      Color,
      FontSize,
      Underline,
      Highlight.configure({ multicolor: true }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      LinkExt.configure({
        openOnClick: false,
        autolink: true,
        HTMLAttributes: { rel: "noopener noreferrer" },
      }),
      ImageExt.configure({ HTMLAttributes: { class: "rounded-lg" } }),
      Placeholder.configure({ placeholder: "Write the article…" }),
    ],
    content: value,
    onUpdate: ({ editor: e }) => onChange(e.getHTML()),
    editorProps: {
      attributes: { class: "prose-brand min-h-[24rem] px-5 py-4 focus:outline-none" },
      handleDrop: (_view, event, _slice, moved) => {
        if (moved || !event.dataTransfer?.files.length) return false;
        const images = Array.from(event.dataTransfer.files).filter((f) =>
          f.type.startsWith("image/")
        );
        if (!images.length) return false;
        event.preventDefault();
        images.forEach((img) => editor && uploadImage(img, editor));
        return true;
      },
      handlePaste: (_view, event) => {
        const items = event.clipboardData?.items;
        if (!items) return false;
        for (const item of Array.from(items)) {
          if (item.type.startsWith("image/")) {
            const file = item.getAsFile();
            if (file && editor) {
              event.preventDefault();
              uploadImage(file, editor);
              return true;
            }
          }
        }
        return false;
      },
    },
  });

  // Keep the editor in sync when the parent replaces content wholesale.
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value, false);
    }
    // Intentionally not depending on `editor.getHTML()` — that would loop.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, editor]);

  if (!editor) {
    return (
      <div className="rounded-md border border-input bg-white">
        <div className="h-12 border-b border-slate-200 bg-slate-50" />
        <div className="min-h-[24rem] px-5 py-4 text-sm text-ink-muted">Loading editor…</div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-md border border-input bg-white focus-within:border-gold focus-within:ring-1 focus-within:ring-gold">
      <Toolbar
        editor={editor}
        uploading={uploading}
        onPickImage={() => fileInputRef.current?.click()}
      />

      <div className="max-h-[60vh] overflow-y-auto">
        <EditorContent editor={editor} />
      </div>

      {error && (
        <p role="alert" className="border-t border-destructive/30 bg-destructive/5 px-5 py-2.5 text-xs text-destructive">
          {error}
        </p>
      )}

      <p className="border-t border-slate-200 bg-slate-50 px-5 py-2 text-xs text-ink-muted">
        Drag an image in, or paste one from the clipboard — it uploads automatically.
      </p>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="sr-only"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file && editor) uploadImage(file, editor);
          e.target.value = "";
        }}
      />
    </div>
  );
}
