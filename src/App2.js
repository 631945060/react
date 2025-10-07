import './index.css';
import ComponentHeader from './view/ComponentHeader';
import { useCounterViewModel } from './viewmodel/blockchainViewModel';
import BankView from './view/BankView';
import { useBankViewModel } from './viewmodel/BankViewModel';

function App() {
  const wallet = useCounterViewModel();
  const bank = useBankViewModel(wallet);

  return (
    <div className="App">
      <ComponentHeader wallet={wallet} />
      <BankView bank={bank}  wallet={wallet} />
    </div>
  );
}

export default App;