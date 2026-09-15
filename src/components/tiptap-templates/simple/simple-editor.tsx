"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

interface SimpleEditorProps {
  content?: string;
  editable?: boolean;
  className?: string;
}

export function SimpleEditor({
  content = "",
  editable = true,
  className = "",
}: SimpleEditorProps) {
  const editor = useEditor({
    extensions: [StarterKit],
    content,
    editable,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class:
          "prose prose-neutral dark:prose-invert max-w-none focus:outline-none px-6 py-6 " +
          "prose-headings:font-bold prose-blockquote:not-italic prose-blockquote:border-l-4 " +
          "prose-pre:bg-muted prose-code:before:content-none prose-code:after:content-none " +
          "prose-code:bg-muted prose-code:rounded prose-code:px-1.5 prose-code:py-0.5 prose-code:font-normal",
      },
    },
  });

  if (!editor) return null;

  return (
    <div className={`border rounded-lg overflow-hidden bg-background ${className}`}>
      <div className="max-h-150 overflow-y-auto [&_.is-editor-empty:first-child::before]:content-[attr(data-placeholder)] [&_.is-editor-empty:first-child::before]:float-left [&_.is-editor-empty:first-child::before]:text-muted-foreground [&_.is-editor-empty:first-child::before]:pointer-events-none [&_.is-editor-empty:first-child::before]:h-0">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}