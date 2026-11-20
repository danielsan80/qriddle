import { useEffect, useId, useRef, useState } from 'react';
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

  const inputId = useId();
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
    <div className={styles.prefill}>
      <label htmlFor={inputId} className={styles.label}>
        Hints
      </label>
      <input
        id={inputId}
        ref={inputRef}
        type="range"
        min={0}
        max={config.maxPrefillPercentage}
        step={1}
        value={draft}
        onChange={(event) => setDraft(Number(event.target.value))}
      />
      <span data-testid="prefill-value" className={styles.value}>
        {draft}%
      </span>
    </div>
  );
}
