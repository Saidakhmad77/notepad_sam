'use client';

import { useState } from 'react';
import { NoteForm, NoteFormInput } from './NoteForm';

export type Note = {
  id: string;
  title: string;
  body: string;
  isNotice?: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export function NoteItem({ note, onUpdate, onDelete } : {
  note: Note;
  onUpdate: (id: string, patch: NoteFormInput) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}) {
  const [editing, setEditing] = useState(false);

  if (editing) {
    return (
      <div className="rounded-xl border bg-white p-4">
        <NoteForm
          defaultValues={{ title: note.title, body: note.body, isNotice: note.isNotice }}
          onSubmit={async (v) => { await onUpdate(note.id, v); setEditing(false); }}
        />
        <button className="text-sm mt-2" onClick={() => setEditing(false)}>Cancel</button>
      </div>
    );
  }

  return (
    <div className="rounded-xl border bg-white p-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">{note.title}</h3>
        {note.isNotice && <span className="rounded bg-yellow-100 px-2 py-0.5 text-xs">NOTICE</span>}
      </div>
      <p className="whitespace-pre-wrap text-sm text-gray-700 mt-2">{note.body}</p>
      <div className="mt-3 flex gap-3 text-sm">
        <button className="link" onClick={() => setEditing(true)}>Edit</button>
        <button className="link text-red-600" onClick={() => onDelete(note.id)}>Delete</button>
      </div>
    </div>
  );
}
