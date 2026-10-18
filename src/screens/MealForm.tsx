import { Info, Trash2, X } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router';
import { ClassifySheet } from '../components/ClassifySheet';
import { useConfirm } from '../components/Confirm';
import { EmptyState } from '../components/EmptyState';
import { FoodInput } from '../components/FoodInput';
import { GradeBadge } from '../components/GradeBadge';
import { MealIcon } from '../components/MealIcon';
import { PageHeader } from '../components/PageHeader';
import { useToast } from '../components/Toast';
import { useData } from '../data/DataProvider';
import { uid } from '../data/db';
import { classifyFood, deleteMeal, saveMeal } from '../data/repo';
import { addDays, isValidISODate, nowTime, todayISO } from '../domain/dates';
import { GRADE_POINTS } from '../domain/grades';
import { groupWeight, type ClassifyOption } from '../domain/groups';
import { MEAL_TYPES, isMealType, suggestMealType } from '../domain/meals';
import type { ParsedItem } from '../domain/parser';
import { averageGradeLetter } from '../domain/scoring';
import type { Meal, MealType } from '../domain/types';
import { useI18n } from '../i18n/I18nProvider';
import { useGoBack } from '../lib/navigation';

interface DraftItem {
  key: string;
  id?: string;
  name: string;
  quantity: string;
  foodId?: string;
}

interface Draft {
  id?: string;
  date: string;
  time: string;
  type: MealType;
  items: DraftItem[];
  notes: string;
}

export function MealFormScreen() {
  const { id } = useParams();
  const [params] = useSearchParams();
  const { meals, loading } = useData();
  const { t } = useI18n();

  if (id) {
    const meal = meals.find((m) => m.id === id);
    if (!meal) {
      if (loading) return null;
      return (
        <>
          <PageHeader title={t.mealForm.editTitle} back="/historico" />
          <EmptyState icon={<Info size={30} />} title={t.mealForm.notFound}>
            {t.mealForm.notFoundText}
          </EmptyState>
        </>
      );
    }
    return <MealForm key={meal.id} initial={fromMeal(meal)} editing />;
  }

  const today = todayISO();
  const dateParam = params.get('data');
  const date = dateParam && isValidISODate(dateParam) && dateParam <= today ? dateParam : today;
  const typeParam = params.get('refeicao');
  const time = date === today ? nowTime() : '';
  const initial: Draft = {
    date,
    time,
    type: isMealType(typeParam) ? typeParam : suggestMealType(time || nowTime()),
    items: [],
    notes: '',
  };
  // A chave muda só quando a URL muda (ex.: outro dia ou outra refeição), nunca no meio da digitação.
  return <MealForm key={params.toString()} initial={initial} editing={false} />;
}

function fromMeal(meal: Meal): Draft {
  return {
    id: meal.id,
    date: meal.date,
    time: meal.time ?? '',
    type: meal.type,
    items: meal.items.map((i) => ({
      key: i.id,
      id: i.id,
      name: i.name,
      quantity: i.quantity ?? '',
      foodId: i.foodId,
    })),
    notes: meal.notes ?? '',
  };
}

