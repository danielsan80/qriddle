import { MobileBlock } from './components/MobileBlock';
import { CopyLink } from './components/CopyLink';
import { Layout } from './components/layout/Layout';
import { Sidebar } from './components/layout/Sidebar';
import {
  CardFaceNav,
  FACES,
  type Face,
} from './components/navigation/CardFaceNav';
import { TrackNav } from './components/navigation/TrackNav';
import { StepView } from './views/StepView';
import { IntroView } from './views/IntroView';
import { useWizard } from './context/useWizard';
import './App.css';

function App() {
  const { step, setStep } = useWizard();
  const selectedFace = (FACES as readonly string[]).includes(step)
    ? (step as Face)
    : undefined;

  return (
    <>
      <MobileBlock />
      {step === 'intro' ? (
        <main>
          <IntroView />
        </main>
      ) : (
        <Layout>
          <Sidebar>
            <CardFaceNav selected={selectedFace} onSelect={setStep} />
            <TrackNav step={step} onStep={setStep} />
            <CopyLink />
          </Sidebar>
          <main>
            <StepView step={step} />
          </main>
        </Layout>
      )}
    </>
  );
}

export default App;
