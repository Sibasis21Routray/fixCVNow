import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';

export const InvoicePDF = ({ data }) => {
  const {
    customerName,
    email,
    paymentId,
    amount,
    currency = '₹',
    date,
    description,
    invoiceNumber: providedInvoiceNumber,
    purpose: providedPurpose
  } = data;

  // Formatting invoice number based on typical patterns or using the provided ID
  const generateInvoiceNumber = () => {
    // Fallback if no invoiceNumber provided in data
    const dateObj = date ? new Date(date) : new Date();
    const ts = dateObj.getTime().toString().slice(-6).padStart(6, '0');
    return `RBGGOT ${ts}`;
  };

  const invoiceNumber = providedInvoiceNumber || generateInvoiceNumber();
  // Assuming amount is provided in paise, divide by 100 to get rupees
  const formatAmount = (amt) => (Number(amt || 0) / 100).toFixed(2);
  const currencySymbol = currency;

  return (
    <Document>
      <Page size={[595.28, 600]} style={styles.page}>
        {/* Header Section */}
        <View style={styles.header}>
          <View>
            <Text style={styles.brandName}>FixCVNow</Text>
            <Text style={styles.brandTagline}>AI-Powered Resume Optimization</Text>
            <View style={styles.brandUnderline} />
          </View>
          <Text style={styles.invoiceTitle}>INVOICE</Text>
        </View>

        {/* Address Info Section */}
        <View style={styles.infoGrid}>
          <View style={styles.infoCol}>
            <Text style={styles.label}>FROM:</Text>
            <Text style={styles.boldText}>RBG Growth Orbit Technologies</Text>
            <Text style={styles.text}>Kolkata, India</Text>
            <Text style={styles.text}>Pin Code: 700040</Text>
            <Text style={styles.text}>Email: Support@FixCVNow.com</Text>
           
          </View>

          <View style={styles.infoCol}>
            <Text style={styles.label}>TO:</Text>
            <Text style={styles.boldText}>{customerName || 'Customer'}</Text>
            <Text style={styles.text}>{email || ''}</Text>
          </View>

          <View style={[styles.infoCol, { alignItems: 'flex-end' }]}>
            <Text style={styles.label}>INVOICE DETAILS:</Text>
            <Text style={styles.boldText}># {invoiceNumber}</Text>
            <Text style={styles.text}>Date: {new Date(date).toLocaleDateString('en-GB')}</Text>
            <Text style={styles.text}>Payment ID:</Text>
            <Text style={styles.textSmall}>{paymentId || 'N/A'}</Text>
          </View>
        </View>

        {/* Table Section */}
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={styles.tableCellLabel}>Description</Text>
            <Text style={[styles.tableCellLabel, { textAlign: 'right' }]}>Amount</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableCellText}>{description || (providedPurpose === 'optimize' ? 'AI-optimized' : 'Professional clean')}</Text>
            <Text style={[styles.tableCellText, { textAlign: 'right' }]}>{currencySymbol}{formatAmount(amount)}</Text>
          </View>
        </View>

        {/* Totals Section */}
        <View style={styles.totalsContainer}>
          <View style={styles.totalsBox}>
            <View style={styles.totalRow}>
              <Text style={styles.textGrey}>Subtotal:</Text>
              <Text style={styles.text}>{currencySymbol}{formatAmount(amount)}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.totalRow}>
              <Text style={styles.totalLabelText}>Total:</Text>
              <Text style={styles.totalAmountText}>{currencySymbol}{formatAmount(amount)}</Text>
            </View>
          </View>
        </View>

       

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerThanks}>Thank you for choosing FixCVNow!</Text>
          <Text style={styles.footerNote}>This is a computer-generated invoice and doesn't require extra stamp.</Text>
        </View>
      </Page>
    </Document>
  );
};

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: 'Helvetica',
    fontSize: 9,
    color: '#333',
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 30,
    borderBottom: 1,
    borderBottomColor: '#1a456d',
    paddingBottom: 10,
  },
  brandName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1a456d',
  },
  brandTagline: {
    fontSize: 8,
    color: '#555',
    marginTop: 2,
  },
  brandUnderline: {
    width: 60,
    height: 2,
    backgroundColor: '#16A34A',
    marginTop: 4,
  },
  invoiceTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1a456d',
  },
  infoGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    gap: 15,
  },
  infoCol: {
    flex: 1,
  },
  label: {
    fontSize: 8,
    color: '#777',
    marginBottom: 5,
    fontWeight: 'bold',
  },
  boldText: {
    fontSize: 10,
    fontWeight: 'bold',
    marginBottom: 3,
  },
  text: {
    fontSize: 9,
    marginBottom: 2,
    lineHeight: 1.2,
  },
  textGrey: {
    fontSize: 10,
    color: '#777',
  },
  textSmall: {
    fontSize: 8,
    color: '#333',
  },
  table: {
    marginTop: 10,
    marginBottom: 20,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f8f9fa',
    padding: 10,
    borderBottom: 1,
    borderBottomColor: '#eee',
  },
  tableCellLabel: {
    flex: 1,
    fontSize: 10,
    fontWeight: 'bold',
    color: '#555',
  },
  tableRow: {
    flexDirection: 'row',
    padding: 10,
    borderBottom: 1,
    borderBottomColor: '#eee',
  },
  tableCellText: {
    flex: 1,
    fontSize: 10,
  },
  totalsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10,
  },
  totalsBox: {
    width: 180,
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 8,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  divider: {
    borderBottom: 1,
    borderBottomColor: '#ccc',
    marginVertical: 8,
  },
  totalLabelText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1a456d',
  },
  totalAmountText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1a456d',
  },
  signatureSection: {
    marginTop: 40,
    alignItems: 'flex-end',
  },
  signatureImage: {
    width: 100,
    height: 40,
  },
  signatureText: {
    fontSize: 9,
    marginTop: 5,
    borderTop: 1,
    borderTopColor: '#eee',
    paddingTop: 5,
    textAlign: 'center',
    width: 120,
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 0,
    right: 0,
    textAlign: 'center',
  },
  footerThanks: {
    fontSize: 10,
    color: '#777',
    marginBottom: 5,
  },
  footerNote: {
    fontSize: 8,
    color: '#aaa',
  },
});