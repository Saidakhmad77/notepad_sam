'use client';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { api } from '@/lib/api';
import { routes } from '@/lib/routes';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

const schema = z
  .object({
    username: z.string().email('유효한 이메일을 입력하세요.'),
    name: z.string().min(1, '이름을 입력하세요.'),
    password: z.string().min(6, '비밀번호는 최소 6자리 이상이어야 합니다.'),
    confirmPassword: z.string().min(6, '비밀번호 확인을 입력하세요.'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: '비밀번호가 일치하지 않습니다.',
    path: ['confirmPassword'],
  });

type FormData = z.infer<typeof schema>;

export default function SignUpPage() {
  const router = useRouter();
  const setTokens = useAuthStore((s) => s.setTokens);
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors, isSubmitting } } =
    useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    setServerError(null);
    try {
      const res = await api.post(routes.signup(), {
        username: data.username,
        name: data.name,
        password: data.password,
        confirmPassword: data.confirmPassword,
      });

      const { accessToken, refreshToken } = res.data;
      setTokens(accessToken, refreshToken);
      router.replace('/signin');
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        '회원가입 실패';
      setServerError(String(msg));
    }
  };

  return (
    <div className="mx-auto max-w-md rounded-2xl border bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-xl font-semibold">회원가입</h2>

      {serverError && (
        <div className="mb-3 rounded-lg border border-red-300 bg-red-50 p-3 text-sm text-red-700">
          {serverError}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <input
          className="input"
          placeholder="이메일 (Username)"
          {...register('username')}
        />
        {errors.username && (
          <p className="text-sm text-red-600">{errors.username.message}</p>
        )}

        <input className="input" placeholder="이름" {...register('name')} />
        {errors.name && (
          <p className="text-sm text-red-600">{errors.name.message}</p>
        )}

        <div className="relative">
          <input
            className="input pr-10"
            type={showPassword ? 'text' : 'password'}
            placeholder="비밀번호"
            {...register('password')}
          />
          <button
            type="button"
            className="absolute right-3 top-2.5 text-gray-500"
            onClick={() => setShowPassword((p) => !p)}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        {errors.password && (
          <p className="text-sm text-red-600">{errors.password.message}</p>
        )}

        <input
          className="input"
          type={showPassword ? 'text' : 'password'}
          placeholder="비밀번호 확인"
          {...register('confirmPassword')}
        />
        {errors.confirmPassword && (
          <p className="text-sm text-red-600">{errors.confirmPassword.message}</p>
        )}

        <button disabled={isSubmitting} className="btn w-full">
          {isSubmitting ? '가입 중…' : '회원가입'}
        </button>
      </form>
    </div>
  );
}