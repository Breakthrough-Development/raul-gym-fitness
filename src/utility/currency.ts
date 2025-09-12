import { MyBig } from "@/lib/big";


export const toCent = (dollarWithCents: number): number => {
  return MyBig(dollarWithCents).mul(100).round(2).toNumber();
};


export const toDollarAndCent = (centAmount: number): number => {
  return MyBig(centAmount).div(100).round(2).toNumber();
};

/**
 * fromCents with dollar symbol, and commas for thousands
 */
export const toDisplayCurrency = (centAmount: number): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(toDollarAndCent(centAmount));
};
