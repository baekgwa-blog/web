import { createPost } from '@/lib/api/post';
import { z } from 'zod';
import { CreatePostBodys } from '@/lib/api/post';

const postSchema = z.object({
  title: z
    .string()
    .min(1, { message: '제목을 입력해주세요.' })
    .max(100, { message: '제목은 100글자 이하로 해주세요.' }),
  content: z.string().min(1, { message: '본문을 1자 이상 입력해주세요.' }),
  description: z
    .string()
    .min(1, { message: '설명을 1자 이상 입력해주세요.' })
    .max(100, { message: '설명은 100자 이하로 입력해주세요.' }),
  thumbnailImage: z.string().nullable(),
  tagIdList: z.array(z.number()).min(1, { message: '태그를 1개 이상 선택해주세요.' }),
  categoryId: z.number().min(1, { message: '카테고리를 선택해주세요.' }),
});

export interface CreatePostFormState {
  message: string;
  errors?: Record<string, string[]>;
  formData?: CreatePostBodys;
  success?: boolean;
  slug?: string;
}

export async function createPostAction(
  prevState: CreatePostFormState,
  formData: FormData
): Promise<CreatePostFormState> {
  const rawFormData = {
    title: formData.get('title') as string,
    content: formData.get('content') as string,
    description: formData.get('description') as string,
    thumbnailImage:
      typeof formData.get('thumbnailImage') === 'string'
        ? (formData.get('thumbnailImage') as string)
        : null,
    tagIdList: JSON.parse(formData.get('tagIdList') as string) as number[],
    categoryId: Number(formData.get('categoryId')),
  };

  const validated = postSchema.safeParse(rawFormData);

  if (!validated.success) {
    console.log(validated);
    return {
      errors: validated.error.flatten().fieldErrors,
      message: '유효성 검사에 실패했습니다.',
      formData: rawFormData,
    };
  }

  try {
    const { title, content, description, thumbnailImage, tagIdList, categoryId } = validated.data;
    const response = await createPost({
      title: title,
      content: content,
      description: description,
      thumbnailImage: thumbnailImage,
      tagIdList: tagIdList,
      categoryId: categoryId,
    });

    return {
      success: true,
      message: '포스트가 성공적으로 생성되었습니다.',
      slug: response.data?.slug,
    };
  } catch {
    return {
      message: '포스트 생성에 실패했습니다.',
      formData: rawFormData,
    };
  }
}
