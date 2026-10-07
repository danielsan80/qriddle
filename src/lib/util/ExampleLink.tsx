import type { ReactNode } from 'react';
import { useWizard } from '../../context/useWizard';
import { workFrom } from '../../context/work';
import { decode } from '../browser/urlState';
import { getExampleHash } from './examples';
import styles from './ExampleLink.module.css';

interface ExampleLinkProps {
  code: string;
  children: ReactNode;
}

export function ExampleLink({ code, children }: ExampleLinkProps) {
  const { updateWork } = useWizard();
  const hash = getExampleHash(code);

  return (
    <a
      href={`#${hash}`}
      className={styles.link}
      onClick={(e) => {
        e.preventDefault();
        updateWork((current) => workFrom(decode(hash, current)));
      }}
    >
      {children}
    </a>
  );
}
