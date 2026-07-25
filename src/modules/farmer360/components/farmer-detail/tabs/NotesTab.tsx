import { StickyNote } from 'lucide-react'
import type { Farmer } from '../../../types/farmer.ts'

type NotesTabProps = {
  farmer: Farmer
}

export default function NotesTab({ farmer }: NotesTabProps) {
  return (
    <article className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
      <h3 className="text-sm font-semibold text-gray-900">CRM Notları</h3>

      {farmer.notes.length === 0 ? (
        <div className="mt-4">
          <p className="text-sm font-medium text-gray-700">Henüz not bulunmuyor</p>
          <p className="mt-1 text-sm leading-relaxed text-gray-500">
            Çiftçiyle ilgili CRM notları eklendikçe burada listelenir.
          </p>
        </div>
      ) : (
        <ul className="mt-4 space-y-3">
          {farmer.notes.map((note) => (
            <li
              key={note.id}
              className="rounded-lg border border-gray-100 bg-gray-50/60 p-4"
            >
              <div className="flex items-start gap-3">
                <StickyNote
                  className="mt-0.5 h-4 w-4 shrink-0 text-emerald-700"
                  aria-hidden="true"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="min-w-0 break-words text-sm font-medium text-gray-900">
                      {note.title}
                    </p>
                    <span className="text-[11px] text-gray-400">{note.date}</span>
                  </div>
                  <p className="mt-1.5 break-words text-sm leading-relaxed text-gray-600">
                    {note.content}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </article>
  )
}
