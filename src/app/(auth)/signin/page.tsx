'use client';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { api } from '@/lib/api';
import { routes } from '@/lib/routes';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';

const schema = z.object({ email: z.string().email(), password: z.string().min(6) });
type FormData = z.infer<typeof schema>;

export default function SignInPage() {
  const router = useRouter();
  const setTokens = useAuthStore((s) => s.setTokens);
  const { register, handleSubmit, formState: { errors, isSubmitting } } =
    useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    const res = await api.post(routes.signin(), data);
    const { accessToken, refreshToken } = res.data;
    setTokens(accessToken, refreshToken);
    router.replace('/notes');
  };

  return (
    <div className="mx-auto max-w-md rounded-2xl border bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-xl font-semibold">Sign in</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <input className="input" placeholder="Email" {...register('email')} />
        {errors.email && <p className="text-sm text-red-600">{errors.email.message}</p>}
        <input className="input" type="password" placeholder="Password" {...register('password')} />
        {errors.password && <p className="text-sm text-red-600">{errors.password.message}</p>}
        <button disabled={isSubmitting} className="btn w-full">
          {isSubmitting ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
    </div>
  );
}
