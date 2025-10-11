'use client';

import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Image } from '@tiptap/extension-image';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableCell } from '@tiptap/extension-table-cell';
import { TableHeader } from '@tiptap/extension-table-header';
import Placeholder from '@tiptap/extension-placeholder';
import { Controller, RegisterOptions, useFormContext } from 'react-hook-form';
import {
    Bold,
    Italic,
    List,
    ListOrdered,
    Heading2,
    Heading3,
    Heading4,
    Quote,
    Undo,
    Redo,
    ImageIcon,
    Table as TableIcon
} from 'lucide-react';
import { useState } from 'react';

import { Label } from '@/components/shared/label';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

// ----------------------------------------------------------------------

export type RHFEditorProps = {
    name: string;
    className?: string;
    label?: React.ReactNode;
    required?: boolean;
    placeholder?: string;
    rules?: RegisterOptions;
};

const MenuBar = ({
    editor,
    onImageClick,
    onTableClick
}: {
    editor: any;
    onImageClick: () => void;
    onTableClick: () => void;
}) => {
    if (!editor) {
        return null;
    }

    return (
        <div className='flex flex-wrap gap-1 p-2 border-b bg-muted/30'>
            <button
                type='button'
                onClick={() => editor.chain().focus().toggleBold().run()}
                className={cn(
                    'p-2 rounded hover:bg-accent transition-colors',
                    editor.isActive('bold') ? 'bg-accent' : ''
                )}
                title='Bold'>
                <Bold className='h-4 w-4' />
            </button>
            <button
                type='button'
                onClick={() => editor.chain().focus().toggleItalic().run()}
                className={cn(
                    'p-2 rounded hover:bg-accent transition-colors',
                    editor.isActive('italic') ? 'bg-accent' : ''
                )}
                title='Italic'>
                <Italic className='h-4 w-4' />
            </button>
            <div className='w-px h-6 bg-border mx-1' />
            <button
                type='button'
                onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                className={cn(
                    'p-2 rounded hover:bg-accent transition-colors',
                    editor.isActive('heading', { level: 2 }) ? 'bg-accent' : ''
                )}
                title='Heading 2'>
                <Heading2 className='h-4 w-4' />
            </button>
            <button
                type='button'
                onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                className={cn(
                    'p-2 rounded hover:bg-accent transition-colors',
                    editor.isActive('heading', { level: 3 }) ? 'bg-accent' : ''
                )}
                title='Heading 3'>
                <Heading3 className='h-4 w-4' />
            </button>
            <button
                type='button'
                onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
                className={cn(
                    'p-2 rounded hover:bg-accent transition-colors',
                    editor.isActive('heading', { level: 4 }) ? 'bg-accent' : ''
                )}
                title='Heading 4'>
                <Heading4 className='h-4 w-4' />
            </button>
            <div className='w-px h-6 bg-border mx-1' />
            <button
                type='button'
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                className={cn(
                    'p-2 rounded hover:bg-accent transition-colors',
                    editor.isActive('bulletList') ? 'bg-accent' : ''
                )}
                title='Bullet List'>
                <List className='h-4 w-4' />
            </button>
            <button
                type='button'
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                className={cn(
                    'p-2 rounded hover:bg-accent transition-colors',
                    editor.isActive('orderedList') ? 'bg-accent' : ''
                )}
                title='Numbered List'>
                <ListOrdered className='h-4 w-4' />
            </button>
            <button
                type='button'
                onClick={() => editor.chain().focus().toggleBlockquote().run()}
                className={cn(
                    'p-2 rounded hover:bg-accent transition-colors',
                    editor.isActive('blockquote') ? 'bg-accent' : ''
                )}
                title='Quote'>
                <Quote className='h-4 w-4' />
            </button>
            <div className='w-px h-6 bg-border mx-1' />
            <button
                type='button'
                onClick={onImageClick}
                className='p-2 rounded hover:bg-accent transition-colors'
                title='Add Image'>
                <ImageIcon className='h-4 w-4' />
            </button>
            <button
                type='button'
                onClick={onTableClick}
                className='p-2 rounded hover:bg-accent transition-colors'
                title='Insert Table'>
                <TableIcon className='h-4 w-4' />
            </button>
            <div className='w-px h-6 bg-border mx-1' />
            <button
                type='button'
                onClick={() => editor.chain().focus().undo().run()}
                disabled={!editor.can().undo()}
                className='p-2 rounded hover:bg-accent transition-colors disabled:opacity-50'
                title='Undo'>
                <Undo className='h-4 w-4' />
            </button>
            <button
                type='button'
                onClick={() => editor.chain().focus().redo().run()}
                disabled={!editor.can().redo()}
                className='p-2 rounded hover:bg-accent transition-colors disabled:opacity-50'
                title='Redo'>
                <Redo className='h-4 w-4' />
            </button>
        </div>
    );
};

