// React 组件

const ComponentHeader = ({ wallet }) => {
  
  return (
    <div>
      {wallet.state.address ? (
        <div>
          <p>钱包地址: {wallet.state.address}</p>
          <p>余额: {wallet.state.balance ? `${wallet.actions.formatBalance(wallet.state.balance)} ETH` : '加载中...'}</p>
        </div>
      ) : (
        <p>请连接MetaMask钱包</p>
      )}
      <div style={{ marginTop: '20px' }}>
        {wallet.state.isConnected ? (
          <button onClick={wallet.actions.disconnect} style={{ marginRight: '10px', backgroundColor: '#f44336', color: 'white', padding: '8px 16px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
            断开连接
          </button>
        ) : (
          <button onClick={wallet.actions.connectWallet} style={{ marginRight: '10px', backgroundColor: '#4CAF50', color: 'white', padding: '8px 16px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
            连接钱包
          </button>
        )}
      </div>
    </div>
  );
};

export default ComponentHeader;