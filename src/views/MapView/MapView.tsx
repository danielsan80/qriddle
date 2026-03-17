import type { RefObject } from 'react';
import { Controls } from '../../components/Controls';
import { Workspace } from '../../components/Workspace';

interface MapViewProps {
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

export function MapView({
  qrText,
  onQrTextChange,
  seed,
  onSeedChange,
  onSeedRegenerate,
  qrCanvasRef,
  puzzleCanvasRef,
  showCanvas,
  onDownloadPdf,
  canDownload,
}: MapViewProps) {
  return (
    <>
      <Controls
        qrText={qrText}
        onQrTextChange={onQrTextChange}
        seed={seed}
        onSeedChange={onSeedChange}
        onSeedRegenerate={onSeedRegenerate}
      />
      <Workspace
        qrCanvasRef={qrCanvasRef}
        puzzleCanvasRef={puzzleCanvasRef}
        showCanvas={showCanvas}
        onDownloadPdf={onDownloadPdf}
        canDownload={canDownload}
      />
    </>
  );
}
