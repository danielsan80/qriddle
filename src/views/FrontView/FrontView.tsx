import { useState } from 'react';
import { jsPDF } from 'jspdf';
import { Panel } from '../../components/Panel';
import outerSvgUrl from '../../assets/outer/outer.svg?url';
import styles from './FrontView.module.css';

const A4_W_MM = 210;
const A4_H_MM = 297;
const A4_PX_W = 2480;
const A4_PX_H = 3508;
const FONT_NAME = 'Edwardian Script ITC';

// Spike: canvas composition + jsPDF
async function downloadFrontPdf(title: string) {
  const pxPerMm = A4_PX_W / A4_W_MM;

  await document.fonts.load(`${8 * pxPerMm}px '${FONT_NAME}'`);

  const canvas = document.createElement('canvas');
  canvas.width = A4_PX_W;
  canvas.height = A4_PX_H;
  const ctx = canvas.getContext('2d')!;

  const bg = new Image();
  await new Promise<void>((resolve, reject) => {
    bg.onload = () => resolve();
    bg.onerror = reject;
    bg.src = outerSvgUrl;
  });
  ctx.drawImage(bg, 0, 0, A4_PX_W, A4_PX_H);

  ctx.font = `${8 * pxPerMm}px '${FONT_NAME}'`;
  ctx.fillStyle = '#333333';
  ctx.textAlign = 'center';
  ctx.fillText(title, 166 * pxPerMm, 167 * pxPerMm);

  const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  pdf.addImage(canvas, 'PNG', 0, 0, A4_W_MM, A4_H_MM);
  pdf.save('front.pdf');
}

export function FrontView() {
  const [title, setTitle] = useState('Buon Compleanno');

  return (
    <>
      <div className={styles.controls}>
        <div className={styles.inputGroup}>
          <label htmlFor="front-title">Titolo</label>
          <input
            id="front-title"
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
          />
        </div>
      </div>
      <Panel
        title="Fronte"
        action={{
          icon: '↓',
          label: 'Scarica PDF',
          onClick: () => void downloadFrontPdf(title),
        }}
      >
        <svg viewBox="105 148.5 105 148.5" className={styles.preview}>
          <image href={outerSvgUrl} x="0" y="0" width="210" height="297" />
          <text
            x="166"
            y="167"
            textAnchor="middle"
            fontSize="8"
            fontFamily="'Edwardian Script ITC'"
            fill="#333"
          >
            {title}
          </text>
        </svg>
      </Panel>
    </>
  );
}
