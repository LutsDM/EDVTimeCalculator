export type DocumentType = "auftrag" | "service";

export type DocumentSignatures = {
  kunde: string | null;
  employee: string | null;
};

export type DocumentSignaturesMap = {
  auftrag: DocumentSignatures;
  service: DocumentSignatures;
};

export const emptyDocumentSignatures = (): DocumentSignatures => ({
  kunde: null,
  employee: null,
});

export const emptyDocumentSignaturesMap = (): DocumentSignaturesMap => ({
  auftrag: emptyDocumentSignatures(),
  service: emptyDocumentSignatures(),
});

export function hasBothSignatures(s: DocumentSignatures): boolean {
  return Boolean(s.kunde && s.employee);
}

export function hasAnySignature(map: DocumentSignaturesMap): boolean {
  return Boolean(
    map.auftrag.kunde ||
      map.auftrag.employee ||
      map.service.kunde ||
      map.service.employee
  );
}

export const DOCUMENT_TITLES: Record<DocumentType, string> = {
  auftrag: "Auftragsformular",
  service: "Servicebericht",
};
