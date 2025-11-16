import { MetadataRoute } from 'next';
import { getPostList } from '@/lib/api/post';
import { getAllStack } from '@/lib/api/stack';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://blog.baekgwa.site';

  // 정적 페이지들
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/about/skills`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/about/projects`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/stack`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
  ];

  const dynamicPages: MetadataRoute.Sitemap = [];

  // 블로그 포스트들 가져오기
  try {
    const postsResponse = await getPostList({ size: '1000' }); // 충분히 큰 사이즈로 모든 포스트 가져오기

    if (postsResponse.isSuccess && postsResponse.data) {
      const blogPosts: MetadataRoute.Sitemap = postsResponse.data.content.map((post) => ({
        url: `${baseUrl}/blog/${post.slug}`,
        lastModified: new Date(post.modifiedAt || post.createdAt),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      }));

      dynamicPages.push(...blogPosts);
    }
  } catch (error) {
    console.error('Failed to fetch posts for sitemap:', error);
  }

  // 스택 시리즈들 가져오기
  try {
    const stacksResponse = await getAllStack();

    if (stacksResponse.isSuccess && stacksResponse.data) {
      const stackPages: MetadataRoute.Sitemap = stacksResponse.data.map((stack) => ({
        url: `${baseUrl}/stack/${stack.stackId}`,
        lastModified: new Date(stack.updatedAt),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
      }));

      dynamicPages.push(...stackPages);
    }
  } catch (error) {
    console.error('Failed to fetch stacks for sitemap:', error);
  }

  return [...staticPages, ...dynamicPages];
}
