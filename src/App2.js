import './index.css'
import ComponentHeader from './view/ComponentHeader';
import { useCounterViewModel } from './viewmodel/blockchainViewModel';



function App() {
  const wallet = useCounterViewModel();
  return (
    <div className="App">
      <ComponentHeader  wallet={wallet} />
    </div>
  );
}

export default App;