import type {
  ContentBundle,
  EducationItem,
  ExperienceItem,
  ListItem,
  ListKind,
  ProjectItem,
  SkillGroupItem,
} from '../../content/types';
import { SKILL_ICONS } from '../../content/types';
import { ResourceSection } from '../ResourceSection';
import {
  Checkbox,
  Field,
  LocalizedInput,
  LocalizedListInput,
  Select,
  TagsInput,
  TextInput,
} from '../fields';

// Sections en liste. Chacune décrit seulement son objet de départ, son résumé
// et ses champs ; tout le comportement vient de ResourceSection.

interface SectionProps {
  content: ContentBundle;
  onChanged: () => Promise<void>;
  onAuthError: () => void;
}

const EMPTY = { fr: '', en: '' };
const EMPTY_LIST = { fr: [] as string[], en: [] as string[] };

// Retombe sur l'anglais puis sur un libellé générique si le français manque.
const label = (value: { fr: string; en: string }, fallback: string) =>
  value.fr || value.en || fallback;

export function ExperiencesSection({ content, onChanged, onAuthError }: SectionProps) {
  return (
    <ResourceSection<ExperienceItem>
      resource="experiences"
      title="Expérience professionnelle"
      description="Postes, stages et missions. L’ordre ci-dessous est celui du site."
      items={content.experiences}
      onChanged={onChanged}
      onAuthError={onAuthError}
      summary={(item) =>
        `${label(item.role, 'Poste sans titre')}${item.company ? ` — ${item.company}` : ''}`
      }
      blank={() => ({
        role: { ...EMPTY },
        company: '',
        place: { ...EMPTY },
        period: { ...EMPTY },
        current: false,
        tasks: { fr: [], en: [] },
        stack: [],
      })}
      renderForm={(draft, update) => (
        <>
          <LocalizedInput
            id="exp-role"
            label="Intitulé du poste"
            value={draft.role}
            onChange={(v) => update({ ...draft, role: v })}
          />
          <Field label="Entreprise" htmlFor="exp-company">
            <TextInput
              id="exp-company"
              value={draft.company}
              onChange={(v) => update({ ...draft, company: v })}
            />
          </Field>
          <LocalizedInput
            id="exp-place"
            label="Lieu"
            value={draft.place}
            onChange={(v) => update({ ...draft, place: v })}
          />
          <LocalizedInput
            id="exp-period"
            label="Période"
            value={draft.period}
            onChange={(v) => update({ ...draft, period: v })}
            hint="Texte libre, ex. « Février 2026 — Août 2026 »."
          />
          <Checkbox
            id="exp-current"
            label="Poste en cours"
            checked={draft.current}
            onChange={(v) => update({ ...draft, current: v })}
            hint="Affiche la pastille verte clignotante sur le site."
          />
          <LocalizedListInput
            id="exp-tasks"
            label="Missions"
            value={draft.tasks}
            onChange={(v) => update({ ...draft, tasks: v })}
            hint="Une ligne par mission. Les deux langues doivent compter le même nombre de lignes."
          />
          <TagsInput
            id="exp-stack"
            label="Outils et technologies"
            value={draft.stack}
            onChange={(v) => update({ ...draft, stack: v })}
          />
        </>
      )}
    />
  );
}

export function EducationSection({ content, onChanged, onAuthError }: SectionProps) {
  return (
    <ResourceSection<EducationItem>
      resource="education"
      title="Diplômes et formations"
      items={content.education}
      onChanged={onChanged}
      onAuthError={onAuthError}
      summary={(item) =>
        `${label(item.title, 'Formation sans titre')}${item.period.fr ? ` — ${item.period.fr}` : ''}`
      }
      blank={() => ({
        title: { ...EMPTY },
        school: { ...EMPTY },
        period: { ...EMPTY },
        detail: { ...EMPTY },
      })}
      renderForm={(draft, update) => (
        <>
          <LocalizedInput
            id="edu-title"
            label="Intitulé"
            value={draft.title}
            onChange={(v) => update({ ...draft, title: v })}
          />
          <LocalizedInput
            id="edu-school"
            label="Établissement"
            value={draft.school}
            onChange={(v) => update({ ...draft, school: v })}
          />
          <LocalizedInput
            id="edu-period"
            label="Période"
            value={draft.period}
            onChange={(v) => update({ ...draft, period: v })}
          />
          <LocalizedInput
            id="edu-detail"
            label="Détail"
            value={draft.detail}
            onChange={(v) => update({ ...draft, detail: v })}
            multiline
            rows={4}
            hint="Facultatif. Laissé vide, aucun paragraphe n’est affiché."
          />
        </>
      )}
    />
  );
}

