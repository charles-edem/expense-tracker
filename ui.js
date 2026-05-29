import { getTransactions, saveTransactions, getBudget } from "./storage.js";
import { formatCurrency } from "./utils.js";

const incomeForm = document.getElementById("incomeForm");
const incomeSource = document.getElementById("incomeSource");
const incomeAmount = document.getElementById("incomeAmount");
const incomeDate = document.getElementById("incomeDate");
const incomeNote = document.getElementById("incomeNote");

const expenseForm = document.getElementById("expenseForm");
const expenseName = document.getElementById("expenseName");
const expenseAmount = document.getElementById("expenseAmount");
const expenseCategory = document.getElementById("expenseCategory");
const expenseDate = document.getElementById("expenseDate");
const expenseNote = document.getElementById("expenseNote");

export function getIncomeFormData() {
    return {
        id: Date.now(),
        createdAt: new Date(),
        type: "income",
        source: incomeSource.value,
        amount: Number(incomeAmount.value),
        date: incomeDate.value,
        note: incomeNote.value
    };
}

export function clearIncomeForm() {
    incomeForm.reset();
}

export function getExpenseFormData() {
    return {
        id: Date.now(),
        createdAt: new Date(),
        type: "expense",
        name: expenseName.value,
        amount: Number(expenseAmount.value),
        category: expenseCategory.value,
        date: expenseDate.value,
        note: expenseNote.value
    };
}

export function clearExpenseForm() {
    expenseForm.reset();
}

export function renderTransactions(transactions, onDelete) {
    const transactionList = document.getElementById("transactionList");
    transactionList.innerHTML = "";

    if (transactions.length === 0) {
        transactionList.innerHTML = "<p>No transactions yet</p>";
        return;
    }

    transactions.forEach((tx) => {
        const transactionCard = document.createElement("div");
        transactionCard.classList.add("transaction-card");

        const isIncome = tx.type === "income";

        const name = document.createElement("span");
        name.classList.add("transaction-name");
        name.textContent = tx.name || tx.source || "Unknown";

        const amount = document.createElement("span");
        amount.classList.add("transaction-amount");
        amount.textContent = `${isIncome ? "+" : "-"}${formatCurrency(tx.amount)}`;
        amount.style.color = isIncome ? "green" : "red";

        const date = document.createElement("span");
        date.classList.add("transaction-date");
        date.textContent = tx.date;

        const delBtn = document.createElement("button");
        delBtn.classList.add("delete-btn");
        delBtn.innerHTML = `<i class="fa fa-trash"></i>`;

        delBtn.addEventListener("click", () => {
            if (confirm("Delete this transaction?")) {
                onDelete(tx.id);
            }
        });

        transactionCard.appendChild(name);
        transactionCard.appendChild(amount);
        transactionCard.appendChild(date);
        transactionCard.appendChild(delBtn);

        transactionList.appendChild(transactionCard);
        transactionCard.classList.add("transaction-card")
    });
}

export function updateSummary(transactions) {
    const totalIncome = transactions
        .filter(t => t.type === "income")
        .reduce((sum, t) => sum + t.amount, 0);

    const totalExpenses = transactions
        .filter(t => t.type === "expense")
        .reduce((sum, t) => sum + t.amount, 0);

    const balance = totalIncome - totalExpenses;

    document.getElementById("totalIncome").textContent = formatCurrency(totalIncome);
    document.getElementById("totalExpenses").textContent = formatCurrency(totalExpenses);
    document.getElementById("balance").textContent = formatCurrency(balance);
}

export function updateBudget(transactions) {
    const budget = getBudget();

    const progressBar = document.getElementById("progressBar");
    const progressFill = document.getElementById("progressFill");
    const budgetText = document.getElementById("budgetText");

    if (!budget || budget <= 0) {
        progressBar.style.display = "none";
        budgetText.textContent = "";
        return;
    }

    progressBar.style.display = "block";

    const totalExpenses = transactions
        .filter(t => t.type === "expense")
        .reduce((sum, t) => sum + t.amount, 0);

    const percentage = (totalExpenses / budget) * 100;

    progressFill.style.width = `${Math.min(percentage, 100)}%`;


    if (percentage < 60) {
        progressFill.style.backgroundColor = "#16a34a";
    }
    
    else if (percentage < 80) {
        progressFill.style.backgroundColor = "#f59e0b";
    }
    else {
        progressFill.style.backgroundColor = "#dc2626";
    }

    if (percentage >= 100) {
        progressFill.classList.add("over");
    } else {
        progressFill.classList.remove("over");
    }

    budgetText.textContent =
        `${formatCurrency(totalExpenses)} spent of ${formatCurrency(budget)} budget`;
}

let balanceChart;

export function updateChartBalance(transactions) {
    const ctx = document.getElementById("balanceChart");
    if (!ctx) return;

    let runningBalance = 0;
    const labels = [];
    const balanceData = [];

    transactions.forEach(t => {
        if (t.type === "income") {
            runningBalance += t.amount;
        } else {
            runningBalance -= t.amount;
        }

        labels.push(
            new Date(t.createdAt).toLocaleString("en-GB", {
                day: "2-digit",
                month: "short",
                hour: "numeric",
                hour12: true,
                minute: "2-digit",
            })
        );

        balanceData.push(runningBalance);
    });

    if (!balanceChart) {
        balanceChart = new Chart(ctx, {
            type: "line",
            data: {
                labels,
                datasets: [{
                    label: "Balance",
                    data: balanceData,
                    borderColor: (context) => {
                        const chart = context.chart;
                        const { ctx, chartArea } = chart;
                        if (!chartArea) return "#23206b";
                        const gradient = ctx.createLinearGradient(0, 0, chartArea.width, 0);
                        gradient.addColorStop(0, "#23206b");
                        return gradient;
                    },
                    borderWidth: 2,
                    tension: 0.45,
                    pointRadius: 3,
                    pointHoverRadius: 7,
                    pointBackgroundColor: "#4338ca",
                    pointBorderColor: "#4338ca",
                    pointBorderWidth: 2,
                    fill: false,
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        display: true,
                        labels: {
                            usePointStyle: false,
                            boxWidth: 0,
                            color: "#666",
                        }
                    },
                    tooltip: {
                        backgroundColor: "#fff",
                        titleColor: "#111",
                        bodyColor: "#111",
                        borderColor: "#eee",
                        borderWidth: 1,
                        displayColors: true,
                        padding: 10
                    }
                },
                interaction: {
                    mode: "index",
                    intersect: false
                },
                scales: {
                    x: {
                        grid: {
                            color: "rgba(0,0,0,0.06)",
                        },
                        ticks: {
                            color: "#999",
                            maxTicksLimit: 0,
                        }
                    },
                    y: {
                        grid: {
                            color: "rgba(0,0,0,0.06)",
                        },
                        ticks: {
                            color: "#999",
                            maxTicksLimit: 4,
                        }
                    }
                }
            }
        });
    } else {
        balanceChart.data.labels = labels;
        balanceChart.data.datasets[0].data = balanceData;
        balanceChart.update();
    }
}