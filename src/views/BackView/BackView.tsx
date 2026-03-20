import { Panel } from '../../components/Panel';
import { PreviewStage } from '../../components/PreviewStage';
import { SvgTextEditor } from '../../components/SvgTextEditor';
import { useOuterTextBoxes } from '../useOuterTextBoxes';
import outerSvgUrl from '../../assets/outer/outer.svg?url';
import styles from './BackView.module.css';

export function BackView() {
  const [textBoxes, setTextBoxes] = useOuterTextBoxes('back');

  return (
    <Panel>
      <Panel.Title>Back</Panel.Title>
      <Panel.Body>
        <PreviewStage>
          <SvgTextEditor
            viewBox="0 148.5 105 148.5"
            className={styles.preview}
            face="back"
            textBoxes={textBoxes}
            onTextBoxesChange={setTextBoxes}
          >
            <image href={outerSvgUrl} x="0" y="0" width="210" height="297" />
          </SvgTextEditor>
        </PreviewStage>
      </Panel.Body>
    </Panel>
  );
}
