import type { ReactNode } from 'react';
import { useWizard } from '../../context/useWizard';
import { cardSpecFromUrlState } from '../../context/cardSpec';
import { decode, type UrlState } from '../../lib/browser/urlState';
import { getExampleHash } from './examples';
import styles from './ExampleLink.module.css';

interface ExampleLinkProps {
  code: string;
  children: ReactNode;
}

export function ExampleLink({ code, children }: ExampleLinkProps) {
  const { updateCardSpec } = useWizard();
  const hash = getExampleHash(code);

  return (
    <a
      href={`#${hash}`}
      className={styles.link}
      onClick={(event) => {
        event.preventDefault();
        updateCardSpec((current) =>
          cardSpecFromUrlState(decode<UrlState>(hash, current)),
        );
      }}
    >
      {children}
    </a>
  );
}
