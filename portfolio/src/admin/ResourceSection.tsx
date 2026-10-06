import { useState, type ReactNode } from 'react';
import { ChevronDown, ChevronUp, Pencil, Plus, Save, Trash2, X } from 'lucide-react';
import { ApiError, createItem, deleteItem, reorderItems, updateItem } from './api';

// Liste éditable générique. Expériences, formations, projets, groupes de
// compétences et listes simples se gèrent de la même façon ; seuls diffèrent
// `blank` (objet de départ), `summary` (ligne affichée) et `renderForm`.
// Cinq copies de ce comportement finiraient par diverger.

interface Props<T extends { id: number }> {
  resource: string;
  title: string;
  description?: string;
  items: T[];
  blank: () => Omit<T, 'id'>;
  summary: (item: T) => string;
  renderForm: (draft: Omit<T, 'id'>, update: (next: Omit<T, 'id'>) => void) => ReactNode;
  onChanged: () => Promise<void>;
  onAuthError: () => void;
  /** Champs ajoutés à la création seulement (ex. `groupId`). */
  extraOnCreate?: Record<string, unknown>;
}

type Editing<T> = { mode: 'create'; draft: Omit<T, 'id'> } | { mode: 'edit'; id: number; draft: Omit<T, 'id'> } | null;

export function ResourceSection<T extends { id: number }>({
  resource,
  title,
  description,
  items,
  blank,
  summary,
  renderForm,
  onChanged,
  onAuthError,
  extraOnCreate,
}: Props<T>) {
  const [editing, setEditing] = useState<Editing<T>>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  // Enveloppe commune aux écritures : état occupé, erreur lisible,
  // rechargement, et retour à la connexion si la session a expiré.
  async function run(action: () => Promise<unknown>) {
    setBusy(true);
    setError('');
    try {
      await action();
      await onChanged();
      setEditing(null);
    } catch (caught) {
      if (caught instanceof ApiError && caught.isUnauthenticated) {
        onAuthError();
        return;
      }
      setError(caught instanceof Error ? caught.message : 'Échec de l’enregistrement.');
    } finally {
      setBusy(false);
    }
  }

  const save = () => {
    if (!editing) return;
    if (editing.mode === 'create') {
      void run(() => createItem(resource, { ...editing.draft, ...extraOnCreate }));
    } else {
      void run(() => updateItem(resource, editing.id, editing.draft));
    }
  };

  const remove = (item: T) => {
    // Le résumé est rappelé pour éviter de supprimer la mauvaise ligne.
    if (!window.confirm(`Supprimer définitivement « ${summary(item)} » ?`)) return;
    void run(() => deleteItem(resource, item.id));
  };

  // Échange avec le voisin, puis envoie l'ordre complet au serveur.
  const move = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= items.length) return;
    const ids = items.map((item) => item.id);
    [ids[index], ids[target]] = [ids[target], ids[index]];
    void run(() => reorderItems(resource, ids));
  };

  return (
    <section className="mb-12">
      <header className="mb-5 flex flex-wrap items-baseline justify-between gap-3">
        <div>
          <h2 className="font-display text-2xl uppercase tracking-tight text-bone">{title}</h2>
          {description ? (
            <p className="mt-1 font-mono text-[11px] text-faint">{description}</p>
          ) : null}
        </div>
        <button
          type="button"
          disabled={busy || editing !== null}
          onClick={() => setEditing({ mode: 'create', draft: blank() })}
          className="inline-flex items-center gap-2 border border-edge-hi px-3 py-2 font-mono text-[11px] uppercase tracking-[0.14em] text-bone transition-colors hover:border-signal hover:text-signal disabled:opacity-40"
        >
          <Plus className="h-3.5 w-3.5" />
          Ajouter
        </button>
      </header>

      {error ? (
        <p role="alert" className="mb-4 border border-signal bg-inset px-4 py-3 text-sm text-signal">
          {error}
        </p>
      ) : null}

      {items.length === 0 && editing === null ? (
        <p className="panel px-4 py-6 text-center text-sm text-faint">
          Aucune entrée pour l’instant.
        </p>
      ) : null}

      <ul className="space-y-2">
        {items.map((item, index) => (
          <li key={item.id} className="panel">
            <div className="flex items-center gap-3 px-4 py-3">
              <span className="font-mono text-[11px] text-faint">
                {String(index + 1).padStart(2, '0')}
              </span>
              <span className="min-w-0 flex-1 truncate text-sm text-bone">{summary(item)}</span>

              <div className="flex shrink-0 items-center gap-1">
                <IconButton
                  label="Monter"
                  disabled={busy || index === 0}
                  onClick={() => move(index, -1)}
                >
                  <ChevronUp className="h-4 w-4" />
                </IconButton>
                <IconButton
                  label="Descendre"
                  disabled={busy || index === items.length - 1}
                  onClick={() => move(index, 1)}
                >
                  <ChevronDown className="h-4 w-4" />
                </IconButton>
                <IconButton
                  label="Modifier"
                  disabled={busy}
                  onClick={() => {
                    // `id` retiré : il reste porté par l'URL, pas par le formulaire.
                    const { id: _ignored, ...rest } = item;
                    setEditing({ mode: 'edit', id: item.id, draft: rest as Omit<T, 'id'> });
                  }}
                >
                  <Pencil className="h-4 w-4" />
                </IconButton>
                <IconButton label="Supprimer" disabled={busy} onClick={() => remove(item)}>
                  <Trash2 className="h-4 w-4" />
                </IconButton>
              </div>
            </div>

            {editing?.mode === 'edit' && editing.id === item.id ? (
              <FormShell
                busy={busy}
                onCancel={() => setEditing(null)}
                onSave={save}
              >
                {renderForm(editing.draft, (next) =>
                  setEditing({ mode: 'edit', id: item.id, draft: next }),
                )}
              </FormShell>
            ) : null}
          </li>
        ))}
      </ul>

      {editing?.mode === 'create' ? (
        <div className="panel mt-2">
          <FormShell busy={busy} onCancel={() => setEditing(null)} onSave={save}>
            {renderForm(editing.draft, (next) => setEditing({ mode: 'create', draft: next }))}
          </FormShell>
        </div>
      ) : null}
    </section>
  );
}

function IconButton({
  label,
  disabled,
  onClick,
  children,
}: {
  label: string;
  disabled?: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className="border border-transparent p-1.5 text-muted transition-colors hover:border-edge hover:text-signal disabled:opacity-25 disabled:hover:border-transparent disabled:hover:text-muted"
    >
      {children}
    </button>
  );
}

function FormShell({
  busy,
  onCancel,
  onSave,
  children,
}: {
  busy: boolean;
  onCancel: () => void;
  onSave: () => void;
  children: ReactNode;
}) {
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        onSave();
      }}
      className="border-t border-edge px-4 py-5"
    >
      {children}

      <div className="mt-2 flex gap-2">
        <button
          type="submit"
          disabled={busy}
          className="inline-flex items-center gap-2 bg-signal px-4 py-2 font-mono text-[11px] uppercase tracking-[0.14em] text-ink transition-colors hover:bg-bone disabled:opacity-50"
        >
          <Save className="h-3.5 w-3.5" />
          {busy ? 'Enregistrement…' : 'Enregistrer'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={busy}
          className="inline-flex items-center gap-2 border border-edge px-4 py-2 font-mono text-[11px] uppercase tracking-[0.14em] text-muted transition-colors hover:border-signal hover:text-signal disabled:opacity-50"
        >
          <X className="h-3.5 w-3.5" />
          Annuler
        </button>
      </div>
    </form>
  );
}
