export class BlockChainModel {
  constructor() {
    this.address = "";
    this.balance = "";
    this.isConnected = false;
    this.listeners = [];
  }

  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  notify() {
    this.listeners.forEach(listener => listener({
      address: this.address,
      balance: this.balance,
      isConnected: this.isConnected
    }));
  }

  updateData(newData) {
    Object.assign(this, newData);
    this.notify();
  }

  reset() {
    this.address = "";
    this.balance = "";
    this.isConnected = false;
    this.notify();
  }
}