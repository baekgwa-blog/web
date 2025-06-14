'use server';

import { postLogin } from '@/lib/api/auth';
import { z } from 'zod';

const loginSchema = z.object({
  username: z.string().min(1, { message: '아이디를 입력해주세요.' }),
  password: z.string().min(1, { message: '비밀번호를 입력해주세요.' }),
});

export interface LoginFormState {
  message: string;
  errors?: {
    username?: string[];
    password?: string[];
  };
  formData?: {
    username: string;
    password: string;
  };
  success?: boolean;
}

export async function loginAction(prevState: LoginFormState, formData: FormData) {
  const rawFormData = {
    username: formData.get('username') as string,
    password: formData.get('password') as string,
  };

  const validatedFields = loginSchema.safeParse(rawFormData);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: '로그인 정보를 다시 확인해주세요.',
      formData: rawFormData,
    };
  }

  try {
    const { username, password } = validatedFields.data;

    await postLogin({ username, password });

    return {
      success: true,
      message: '로그인에 성공했습니다.',
    };
  } catch {
    return {
      message: '로그인에 실패했습니다.',
      formData: rawFormData,
    };
  }
}
