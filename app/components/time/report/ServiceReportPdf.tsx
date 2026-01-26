"use client"

import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer"
import { Employee } from "../lib/employees"
import { Customer } from "@/app/types/customer"

type Props = {
  arbeitsdatum: string
  auftragsnummer: string
  kundenNr?: string

  arbeitszeitText: string
  arbeitszeitRange: string

  abfahrtText?: string
  abfahrtRange?: string

  gesamtzeitText: string

  stundensatz: string
  mitarbeiterAnzahl: number

  netto: string
  mwst: string
  brutto: string

  employees: Employee[]
  customer?: Customer | null

  signatureKunde: string | null
  signatureEmployee: string | null
}

const styles = StyleSheet.create({
  page: {
    padding: 32,
    fontSize: 10,
    fontFamily: "Helvetica",
    color: "#111",
  },

  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
  },

  address: {
    fontSize: 9,
    lineHeight: 1.4,
  },

  customerBlock: {
    fontSize: 9,
    lineHeight: 1.4,
    marginTop: 12,
  },

  logo: {
    width: 140,
    height: 60,
    objectFit: "contain",
  },

  titleBlock: {
    textAlign: "right",
    marginBottom: 16,
  },

  title: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 6,
  },

  table: {
    borderWidth: 1,
    borderColor: "#999",
    marginBottom: 20,
  },

  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#999",
  },

  tableCellLeft: {
    flex: 1,
    padding: 6,
  },

  tableCellRight: {
    width: 120,
    padding: 6,
    textAlign: "right",
  },

  muted: {
    fontSize: 9,
    color: "#666",
  },

  bold: {
    fontWeight: "bold",
  },

  totals: {
    width: "50%",
    marginLeft: "auto",
    marginBottom: 32,
  },

  totalsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },

  totalsSum: {
    borderTopWidth: 1,
    borderTopColor: "#000",
    paddingTop: 6,
    marginTop: 6,
    fontWeight: "bold",
  },

  signatures: {
    marginTop: 24,
    fontSize: 9,
  },

  signatureGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 24,
    marginTop: 10,
  },

  signatureBox: {
    width: "45%",
    textAlign: "center",
    paddingTop: 6,
  },

  signatureLine: {
    borderBottomWidth: 1,
    borderBottomColor: "#555",
    height: 18,
    marginBottom: 6,
  },

  customerSignature: {
    marginTop: 32,
    width: "35%",
    marginLeft: "auto",
    textAlign: "center",
  },

  customerSignatureImageWrapper: {
    height: 52,
    justifyContent: "flex-end",
    marginBottom: 0,
  },
  customerSignatureImage: {
    width: "100%",
    height: "100%",
    objectFit: "contain",
  },


  customerLine: {
    borderBottomWidth: 1,
    borderBottomColor: "#555",
    height: 1,
    marginTop: 4,
    marginBottom: 6,
  },

  footerSignatures: {
    marginTop: 28,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },

  employeeSignature: {
    width: "35%",
    textAlign: "center",
  },

  employeeSignatureImageWrapper: {
    height: 52,
    justifyContent: "flex-end",
    marginBottom: 0,
  },

  employeeSignatureImage: {
    width: "100%",
    height: "100%",
    objectFit: "contain",
  },

  employeeLine: {
    borderBottomWidth: 1,
    borderBottomColor: "#555",
    height: 1,
    marginTop: 4,
    marginBottom: 6,
  },

})