function MealForm({ initial, editing }: { initial: Draft; editing: boolean }) {
  const { meals, index, usage } = useData();
  const toast = useToast();
  const confirm = useConfirm();
  const { t, f } = useI18n();
  const m = t.mealForm;
  const goBack = useGoBack('/');
  const [draft, setDraft] = useState<Draft>(initial);
  const [classifying, setClassifying] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const today = todayISO();
  const futureDate = draft.date > today;

  const update = (patch: Partial<Draft>) => setDraft((d) => ({ ...d, ...patch }));

  const addItems = (items: ParsedItem[]) =>
    setDraft((d) => ({
      ...d,
      items: [
        ...d.items,
        ...items.map((i) => ({
          key: uid(),
          name: i.name,
          quantity: i.quantity ?? '',
          foodId: i.foodId,
        })),
      ],
    }));

  const updateItem = (key: string, patch: Partial<DraftItem>) =>
    setDraft((d) => ({
      ...d,
      items: d.items.map((i) => (i.key === key ? { ...i, ...patch } : i)),
    }));

  const removeItem = (key: string) =>
    setDraft((d) => ({ ...d, items: d.items.filter((i) => i.key !== key) }));

  const sameTypeMeal = meals.find(
    (m) => m.date === draft.date && m.type === draft.type && m.id !== draft.id,
  );

  // Alimentos que a pessoa costuma registrar nesta refeição.
  const frequent = useMemo(() => {
    const counts = new Map<string, { name: string; count: number }>();
    for (const meal of meals) {
      if (meal.type !== draft.type) continue;
      for (const item of meal.items) {
        if (!item.foodId) continue;
        const current = counts.get(item.foodId);
        counts.set(item.foodId, {
          name: current?.name ?? item.name,
          count: (current?.count ?? 0) + 1,
        });
      }
    }
    const inDraft = new Set(draft.items.map((i) => i.foodId));
    return [...counts.entries()]
      .filter(([foodId]) => !inDraft.has(foodId) && index.get(foodId))
      .sort((a, b) => b[1].count - a[1].count)
      .slice(0, 8)
      .map(([foodId, { name }]) => ({ foodId, name }));
  }, [meals, draft.type, draft.items, index]);

  const quality = useMemo(() => {
    let weight = 0;
    let points = 0;
    for (const item of draft.items) {
      const food = index.get(item.foodId);
      if (!food) continue;
      const w = groupWeight(food.group);
      weight += w;
      points += w * GRADE_POINTS[food.grade];
    }
    return weight ? averageGradeLetter(points / weight) : null;
  }, [draft.items, index]);

  const onClassify = async (option: ClassifyOption) => {
    if (!classifying) return;
    const name = classifying;
    const food = await classifyFood(name, option);
    setDraft((d) => ({
      ...d,
      items: d.items.map((i) =>
        !i.foodId && i.name.toLowerCase() === name.toLowerCase() ? { ...i, foodId: food.id } : i,
      ),
    }));
    setClassifying(null);
    toast(t.classify.done(name, t.classify.options[option.key].label));
  };

  // Só sai do formulário com a gravação garantida: `saveMeal` grava antes na cópia de
  // segurança local e não espera o banco por mais que alguns segundos (ver repo.ts).
  const save = async () => {
    if (!draft.items.length || futureDate || saving) return;
    setSaving(true);
    try {
      await saveMeal({
        id: draft.id,
        date: draft.date,
        type: draft.type,
        time: draft.time || undefined,
        notes: draft.notes,
        items: draft.items.map((i) => ({
          id: i.id,
          name: i.name,
          quantity: i.quantity,
          foodId: i.foodId,
        })),
      });
      toast(editing ? m.changesSaved : m.saved(t.mealTypes[draft.type]));
      goBack();
    } catch (error) {
      console.error(error);
      toast(m.saveError, 'error');
      setSaving(false);
    }
  };

  const remove = async () => {
    if (!draft.id) return;
    const ok = await confirm({
      title: m.deleteTitle,
      message: m.deleteMessage(t.mealTypes[draft.type], f.full(draft.date)),
      confirmLabel: t.common.delete,
      danger: true,
    });
    if (!ok) return;
    try {
      await deleteMeal(draft.id);
      toast(m.deleted);
      goBack();
    } catch (error) {
      console.error(error);
      toast(m.deleteError, 'error');
    }
  };

  return (
    <div className="stack meal-form">
      <PageHeader
        title={editing ? m.editTitle : m.newTitle}
        back="/"
        actions={
          editing && (
            <button
              type="button"
              className="icon-btn danger"
              onClick={remove}
              aria-label={m.deleteLabel}
            >
              <Trash2 size={21} aria-hidden="true" />
            </button>
          )
        }
      />

      <section className="card stack-sm" aria-labelledby="when-title">
        <h2 id="when-title" className="field-label">
          {m.when}
        </h2>
        <div className="chips">
          <button
            type="button"
            className="chip chip-sm"
            aria-pressed={draft.date === today}
            onClick={() => update({ date: today })}
          >
            {t.common.today}
          </button>
          <button
            type="button"
            className="chip chip-sm"
            aria-pressed={draft.date === addDays(today, -1)}
            onClick={() => update({ date: addDays(today, -1) })}
          >
            {t.common.yesterday}
          </button>
        </div>
        <div className="when-row">
          <label className="field grow">
            <span className="visually-hidden">{m.date}</span>
            <input
              className="input"
              type="date"
              value={draft.date}
              max={today}
              required
              onChange={(e) => e.target.value && update({ date: e.target.value })}
            />
          </label>
          <label className="field when-time">
            <span className="visually-hidden">{m.time}</span>
            <input
              className="input"
              type="time"
              value={draft.time}
              onChange={(e) => update({ time: e.target.value })}
            />
          </label>
        </div>
        {futureDate && <p className="field-hint">{m.future}</p>}
      </section>

      <section className="card stack-sm" aria-labelledby="type-title">
        <h2 id="type-title" className="field-label">
          {m.which}
        </h2>
        <div className="meal-type-grid">
          {MEAL_TYPES.map(({ type }) => (
            <button
              key={type}
              type="button"
              className="meal-type-option"
              aria-pressed={draft.type === type}
              onClick={() => update({ type })}
            >
              <MealIcon type={type} size={22} />
              {t.mealTypes[type]}
            </button>
          ))}
        </div>
        {sameTypeMeal && (
          <div className="notice notice-info">
            <Info size={18} aria-hidden="true" />
            <span>
              {m.alreadyBefore(t.mealTypes[draft.type])}{' '}
              <Link to={`/registrar/${sameTypeMeal.id}`} replace>
                {m.editExisting}
              </Link>{' '}
              {m.alreadyAfter}
            </span>
          </div>
        )}
      </section>

      <section className="card stack" aria-labelledby="food-title">
        <div className="stack-sm">
          <h2 id="food-title" className="field-label">
            {m.what}
          </h2>
          <FoodInput index={index} usage={usage} onAdd={addItems} />
          <p className="field-hint">{m.hint}</p>
        </div>

        {draft.items.length > 0 ? (
          <ul className="item-list" aria-label={m.items}>
            {draft.items.map((item) => {
              const food = index.get(item.foodId);
              return (
                <li key={item.key} className="item-row">
                  <GradeBadge grade={food?.grade} />
                  <div className="item-row-main">
                    <span className="item-name">{item.name}</span>
                    {food ? (
                      <span className="item-meta">
                        {food.name.toLowerCase() !== item.name.toLowerCase()
                          ? `${food.name} · `
                          : ''}
                        {t.groups[food.group]}
                      </span>
                    ) : (
                      <button
                        type="button"
                        className="classify-btn"
                        onClick={() => setClassifying(item.name)}
                      >
                        {m.notRecognized}
                      </button>
                    )}
                    <input
                      className="input input-sm item-quantity"
                      placeholder={m.quantityPlaceholder}
                      aria-label={m.quantityOf(item.name)}
                      value={item.quantity}
                      maxLength={40}
                      onChange={(e) => updateItem(item.key, { quantity: e.target.value })}
                    />
                  </div>
                  <button
                    type="button"
                    className="icon-btn small"
                    onClick={() => removeItem(item.key)}
                    aria-label={m.removeItem(item.name)}
                  >
                    <X size={18} aria-hidden="true" />
                  </button>
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="muted small">{m.empty}</p>
        )}

        {quality && (
          <p className="meal-quality">
            <GradeBadge grade={quality} /> {m.quality}
          </p>
        )}

        {frequent.length > 0 && (
          <div className="stack-sm">
            <span className="small muted">{m.frequent}</span>
            <div className="chips">
              {frequent.map((f) => (
                <button
                  key={f.foodId}
                  type="button"
                  className="chip chip-sm"
                  onClick={() => addItems([{ name: f.name, foodId: f.foodId }])}
                >
                  + {f.name}
                </button>
              ))}
            </div>
          </div>
        )}
      </section>

      <section className="card">
        <label className="field">
          <span className="field-label">{m.notes}</span>
          <textarea
            className="textarea"
            placeholder={m.notesPlaceholder}
            value={draft.notes}
            maxLength={500}
            onChange={(e) => update({ notes: e.target.value })}
          />
        </label>
      </section>

      <div className="sticky-actions">
        <button
          type="button"
          className="btn btn-primary btn-block"
          onClick={save}
          disabled={!draft.items.length || futureDate || saving}
        >
          {editing ? m.saveChanges : m.save}
        </button>
      </div>

      <ClassifySheet
        name={classifying}
        onClose={() => setClassifying(null)}
        onSelect={onClassify}
      />
    </div>
  );
}
