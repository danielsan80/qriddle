import { useEffect } from 'react';
import { useWizard } from '../../context/useWizard';
import { STEPS, type Step, type WorkStep } from '../../context/steps';
import { ShipIcon } from '../../components/icon/ShipIcon';
import { MapView } from '../MapView';
import { FrontView } from '../FrontView';
import { CenterView } from '../CenterView';
import { BackView } from '../BackView';
import { DownloadView } from '../DownloadView';
import styles from './StepView.module.css';

function currentView(step: WorkStep) {
  switch (step) {
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
  prevStep: Step;
  nextStep: Step | undefined;
  onStep: (step: Step) => void;
}

function StepNavBar({ prevStep, nextStep, onStep }: StepNavBarProps) {
  return (
    <div className={styles.stepNav}>
      <button
        type="button"
        className={styles.stepNavButton}
        onClick={() => onStep(prevStep)}
      >
        <ShipIcon mirrored /> Previous
      </button>
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

interface StepViewProps {
  step: WorkStep;
}

export function StepView({ step }: StepViewProps) {
  const { setStep } = useWizard();
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
