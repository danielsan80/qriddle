import { Panel } from '../../components/Panel';
import { PreviewStage } from '../../components/PreviewStage';
import { SvgTextEditor } from '../../components/SvgTextEditor';
import { useOuterTextBoxes } from '../useOuterTextBoxes';
import outerSvgUrl from '../../assets/outer/outer.svg?url';
import styles from './CenterView.module.css';

export function CenterView() {
  const [textBoxes, setTextBoxes] = useOuterTextBoxes('center');

  return (
    <Panel>
      <Panel.Title>Centro</Panel.Title>
      <Panel.Body>
        <PreviewStage>
          <SvgTextEditor
            viewBox="0 0 210 148.5"
            className={styles.preview}
            face="center"
            textBoxes={textBoxes}
            onTextBoxesChange={setTextBoxes}
          >
            <g transform="rotate(180, 105, 74.25)">
              <image href={outerSvgUrl} x="0" y="0" width="210" height="297" />
            </g>
            <line
              x1="105"
              y1="0"
              x2="105"
              y2="148.5"
              stroke="rgba(100,100,100,0.4)"
              strokeWidth="0.5"
              strokeDasharray="3 2"
              pointerEvents="none"
            />
          </SvgTextEditor>
        </PreviewStage>
      </Panel.Body>
    </Panel>
  );
}
