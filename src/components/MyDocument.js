// src/components/MyDocument.js
import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    padding: 20,
  },
  section: {
    marginBottom: 10,
  },
});

const MyDocument = ({ logData }) => (
  <Document>
    <Page style={styles.page}>
      <View style={styles.section}>
        <Text>Log Sheet: {logData.date}</Text>
        <Text>Driver: {logData.driver}</Text>
        <Text>From: {logData.from}</Text>
        <Text>To: {logData.to}</Text>
      </View>
      <View style={styles.section}>
        <Text>Status Totals:</Text>
        <Text>
          On Duty (Not Driving):{" "}
          {logData.entries
            .filter((e) => e.status === 1)
            .reduce((sum, e) => sum + e.duration, 0)
            .toFixed(2)}{" "}
          hrs
        </Text>
      </View>
    </Page>
  </Document>
);

export default MyDocument;
