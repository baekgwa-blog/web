export interface Post {
  id: string;
  title: string;
  description: string;
  coverImage: string;
  tags: string[];
  category: string;
  author: string;
  viewCount: number;
  date: string;
  modifiedDate: string;
  slug: string;
}
