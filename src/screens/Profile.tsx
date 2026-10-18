import { Download, Pencil, Smartphone, Trash2, Upload } from 'lucide-react';
import { useRef, useState, type ChangeEvent, type FormEvent } from 'react';
import { useNavigate } from 'react-router';
import { ClassifySheet } from '../components/ClassifySheet';
import { useConfirm } from '../components/Confirm';
import { GradeBadge } from '../components/GradeBadge';
import { PageHeader } from '../components/PageHeader';
import { useToast } from '../components/Toast';
import {
  backupFileName,
  exportBackup,
  importBackup,
  markBackupDone,
  parseBackup,
} from '../data/backup';
import { useData } from '../data/DataProvider';
import { classifyFood, clearAllData, deleteCustomFood, saveProfileName } from '../data/repo';
import { formatDateTime } from '../domain/dates';
import { GRADE_THRESHOLDS } from '../domain/grades';
import { groupLabel, type ClassifyOption } from '../domain/groups';
import { SCORE_WEIGHTS } from '../domain/scoring';
import type { CustomFood } from '../domain/types';
import { isIOS, isStandalone, useInstallPrompt } from '../lib/install';
import { downloadText } from '../lib/share';
import { getThemePreference, setThemePreference, type ThemePreference } from '../lib/theme';

const THEMES: { value: ThemePreference; label: string }[] = [
  { value: 'system', label: 'Automático' },
  { value: 'light', label: 'Claro' },
  { value: 'dark', label: 'Escuro' },
];

