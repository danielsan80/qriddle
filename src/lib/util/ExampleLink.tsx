import type { ReactNode } from 'react';
import { getExampleHash } from './examples';
import styles from './ExampleLink.module.css';

interface ExampleLinkProps {
  code: string;
  children: ReactNode;
}

export function ExampleLink({ code, children }: ExampleLinkProps) {
  const hash = getExampleHash(code);

  return (
    <a
      href={`#${hash}`}
      className={styles.link}
      onClick={(e) => {
        e.preventDefault();
        history.pushState(null, '', `#${hash}`);
        window.dispatchEvent(new PopStateEvent('popstate'));
      }}
    >
      {children}
    </a>
  );
}
