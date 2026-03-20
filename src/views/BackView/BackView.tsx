import { useEffect, useState } from 'react';
import { Panel } from '../../components/Panel';
import { PreviewStage } from '../../components/PreviewStage';
import { SvgTextEditor } from '../../components/SvgTextEditor';
import { useOuterTextBoxes } from '../useOuterTextBoxes';
import { getQRDataUrl } from '../../lib/util';
import { config } from '../../lib/config';
import outerSvgUrl from '../../assets/outer/outer.svg?url';
import styles from './BackView.module.css';

export function BackView() {
  const [textBoxes, setTextBoxes] = useOuterTextBoxes('back');
  const [creditsQrUrl, setCreditsQrUrl] = useState<string | null>(null);

  useEffect(() => {
    void getQRDataUrl(config.siteUrl, config.pdf.textColor, '#ffffff00').then(
      setCreditsQrUrl,
    );
  }, []);

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
            {creditsQrUrl && (
              <>
                <image
                  href={creditsQrUrl}
                  x={config.creditsQr.centerX - config.creditsQr.sizeMm / 2}
                  y={config.creditsQr.bottomY - config.creditsQr.sizeMm}
                  width={config.creditsQr.sizeMm}
                  height={config.creditsQr.sizeMm}
                />
                <text
                  x={config.creditsQr.centerX}
                  y={config.creditsQr.textY - 1}
                  textAnchor="middle"
                  fontSize="2.5"
                  fill={config.pdf.textColor}
                  fontFamily="serif"
                >
                  {config.siteUrl}
                </text>
              </>
            )}
          </SvgTextEditor>
        </PreviewStage>
      </Panel.Body>
    </Panel>
  );
}
