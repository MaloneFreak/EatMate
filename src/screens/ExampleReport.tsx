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
import { useI18n } from '../i18n/I18nProvider';

/** Relatório com uma semana fictícia, para a pessoa ver o que vai receber. */
export function ExampleReportScreen() {
  const { profile } = useData();
  const { t, language } = useI18n();
  const e = t.exampleReport;
  const report = useMemo(() => {
    const end = addDays(todayISO(), -1);
    const index = getDefaultFoodIndex(language);
    return buildReport({
      meals: buildDemoMeals(end, index),
      index,
      period: periodEndingOn(end),
      profileName: profile?.name ?? '',
    });
  }, [profile, language]);

  return (
    <div className="stack">
      <PageHeader title={e.header} back="/" />
      <ReportView
        data={report}
        title={e.title}
        badge={<span className="badge badge-warning">{e.badge}</span>}
      >
        <div className="notice notice-warning">
          <Info size={18} aria-hidden="true" />
          <span>{e.notice}</span>
        </div>
        <Link to="/registrar" className="btn btn-primary btn-block">
          {e.register}
        </Link>
      </ReportView>
    </div>
  );
}
