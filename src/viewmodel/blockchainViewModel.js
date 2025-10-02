import Web3 from 'web3';
import { useState, useEffect, useCallback } from 'react';
import { BlockChainModel } from '../model/BlockChainModel';
import { STORAGE_KEYS } from '../constants/storage';

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

  // 从localStorage恢复连接状态
  const restoreConnectionState = useCallback(async () => {
    const savedAddress = localStorage.getItem(STORAGE_KEYS.WALLET_ADDRESS);
    const savedIsConnected = localStorage.getItem(STORAGE_KEYS.WALLET_CONNECTED) === 'true';

    if (savedAddress && savedIsConnected && window.ethereum) {
      try {
        // 检查MetaMask是否仍然连接到这个地址
        const accounts = await web3.eth.getAccounts();
        if (accounts.length > 0 && accounts[0].toLowerCase() === savedAddress.toLowerCase()) {
          const balance = await web3.eth.getBalance(accounts[0]);
          model.updateData({
            address: accounts[0],
            balance: balance,
            isConnected: true
          });
        } else {
          // 如果地址不匹配，清除保存的状态
          localStorage.removeItem(STORAGE_KEYS.WALLET_ADDRESS);
          localStorage.removeItem(STORAGE_KEYS.WALLET_CONNECTED);
        }
      } catch (error) {
        console.error('Error restoring wallet connection:', error);
        localStorage.removeItem(STORAGE_KEYS.WALLET_ADDRESS);
        localStorage.removeItem(STORAGE_KEYS.WALLET_CONNECTED);
      }
    }
  }, [model]);

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

        // 保存到localStorage
        localStorage.setItem(STORAGE_KEYS.WALLET_ADDRESS, accounts[0]);
        localStorage.setItem(STORAGE_KEYS.WALLET_CONNECTED, 'true');

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
    // 清除localStorage中的数据
    localStorage.removeItem(STORAGE_KEYS.WALLET_ADDRESS);
    localStorage.removeItem(STORAGE_KEYS.WALLET_CONNECTED);

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

  // 组件挂载时恢复连接状态
  useEffect(() => {
    restoreConnectionState();
  }, [restoreConnectionState]);

  // 监听MetaMask账户变化
  useEffect(() => {
    if (window.ethereum) {
      const handleAccountsChanged = (accounts) => {
        if (accounts.length === 0) {
          // 用户断开了所有账户
          disconnect();
        } else if (address && accounts[0].toLowerCase() !== address.toLowerCase()) {
          // 用户切换了账户，自动更新
          const updateAccount = async () => {
            try {
              const balance = await web3.eth.getBalance(accounts[0]);
              localStorage.setItem(STORAGE_KEYS.WALLET_ADDRESS, accounts[0]);
              model.updateData({
                address: accounts[0],
                balance: balance,
                isConnected: true
              });
            } catch (error) {
              console.error('Error updating account:', error);
            }
          };
          updateAccount();
        }
      };

      window.ethereum.on('accountsChanged', handleAccountsChanged);

      return () => {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      };
    }
  }, [address, disconnect, model]);

  return {
    state: { balance, address, isConnected, isConnecting },
    actions: { connectWallet, disconnect, formatBalance }
  };
};