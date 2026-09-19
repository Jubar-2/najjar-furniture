"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import type { Editor } from "@tiptap/react";
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
import Typography from "@tiptap/extension-typography";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Toolbar } from "./Toolbar";
import { cn } from "@/lib/utils";

interface TiptapEditorProps {
  content?: string;
  onChange?: (html: string) => void;
  placeholder?: string;
  editable?: boolean;
  className?: string;
  minHeight?: string;
  maxHeight?: string;
  showWordCount?: boolean;
  stickyToolbar?: boolean;
}

export default function TiptapEditor({
  content = "",
  onChange,
  placeholder = "Start writing...",
  editable = true,
  className = "",
  minHeight = "min-h-[260px]",
  maxHeight = "max-h-[600px]",
  showWordCount = true,
  stickyToolbar = true,
}: TiptapEditorProps) {
  const lastEmittedHtmlRef = useRef<string | null>(null);
  const pendingHtmlRef = useRef<string | null>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Safely extract stats without heavy string operations
  const getStatsFromEditor = (editorInstance: Editor) => {
    const text = editorInstance.state.doc.textContent || "";
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    const characters = text.length;
    return { words, characters };
  };

  const [stats, setStats] = useState({ words: 0, characters: 0 });

  const flushChange = useCallback(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = null;
    }
    if (pendingHtmlRef.current !== null && pendingHtmlRef.current !== lastEmittedHtmlRef.current) {
      const htmlToEmit = pendingHtmlRef.current;
      lastEmittedHtmlRef.current = htmlToEmit;
      pendingHtmlRef.current = null;
      onChange?.(htmlToEmit);
    }
  }, [onChange]);

  const extensions = useMemo(
    () => [
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
        HTMLAttributes: {
          class: "text-primary underline underline-offset-2 hover:text-primary/80 transition-colors",
        },
      }),
      Image.configure({
        inline: false,
        HTMLAttributes: {
          class: "rounded-lg border shadow-xs max-w-full my-4 object-contain",
        },
      }),
      Placeholder.configure({
        placeholder,
        emptyEditorClass: "is-editor-empty",
      }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Typography,
    ],
    [placeholder]
  );

  const editor = useEditor({
    extensions,
    content,
    editable,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: cn(
          "prose prose-neutral dark:prose-invert max-w-none focus:outline-none px-6 py-5 min-h-[220px]",
          "prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-foreground",
          "prose-p:leading-relaxed prose-p:text-foreground/90",
          "prose-blockquote:not-italic prose-blockquote:border-l-4 prose-blockquote:border-primary/60 prose-blockquote:bg-muted/30 prose-blockquote:py-1.5 prose-blockquote:px-4 prose-blockquote:rounded-r-sm",
          "prose-pre:bg-muted prose-code:before:content-none prose-code:after:content-none",
          "prose-code:bg-muted prose-code:rounded prose-code:px-1.5 prose-code:py-0.5 prose-code:font-normal",
          "prose-img:rounded-lg prose-img:border prose-img:shadow-xs prose-img:max-h-[500px] prose-img:object-contain",
          "prose-a:text-primary prose-a:underline prose-a:underline-offset-2 hover:prose-a:text-primary/80"
        ),
      },
      handleDOMEvents: {
        blur: () => {
          flushChange();
          return false;
        },
      },
    },
    onCreate: ({ editor }) => {
      setStats(getStatsFromEditor(editor));
    },
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      pendingHtmlRef.current = html;
      setStats(getStatsFromEditor(editor));

      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      debounceTimerRef.current = setTimeout(() => {
        flushChange();
      }, 200);
    },
  });

  // Keep editable state synced if prop changes dynamically
  useEffect(() => {
    if (editor && !editor.isDestroyed && editor.isEditable !== editable) {
      editor.setEditable(editable);
    }
  }, [editable, editor]);

  // Subscribe to editor transactions to keep word/character stats updated
  useEffect(() => {
    if (!editor) return;

    const handleTransaction = () => {
      const text = editor.state.doc.textContent || "";
      const words = text.trim() ? text.trim().split(/\s+/).length : 0;
      const characters = text.length;
      setStats({ words, characters });
    };

    editor.on("transaction", handleTransaction);
    return () => {
      editor.off("transaction", handleTransaction);
    };
  }, [editor]);

  // Synchronize external content changes without resetting active cursor
  useEffect(() => {
    if (!editor || content === undefined) return;

    // If the content matches what the user just typed and emitted, do not reset
    if (content === lastEmittedHtmlRef.current || content === pendingHtmlRef.current) return;

    // If the content already matches the current editor HTML, do not reset
    const currentHtml = editor.getHTML();
    if (content === currentHtml) {
      lastEmittedHtmlRef.current = content;
      return;
    }

    // Ignore differences when both are effectively empty
    const isEffectivelyEmpty =
      (!content || content === "<p></p>" || content.trim() === "") &&
      (editor.isEmpty || currentHtml === "<p></p>" || currentHtml.trim() === "");
    if (isEffectivelyEmpty) return;

    // External change (e.g. initial fetch from server or reset)
    editor.commands.setContent(content, { emitUpdate: false });
    lastEmittedHtmlRef.current = content;
    pendingHtmlRef.current = null;
  }, [content, editor]);

  // Cleanup debounced update on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      if (pendingHtmlRef.current !== null && pendingHtmlRef.current !== lastEmittedHtmlRef.current) {
        onChange?.(pendingHtmlRef.current);
      }
    };
  }, [onChange]);

  // Click on empty whitespace focuses the editor at the end
  const handleEditorContainerClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (editor && !editor.isFocused && e.target === e.currentTarget) {
      editor.chain().focus("end").run();
    }
  };

  if (!editor) return null;

  return (
    <div
      className={cn(
        "group flex flex-col rounded-xl border border-border/80 bg-background shadow-2xs transition-all duration-200",
        "focus-within:border-ring focus-within:ring-2 focus-within:ring-ring/20",
        className
      )}
    >
      {editable && (
        <div
          className={cn(
            "border-b border-border/70 bg-background/95 backdrop-blur-xs",
            stickyToolbar && "sticky top-0 z-10"
          )}
        >
          <Toolbar editor={editor} />
        </div>
      )}

      <div
        className={cn(
          "relative flex-1 overflow-y-auto scrollbar-thin transition-colors",
          editable ? "cursor-text" : "cursor-default",
          minHeight,
          maxHeight,
          // Placeholder styling
          "[&_.is-editor-empty:first-child::before]:content-[attr(data-placeholder)]",
          "[&_.is-editor-empty:first-child::before]:float-left",
          "[&_.is-editor-empty:first-child::before]:text-muted-foreground/50",
          "[&_.is-editor-empty:first-child::before]:pointer-events-none",
          "[&_.is-editor-empty:first-child::before]:h-0",
          // TaskList / TaskItem styling
          "[&_ul[data-type='taskList']]:list-none [&_ul[data-type='taskList']]:p-0 [&_ul[data-type='taskList']]:my-2",
          "[&_li[data-type='taskItem']]:flex [&_li[data-type='taskItem']]:items-start [&_li[data-type='taskItem']]:gap-2.5 [&_li[data-type='taskItem']]:my-1",
          "[&_li[data-type='taskItem']_input[type='checkbox']]:mt-1.5 [&_li[data-type='taskItem']_input[type='checkbox']]:size-4 [&_li[data-type='taskItem']_input[type='checkbox']]:rounded [&_li[data-type='taskItem']_input[type='checkbox']]:border-muted-foreground/40 [&_li[data-type='taskItem']_input[type='checkbox']]:cursor-pointer",
          "[&_li[data-type='taskItem'][data-checked='true']>div]:line-through [&_li[data-type='taskItem'][data-checked='true']>div]:opacity-60"
        )}
        onClick={handleEditorContainerClick}
      >
        <EditorContent editor={editor} />
      </div>

      {showWordCount && (
        <div className="flex items-center justify-between border-t border-border/60 bg-muted/20 px-4 py-2 text-xs text-muted-foreground select-none">
          <div className="flex items-center gap-2.5">
            <span>
              {stats.words} {stats.words === 1 ? "word" : "words"}
            </span>
            <span className="text-muted-foreground/40">•</span>
            <span>
              {stats.characters} {stats.characters === 1 ? "character" : "characters"}
            </span>
            {stats.words > 0 && (
              <>
                <span className="text-muted-foreground/40">•</span>
                <span>~{Math.max(1, Math.ceil(stats.words / 200))} min read</span>
              </>
            )}
          </div>
          <div className="flex items-center gap-2">
            {!editable && (
              <span className="rounded bg-muted px-1.5 py-0.5 text-[11px] font-medium text-muted-foreground">
                Read-only
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}