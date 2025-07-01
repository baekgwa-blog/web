export interface PostListItem {
  id: number;
  title: string;
  description: string;
  thumbnailImage: string;
  slug: string;
  viewCount: number;
  tagList: string[];
  category: string;
  createdAt: string;
  modifiedAt: string;
}

export interface PostDetailItem {
  id: number;
  title: string;
  content: string;
  description: string;
  thumbnailImage: string;
  slug: string;
  tagList: string[];
  category: string;
  author: string;
  createdAt: string;
  modifiedAt: string;
}

export interface CreatePostResponse {
  slug: string;
}
