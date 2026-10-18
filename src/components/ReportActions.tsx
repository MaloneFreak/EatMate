import { Copy, Download, Printer, Share2, Sparkles } from 'lucide-react';
import { formatPeriod } from '../domain/dates';
import { reportToAIPrompt, reportToMarkdown } from '../domain/exportText';
import type { ReportData } from '../domain/types';
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
  const options = {
    generatedAt,
    title: `${title} (${formatPeriod(data.startDate, data.endDate)})`,
  };

  const copyForAI = async () => {
    const ok = await copyText(reportToAIPrompt(data, options));
    toast(
      ok ? 'Copiado! Agora é só colar na IA de sua preferência.' : 'Não foi possível copiar.',
      ok ? 'success' : 'error',
    );
  };

  const copyReport = async () => {
    const ok = await copyText(reportToMarkdown(data, options));
    toast(ok ? 'Relatório copiado.' : 'Não foi possível copiar.', ok ? 'success' : 'error');
  };

  const share = async () => {
    const ok = await shareText(title, reportToMarkdown(data, options));
    if (!ok) toast('Não foi possível compartilhar neste aparelho.', 'error');
  };

  const download = () => {
    const name = slugify(`eatmate relatorio ${data.startDate} a ${data.endDate}`);
    downloadText(`${name}.md`, reportToMarkdown(data, options), 'text/markdown');
  };

  return (
    <section className="card stack-sm report-actions" aria-labelledby="actions-title">
      <h2 id="actions-title">Usar este relatório</h2>
      <p className="muted small">
        Cole em uma IA (ChatGPT, Gemini, Claude…) para receber sugestões de melhoria, ou salve em
        PDF para levar ao seu nutricionista.
      </p>
      <button type="button" className="btn btn-primary btn-block" onClick={copyForAI}>
        <Sparkles size={20} aria-hidden="true" /> Copiar para usar em uma IA
      </button>
      <div className="actions-grid">
        <button type="button" className="btn btn-secondary" onClick={() => window.print()}>
          <Printer size={18} aria-hidden="true" /> PDF / Imprimir
        </button>
        {canShare() ? (
          <button type="button" className="btn btn-secondary" onClick={share}>
            <Share2 size={18} aria-hidden="true" /> Compartilhar
          </button>
        ) : (
          <button type="button" className="btn btn-secondary" onClick={copyReport}>
            <Copy size={18} aria-hidden="true" /> Copiar texto
          </button>
        )}
        <button type="button" className="btn btn-secondary" onClick={download}>
          <Download size={18} aria-hidden="true" /> Baixar arquivo
        </button>
        {canShare() && (
          <button type="button" className="btn btn-secondary" onClick={copyReport}>
            <Copy size={18} aria-hidden="true" /> Copiar texto
          </button>
        )}
      </div>
    </section>
  );
}
