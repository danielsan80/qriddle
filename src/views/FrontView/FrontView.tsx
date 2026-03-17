import { Panel } from '../../components/Panel';
import outerSvgUrl from '../../assets/outer/outer.svg?url';
import styles from './FrontView.module.css';

export function FrontView() {
  return (
    <Panel title="Fronte">
      <div
        className={styles.preview}
        style={{ backgroundImage: `url(${outerSvgUrl})` }}
      />
    </Panel>
  );
}
