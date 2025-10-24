'use client';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { api } from '@/lib/api';
import { routes } from '@/lib/routes';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { useState } from 'react';

const schema = z.object({
  username: z.string().email('Enter a valid email'),
  password: z.string().min(6, 'Min 6 characters'),
});
type FormData = z.infer<typeof schema>;

export default function SignInPage() {
  const router = useRouter();
  const setTokens = useAuthStore((s) => s.setTokens);
  const [serverError, setServerError] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors, isSubmitting } } =
    useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    setServerError(null);
    try {
      const res = await api.post(
        routes.signin(),
        { username: data.username, password: data.password },
        { headers: { 'Content-Type': 'application/json' } }
      );

      console.log('SIGNIN RESPONSE', res.data);

      const payload = res.data;
      const accessToken =
        payload?.accessToken ??
        payload?.access_token ??
        payload?.data?.accessToken ??
        payload?.data?.token ??
        payload?.token; 

      const refreshToken =
        payload?.refreshToken ??
        payload?.refresh_token ??
        payload?.data?.refreshToken;

      if (!accessToken) {
        throw new Error('No accessToken found in signin response');
      }

      setTokens(accessToken, refreshToken);
      router.replace('/notes');
    } catch (err: any) {
      console.error('LOGIN ERROR', {
        status: err?.response?.status,
        data: err?.response?.data,
      });
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        'Invalid credentials';
      setServerError(String(msg));
    }
  };

  return (
    <div className="mx-auto max-w-md rounded-2xl border bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-xl font-semibold">Sign in</h2>

      {serverError && (
        <div className="mb-3 rounded-lg border border-red-300 bg-red-50 p-3 text-sm text-red-700">
          {serverError}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <input className="input" placeholder="Email (username)" {...register('username')} />
        {errors.username && <p className="text-sm text-red-600">{errors.username.message}</p>}

        <input className="input" type="password" placeholder="Password" {...register('password')} />
        {errors.password && <p className="text-sm text-red-600">{errors.password.message}</p>}

        <button disabled={isSubmitting} className="btn w-full">
          {isSubmitting ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
    </div>
  );
}