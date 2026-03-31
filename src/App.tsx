import { MobileBlock } from './components/MobileBlock';
import { Layout } from './components/layout/Layout';
import { Sidebar } from './components/layout/Sidebar';
import {
  CardFaceNav,
  FACES,
  type Face,
} from './components/navigation/CardFaceNav';
import { TrackNav } from './components/navigation/TrackNav';
import { StepView } from './views/StepView';
import { useWizard } from './context/useWizard';
import './App.css';

function App() {
  const { trackStep, setTrackStep } = useWizard();
  const selectedFace = (FACES as readonly string[]).includes(trackStep)
    ? (trackStep as Face)
    : undefined;

  return (
    <>
      <MobileBlock />
      <Layout>
        <Sidebar>
          <CardFaceNav selected={selectedFace} onSelect={setTrackStep} />
          <TrackNav step={trackStep} onStep={setTrackStep} />
        </Sidebar>
        <main>
          <StepView />
        </main>
      </Layout>
    </>
  );
}

export default App;
