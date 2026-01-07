import { useEffect, useState } from "react"
import { TimeParts, timeToMinutes } from "../lib/time"
import { Report } from "../../../types/report"

export function useTimeCalculation({
  start,
  end,
  abfahrt,
  ankunft,
  includeFahrzeit,
}: {
  start: TimeParts
  end: TimeParts
  abfahrt: TimeParts
  ankunft: TimeParts
  includeFahrzeit: boolean
}) {
  const [report, setReport] = useState<Report | null>(null)
  const [error, setError] = useState("")

 useEffect(() => {
     const startMin = timeToMinutes(start);
     const endMin = timeToMinutes(end);
 
     if (startMin >= endMin) {
       setError("Arbeitsbeginn muss vor dem Arbeitsende liegen.");
       setReport(null);
       return;
     }
 
     let fahrzeit = 0;
 
     if (includeFahrzeit) {
       const abfahrtMin = timeToMinutes(abfahrt);
       const ankunftMin = timeToMinutes(ankunft);
 
       if (abfahrtMin > ankunftMin) {
         setError("Abfahrt darf nicht später als Ankunft sein.");
         setReport(null);
         return;
       }
 
       if (ankunftMin > startMin) {
         setError("Arbeitsbeginn darf nicht vor der Ankunft liegen.");
         setReport(null);
         return;
       }
 
       if (abfahrtMin > endMin) {
         setError("Abfahrt darf nicht nach dem Arbeitsende liegen.");
         setReport(null);
         return;
       }
 
       fahrzeit = ankunftMin - abfahrtMin;
 
     }
 
     const arbeitszeit = endMin - startMin;
 
     setError("");
     setReport({
       arbeitszeit,
       fahrzeit,
       gesamtzeit: arbeitszeit + fahrzeit,
     });
   }, [start, end, abfahrt, ankunft, includeFahrzeit]);

  return { report, error }
}
