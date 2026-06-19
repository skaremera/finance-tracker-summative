const form = document.getElementById("form");
const list = document.getElementById("list");
const totalDisplay = document.getElementById("total");
const searchInput = document.getElementById("search");
const sortSelect = document.getElementById("sort");

let transactions = JSON.parse(localStorage.getItem("transactions")) || [];
let searchText = "";
let editId = null;

const BUDGET_LIMIT = 500;

// Regex (M3)
const descRegex = /^[a-zA-Z0-9\s]{3,50}$/;
const amountRegex = /^\d+(\.\d{1,2})?$/;
const categoryRegex = /^[a-zA-Z\s]{2,20}$/;
const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

function save() {
  localStorage.setItem("transactions", JSON.stringify(transactions));
}

function compileRegex(input) {
  try {
    return input ? new RegExp(input, "i") : null;
  } catch {
    return null;
  }
}

function highlight(text, re) {
  if (!re) return text;
  return text.replace(re, m => `<mark>${m}</mark>`);
}

function updateTotal() {
  const income = transactions.filter(t => t.amount > 0).reduce((a, b) => a + b.amount, 0);
  const expense = transactions.filter(t => t.amount < 0).reduce((a, b) => a + b.amount, 0);
  const balance = income + expense;

  let html = `
    Income: ${income}<br>
    Expense: ${Math.abs(expense)}<br>
    Balance: ${balance}
  `;

  if (Math.abs(expense) > BUDGET_LIMIT) {
    html += `<p style="color:red;font-weight:bold;">⚠ Budget exceeded!</p>`;
  }

  totalDisplay.innerHTML = html;
}

function processData() {
  let data = [...transactions];

  if (sortSelect.value === "amount") {
    data.sort((a, b) => b.amount - a.amount);
  } else if (sortSelect.value === "category") {
    data.sort((a, b) => a.category.localeCompare(b.category));
  } else {
    data.sort((a, b) => new Date(b.date) - new Date(a.date));
  }

  const re = compileRegex(searchText);
  if (re) {
    data = data.filter(t =>
      re.test(t.desc) || re.test(t.category) || re.test(t.date)
    );
  }

  return data;
}

function render() {
  list.innerHTML = "";

  const data = processData();
  const re = compileRegex(searchText);

  data.forEach(t => {
    const li = document.createElement("li");

    li.innerHTML = `
      <span>
        ${t.amount > 0 ? "INCOME" : "EXPENSE"} |
        ${highlight(t.desc, re)} |
        ${highlight(t.category, re)} |
        ${highlight(t.date, re)} |
        ${t.amount}
      </span>
      <div>
        <button class="edit-btn">Edit</button>
        <button class="delete-btn">X</button>
      </div>
    `;

    li.querySelector(".delete-btn").onclick = () => {
      transactions = transactions.filter(x => x.id !== t.id);
      save();
      render();
    };

    li.querySelector(".edit-btn").onclick = () => {
      document.getElementById("desc").value = t.desc;
      document.getElementById("amount").value = Math.abs(t.amount);
      document.getElementById("category").value = t.category;
      document.getElementById("date").value = t.date;
      editId = t.id;
    };

    list.appendChild(li);
  });

  updateTotal();
}

form.addEventListener("submit", e => {
  e.preventDefault();

  const descInput = document.getElementById("desc");
  const amountInput = document.getElementById("amount");
  const categoryInput = document.getElementById("category");
  const dateInput = document.getElementById("date");

  const obj = {
    id: Date.now(),
    desc: descInput.value,
    amount: Number(amountInput.value),
    category: categoryInput.value,
    date: dateInput.value
  };

  transactions.push(obj);
  save();
  render();
  form.reset();
});
