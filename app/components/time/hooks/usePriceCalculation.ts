import { Report } from "@/app/types/report";

export function usePriceCalculation({
  report,
  price,
  employeeCount,
  taxRate = 0.19,
  extraBruttoAmount = 0,
}: {
  report: Report | null;
  price: string;
  employeeCount: number;
  taxRate?: number;
  extraBruttoAmount?: number;
}) {
  const pricePerHour = Number(price || 0);

  if (!report || employeeCount === 0 || pricePerHour <= 0) {
    return {
      brutto: extraBruttoAmount,
      netto: 0,
      mwst: 0,
      pricePerHour,
      stundensatzText: `${pricePerHour.toFixed(2)} €`,
      serviceBrutto: 0,
      extraBrutto: extraBruttoAmount,
    };
  }

  const minutesTotal = report.gesamtzeit;

  const serviceBrutto = minutesTotal * (pricePerHour / 60) * employeeCount;

  const netto = serviceBrutto / (1 + taxRate);
  const mwst = serviceBrutto - netto;

  const extraBrutto = extraBruttoAmount;
  const brutto = serviceBrutto + extraBrutto;

  return {
    brutto,
    netto,
    mwst,
    pricePerHour,
    stundensatzText: `${pricePerHour.toFixed(2)} €`,
    serviceBrutto,
    extraBrutto,
  };
}
