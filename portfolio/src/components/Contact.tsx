import { useState, type FormEvent } from 'react';
import { Check, Copy, Github, Linkedin, Mail, MapPin, Phone, Send } from 'lucide-react';
import { useI18n } from '../i18n/LanguageProvider';
import { profile } from '../data/profile';
import { SectionHeader } from './Ui';

const inputClass =
  'w-full border border-edge bg-inset px-3 py-2.5 text-sm text-bone placeholder:text-faint transition-colors focus:border-signal focus:outline-none';

export function Contact() {
  const { t, pick } = useI18n();
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sent, setSent] = useState(false);
  const [copied, setCopied] = useState(false);

  /**
   * ATTENTION — changement de comportement volontaire.
   *
   * L'ancien formulaire affichait « Message envoye avec succes ! » alors
   * qu'aucune requete n'etait faite : le message n'arrivait jamais.
   * Ici, le formulaire construit un lien `mailto:` et ouvre la messagerie
   * du visiteur. Rien n'est promis qui ne soit fait.
   *
   * encodeURIComponent est indispensable : sans lui, un « & » ou un saut
   * de ligne dans le message tronquerait l'URL.
   * Doc : https://developer.mozilla.org/fr/docs/Web/URI/Schemes/mailto
   *
   * Pour un envoi reellement automatique, il faudrait un service tiers
   * (Formspree, EmailJS, Resend) ou une petite route serveur.
   */
  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    const subject = encodeURIComponent(form.subject || `Contact — ${form.name}`);
    const body = encodeURIComponent(
      `${form.message}\n\n---\n${form.name}\n${form.email}`,
    );

    window.location.href = `mailto:${profile.email}?subject=${subject}&body=${body}`;
    setSent(true);
  };

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      /* API presse-papiers refusee (contexte non securise) : on ne fait rien */
    }
  };

  const details = [
    { icon: Mail, label: t('contact.email'), value: profile.email, href: `mailto:${profile.email}` },
    { icon: Phone, label: t('contact.phone'), value: profile.phone, href: `tel:${profile.phoneHref}` },
    { icon: MapPin, label: t('contact.location'), value: pick(profile.location) },
    { icon: Send, label: t('contact.availability'), value: pick(profile.availability) },
  ];

  return (
    <section id="contact" className="border-t border-edge py-24">
      <div className="mx-auto max-w-6xl px-5">
        <SectionHeader index="07" eyebrow={t('contact.eyebrow')} title={t('contact.title')}>
          {t('contact.intro')}
        </SectionHeader>

        <div className="grid gap-10 lg:grid-cols-[1fr_360px]">
          {/* Formulaire */}
          <form onSubmit={handleSubmit} className="panel p-6 md:p-8">
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="name" className="label mb-2 block">
                  {t('contact.name')}
                </label>
                <input
                  id="name"
                  name="name"
                  required
                  autoComplete="name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder={t('contact.namePlaceholder')}
                  className={inputClass}
                />
              </div>
              <div>
                <label htmlFor="email" className="label mb-2 block">
                  {t('contact.email')}
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder={t('contact.emailPlaceholder')}
                  className={inputClass}
                />
              </div>
            </div>

            <div className="mt-5">
              <label htmlFor="subject" className="label mb-2 block">
                {t('contact.subject')}
              </label>
              <input
                id="subject"
                name="subject"
                required
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                placeholder={t('contact.subjectPlaceholder')}
                className={inputClass}
              />
            </div>

            <div className="mt-5">
              <label htmlFor="message" className="label mb-2 block">
                {t('contact.message')}
              </label>
              <textarea
                id="message"
                name="message"
                required
                rows={5}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                placeholder={t('contact.messagePlaceholder')}
                className={`${inputClass} resize-y`}
              />
            </div>

            <button
              type="submit"
              className="mt-6 inline-flex items-center gap-2 bg-signal px-5 py-3 font-mono text-[11px] uppercase tracking-[0.16em] text-ink transition-colors hover:bg-bone"
            >
              <Send className="h-4 w-4" />
              {t('contact.send')}
            </button>

            {/* Zone d'etat annoncee aux lecteurs d'ecran quand elle change */}
            <p
              role="status"
              aria-live="polite"
              className="mt-4 font-mono text-[11px] leading-relaxed text-muted"
            >
              {sent ? t('contact.opened') : t('contact.formNote')}
            </p>
          </form>

          {/* Coordonnees */}
          <div className="space-y-4">
            <div className="panel p-6">
              <h3 className="label mb-5">{t('contact.infoTitle')}</h3>
              <ul className="space-y-4">
                {details.map((item) => (
                  <li key={item.label} className="flex items-start gap-3">
                    <item.icon className="mt-0.5 h-4 w-4 shrink-0 text-signal" aria-hidden="true" />
                    <div className="min-w-0">
                      <div className="label">{item.label}</div>
                      {item.href ? (
                        <a
                          href={item.href}
                          className="block break-words text-sm text-bone hover:text-signal"
                        >
                          {item.value}
                        </a>
                      ) : (
                        <div className="text-sm text-bone">{item.value}</div>
                      )}
                    </div>
                  </li>
                ))}
              </ul>

              <button
                type="button"
                onClick={copyEmail}
                className="mt-6 inline-flex w-full items-center justify-center gap-2 border border-edge-hi px-4 py-2.5 font-mono text-[11px] uppercase tracking-[0.14em] text-muted transition-colors hover:border-signal hover:text-signal"
              >
                {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                {copied ? t('contact.copied') : t('contact.copy')}
              </button>
            </div>

            <div className="panel p-6">
              <h3 className="label mb-5">{t('contact.linksTitle')}</h3>
              <div className="grid grid-cols-2 gap-3">
                <a
                  href={profile.links.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center gap-2 border border-edge px-4 py-4 text-muted transition-colors hover:border-signal hover:text-signal"
                >
                  <Github className="h-5 w-5" />
                  <span className="font-mono text-[10px] uppercase tracking-[0.14em]">GitHub</span>
                </a>
                <a
                  href={profile.links.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center gap-2 border border-edge px-4 py-4 text-muted transition-colors hover:border-signal hover:text-signal"
                >
                  <Linkedin className="h-5 w-5" />
                  <span className="font-mono text-[10px] uppercase tracking-[0.14em]">LinkedIn</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
