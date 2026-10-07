import { useEffect } from 'react';
import { useWizard } from '../../context/useWizard';
import { STEPS, type Step } from '../../context/steps';
import { ShipIcon } from '../../components/icon/ShipIcon';
import { IntroView } from '../IntroView';
import { MapView } from '../MapView';
import { FrontView } from '../FrontView';
import { CenterView } from '../CenterView';
import { BackView } from '../BackView';
import { DownloadView } from '../DownloadView';
import styles from './StepView.module.css';

function currentView(step: Step) {
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
  prevStep: Step | undefined;
  nextStep: Step | undefined;
  onStep: (step: Step) => void;
}

function StepNavBar({ prevStep, nextStep, onStep }: StepNavBarProps) {
  if (!prevStep && !nextStep) return null;
  return (
    <div className={styles.stepNav}>
      {prevStep ? (
        <button
          type="button"
          className={styles.stepNavButton}
          onClick={() => onStep(prevStep)}
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
          onClick={() => onStep(nextStep)}
        >
          Next <ShipIcon />
        </button>
      )}
    </div>
  );
}

export function StepView() {
  const { step, setStep } = useWizard();
  const index = STEPS.indexOf(step);

  useEffect(() => {
    document.querySelector('main')?.scrollTo(0, 0);
  }, [step]);

  const stepNavBar = (
    <StepNavBar
      prevStep={STEPS[index - 1]}
      nextStep={STEPS[index + 1]}
      onStep={setStep}
    />
  );

  return (
    <>
      {stepNavBar}
      {currentView(step)}
      {stepNavBar}
    </>
  );
}
