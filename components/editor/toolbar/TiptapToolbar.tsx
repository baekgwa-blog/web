'use client';

import React, { useCallback, useRef } from 'react';
import { Editor } from '@tiptap/react';
import { Button } from '@/components/ui/button';
import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  Bold,
  CheckSquare,
  Code,
  Heading1,
  Heading2,
  Heading3,
  Highlighter,
  ImageIcon,
  Italic,
  LinkIcon,
  List,
  ListOrdered,
  Minus,
  Pilcrow,
  Plus,
  Quote,
  Redo,
  Strikethrough,
  Undo,
  Youtube,
  Table2,
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

type Props = {
  editor: Editor;
  onImageUpload: (file: File) => Promise<string>;
};

export default function TiptapToolbar({ editor, onImageUpload }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const url = await onImageUpload(file);
    editor.chain().focus().setImage({ src: url }).run();

    if (event.target) event.target.value = '';
  };

  const handleLink = useCallback(() => {
    const previousUrl = editor.getAttributes('link').href;

    if (previousUrl) {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }

    const url = window.prompt('URL을 입력하세요', previousUrl);
    if (url === null || url === '') {
      return;
    }

    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  }, [editor]);

  const handleYoutube = useCallback(() => {
    const url = window.prompt('유튜브 URL을 입력하세요');
    if (url) {
      editor.commands.setYoutubeVideo({
        src: url,
      });
    }
  }, [editor]);

  return (
    <div className="border-border overflow-hidden rounded-t-lg border">
      <div className="border-border bg-muted/50 flex flex-wrap items-center justify-center gap-3 border-b p-2">
        {/* 헤딩 & 텍스트 스타일 드롭다운 */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button type="button" variant="ghost" size="sm" className="h-8 w-20">
              <span className="mr-1">
                {editor.isActive('heading', { level: 1 }) && <Heading1 className="h-4 w-4" />}
                {editor.isActive('heading', { level: 2 }) && <Heading2 className="h-4 w-4" />}
                {editor.isActive('heading', { level: 3 }) && <Heading3 className="h-4 w-4" />}
                {editor.isActive('paragraph') && <Pilcrow className="h-4 w-4" />}
              </span>
              스타일
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem
              onClick={() => editor.chain().focus().setParagraph().run()}
              disabled={!editor.can().setParagraph()}
            >
              <Pilcrow className="mr-2 h-4 w-4" /> 본문
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            >
              <Heading1 className="mr-2 h-4 w-4" /> 제목 1
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            >
              <Heading2 className="mr-2 h-4 w-4" /> 제목 2
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            >
              <Heading3 className="mr-2 h-4 w-4" /> 제목 3
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Separator orientation="vertical" className="h-6" />

        {/* 텍스트 포맷팅 (Bold, Italic 등) */}
        <div className="flex items-center gap-1">
          <Button
            type="button"
            variant={editor.isActive('bold') ? 'default' : 'ghost'}
            size="sm"
            onClick={() => editor.chain().focus().toggleBold().run()}
            className="h-8 w-8 p-0"
          >
            <Bold className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant={editor.isActive('italic') ? 'default' : 'ghost'}
            size="sm"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className="h-8 w-8 p-0"
          >
            <Italic className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant={editor.isActive('strike') ? 'default' : 'ghost'}
            size="sm"
            onClick={() => editor.chain().focus().toggleStrike().run()}
            className="h-8 w-8 p-0"
          >
            <Strikethrough className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant={editor.isActive('code') ? 'default' : 'ghost'}
            size="sm"
            onClick={() => editor.chain().focus().toggleCode().run()}
            className="h-8 w-8 p-0"
          >
            <Code className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant={editor.isActive('highlight') ? 'default' : 'ghost'}
            size="sm"
            onClick={() => editor.chain().focus().toggleHighlight().run()}
            className="h-8 w-8 p-0"
          >
            <Highlighter className="h-4 w-4" />
          </Button>
        </div>

        <Separator orientation="vertical" className="h-6" />

        {/* 정렬 드롭다운 */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button type="button" variant="ghost" size="sm" className="h-8 w-8 p-0">
              {editor.isActive({ textAlign: 'center' }) && <AlignCenter className="h-4 w-4" />}
              {editor.isActive({ textAlign: 'right' }) && <AlignRight className="h-4 w-4" />}
              {editor.isActive({ textAlign: 'justify' }) && <AlignJustify className="h-4 w-4" />}
              {!editor.isActive({ textAlign: 'center' }) &&
                !editor.isActive({ textAlign: 'right' }) &&
                !editor.isActive({ textAlign: 'justify' }) && <AlignLeft className="h-4 w-4" />}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => editor.chain().focus().setTextAlign('left').run()}>
              <AlignLeft className="mr-2 h-4 w-4" /> 왼쪽
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => editor.chain().focus().setTextAlign('center').run()}>
              <AlignCenter className="mr-2 h-4 w-4" /> 가운데
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => editor.chain().focus().setTextAlign('right').run()}>
              <AlignRight className="mr-2 h-4 w-4" /> 오른쪽
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => editor.chain().focus().setTextAlign('justify').run()}>
              <AlignJustify className="mr-2 h-4 w-4" /> 양쪽 맞춤
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Separator orientation="vertical" className="h-6" />

        {/* 요소 삽입 드롭다운 */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button type="button" variant="ghost" size="sm" className="h-8 w-8 p-0">
              <Plus className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => editor.chain().focus().toggleBulletList().run()}>
              <List className="mr-2 h-4 w-4" /> 글머리 기호
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => editor.chain().focus().toggleOrderedList().run()}>
              <ListOrdered className="mr-2 h-4 w-4" /> 번호 매기기
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => editor.chain().focus().toggleTaskList().run()}>
              <CheckSquare className="mr-2 h-4 w-4" /> 체크리스트
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => editor.chain().focus().toggleBlockquote().run()}>
              <Quote className="mr-2 h-4 w-4" /> 인용문
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => editor.chain().focus().toggleCodeBlock().run()}>
              <Code className="mr-2 h-4 w-4" /> 코드 블록
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => editor.chain().focus().setHorizontalRule().run()}>
              <Minus className="mr-2 h-4 w-4" /> 구분선
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLink}>
              <LinkIcon className="mr-2 h-4 w-4" /> 링크
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => fileInputRef.current?.click()}>
              <ImageIcon className="mr-2 h-4 w-4" /> 이미지
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleYoutube}>
              <Youtube className="mr-2 h-4 w-4" /> 유튜브
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* 테이블 드롭다운 */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button type="button" variant="ghost" size="sm" className="h-8 w-8 p-0">
              <Table2 className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem
              onClick={() =>
                editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()
              }
            >
              테이블 삽입
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => editor.chain().focus().addRowAfter().run()}
              disabled={!editor.can().addRowAfter()}
            >
              아래에 행 추가
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => editor.chain().focus().addColumnAfter().run()}
              disabled={!editor.can().addColumnAfter()}
            >
              오른쪽에 열 추가
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => editor.chain().focus().deleteRow().run()}
              disabled={!editor.can().deleteRow()}
              className="text-red-500"
            >
              행 삭제
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => editor.chain().focus().deleteColumn().run()}
              disabled={!editor.can().deleteColumn()}
              className="text-red-500"
            >
              열 삭제
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => editor.chain().focus().mergeOrSplit().run()}
              disabled={!editor.can().mergeOrSplit()}
            >
              셀 병합/분할
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => editor.chain().focus().toggleHeaderRow().run()}
              disabled={!editor.can().toggleHeaderRow()}
            >
              헤더 행 전환
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => editor.chain().focus().deleteTable().run()}
              disabled={!editor.can().deleteTable()}
              className="text-red-500"
            >
              테이블 삭제
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Separator orientation="vertical" className="h-6" />

        {/* Undo/Redo - 항상 표시 */}
        <div className="flex items-center gap-1">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
            className="h-8 w-8 p-0"
          >
            <Undo className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
            className="h-8 w-8 p-0"
          >
            <Redo className="h-4 w-4" />
          </Button>
        </div>

        {/* 숨겨진 파일 input */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          style={{ display: 'none' }}
          accept="image/*"
        />
      </div>
    </div>
  );
}
