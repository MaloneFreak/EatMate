import { CalendarX, Pencil, Plus, Trash2 } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router';
import { useConfirm } from '../components/Confirm';
import { EmptyState } from '../components/EmptyState';
import { GradeBadge } from '../components/GradeBadge';
import { MealIcon } from '../components/MealIcon';
import { PageHeader } from '../components/PageHeader';
import { useToast } from '../components/Toast';
import { useData } from '../data/DataProvider';
import { deleteDay, deleteMeal } from '../data/repo';
import { isValidISODate, todayISO } from '../domain/dates';
import { MAIN_MEALS } from '../domain/meals';
import type { Meal } from '../domain/types';
import { useI18n } from '../i18n/I18nProvider';
import { summarizeDay } from '../lib/days';

export function DayScreen() {
  const { date = '' } = useParams();
  const { meals, index, loading } = useData();
  const navigate = useNavigate();
  const confirm = useConfirm();
  const toast = useToast();
  const { t, f } = useI18n();
  const d = t.day;

  if (!isValidISODate(date)) {
    return (
      <>
        <PageHeader title={d.title} back="/historico" />
        <EmptyState icon={<CalendarX size={30} />} title={d.invalid} />
      </>
    );
  }

  const dayMeals = meals.filter((m) => m.date === date);
  const summary = summarizeDay(date, dayMeals, index);
  const title = date === todayISO() ? t.common.today : f.long(date);
  const missingMain = MAIN_MEALS.filter((type) => !dayMeals.some((m) => m.type === type));

  const removeMeal = async (meal: Meal) => {
    const ok = await confirm({
      title: d.deleteMealTitle(t.mealTypes[meal.type]),
      message: d.irreversible,
      confirmLabel: t.common.delete,
      danger: true,
    });
    if (!ok) return;
    await deleteMeal(meal.id);
    toast(t.mealForm.deleted);
  };

  const removeDay = async () => {
    const ok = await confirm({
      title: d.deleteDayTitle,
      message: d.deleteDayMessage(dayMeals.length, f.full(date)),
      confirmLabel: d.deleteDayConfirm,
      danger: true,
    });
    if (!ok) return;
    await deleteDay(date);
    toast(d.dayDeleted);
    navigate('/historico', { replace: true });
  };

  return (
    <div className="stack">
      <PageHeader
        title={title}
        subtitle={date === todayISO() ? f.long(date) : f.full(date)}
        back="/historico"
      />

      {!dayMeals.length && !loading ? (
        <EmptyState
          icon={<CalendarX size={30} />}
          title={d.empty}
          action={
            <Link to={`/registrar?data=${date}`} className="btn btn-primary">
              {d.registerHere}
            </Link>
          }
        />
      ) : (
        <>
          <section className="card day-summary" aria-label={d.summary}>
            <GradeBadge grade={summary.score?.grade} size="lg" />
            <div className="grow stack-sm">
              <p>
                <strong>
                  {summary.score ? d.grade(t.grades.labels[summary.score.grade]) : d.noGrade}
                </strong>
                {summary.score && <span className="muted"> · {summary.score.total}/100</span>}
              </p>
              <div className="chips">
                <span className="badge">{d.items(summary.itemsCount)}</span>
                <span className="badge">{d.fruitsAndVegetables(summary.fruitsAndVegetables)}</span>
                {summary.ultraProcessed > 0 && (
                  <span className="badge badge-warning">
                    {d.ultraProcessed(summary.ultraProcessed)}
                  </span>
                )}
                {summary.unclassified > 0 && (
                  <span className="badge">{d.unclassified(summary.unclassified)}</span>
                )}
              </div>
            </div>
          </section>

          <ul className="stack-sm" style={{ listStyle: 'none' }}>
            {dayMeals.map((meal) => (
              <li key={meal.id} className="card meal-card">
                <div className="meal-card-header">
                  <span className="meal-card-icon">
                    <MealIcon type={meal.type} size={20} />
                  </span>
                  <span className="grow">
                    <strong>{t.mealTypes[meal.type]}</strong>
                    {meal.time && <span className="muted small"> · {meal.time}</span>}
                  </span>
                  <Link
                    to={`/registrar/${meal.id}`}
                    className="icon-btn small"
                    aria-label={d.edit(t.mealTypes[meal.type])}
                  >
                    <Pencil size={18} aria-hidden="true" />
                  </Link>
                  <button
                    type="button"
                    className="icon-btn small danger"
                    onClick={() => removeMeal(meal)}
                    aria-label={d.delete(t.mealTypes[meal.type])}
                  >
                    <Trash2 size={18} aria-hidden="true" />
                  </button>
                </div>
                <ul className="meal-card-items">
                  {meal.items.map((item) => (
                    <li key={item.id} className="food-line">
                      <GradeBadge grade={index.get(item.foodId)?.grade} />
                      <span>
                        {item.name}
                        {item.quantity && <span className="qty"> · {item.quantity}</span>}
                      </span>
                    </li>
                  ))}
                </ul>
                {meal.notes && <p className="meal-card-notes">“{meal.notes}”</p>}
              </li>
            ))}
          </ul>

          {missingMain.length > 0 && (
            <section className="stack-sm" aria-label={d.missingLabel}>
              {missingMain.map((type) => (
                <Link
                  key={type}
                  to={`/registrar?data=${date}&refeicao=${type}`}
                  className="missing-meal"
                >
                  <MealIcon type={type} size={18} />
                  <span className="grow">{d.missing(t.mealTypes[type])}</span>
                  <Plus size={18} aria-hidden="true" />
                </Link>
              ))}
            </section>
          )}

          <Link to={`/registrar?data=${date}`} className="btn btn-secondary btn-block">
            <Plus size={20} aria-hidden="true" /> {d.addHere}
          </Link>
          <button type="button" className="btn btn-ghost btn-block danger-text" onClick={removeDay}>
            <Trash2 size={18} aria-hidden="true" /> {d.deleteAll}
          </button>
        </>
      )}
    </div>
  );
}
