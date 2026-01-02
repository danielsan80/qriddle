import { useRef, useState } from 'react';
import { Layout } from './components/Layout';
import { Header } from './components/Header';
import { Controls } from './components/Controls';
import { Workspace } from './components/Workspace';
import { renderQRToCanvas } from './lib/qr';
import './App.css';

function App() {
  const [qrText, setQrText] = useState('https://example.com');
  const qrCanvasRef = useRef<HTMLCanvasElement>(null);

  const handleGenerate = async () => {
    if (!qrText || !qrCanvasRef.current) return;
    await renderQRToCanvas(qrCanvasRef.current, qrText);
  };

  return (
    <Layout>
      <Header />
      <main>
        <Controls
          qrText={qrText}
          onQrTextChange={setQrText}
          onGenerate={handleGenerate}
        />
        <Workspace qrCanvasRef={qrCanvasRef} />
      </main>
    </Layout>
  );
}

export default App;
