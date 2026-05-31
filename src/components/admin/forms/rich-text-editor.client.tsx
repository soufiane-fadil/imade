"use client";

import * as React from "react";
import {
  Bold,
  Image as ImageIcon,
  Italic,
  Link as LinkIcon,
  List,
  ListOrdered,
  Minus,
  Quote,
  Redo2,
  Table as TableIcon,
  Underline as UnderlineIcon,
  Undo2,
} from "lucide-react";
import type { Editor } from "@tiptap/core";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import { Table } from "@tiptap/extension-table";
import { TableRow } from "@tiptap/extension-table-row";
import { TableCell } from "@tiptap/extension-table-cell";
import { TableHeader } from "@tiptap/extension-table-header";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { MediaPicker } from "@/components/admin/forms/media-picker";
import { useMedia } from "@/lib/admin/queries/use-medias";
import type { Media } from "@/lib/admin/types";
import { readingMinutesFromHtml } from "@/lib/admin/utils";
import { cn } from "@/lib/utils";

type RichTextEditorProps = {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  /** Min editor area height in px. Defaults to 220. */
  minHeight?: number;
  className?: string;
};

function countWords(html: string): number {
  const text = html
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (!text) return 0;
  return text.split(" ").length;
}

export default function RichTextEditor({
  value,
  onChange,
  placeholder,
  minHeight = 220,
  className,
}: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({ openOnClick: false, autolink: true }),
      Image,
      Table.configure({ resizable: false }),
      TableRow,
      TableHeader,
      TableCell,
    ],
    content: value || "",
    editorProps: {
      attributes: {
        class: cn("prose prose-sm max-w-none focus:outline-none wysiwyg__area"),
        style: `min-height:${minHeight}px`,
      },
    },
    onUpdate({ editor: instance }) {
      const html = instance.getHTML();
      onChange(html);
    },
    immediatelyRender: false,
  });

  // Keep editor content in sync when `value` is reset externally (e.g. form reset).
  React.useEffect(() => {
    if (!editor) return;
    const current = editor.getHTML();
    if (value !== current) {
      editor.commands.setContent(value || "", { emitUpdate: false });
    }
  }, [value, editor]);

  const words = React.useMemo(() => countWords(value || ""), [value]);
  const minutes = React.useMemo(
    () => readingMinutesFromHtml(value || ""),
    [value],
  );

  return (
    <div className={cn("wysiwyg", className)}>
      <Toolbar editor={editor} />
      <div className="relative">
        <EditorContent editor={editor} />
        {!value && placeholder ? (
          <div className="pointer-events-none absolute top-0 left-0 px-[18px] pt-[16px] text-[15px] text-ink-mute">
            {placeholder}
          </div>
        ) : null}
      </div>
      <div className="wysiwyg__foot">
        <span>Éditeur HTML · contenu enregistré en base</span>
        <span>
          ~ {words.toLocaleString("fr-FR")} mot{words > 1 ? "s" : ""} ·{" "}
          {minutes} min de lecture
        </span>
      </div>
    </div>
  );
}

type ToolbarProps = {
  editor: Editor | null;
};

