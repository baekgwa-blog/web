import React, { useState, useMemo, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ColumnDef, flexRender, getCoreRowModel, useReactTable, Row } from '@tanstack/react-table';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { GripVertical, X, Plus } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { PostNewStackPost } from '@/lib/api/stack';
import { getPostList } from '@/lib/api/post';
import { PostListItem } from '@/types/post';
import { useDebounce } from '@/lib/hooks/use-debounce';
import { toast } from 'sonner';

export type PostWithData = PostNewStackPost & {
  title: string;
};

type PostError = {
  postId?: string;
  sequence?: string;
};

interface StackPostManagerProps {
  postList: PostWithData[];
  setPostList: (posts: PostWithData[]) => void;
  errors?: PostError[];
}

export default function StackPostManager({ postList, setPostList, errors }: StackPostManagerProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const { data: searchResults, isLoading: isSearchLoading } = useQuery({
    queryKey: ['postSearch', debouncedSearchTerm],
    queryFn: () => getPostList({ keyword: debouncedSearchTerm, size: '10' }),
    enabled: debouncedSearchTerm.length > 0,
  });

  const handleAddPost = (post: PostListItem) => {
    if (postList.some((p) => p.postId === post.id)) {
      toast.info('이미 추가된 포스트입니다.');
      return;
    }
    const newPost: PostWithData = {
      postId: post.id,
      title: post.title,
      sequence: postList.length + 1,
    };
    setPostList([...postList, newPost]);
  };

  const handleRemovePost = useCallback(
    (postId: number) => {
      const newList = postList.filter((p) => p.postId !== postId);
      const resequencedList = newList.map((p, index) => ({
        ...p,
        sequence: index + 1,
      }));
      setPostList(resequencedList);
    },
    [postList, setPostList]
  );

  const data = useMemo(() => postList, [postList]);

  const columns = useMemo<ColumnDef<PostWithData>[]>(
    () => [
      {
        id: 'drag-handle',
        header: '순서',
        size: 60,
        cell: ({ row }) => <span className="text-sm font-medium">{row.original.sequence}</span>,
      },
      {
        accessorKey: 'title',
        header: '제목',
        cell: ({ row }) => {
          const rowIndex = row.index;
          const error = errors?.[rowIndex]?.postId || errors?.[rowIndex]?.sequence;
          return (
            <div>
              <span>{row.original.title}</span>
              {error && <p className="text-destructive text-xs">{error}</p>}
            </div>
          );
        },
      },
      {
        id: 'actions',
        size: 60,
        cell: ({ row }) => (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => handleRemovePost(row.original.postId)}
          >
            <X className="h-4 w-4" />
          </Button>
        ),
      },
    ],
    [errors, handleRemovePost]
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getRowId: (row) => row.postId.toString(),
  });

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: { distance: 5 },
    }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 100, tolerance: 5 },
    }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = postList.findIndex((p) => p.postId.toString() === active.id);
      const newIndex = postList.findIndex((p) => p.postId.toString() === over.id);

      const reorderedList = arrayMove(postList, oldIndex, newIndex);
      const resequencedList = reorderedList.map((p, index) => ({
        ...p,
        sequence: index + 1,
      }));
      setPostList(resequencedList);
    }
  }

  return (
    <div className="space-y-4 rounded-lg border p-4">
      {/* --- 포스트 추가 영역 --- */}
      <h3 className="text-lg font-semibold">포스트 추가</h3>
      <Input
        placeholder="스택에 추가할 포스트를 제목으로 검색하세요..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      {isSearchLoading && <div>검색 중...</div>}
      <div className="max-h-48 overflow-y-auto rounded-md border">
        {searchResults?.data?.content.map((post) => (
          <div
            key={post.id}
            className="flex items-center justify-between border-b p-2 last:border-b-0"
          >
            <span>{post.title}</span>
            <Button type="button" size="sm" variant="outline" onClick={() => handleAddPost(post)}>
              <Plus className="mr-2 h-4 w-4" />
              추가
            </Button>
          </div>
        ))}
      </div>

      {/* --- DND 테이블 영역 --- */}
      <h3 className="text-lg font-semibold">추가된 포스트 (드래그하여 순서 변경)</h3>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} style={{ width: header.getSize() }}>
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            <SortableContext
              items={postList.map((p) => p.postId.toString())}
              strategy={verticalListSortingStrategy}
            >
              {table.getRowModel().rows.map((row) => (
                <DraggableRow key={row.id} row={row} />
              ))}
            </SortableContext>
          </TableBody>
        </Table>
      </DndContext>
    </div>
  );
}

function DraggableRow({ row }: { row: Row<PostWithData> }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: row.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.8 : 1,
    zIndex: isDragging ? 1 : 0,
  };

  return (
    <TableRow ref={setNodeRef} style={style}>
      {row.getVisibleCells().map((cell) => (
        <TableCell key={cell.id}>
          {cell.column.id === 'drag-handle' ? (
            <span {...attributes} {...listeners} className="flex cursor-grab items-center p-2">
              <GripVertical className="h-4 w-4" />
              <span className="ml-2">
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </span>
            </span>
          ) : (
            flexRender(cell.column.columnDef.cell, cell.getContext())
          )}
        </TableCell>
      ))}
    </TableRow>
  );
}
