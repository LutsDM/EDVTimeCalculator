export type Report = {
  arbeitszeit: number;
  fahrzeit: number;
  gesamtzeit: number;

};

export type PriceCalculation = {
  brutto: number
  netto: number
  mwst: number
  pricePerHour: number
}