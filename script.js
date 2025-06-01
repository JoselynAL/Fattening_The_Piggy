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
// 2. CATEGORY SECTION EXPENSE
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
if (submitBtn) {
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
}

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

    if (listContainer && totalContainer) {
        listContainer.innerHTML = "";

        let total = 0;

        expenses.forEach((expense) => {
            const li = document.createElement("li");
            li.classList.add("expense-item");
            const p = document.createElement("p");
            p.innerHTML = `<strong>${expense.category}</strong> - ${expense.note} - $${expense.price} <br><small>${expense.date}</small>`;

            const button = document.createElement("button");
            button.textContent = "Delete";
            button.addEventListener("click", () => {
                deleteExpense(expense.id);
            });

            li.appendChild(p);
            li.appendChild(button);
            listContainer.appendChild(li);

            total += parseFloat(expense.price);
        });

        totalContainer.innerHTML = `<p><strong>Total:</strong> $${total.toFixed(
            2
        )}</p>`;
    }

    const dataObj = {
        food: null,
        transportation: null,
        outings: null,
        household: null,
        clothes: null,
        skincare: null,
        health: null,
        education: null,
        electricitybill: null,
        internet: null,
        rent: null,
    };

    expenses.forEach((expense) => {
        if (dataObj[expense.category] != null) {
            dataObj[expense.category] += expense.price;
        } else {
            dataObj[expense.category] = 0;
            dataObj[expense.category] += expense.price;
        }
    });

    const labels = [];
    const values = [];

    for (let key in dataObj) {
        if (dataObj[key]) {
            labels.push(key);
            values.push(dataObj[key]);
        }
    }
    const ctx = document.getElementById("myChart");

    window.expenseChart = new Chart(ctx, {
        type: "pie",
        data: {
            labels: labels,
            datasets: [
                {
                    label: "Personal Expense",
                    data: values,
                    backgroundColor: [
                        "#FF6384",
                        "#36A2EB",
                        "#FFCE56",
                        "#66BB6A",
                        "#BA68C8",
                        "#FFA726",
                        "#26C6DA",
                        "#D4E157",
                        "#FF7043",
                        "#8D6E63",
                        "#42A5F5",
                    ],
                },
            ],
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: "Personal Expense",
                },
            },
        },
    });
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

const applyFilterButton = document.getElementById("apply-filters");
if (applyFilterButton) {
    applyFilterButton.addEventListener("click", applyFilters);
}

const resetFilterButton = document.getElementById("reset-filters");
if (resetFilterButton) {
    resetFilterButton.addEventListener("click", () => {
        document.getElementById("filter-date").value = "";
        document.getElementById("filter-category").value = "";
        loadExpenses(); // Muestra todos otra vez
    });
}

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
        const li = document.createElement("li");
        li.classList.add("expense-item");
        const p = document.createElement("p");
        p.innerHTML = `<strong>${expense.category}</strong> - ${expense.note} - $${expense.price} <br><small>${expense.date}</small>`;

        const button = document.createElement("button");
        button.textContent = "Delete";
        button.addEventListener("click", () => {
            deleteExpense(expense.id);
        });

        li.appendChild(p);
        li.appendChild(button);
        listContainer.appendChild(li);

        total += parseFloat(expense.price);
    });

    totalContainer.innerHTML = `<p><strong>Total Filtrado:</strong> $${total.toFixed(
        2
    )}</p>`;
}

// ================================
// 9. CATEGORY SECTION INCOME
// ================================
let selectedIncomeCategory = null;

// Selección de categoría
document.querySelectorAll(".category").forEach((el) => {
  el.addEventListener("click", () => {
    selectedIncomeCategory = el.dataset.category;

    // Feedback visual
    document.querySelectorAll(".category").forEach((item) =>
      item.classList.remove("selected")
    );
    el.classList.add("selected");
  });
});

// Función para guardar ingresos
document.getElementById("submit-income").addEventListener("click", () => {
  const date = document.getElementById("income-date").value;
  const note = document.getElementById("income-note").value.trim();
  const amount = parseFloat(document.getElementById("income-amount").value);

  if (!date || !note || isNaN(amount) || !selectedIncomeCategory) {
    alert("Por favor completa todos los campos y selecciona una categoría.");
    return;
  }

  const income = {
    id: Date.now(),
    date,
    note,
    amount,
    category: selectedIncomeCategory,
  };

  const existing = JSON.parse(localStorage.getItem("incomes")) || [];
  existing.push(income);
  localStorage.setItem("incomes", JSON.stringify(existing));

  alert("Ingreso guardado correctamente.");
  clearIncomeForm();
  loadIncomes();
});

// Limpiar campos
function clearIncomeForm() {
  document.getElementById("income-date").value = "";
  document.getElementById("income-note").value = "";
  document.getElementById("income-amount").value = "";
  selectedIncomeCategory = null;
  document.querySelectorAll(".category").forEach((item) =>
    item.classList.remove("selected")
  );
}

// Mostrar ingresos en pantalla
function loadIncomes() {
  const incomes = JSON.parse(localStorage.getItem("incomes")) || [];
  const listContainer = document.getElementById("income-list");
  const totalContainer = document.getElementById("total-income");

  if (!listContainer || !totalContainer) return; // Si no existen, salir

  listContainer.innerHTML = "";
  let total = 0;

  incomes.forEach((income) => {
    const div = document.createElement("div");
    div.classList.add("income-item");
    div.innerHTML = `
      <p><strong>${income.category}</strong> - ${income.note} - $${income.amount} <br><small>${income.date}</small></p>
      <button onclick="deleteIncome('${income.id}')">Eliminar</button>
    `;
    listContainer.appendChild(div);
    total += income.amount;
  });

  totalContainer.innerHTML = `<p><strong>Total Ingresos:</strong> $${total.toFixed(2)}</p>`;
}

// Eliminar ingreso
function deleteIncome(id) {
  let incomes = JSON.parse(localStorage.getItem("incomes")) || [];
  incomes = incomes.filter((income) => income.id !== id);
  localStorage.setItem("incomes", JSON.stringify(incomes));
  loadIncomes();
}

// Cargar al inicio
document.addEventListener("DOMContentLoaded", loadIncomes);
