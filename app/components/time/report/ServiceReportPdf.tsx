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
import { LineItem } from "@/app/types/lineItem"

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

  orderDetails: string | null

  lineItems?: LineItem[]
  extraBrutto?: string

  serviceBrutto?: string

}

const styles = StyleSheet.create({
  page: {
    padding: 24,
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
    marginBottom: 14,
  },

  tableRow: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#999",
  },

  tableRowNoBottom: {
    borderBottomWidth: 0,
  },

  tableCellLeft: {
    flex: 1,
    padding: 6,
  },

  tableCellRight: {
    width: 120,
    padding: 6,
    alignItems: "flex-end",
  },

  muted: {
    fontSize: 9,
    color: "#666",
  },

  bold: {
    fontWeight: "bold",
  },

  divider: {
    height: 1,
    backgroundColor: "#999",
  },

  totals: {
    width: "45%",
    marginLeft: "auto",
    marginBottom: 14,
  },

  totalsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 3,
  },

  totalsSum: {
    borderTopWidth: 1,
    borderTopColor: "#000",
    paddingTop: 6,
    marginTop: 6,
    fontWeight: "bold",
  },

  orderDetailsBlock: {
    marginTop: 12,
    marginBottom: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: "#bbb",
    fontSize: 9,
    lineHeight: 1.4,
  },

  orderDetailsTitle: {
    fontWeight: "bold",
    marginBottom: 8,
  },

  footerSignatures: {
    marginTop: 18,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },

  signatureBox: {
    width: "35%",
    textAlign: "center",
  },

  signatureImageWrapper: {
    height: 40,
    justifyContent: "flex-end",
  },

  signatureImage: {
    width: "100%",
    height: "100%",
    objectFit: "contain",
  },

  signatureLine: {
    borderBottomWidth: 1,
    borderBottomColor: "#555",
    marginTop: 4,
    marginBottom: 6,

  },

  totalsSubsum: {
    borderTopWidth: 1,
    borderTopColor: "#999",
    paddingTop: 6,
    marginTop: 6,
    fontWeight: "bold",
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
    orderDetails,
    lineItems,
    extraBrutto,
    serviceBrutto
  } = props

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* HEADER */}
        <View style={styles.headerRow}>
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

                {customer.phone && <Text>Tel. {customer.phone}</Text>}
              </View>
            )}
          </View>

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
            <View style={styles.tableCellRight}>
              <Text>{arbeitszeitText}</Text>
            </View>
          </View>

          {abfahrtText && abfahrtRange && (
            <View style={styles.tableRow}>
              <View style={styles.tableCellLeft}>
                <Text>Fahrzeit</Text>
                <Text style={styles.muted}>({abfahrtRange})</Text>
              </View>
              <View style={styles.tableCellRight}>
                <Text>{abfahrtText}</Text>
              </View>
            </View>
          )}

          <View style={styles.tableRow}>
            <Text style={[styles.tableCellLeft, styles.bold]}>Gesamtzeit</Text>
            <View style={styles.tableCellRight}>
              <Text style={styles.bold}>{gesamtzeitText}</Text>
            </View>
          </View>

          <View style={styles.tableRow}>
            <Text style={styles.tableCellLeft}>Stundensatz</Text>
            <View style={styles.tableCellRight}>
              <Text>{stundensatz}</Text>
            </View>
          </View>

          <View
            style={[
              styles.tableRow,
              ...(lineItems?.length ? [styles.tableRowNoBottom] : []),
            ]}
          >
            <Text style={styles.tableCellLeft}>Mitarbeiteranzahl</Text>
            <View style={styles.tableCellRight}>
              <Text>{mitarbeiterAnzahl}</Text>
            </View>
          </View>

          {lineItems?.length ? (
            <>
              <View style={styles.divider} />

              {lineItems.map((item, index) => {
                const isLast = index === lineItems.length - 1

                return (
                  <View
                    key={item.id}
                    style={[
                      styles.tableRow,
                      ...(isLast ? [styles.tableRowNoBottom] : []),
                    ]}
                  >
                    <Text style={styles.tableCellLeft}>{item.title}</Text>
                    <View style={styles.tableCellRight}>
                      <Text>
                        {(item.amountCents / 100)
                          .toFixed(2)
                          .replace(".", ",")}{" "}
                        €
                      </Text>
                    </View>
                  </View>
                )
              })}
            </>
          ) : null}
        </View>

        {/* TOTALS */}
        <View style={styles.totals}>
          {/* WORK */}
          <View style={styles.totalsRow}>
            <Text>Nettobetrag (Arbeit)</Text>
            <Text>{netto}</Text>
          </View>

          <View style={styles.totalsRow}>
            <Text>MwSt 19 % (Arbeit)</Text>
            <Text>{mwst}</Text>
          </View>

          {serviceBrutto ? (
            <View style={[styles.totalsRow, styles.totalsSubsum]}>
              <Text>Zwischensumme Arbeit</Text>
              <Text>{serviceBrutto}</Text>
            </View>
          ) : null}

          {/* EXTRAS */}
          {extraBrutto ? (
            <View style={[styles.totalsRow, { marginTop: 6 }]}>
              <Text>Zusatzpositionen</Text>
              <Text>{extraBrutto}</Text>
            </View>
          ) : null}

          {/* TOTAL */}
          <View style={[styles.totalsRow, styles.totalsSum]}>
            <Text>Gesamtbetrag</Text>
            <Text>{brutto}</Text>
          </View>
        </View>


        {/* ORDER DETAILS */}
        {orderDetails?.trim() && (
          <View style={styles.orderDetailsBlock}>
            <Text style={styles.orderDetailsTitle}>Auftragsdetails</Text>
            <Text>{orderDetails.replace(/\r\n/g, "\n")}</Text>
          </View>
        )}

        {/* SIGNATURES */}
        <View style={styles.footerSignatures}>
          <View style={styles.signatureBox}>
            <Text style={styles.bold}>Ausgeführt durch:</Text>
            <View style={styles.signatureImageWrapper}>
              {signatureEmployee ? (
                <Image src={signatureEmployee} style={styles.signatureImage} />
              ) : (
                <Text style={styles.muted}>Bitte unterschreiben</Text>
              )}
            </View>
            <View style={styles.signatureLine} />
            <Text>{employees?.[0]?.name || "Mitarbeiter"}</Text>
          </View>

          <View style={styles.signatureBox}>
            <Text style={styles.bold}>Kunde:</Text>
            <View style={styles.signatureImageWrapper}>
              {signatureKunde ? (
                <Image src={signatureKunde} style={styles.signatureImage} />
              ) : (
                <Text style={styles.muted}>Bitte unterschreiben</Text>
              )}
            </View>
            <View style={styles.signatureLine} />
            <Text>
              {customer
                ? `${customer.firstName} ${customer.lastName}`
                : "Kunde"}
            </Text>
          </View>
        </View>
      </Page>
    </Document>
  )
}
