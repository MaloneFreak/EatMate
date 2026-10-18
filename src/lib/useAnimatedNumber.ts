import { useEffect, useRef, useState } from 'react';

const canAnimate = () =>
  typeof window !== 'undefined' &&
  typeof requestAnimationFrame !== 'undefined' &&
  !window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

/** Anima um número até o valor alvo (ex.: a coluna do termômetro subindo). */
export function useAnimatedNumber(target: number, duration = 900): number {
  const [animate] = useState(canAnimate);
  const [value, setValue] = useState(0);
  const fromRef = useRef(0);

  useEffect(() => {
    if (!animate) return;
    const from = fromRef.current;
    const start = performance.now();
    let frame = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const current = from + (target - from) * (1 - Math.pow(1 - t, 3));
      fromRef.current = current;
      setValue(current);
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [animate, target, duration]);

  return animate ? value : target;
}
