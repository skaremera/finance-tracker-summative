const STORAGE_KEY = "transactions";

function loadFromStorage() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
}

function saveToStorage(transactions) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
}