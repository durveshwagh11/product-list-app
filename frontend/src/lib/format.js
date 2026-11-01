const priceFormat = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });
const dateFormat = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
});

export const formatPrice = (value) => priceFormat.format(Number(value));
export const formatDate = (value) => (value ? dateFormat.format(new Date(value)) : "");
