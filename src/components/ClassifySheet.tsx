import { CLASSIFY_OPTIONS, type ClassifyOption } from '../domain/groups';
import { useI18n } from '../i18n/I18nProvider';
import { GradeBadge } from './GradeBadge';
import { Sheet } from './Sheet';

interface ClassifySheetProps {
  name: string | null;
  onClose: () => void;
  onSelect: (option: ClassifyOption) => void;
}

/** Pergunta em qual categoria entra um alimento que o app não reconheceu. */
export function ClassifySheet({ name, onClose, onSelect }: ClassifySheetProps) {
  const { t } = useI18n();
  return (
    <Sheet
      open={name !== null}
      onClose={onClose}
      title={t.classify.title(name ?? '')}
      description={t.classify.description}
    >
      <ul className="option-list">
        {CLASSIFY_OPTIONS.map((option) => (
          <li key={option.key}>
            <button type="button" className="option" onClick={() => onSelect(option)}>
              <GradeBadge grade={option.grade} />
              <span className="grow">
                <span className="option-title">{t.classify.options[option.key].label}</span>
                <span className="option-subtitle">{t.classify.options[option.key].examples}</span>
              </span>
            </button>
          </li>
        ))}
      </ul>
    </Sheet>
  );
}
