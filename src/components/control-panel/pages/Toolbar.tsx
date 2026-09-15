"use client";

import { useCallback, useEffect, useState } from "react";
import type { Editor } from "@tiptap/react";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  Code,
  Highlighter,
  LinkIcon,
  ImagePlus,
  Undo,
  Redo,
  Heading as HeadingIcon,
  List,
  ListOrdered,
  ListChecks,
  Quote,
  Code2,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Superscript as SuperscriptIcon,
  Subscript as SubscriptIcon,
  Search,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Toggle } from "@/components/ui/toggle";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Toolbar({ editor }: { editor: Editor }) {
  const [, forceRerender] = useState(0);

  // re-render toolbar on selection/transaction change so active states stay in sync
  useEffect(() => {
    const rerender = () => forceRerender((n) => n + 1);
    editor.on("selectionUpdate", rerender);
    editor.on("transaction", rerender);
    return () => {
      editor.off("selectionUpdate", rerender);
      editor.off("transaction", rerender);
    };
  }, [editor]);

  const setLink = useCallback(() => {
    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("URL", previousUrl);
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }, [editor]);

  const addImage = useCallback(() => {
    const url = window.prompt("Image URL");
    if (url) editor.chain().focus().setImage({ src: url }).run();
  }, [editor]);

  const activeHeadingLevel = [1, 2, 3, 4].find((level) =>
    editor.isActive("heading", { level })
  );

  return (
    <div className="flex flex-wrap items-center gap-px border-b bg-background px-2 py-1.5">
      <Button
        type="button"
        size="icon"
        variant="ghost"
        className="size-8"
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().undo()}
      >
        <Undo className="size-4" />
      </Button>
      <Button
        type="button"
        size="icon"
        variant="ghost"
        className="size-8"
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().redo()}
      >
        <Redo className="size-4" />
      </Button>

      <Separator orientation="vertical" className="mx-1 h-6" />

      {/* Heading dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button type="button" variant="ghost" size="sm" className="h-8 gap-1 px-2">
            <HeadingIcon className="size-4" />
            {activeHeadingLevel && (
              <span className="text-xs font-medium">{activeHeadingLevel}</span>
            )}
            <ChevronDown className="size-3 opacity-60" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuItem
            onClick={() => editor.chain().focus().setParagraph().run()}
          >
            Paragraph
          </DropdownMenuItem>
          {[1, 2, 3, 4].map((level) => (
            <DropdownMenuItem
              key={level}
              onClick={() =>
                editor
                  .chain()
                  .focus()
                  .toggleHeading({ level: level as 1 | 2 | 3 | 4 })
                  .run()
              }
            >
              Heading {level}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* List dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button type="button" variant="ghost" size="sm" className="h-8 gap-1 px-2">
            <List className="size-4" />
            <ChevronDown className="size-3 opacity-60" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuItem onClick={() => editor.chain().focus().toggleBulletList().run()}>
            <List className="size-4 mr-2" /> Bullet list
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => editor.chain().focus().toggleOrderedList().run()}>
            <ListOrdered className="size-4 mr-2" /> Ordered list
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => editor.chain().focus().toggleTaskList().run()}>
            <ListChecks className="size-4 mr-2" /> Task list
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Toggle
        size="sm"
        className="size-8 p-0"
        pressed={editor.isActive("blockquote")}
        onPressedChange={() => editor.chain().focus().toggleBlockquote().run()}
      >
        <Quote className="size-4" />
      </Toggle>

      <Toggle
        size="sm"
        className="size-8 p-0"
        pressed={editor.isActive("codeBlock")}
        onPressedChange={() => editor.chain().focus().toggleCodeBlock().run()}
      >
        <Code2 className="size-4" />
      </Toggle>

      <Separator orientation="vertical" className="mx-1 h-6" />

      <Toggle
        size="sm"
        className="size-8 p-0"
        pressed={editor.isActive("bold")}
        onPressedChange={() => editor.chain().focus().toggleBold().run()}
      >
        <Bold className="size-4" />
      </Toggle>
      <Toggle
        size="sm"
        className="size-8 p-0"
        pressed={editor.isActive("italic")}
        onPressedChange={() => editor.chain().focus().toggleItalic().run()}
      >
        <Italic className="size-4" />
      </Toggle>
      <Toggle
        size="sm"
        className="size-8 p-0"
        pressed={editor.isActive("strike")}
        onPressedChange={() => editor.chain().focus().toggleStrike().run()}
      >
        <Strikethrough className="size-4" />
      </Toggle>
      <Toggle
        size="sm"
        className="size-8 p-0"
        pressed={editor.isActive("code")}
        onPressedChange={() => editor.chain().focus().toggleCode().run()}
      >
        <Code className="size-4" />
      </Toggle>
      <Toggle
        size="sm"
        className="size-8 p-0"
        pressed={editor.isActive("underline")}
        onPressedChange={() => editor.chain().focus().toggleUnderline().run()}
      >
        <UnderlineIcon className="size-4" />
      </Toggle>
      <Toggle
        size="sm"
        className="size-8 p-0"
        pressed={editor.isActive("highlight")}
        onPressedChange={() => editor.chain().focus().toggleHighlight().run()}
      >
        <Highlighter className="size-4" />
      </Toggle>
      <Toggle size="sm" className="size-8 p-0" pressed={editor.isActive("link")} onPressedChange={setLink}>
        <LinkIcon className="size-4" />
      </Toggle>

      <Separator orientation="vertical" className="mx-1 h-6" />

      <Toggle
        size="sm"
        className="size-8 p-0"
        pressed={editor.isActive("superscript")}
        onPressedChange={() => editor.chain().focus().toggleSuperscript().run()}
      >
        <SuperscriptIcon className="size-4" />
      </Toggle>
      <Toggle
        size="sm"
        className="size-8 p-0"
        pressed={editor.isActive("subscript")}
        onPressedChange={() => editor.chain().focus().toggleSubscript().run()}
      >
        <SubscriptIcon className="size-4" />
      </Toggle>

      <Separator orientation="vertical" className="mx-1 h-6" />

      {/* Alignment — individual buttons, matches the reference toolbar */}
      <Toggle
        size="sm"
        className="size-8 p-0"
        pressed={editor.isActive({ textAlign: "left" })}
        onPressedChange={() => editor.chain().focus().setTextAlign("left").run()}
      >
        <AlignLeft className="size-4" />
      </Toggle>
      <Toggle
        size="sm"
        className="size-8 p-0"
        pressed={editor.isActive({ textAlign: "center" })}
        onPressedChange={() => editor.chain().focus().setTextAlign("center").run()}
      >
        <AlignCenter className="size-4" />
      </Toggle>
      <Toggle
        size="sm"
        className="size-8 p-0"
        pressed={editor.isActive({ textAlign: "right" })}
        onPressedChange={() => editor.chain().focus().setTextAlign("right").run()}
      >
        <AlignRight className="size-4" />
      </Toggle>
      <Toggle
        size="sm"
        className="size-8 p-0"
        pressed={editor.isActive({ textAlign: "justify" })}
        onPressedChange={() => editor.chain().focus().setTextAlign("justify").run()}
      >
        <AlignJustify className="size-4" />
      </Toggle>

      <Separator orientation="vertical" className="mx-1 h-6" />

      <Button type="button" size="sm" variant="ghost" className="h-8 gap-1 px-2" onClick={addImage}>
        <ImagePlus className="size-4" />
        <span className="text-xs">Add</span>
      </Button>

      <div className="ml-auto">
        <Button type="button" size="icon" variant="ghost" className="size-8">
          <Search className="size-4" />
        </Button>
      </div>
    </div>
  );
}