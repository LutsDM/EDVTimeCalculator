import { useEffect, useState } from "react"
import { TimeParts, timeToMinutes } from "../lib/time"
import { Report } from "@/app/types/report"

type Params = {
  // Ankunft
  ankunftVon: TimeParts
  ankunftBis: TimeParts

  // Arbeitszeit
  start: TimeParts
  end: TimeParts

  // Abfahrt
  abfahrtVon: TimeParts
  abfahrtBis: TimeParts
  includeAbfahrt: boolean
}

export function useTimeCalculation({
  ankunftVon,
  ankunftBis,
  start,
  end,
  abfahrtVon,
  abfahrtBis,
  includeAbfahrt,
}: Params) {
  const [report, setReport] = useState<Report | null>(null)
  const [error, setError] = useState("")

  useEffect(() => {
    const ankunftVonMin = timeToMinutes(ankunftVon)
    const ankunftBisMin = timeToMinutes(ankunftBis)
    const startMin = timeToMinutes(start)
    const endMin = timeToMinutes(end)

    /* ---------------- Ankunft validation ---------------- */

    if (ankunftVonMin > ankunftBisMin) {
      setError("Ankunft: Von darf nicht später als Bis sein.")
      setReport(null)
      return
    }

    if (ankunftBisMin > startMin) {
      setError("Arbeitsbeginn darf nicht vor dem Ende der Ankunft liegen.")
      setReport(null)
      return
    }

    /* ---------------- Arbeitszeit validation ---------------- */

    if (startMin >= endMin) {
      setError("Arbeitsbeginn muss vor dem Arbeitsende liegen.")
      setReport(null)
      return
    }

    /* ---------------- Abfahrt validation ---------------- */

    let abfahrtZeit = 0

    if (includeAbfahrt) {
      const abfahrtVonMin = timeToMinutes(abfahrtVon)
      const abfahrtBisMin = timeToMinutes(abfahrtBis)

      if (abfahrtVonMin > abfahrtBisMin) {
        setError("Abfahrt: Von darf nicht später als Bis sein.")
        setReport(null)
        return
      }

      if (abfahrtVonMin < endMin) {
        setError("Abfahrt darf nicht vor dem Arbeitsende beginnen.")
        setReport(null)
        return
      }

      abfahrtZeit = abfahrtBisMin - abfahrtVonMin
    }

    /* ---------------- Durations ---------------- */

    const ankunftZeit = ankunftBisMin - ankunftVonMin
    const arbeitszeit = endMin - startMin

    /* ---------------- Result ---------------- */

    setError("")
    setReport({
      arbeitszeit,
      abfahrt: abfahrtZeit,
      gesamtzeit: ankunftZeit + arbeitszeit + abfahrtZeit,
      ankunftzeit: ankunftZeit
    })
  }, [
    ankunftVon,
    ankunftBis,
    start,
    end,
    abfahrtVon,
    abfahrtBis,
    includeAbfahrt,
  ])

  return { report, error }
}
