"use client";

import Link from "@tiptap/extension-link";
import { useEditor, EditorContent } from "@tiptap/react";
import Placeholder from "@tiptap/extension-placeholder";
import StarterKit from "@tiptap/starter-kit";
import { useEffect } from "react";

type EmailEditorProps = {
  value: string;
  onChange: (html: string) => void;
};

export function EmailEditor({ value, onChange }: EmailEditorProps) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: true,
        autolink: true,
        linkOnPaste: true
      }),
      Placeholder.configure({
        placeholder: "Write your email body here. You can include placeholders like {{Name}}."
      })
    ],
    content: value,
    editorProps: {
      attributes: {
        class: "mail-editor"
      }
    },
    onUpdate: ({ editor: currentEditor }) => {
      onChange(currentEditor.getHTML());
    }
  });

  useEffect(() => {
    if (editor && editor.getHTML() !== value) {
      editor.commands.setContent(value, false);
    }
  }, [editor, value]);

  if (!editor) {
    return null;
  }

  function handleSetLink() {
    if (!editor) {
      return;
    }

    const previousUrl = editor.getAttributes("link").href as string | undefined;
    const url = window.prompt("Enter the full URL", previousUrl ?? "https://");

    if (url === null) {
      return;
    }

    const trimmedUrl = url.trim();

    if (!trimmedUrl) {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange("link").setLink({ href: trimmedUrl }).run();
  }

  return (
    <div>
      <div style={{ display: "flex", gap: "0.55rem", flexWrap: "wrap", marginBottom: "0.8rem" }}>
        <button className="btn btn-secondary" onClick={() => editor.chain().focus().toggleBold().run()} type="button">
          Bold
        </button>
        <button className="btn btn-secondary" onClick={() => editor.chain().focus().toggleItalic().run()} type="button">
          Italic
        </button>
        <button
          className="btn btn-secondary"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          type="button"
        >
          Bullets
        </button>
        <button
          className="btn btn-secondary"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          type="button"
        >
          Numbers
        </button>
        <button className="btn btn-secondary" onClick={handleSetLink} type="button">
          Link
        </button>
        <button
          className="btn btn-secondary"
          onClick={() => editor.chain().focus().extendMarkRange("link").unsetLink().run()}
          type="button"
        >
          Unlink
        </button>
      </div>
      <div className="prose-editor">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
