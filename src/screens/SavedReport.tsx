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
import { reportTitle } from '../lib/reportTitle';

export function SavedReportScreen() {
  const { id } = useParams();
  const { reports, meals, index, loading } = useData();
  const navigate = useNavigate();
  const confirm = useConfirm();
  const toast = useToast();
  const [busy, setBusy] = useState(false);
  const report = reports.find((r) => r.id === id);

  if (!report) {
    if (loading) return null;
    return (
      <>
        <PageHeader title="Relatório" back="/relatorios" />
        <EmptyState icon={<FileX size={30} />} title="Relatório não encontrado">
          Ele pode ter sido excluído.
        </EmptyState>
      </>
    );
  }

  const title = reportTitle(report);
  const stale = isReportStale(report, meals, index);

  const regenerate = async () => {
    setBusy(true);
    try {
      await regenerateReport(report.id);
      toast('Relatório gerado novamente com os dados atuais.');
    } finally {
      setBusy(false);
    }
  };

  const remove = async () => {
    const ok = await confirm({
      title: `Excluir “${title}”?`,
      message: 'Seus registros de refeições continuam salvos.',
      confirmLabel: 'Excluir relatório',
      danger: true,
    });
    if (!ok) return;
    await deleteReport(report.id);
    toast('Relatório excluído.');
    navigate('/relatorios', { replace: true });
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
            aria-label="Excluir relatório"
          >
            <Trash2 size={21} aria-hidden="true" />
          </button>
        }
      />
      <ReportView
        data={report.data}
        title={title}
        generatedAt={report.generatedAt}
        badge={stale ? <span className="badge badge-warning">Desatualizado</span> : undefined}
      >
        {stale && (
          <div className="notice notice-warning">
            <TriangleAlert size={18} aria-hidden="true" />
            <span className="grow stack-sm">
              <span>
                Você alterou registros deste período depois que este relatório foi gerado.
              </span>
              <button
                type="button"
                className="btn btn-sm btn-primary"
                onClick={regenerate}
                disabled={busy}
              >
                <RefreshCw size={16} aria-hidden="true" /> Gerar novamente
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
            <RefreshCw size={18} aria-hidden="true" /> Gerar novamente com os dados atuais
          </button>
        )}
      </ReportView>
    </div>
  );
}
