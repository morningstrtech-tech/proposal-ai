"use client";

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import { Bold, Italic, List, ListOrdered, Heading1, Heading2, Quote, Undo, Redo } from 'lucide-react'

interface RichTextEditorProps {
  content: string;
  onChange?: (content: string) => void;
}

/* Toolbar button styles — inline to avoid Tailwind dependency */
const toolbarStyle: React.CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  alignItems: "center",
  gap: "4px",
  padding: "8px 12px",
  borderBottom: "1px solid var(--border-color)",
  background: "var(--bg-main)",
  borderRadius: "12px 12px 0 0",
};

const btnBase: React.CSSProperties = {
  padding: "6px",
  borderRadius: "6px",
  border: "none",
  background: "transparent",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  transition: "background 0.15s ease, color 0.15s ease",
  color: "var(--text-muted)",
};

const btnActive: React.CSSProperties = {
  ...btnBase,
  background: "var(--active-bg)",
  color: "var(--primary)",
};

const btnDisabled: React.CSSProperties = {
  ...btnBase,
  opacity: 0.4,
  cursor: "not-allowed",
};

const dividerStyle: React.CSSProperties = {
  width: 1,
  height: 24,
  background: "var(--border-color)",
  margin: "0 4px",
};

const MenuBar = ({ editor }: { editor: any }) => {
  if (!editor) return null;

  const btn = (isActive: boolean, disabled?: boolean) =>
    disabled ? btnDisabled : isActive ? btnActive : btnBase;

  return (
    <div style={toolbarStyle} role="toolbar" aria-label="Format teks">
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        disabled={!editor.can().chain().focus().toggleBold().run()}
        style={btn(editor.isActive('bold'), !editor.can().chain().focus().toggleBold().run())}
        aria-label="Bold"
        aria-pressed={editor.isActive('bold')}
      >
        <Bold size={18} aria-hidden="true" />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        disabled={!editor.can().chain().focus().toggleItalic().run()}
        style={btn(editor.isActive('italic'), !editor.can().chain().focus().toggleItalic().run())}
        aria-label="Italic"
        aria-pressed={editor.isActive('italic')}
      >
        <Italic size={18} aria-hidden="true" />
      </button>

      <div style={dividerStyle} aria-hidden="true" />

      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        style={btn(editor.isActive('heading', { level: 1 }))}
        aria-label="Heading 1"
        aria-pressed={editor.isActive('heading', { level: 1 })}
      >
        <Heading1 size={18} aria-hidden="true" />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        style={btn(editor.isActive('heading', { level: 2 }))}
        aria-label="Heading 2"
        aria-pressed={editor.isActive('heading', { level: 2 })}
      >
        <Heading2 size={18} aria-hidden="true" />
      </button>

      <div style={dividerStyle} aria-hidden="true" />

      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        style={btn(editor.isActive('bulletList'))}
        aria-label="Bullet list"
        aria-pressed={editor.isActive('bulletList')}
      >
        <List size={18} aria-hidden="true" />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        style={btn(editor.isActive('orderedList'))}
        aria-label="Numbered list"
        aria-pressed={editor.isActive('orderedList')}
      >
        <ListOrdered size={18} aria-hidden="true" />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        style={btn(editor.isActive('blockquote'))}
        aria-label="Block quote"
        aria-pressed={editor.isActive('blockquote')}
      >
        <Quote size={18} aria-hidden="true" />
      </button>

      <div style={dividerStyle} aria-hidden="true" />

      <button
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().chain().focus().undo().run()}
        style={btn(false, !editor.can().chain().focus().undo().run())}
        aria-label="Undo"
      >
        <Undo size={18} aria-hidden="true" />
      </button>
      <button
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().chain().focus().redo().run()}
        style={btn(false, !editor.can().chain().focus().redo().run())}
        aria-label="Redo"
      >
        <Redo size={18} aria-hidden="true" />
      </button>
    </div>
  );
};

export default function RichTextEditor({ content, onChange }: RichTextEditorProps) {
  const CustomImage = Image.extend({
    addAttributes() {
      return {
        ...this.parent?.(),
        style: {
          default: null,
        },
        class: {
          default: null,
        }
      }
    }
  })

  const editor = useEditor({
    extensions: [StarterKit, CustomImage.configure({ inline: true })],
    content: content,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      if (onChange) {
        onChange(editor.getHTML());
      }
    },
    editorProps: {
      attributes: {
        class: 'prose-material',
        style: 'padding: 1.5rem; min-height: 400px; outline: none;',
      },
    },
  })

  return (
    <div
      style={{
        background: "var(--bg-card)",
        overflow: "hidden",
      }}
    >
      <MenuBar editor={editor} />
      <div style={{ background: "var(--bg-card)" }}>
        <EditorContent editor={editor} />
      </div>
    </div>
  )
}
