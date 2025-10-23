'use client';

import { useEffect, useState } from 'react';
import AuthGuard from '@/components/AuthGuard';
import { api } from '@/lib/api';
import { routes } from '@/lib/routes';
import { NoteForm, NoteFormInput } from '@/components/NoteForm';
import { NoteItem } from '@/components/NoteItem';

type Note = {
  id: string;
  title: string;
  body: string;
  isNotice?: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export default function NotesPage() {
  const [notes, setNotes] = useState<Note[] | null>(null);
  const [loading, setLoading] = useState(true);

  async function fetchNotes() {
    setLoading(true);
    const res = await api.get(routes.boards(0, 10)); 
    const data = res.data;
    const items: Note[] = Array.isArray(data) ? data : (data.items ?? data.content ?? data.results ?? []);
    setNotes(items);
    setLoading(false);
  }

  useEffect(() => { fetchNotes(); }, []);

  async function createNote(v: NoteFormInput) {
    await api.post(routes.boards(), v);
    await fetchNotes();
  }

  async function updateNote(id: string, patch: NoteFormInput) {
    await api.patch(routes.boardById(id), patch);
    await fetchNotes();
  }

  async function deleteNote(id: string) {
    await api.delete(routes.boardById(id));
    await fetchNotes();
  }

  return (
    <AuthGuard>
      <div className="grid gap-6 md:grid-cols-[1fr,2fr]">
        <section className="rounded-2xl border bg-white p-4">
          <h2 className="mb-3 font-semibold">New note</h2>
          <NoteForm onSubmit={createNote} />
        </section>

        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">Your notes</h2>
            <button className="btn-outline" onClick={fetchNotes}>Refresh</button>
          </div>

          {loading && <p>Loading…</p>}
          {!loading && (notes?.length ?? 0) === 0 && <p>No notes yet.</p>}

          <div className="grid gap-3">
            {notes?.map((n) => (
              <NoteItem key={n.id} note={n} onUpdate={updateNote} onDelete={deleteNote} />
            ))}
          </div>
        </section>
      </div>
    </AuthGuard>
  );
}
