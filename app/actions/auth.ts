import { postLogin, postLogout } from '@/lib/api/auth';
import { z } from 'zod';

const loginSchema = z.object({
  loginId: z.string().min(1, { message: '아이디를 입력해주세요.' }),
  password: z.string().min(1, { message: '비밀번호를 입력해주세요.' }),
});

export interface LoginFormState {
  message: string;
  errors?: {
    loginId?: string[];
    password?: string[];
  };
  formData?: {
    loginId: string;
    password: string;
  };
  success?: boolean;
}

export async function loginAction(prevState: LoginFormState, formData: FormData) {
  const rawFormData = {
    loginId: formData.get('loginId') as string,
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
    const { loginId, password } = validatedFields.data;

    await postLogin({ loginId, password });

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

export async function logoutAction() {
  try {
    await postLogout();

    return {
      success: true,
      message: '로그아웃에 성공했습니다.',
    };
  } catch {
    return {
      message: '로그아웃에 실패했습니다.',
    };
  }
}
