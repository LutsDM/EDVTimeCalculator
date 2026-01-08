import { Report } from "@/app/types/report"

export function usePriceCalculation({
    report,
    price,
    employeeCount,
    taxRate = 0.19,
}: {
    report: Report | null
    price: string
    employeeCount: number
    taxRate?: number
}) {
    const pricePerHour = Number(price || 0)

    if (!report || employeeCount === 0 || pricePerHour <= 0) {
        return {
            brutto: 0,
            netto: 0,
            mwst: 0,
            pricePerHour,
            stundensatzText: `${pricePerHour.toFixed(2)} €`,
        }
    }

    const minutesTotal =
        report.gesamtzeit 

    const brutto =
        minutesTotal * (pricePerHour / 60) * employeeCount

    const netto = brutto / (1 + taxRate)
    const mwst = brutto - netto

    return {
        brutto,
        netto,
        mwst,
        pricePerHour,
        stundensatzText: `${pricePerHour.toFixed(2)} €`,
    }
}