import Web3 from 'web3';
import { useState, useEffect, useCallback } from 'react';
import { BlockChainModel } from '../request/BlockChainRequest';

let web3;
if (window.ethereum) {
  web3 = new Web3(window.ethereum);
}

export const isMetaMaskInstalled = () => !!window.ethereum;

export const useCounterViewModel = () => {
  const [model] = useState(() => new BlockChainModel());
  const [balance, setBalance] = useState(model.balance);
  const [address, setAddress] = useState(model.address);
  const [isConnected, setIsConnected] = useState(model.isConnected);
  const [isConnecting, setIsConnecting] = useState(false);

  const connectWallet = useCallback(async () => {
    if (isConnecting) return;
    
    setIsConnecting(true);
    try {
      await window.ethereum.request({
        method: 'wallet_requestPermissions',
        params: [{ eth_accounts: {} }],
      });
      const accounts = await web3.eth.getAccounts();
      if (accounts.length > 0) {
        const balance = await web3.eth.getBalance(accounts[0]);
        
        // 通过 Model 更新数据
        model.updateData({
          address: accounts[0],
          balance: balance,
          isConnected: true
        });
      }
    } catch (error) {
      console.error('Error connecting to wallet:', error);
    } finally {
      setIsConnecting(false);
    }
  }, [model, isConnecting]);

  const disconnect = useCallback(() => {
    model.updateData({
      address: '',
      balance: '',
      isConnected: false
    });
  }, [model]);

  const formatBalance = useCallback((balanceInWei) => {
    if (!web3 || !balanceInWei) return '0';
    return web3.utils.fromWei(balanceInWei, 'ether');
  }, []);

  useEffect(() => {
    return model.subscribe(newValue => {
      setBalance(newValue.balance);
      setAddress(newValue.address);
      setIsConnected(newValue.isConnected);
    });
  }, [model]);

  return {
    balance,
    address,
    isConnected,
    isConnecting,
    connectWallet,
    disconnect,
    formatBalance,
  };
};