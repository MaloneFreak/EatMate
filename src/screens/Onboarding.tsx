import { FileText, Lock, NotebookPen, Thermometer as ThermometerIcon, Upload } from 'lucide-react';
import { useRef, useState, type ChangeEvent, type FormEvent } from 'react';
import { useNavigate } from 'react-router';
import { Logo } from '../components/Logo';
import { useToast } from '../components/Toast';
import { LanguagePicker } from '../components/LanguagePicker';
import { BackupError, importBackup, readBackupFile } from '../data/backup';
import { requestPersistentStorage, saveProfileName } from '../data/repo';
import { useI18n } from '../i18n/I18nProvider';

const FEATURE_ICONS = [NotebookPen, ThermometerIcon, FileText];

export function OnboardingScreen() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [saving, setSaving] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const toast = useToast();
  const { t } = useI18n();
  const o = t.onboarding;
  const trimmed = name.trim();

  // Para quem já usava o EatMate em outro aparelho: restaura o backup (inclusive o nome).
  const restore = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    try {
      const backup = await readBackupFile(file);
      const summary = await importBackup(backup);
      void requestPersistentStorage();
      toast(o.restored(summary.meals));
      if (!backup.profile) toast(o.askName, 'info');
    } catch (error) {
      toast(error instanceof BackupError ? t.backup[error.code] : t.backup.readError, 'error');
    }
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!trimmed || saving) return;
    setSaving(true);
    await saveProfileName(trimmed);
    void requestPersistentStorage();
    navigate('/', { replace: true });
  };

  return (
    <div className="onboarding">
      <div className="onboarding-hero">
        <Logo size={76} />
        <h1>{o.title}</h1>
        <p className="muted">{o.subtitle}</p>
      </div>

      <LanguagePicker compact />

      <ul className="feature-list">
        {o.features.map(({ title, text }, i) => {
          const Icon = FEATURE_ICONS[i] ?? NotebookPen;
          return (
            <li key={title} className="feature">
              <span className="feature-icon">
                <Icon size={22} aria-hidden="true" />
              </span>
              <span>
                <strong>{title}</strong>
                <span className="muted small feature-text">{text}</span>
              </span>
            </li>
          );
        })}
      </ul>

      <form className="card stack" onSubmit={submit}>
        <label className="field">
          <span className="field-label">{o.nameLabel}</span>
          <input
            className="input"
            name="name"
            autoComplete="given-name"
            placeholder={o.namePlaceholder}
            value={name}
            maxLength={40}
            onChange={(e) => setName(e.target.value)}
            autoFocus
          />
        </label>
        <button type="submit" className="btn btn-primary btn-block" disabled={!trimmed || saving}>
          {o.start}
        </button>
      </form>

      <button type="button" className="btn btn-ghost" onClick={() => fileRef.current?.click()}>
        <Upload size={18} aria-hidden="true" /> {o.restore}
      </button>
      <input
        ref={fileRef}
        type="file"
        accept="application/json,.json,text/plain,.txt"
        className="visually-hidden"
        onChange={restore}
        aria-label={t.common.backupFile}
        tabIndex={-1}
      />

      <p className="privacy-note">
        <Lock size={16} aria-hidden="true" />
        {o.privacy}
      </p>
    </div>
  );
}
