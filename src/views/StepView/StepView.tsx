import type { RefObject } from 'react';
import type { TrackStep } from '../../components/TrackNav';
import { MapView } from '../MapView';

interface StepViewProps {
  step: TrackStep;
  qrText: string;
  onQrTextChange: (text: string) => void;
  seed: string;
  onSeedChange: (seed: string) => void;
  onSeedRegenerate: () => void;
  qrCanvasRef: RefObject<HTMLCanvasElement | null>;
  puzzleCanvasRef: RefObject<HTMLCanvasElement | null>;
  showCanvas: boolean;
  onDownloadPdf: () => void;
  canDownload: boolean;
}

export function StepView({ step, ...props }: StepViewProps) {
  switch (step) {
    case 'inner.map':
      return <MapView {...props} />;
    case 'outer.front':
      return <p>Front — TODO</p>;
    case 'outer.center':
      return <p>Center — TODO</p>;
    case 'outer.back':
      return <p>Back — TODO</p>;
    case 'download':
      return <p>Download — TODO</p>;
  }
}
