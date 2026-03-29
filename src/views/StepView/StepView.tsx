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

export function StepView() {
  const { trackStep, setTrackStep } = useWizard();
  const index = TRACK_STEPS.findIndex((s) => s.code === trackStep);
  const nextStep = TRACK_STEPS[index + 1];

  return (
    <>
      {nextStep && (
        <div className={styles.next}>
          <button
            type="button"
            className={styles.nextButton}
            onClick={() => setTrackStep(nextStep.code)}
          >
            Next <ShipIcon />
          </button>
        </div>
      )}
      {currentView(trackStep)}
    </>
  );
}
