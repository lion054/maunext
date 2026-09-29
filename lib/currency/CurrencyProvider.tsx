"use client";

import { createContext, useContext, useEffect, useMemo, useReducer } from "react";

export type CurrencyCode = "USD" | "EUR" | "GBP";

export const CURRENCIES: { code: CurrencyCode; symbol: string; rate: number; label: string }[] = [
  { code: "USD", symbol: "$", rate: 1, label: "US Dollar" },
  { code: "EUR", symbol: "€", rate: 0.92, label: "Euro" },
  { code: "GBP", symbol: "£", rate: 0.79, label: "British Pound" },
];

const STORAGE_KEY = "mauly-currency";

type State = { currency: CurrencyCode };
type Action = { type: "SET"; currency: CurrencyCode } | { type: "HYDRATE"; currency: CurrencyCode };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "SET":
    case "HYDRATE":
      return { currency: action.currency };
    default:
      return state;
  }
}

type CurrencyContextValue = {
  currency: CurrencyCode;
  setCurrency: (c: CurrencyCode) => void;
  symbol: string;
  /** Converts a USD amount (the currency every price in lib/ is stored in) and formats it
   *  with the active currency's symbol, e.g. format(2900) -> "$2,900" or "€2,668". */
  format: (usdAmount: number) => string;
};

const CurrencyContext = createContext<CurrencyContextValue | null>(null);

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, { currency: "USD" });

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw === "USD" || raw === "EUR" || raw === "GBP") dispatch({ type: "HYDRATE", currency: raw });
    } catch {
      // ignore — default to USD
    }
  }, []);

  const value = useMemo<CurrencyContextValue>(() => {
    const active = CURRENCIES.find((c) => c.code === state.currency) ?? CURRENCIES[0];
    return {
      currency: state.currency,
      setCurrency: (c: CurrencyCode) => {
        dispatch({ type: "SET", currency: c });
        try {
          window.localStorage.setItem(STORAGE_KEY, c);
        } catch {
          // storage unavailable — selection just won't persist across refresh
        }
      },
      symbol: active.symbol,
      format: (usdAmount: number) => `${active.symbol}${Math.round(usdAmount * active.rate).toLocaleString()}`,
    };
  }, [state.currency]);

  return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>;
}

export function useCurrency() {
  const ctx = useContext(CurrencyContext);
  if (!ctx) throw new Error("useCurrency must be used within a CurrencyProvider");
  return ctx;
}
