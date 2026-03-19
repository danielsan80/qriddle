import { Panel } from '../../components/Panel';
import { SvgTextEditor } from '../../components/SvgTextEditor';
import { useOuterTextBoxes } from '../useOuterTextBoxes';
import outerSvgUrl from '../../assets/outer/outer.svg?url';
import styles from './FrontView.module.css';

export function FrontView() {
  const [textBoxes, setTextBoxes] = useOuterTextBoxes('front');

  return (
    <Panel title="Fronte">
      <SvgTextEditor
        viewBox="105 148.5 105 148.5"
        className={styles.preview}
        face="front"
        textBoxes={textBoxes}
        onTextBoxesChange={setTextBoxes}
      >
        <image href={outerSvgUrl} x="0" y="0" width="210" height="297" />
      </SvgTextEditor>
    </Panel>
  );
}
