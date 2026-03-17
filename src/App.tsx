import { Layout } from './components/Layout';
import { Sidebar } from './components/Sidebar';
import { CardFaceNav } from './components/CardFaceNav';
import { TrackNav } from './components/TrackNav';
import { StepView } from './views/StepView';
import { useWizard } from './context/useWizard';
import './App.css';

function App() {
  const { trackStep, setTrackStep } = useWizard();
  const selectedFace = trackStep !== 'download' ? trackStep : undefined;

  return (
    <Layout>
      <Sidebar>
        <CardFaceNav selected={selectedFace} onSelect={setTrackStep} />
        <TrackNav step={trackStep} onStep={setTrackStep} />
      </Sidebar>
      <main>
        <StepView />
      </main>
    </Layout>
  );
}

export default App;
