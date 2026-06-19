let state = {
  transactions: []
};

// Load state
function setState(data) {
  state.transactions = data;
}

// Get state
function getState() {
  return state;
}

// Add transaction
function addTransaction(transaction) {
  state.transactions.push(transaction);
}

// Remove transaction
function removeTransaction(index) {
  state.transactions.splice(index, 1);
}