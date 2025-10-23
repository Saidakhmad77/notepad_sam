'use client';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const schema = z.object({
  title: z.string().min(1),
  body: z.string().min(1),
  isNotice: z.boolean().optional(),
});
export type NoteFormInput = z.infer<typeof schema>;

export function NoteForm({ defaultValues, onSubmit } : {
  defaultValues?: Partial<NoteFormInput>;
  onSubmit: (values: NoteFormInput) => Promise<void>;
}) {
  const { register, handleSubmit, formState: { isSubmitting } } =
    useForm<NoteFormInput>({ resolver: zodResolver(schema), defaultValues });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
      <input className="input" placeholder="Title" {...register('title')} />
      <textarea className="input min-h-32" placeholder="Body" {...register('body')} />
      <label className="flex items-center gap-2">
        <input type="checkbox" {...register('isNotice')} />
        <span>Mark as notice</span>
      </label>
      <button className="btn" disabled={isSubmitting}>
        {isSubmitting ? 'Saving…' : 'Save'}
      </button>
    </form>
  );
}
