import { useWizard } from '../../context/useWizard';
import { IntroView } from '../IntroView';
import { MapView } from '../MapView';
import { FrontView } from '../FrontView';
import { CenterView } from '../CenterView';
import { BackView } from '../BackView';
import { DownloadView } from '../DownloadView';

export function StepView() {
  const { trackStep } = useWizard();

  switch (trackStep) {
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