function Toolbar({ editor }: ToolbarProps) {
  const [linkOpen, setLinkOpen] = React.useState(false);
  const [imageOpen, setImageOpen] = React.useState(false);
  const [linkHref, setLinkHref] = React.useState("");

  const isDisabled = !editor;

  const isActive = (predicate: (e: Editor) => boolean): boolean =>
    editor ? predicate(editor) : false;

  const openLinkDialog = () => {
    if (!editor) return;
    const existing = editor.getAttributes("link").href;
    setLinkHref(typeof existing === "string" ? existing : "");
    setLinkOpen(true);
  };

  const applyLink = () => {
    if (!editor) return;
    const trimmed = linkHref.trim();
    if (trimmed === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
    } else {
      editor
        .chain()
        .focus()
        .extendMarkRange("link")
        .setLink({ href: trimmed })
        .run();
    }
    setLinkOpen(false);
  };

  const removeLink = () => {
    if (!editor) return;
    editor.chain().focus().extendMarkRange("link").unsetLink().run();
    setLinkOpen(false);
  };

  return (
    <div className="wysiwyg__bar">
      {/* Group 1: H2 / H3 / ¶ */}
      <ToolbarButton
        label="Titre 2"
        active={isActive((e) => e.isActive("heading", { level: 2 }))}
        disabled={isDisabled}
        onClick={() =>
          editor?.chain().focus().toggleHeading({ level: 2 }).run()
        }
      >
        <span className="text-[11px] font-bold tracking-tight">H2</span>
      </ToolbarButton>
      <ToolbarButton
        label="Titre 3"
        active={isActive((e) => e.isActive("heading", { level: 3 }))}
        disabled={isDisabled}
        onClick={() =>
          editor?.chain().focus().toggleHeading({ level: 3 }).run()
        }
      >
        <span className="text-[11px] font-bold tracking-tight">H3</span>
      </ToolbarButton>
      <ToolbarButton
        label="Paragraphe"
        active={isActive((e) => e.isActive("paragraph"))}
        disabled={isDisabled}
        onClick={() => editor?.chain().focus().setParagraph().run()}
      >
        <span className="text-[14px] font-bold leading-none">¶</span>
      </ToolbarButton>

      <ToolbarDivider />

      {/* Group 2: B / I / U */}
      <ToolbarButton
        label="Gras"
        active={isActive((e) => e.isActive("bold"))}
        disabled={isDisabled}
        onClick={() => editor?.chain().focus().toggleBold().run()}
      >
        <Bold className="size-[14px]" />
      </ToolbarButton>
      <ToolbarButton
        label="Italique"
        active={isActive((e) => e.isActive("italic"))}
        disabled={isDisabled}
        onClick={() => editor?.chain().focus().toggleItalic().run()}
      >
        <Italic className="size-[14px]" />
      </ToolbarButton>
      <ToolbarButton
        label="Souligné"
        active={isActive((e) => e.isActive("underline"))}
        disabled={isDisabled}
        onClick={() => editor?.chain().focus().toggleUnderline().run()}
      >
        <UnderlineIcon className="size-[14px]" />
      </ToolbarButton>

      <ToolbarDivider />

      {/* Group 3: Quote / Bullet / Ordered */}
      <ToolbarButton
        label="Citation"
        active={isActive((e) => e.isActive("blockquote"))}
        disabled={isDisabled}
        onClick={() => editor?.chain().focus().toggleBlockquote().run()}
      >
        <Quote className="size-[14px]" />
      </ToolbarButton>
      <ToolbarButton
        label="Liste à puces"
        active={isActive((e) => e.isActive("bulletList"))}
        disabled={isDisabled}
        onClick={() => editor?.chain().focus().toggleBulletList().run()}
      >
        <List className="size-[14px]" />
      </ToolbarButton>
      <ToolbarButton
        label="Liste numérotée"
        active={isActive((e) => e.isActive("orderedList"))}
        disabled={isDisabled}
        onClick={() => editor?.chain().focus().toggleOrderedList().run()}
      >
        <ListOrdered className="size-[14px]" />
      </ToolbarButton>

      <ToolbarDivider />

      {/* Group 4: Link / Hr */}
      <ToolbarButton
        label="Lien"
        active={isActive((e) => e.isActive("link"))}
        disabled={isDisabled}
        onClick={openLinkDialog}
      >
        <LinkIcon className="size-[14px]" />
      </ToolbarButton>
      <ToolbarButton
        label="Ligne horizontale"
        disabled={isDisabled}
        onClick={() => editor?.chain().focus().setHorizontalRule().run()}
      >
        <Minus className="size-[14px]" />
      </ToolbarButton>

      <ToolbarDivider />

      {/* Group 5: Image / Table */}
      <ToolbarButton
        label="Image"
        disabled={isDisabled}
        onClick={() => setImageOpen(true)}
      >
        <ImageIcon className="size-[14px]" />
      </ToolbarButton>
      <ToolbarButton
        label="Tableau"
        disabled={isDisabled}
        onClick={() =>
          editor
            ?.chain()
            .focus()
            .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
            .run()
        }
      >
        <TableIcon className="size-[14px]" />
      </ToolbarButton>

      <ToolbarDivider />

      {/* Group 6: Undo / Redo */}
      <ToolbarButton
        label="Annuler"
        disabled={isDisabled || (editor ? !editor.can().undo() : true)}
        onClick={() => editor?.chain().focus().undo().run()}
      >
        <Undo2 className="size-[14px]" />
      </ToolbarButton>
      <ToolbarButton
        label="Rétablir"
        disabled={isDisabled || (editor ? !editor.can().redo() : true)}
        onClick={() => editor?.chain().focus().redo().run()}
      >
        <Redo2 className="size-[14px]" />
      </ToolbarButton>

      <Dialog open={linkOpen} onOpenChange={setLinkOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Insérer un lien</DialogTitle>
            <DialogDescription>
              Colle une URL absolue. Laisse vide pour retirer le lien.
            </DialogDescription>
          </DialogHeader>
          <div className="afield">
            <label>URL</label>
            <input
              autoFocus
              type="url"
              value={linkHref}
              onChange={(event) => setLinkHref(event.target.value)}
              placeholder="https://exemple.fr/article"
              className="ainput mono"
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  applyLink();
                }
              }}
            />
          </div>
          <DialogFooter>
            <button
              type="button"
              className="abtn"
              onClick={() => setLinkOpen(false)}
            >
              Annuler
            </button>
            {editor?.isActive("link") ? (
              <button
                type="button"
                className="abtn abtn--danger"
                onClick={removeLink}
              >
                Retirer
              </button>
            ) : null}
            <button
              type="button"
              className="abtn abtn--primary"
              onClick={applyLink}
            >
              Appliquer
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={imageOpen} onOpenChange={setImageOpen}>
        <DialogContent className="sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle>Insérer une image</DialogTitle>
            <DialogDescription>
              Choisis une image dans la bibliothèque.
            </DialogDescription>
          </DialogHeader>
          <ImagePickerForEditor
            onInsert={(media) => {
              if (!editor) return;
              editor
                .chain()
                .focus()
                .setImage({
                  src: media.url,
                  alt: media.alt ?? media.filename,
                })
                .run();
              setImageOpen(false);
            }}
          />
          <DialogFooter>
            <button
              type="button"
              className="abtn"
              onClick={() => setImageOpen(false)}
            >
              Fermer
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