export function ProjectsSection({ content, onChanged, onAuthError }: SectionProps) {
  return (
    <ResourceSection<ProjectItem>
      resource="projects"
      title="Projets"
      description="Les projets « mis en avant » apparaissent en haut, avec leurs points clés."
      items={content.projects}
      onChanged={onChanged}
      onAuthError={onAuthError}
      summary={(item) =>
        `${item.featured ? '★ ' : ''}${label(item.title, 'Projet sans titre')}`
      }
      blank={() => ({
        featured: false,
        title: { ...EMPTY },
        role: { ...EMPTY },
        summary: { ...EMPTY },
        highlights: { ...EMPTY_LIST },
        stack: [],
        repo: '',
        demo: '',
      })}
      renderForm={(draft, update) => (
        <>
          <Checkbox
            id="proj-featured"
            label="Mettre en avant"
            checked={draft.featured}
            onChange={(v) => update({ ...draft, featured: v })}
            hint="En haut de section, avec les points clés détaillés."
          />
          <LocalizedInput
            id="proj-title"
            label="Titre"
            value={draft.title}
            onChange={(v) => update({ ...draft, title: v })}
          />
          <LocalizedInput
            id="proj-role"
            label="Rôle tenu"
            value={draft.role}
            onChange={(v) => update({ ...draft, role: v })}
          />
          <LocalizedInput
            id="proj-summary"
            label="Résumé"
            value={draft.summary}
            onChange={(v) => update({ ...draft, summary: v })}
            multiline
            rows={4}
          />
          <LocalizedListInput
            id="proj-highlights"
            label="Points clés"
            value={draft.highlights}
            onChange={(v) => update({ ...draft, highlights: v })}
            hint="Affichés uniquement pour les projets mis en avant."
          />
          <TagsInput
            id="proj-stack"
            label="Stack technique"
            value={draft.stack}
            onChange={(v) => update({ ...draft, stack: v })}
          />
          <div className="grid gap-x-5 md:grid-cols-2">
            <Field
              label="Lien du dépôt"
              htmlFor="proj-repo"
              hint="Vide : le site affiche « Code privé »."
            >
              <TextInput
                id="proj-repo"
                value={draft.repo}
                placeholder="https://github.com/…"
                onChange={(v) => update({ ...draft, repo: v })}
              />
            </Field>
            <Field label="Lien de démonstration" htmlFor="proj-demo" hint="Facultatif.">
              <TextInput
                id="proj-demo"
                value={draft.demo}
                placeholder="https://…"
                onChange={(v) => update({ ...draft, demo: v })}
              />
            </Field>
          </div>
        </>
      )}
    />
  );
}

const ICON_LABELS: Record<string, string> = {
  server: 'Serveur',
  layout: 'Interface',
  database: 'Base de données',
  container: 'Conteneur',
  flask: 'Tests',
  smartphone: 'Mobile',
};

const LEVEL_LABELS: Record<string, string> = {
  project: 'Utilisé en projet',
  learning: 'En apprentissage',
};

