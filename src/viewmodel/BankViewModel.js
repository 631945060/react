import { useState, useEffect, useCallback } from 'react';
import Web3 from 'web3';
import { BankModel } from '../model/BankModel';
import { BANK_ABI } from '../constants/bankABI';
import { BANK_ADDRESS } from '../constants/bankAddress';

let web3;
if (window.ethereum) {
  web3 = new Web3(window.ethereum);
}

const bankContract = new web3.eth.Contract(BANK_ABI, BANK_ADDRESS);

export const useBankViewModel = (wallet) => {
  const [bankModel, setBankModel] = useState(new BankModel());
  const [depositValue, setDepositValue] = useState('');

  const handleDepositChange = (e) => {
    setDepositValue(e.target.value);
  };

  const getBalances = useCallback(async () => {
    if (wallet && wallet.state.address) {
      const userBalance = await bankContract.methods.getDepositBalance(wallet.state.address).call();
      const bankTotalAssets = await bankContract.methods.getTotalBalance().call();
      setBankModel(prevModel => ({
        ...prevModel,
        userBalance: web3.utils.fromWei(userBalance, 'ether'),
        bankTotalAssets: web3.utils.fromWei(bankTotalAssets, 'ether'),
      }));
    }
  }, [wallet]);

  const deposit = async () => {
    if (wallet && wallet.state.address && depositValue) {
      const amountInWei = web3.utils.toWei(depositValue, 'ether');
      await bankContract.methods.deposit(amountInWei).send({ from: wallet.state.address });
      getBalances();
    }
  };

  const withdraw = async () => {
    if (wallet && wallet.state.address && depositValue) {
      const amountInWei = web3.utils.toWei(depositValue, 'ether');
      await bankContract.methods.withdraw(amountInWei).send({ from: wallet.state.address });
      getBalances();
    }
  };

  useEffect(() => {
    getBalances();
  }, [getBalances]);

  return {
    depositValue,
    handleDepositChange,
    deposit,
    withdraw,
    userBalance: bankModel.userBalance,
    bankTotalAssets: bankModel.bankTotalAssets,
  };
};