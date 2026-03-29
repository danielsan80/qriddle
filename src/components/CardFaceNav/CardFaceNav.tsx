import { type ReactNode } from 'react';
import styles from './CardFaceNav.module.css';

export const FACES = [
  'inner.map',
  'outer.front',
  'outer.back',
  'outer.center',
] as const;

export type Face = (typeof FACES)[number];

interface CardFaceNavProps {
  selected?: Face;
  onSelect: (face: Face) => void;
}

interface FaceButtonProps {
  face: Face;
  selected?: Face;
  onSelect: (face: Face) => void;
  className: string;
  children: ReactNode;
}

interface FaceContentProps {
  label: string;
}

function FaceButton({
  face,
  selected,
  onSelect,
  className,
  children,
}: FaceButtonProps) {
  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={face}
      aria-pressed={selected === face}
      className={`${className} ${selected === face ? styles.selected : ''}`}
      onClick={() => onSelect(face)}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') onSelect(face);
      }}
    >
      {children}
    </div>
  );
}

function FaceContent({ label }: FaceContentProps) {
  return <span>{label}</span>;
}

function CenterFaceContent() {
  return (
    <>
      <div className={`${styles.quadrant} ${styles.topLeft}`}>
        <span className={styles.rotated}>3</span>
      </div>
      <div className={`${styles.quadrant} ${styles.topRight}`}>
        <span className={styles.rotated}>2</span>
      </div>
    </>
  );
}

export function CardFaceNav({ selected, onSelect }: CardFaceNavProps) {
  return (
    <div className={styles.nav}>
      <FaceButton
        face="inner.map"
        selected={selected}
        onSelect={onSelect}
        className={styles.inner}
      >
        <FaceContent label="map" />
      </FaceButton>

      <div className={styles.outer}>
        <FaceButton
          face="outer.center"
          selected={selected}
          onSelect={onSelect}
          className={styles.center}
        >
          <CenterFaceContent />
        </FaceButton>

        <FaceButton
          face="outer.back"
          selected={selected}
          onSelect={onSelect}
          className={`${styles.quadrant} ${styles.bottomLeft}`}
        >
          <FaceContent label="4" />
        </FaceButton>

        <FaceButton
          face="outer.front"
          selected={selected}
          onSelect={onSelect}
          className={`${styles.quadrant} ${styles.bottomRight}`}
        >
          <FaceContent label="1" />
        </FaceButton>
      </div>
    </div>
  );
}