type ToolbarButtonProps = {
  label: string;
  active?: boolean;
  disabled?: boolean;
  onClick: () => void;
  children: React.ReactNode;
};

function ToolbarButton({
  label,
  active,
  disabled,
  onClick,
  children,
}: ToolbarButtonProps) {
  return (
    <button
      type="button"
      className={cn("wysiwyg__btn", active && "is-on")}
      aria-label={label}
      title={label}
      aria-pressed={active}
      disabled={disabled}
      onMouseDown={(event) => {
        event.preventDefault();
      }}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

function ToolbarDivider() {
  return <span className="wysiwyg__sep" aria-hidden />;
}

type ImagePickerForEditorProps = {
  onInsert: (media: Media) => void;
};

/**
 * Wraps the shared MediaPicker so the editor can react to a media selection.
 * Once a media is picked, the user clicks "Insérer" to confirm — this avoids
 * implicit setState-in-effect patterns by tying the insert to a click.
 */
function ImagePickerForEditor({ onInsert }: ImagePickerForEditorProps) {
  const [selectedId, setSelectedId] = React.useState<string | null>(null);
  const { data: media } = useMedia(selectedId ?? undefined);

  const canInsert =
    media !== null && media !== undefined && media.kind === "image";

  return (
    <div className="flex flex-col gap-3">
      <MediaPicker
        mode="single"
        kind="image"
        value={selectedId}
        onChange={(id) => setSelectedId(id)}
        triggerLabel="Choisir une image"
      />
      <div className="flex justify-end">
        <button
          type="button"
          className="abtn abtn--primary disabled:opacity-50"
          disabled={!canInsert}
          onClick={() => {
            if (media && media.kind === "image") onInsert(media);
          }}
        >
          Insérer
        </button>
      </div>
    </div>
  );
}
