'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';

type Props = { children: React.ReactNode };

export default function AuthGuard({ children }: Props) {
  const authed = useAuthStore((s) => s.isAuthed);
  const router = useRouter();

  useEffect(() => {
    if (!authed) router.replace('/signin');
  }, [authed, router]);

  if (!authed) return null;
  return <>{children}</>;
}
