import { useAnimatedNumber } from '../lib/useAnimatedNumber';
import type { Grade } from '../domain/types';

interface ThermometerProps {
  /** Nota de 0 a 100. */
  score: number;
  grade: Grade;
  height?: number;
}

// Geometria (viewBox 64 × 200): tubo de y=TOP a y=BOTTOM, bulbo embaixo.
const TOP = 12;
const BOTTOM = 148;
const TICKS = [0, 25, 50, 75, 100];

/** Termômetro da qualidade da alimentação: a coluna sobe até a nota e ganha a cor da letra. */
export function Thermometer({ score, grade, height = 160 }: ThermometerProps) {
  const value = useAnimatedNumber(Math.max(0, Math.min(100, score)));
  const level = BOTTOM - (value / 100) * (BOTTOM - TOP);
  const color = `var(--grade-${grade.toLowerCase()})`;
  const track = `color-mix(in srgb, ${color} 16%, var(--surface))`;
  return (
    <svg
      className="thermometer"
      viewBox="0 0 64 200"
      width={(height * 64) / 200}
      height={height}
      role="img"
      aria-label={`Termômetro: ${Math.round(score)} de 100 pontos, nota ${grade}`}
    >
      <rect x="20" y="4" width="24" height="160" rx="12" style={{ fill: track }} />
      <circle cx="32" cy="168" r="27" style={{ fill: track }} />
      {TICKS.map((t) => {
        const y = BOTTOM - (t / 100) * (BOTTOM - TOP);
        return (
          <line
            key={t}
            x1="48"
            x2="56"
            y1={y}
            y2={y}
            strokeWidth="1.5"
            strokeLinecap="round"
            style={{ stroke: 'var(--border-strong)' }}
          />
        );
      })}
      <rect
        className="mercury"
        x="25"
        y={level}
        width="14"
        height={176 - level}
        rx="7"
        style={{ fill: color }}
      />
      <circle cx="32" cy="168" r="21" style={{ fill: color }} />
      <text
        className="thermometer-letter"
        x="32"
        y="176"
        textAnchor="middle"
        fontSize="24"
        style={{ fill: `var(--on-grade-${grade.toLowerCase()})` }}
        aria-hidden="true"
      >
        {grade}
      </text>
    </svg>
  );
}
