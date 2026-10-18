import { Check, Info, Save } from 'lucide-react';
import { useState } from 'react';
import { LockedThermometer } from '../components/LockedThermometer';
import { PageHeader } from '../components/PageHeader';
import { ReportActions } from '../components/ReportActions';
import { ReportView } from '../components/ReportView';
import { useToast } from '../components/Toast';
import { useData } from '../data/DataProvider';
import { isReportStale, saveReportForPeriod } from '../data/repo';
import { useI18n } from '../i18n/I18nProvider';
import { useCurrentReport } from '../lib/useCurrentReport';

/** Relatório "ao vivo" dos últimos 7 dias (aberto ao tocar no termômetro). */
export function CurrentReportScreen() {
  const { unlocked, registeredDays, period, report } = useCurrentReport();
  const { reports, meals, index } = useData();
  const toast = useToast();
  const { t } = useI18n();
  const c = t.currentReport;
  const [saving, setSaving] = useState(false);

  if (!unlocked || !period || !report) {
    return (
      <div className="stack">
        <PageHeader title={c.header} back="/" />
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
      toast(saved ? c.updated : c.saved);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="stack">
      <PageHeader title={c.header} back="/" />
      <ReportView
        data={report}
        title={c.title}
        badge={<span className="badge badge-live">{c.live}</span>}
      >
        <div className="notice notice-info">
          <Info size={18} aria-hidden="true" />
          <span>{c.notice}</span>
        </div>
        <ReportActions data={report} title={c.exportTitle} />
        <button
          type="button"
          className="btn btn-secondary btn-block"
          onClick={save}
          disabled={saving || (!!saved && !stale)}
        >
          {saved && !stale ? (
            <>
              <Check size={18} aria-hidden="true" /> {c.savedInHistory}
            </>
          ) : (
            <>
              <Save size={18} aria-hidden="true" /> {saved ? c.updateInHistory : c.saveInHistory}
            </>
          )}
        </button>
      </ReportView>
    </div>
  );
}
