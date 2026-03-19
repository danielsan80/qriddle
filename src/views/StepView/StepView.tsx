import { useWizard } from '../../context/useWizard';
import { MapView } from '../MapView';
import { FrontView } from '../FrontView';
import { CenterView } from '../CenterView';

export function StepView() {
  const { trackStep } = useWizard();

  switch (trackStep) {
    case 'inner.map':
      return <MapView />;
    case 'outer.front':
      return <FrontView />;
    case 'outer.center':
      return <CenterView />;
    case 'outer.back':
      return <p>Back — TODO</p>;
    case 'download':
      return <p>Download — TODO</p>;
  }
}
