"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Highlight from "@tiptap/extension-highlight";
import Subscript from "@tiptap/extension-subscript";
import Superscript from "@tiptap/extension-superscript";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import { useEffect, useRef } from "react";
import { Toolbar } from "./Toolbar";

interface TiptapEditorProps {
  content?: string;
  onChange?: (html: string) => void;
  placeholder?: string;
  editable?: boolean;
  className?: string;
}

export default function TiptapEditor({
  content = "",
  onChange,
  placeholder = "Start writing...",
  editable = true,
  className = "",
}: TiptapEditorProps) {
  const lastEmittedHtmlRef = useRef<string | null>(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3, 4] },
      }),
      Underline,
      Highlight.configure({
        multicolor: false,
        HTMLAttributes: { class: "bg-yellow-200 dark:bg-yellow-500/40 rounded px-0.5" },
      }),
      Subscript,
      Superscript,
      TaskList.configure({
        HTMLAttributes: { class: "not-prose list-none pl-1 space-y-1" },
      }),
      TaskItem.configure({
        nested: true,
        HTMLAttributes: { class: "flex items-start gap-2" },
      }),
      Link.configure({
        openOnClick: false,
        autolink: true,
      }),
      Image.configure({ inline: false }),
      Placeholder.configure({ placeholder }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
    ],
    content,
    editable,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class:
          "prose prose-neutral dark:prose-invert max-w-none focus:outline-none px-6 py-6 " +
          "prose-headings:font-bold prose-blockquote:not-italic prose-blockquote:border-l-4 " +
          "prose-pre:bg-muted prose-code:before:content-none prose-code:after:content-none " +
          "prose-code:bg-muted prose-code:rounded prose-code:px-1.5 prose-code:py-0.5 prose-code:font-normal " +
          "prose-img:rounded-md prose-a:text-primary",
      },
    },
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      lastEmittedHtmlRef.current = html;
      onChange?.(html);
    },
  });

  useEffect(() => {
    if (!editor || content === undefined) return;

    // If the content matches what the user just typed and emitted, do not reset
    if (content === lastEmittedHtmlRef.current) return;

    // If the content already matches the current editor HTML, do not reset
    const currentHtml = editor.getHTML();
    if (content === currentHtml) return;

    // Ignore differences when both are effectively empty
    const isEffectivelyEmpty =
      (!content || content === "<p></p>" || content.trim() === "") &&
      (editor.isEmpty || currentHtml === "<p></p>" || currentHtml.trim() === "");
    if (isEffectivelyEmpty) return;

    // External change (e.g. initial fetch from server)
    editor.commands.setContent(content, { emitUpdate: false });
    lastEmittedHtmlRef.current = content;
  }, [content, editor]);

  if (!editor) return null;

  return (
    <div className={`border rounded-lg overflow-hidden bg-background ${className}`}>
      {editable && <Toolbar editor={editor} />}
      <div className="max-h-150 overflow-y-auto [&_.is-editor-empty:first-child::before]:content-[attr(data-placeholder)] [&_.is-editor-empty:first-child::before]:float-left [&_.is-editor-empty:first-child::before]:text-muted-foreground [&_.is-editor-empty:first-child::before]:pointer-events-none [&_.is-editor-empty:first-child::before]:h-0">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}