export default function RHFEditor({
    name,
    className,
    label,
    required,
    placeholder = 'Start typing...',
    rules
}: RHFEditorProps) {
    const { control } = useFormContext();
    const [isImageDialogOpen, setIsImageDialogOpen] = useState(false);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState('');
    const [imageAlt, setImageAlt] = useState('');
    const [currentEditor, setCurrentEditor] = useState<any>(null);
    const [isEditMode, setIsEditMode] = useState(false);
    const [selectedImageSrc, setSelectedImageSrc] = useState('');

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            // Create preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const addImage = () => {
        if (currentEditor) {
            if (isEditMode && selectedImageSrc) {
                // Update existing image alt text
                const { state } = currentEditor;
                const { from, to } = state.selection;

                // Find the image node in the document
                let imagePos = -1;
                state.doc.descendants((node: any, pos: number) => {
                    if (node.type.name === 'image' && node.attrs.src === selectedImageSrc) {
                        imagePos = pos;
                        return false;
                    }
                });

                if (imagePos >= 0) {
                    currentEditor
                        .chain()
                        .setNodeSelection(imagePos)
                        .updateAttributes('image', { alt: imageAlt })
                        .run();
                }
            } else if (imagePreview) {
                // Add new image
                currentEditor.chain().focus().setImage({ src: imagePreview, alt: imageAlt }).run();
            }
            resetImageDialog();
        }
    };

    const resetImageDialog = () => {
        setImageFile(null);
        setImagePreview('');
        setImageAlt('');
        setIsImageDialogOpen(false);
        setIsEditMode(false);
        setSelectedImageSrc('');
    };

    const insertTable = () => {
        if (currentEditor) {
            currentEditor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
        }
    };

    return (
        <Controller
            name={name}
            control={control}
            rules={required ? { required: `${label || name} is required`, ...rules } : rules}
            render={({ field, fieldState: { error } }) => {
                // eslint-disable-next-line react-hooks/rules-of-hooks
                const editor = useEditor({
                    extensions: [
                        StarterKit.configure({
                            heading: {
                                levels: [2, 3, 4, 5, 6]
                            }
                        }),
                        Placeholder.configure({
                            placeholder
                        }),
                        Image.configure({
                            HTMLAttributes: {
                                class: 'max-w-full h-auto rounded-lg cursor-pointer'
                            }
                        }).extend({
                            addProseMirrorPlugins() {
                                return [
                                    // Custom plugin for double-click
                                ];
                            }
                        }),
                        Table.configure({
                            resizable: true,
                            HTMLAttributes: {
                                class: 'border-collapse table-auto w-full'
                            }
                        }),
                        TableRow,
                        TableHeader.configure({
                            HTMLAttributes: {
                                class: 'border border-gray-300 bg-gray-50 px-4 py-2 text-left font-semibold'
                            }
                        }),
                        TableCell.configure({
                            HTMLAttributes: {
                                class: 'border border-gray-300 px-4 py-2'
                            }
                        })
                    ],
                    content: field.value || '',
                    // Don't render immediately on the server to avoid SSR issues
                    immediatelyRender: false,
                    onUpdate: ({ editor }) => {
                        field.onChange(editor.getHTML());
                    },
                    onCreate: ({ editor }) => {
                        setCurrentEditor(editor);
                    },
                    editorProps: {
                        attributes: {
                            class: 'prose prose-sm max-w-none focus:outline-none min-h-[200px] p-4 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:mt-4 [&_h2]:mb-2 [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:mt-3 [&_h3]:mb-2 [&_h4]:text-base [&_h4]:font-semibold [&_h4]:mt-2 [&_h4]:mb-1 [&_ul]:list-disc [&_ul]:pl-4 [&_ol]:list-decimal [&_ol]:pl-4 [&_blockquote]:border-l-4 [&_blockquote]:border-gray-300 [&_blockquote]:pl-4 [&_blockquote]:italic [&_p]:my-2 [&_img]:my-4 [&_table]:my-4 [&_p.is-editor-empty:first-child::before]:content-[attr(data-placeholder)] [&_p.is-editor-empty:first-child::before]:text-muted-foreground [&_p.is-editor-empty:first-child::before]:float-left [&_p.is-editor-empty:first-child::before]:pointer-events-none [&_p.is-editor-empty:first-child::before]:h-0'
                        },
                        handleDOMEvents: {
                            dblclick: (view, event) => {
                                const target = event.target as HTMLElement;
                                if (target.tagName === 'IMG') {
                                    const src = target.getAttribute('src') || '';
                                    const alt = target.getAttribute('alt') || '';
                                    setSelectedImageSrc(src);
                                    setImagePreview(src);
                                    setImageAlt(alt);
                                    setIsEditMode(true);
                                    setIsImageDialogOpen(true);
                                    return true;
                                }
                                return false;
                            }
                        }
                    }
                });

                return (
                    <>
                        <div className='flex flex-col gap-1'>
                            {label ? (
                                <Label htmlFor={name} className='mb-1'>
                                    {label}
                                    {required ? <span className='text-destructive'>*</span> : null}
                                </Label>
                            ) : null}
                            <div
                                className={cn(
                                    'border rounded-md bg-background overflow-hidden',
                                    error && 'border-destructive',
                                    className
                                )}>
                                <MenuBar
                                    editor={editor}
                                    onImageClick={() => setIsImageDialogOpen(true)}
                                    onTableClick={insertTable}
                                />
                                <EditorContent editor={editor} />
                            </div>
                            {error?.message ? (
                                <p className='text-xs text-destructive'>{error.message}</p>
                            ) : null}
                        </div>

                        {/* Image Dialog */}
                        <Dialog open={isImageDialogOpen} onOpenChange={(open) => !open && resetImageDialog()}>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>
                                        {isEditMode ? 'Edit Image Alt Text' : 'Add Image'}
                                    </DialogTitle>
                                </DialogHeader>
                                <div className='space-y-4'>
                                    {!isEditMode && (
                                        <div>
                                            <Label htmlFor='imageFile'>Select Image</Label>
                                            <Input
                                                id='imageFile'
                                                type='file'
                                                accept='image/*'
                                                onChange={handleFileChange}
                                                className='cursor-pointer'
                                            />
                                        </div>
                                    )}
                                    {imagePreview && (
                                        <div>
                                            <Label>Preview</Label>
                                            <div className='border rounded-md p-2 bg-muted/30'>
                                                <img
                                                    src={imagePreview}
                                                    alt='Preview'
                                                    className='max-w-full h-auto max-h-48 mx-auto rounded'
                                                />
                                            </div>
                                        </div>
                                    )}
                                    <div>
                                        <Label htmlFor='imageAlt'>Alt Text (Image Description)</Label>
                                        <Input
                                            id='imageAlt'
                                            value={imageAlt}
                                            onChange={(e) => setImageAlt(e.target.value)}
                                            placeholder='توضیح تصویر برای سئو و accessibility'
                                        />
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button variant='outline' onClick={resetImageDialog}>
                                        Cancel
                                    </Button>
                                    <Button onClick={addImage} disabled={!imagePreview}>
                                        {isEditMode ? 'Update Alt Text' : 'Add Image'}
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </>
                );
            }}
        />
    );
}
