import { getTransactions, saveTransactions, getBudget, saveBudget } from "./storage.js";
import {
    getIncomeFormData,
    getExpenseFormData,
    clearExpenseForm,
    clearIncomeForm,
    renderTransactions,
    updateSummary,
    updateBudget,
    updateChartBalance,
} from "./ui.js";
import { validateTransaction } from "./validation.js";
import { formatCurrency, getCurrentDate } from "./utils.js";

const incomeTab = document.getElementById("incomeTransaction");
const incomeForm = document.getElementById("incomeForm");
const incomeTransactionBtn = document.getElementById("incomeTransactionBtn");

const expenseTab = document.getElementById("expenseTransaction");
const expenseForm = document.getElementById("expenseForm");
const expenseTransactionBtn = document.getElementById("expenseTransactionBtn");

const budgetInput = document.getElementById("budgetInput");
const setBudgetBtn = document.getElementById("setBudgetBtn");

const filterAllBtn = document.getElementById("filterAll");
const filterIncomeBtn = document.getElementById("filterIncome");
const filterExpenseBtn = document.getElementById("filterExpense");

const categoryFilter = document.getElementById("categoryFilter");


expenseForm.style.display = "none";


incomeTab.addEventListener("click", () => {
    incomeForm.style.display = "initial";
    incomeTab.style.cssText += `
    color: white;;
    background-color: #23206b;
    border:none;
    display: initial;
    `;
    expenseTab.style.cssText += `
    color: white;;
    background-color: #4338ca;
    border:none;
    `;
    expenseForm.style.display = "none";
    clearIncomeForm();
});

expenseTab.addEventListener("click", () => {
    incomeForm.style.display = "none";
    expenseTab.style.cssText += `
    color: white;;
    background-color: #23206b;
    border:none;
    display: initial;
    `;
    incomeTab.style.cssText += `
    color: white;;
    background-color: #4338ca;
    border:none;
    `;
    expenseForm.style.display = "initial";
    clearExpenseForm();
});

incomeForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const transaction = getIncomeFormData();
    const errors = validateTransaction(transaction, "income");

    if (errors.length > 0) {
        alert(errors.join("\n"));
        return;
    }

    const transactions = getTransactions();
    transactions.push(transaction);
    saveTransactions(transactions);

    clearIncomeForm();
    applyFilters();
    updateSummary(getTransactions());
    updateBudget(getTransactions());
    updateChartBalance(getTransactions());
});

expenseForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const expense = getExpenseFormData();
    const errors = validateTransaction(expense, "expense");

    if (errors.length > 0) {
        alert(errors.join("\n"));
        return;
    }

    const transactions = getTransactions();
    transactions.push(expense);
    saveTransactions(transactions);

    clearExpenseForm();
    applyFilters();
    updateSummary(getTransactions());
    updateBudget(getTransactions());
    updateChartBalance(getTransactions());
});

setBudgetBtn.addEventListener("click", () => {
    const budgetValue = Number(budgetInput.value);

    if (isNaN(budgetValue) || budgetValue <= 0) {
        alert("Please enter a valid budget");
        return;
    }

    saveBudget(budgetValue);

    updateBudget(getTransactions());

    budgetInput.value = "";
});

let currentFilter = "all";
let currentCategory = "allCategories";

function applyFilters() {
    let transactions = getTransactions();

    if (currentFilter !== "all") {
        transactions = transactions.filter(
            transaction => transaction.type === currentFilter
        );
    }

    if (currentCategory !== "allCategories") {
        transactions = transactions.filter(
            transaction => transaction.category === currentCategory
        );
    }

    renderTransactions(transactions, handleDelete);
}

function handleDelete(id) {
    let transactions = getTransactions();
    transactions = transactions.filter(t => t.id !== id);
    saveTransactions(transactions);

    applyFilters();
    updateSummary(transactions);
    updateBudget(transactions);
    updateChartBalance(getTransactions());
}

filterAllBtn.addEventListener("click", () => {
    currentFilter = "all";
    applyFilters();
});

filterIncomeBtn.addEventListener("click", () => {
    currentFilter = "income";
    applyFilters();
});

filterExpenseBtn.addEventListener("click", () => {
    currentFilter = "expense";
    applyFilters();
});

categoryFilter.addEventListener("change", (e) => {
    currentCategory = e.target.value;
    applyFilters();
});

applyFilters();
updateSummary(getTransactions());
updateBudget(getTransactions());
updateChartBalance(getTransactions());