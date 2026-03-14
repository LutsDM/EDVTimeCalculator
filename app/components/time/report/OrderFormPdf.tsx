"use client";

import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";
import { Employee } from "../lib/employees";
import { Customer } from "@/app/types/customer";
import { LineItem } from "@/app/types/lineItem";

type OrderFormPdfProps = {
  arbeitsdatum: string;
  auftragsnummer: string;
  kundenNr?: string;
  preisProStunde: string;
  mitarbeiterAnzahl: number;
  orderDetails: string | null;
  lineItems: LineItem[];
  extraBrutto?: string;
  employees: Employee[];
  customer?: Customer | null;
  signatureKunde: string | null;
  signatureEmployee: string | null;
};

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
  address: { fontSize: 9, lineHeight: 1.4 },
  customerBlock: { fontSize: 9, lineHeight: 1.4, marginTop: 12 },
  logo: { width: 140, height: 60, objectFit: "contain" },
  titleBlock: { textAlign: "right", marginBottom: 16 },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 6 },
  bold: { fontWeight: "bold" },
  muted: { fontSize: 9, color: "#666" },
  table: { borderWidth: 1, borderColor: "#999", marginBottom: 14 },
  tableRow: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#999",
  },
  tableRowNoBottom: { borderBottomWidth: 0 },
  tableCellLeft: { flex: 1, padding: 6 },
  tableCellRight: { width: 120, padding: 6, alignItems: "flex-end" },
  orderDetailsBlock: {
    marginTop: 12,
    marginBottom: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: "#bbb",
    fontSize: 9,
    lineHeight: 1.4,
  },
  orderDetailsTitle: { fontWeight: "bold", marginBottom: 8 },
  footerSignatures: {
    marginTop: 18,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  signatureBox: { width: "35%", textAlign: "center" },
  signatureImageWrapper: { height: 40, justifyContent: "flex-end" },
  signatureImage: { width: "100%", height: "100%", objectFit: "contain" },
  signatureLine: {
    borderBottomWidth: 1,
    borderBottomColor: "#555",
    marginTop: 4,
    marginBottom: 6,
  },
});

export default function OrderFormPdf(props: OrderFormPdfProps) {
  const {
    arbeitsdatum,
    auftragsnummer,
    kundenNr,
    preisProStunde,
    mitarbeiterAnzahl,
    orderDetails,
    lineItems,
    extraBrutto,
    employees,
    customer,
    signatureKunde,
    signatureEmployee,
  } = props;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
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

        <View style={styles.titleBlock}>
          <Text style={styles.title}>Auftragsformular</Text>
          <Text>Arbeitsdatum: {arbeitsdatum}</Text>
          <Text>Auftragsnummer: {auftragsnummer}</Text>
          {kundenNr && <Text>Kunden Nr: {kundenNr}</Text>}
        </View>

        {/* Таблица как в Servicebericht (без времени) */}
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <Text style={styles.tableCellLeft}>Stundensatz</Text>
            <View style={styles.tableCellRight}>
              <Text>{preisProStunde}</Text>
            </View>
          </View>
          <View
            style={[
              styles.tableRow,
              ...(!lineItems?.length ? [styles.tableRowNoBottom] : []),
            ]}
          >
            <Text style={styles.tableCellLeft}>Mitarbeiteranzahl</Text>
            <View style={styles.tableCellRight}>
              <Text>{mitarbeiterAnzahl}</Text>
            </View>
          </View>
          {lineItems?.length ? (
            <>
              <View style={{ height: 1, backgroundColor: "#999" }} />
              {lineItems.map((item, index) => (
                <View
                  key={item.id}
                  style={[
                    styles.tableRow,
                    ...(index === lineItems.length - 1 ? [styles.tableRowNoBottom] : []),
                  ]}
                >
                  <Text style={styles.tableCellLeft}>{item.title}</Text>
                  <View style={styles.tableCellRight}>
                    <Text>
                      {(item.amountCents / 100).toFixed(2).replace(".", ",")} €
                    </Text>
                  </View>
                </View>
              ))}
            </>
          ) : null}
        </View>

        {orderDetails?.trim() && (
          <View style={styles.orderDetailsBlock}>
            <Text style={styles.orderDetailsTitle}>Auftragsdetails</Text>
            <Text>{orderDetails.replace(/\r\n/g, "\n")}</Text>
          </View>
        )}

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
  );
}
