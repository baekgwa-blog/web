'use client';

import { useState, useEffect, useCallback } from 'react';
import { getTagList, TagItem } from '@/lib/api/tag';
import { Badge } from '@/components/ui/badge';
import { Search, X } from 'lucide-react';
import {
  Command,
  CommandInput,
  CommandList,
  CommandItem,
  CommandEmpty,
} from '@/components/ui/command';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface TagSelectorProps {
  selectedTags: TagItem[];
  onTagToggle: (tag: TagItem) => void;
  error?: string;
}

// 총 몇 개의 랜덤 색상 변수를 정의했는지 여기에 맞춰줍니다.
const NUM_RANDOM_COLORS = 7;

export default function TagSelector({ selectedTags, onTagToggle, error }: TagSelectorProps) {
  const [tagOptions, setTagOptions] = useState<TagItem[]>([]);
  const [tagSearch, setTagSearch] = useState('');
  const [open, setOpen] = useState(false);

  useEffect(() => {
    getTagList({ keyword: tagSearch }).then(setTagOptions);
  }, [tagSearch]);

  const isTagSelected = useCallback(
    (tag: TagItem) => selectedTags.some((t) => t.id === tag.id),
    [selectedTags]
  );

  // 태그 ID를 기반으로 일관된 랜덤 색상을 반환하는 함수
  const getTagRandomColorStyle = useCallback((tagId: number) => {
    const colorIndex = (tagId % NUM_RANDOM_COLORS) + 1; // 1부터 NUM_RANDOM_COLORS까지
    const backgroundColorVar = `var(--badge-random-${colorIndex})`;

    return {
      backgroundColor: backgroundColorVar,
      color: 'hsl(var(--primary-foreground))', // 글자색은 테마의 primary-foreground 사용
    };
  }, []);

  return (
    <div className="relative w-full">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn(
              'h-auto min-h-[40px] w-full flex-wrap justify-between',
              selectedTags.length > 0 ? 'py-2' : ''
            )}
          >
            {selectedTags.length > 0 ? (
              <div className="flex flex-wrap gap-1">
                {selectedTags.map((tag) => (
                  <Badge
                    key={tag.id}
                    // variant="secondary" // 기존 variant 제거
                    style={getTagRandomColorStyle(tag.id)} // 👇 여기에 동적으로 스타일 적용
                    className="flex items-center gap-1 border-transparent" // border-transparent 추가
                  >
                    {tag.name}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        onTagToggle(tag);
                      }}
                    />
                  </Badge>
                ))}
              </div>
            ) : (
              <span className="text-muted-foreground">태그를 선택하세요...</span>
            )}
            <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0" align="start">
          <Command>
            <CommandInput
              placeholder="태그 검색..."
              value={tagSearch}
              onValueChange={setTagSearch}
            />
            <CommandList className="max-h-[200px] overflow-y-auto">
              <CommandEmpty>검색 결과가 없습니다.</CommandEmpty>
              {tagOptions.map((tag) => (
                <CommandItem
                  key={tag.id}
                  onSelect={() => {
                    onTagToggle(tag);
                  }}
                  className="cursor-pointer"
                >
                  <div
                    className={cn(
                      'border-primary mr-2 flex h-4 w-4 items-center justify-center rounded-sm border',
                      isTagSelected(tag)
                        ? 'bg-primary text-primary-foreground'
                        : 'opacity-50 [&_svg]:invisible'
                    )}
                  >
                    <X className="h-4 w-4" />
                  </div>
                  <span>{tag.name}</span>
                </CommandItem>
              ))}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
}
