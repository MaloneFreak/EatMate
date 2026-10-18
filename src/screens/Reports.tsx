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
import { formatDateTime, formatPeriod, todayISO } from '../domain/dates';
import { GRADE_LABELS } from '../domain/grades';
import { UNLOCK_DAYS, periodEndingOn } from '../domain/periods';
import type { SavedReport } from '../domain/types';
import { reportTitle } from '../lib/reportTitle';

export function ReportsScreen() {
  const { reports, meals, index, dates } = useData();
  const navigate = useNavigate();
  const confirm = useConfirm();
  const toast = useToast();
  const unlocked = dates.length >= UNLOCK_DAYS;
  const lastDate = dates[dates.length - 1] ?? todayISO();
  const [customEnd, setCustomEnd] = useState(lastDate);
  const [busy, setBusy] = useState<string | null>(null);

  const regenerate = async (report: SavedReport) => {
    setBusy(report.id);
    try {
      await regenerateReport(report.id);
      toast(`${reportTitle(report)} gerado novamente com os dados atuais.`);
    } finally {
      setBusy(null);
    }
  };

  const remove = async (report: SavedReport) => {
    const ok = await confirm({
      title: `Excluir “${reportTitle(report)}”?`,
      message:
        report.kind === 'semanal'
          ? 'Seus registros de refeições continuam salvos. Você pode gerar este relatório de novo quando quiser.'
          : 'Seus registros de refeições continuam salvos.',
      confirmLabel: 'Excluir relatório',
      danger: true,
    });
    if (!ok) return;
    await deleteReport(report.id);
    toast('Relatório excluído.');
  };

  const generateCustom = async (event: FormEvent) => {
    event.preventDefault();
    if (!customEnd) return;
    const report = await saveReportForPeriod(periodEndingOn(customEnd));
    toast('Relatório gerado.');
    navigate(`/relatorios/${report.id}`);
  };

  return (
    <div className="stack">
      <PageHeader title="Relatórios" subtitle="Seu histórico de relatórios semanais" />

      {unlocked ? (
        <Link to="/relatorio" className="card card-link current-report-link">
          <span className="current-report-icon">
            <FileText size={22} aria-hidden="true" />
          </span>
          <span className="grow">
            <strong>Relatório atual</strong>
            <span className="muted small block">Últimos 7 dias, atualizado em tempo real</span>
          </span>
          <ChevronRight size={20} aria-hidden="true" />
        </Link>
      ) : (
        <LockedThermometer registeredDays={dates.length} />
      )}

      <p className="muted small">
        A cada semana encerrada, um relatório é salvo aqui automaticamente. Se você corrigir algum
        registro depois, é só gerar o relatório novamente.
      </p>

      {reports.length ? (
        <ul className="stack-sm" style={{ listStyle: 'none' }} aria-label="Relatórios salvos">
          {reports.map((report) => {
            const stale = isReportStale(report, meals, index);
            const score = report.data.score;
            return (
              <li key={report.id} className="card report-card">
                <Link to={`/relatorios/${report.id}`} className="report-card-main">
                  <GradeBadge grade={score?.grade} size="lg" />
                  <span className="grow">
                    <strong className="block">{reportTitle(report)}</strong>
                    <span className="block small">
                      {formatPeriod(report.startDate, report.endDate)}
                      {score && (
                        <span className="muted">
                          {' '}
                          · {score.total}/100 · {GRADE_LABELS[score.grade]}
                        </span>
                      )}
                    </span>
                    <span className="block small muted">
                      Gerado em {formatDateTime(report.generatedAt)}
                    </span>
                    {stale && <span className="badge badge-warning">Desatualizado</span>}
                  </span>
                </Link>
                <div className="report-card-actions">
                  <button
                    type="button"
                    className={`btn btn-sm ${stale ? 'btn-primary' : 'btn-ghost'}`}
                    onClick={() => regenerate(report)}
                    disabled={busy === report.id}
                  >
                    <RefreshCw size={16} aria-hidden="true" /> Gerar novamente
                  </button>
                  <button
                    type="button"
                    className="btn btn-sm btn-ghost danger-text"
                    onClick={() => remove(report)}
                  >
                    <Trash2 size={16} aria-hidden="true" /> Excluir
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      ) : (
        <EmptyState icon={<FileText size={30} />} title="Nenhum relatório salvo ainda">
          {unlocked
            ? 'O primeiro relatório semanal aparece aqui quando a semana terminar. Você também pode salvar o relatório atual.'
            : 'Seus relatórios aparecem aqui depois de 7 dias de registros.'}
        </EmptyState>
      )}

      {dates.length > 0 && (
        <details className="card disclosure">
          <summary>
            <span className="row">
              <FilePlus2 size={20} aria-hidden="true" /> Gerar relatório de outro período
            </span>
          </summary>
          <form className="stack-sm custom-report-form" onSubmit={generateCustom}>
            <label className="field">
              <span className="field-label">Último dia do período</span>
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
                  ? `O relatório vai cobrir os 7 dias de ${formatPeriod(periodEndingOn(customEnd).start, customEnd)}.`
                  : 'Escolha uma data.'}
              </span>
            </label>
            <button type="submit" className="btn btn-primary">
              Gerar relatório
            </button>
          </form>
        </details>
      )}
    </div>
  );
}
