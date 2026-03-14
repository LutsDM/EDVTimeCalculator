type ActionsBlockProps = {
  hasEmployees: boolean;
  onReset: () => void;
  onCreateAuftragsformular: () => void;
  onCreateServicebericht: () => void;
};

export default function ActionsBlock({
  hasEmployees,
  onReset,
  onCreateAuftragsformular,
  onCreateServicebericht,
}: ActionsBlockProps) {
  const handleResetClick = () => {
    const ok = window.confirm("Aktuelle Eingaben wirklich löschen?");
    if (!ok) return;
    onReset();
  };

  const btnDisabled = !hasEmployees;
  const btnClass = (active: boolean) =>
    `w-full touch-manipulation h-12 px-4 rounded-lg text-sm font-medium transition-colors ${
      active
        ? "bg-gray-200 text-gray-900 hover:bg-gray-300 active:bg-gray-400"
        : "bg-gray-100 text-gray-400 cursor-not-allowed"
    }`;

  return (
    <div className="mb-8">
      <div className="space-y-3">
        <button
          type="button"
          disabled={btnDisabled}
          onClick={onCreateAuftragsformular}
          className={btnClass(hasEmployees)}
        >
          Auftragsformular erstellen
        </button>

        <button
          type="button"
          disabled={btnDisabled}
          onClick={onCreateServicebericht}
          className={btnClass(hasEmployees)}
        >
          Servicebericht erstellen
        </button>

        <button
          type="button"
          onClick={handleResetClick}
          className="touch-manipulation h-12 w-full rounded-lg px-3 text-sm font-medium border border-red-300 bg-red-50 text-red-700 hover:bg-red-100 active:scale-[0.98]"
        >
          Formular leeren
        </button>
      </div>
    </div>
  );
}
