import { useRef, useState } from 'react';
import { Save, Trash2, Upload } from 'lucide-react';
import type { ProfileContent } from '../../content/types';
import {
  ApiError,
  clearMedia,
  saveProfile,
  uploadMedia,
  type MediaSlot,
} from '../api';
import { Field, LocalizedInput, TextInput } from '../fields';

// Enregistrement unique : pas de liste, un seul bouton d'enregistrement.
// Les fichiers sont traités à part des textes et s'appliquent immédiatement,
// plutôt qu'un état intermédiaire « choisi mais pas encore enregistré ».
export function ProfileSection({
  profile,
  onChanged,
  onAuthError,
}: {
  profile: ProfileContent;
  onChanged: () => Promise<void>;
  onAuthError: () => void;
}) {
  const [draft, setDraft] = useState<ProfileContent>(profile);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const set = <K extends keyof ProfileContent>(key: K, value: ProfileContent[K]) =>
    setDraft((current) => ({ ...current, [key]: value }));

  async function run(action: () => Promise<unknown>, success: string) {
    setBusy(true);
    setError('');
    setMessage('');
    try {
      await action();
      await onChanged();
      setMessage(success);
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

  return (
    <section className="mb-12">
      <h2 className="mb-5 font-display text-2xl uppercase tracking-tight text-bone">Profil</h2>

      {error ? (
        <p role="alert" className="mb-4 border border-signal bg-inset px-4 py-3 text-sm text-signal">
          {error}
        </p>
      ) : null}
      {message ? (
        <p role="status" className="mb-4 border border-edge bg-inset px-4 py-3 text-sm text-live">
          {message}
        </p>
      ) : null}

      <div className="panel mb-6 p-5">
        <h3 className="label mb-4">Photo et CV</h3>
        <div className="grid gap-5 md:grid-cols-3">
          <MediaControl
            slot="portrait"
            label="Photo de profil"
            accept="image/png,image/jpeg,image/webp,image/avif"
            currentUrl={draft.portrait}
            preview
            busy={busy}
            onUpload={(file) =>
              run(() => uploadMedia('portrait', file), 'Photo mise à jour.')
            }
            onClear={() => run(() => clearMedia('portrait'), 'Photo détachée.')}
          />
          <MediaControl
            slot="cv_fr"
            label="CV français (PDF)"
            accept="application/pdf"
            currentUrl={draft.cvFile.fr}
            busy={busy}
            onUpload={(file) => run(() => uploadMedia('cv_fr', file), 'CV français mis à jour.')}
            onClear={() => run(() => clearMedia('cv_fr'), 'CV français détaché.')}
          />
          <MediaControl
            slot="cv_en"
            label="CV anglais (PDF)"
            accept="application/pdf"
            currentUrl={draft.cvFile.en}
            busy={busy}
            onUpload={(file) => run(() => uploadMedia('cv_en', file), 'CV anglais mis à jour.')}
            onClear={() => run(() => clearMedia('cv_en'), 'CV anglais détaché.')}
          />
        </div>
        <p className="mt-4 font-mono text-[11px] text-faint">
          3 Mo maximum par fichier. « Détacher » revient au fichier livré avec le site.
        </p>
      </div>

      <form
        onSubmit={(event) => {
          event.preventDefault();
          void run(() => saveProfile(draft), 'Profil enregistré.');
        }}
        className="panel p-5"
      >
        <h3 className="label mb-4">Identité</h3>
        <div className="grid gap-x-5 md:grid-cols-2">
          <Field label="Nom complet" htmlFor="full-name" hint="Affiché en grand dans le héros.">
            <TextInput id="full-name" value={draft.fullName} onChange={(v) => set('fullName', v)} />
          </Field>
          <Field label="Initiales" htmlFor="initials" hint="Logo de la barre de navigation.">
            <TextInput id="initials" value={draft.initials} onChange={(v) => set('initials', v)} />
          </Field>
          <Field label="Email" htmlFor="email">
            <TextInput id="email" type="email" value={draft.email} onChange={(v) => set('email', v)} />
          </Field>
          <Field label="Téléphone affiché" htmlFor="phone">
            <TextInput id="phone" value={draft.phone} onChange={(v) => set('phone', v)} />
          </Field>
          <Field
            label="Téléphone pour le lien"
            htmlFor="phone-href"
            hint="Sans espace ni signe, ex. +2250586903607"
          >
            <TextInput id="phone-href" value={draft.phoneHref} onChange={(v) => set('phoneHref', v)} />
          </Field>
        </div>

        <h3 className="label mb-4 mt-4">Liens</h3>
        <div className="grid gap-x-5 md:grid-cols-2">
          <Field label="GitHub" htmlFor="github" hint="Adresse complète, commençant par https://">
            <TextInput id="github" value={draft.githubUrl} onChange={(v) => set('githubUrl', v)} />
          </Field>
          <Field label="LinkedIn" htmlFor="linkedin" hint="Adresse complète, commençant par https://">
            <TextInput id="linkedin" value={draft.linkedinUrl} onChange={(v) => set('linkedinUrl', v)} />
          </Field>
          <Field
            label="GitLab"
            htmlFor="gitlab"
            hint="Adresse complète, commençant par https:// — laisser vide pour masquer le lien"
          >
            <TextInput id="gitlab" value={draft.gitlabUrl} onChange={(v) => set('gitlabUrl', v)} />
          </Field>
        </div>

        <h3 className="label mb-4 mt-4">Textes affichés</h3>
        <LocalizedInput id="role" label="Intitulé du poste" value={draft.role} onChange={(v) => set('role', v)} />
        <LocalizedInput id="location" label="Localisation" value={draft.location} onChange={(v) => set('location', v)} />
        <LocalizedInput id="nationality" label="Nationalité" value={draft.nationality} onChange={(v) => set('nationality', v)} />
        <LocalizedInput id="availability" label="Disponibilité" value={draft.availability} onChange={(v) => set('availability', v)} />
        <LocalizedInput
          id="pitch"
          label="Accroche du héros"
          value={draft.pitch}
          onChange={(v) => set('pitch', v)}
          multiline
          rows={4}
          hint="Deux ou trois lignes, juste sous le nom."
        />
        <LocalizedInput
          id="bio1"
          label="Présentation — premier paragraphe"
          value={draft.bio1}
          onChange={(v) => set('bio1', v)}
          multiline
          rows={6}
        />
        <LocalizedInput
          id="bio2"
          label="Présentation — second paragraphe"
          value={draft.bio2}
          onChange={(v) => set('bio2', v)}
          multiline
          rows={5}
        />

        <button
          type="submit"
          disabled={busy}
          className="inline-flex items-center gap-2 bg-signal px-4 py-2 font-mono text-[11px] uppercase tracking-[0.14em] text-ink transition-colors hover:bg-bone disabled:opacity-50"
        >
          <Save className="h-3.5 w-3.5" />
          {busy ? 'Enregistrement…' : 'Enregistrer le profil'}
        </button>
      </form>
    </section>
  );
}

// L'input file natif est masqué et piloté par un bouton : son apparence varie
// d'un navigateur à l'autre et ne peut pas être stylée. Le bouton reste
// atteignable au clavier.
function MediaControl({
  slot,
  label,
  accept,
  currentUrl,
  preview = false,
  busy,
  onUpload,
  onClear,
}: {
  slot: MediaSlot;
  label: string;
  accept: string;
  currentUrl: string;
  preview?: boolean;
  busy: boolean;
  onUpload: (file: File) => void;
  onClear: () => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const isUploaded = currentUrl.startsWith('/api/media/');

  return (
    <div>
      <span className="label mb-2 block">{label}</span>

      {preview && currentUrl ? (
        <img
          src={currentUrl}
          alt=""
          className="mb-2 aspect-square w-full border border-edge object-cover"
        />
      ) : null}

      {!preview && currentUrl ? (
        <a
          href={currentUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mb-2 block truncate font-mono text-[11px] text-signal hover:underline"
        >
          Ouvrir le fichier actuel
        </a>
      ) : (
        !preview && <p className="mb-2 font-mono text-[11px] text-faint">Aucun fichier.</p>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="sr-only"
        id={`file-${slot}`}
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) onUpload(file);
          // Permet de resélectionner le même fichier juste après.
          event.target.value = '';
        }}
      />

      <div className="flex gap-2">
        <button
          type="button"
          disabled={busy}
          onClick={() => inputRef.current?.click()}
          className="inline-flex flex-1 items-center justify-center gap-2 border border-edge px-3 py-2 font-mono text-[10px] uppercase tracking-[0.12em] text-bone transition-colors hover:border-signal hover:text-signal disabled:opacity-40"
        >
          <Upload className="h-3.5 w-3.5" />
          Remplacer
        </button>
        {isUploaded ? (
          <button
            type="button"
            disabled={busy}
            onClick={onClear}
            title="Revenir au fichier livré avec le site"
            aria-label={`Détacher : ${label}`}
            className="border border-edge px-3 py-2 text-muted transition-colors hover:border-signal hover:text-signal disabled:opacity-40"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        ) : null}
      </div>
    </div>
  );
}
