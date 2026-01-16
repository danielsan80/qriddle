import type { ReactNode } from 'react';
import styles from './Panel.module.css';

type PanelType = 'qrcode' | 'puzzle';

interface PanelAction {
  icon: string;
  label: string;
  onClick: () => void;
  disabled?: boolean;
}

interface PanelProps {
  title: string;
  type: PanelType;
  showCanvas: boolean;
  action?: PanelAction;
  children?: ReactNode;
}

export function Panel({
  title,
  type,
  showCanvas,
  action,
  children,
}: PanelProps) {
  const classes = [styles.canvasContainer, styles[type]];
  if (showCanvas) classes.push(styles.hasContent);
  const containerClass = classes.join(' ');

  return (
    <div className={styles.panel}>
      <div className={styles.header}>
        <h2>{title}</h2>
        {action && (
          <button
            type="button"
            className={styles.actionButton}
            onClick={action.onClick}
            disabled={action.disabled}
            title={action.label}
          >
            {action.icon}
          </button>
        )}
      </div>
      <div className={containerClass}>{children}</div>
    </div>
  );
}