export function ProfileScreen() {
  const { profile, settings, meals, reports, customFoods, dates } = useData();
  const toast = useToast();
  const confirm = useConfirm();
  const navigate = useNavigate();
  const [name, setName] = useState(profile?.name ?? '');
  const [theme, setTheme] = useState<ThemePreference>(getThemePreference);
  const [reclassify, setReclassify] = useState<CustomFood | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const { available: canInstall, install } = useInstallPrompt();

  const saveName = async (event: FormEvent) => {
    event.preventDefault();
    if (!name.trim()) return;
    await saveProfileName(name);
    toast('Nome atualizado.');
  };

  const chooseTheme = (value: ThemePreference) => {
    setTheme(value);
    setThemePreference(value);
  };

  const doExport = async () => {
    const backup = await exportBackup();
    downloadText(backupFileName(), JSON.stringify(backup, null, 2), 'application/json');
    await markBackupDone();
    toast('Backup salvo nos seus arquivos.');
  };

  const doImport = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    try {
      const backup = parseBackup(await file.text());
      const ok = await confirm({
        title: 'Importar backup?',
        message: `O arquivo tem ${backup.meals.length} refeições e ${backup.reports.length} relatórios. Eles serão juntados aos seus dados atuais — nada será apagado.`,
        confirmLabel: 'Importar',
      });
      if (!ok) return;
      const summary = await importBackup(backup);
      toast(`Backup importado: ${summary.meals} refeições.`);
    } catch (error) {
      toast(
        error instanceof Error ? error.message : 'Não foi possível importar o arquivo.',
        'error',
      );
    }
  };

  const removeFood = async (food: CustomFood) => {
    const ok = await confirm({
      title: `Remover “${food.name}”?`,
      message: 'Os registros com este alimento continuam salvos, mas ficam sem classificação.',
      confirmLabel: 'Remover',
      danger: true,
    });
    if (!ok) return;
    await deleteCustomFood(food.id);
    toast('Alimento removido.');
  };

  const onReclassify = async (option: ClassifyOption) => {
    if (!reclassify) return;
    await classifyFood(reclassify.name, option);
    setReclassify(null);
    toast('Classificação atualizada.');
  };

  const eraseAll = async () => {
    const ok = await confirm({
      title: 'Apagar todos os dados?',
      message:
        'Todas as refeições, relatórios e configurações deste aparelho serão apagados. Se quiser guardar uma cópia, exporte um backup antes.',
      confirmLabel: 'Apagar tudo',
      danger: true,
    });
    if (!ok) return;
    await clearAllData();
    navigate('/boas-vindas', { replace: true });
  };

  const installed = isStandalone();

  return (
    <div className="stack">
      <PageHeader title="Perfil" />

      <form className="card stack-sm" onSubmit={saveName}>
        <label className="field">
          <span className="field-label">Seu nome</span>
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
          Salvar nome
        </button>
      </form>

      <section className="card stack-sm" aria-labelledby="theme-title">
        <h2 id="theme-title">Aparência</h2>
        <div className="chips" role="radiogroup" aria-labelledby="theme-title">
          {THEMES.map((t) => (
            <button
              key={t.value}
              type="button"
              role="radio"
              aria-checked={theme === t.value}
              className={`chip${theme === t.value ? ' selected' : ''}`}
              onClick={() => chooseTheme(t.value)}
            >
              {t.label}
            </button>
          ))}
        </div>
      </section>

      <section className="card stack-sm" aria-labelledby="install-title">
        <h2 id="install-title" className="row">
          <Smartphone size={20} aria-hidden="true" /> Instalar o app
        </h2>
        {installed ? (
          <p className="muted">Você já está usando o EatMate instalado. 🎉</p>
        ) : canInstall ? (
          <>
            <p className="muted">
              Instale o EatMate para abrir direto da tela inicial, como um aplicativo, mesmo sem
              internet.
            </p>
            <button type="button" className="btn btn-primary" onClick={() => void install()}>
              Instalar EatMate
            </button>
          </>
        ) : isIOS() ? (
          <p className="muted">
            No iPhone, abra no Safari, toque em <strong>Compartilhar</strong> e depois em{' '}
            <strong>Adicionar à Tela de Início</strong>.
          </p>
        ) : (
          <p className="muted">
            No menu do navegador, procure <strong>Instalar app</strong> ou{' '}
            <strong>Adicionar à tela inicial</strong>.
          </p>
        )}
      </section>

      <section className="card stack-sm" aria-labelledby="data-title">
        <h2 id="data-title">Seus dados</h2>
        <p className="muted small">
          {meals.length} refeições em {dates.length} dias · {reports.length} relatórios. Tudo fica
          salvo apenas neste aparelho — faça um backup de vez em quando para não perder nada se
          trocar de celular.
        </p>
        <p className="small">
          Último backup:{' '}
          <strong>
            {settings?.lastBackupAt ? formatDateTime(settings.lastBackupAt) : 'nunca'}
          </strong>
        </p>
        <button type="button" className="btn btn-secondary btn-block" onClick={doExport}>
          <Download size={18} aria-hidden="true" /> Exportar backup
        </button>
        <button
          type="button"
          className="btn btn-secondary btn-block"
          onClick={() => fileRef.current?.click()}
        >
          <Upload size={18} aria-hidden="true" /> Importar backup
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="application/json,.json"
          className="visually-hidden"
          onChange={doImport}
          aria-label="Arquivo de backup"
          tabIndex={-1}
        />
      </section>

      {customFoods.length > 0 && (
        <section className="card stack-sm" aria-labelledby="custom-title">
          <h2 id="custom-title">Meus alimentos</h2>
          <p className="muted small">
            Alimentos que você classificou. Toque no lápis para mudar a categoria.
          </p>
          <ul className="item-list">
            {customFoods.map((food) => (
              <li key={food.id} className="item-row">
                <GradeBadge grade={food.grade} />
                <span className="item-row-main">
                  <span className="item-name">{food.name}</span>
                  <span className="item-meta">{groupLabel(food.group)}</span>
                </span>
                <button
                  type="button"
                  className="icon-btn small"
                  onClick={() => setReclassify(food)}
                  aria-label={`Mudar categoria de ${food.name}`}
                >
                  <Pencil size={17} aria-hidden="true" />
                </button>
                <button
                  type="button"
                  className="icon-btn small danger"
                  onClick={() => removeFood(food)}
                  aria-label={`Remover ${food.name}`}
                >
                  <Trash2 size={17} aria-hidden="true" />
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}

      <details className="card disclosure">
        <summary>Como a nota é calculada?</summary>
        <div className="prose small methodology">
          <p>
            Cada alimento tem uma nota de <strong>A</strong> (melhor) a <strong>E</strong>,
            inspirada no Nutri-Score europeu, e um grau de processamento segundo o{' '}
            <strong>Guia Alimentar para a População Brasileira</strong> (in natura, ingredientes
            culinários, processados e ultraprocessados).
          </p>
          <p>A nota da semana vai de 0 a 100 e combina cinco critérios:</p>
          <ul>
            <li>Qualidade nutricional dos alimentos — {SCORE_WEIGHTS.qualidade * 100}%</li>
            <li>Grau de processamento — {SCORE_WEIGHTS.processamento * 100}%</li>
            <li>
              Frutas, verduras e legumes (meta: 5 porções por dia) —{' '}
              {SCORE_WEIGHTS.frutas_verduras * 100}%
            </li>
            <li>Variedade de alimentos — {SCORE_WEIGHTS.variedade * 100}%</li>
            <li>
              Regularidade do café da manhã, almoço e jantar — {SCORE_WEIGHTS.regularidade * 100}%
            </li>
          </ul>
          <p>
            Depois, os pontos viram letra:{' '}
            {GRADE_THRESHOLDS.slice(0, 4)
              .map((t) => `${t.grade} a partir de ${t.min}`)
              .join(', ')}{' '}
            e E abaixo de {GRADE_THRESHOLDS[3]!.min}.
          </p>
          <p>
            As notas são estimativas para ajudar você a perceber padrões — não substituem a
            orientação de um(a) nutricionista.
          </p>
        </div>
      </details>

      <section className="card stack-sm danger-zone" aria-labelledby="danger-title">
        <h2 id="danger-title">Apagar dados</h2>
        <p className="muted small">
          Remove todas as refeições, relatórios e configurações deste aparelho.
        </p>
        <button type="button" className="btn btn-danger" onClick={eraseAll}>
          <Trash2 size={18} aria-hidden="true" /> Apagar todos os dados
        </button>
      </section>

      <p className="app-version muted small">
        EatMate {__APP_VERSION__} · seus dados ficam só com você.
      </p>

      <ClassifySheet
        name={reclassify?.name ?? null}
        onClose={() => setReclassify(null)}
        onSelect={onReclassify}
      />
    </div>
  );
}
