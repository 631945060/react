// React 组件
import {
  useCounterViewModel,
} from '../viewmodel/blockchainViewModel';

const ComponentHeader = () => {
const { address, balance,isConnected ,connectWallet,disconnect,formatBalance} = useCounterViewModel();
  return (
    <div>
      <h1>React Blockchain Connection Example</h1>
      {address ? (
        <div>
          <p>钱包地址: {address}</p>
          <p>余额: {balance ? `${formatBalance(balance)} ETH` : '加载中...'}</p>
        </div>
      ) : (
        <p>请连接MetaMask钱包</p>
      )}
      <div style={{ marginTop: '20px' }}>
        {isConnected ? (
          <button onClick={disconnect} style={{ marginRight: '10px', backgroundColor: '#f44336', color: 'white', padding: '8px 16px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
            断开连接
          </button>
        ) : (
          <button onClick={connectWallet} style={{ marginRight: '10px', backgroundColor: '#4CAF50', color: 'white', padding: '8px 16px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
            连接钱包
          </button>
        )}
      </div>
    </div>
  );
};

export default ComponentHeader;