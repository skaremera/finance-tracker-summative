const form = document.getElementById("form");
const list = document.getElementById("list");
const totalDisplay = document.getElementById("total");

let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

function save() {
  localStorage.setItem("transactions", JSON.stringify(transactions));
}

function calculateTotal() {
  return transactions.reduce((sum, t) => sum + Number(t.amount), 0);
}

function render() {
  list.innerHTML = "";

  transactions.forEach((t) => {
    const li = document.createElement("li");

    li.innerHTML = `
      <div>
        <strong>${t.desc}</strong><br>
        ${t.category || ""} ${t.date || ""}
      </div>
      <div>
        ${t.amount}
        <button class="delete-btn" onclick="deleteTransaction(${t.id})">X</button>
      </div>
    `;

    list.appendChild(li);
  });

  totalDisplay.textContent = calculateTotal();
}

function deleteTransaction(id) {
  transactions = transactions.filter(t => t.id !== id);
  save();
  render();
}

form.addEventListener("submit", function (e) {
  e.preventDefault();

  const desc = document.getElementById("desc").value;
  const amount = document.getElementById("amount").value;
  const category = document.getElementById("category").value;
  const date = document.getElementById("date").value;

  if (!desc || !amount) return;

  transactions.push({
    id: Date.now(),
    desc,
    amount: Number(amount),
    category,
    date
  });

  save();
  render();
  form.reset();
});

render();