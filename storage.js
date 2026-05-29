export function getTransactions() {
    return JSON.parse(localStorage.getItem("transaction")) || [];
}

export function saveTransactions(transaction) {
    localStorage.setItem("transaction", JSON.stringify(transaction));
}

export function getBudget() {
    const budget = JSON.parse(localStorage.getItem("budget"));
    if (budget === null) return 0;
    return Number(budget);
}

export function saveBudget(budget) {
    localStorage.setItem("budget", JSON.stringify(budget));
}