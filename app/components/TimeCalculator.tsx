"use client";

import { useEffect, useMemo, useState } from "react";
import {
  emptyTime,
  formatDuration,
  getEndTime,
  getNowTime,
  getToday,
  timeToMinutes,
  makeTimeOptions,
  type TimeParts,
} from "./time/lib/time";


import TimeRow from "./time/TimeRow";
import ReportRow from "./time/ReportRow";
import TimeBlock from "./time/TimeBlock";

type Report = {
  arbeitszeit: number;
  fahrzeit: number;
  gesamtzeit: number;
  includeFahrzeit: boolean;
};

export default function TimeCalculator() {
  const isIOS =
    typeof navigator !== "undefined" &&
    /iPad|iPhone|iPod/.test(navigator.userAgent);

  const [date, setDate] = useState(getToday);

  const [start, setStart] = useState<TimeParts>(getNowTime);
  const [end, setEnd] = useState<TimeParts>(getEndTime);

  const [abfahrt, setAbfahrt] = useState<TimeParts>(emptyTime);
  const [ankunft, setAnkunft] = useState<TimeParts>(emptyTime);

  const [includeFahrzeit, setIncludeFahrzeit] = useState(false);

  const [report, setReport] = useState<Report | null>(null);
  const [error, setError] = useState("");

  const timeOptions = useMemo(() => makeTimeOptions, []);

  useEffect(() => {
    const startMin = timeToMinutes(start);
    const endMin = timeToMinutes(end);

    if (startMin>= endMin) {
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
      includeFahrzeit,
    });
  }, [start, end, abfahrt, ankunft, includeFahrzeit]);

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="max-w-md sm:max-w-sm mx-auto space-y-6">
        <h1 className="text-2xl font-semibold text-gray-900">
          Arbeitszeit Rechner
        </h1>

        <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
          <label className="block text-xs font-medium text-gray-600 mb-1">
            Arbeitsdatum
          </label>

          {isIOS ? (
            <input
              type="text"
              value={new Date(date).toLocaleDateString("de-DE")}
              readOnly
              className="h-9 w-full rounded-md border border-gray-300 px-2 text-sm bg-gray-50 text-gray-800"
            />
          ) : (
            <input
              type="date"
              lang="de"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="h-9 w-full rounded-md border border-gray-300 px-2 text-sm bg-white"
            />
          )}
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm space-y-4">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={includeFahrzeit}
              onChange={(e) => setIncludeFahrzeit(e.target.checked)}
              className="h-4 w-4"
            />
            Fahrzeit berücksichtigen
          </label>

          {includeFahrzeit && (
            <div className="space-y-4 pt-2 border-t">
              <TimeRow
                label="Abfahrt"
                value={abfahrt}
                onChange={setAbfahrt}
                timeOptions={timeOptions}
              />
              <TimeRow
                label="Ankunft"
                value={ankunft}
                onChange={setAnkunft}
                timeOptions={timeOptions}
              />
            </div>
          )}
        </div>

        <TimeBlock
          title="Von"
          label="Arbeitsbeginn"
          value={start}
          onChange={setStart}
          timeOptions={timeOptions}
        />

        <TimeBlock
          title="Bis"
          label="Arbeitsende"
          value={end}
          onChange={setEnd}
          timeOptions={timeOptions}
        />

        {error && (
          <div className="border border-red-300 bg-red-50 p-3 text-red-700 rounded-md">
            {error}
          </div>
        )}

        {report && (
          <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm space-y-2">
            <div className="text-xs uppercase tracking-wide text-gray-500">
              Zeitbericht
            </div>

            <ReportRow
              label="Arbeitszeit"
              value={formatDuration(report.arbeitszeit)}
            />

            {report.includeFahrzeit && (
              <ReportRow
                label="Fahrzeit"
                value={formatDuration(report.fahrzeit)}
              />
            )}

            <div className="pt-2 border-t">
              <ReportRow
                label="Gesamtzeit"
                value={formatDuration(report.gesamtzeit)}
                strong
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
