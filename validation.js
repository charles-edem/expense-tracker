export function validateTransaction(data, type) {
    const errors = [];

    if (type === "income") {
        if (!data.amount || data.amount <= 0) {
            errors.push("Amount must be a positive number");
        }
        if (!data.date) {
            errors.push("Date is required");
        }
    }

    if (type === "expense") {
        if (!data.name) {
            errors.push("Expense name is required");
        }
        if (!data.amount || data.amount <= 0) {
            errors.push("Amount must be a positive number");
        }
        if (!data.date) {
            errors.push("Date is required");
        }
    }

    return errors;
}