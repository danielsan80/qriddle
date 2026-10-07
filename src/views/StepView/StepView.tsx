import { useEffect } from 'react';
import { useWizard } from '../../context/useWizard';
import {
  TRACK_STEPS,
  type TrackStep,
} from '../../components/navigation/TrackNav';
import { ShipIcon } from '../../components/icon/ShipIcon';
import { IntroView } from '../IntroView';
import { MapView } from '../MapView';
import { FrontView } from '../FrontView';
import { CenterView } from '../CenterView';
import { BackView } from '../BackView';
import { DownloadView } from '../DownloadView';
import styles from './StepView.module.css';

function currentView(step: TrackStep) {
  switch (step) {
    case 'intro':
      return <IntroView />;
    case 'inner.map':
      return <MapView />;
    case 'outer.front':
      return <FrontView />;
    case 'outer.center':
      return <CenterView />;
    case 'outer.back':
      return <BackView />;
    case 'download':
      return <DownloadView />;
  }
}

type Step = (typeof TRACK_STEPS)[number];

interface StepNavBarProps {
  prevStep: Step | undefined;
  nextStep: Step | undefined;
  onStep: (step: TrackStep) => void;
}

function StepNavBar({ prevStep, nextStep, onStep }: StepNavBarProps) {
  if (!prevStep && !nextStep) return null;
  return (
    <div className={styles.stepNav}>
      {prevStep ? (
        <button
          type="button"
          className={styles.stepNavButton}
          onClick={() => onStep(prevStep.code)}
        >
          <ShipIcon mirrored /> Previous
        </button>
      ) : (
        <span className={styles.stepNavSpacer} />
      )}
      {nextStep && (
        <button
          type="button"
          className={styles.stepNavButton}
          onClick={() => onStep(nextStep.code)}
        >
          Next <ShipIcon />
        </button>
      )}
    </div>
  );
}

export function StepView() {
  const { trackStep, setTrackStep } = useWizard();
  const index = TRACK_STEPS.findIndex((s) => s.code === trackStep);

  useEffect(() => {
    document.querySelector('main')?.scrollTo(0, 0);
  }, [trackStep]);

  const stepNavBar = (
    <StepNavBar
      prevStep={TRACK_STEPS[index - 1]}
      nextStep={TRACK_STEPS[index + 1]}
      onStep={setTrackStep}
    />
  );

  return (
    <>
      {stepNavBar}
      {currentView(trackStep)}
      {stepNavBar}
    </>
  );
}
