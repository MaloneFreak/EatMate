import { Copy, Download, Printer, Share2, Sparkles } from 'lucide-react';
import { useData } from '../data/DataProvider';
import { reportToAIPrompt, reportToMarkdown } from '../domain/exportText';
import type { ReportData } from '../domain/types';
import { useI18n } from '../i18n/I18nProvider';
import { canShare, copyText, downloadText, shareText, slugify } from '../lib/share';
import { useToast } from './Toast';

interface ReportActionsProps {
  data: ReportData;
  title: string;
  generatedAt?: number;
}

/** Ações para usar o relatório fora do app: IA, nutricionista, WhatsApp, PDF. */
export function ReportActions({ data, title, generatedAt }: ReportActionsProps) {
  const toast = useToast();
  const { t, f } = useI18n();
  const { index } = useData();
  const a = t.reportActions;
  const options = {
    t,
    f,
    index,
    generatedAt,
    title: `${title} (${f.period(data.startDate, data.endDate)})`,
  };

  const copyForAI = async () => {
    const ok = await copyText(reportToAIPrompt(data, options));
    toast(ok ? a.copiedForAI : a.copyFailed, ok ? 'success' : 'error');
  };

  const copyReport = async () => {
    const ok = await copyText(reportToMarkdown(data, options));
    toast(ok ? a.copied : a.copyFailed, ok ? 'success' : 'error');
  };

  const share = async () => {
    const ok = await shareText(title, reportToMarkdown(data, options));
    if (!ok) toast(a.shareFailed, 'error');
  };

  const download = () => {
    const name = slugify(`${a.fileName} ${data.startDate} ${data.endDate}`);
    downloadText(`${name}.md`, reportToMarkdown(data, options), 'text/markdown');
  };

  return (
    <section className="card stack-sm report-actions" aria-labelledby="actions-title">
      <h2 id="actions-title">{a.title}</h2>
      <p className="muted small">{a.text}</p>
      <button type="button" className="btn btn-primary btn-block" onClick={copyForAI}>
        <Sparkles size={20} aria-hidden="true" /> {a.copyForAI}
      </button>
      <div className="actions-grid">
        <button type="button" className="btn btn-secondary" onClick={() => window.print()}>
          <Printer size={18} aria-hidden="true" /> {a.print}
        </button>
        {canShare() ? (
          <button type="button" className="btn btn-secondary" onClick={share}>
            <Share2 size={18} aria-hidden="true" /> {a.share}
          </button>
        ) : (
          <button type="button" className="btn btn-secondary" onClick={copyReport}>
            <Copy size={18} aria-hidden="true" /> {a.copyText}
          </button>
        )}
        <button type="button" className="btn btn-secondary" onClick={download}>
          <Download size={18} aria-hidden="true" /> {a.download}
        </button>
        {canShare() && (
          <button type="button" className="btn btn-secondary" onClick={copyReport}>
            <Copy size={18} aria-hidden="true" /> {a.copyText}
          </button>
        )}
      </div>
    </section>
  );
}
