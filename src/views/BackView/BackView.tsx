import { Panel } from '../../components/Panel';
import { SvgTextEditor } from '../../components/SvgTextEditor';
import outerSvgUrl from '../../assets/outer/outer.svg?url';
import styles from './BackView.module.css';

export function BackView() {
  return (
    <Panel title="Retro">
      <SvgTextEditor viewBox="0 148.5 105 148.5" className={styles.preview}>
        <image href={outerSvgUrl} x="0" y="0" width="210" height="297" />
      </SvgTextEditor>
    </Panel>
  );
}
