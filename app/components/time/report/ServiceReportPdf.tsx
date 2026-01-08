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
    marginTop: 16,
  },

  signatureBox: {
    width: "45%",
    textAlign: "center",
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
    customer
  } = props

  return (
    <Document>
      <Page size="A4" style={styles.page}>

        {/* HEADER */}
        <View style={styles.headerRow}>
          <Text style={styles.address}>
            EDV-SERVICE Samirae{"\n"}
            Schloßstr. 33{"\n"}
            51427 Bergisch Gladbach{"\n"}
            Tel. 02204 9670720{"\n"}
            Mobil 0163 2496741
          </Text>

          <Text style={styles.address}>
            EDV-SERVICE Samirae{"\n"}
            Franz-Boehm-Strasse 3{"\n"}
            40789 Monheim am Rhein{"\n"}
            Tel. 02173 9939835{"\n"}
            Mobil 0163 2496741
          </Text>

          {customer && (
            <>
              <Text>{customer.postalCode} {customer.city}</Text>
              <Text>{customer.street} {customer.houseNumber}</Text>
            </>
          )}

          <Image
            src="/LOGO.png"
            style={styles.logo}
          />
        </View>

        {/* TITLE */}
        <View style={styles.titleBlock}>
          <Text style={styles.title}>Servicebericht</Text>
          <Text>Arbeitsdatum: {arbeitsdatum}</Text>
          <Text>Auftragsnummer: {auftragsnummer}</Text>
          {kundenNr && <Text>Kunden-Nr: {kundenNr}</Text>}
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
            <Text style={[styles.tableCellLeft, styles.bold]}>Gesamtzeit</Text>
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

        {/* EMPLOYEES */}
        <View style={styles.signatures}>
          <Text style={styles.bold}>Ausgeführt durch:</Text>

          <View style={styles.signatureGrid}>
            {employees.map(e => (
              <View key={e.id} style={styles.signatureBox}>
                <View style={styles.signatureLine} />
                <Text>{e.name}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* CUSTOMER */}
        <View style={styles.customerSignature}>
          <View style={styles.signatureLine} />
          <Text>
            {customer
              ? `${customer.firstName} ${customer.lastName}`
              : "Kunde"}
          </Text>
        </View>

      </Page>
    </Document>
  )
}
