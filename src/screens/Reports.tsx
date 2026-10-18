import { ChevronRight, FilePlus2, FileText, RefreshCw, Trash2 } from 'lucide-react';
import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router';
import { useConfirm } from '../components/Confirm';
import { EmptyState } from '../components/EmptyState';
import { GradeBadge } from '../components/GradeBadge';
import { LockedThermometer } from '../components/LockedThermometer';
import { PageHeader } from '../components/PageHeader';
import { useToast } from '../components/Toast';
import { useData } from '../data/DataProvider';
import { deleteReport, isReportStale, regenerateReport, saveReportForPeriod } from '../data/repo';
import { todayISO } from '../domain/dates';
import { UNLOCK_DAYS, periodEndingOn } from '../domain/periods';
import type { SavedReport } from '../domain/types';
import { useI18n } from '../i18n/I18nProvider';
import { reportTitle } from '../lib/reportTitle';

export function ReportsScreen() {
  const { reports, meals, index, dates } = useData();
  const navigate = useNavigate();
  const confirm = useConfirm();
  const toast = useToast();
  const { t, f } = useI18n();
  const r = t.reports;
  const unlocked = dates.length >= UNLOCK_DAYS;
  const lastDate = dates[dates.length - 1] ?? todayISO();
  const [customEnd, setCustomEnd] = useState(lastDate);
  const [busy, setBusy] = useState<string | null>(null);

  const regenerate = async (report: SavedReport) => {
    setBusy(report.id);
    try {
      await regenerateReport(report.id);
      toast(r.regenerated(reportTitle(report, t)));
    } finally {
      setBusy(null);
    }
  };

  const remove = async (report: SavedReport) => {
    const ok = await confirm({
      title: r.deleteTitle(reportTitle(report, t)),
      message: report.kind === 'semanal' ? r.deleteWeekly : r.deleteCustom,
      confirmLabel: r.deleteLabel,
      danger: true,
    });
    if (!ok) return;
    await deleteReport(report.id);
    toast(r.deleted);
  };

  const generateCustom = async (event: FormEvent) => {
    event.preventDefault();
    if (!customEnd) return;
    const report = await saveReportForPeriod(periodEndingOn(customEnd));
    toast(r.generated);
    navigate(`/relatorios/${report.id}`);
  };

  return (
    <div className="stack">
      <PageHeader title={r.title} subtitle={r.subtitle} />

      {unlocked ? (
        <Link to="/relatorio" className="card card-link current-report-link">
          <span className="current-report-icon">
            <FileText size={22} aria-hidden="true" />
          </span>
          <span className="grow">
            <strong>{r.current}</strong>
            <span className="muted small block">{r.currentText}</span>
          </span>
          <ChevronRight size={20} aria-hidden="true" />
        </Link>
      ) : (
        <LockedThermometer registeredDays={dates.length} />
      )}

      <p className="muted small">{r.info}</p>

      {reports.length ? (
        <ul className="stack-sm" style={{ listStyle: 'none' }} aria-label={r.list}>
          {reports.map((report) => {
            const stale = isReportStale(report, meals, index);
            const score = report.data.score;
            return (
              <li key={report.id} className="card report-card">
                <Link to={`/relatorios/${report.id}`} className="report-card-main">
                  <GradeBadge grade={score?.grade} size="lg" />
                  <span className="grow">
                    <strong className="block">{reportTitle(report, t)}</strong>
                    <span className="block small">
                      {f.period(report.startDate, report.endDate)}
                      {score && (
                        <span className="muted">
                          {' '}
                          · {score.total}/100 · {t.grades.labels[score.grade]}
                        </span>
                      )}
                    </span>
                    <span className="block small muted">
                      {r.generatedAt(f.dateTime(report.generatedAt))}
                    </span>
                    {stale && <span className="badge badge-warning">{r.stale}</span>}
                  </span>
                </Link>
                <div className="report-card-actions">
                  <button
                    type="button"
                    className={`btn btn-sm ${stale ? 'btn-primary' : 'btn-ghost'}`}
                    onClick={() => regenerate(report)}
                    disabled={busy === report.id}
                  >
                    <RefreshCw size={16} aria-hidden="true" /> {r.regenerate}
                  </button>
                  <button
                    type="button"
                    className="btn btn-sm btn-ghost danger-text"
                    onClick={() => remove(report)}
                  >
                    <Trash2 size={16} aria-hidden="true" /> {r.delete}
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      ) : (
        <EmptyState icon={<FileText size={30} />} title={r.emptyTitle}>
          {unlocked ? r.emptyUnlocked : r.emptyLocked}
        </EmptyState>
      )}

      {dates.length > 0 && (
        <details className="card disclosure">
          <summary>
            <span className="row">
              <FilePlus2 size={20} aria-hidden="true" /> {r.other}
            </span>
          </summary>
          <form className="stack-sm custom-report-form" onSubmit={generateCustom}>
            <label className="field">
              <span className="field-label">{r.lastDay}</span>
              <input
                className="input"
                type="date"
                value={customEnd}
                max={todayISO()}
                onChange={(e) => setCustomEnd(e.target.value)}
                required
              />
              <span className="field-hint">
                {customEnd
                  ? r.covers(f.period(periodEndingOn(customEnd).start, customEnd))
                  : r.pickDate}
              </span>
            </label>
            <button type="submit" className="btn btn-primary">
              {r.generate}
            </button>
          </form>
        </details>
      )}
    </div>
  );
}
