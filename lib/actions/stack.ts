import z from 'zod';
import {
  postStackRegister,
  PostNewStackRequest,
  PutStackModifyRequest,
  putStackModify,
} from '@/lib/api/stack';
import { ApiError } from '../api-client';

const stackPostSchema = z.object({
  postId: z.coerce.number().int().positive('유효한 포스트 ID가 필요합니다.'),
  sequence: z.coerce.number().int().positive('순서는 1 이상이어야 합니다.'),
});

const newStackSchema = z.object({
  title: z.string().min(1, '제목을 입력해주세요.'),
  description: z.string().min(1, '설명을 입력해주세요.'),
  categoryId: z.coerce.number().int().positive('유효한 카테고리를 선택해주세요.'),
  thumbnailImage: z.string(),
  stackPostList: z.array(stackPostSchema).min(1, '최소 하나 이상의 포스트를 추가해주세요.'),
});

const createStackValidatorSchema = z
  .string()
  .min(1, '스택 데이터가 비어있습니다.')
  .transform((str, ctx) => {
    try {
      return JSON.parse(str);
    } catch {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: '데이터 형식이 올바르지 않습니다. (JSON 파싱 실패)',
      });
      return z.NEVER;
    }
  })
  .pipe(newStackSchema);

type PostError = {
  postId?: string;
  sequence?: string;
};

type NewStackError = {
  title?: string;
  description?: string;
  categoryId?: string;
  thumbnailImage?: string;
  stackPostList?: PostError[];
};

export interface CreateNewStackFormState {
  message: string;
  errors?: NewStackError;
  success?: boolean;
  stackId?: number;
}

export async function createNewStackAction(
  prevState: CreateNewStackFormState,
  formData: FormData
): Promise<CreateNewStackFormState> {
  const rawFormData = {
    stackData: formData.get('stackData'),
  };

  const validatedFields = createStackValidatorSchema.safeParse(rawFormData.stackData);

  if (!validatedFields.success) {
    const errors: NewStackError = {};

    for (const issue of validatedFields.error.issues) {
      if (issue.code === z.ZodIssueCode.custom) {
        return { message: issue.message, success: false };
      }

      const fieldName = issue.path[0] as keyof NewStackError;

      if (fieldName === 'stackPostList') {
        const rowIndex = issue.path[1] as number;
        const postFieldName = issue.path[2] as keyof PostError;

        if (typeof rowIndex === 'number' && postFieldName) {
          if (!errors.stackPostList) {
            errors.stackPostList = [];
          }
          if (!errors.stackPostList[rowIndex]) {
            errors.stackPostList[rowIndex] = {};
          }
          errors.stackPostList[rowIndex][postFieldName] = issue.message;
        } else if (issue.path.length === 1) {
          return { message: issue.message, success: false };
        }
      } else if (issue.path.length === 1 && fieldName) {
        errors[fieldName] = issue.message;
      }
    }

    return {
      message: '입력값을 다시 확인해주세요.',
      errors: errors,
      success: false,
    };
  }

  try {
    const dataToSubmit: PostNewStackRequest = validatedFields.data;
    const response = await postStackRegister(dataToSubmit);
    const stackId = response.data!.stackId;

    return {
      message: '새 스택이 성공적으로 등록되었습니다.',
      success: true,
      stackId: stackId,
    };
  } catch (e) {
    const message =
      e instanceof ApiError ? e.message : '서버 연결 상태가 좋지 않습니다. 다시 시도해 주세요.';
    return {
      message,
      success: false,
    };
  }
}

const updateStackSchema = z.object({
  title: z.string().min(1, '제목을 입력해주세요.'),
  description: z.string().min(1, '설명을 입력해주세요.'),
  thumbnailImage: z.string(),
  stackPostList: z.array(stackPostSchema).min(1, '최소 하나 이상의 포스트를 추가해주세요.'),
});

const updateStackValidatorSchema = z
  .string()
  .min(1, '스택 데이터가 비어있습니다.')
  .transform((str, ctx) => {
    try {
      return JSON.parse(str);
    } catch {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: '데이터 형식이 올바지르지 않습니다.',
      });
      return z.NEVER;
    }
  })
  .pipe(updateStackSchema);

export type UpdateStackFormState = CreateNewStackFormState;

export async function updateStackAction(
  stackId: number,
  prevState: UpdateStackFormState,
  formData: FormData
): Promise<UpdateStackFormState> {
  const rawFormData = {
    stackData: formData.get('stackData'),
  };

  const validatedFields = updateStackValidatorSchema.safeParse(rawFormData.stackData);

  if (!validatedFields.success) {
    const errors: NewStackError = {};

    for (const issue of validatedFields.error.issues) {
      if (issue.code === z.ZodIssueCode.custom) {
        return { message: issue.message, success: false };
      }

      const fieldName = issue.path[0] as keyof NewStackError;

      if (fieldName === 'stackPostList') {
        const rowIndex = issue.path[1] as number;
        const postFieldName = issue.path[2] as keyof PostError;

        if (typeof rowIndex === 'number' && postFieldName) {
          if (!errors.stackPostList) {
            errors.stackPostList = [];
          }
          if (!errors.stackPostList[rowIndex]) {
            errors.stackPostList[rowIndex] = {};
          }
          errors.stackPostList[rowIndex][postFieldName] = issue.message;
        } else if (issue.path.length === 1) {
          return { message: issue.message, success: false };
        }
      } else if (issue.path.length === 1 && fieldName) {
        errors[fieldName] = issue.message;
      }
    }

    return {
      message: '입력값을 다시 확인해주세요.',
      errors: errors,
      success: false,
    };
  }

  try {
    const dataToSubmit: PutStackModifyRequest = validatedFields.data;

    const response = await putStackModify(stackId, dataToSubmit);
    const updatedStackId = response.data!.stackId;

    return {
      message: '스택이 성공적으로 수정되었습니다.',
      success: true,
      stackId: updatedStackId,
    };
  } catch (e) {
    const message =
      e instanceof ApiError ? e.message : '서버 연결 상태가 좋지 않습니다. 다시 시도해 주세요.';
    return {
      message,
      success: false,
    };
  }
}
