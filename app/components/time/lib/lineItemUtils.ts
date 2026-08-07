import type { LineItem } from "@/app/types/lineItem";

export function parseEuroToCents(input: string): number {
  const normalized = input.trim().replace(",", ".");
  const value = Number(normalized);
  if (!Number.isFinite(value)) return 0;
  return Math.round(value * 100);
}

export function formatCents(cents: number): string {
  const euros = (cents / 100).toFixed(2);
  return euros.replace(".", ",");
}

export function formatCentsAsEuro(cents: number): string {
  return `${formatCents(cents)} €`;
}

export function formatQuantity(value: number): string {
  if (!Number.isFinite(value) || value <= 0) return "0";
  if (Number.isInteger(value)) return String(value);
  return value.toFixed(2).replace(".", ",");
}

/** e.g. "3 × 40,00 €" */
export function formatLineItemUnitDetail(item: LineItem): string {
  return `${formatQuantity(item.quantity)} × ${formatCentsAsEuro(item.unitPriceCents)}`;
}

export function parseQuantity(input: string): number {
  const normalized = input.trim().replace(",", ".");
  const value = Number(normalized);
  if (!Number.isFinite(value) || value <= 0) return 0;
  return value;
}

export function computeLineItemTotalCents(
  quantity: number,
  unitPriceCents: number,
): number {
  return Math.round(quantity * unitPriceCents);
}

export function withLineItemTotal(item: LineItem): LineItem {
  return {
    ...item,
    amountCents: computeLineItemTotalCents(item.quantity, item.unitPriceCents),
  };
}

export function createEmptyLineItem(): LineItem {
  return {
    id: crypto.randomUUID(),
    title: "",
    quantity: 1,
    unitPriceCents: 0,
    amountCents: 0,
  };
}

export function isValidLineItem(item: LineItem): boolean {
  return (
    item.title.trim().length > 0 &&
    item.quantity > 0 &&
    item.unitPriceCents > 0 &&
    item.amountCents > 0
  );
}

export function cleanLineItemsForSave(items: LineItem[]): LineItem[] {
  return items
    .map((item) =>
      withLineItemTotal({
        ...item,
        title: item.title.trim(),
      }),
    )
    .filter(isValidLineItem);
}

export function sumLineItemsCents(items: LineItem[]): number {
  return items.reduce((sum, item) => sum + (item.amountCents || 0), 0);
}

export function sumLineItemsEuro(items: LineItem[]): number {
  return sumLineItemsCents(items) / 100;
}

export function normalizeLineItem(raw: {
  id?: unknown;
  title?: unknown;
  quantity?: unknown;
  unitPriceCents?: unknown;
  amountCents?: unknown;
}): LineItem {
  const title = typeof raw.title === "string" ? raw.title : "";
  const id = typeof raw.id === "string" ? raw.id : crypto.randomUUID();
  const amountCents =
    typeof raw.amountCents === "number" ? raw.amountCents : 0;
  const quantity =
    typeof raw.quantity === "number" && raw.quantity > 0 ? raw.quantity : 1;
  const unitPriceCents =
    typeof raw.unitPriceCents === "number" && raw.unitPriceCents > 0
      ? raw.unitPriceCents
      : amountCents > 0
        ? Math.round(amountCents / quantity)
        : 0;

  return withLineItemTotal({
    id,
    title,
    quantity,
    unitPriceCents,
    amountCents: 0,
  });
}

export function normalizeLineItems(raw: unknown[]): LineItem[] {
  return raw
    .filter((entry): entry is Record<string, unknown> => {
      if (!entry || typeof entry !== "object") return false;
      return typeof (entry as { title?: unknown }).title === "string";
    })
    .map((entry) => normalizeLineItem(entry));
}
