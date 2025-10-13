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
import { toast } from 'sonner';
import { useDebounce } from '@/lib/hooks/use-debounce';

interface TagSelectorProps {
  selectedTags: TagItem[];
  onTagToggle: (tag: TagItem) => void;
  error?: string;
}

const NUM_RANDOM_COLORS = 7;

export default function TagSelector({ selectedTags, onTagToggle, error }: TagSelectorProps) {
  const [tagOptions, setTagOptions] = useState<TagItem[]>([]);
  const [tagSearch, setTagSearch] = useState('');
  const [open, setOpen] = useState(false);

  const debouncedTagSearch = useDebounce(tagSearch, 300);

  useEffect(() => {
    getTagList({ keyword: debouncedTagSearch }).then(setTagOptions);
  }, [debouncedTagSearch]);

  useEffect(() => {
    if (error) {
      toast.error(error, { id: 'tag-error', duration: 3000 });
    } else {
      toast.dismiss('tag-error');
    }
  }, [error]);

  const isTagSelected = useCallback(
    (tag: TagItem) => selectedTags.some((t) => t.id === tag.id),
    [selectedTags]
  );

  const getTagRandomColorStyle = useCallback((tagId: number) => {
    const colorIndex = (tagId % NUM_RANDOM_COLORS) + 1;
    const backgroundColorVar = `var(--badge-random-${colorIndex})`;

    return {
      backgroundColor: backgroundColorVar,
      color: 'hsl(var(--primary-foreground))',
    };
  }, []);

  return (
    <div className="relative h-full w-full">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            aria-invalid={!!error}
            className={cn(
              'flex h-full !min-h-0 w-full items-center justify-between py-0',
              selectedTags.length > 0 ? 'py-2' : '',
              error && 'border-destructive focus:border-destructive focus:ring-destructive/50'
            )}
          >
            {selectedTags.length > 0 ? (
              <div className="flex flex-wrap items-center gap-1 overflow-hidden">
                {selectedTags.map((tag) => (
                  <Badge
                    key={tag.id}
                    style={getTagRandomColorStyle(tag.id)}
                    className="flex items-center gap-1 border-transparent"
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
          <Command shouldFilter={false}>
            <CommandInput placeholder="태그 검색" value={tagSearch} onValueChange={setTagSearch} />
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
    </div>
  );
}
