// script.js
// ================================
// 1. VARIABLES GLOBALES
// ================================
let selectedCategory = null;

const dateInput = document.querySelector("input[type='date']");
const noteInput = document.querySelector("input[type='text']");
const amountInput = document.querySelector("input[type='number']");
const submitBtn = document.querySelector(".submit-btn");

// ================================
// 2. SELECCIÓN DE CATEGORÍA
// ================================
const categoryContainers = document.querySelectorAll('.body > div');

categoryContainers.forEach(container => {
    container.addEventListener('click', () => {
        // Remover selección previa
        categoryContainers.forEach(c => c.classList.remove('selected'));

        // Agregar clase de selección visual (puedes personalizar en CSS)
        container.classList.add('selected');

        // Guardar la categoría seleccionada
        selectedCategory = container.getAttribute('data-category');
    });
});

// ================================
// 3. GUARDAR NUEVO GASTO
// ================================
submitBtn.addEventListener("click", () => {
  const date = dateInput.value;
  const note = noteInput.value.trim();
  const amount = parseFloat(amountInput.value);

  if (!date || !note || isNaN(amount) || !selectedCategory) {
    alert("Por favor completa todos los campos y selecciona una categoría.");
    return;
  }

  const newExpense = {
    id: Date.now().toString(),
    date,
    note,
    amount,
    category: selectedCategory,
  };

  const expenses = JSON.parse(localStorage.getItem("expenses")) || [];
  expenses.push(newExpense);
  localStorage.setItem("expenses", JSON.stringify(expenses));

  clearForm();
  loadExpenses();
});

// ================================
// 4. BORRAR GASTO
// ================================
function deleteExpense(id) {
  let expenses = JSON.parse(localStorage.getItem("expenses")) || [];
  expenses = expenses.filter((expense) => expense.id !== id);
  localStorage.setItem("expenses", JSON.stringify(expenses));
  loadExpenses();
}

// ================================
// 5. CARGAR GASTOS + TOTAL
// ================================
function loadExpenses() {
  const expenses = JSON.parse(localStorage.getItem("expenses")) || [];
  const listContainer = document.getElementById("expense-list");
  const totalContainer = document.getElementById("total-expense");
  listContainer.innerHTML = "";

  let total = 0;

  expenses.forEach((expense) => {
    const div = document.createElement("div");
    div.classList.add("expense-item");
    div.innerHTML = `
      <p><strong>${expense.category}</strong> - ${expense.note} - $${expense.amount} <br><small>${expense.date}</small></p>
      <button onclick="deleteExpense('${expense.id}')">Eliminar</button>
    `;
    listContainer.appendChild(div);
    total += parseFloat(expense.amount);
  });

  totalContainer.innerHTML = `<p><strong>Total Gastado:</strong> $${total.toFixed(2)}</p>`;
}

// ================================
// 6. LIMPIAR FORMULARIO
// ================================
function clearForm() {
  dateInput.value = "";
  noteInput.value = "";
  amountInput.value = "";
  selectedCategory = "";
  document.querySelectorAll(".category").forEach((item) =>
    item.classList.remove("selected")
  );
}

// ================================
// 7. AL CARGAR LA PÁGINA
// ================================
document.addEventListener("DOMContentLoaded", () => {
  loadExpenses();
});
