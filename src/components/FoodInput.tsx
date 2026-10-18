import { Plus } from 'lucide-react';
import { useId, useMemo, useRef, useState, type KeyboardEvent } from 'react';
import type { FoodIndex, FoodSuggestion } from '../domain/foodIndex';
import { groupLabel } from '../domain/groups';
import { parseFoodText, splitTyping, type ParsedItem } from '../domain/parser';
import { GradeBadge } from './GradeBadge';

interface FoodInputProps {
  index: FoodIndex;
  usage: Map<string, number>;
  onAdd: (items: ParsedItem[]) => void;
}

/**
 * Campo "O que você comeu?": sugere alimentos enquanto a pessoa digita e
 * também entende frases inteiras ("café com leite e 2 torradas").
 */
export function FoodInput({ index, usage, onAdd }: FoodInputProps) {
  const [text, setText] = useState('');
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const [hint, setHint] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listId = useId();
  const hintId = useId();

  const typing = useMemo(() => splitTyping(text), [text]);
  const suggestions = useMemo(
    () => (typing.query.trim() ? index.search(typing.query, { limit: 6, usage }) : []),
    [typing.query, index, usage],
  );
  const showList = open && suggestions.length > 0;

  const reset = () => {
    setText('');
    setOpen(false);
    setActive(-1);
    setHint(null);
    inputRef.current?.focus();
  };

  const commitText = () => {
    if (!text.trim()) return;
    const items = parseFoodText(text, index);
    if (!items.length) {
      setHint(
        'Não encontrei nenhum alimento nesse texto. Tente algo como "arroz, feijão e salada".',
      );
      return;
    }
    onAdd(items);
    reset();
  };

  const choose = (suggestion: FoodSuggestion) => {
    const before = typing.done.trim() ? parseFoodText(typing.done, index) : [];
    // Mantém a quantidade digitada antes do alimento ("2 fatias de …").
    const quantity = typing.leading
      ? parseFoodText(`${typing.leading} ${suggestion.text}`, index)[0]?.quantity
      : undefined;
    onAdd([
      ...before,
      { name: suggestion.text, foodId: suggestion.food.id, ...(quantity ? { quantity } : {}) },
    ]);
    reset();
  };

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'ArrowDown' && suggestions.length) {
      event.preventDefault();
      setOpen(true);
      setActive((i) => (i + 1) % suggestions.length);
    } else if (event.key === 'ArrowUp' && suggestions.length) {
      event.preventDefault();
      setOpen(true);
      setActive((i) => (i <= 0 ? suggestions.length - 1 : i - 1));
    } else if (event.key === 'Enter') {
      event.preventDefault();
      const selected = showList && active >= 0 ? suggestions[active] : undefined;
      if (selected) choose(selected);
      else commitText();
    } else if (event.key === 'Escape') {
      setOpen(false);
      setActive(-1);
    }
  };

  return (
    <div className="food-input">
      <div className="food-input-row">
        <input
          ref={inputRef}
          className="input"
          type="text"
          role="combobox"
          aria-label="O que você comeu?"
          aria-autocomplete="list"
          aria-expanded={showList}
          aria-controls={listId}
          aria-activedescendant={showList && active >= 0 ? `${listId}-${active}` : undefined}
          aria-describedby={hint ? hintId : undefined}
          placeholder='Ex.: "arroz, feijão e salada"'
          autoComplete="off"
          enterKeyHint="done"
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            setOpen(true);
            setActive(-1);
            setHint(null);
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 200)}
          onKeyDown={onKeyDown}
        />
        <button
          type="button"
          className="btn btn-primary"
          onClick={commitText}
          disabled={!text.trim()}
          aria-label="Adicionar"
        >
          <Plus size={22} aria-hidden="true" />
        </button>
      </div>
      {showList && (
        <ul className="suggestions" id={listId} role="listbox" aria-label="Sugestões de alimentos">
          {suggestions.map((s, i) => (
            <li
              key={s.food.id}
              id={`${listId}-${i}`}
              role="option"
              aria-selected={i === active}
              className="suggestion"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => choose(s)}
              onMouseEnter={() => setActive(i)}
            >
              <GradeBadge grade={s.food.grade} />
              <span className="suggestion-text">
                <span className="suggestion-name">{s.text}</span>
                <span className="suggestion-meta">
                  {s.text.toLowerCase() !== s.food.name.toLowerCase() ? `${s.food.name} · ` : ''}
                  {groupLabel(s.food.group)}
                </span>
              </span>
            </li>
          ))}
        </ul>
      )}
      {hint && (
        <p id={hintId} className="field-hint" role="alert">
          {hint}
        </p>
      )}
    </div>
  );
}
