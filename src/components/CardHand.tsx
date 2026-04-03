import { DELEGATION_LABELS, type DelegationLevel } from '../store/types.ts';
import { cn } from '../lib/utils.ts';

const LEVELS: DelegationLevel[] = [1, 2, 3, 4, 5, 6, 7];

interface CardHandProps {
  onSelect: (level: DelegationLevel) => void;
  selectedLevel: DelegationLevel | null;
  disabled?: boolean;
}

const CardHand = ({ onSelect, selectedLevel, disabled = false }: CardHandProps): JSX.Element => {
  return (
    <div className="grid grid-cols-4 gap-2 sm:grid-cols-7 sm:gap-3">
      {LEVELS.map((level) => (
        <button
          key={level}
          type="button"
          disabled={disabled}
          onClick={() => onSelect(level)}
          className={cn(
            'flex flex-col items-center justify-center rounded-lg border-2 p-3 transition-colors',
            'hover:border-primary hover:bg-primary/5',
            'disabled:opacity-50 disabled:pointer-events-none',
            selectedLevel === level
              ? 'border-primary bg-primary/10 ring-2 ring-primary/30'
              : 'border-border bg-card',
          )}
        >
          <span className="text-2xl font-bold">{level}</span>
          <span className="text-xs text-muted-foreground mt-1">{DELEGATION_LABELS[level]}</span>
        </button>
      ))}
    </div>
  );
};

export default CardHand;