export default function ServiceReportPdf(props: Props) {
  const {
    arbeitsdatum,
    auftragsnummer,
    kundenNr,
    arbeitszeitText,
    arbeitszeitRange,
    abfahrtText,
    abfahrtRange,
    gesamtzeitText,
    stundensatz,
    mitarbeiterAnzahl,
    netto,
    mwst,
    brutto,
    employees,
    customer,
    signatureKunde,
    signatureEmployee,
  } = props

  return (
    <Document>
      <Page size="A4" style={styles.page}>

        {/* HEADER */}
        <View style={styles.headerRow}>

          {/* LEFT COLUMN */}
          <View>
            <Text style={styles.address}>
              EDV SERVICE Samirae{"\n"}
              Schloßstr. 33{"\n"}
              51427 Bergisch Gladbach{"\n"}
              Tel. 02204 9670720{"\n"}
              Mobil 0163 2496741
            </Text>

            {customer && (
              <View style={styles.customerBlock}>
                <Text style={styles.bold}>Kunde</Text>

                {customer.type === "company" && customer.companyName && (
                  <Text>{customer.companyName}</Text>
                )}

                <Text>
                  {customer.firstName} {customer.lastName}
                </Text>

                <Text>
                  {customer.street} {customer.houseNumber}
                </Text>

                <Text>
                  {customer.postalCode} {customer.city}
                </Text>

                {customer.phone && (
                  <Text>Tel. {customer.phone}</Text>
                )}
              </View>
            )}
          </View>

          {/* RIGHT COLUMN */}
          <Image src="/LOGO.png" style={styles.logo} />
        </View>

        {/* TITLE */}
        <View style={styles.titleBlock}>
          <Text style={styles.title}>Servicebericht</Text>
          <Text>Arbeitsdatum: {arbeitsdatum}</Text>
          <Text>Auftragsnummer: {auftragsnummer}</Text>
          {kundenNr && <Text>Kunden Nr: {kundenNr}</Text>}
        </View>

        {/* TABLE */}
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <View style={styles.tableCellLeft}>
              <Text>Arbeitszeit</Text>
              <Text style={styles.muted}>({arbeitszeitRange})</Text>
            </View>
            <Text style={styles.tableCellRight}>{arbeitszeitText}</Text>
          </View>

          {abfahrtText && abfahrtRange && (
            <View style={styles.tableRow}>
              <View style={styles.tableCellLeft}>
                <Text>Fahrzeit</Text>
                <Text style={styles.muted}>({abfahrtRange})</Text>
              </View>
              <Text style={styles.tableCellRight}>{abfahrtText}</Text>
            </View>
          )}

          <View style={styles.tableRow}>
            <Text style={[styles.tableCellLeft, styles.bold]}>
              Gesamtzeit
            </Text>
            <Text style={[styles.tableCellRight, styles.bold]}>
              {gesamtzeitText}
            </Text>
          </View>

          <View style={styles.tableRow}>
            <Text style={styles.tableCellLeft}>Stundensatz</Text>
            <Text style={styles.tableCellRight}>{stundensatz}</Text>
          </View>

          <View style={styles.tableRow}>
            <Text style={styles.tableCellLeft}>Mitarbeiteranzahl</Text>
            <Text style={styles.tableCellRight}>{mitarbeiterAnzahl}</Text>
          </View>
        </View>

        {/* TOTALS */}
        <View style={styles.totals}>
          <View style={styles.totalsRow}>
            <Text>Nettobetrag</Text>
            <Text>{netto}</Text>
          </View>
          <View style={styles.totalsRow}>
            <Text>MwSt 19 %</Text>
            <Text>{mwst}</Text>
          </View>
          <View style={[styles.totalsRow, styles.totalsSum]}>
            <Text>Gesamtbetrag</Text>
            <Text>{brutto}</Text>
          </View>
        </View>

        {/* SIGNATURES FOOTER */}
        <View style={styles.footerSignatures}>
          {/* EMPLOYEE SIGNATURE */}
          <View style={styles.employeeSignature}>
            <Text style={styles.bold}>Ausgeführt durch:</Text>
            {signatureEmployee ? (
              <View style={styles.employeeSignatureImageWrapper}>
                <Image
                  src={signatureEmployee}
                  style={styles.employeeSignatureImage}
                />
              </View>
            ) : (
              <Text style={styles.muted}>Bitte unterschreiben</Text>
            )}

            <View style={styles.employeeLine} />

            <Text>
              {employees?.[0]?.name ? employees[0].name : "Mitarbeiter"}
            </Text>
          </View>

          {/* CUSTOMER SIGNATURE */}
          <View style={styles.customerSignature}>
            {signatureKunde ? (
              <View style={styles.customerSignatureImageWrapper}>
                <Image
                  src={signatureKunde}
                  style={styles.customerSignatureImage}
                />
              </View>
            ) : (
              <Text style={styles.muted}>Bitte unterschreiben</Text>
            )}

            <View style={styles.customerLine} />

            <Text>
              {customer ? `${customer.firstName} ${customer.lastName}` : "Kunde"}
            </Text>
          </View>
        </View>
      </Page>
    </Document>
  )
}
