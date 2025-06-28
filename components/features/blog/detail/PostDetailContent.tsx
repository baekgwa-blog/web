import { MDXRemote } from 'next-mdx-remote/rsc';
import remarkGfm from 'remark-gfm';
import rehypeSanitize from 'rehype-sanitize';
import rehypePrettyCode from 'rehype-pretty-code';
import rehypeSlug from 'rehype-slug';

interface PostDetailContentProps {
  content: string;
}

export function PostDetailContent({ content }: PostDetailContentProps) {
  return (
    <div className="prose prose-neutral prose-sm dark:prose-invert prose-headings:scroll-mt-[var(--header-height)] max-w-none">
      <MDXRemote
        source={content}
        options={{
          mdxOptions: {
            remarkPlugins: [remarkGfm],
            rehypePlugins: [rehypeSlug, rehypeSanitize, rehypePrettyCode],
          },
        }}
      />
    </div>
  );
}
