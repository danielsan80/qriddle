import { useWizard } from '../../context/useWizard';
import { MapView } from '../MapView';
import { FrontView } from '../FrontView';

export function StepView() {
  const { trackStep } = useWizard();

  switch (trackStep) {
    case 'inner.map':
      return <MapView />;
    case 'outer.front':
      return <FrontView />;
    case 'outer.center':
      return <p>Center — TODO</p>;
    case 'outer.back':
      return <p>Back — TODO</p>;
    case 'download':
      return <p>Download — TODO</p>;
  }
}
