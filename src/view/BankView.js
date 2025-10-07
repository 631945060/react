import React from 'react';

const BankView = ({ bank, wallet }) => {


  return (
    <div className="box">
      <h2>银行</h2>
      <div className="balance-info">
        <p>你的银行存款: {bank.userBalance}</p>
        <p>银行总资产: {bank.bankTotalAssets}</p>
      </div>
      <div className="input-container">
        <input
          type="text"
          value={bank.depositValue}
          onChange={bank.handleDepositChange}
          placeholder="输入存款金额"
        />
      </div>
      <div className="button-group">
        <button onClick={bank.deposit}>存款</button>
        <button onClick={bank.withdraw}>取款</button>
      </div>
    </div>
  );
};

export default BankView;