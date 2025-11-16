'use client';

import { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import { Loader2, Send, Sparkles } from 'lucide-react';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { CategoryList, getCategories } from '@/lib/api/category';
import { useChat } from './chat-provider';

const MessageBubble = ({ role, content }: { role: 'user' | 'assistant'; content: string }) => {
  const isUser = role === 'user';

  return (
    <div className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'}`}>
      {/* [수정]
        1. 말풍선(부모): 'max-w-[85%]'와 'min-w-0' 유지. 
           (flex 아이템, shrink-to-fit, 최대 너비 제한, 축소 가능)
      */}
      <div
        className={`max-w-[85%] min-w-0 rounded-lg px-4 py-3 ${
          isUser ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
        }`}
      >
        {/* [수정]
          2. 컨텐츠 래퍼(자식): 'w-full' 제거. (순환 참조 고리 제거)
             이제 이 div는 부모의 너비를 따르는 단순 블록 요소가 됩니다.
        */}
        <div className="overflow-hidden">
          <ReactMarkdown
            components={{
              /* [수정]
                3. 모든 태그에 'break-all' 대신 'break-words' 적용.
                   - 'break-words'는 'overflow-wrap: break-word'입니다.
                   - 평소엔 단어 단위로 예쁘게 줄바꿈합니다.
                   - 'application-logs...'처럼 띄어쓰기 없는 긴 텍스트가 
                     오버플로우 될 때만 강제로 쪼갭니다.
              */
              p: ({ node, ...props }) => (
                <p {...props} className="break-words whitespace-pre-wrap" />
              ),
              a: ({ node, ...props }) => (
                <a
                  {...props}
                  className="font-medium break-words text-blue-400 underline hover:text-blue-300"
                  target="_blank"
                  rel="noopener noreferrer"
                />
              ),
              h3: ({ node, ...props }) => (
                <h3 {...props} className="mt-4 mb-2 text-lg font-semibold break-words" />
              ),
              h2: ({ node, ...props }) => (
                <h2 {...props} className="mt-5 mb-2 text-xl font-semibold break-words" />
              ),
              // 🚨 [수정] ul에도 'break-words'를 적용해야 합니다.
              //    이래야 'ul > li' 안에 긴 텍스트가 있어도 짤리지 않습니다.
              ul: ({ node, ...props }) => (
                <ul {...props} className="ml-6 list-disc space-y-1 break-words" />
              ),
              strong: ({ node, ...props }) => (
                <strong {...props} className="font-semibold break-words" />
              ),
              code: ({ node, ...props }) => (
                <code
                  {...props}
                  className="rounded bg-black/10 px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold break-words dark:bg-white/10"
                />
              ),
              pre: ({ node, ...props }) => (
                <pre
                  {...props}
                  className="my-2 overflow-x-auto rounded bg-black/10 p-2 dark:bg-white/10"
                />
              ),
            }}
          >
            {content}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
};

export const ChatDialog = () => {
  const { isChatOpen, setChatOpen, messages, sendMessage, isLoading, error } = useChat();
  const [input, setInput] = useState('');
  const [categories, setCategories] = useState<CategoryList[]>([]);
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isChatOpen) {
      const fetchCategories = async () => {
        try {
          const response = await getCategories();
          if (response.isSuccess && response.data) {
            setCategories(response.data);
          }
        } catch (err) {
          console.error('Failed to fetch categories:', err);
        }
      };
      fetchCategories();
    }
  }, [isChatOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    sendMessage(input, selectedFilters);
    setInput('');
    setSelectedFilters([]);
  };

  const toggleFilter = (filterName: string) => {
    setSelectedFilters((prev) =>
      prev.includes(filterName) ? prev.filter((f) => f !== filterName) : [...prev, filterName]
    );
  };

  return (
    <Dialog open={isChatOpen} onOpenChange={setChatOpen}>
      {/* 💡 [수정] max-w-[95vw] (모바일용), sm:max-w-3xl (태블릿), lg:max-w-4xl (데스크탑)
        이전 코드의 max-w-[95vw]는 유지했습니다.
      */}
      <DialogContent className="flex h-[80vh] max-h-[800px] w-full max-w-[95vw] flex-col p-0 sm:max-w-3xl lg:max-w-4xl">
        <DialogHeader className="p-6 pb-2">
          <DialogTitle className="flex items-center text-lg">
            <Sparkles className="text-primary mr-2 h-5 w-5" />
            백과AI 챗봇
          </DialogTitle>
          <DialogDescription className="text-muted-foreground text-sm">
            블로그 콘텐츠에 대해 궁금한 것을 물어보세요. AI가 요약해 드립니다.
            <br />
            현재 하루에 5회의 제한이 있습니다. 🙏
          </DialogDescription>
        </DialogHeader>

        {/* 메시지 영역 */}
        <ScrollArea className="min-h-0 flex-1 px-6">
          <div className="flex w-full flex-col gap-4 py-4">
            {messages.map((m) => (
              <MessageBubble key={m.id} role={m.role} content={m.content} />
            ))}
            {isLoading && messages[messages.length - 1]?.role === 'assistant' && (
              <div className="flex w-full justify-start">
                <div className="bg-muted text-muted-foreground flex items-center space-x-2 rounded-lg px-4 py-3">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>응답을 생성 중입니다...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {/* Footer (이전과 동일) */}
        <DialogFooter className="!flex-col border-t p-6">
          {/* 카테고리 필터 (가로 스크롤 영역) */}
          {categories.length > 0 && (
            <ScrollArea className="w-full pb-4 whitespace-nowrap">
              <div className="flex w-max items-center space-x-2">
                <span className="text-muted-foreground text-sm font-medium">필터:</span>
                {categories.map((cat) => (
                  <Badge
                    key={cat.id}
                    variant={selectedFilters.includes(cat.name) ? 'default' : 'secondary'}
                    onClick={() => toggleFilter(cat.name)}
                    className="cursor-pointer transition-colors"
                  >
                    {cat.name}
                  </Badge>
                ))}
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          )}

          {/* 에러 메시지 */}
          {error && <p className="text-destructive mb-2 text-sm">{error}</p>}

          {/* 입력창 */}
          <form onSubmit={handleSubmit} className="flex w-full items-center space-x-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="궁금한 것을 물어보세요 (예: 멀티 프로세스란?)"
              disabled={isLoading}
              className="flex-1"
            />
            <Button type="submit" disabled={isLoading || !input.trim()} size="icon">
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
