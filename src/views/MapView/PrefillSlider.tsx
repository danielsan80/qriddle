import { useEffect, useRef, useState } from 'react';
import { config } from '../../lib/config';
import styles from './PrefillSlider.module.css';

interface PrefillSliderProps {
  value: number;
  onRelease: (value: number) => void;
}

export function PrefillSlider({ value, onRelease }: PrefillSliderProps) {
  const [draft, setDraft] = useState(value);
  const [syncedValue, setSyncedValue] = useState(value);
  if (value !== syncedValue) {
    setSyncedValue(value);
    setDraft(value);
  }

  const inputRef = useRef<HTMLInputElement>(null);
  const onReleaseRef = useRef(onRelease);

  useEffect(() => {
    onReleaseRef.current = onRelease;
  });

  useEffect(() => {
    const input = inputRef.current!;
    function handleChange(): void {
      onReleaseRef.current(Number(input.value));
    }
    input.addEventListener('change', handleChange);
    return () => input.removeEventListener('change', handleChange);
  }, []);

  return (
    <label className={styles.prefill}>
      <input
        ref={inputRef}
        type="range"
        aria-label="Prefilled modules"
        min={0}
        max={config.maxPrefillPercentage}
        step={1}
        value={draft}
        onChange={(event) => setDraft(Number(event.target.value))}
      />
      <span data-testid="prefill-value" className={styles.value}>
        {draft}%
      </span>
    </label>
  );
}
