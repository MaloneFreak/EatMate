import type { ComponentType } from 'react';
import {
  Apple,
  Coffee,
  Moon,
  Sandwich,
  Soup,
  UtensilsCrossed,
  type LucideProps,
} from 'lucide-react';
import type { MealType } from '../domain/types';

const ICONS: Record<MealType, ComponentType<LucideProps>> = {
  cafe_manha: Coffee,
  lanche_manha: Apple,
  almoco: UtensilsCrossed,
  cafe_tarde: Sandwich,
  jantar: Soup,
  ceia: Moon,
};

export function MealIcon({ type, size = 20, ...props }: { type: MealType } & LucideProps) {
  const Icon = ICONS[type];
  return <Icon size={size} aria-hidden="true" {...props} />;
}
