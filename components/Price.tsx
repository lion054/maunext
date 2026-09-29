"use client";

import { useCurrency } from "@/lib/currency/CurrencyProvider";

/** Client leaf so server-rendered pages can show a currency-aware price
 *  without becoming client components themselves — every amount passed
 *  in is USD, matching how every price is stored in lib/. */
export default function Price({ value, className }: { value: number; className?: string }) {
  const { format } = useCurrency();
  return <span className={className}>{format(value)}</span>;
}