export function SkillsSection({ content, onChanged, onAuthError }: SectionProps) {
  return (
    <>
      <ResourceSection<SkillGroupItem>
        resource="skill-groups"
        title="Groupes de compétences"
        description="Supprimer un groupe supprime aussi les compétences qu’il contient."
        items={content.skillGroups}
        onChanged={onChanged}
        onAuthError={onAuthError}
        summary={(item) =>
          `${label(item.title, 'Groupe sans titre')} (${item.skills.length})`
        }
        blank={() => ({ title: { ...EMPTY }, icon: 'server' as const, skills: [] })}
        renderForm={(draft, update) => (
          <>
            <LocalizedInput
              id="group-title"
              label="Titre du groupe"
              value={draft.title}
              onChange={(v) => update({ ...draft, title: v })}
            />
            <Select
              id="group-icon"
              label="Icône"
              value={draft.icon}
              options={SKILL_ICONS}
              labels={ICON_LABELS}
              onChange={(v) => update({ ...draft, icon: v })}
            />
          </>
        )}
      />

      {/* Une liste par groupe ; le groupe est transmis via extraOnCreate. */}
      {content.skillGroups.map((group) => (
        <ResourceSection
          key={group.id}
          resource="skills"
          title={`Compétences — ${label(group.title, 'groupe')}`}
          items={group.skills}
          onChanged={onChanged}
          onAuthError={onAuthError}
          extraOnCreate={{ groupId: group.id }}
          summary={(item) => `${item.name || 'Sans nom'} · ${LEVEL_LABELS[item.level]}`}
          blank={() => ({ name: '', level: 'project' as const })}
          renderForm={(draft, update) => (
            <>
              <Field label="Nom" htmlFor={`skill-name-${group.id}`}>
                <TextInput
                  id={`skill-name-${group.id}`}
                  value={draft.name}
                  onChange={(v) => update({ ...draft, name: v })}
                />
              </Field>
              <Select
                id={`skill-level-${group.id}`}
                label="Niveau"
                value={draft.level}
                options={['project', 'learning'] as const}
                labels={LEVEL_LABELS}
                onChange={(v) => update({ ...draft, level: v })}
              />
            </>
          )}
        />
      ))}
    </>
  );
}

function SimpleListSection({
  kind,
  title,
  items,
  withDetail,
  detailLabel,
  onChanged,
  onAuthError,
}: {
  kind: ListKind;
  title: string;
  items: ListItem[];
  withDetail: boolean;
  detailLabel?: string;
  onChanged: () => Promise<void>;
  onAuthError: () => void;
}) {
  return (
    <ResourceSection<ListItem>
      resource="list-items"
      title={title}
      items={items}
      onChanged={onChanged}
      onAuthError={onAuthError}
      // `kind` imposé par la section, pas par le formulaire.
      extraOnCreate={{ kind }}
      summary={(item) =>
        `${label(item.label, 'Sans libellé')}${item.detail.fr ? ` — ${item.detail.fr}` : ''}`
      }
      blank={() => ({ kind, label: { ...EMPTY }, detail: { ...EMPTY } })}
      renderForm={(draft, update) => (
        <>
          <LocalizedInput
            id={`${kind}-label`}
            label="Libellé"
            value={draft.label}
            onChange={(v) => update({ ...draft, label: v })}
          />
          {withDetail ? (
            <LocalizedInput
              id={`${kind}-detail`}
              label={detailLabel ?? 'Détail'}
              value={draft.detail}
              onChange={(v) => update({ ...draft, detail: v })}
            />
          ) : null}
        </>
      )}
    />
  );
}

export function ListsSection({ content, onChanged, onAuthError }: SectionProps) {
  return (
    <>
      <SimpleListSection
        kind="language"
        title="Langues parlées"
        items={content.languages}
        withDetail
        detailLabel="Niveau"
        onChanged={onChanged}
        onAuthError={onAuthError}
      />
      <SimpleListSection
        kind="soft_skill"
        title="Savoir-être"
        items={content.softSkills}
        withDetail={false}
        onChanged={onChanged}
        onAuthError={onAuthError}
      />
      <SimpleListSection
        kind="interest"
        title="Centres d’intérêt"
        items={content.interests}
        withDetail={false}
        onChanged={onChanged}
        onAuthError={onAuthError}
      />
    </>
  );
}
