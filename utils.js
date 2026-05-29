export function formatCurrency(amount) {
    return new Intl.NumberFormat("en-GH", {
        style: "currency",
        currency: "GHS",
        minimumFractionDigits: 2
    }).format(amount);
}

export function getCurrentDate() {
    return new Date().toISOString().split("T")[0];
}