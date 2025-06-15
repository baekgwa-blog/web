'use client';

import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/auth';
import { Button } from '@/components/ui/button';
import { logoutAction } from '@/app/actions/auth';

export function LogoutButton() {
  const logout = useAuthStore((state) => state.logout);
  const router = useRouter();

  const handleLogout = async () => {
    logoutAction();
    logout();
    router.refresh();
  };

  return (
    <Button onClick={handleLogout} size="sm" variant="outline">
      로그아웃
    </Button>
  );
}
