'use client';

import { useState, useEffect } from 'react';
import { useActionState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2 } from 'lucide-react';
import { loginAction } from '@/app/actions/auth';
import { useAuthStore } from '@/lib/store/auth';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

export function LoginForm() {
  const [isOpen, setIsOpen] = useState(false);
  const setLoggedIn = useAuthStore((state) => state.setLoggedIn);
  const [state, formAction, isPending] = useActionState(loginAction, {
    message: '',
    errors: {},
    formData: {
      username: '',
      password: '',
    },
  });

  useEffect(() => {
    if (state.success) {
      setLoggedIn(true);
      setIsOpen(false);
    }
  }, [state.success, setLoggedIn]);

  return (
    <>
      <Button variant="outline" size="sm" onClick={() => setIsOpen(true)}>
        로그인
      </Button>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>로그인</DialogTitle>
          </DialogHeader>
          <form action={formAction} className="space-y-4">
            {state?.message && (
              <Alert className={`mb-6 ${state.errors ? 'bg-red-50' : 'bg-green-50'}`}>
                <AlertDescription>{state.message}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="username">아이디</Label>
              <Input
                id="username"
                name="username"
                placeholder="아이디를 입력해주세요"
                className="h-12"
                defaultValue={state?.formData?.username}
              />
              {state?.errors?.username && (
                <p className="text-destructive text-sm">{state.errors.username[0]}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">비밀번호</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="비밀번호를 입력해주세요"
                className="h-12"
                defaultValue={state?.formData?.password}
              />
              {state?.errors?.password && (
                <p className="text-destructive text-sm">{state.errors.password[0]}</p>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              로그인
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
