import { Info } from 'lucide-react';
import { useMemo } from 'react';
import { Link } from 'react-router';
import { PageHeader } from '../components/PageHeader';
import { ReportView } from '../components/ReportView';
import { useData } from '../data/DataProvider';
import { addDays, todayISO } from '../domain/dates';
import { buildDemoMeals } from '../domain/demo';
import { getDefaultFoodIndex } from '../domain/foodIndex';
import { periodEndingOn } from '../domain/periods';
import { buildReport } from '../domain/report';

/** Relatório com uma semana fictícia, para a pessoa ver o que vai receber. */
export function ExampleReportScreen() {
  const { profile } = useData();
  const report = useMemo(() => {
    const end = addDays(todayISO(), -1);
    const index = getDefaultFoodIndex();
    return buildReport({
      meals: buildDemoMeals(end, index),
      index,
      period: periodEndingOn(end),
      profileName: profile?.name ?? '',
    });
  }, [profile]);

  return (
    <div className="stack">
      <PageHeader title="Relatório de exemplo" back="/" />
      <ReportView
        data={report}
        title="Exemplo"
        badge={<span className="badge badge-warning">Dados fictícios</span>}
      >
        <div className="notice notice-warning">
          <Info size={18} aria-hidden="true" />
          <span>
            Este é um exemplo com uma semana inventada. Seu relatório de verdade aparece depois de 7
            dias de registros.
          </span>
        </div>
        <Link to="/registrar" className="btn btn-primary btn-block">
          Registrar uma refeição
        </Link>
      </ReportView>
    </div>
  );
}
