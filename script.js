// script.js
// ================================
// 1. GLOBAL VARIABLES
// ================================
let selectedCategory = null;

const dateInput = document.querySelector("input[type='date']");
const noteInput = document.querySelector("input[type='text']");
const priceInput = document.querySelector("input[type='number']");
const submitBtn = document.querySelector(".submit-btn");

// ================================
// 2. CATEGORY SECTION
// ================================
const categoryContainers = document.querySelectorAll(".body > div");

categoryContainers.forEach((container) => {
    container.addEventListener("click", () => {
        // Remover selección previa
        categoryContainers.forEach((c) => c.classList.remove("selected"));

        // Agregar clase de selección visual (puedes personalizar en CSS)
        container.classList.add("selected");

        // Guardar la categoría seleccionada
        selectedCategory = container.getAttribute("data-category");
    });
});

// ================================
// 3. SAVED NEW EXPENSE
// ================================
submitBtn.addEventListener("click", () => {
    const date = dateInput.value;
    const note = noteInput.value.trim();
    const price = parseFloat(priceInput.value);

    if (!date || !note || isNaN(price) || !selectedCategory) {
        alert(
            "Por favor completa todos los campos y selecciona una categoría."
        );
        return;
    }

    const newExpense = {
        id: Date.now().toString(),
        date,
        note,
        price,
        category: selectedCategory,
    };

    const expenses = JSON.parse(localStorage.getItem("expenses")) || [];
    expenses.push(newExpense);
    localStorage.setItem("expenses", JSON.stringify(expenses));

    clearForm();
    loadExpenses();
});

// ================================
// 4. DELETE EXPENSE
// ================================
function deleteExpense(id) {
    let expenses = JSON.parse(localStorage.getItem("expenses")) || [];
    expenses = expenses.filter((expense) => expense.id !== id);
    localStorage.setItem("expenses", JSON.stringify(expenses));
    loadExpenses();
}

// ================================
// 5. LOAD EXPENSES + TOTAL
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
      <p><strong>${expense.category}</strong> - ${expense.note} - $${expense.price} <br><small>${expense.date}</small></p>
      <button onclick="deleteExpense('${expense.id}')">Delete</button>
    `;
        listContainer.appendChild(div);
        total += parseFloat(expense.price);
    });

    totalContainer.innerHTML = `<p><strong>Total:</strong> $${total.toFixed(
        2
    )}</p>`;
}

// ================================
// 6. CLEAR FORM
// ================================
function clearForm() {
    dateInput.value = "";
    noteInput.value = "";
    priceInput.value = "";
    selectedCategory = "";
    document
        .querySelectorAll(".category")
        .forEach((item) => item.classList.remove("selected"));
}

// ================================
// 7. LOAD THE PAGE
// ================================
document.addEventListener("DOMContentLoaded", () => {
    loadExpenses();
});
document
    .getElementById("apply-filters")
    .addEventListener("click", applyFilters);

document.getElementById("reset-filters").addEventListener("click", () => {
    document.getElementById("filter-date").value = "";
    document.getElementById("filter-category").value = "";
    loadExpenses(); // Muestra todos otra vez
});

// ================================
//8. FILTER EXPENSES
// ================================
function applyFilters() {
    const selectedDate = document.getElementById("filter-date").value;
    const selectedCategory = document.getElementById("filter-category").value;
    const listContainer = document.getElementById("expense-list");
    const totalContainer = document.getElementById("total-expense");

    const expenses = JSON.parse(localStorage.getItem("expenses")) || [];

    const filteredExpenses = expenses.filter((exp) => {
        const matchesDate = selectedDate ? exp.date === selectedDate : true;
        const matchesCategory = selectedCategory
            ? exp.category === selectedCategory
            : true;
        return matchesDate && matchesCategory;
    });

    listContainer.innerHTML = "";
    let total = 0;

    filteredExpenses.forEach((expense) => {
        const div = document.createElement("div");
        div.classList.add("expense-item");
        div.innerHTML = `
        <p><strong>${expense.category}</strong> - ${expense.note} - $${expense.price} <br><small>${expense.date}</small></p>
        <button onclick="deleteExpense('${expense.id}')">Eliminar</button>
      `;
        listContainer.appendChild(div);
        total += parseFloat(expense.price);
    });

    totalContainer.innerHTML = `<p><strong>Total Filtrado:</strong> $${total.toFixed(
        2
    )}</p>`;
}
