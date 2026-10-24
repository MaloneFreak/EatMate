import { Download, Pencil, Smartphone, Trash2, Upload } from 'lucide-react';
import { useRef, useState, type ChangeEvent, type FormEvent } from 'react';
import { useNavigate } from 'react-router';
import { ClassifySheet } from '../components/ClassifySheet';
import { useConfirm } from '../components/Confirm';
import { GradeBadge } from '../components/GradeBadge';
import { LanguagePicker } from '../components/LanguagePicker';
import { PageHeader } from '../components/PageHeader';
import { Rich } from '../components/Rich';
import { useToast } from '../components/Toast';
import {
  BackupError,
  backupFileName,
  exportBackup,
  importBackup,
  markBackupDone,
  readBackupFile,
} from '../data/backup';
import { useData } from '../data/DataProvider';
import { classifyFood, clearAllData, deleteCustomFood, saveProfileName } from '../data/repo';
import { GRADE_THRESHOLDS } from '../domain/grades';
import type { ClassifyOption } from '../domain/groups';
import { SCORE_WEIGHTS } from '../domain/scoring';
import type { CustomFood, ScoreComponentKey } from '../domain/types';
import { useI18n } from '../i18n/I18nProvider';
import { isIOS, isStandalone, useInstallPrompt } from '../lib/install';
import { downloadText } from '../lib/share';
import { getThemePreference, setThemePreference, type ThemePreference } from '../lib/theme';

const THEMES: ThemePreference[] = ['system', 'light', 'dark'];

