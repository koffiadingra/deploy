import { type ReactNode } from 'react';
import { Plus, X } from 'lucide-react';
import type { Localized } from '../content/types';

// Champs partagés par les six sections d'édition : les écrire une fois évite
// des variantes divergentes et traite l'étiquetage et l'accessibilité
// uniformément. Tous sont contrôlés — React détient la valeur.

const inputClass =
  'w-full border border-edge bg-inset px-3 py-2 text-sm text-bone placeholder:text-faint ' +
  'transition-colors focus:border-signal focus:outline-none';

export function Field({
  label,
  htmlFor,
  hint,
  children,
}: {
  label: string;
  htmlFor?: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <div className="mb-5">
      <label htmlFor={htmlFor} className="label mb-2 block">
        {label}
      </label>
      {children}
      {hint ? <p className="mt-1.5 font-mono text-[11px] text-faint">{hint}</p> : null}
    </div>
  );
}

export function TextInput({
  id,
  value,
  onChange,
  placeholder,
  type = 'text',
}: {
  id: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <input
      id={id}
      type={type}
      value={value}
      placeholder={placeholder}
      onChange={(event) => onChange(event.target.value)}
      className={inputClass}
    />
  );
}

export function TextArea({
  id,
  value,
  onChange,
  rows = 4,
  placeholder,
}: {
  id: string;
  value: string;
  onChange: (value: string) => void;
  rows?: number;
  placeholder?: string;
}) {
  return (
    <textarea
      id={id}
      rows={rows}
      value={value}
      placeholder={placeholder}
      onChange={(event) => onChange(event.target.value)}
      className={`${inputClass} resize-y`}
    />
  );
}

// Les deux langues côte à côte plutôt que derrière un sélecteur : une
// traduction manquante se voit immédiatement.
export function LocalizedInput({
  id,
  label,
  value,
  onChange,
  multiline = false,
  rows = 3,
  hint,
}: {
  id: string;
  label: string;
  value: Localized;
  onChange: (value: Localized) => void;
  multiline?: boolean;
  rows?: number;
  hint?: string;
}) {
  const Control = multiline ? TextArea : TextInput;

  return (
    <Field label={label} hint={hint}>
      <div className="grid gap-3 md:grid-cols-2">
        <div>
          <span className="mb-1 block font-mono text-[10px] text-signal">FR</span>
          <Control
            id={`${id}-fr`}
            value={value.fr}
            rows={rows}
            onChange={(next: string) => onChange({ ...value, fr: next })}
          />
        </div>
        <div>
          <span className="mb-1 block font-mono text-[10px] text-signal">EN</span>
          <Control
            id={`${id}-en`}
            value={value.en}
            rows={rows}
            onChange={(next: string) => onChange({ ...value, en: next })}
          />
        </div>
      </div>
    </Field>
  );
}

// Une ligne par entrée, avec son bouton de suppression. Un textarea unique
// découpé sur les sauts de ligne empêcherait de supprimer une ligne précise.
function StringListEditor({
  idPrefix,
  values,
  onChange,
}: {
  idPrefix: string;
  values: string[];
  onChange: (values: string[]) => void;
}) {
  const update = (index: number, next: string) =>
    onChange(values.map((entry, i) => (i === index ? next : entry)));

  const remove = (index: number) => onChange(values.filter((_, i) => i !== index));

  return (
    <div className="space-y-2">
      {values.map((entry, index) => (
        <div key={index} className="flex gap-2">
          <input
            id={`${idPrefix}-${index}`}
            value={entry}
            onChange={(event) => update(index, event.target.value)}
            className={inputClass}
          />
          <button
            type="button"
            onClick={() => remove(index)}
            aria-label={`Supprimer la ligne ${index + 1}`}
            className="shrink-0 border border-edge px-2 text-muted transition-colors hover:border-signal hover:text-signal"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}

      <button
        type="button"
        onClick={() => onChange([...values, ''])}
        className="inline-flex items-center gap-2 border border-edge px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.12em] text-muted transition-colors hover:border-signal hover:text-signal"
      >
        <Plus className="h-3.5 w-3.5" />
        Ajouter une ligne
      </button>
    </div>
  );
}

export function LocalizedListInput({
  id,
  label,
  value,
  onChange,
  hint,
}: {
  id: string;
  label: string;
  value: Localized<string[]>;
  onChange: (value: Localized<string[]>) => void;
  hint?: string;
}) {
  return (
    <Field label={label} hint={hint}>
      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <span className="mb-2 block font-mono text-[10px] text-signal">FR</span>
          <StringListEditor
            idPrefix={`${id}-fr`}
            values={value.fr}
            onChange={(next) => onChange({ ...value, fr: next })}
          />
        </div>
        <div>
          <span className="mb-2 block font-mono text-[10px] text-signal">EN</span>
          <StringListEditor
            idPrefix={`${id}-en`}
            values={value.en}
            onChange={(next) => onChange({ ...value, en: next })}
          />
        </div>
      </div>
    </Field>
  );
}

// Mots courts et nombreux : une seule ligne séparée par des virgules. Le
// découpage n'a lieu qu'à la sortie du champ, sinon taper une virgule couperait
// le mot en cours de frappe.
export function TagsInput({
  id,
  label,
  value,
  onChange,
  hint,
}: {
  id: string;
  label: string;
  value: string[];
  onChange: (value: string[]) => void;
  hint?: string;
}) {
  return (
    <Field label={label} htmlFor={id} hint={hint ?? 'Séparez les entrées par une virgule.'}>
      <input
        id={id}
        defaultValue={value.join(', ')}
        key={value.join('\u0000')}
        onBlur={(event) =>
          onChange(
            event.target.value
              .split(',')
              .map((entry) => entry.trim())
              .filter(Boolean),
          )
        }
        className={inputClass}
      />
      {value.length > 0 ? (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {value.map((tag) => (
            <span
              key={tag}
              className="border border-edge bg-inset px-2 py-0.5 font-mono text-[11px] text-muted"
            >
              {tag}
            </span>
          ))}
        </div>
      ) : null}
    </Field>
  );
}

export function Checkbox({
  id,
  label,
  checked,
  onChange,
  hint,
}: {
  id: string;
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  hint?: string;
}) {
  return (
    <div className="mb-5">
      <label htmlFor={id} className="flex cursor-pointer items-center gap-3">
        <input
          id={id}
          type="checkbox"
          checked={checked}
          onChange={(event) => onChange(event.target.checked)}
          className="h-4 w-4 accent-[var(--color-signal)]"
        />
        <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-bone">
          {label}
        </span>
      </label>
      {hint ? <p className="mt-1.5 font-mono text-[11px] text-faint">{hint}</p> : null}
    </div>
  );
}

export function Select<T extends string>({
  id,
  label,
  value,
  options,
  onChange,
  labels,
}: {
  id: string;
  label: string;
  value: T;
  options: readonly T[];
  onChange: (value: T) => void;
  labels?: Record<string, string>;
}) {
  return (
    <Field label={label} htmlFor={id}>
      <select
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value as T)}
        className={inputClass}
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {labels?.[option] ?? option}
          </option>
        ))}
      </select>
    </Field>
  );
}
