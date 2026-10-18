import { FileText, Lock, NotebookPen, Thermometer as ThermometerIcon, Upload } from 'lucide-react';
import { useRef, useState, type ChangeEvent, type FormEvent } from 'react';
import { useNavigate } from 'react-router';
import { Logo } from '../components/Logo';
import { useToast } from '../components/Toast';
import { importBackup, parseBackup } from '../data/backup';
import { requestPersistentStorage, saveProfileName } from '../data/repo';

const FEATURES = [
  {
    icon: NotebookPen,
    title: 'Registre o que você comeu',
    text: 'Do seu jeito, na hora ou depois: "café com leite e pão na chapa".',
  },
  {
    icon: ThermometerIcon,
    title: 'Termômetro da alimentação',
    text: 'Depois de 7 dias, veja a qualidade da sua alimentação em uma nota de A a E.',
  },
  {
    icon: FileText,
    title: 'Relatórios para compartilhar',
    text: 'Mostre ao seu nutricionista ou cole em uma IA para receber sugestões.',
  },
];

export function OnboardingScreen() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [saving, setSaving] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const toast = useToast();
  const trimmed = name.trim();

  // Para quem já usava o EatMate em outro aparelho: restaura o backup (inclusive o nome).
  const restore = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    try {
      const backup = parseBackup(await file.text());
      const summary = await importBackup(backup);
      void requestPersistentStorage();
      toast(`Backup restaurado: ${summary.meals} refeições.`);
      if (!backup.profile) toast('Agora é só dizer como podemos te chamar.', 'info');
    } catch (error) {
      toast(error instanceof Error ? error.message : 'Não foi possível ler o arquivo.', 'error');
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
        <h1>Bem-vindo ao EatMate</h1>
        <p className="muted">Seu diário alimentar simples, sem contar calorias.</p>
      </div>

      <ul className="feature-list">
        {FEATURES.map(({ icon: Icon, title, text }) => (
          <li key={title} className="feature">
            <span className="feature-icon">
              <Icon size={22} aria-hidden="true" />
            </span>
            <span>
              <strong>{title}</strong>
              <span className="muted small feature-text">{text}</span>
            </span>
          </li>
        ))}
      </ul>

      <form className="card stack" onSubmit={submit}>
        <label className="field">
          <span className="field-label">Como podemos te chamar?</span>
          <input
            className="input"
            name="name"
            autoComplete="given-name"
            placeholder="Seu nome"
            value={name}
            maxLength={40}
            onChange={(e) => setName(e.target.value)}
            autoFocus
          />
        </label>
        <button type="submit" className="btn btn-primary btn-block" disabled={!trimmed || saving}>
          Começar
        </button>
      </form>

      <button type="button" className="btn btn-ghost" onClick={() => fileRef.current?.click()}>
        <Upload size={18} aria-hidden="true" /> Já usa o EatMate? Restaurar backup
      </button>
      <input
        ref={fileRef}
        type="file"
        accept="application/json,.json"
        className="visually-hidden"
        onChange={restore}
        aria-label="Arquivo de backup"
        tabIndex={-1}
      />

      <p className="privacy-note">
        <Lock size={16} aria-hidden="true" />
        Seus dados ficam guardados só neste aparelho.
      </p>
    </div>
  );
}
