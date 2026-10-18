import { CLASSIFY_OPTIONS, type ClassifyOption } from '../domain/groups';
import { GradeBadge } from './GradeBadge';
import { Sheet } from './Sheet';

interface ClassifySheetProps {
  name: string | null;
  onClose: () => void;
  onSelect: (option: ClassifyOption) => void;
}

/** Pergunta em qual categoria entra um alimento que o app não reconheceu. */
export function ClassifySheet({ name, onClose, onSelect }: ClassifySheetProps) {
  return (
    <Sheet
      open={name !== null}
      onClose={onClose}
      title={`O que é “${name ?? ''}”?`}
      description="Escolha a categoria que mais combina. O EatMate vai lembrar da próxima vez."
    >
      <ul className="option-list">
        {CLASSIFY_OPTIONS.map((option) => (
          <li key={option.key}>
            <button type="button" className="option" onClick={() => onSelect(option)}>
              <GradeBadge grade={option.grade} />
              <span className="grow">
                <span className="option-title">{option.label}</span>
                <span className="option-subtitle">{option.examples}</span>
              </span>
            </button>
          </li>
        ))}
      </ul>
    </Sheet>
  );
}
