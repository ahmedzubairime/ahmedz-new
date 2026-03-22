"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import CharacterCount from "@tiptap/extension-character-count";
import { useState } from "react";
import { UploadDialog } from "../media/UploadDialog";
import { SidebarIcon } from "../SidebarIcon";

type Folder = {
    id: string;
    name: string;
    parent_id: string | null;
};

type Props = {
    content: string;
    onChange: (html: string) => void;
    locale: string;
    mediaFolders?: Folder[];
    placeholder?: string;
    minHeight?: string;
};

export function RichTextEditor({ content, onChange, locale, mediaFolders = [], placeholder, minHeight = "min-h-[400px]" }: Props) {
    const [isImageDialogOpen, setIsImageDialogOpen] = useState(false);

    const editor = useEditor({
        extensions: [
            StarterKit,
            Image.configure({
                HTMLAttributes: {
                    class: "max-w-full rounded-xl shadow-md my-4",
                },
            }),
            Link.configure({
                openOnClick: false,
                HTMLAttributes: {
                    class: "text-[var(--brand-primary)] underline decoration-[var(--brand-primary)]/30 hover:decoration-[var(--brand-primary)] transition-colors",
                },
            }),
            Placeholder.configure({
                placeholder: placeholder || (locale === "ar" ? "ابدأ الكتابة هنا..." : "Start writing here..."),
            }),
            CharacterCount,
        ],
        content: content,
        immediatelyRender: false,
        editorProps: {
            attributes: {
                class: `prose prose-sm sm:prose-base dark:prose-invert max-w-none focus:outline-none ${minHeight} p-4 w-full`,
                dir: locale === "ar" ? "rtl" : "ltr",
            },
        },
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
    });

    if (!editor) {
        return <div className={`w-full ${minHeight} animate-pulse rounded-xl bg-zinc-100 dark:bg-zinc-800`} />;
    }

    const setLink = () => {
        const previousUrl = editor.getAttributes('link').href;
        const url = window.prompt('URL', previousUrl);

        if (url === null) return;
        if (url === '') {
            editor.chain().focus().extendMarkRange('link').unsetLink().run();
            return;
        }

        editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
    };

    return (
        <div className="flex flex-col overflow-hidden rounded-xl border border-zinc-200 bg-white transition-colors focus-within:border-[var(--brand-primary)] focus-within:ring-1 focus-within:ring-[var(--brand-primary)] dark:border-zinc-800 dark:bg-zinc-900">
            {/* Toolbar */}
            <div className="flex flex-wrap items-center gap-1 border-b border-zinc-200 bg-zinc-50 p-2 dark:border-zinc-800 dark:bg-zinc-800/50">
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    isActive={editor.isActive("bold")}
                    icon="bold" // You'll need to make sure this icon exists in SidebarIcon or use a generic one
                    title="Bold"
                />
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    isActive={editor.isActive("italic")}
                    icon="italic"
                    title="Italic"
                />
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleStrike().run()}
                    isActive={editor.isActive("strike")}
                    icon="strikethrough"
                    title="Strikethrough"
                />

                <div className="mx-1 h-6 w-px bg-zinc-300 dark:bg-zinc-700" />

                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                    isActive={editor.isActive("heading", { level: 2 })}
                    icon="heading-2"
                    title="Heading 2"
                />
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                    isActive={editor.isActive("heading", { level: 3 })}
                    icon="heading-3"
                    title="Heading 3"
                />

                <div className="mx-1 h-6 w-px bg-zinc-300 dark:bg-zinc-700" />

                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    isActive={editor.isActive("bulletList")}
                    icon="list"
                    title="Bullet List"
                />
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    isActive={editor.isActive("orderedList")}
                    icon="list-ordered"
                    title="Ordered List"
                />
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleBlockquote().run()}
                    isActive={editor.isActive("blockquote")}
                    icon="quote"
                    title="Blockquote"
                />

                <div className="mx-1 h-6 w-px bg-zinc-300 dark:bg-zinc-700" />

                <ToolbarButton
                    onClick={setLink}
                    isActive={editor.isActive("link")}
                    icon="link"
                    title="Insert Link"
                />
                <ToolbarButton
                    onClick={() => setIsImageDialogOpen(true)}
                    isActive={false}
                    icon="image"
                    title="Insert Image"
                />
            </div>

            {/* Editor Canvas */}
            <EditorContent editor={editor} className="cursor-text custom-scrollbar overflow-y-auto" />

            {/* Footer Metrics */}
            <div className="flex items-center justify-between border-t border-zinc-100 bg-zinc-50 px-3 py-1.5 text-xs text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900">
                <span>
                    {editor.storage.characterCount.words()} {locale === "ar" ? "كلمة" : "words"}
                </span>
                <span>
                    {editor.storage.characterCount.characters()} {locale === "ar" ? "حرف" : "chars"}
                </span>
            </div>

            {/* Image Upload Dialog */}
            {isImageDialogOpen && (
                <UploadDialog
                    folders={mediaFolders}
                    bucket="images"
                    defaultFolderId="all"
                    locale={locale}
                    onClose={() => setIsImageDialogOpen(false)}
                    onSuccess={(urls) => {
                        setIsImageDialogOpen(false);
                        if (urls && urls.length > 0) {
                            urls.forEach(url => {
                                editor.chain().focus().setImage({ src: url }).run();
                            });
                        }
                    }}
                />
            )}
        </div>
    );
}

function ToolbarButton({ onClick, isActive, icon, title }: { onClick: () => void; isActive: boolean; icon: string; title: string }) {
    // If you don't have these specific icons mapping correctly in SidebarIcon, 
    // it will render the fallback. Make sure to map these or use Lucide directly if needed.
    return (
        <button
            onClick={onClick}
            type="button"
            title={title}
            className={`flex size-8 cursor-pointer items-center justify-center rounded transition-colors ${isActive
                ? "bg-[var(--brand-primary)] text-white"
                : "text-zinc-600 hover:bg-zinc-200 dark:text-zinc-400 dark:hover:bg-zinc-700"
                }`}
        >
            <SidebarIcon name={icon} className="size-4" />
        </button>
    );
}
