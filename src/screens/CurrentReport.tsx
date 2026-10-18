import { Check, Info, Save } from 'lucide-react';
import { useState } from 'react';
import { LockedThermometer } from '../components/LockedThermometer';
import { PageHeader } from '../components/PageHeader';
import { ReportActions } from '../components/ReportActions';
import { ReportView } from '../components/ReportView';
import { useToast } from '../components/Toast';
import { useData } from '../data/DataProvider';
import { isReportStale, saveReportForPeriod } from '../data/repo';
import { useCurrentReport } from '../lib/useCurrentReport';

/** Relatório "ao vivo" dos últimos 7 dias (aberto ao tocar no termômetro). */
export function CurrentReportScreen() {
  const { unlocked, registeredDays, period, report } = useCurrentReport();
  const { reports, meals, index } = useData();
  const toast = useToast();
  const [saving, setSaving] = useState(false);

  if (!unlocked || !period || !report) {
    return (
      <div className="stack">
        <PageHeader title="Relatório" back="/" />
        <LockedThermometer registeredDays={registeredDays} />
      </div>
    );
  }

  const saved = reports.find((r) => r.startDate === period.start && r.endDate === period.end);
  const stale = saved ? isReportStale(saved, meals, index) : false;

  const save = async () => {
    setSaving(true);
    try {
      await saveReportForPeriod(period);
      toast(saved ? 'Relatório atualizado no histórico.' : 'Relatório salvo no histórico.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="stack">
      <PageHeader title="Relatório" back="/" />
      <ReportView
        data={report}
        title="Últimos 7 dias"
        badge={<span className="badge badge-live">Ao vivo</span>}
      >
        <div className="notice notice-info">
          <Info size={18} aria-hidden="true" />
          <span>
            Este relatório se atualiza sozinho conforme você registra. Ao fim de cada semana, uma
            cópia é guardada no seu histórico de relatórios.
          </span>
        </div>
        <ReportActions data={report} title="Relatório alimentar" />
        <button
          type="button"
          className="btn btn-secondary btn-block"
          onClick={save}
          disabled={saving || (!!saved && !stale)}
        >
          {saved && !stale ? (
            <>
              <Check size={18} aria-hidden="true" /> Salvo no histórico
            </>
          ) : (
            <>
              <Save size={18} aria-hidden="true" />{' '}
              {saved ? 'Atualizar no histórico' : 'Salvar no histórico'}
            </>
          )}
        </button>
      </ReportView>
    </div>
  );
}
