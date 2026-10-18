import { FileX, RefreshCw, Trash2, TriangleAlert } from 'lucide-react';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useConfirm } from '../components/Confirm';
import { EmptyState } from '../components/EmptyState';
import { PageHeader } from '../components/PageHeader';
import { ReportActions } from '../components/ReportActions';
import { ReportView } from '../components/ReportView';
import { useToast } from '../components/Toast';
import { useData } from '../data/DataProvider';
import { deleteReport, isReportStale, regenerateReport } from '../data/repo';
import { useI18n } from '../i18n/I18nProvider';
import { reportTitle } from '../lib/reportTitle';

export function SavedReportScreen() {
  const { id } = useParams();
  const { reports, meals, index, loading } = useData();
  const navigate = useNavigate();
  const confirm = useConfirm();
  const toast = useToast();
  const { t } = useI18n();
  const r = t.reports;
  const [busy, setBusy] = useState(false);
  const report = reports.find((r) => r.id === id);

  if (!report) {
    if (loading) return null;
    return (
      <>
        <PageHeader title={t.currentReport.header} back="/relatorios" />
        <EmptyState icon={<FileX size={30} />} title={r.notFound}>
          {r.notFoundText}
        </EmptyState>
      </>
    );
  }

  const title = reportTitle(report, t);
  const stale = isReportStale(report, meals, index);

  const regenerate = async () => {
    setBusy(true);
    try {
      await regenerateReport(report.id);
      toast(r.regeneratedOne);
    } finally {
      setBusy(false);
    }
  };

  const remove = async () => {
    const ok = await confirm({
      title: r.deleteTitle(title),
      message: r.deleteCustom,
      confirmLabel: r.deleteLabel,
      danger: true,
    });
    if (!ok) return;
    try {
      await deleteReport(report.id);
      toast(r.deleted);
      void navigate('/relatorios', { replace: true });
    } catch (error) {
      console.error(error);
      toast(r.deleteError, 'error');
    }
  };

  return (
    <div className="stack">
      <PageHeader
        title={title}
        back="/relatorios"
        actions={
          <button
            type="button"
            className="icon-btn danger"
            onClick={remove}
            aria-label={r.deleteLabel}
          >
            <Trash2 size={21} aria-hidden="true" />
          </button>
        }
      />
      <ReportView
        data={report.data}
        title={title}
        generatedAt={report.generatedAt}
        badge={stale ? <span className="badge badge-warning">{r.stale}</span> : undefined}
      >
        {stale && (
          <div className="notice notice-warning">
            <TriangleAlert size={18} aria-hidden="true" />
            <span className="grow stack-sm">
              <span>{r.staleNotice}</span>
              <button
                type="button"
                className="btn btn-sm btn-primary"
                onClick={regenerate}
                disabled={busy}
              >
                <RefreshCw size={16} aria-hidden="true" /> {r.regenerate}
              </button>
            </span>
          </div>
        )}
        <ReportActions
          data={report.data}
          title={`EatMate — ${title}`}
          generatedAt={report.generatedAt}
        />
        {!stale && (
          <button
            type="button"
            className="btn btn-ghost btn-block"
            onClick={regenerate}
            disabled={busy}
          >
            <RefreshCw size={18} aria-hidden="true" /> {r.regenerateNow}
          </button>
        )}
      </ReportView>
    </div>
  );
}
