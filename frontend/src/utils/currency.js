// src/utils/currency.js
export const getCurrencySymbol = () => {
    const code = localStorage.getItem("currency") || "INR";
    const symbols = { INR: "₹", USD: "$", EUR: "€", GBP: "£" };
    return symbols[code] || "₹";
};

export const convertPrice = (priceInINR) => {
    if (priceInINR === null || priceInINR === undefined || isNaN(priceInINR)) return 0;
    const code = localStorage.getItem("currency") || "INR";
    const rates = { INR: 1, USD: 0.012, EUR: 0.011, GBP: 0.0094 }; 
    return Number(priceInINR) * (rates[code] || 1);
};

export const formatPrice = (priceInINR) => {
    if (priceInINR === null || priceInINR === undefined || isNaN(priceInINR)) return "N/A";
    const code = localStorage.getItem("currency") || "INR";
    const converted = convertPrice(priceInINR);

    return converted.toLocaleString("en-US", { minimumFractionDigits: code === 'INR' ? 0 : 2, maximumFractionDigits: code === 'INR' ? 0 : 2 });
};
