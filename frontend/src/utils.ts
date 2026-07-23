// Currency conversion utility
// 1 USD ≈ 83 INR (approximate exchange rate)
export const USD_TO_INR = 83;

/**
 * Converts a USD price to INR and formats it with the ₹ symbol
 * using Indian number formatting (e.g., ₹1,23,456)
 */
export function formatINR(usdPrice: number): string {
  const inrPrice = usdPrice * USD_TO_INR;
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(inrPrice);
}
