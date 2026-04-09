import { useEffect } from 'react';
import { useWizard } from '../../context/useWizard';
import { TRACK_STEPS } from '../../components/navigation/TrackNav';
import { ShipIcon } from '../../components/icon/ShipIcon';
import { IntroView } from '../IntroView';
import { MapView } from '../MapView';
import { FrontView } from '../FrontView';
import { CenterView } from '../CenterView';
import { BackView } from '../BackView';
import { DownloadView } from '../DownloadView';
import styles from './StepView.module.css';

function currentView(step: ReturnType<typeof useWizard>['trackStep']) {
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

interface StepNavBarProps {
  prevStep: (typeof TRACK_STEPS)[number] | undefined;
  nextStep: (typeof TRACK_STEPS)[number] | undefined;
  onNext: () => void;
}

function StepNavBar({ prevStep, nextStep, onNext }: StepNavBarProps) {
  if (!prevStep && !nextStep) return null;
  return (
    <div className={styles.stepNav}>
      {prevStep ? (
        <button
          type="button"
          className={styles.stepNavButton}
          onClick={() => history.back()}
        >
          <ShipIcon mirrored /> Previous
        </button>
      ) : (
        <span className={styles.stepNavSpacer} />
      )}
      {nextStep && (
        <button type="button" className={styles.stepNavButton} onClick={onNext}>
          Next <ShipIcon />
        </button>
      )}
    </div>
  );
}

export function StepView() {
  const { trackStep, setTrackStep } = useWizard();
  const index = TRACK_STEPS.findIndex((s) => s.code === trackStep);
  const prevStep = TRACK_STEPS[index - 1];
  const nextStep = TRACK_STEPS[index + 1];

  useEffect(() => {
    document.querySelector('main')?.scrollTo(0, 0);
  }, [trackStep]);

  function handleNext() {
    setTrackStep(nextStep!.code);
  }

  return (
    <>
      <StepNavBar prevStep={prevStep} nextStep={nextStep} onNext={handleNext} />
      {currentView(trackStep)}
      <StepNavBar prevStep={prevStep} nextStep={nextStep} onNext={handleNext} />
    </>
  );
}
