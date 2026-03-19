import { useEffect, useState } from 'react';
import { Panel } from '../../components/Panel';
import { SvgTextEditor } from '../../components/SvgTextEditor';
import type { TextBox } from '../../components/SvgTextEditor';
import { readState, mergeState } from '../../lib/browser/urlState';
import outerSvgUrl from '../../assets/outer/outer.svg?url';
import styles from './FrontView.module.css';

interface FrontState {
  frontTextBoxes: TextBox[];
}

function getInitialState(): FrontState {
  const state = readState<Partial<FrontState>>({});
  return { frontTextBoxes: state.frontTextBoxes ?? [] };
}

export function FrontView() {
  const [initial] = useState(getInitialState);
  const [textBoxes, setTextBoxes] = useState(initial.frontTextBoxes);

  useEffect(() => {
    mergeState({ frontTextBoxes: textBoxes });
  }, [textBoxes]);

  return (
    <Panel title="Fronte">
      <SvgTextEditor
        viewBox="105 148.5 105 148.5"
        className={styles.preview}
        textBoxes={textBoxes}
        onTextBoxesChange={setTextBoxes}
      >
        <image href={outerSvgUrl} x="0" y="0" width="210" height="297" />
      </SvgTextEditor>
    </Panel>
  );
}
