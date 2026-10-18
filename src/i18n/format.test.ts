import { describe, expect, it } from 'vitest';
import { createFormat } from './format';
import { detectLanguage, localeFor } from './languages';

describe('formatos por idioma', () => {
  it('formata datas e números em português', () => {
    const f = createFormat('pt-BR');
    // O Intl separa o período com espaços finos: "12/10 – 18/10".
    expect(f.period('2026-10-12', '2026-10-18')).toMatch(/^12\/10\s–\s18\/10$/);
    expect(f.period('2026-12-28', '2027-01-03')).toMatch(/^28\/12\/2026\s–\s03\/01\/2027$/);
    expect(f.dayMonth('2026-10-12')).toBe('12 de outubro');
    expect(f.long('2026-10-12')).toBe('Segunda-feira, 12 de outubro');
    expect(f.decimal(2.5)).toBe('2,5');
    expect(f.percent(0.25)).toBe('25%');
  });

  it('usa a ordem de data de cada país', () => {
    expect(createFormat('en-US').short('2026-10-12')).toBe('10/12');
    expect(createFormat('en-GB').short('2026-10-12')).toBe('12/10');
    expect(createFormat('de-DE').long('2026-10-12')).toBe('Montag, 12. Oktober');
    expect(createFormat('fr-FR').monthYear('2026-10-12')).toBe('Octobre 2026');
  });
});

describe('idioma do aparelho', () => {
  it('escolhe o primeiro idioma conhecido', () => {
    expect(detectLanguage(['pt-BR', 'en'])).toBe('pt');
    expect(detectLanguage(['nl-NL', 'de-AT'])).toBe('de');
    expect(detectLanguage(['ja-JP'])).toBe('en');
    expect(detectLanguage([])).toBe('en');
  });

  it('mantém a região do aparelho quando o idioma é o mesmo', () => {
    expect(localeFor('en', ['en-GB', 'pt-BR'])).toBe('en-GB');
    expect(localeFor('pt', ['en-GB'])).toBe('pt-BR');
    expect(localeFor('es', ['es-MX'])).toBe('es-MX');
  });
});
