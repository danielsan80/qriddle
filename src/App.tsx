import { Layout } from './components/Layout';
import { Header } from './components/Header';
import { Controls } from './components/Controls';
import { Workspace } from './components/Workspace';
import './App.css';

function App() {
  return (
    <Layout>
      <Header />
      <main>
        <Controls />
        <Workspace />
      </main>
    </Layout>
  );
}

export default App;