export function ProfileScreen() {
  const { profile, settings, meals, reports, customFoods, dates } = useData();
  const toast = useToast();
  const confirm = useConfirm();
  const navigate = useNavigate();
  const { t, f } = useI18n();
  const p = t.profile;
  const [name, setName] = useState(profile?.name ?? '');
  const [theme, setTheme] = useState<ThemePreference>(getThemePreference);
  const [reclassify, setReclassify] = useState<CustomFood | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const { available: canInstall, install } = useInstallPrompt();

  const saveName = async (event: FormEvent) => {
    event.preventDefault();
    if (!name.trim()) return;
    await saveProfileName(name);
    toast(p.nameSaved);
  };

  const chooseTheme = (value: ThemePreference) => {
    setTheme(value);
    setThemePreference(value);
  };

  const doExport = async () => {
    const backup = await exportBackup();
    downloadText(backupFileName(), JSON.stringify(backup, null, 2), 'application/json');
    await markBackupDone();
    toast(p.exported);
  };

  const doImport = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    try {
      const backup = await readBackupFile(file);
      const ok = await confirm({
        title: p.importTitle,
        message: p.importMessage(backup.meals.length, backup.reports.length),
        confirmLabel: p.importConfirm,
      });
      if (!ok) return;
      const summary = await importBackup(backup);
      toast(p.imported(summary.meals));
    } catch (error) {
      toast(error instanceof BackupError ? t.backup[error.code] : t.backup.importError, 'error');
    }
  };

  const removeFood = async (food: CustomFood) => {
    const ok = await confirm({
      title: p.removeFoodTitle(food.name),
      message: p.removeFoodMessage,
      confirmLabel: t.common.remove,
      danger: true,
    });
    if (!ok) return;
    await deleteCustomFood(food.id);
    toast(p.foodRemoved);
  };

  const onReclassify = async (option: ClassifyOption) => {
    if (!reclassify) return;
    await classifyFood(reclassify.name, option);
    setReclassify(null);
    toast(p.reclassified);
  };

  const eraseAll = async () => {
    const ok = await confirm({
      title: p.eraseTitle,
      message: p.eraseMessage,
      confirmLabel: p.eraseConfirm,
      danger: true,
    });
    if (!ok) return;
    await clearAllData();
    navigate('/boas-vindas', { replace: true });
  };

  const installed = isStandalone();

  return (
    <div className="stack">
      <PageHeader title={p.title} />

      <form className="card stack-sm" onSubmit={saveName}>
        <label className="field">
          <span className="field-label">{p.name}</span>
          <input
            className="input"
            value={name}
            maxLength={40}
            onChange={(e) => setName(e.target.value)}
            autoComplete="given-name"
          />
        </label>
        <button
          type="submit"
          className="btn btn-secondary"
          disabled={!name.trim() || name.trim() === profile?.name}
        >
          {p.saveName}
        </button>
      </form>

      <section className="card stack-sm" aria-labelledby="language-title">
        <h2 id="language-title">{p.language}</h2>
        <LanguagePicker />
        <p className="muted small">{p.languageHint}</p>
      </section>

      <section className="card stack-sm" aria-labelledby="theme-title">
        <h2 id="theme-title">{p.appearance}</h2>
        <div className="chips" role="radiogroup" aria-labelledby="theme-title">
          {THEMES.map((value) => (
            <button
              key={value}
              type="button"
              role="radio"
              aria-checked={theme === value}
              className={`chip${theme === value ? ' selected' : ''}`}
              onClick={() => chooseTheme(value)}
            >
              {p.themes[value]}
            </button>
          ))}
        </div>
      </section>

      <section className="card stack-sm" aria-labelledby="install-title">
        <h2 id="install-title" className="row">
          <Smartphone size={20} aria-hidden="true" /> {p.install}
        </h2>
        {installed ? (
          <p className="muted">{p.installed}</p>
        ) : canInstall ? (
          <>
            <p className="muted">{p.installText}</p>
            <button type="button" className="btn btn-primary" onClick={() => void install()}>
              {p.installButton}
            </button>
          </>
        ) : (
          <p className="muted">
            <Rich text={isIOS() ? p.installIOS : p.installOther} />
          </p>
        )}
      </section>

      <section className="card stack-sm" aria-labelledby="data-title">
        <h2 id="data-title">{p.data}</h2>
        <p className="muted small">{p.dataSummary(meals.length, dates.length, reports.length)}</p>
        <p className="small">
          {p.lastBackup}{' '}
          <strong>{settings?.lastBackupAt ? f.dateTime(settings.lastBackupAt) : p.never}</strong>
        </p>
        <button type="button" className="btn btn-secondary btn-block" onClick={doExport}>
          <Download size={18} aria-hidden="true" /> {p.export}
        </button>
        <button
          type="button"
          className="btn btn-secondary btn-block"
          onClick={() => fileRef.current?.click()}
        >
          <Upload size={18} aria-hidden="true" /> {p.import}
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="application/json,.json"
          className="visually-hidden"
          onChange={doImport}
          aria-label={t.common.backupFile}
          tabIndex={-1}
        />
      </section>

      {customFoods.length > 0 && (
        <section className="card stack-sm" aria-labelledby="custom-title">
          <h2 id="custom-title">{p.customFoods}</h2>
          <p className="muted small">{p.customFoodsText}</p>
          <ul className="item-list">
            {customFoods.map((food) => (
              <li key={food.id} className="item-row">
                <GradeBadge grade={food.grade} />
                <span className="item-row-main">
                  <span className="item-name">{food.name}</span>
                  <span className="item-meta">{t.groups[food.group]}</span>
                </span>
                <button
                  type="button"
                  className="icon-btn small"
                  onClick={() => setReclassify(food)}
                  aria-label={p.changeCategory(food.name)}
                >
                  <Pencil size={17} aria-hidden="true" />
                </button>
                <button
                  type="button"
                  className="icon-btn small danger"
                  onClick={() => removeFood(food)}
                  aria-label={p.removeFood(food.name)}
                >
                  <Trash2 size={17} aria-hidden="true" />
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}

      <details className="card disclosure">
        <summary>{p.method.title}</summary>
        <div className="prose small methodology">
          <p>
            <Rich text={p.method.intro} />
          </p>
          <p>{p.method.criteria}</p>
          <ul>
            {(Object.keys(SCORE_WEIGHTS) as ScoreComponentKey[]).map((key) => (
              <li key={key}>
                {p.method.items[key]} — {f.percent(SCORE_WEIGHTS[key])}
              </li>
            ))}
          </ul>
          <p>
            {p.method.letters(
              GRADE_THRESHOLDS.slice(0, 4)
                .map((th) => p.method.threshold(th.grade, th.min))
                .join(', '),
              GRADE_THRESHOLDS[3]!.min,
            )}
          </p>
          <p>{p.method.disclaimer}</p>
        </div>
      </details>

      <section className="card stack-sm danger-zone" aria-labelledby="danger-title">
        <h2 id="danger-title">{p.danger}</h2>
        <p className="muted small">{p.dangerText}</p>
        <button type="button" className="btn btn-danger" onClick={eraseAll}>
          <Trash2 size={18} aria-hidden="true" /> {p.eraseAll}
        </button>
      </section>

      <p className="app-version muted small">{p.version(__APP_VERSION__)}</p>

      <ClassifySheet
        name={reclassify?.name ?? null}
        onClose={() => setReclassify(null)}
        onSelect={onReclassify}
      />
    </div>
  );
}
