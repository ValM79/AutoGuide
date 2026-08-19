// Ported 1:1 from base44/functions/downloadReceipt/entry.ts
import { jsPDF } from 'jspdf';
import { GetCommand } from '@aws-sdk/lib-dynamodb';
import { ddb, TABLES, json, getUserFromEvent } from '../_lib/common.mjs';

const PACKAGE_PRICES = { Basic: 1, Standard: 3, Premium: 7 };
const BIKE_PACKAGE_PRICES = { Basic: 0.5, Standard: 1, Premium: 3 };
const BIKE_SUBSECTIONS = ['Bikes & Bicycles', 'Car Extras', 'Car Parts', 'Boat Extras', 'Other items', 'Motorbike Extras'];

function getPaymentAmount(ad) {
  if (ad.paymentAmount != null) return ad.paymentAmount / 100;
  const isBike = BIKE_SUBSECTIONS.includes(ad.subsection);
  const prices = isBike ? BIKE_PACKAGE_PRICES : PACKAGE_PRICES;
  return prices[ad.packageName] || 0;
}

export const handler = async (event) => {
  try {
    const user = await getUserFromEvent(event);
    if (!user) return json(401, { error: 'Unauthorized' });

    const { adId } = JSON.parse(event.body || '{}');
    if (!adId) return json(400, { error: 'Missing adId' });

    const adRes = await ddb.send(new GetCommand({ TableName: TABLES.UserAd, Key: { id: adId } }));
    const ad = adRes.Item;
    if (!ad) return json(404, { error: 'Ad not found' });
    if (ad.created_by_id !== user.id) return json(403, { error: 'Forbidden' });

    const amount = getPaymentAmount(ad);
    const dateStr = ad.created_date ? new Date(ad.created_date).toLocaleDateString('en-IE') : 'N/A';
    const receiptId = `RCPT-${ad.id.slice(-8).toUpperCase()}`;

    const doc = new jsPDF();
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text('AutoMax', 20, 25);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text("Ireland's Largest Car Marketplace", 20, 32);

    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text('RECEIPT', 20, 50);
    doc.setDrawColor(200);
    doc.line(20, 55, 190, 55);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Receipt No: ${receiptId}`, 20, 65);
    doc.text(`Date: ${dateStr}`, 20, 72);
    doc.text('Payment Method: Credit / Debit Card', 20, 79);

    doc.setFont('helvetica', 'bold');
    doc.text('Billed To:', 20, 95);
    doc.setFont('helvetica', 'normal');
    doc.text(user.full_name || user.email || 'Valued Customer', 20, 102);
    if (user.email) doc.text(user.email, 20, 109);

    doc.setFont('helvetica', 'bold');
    doc.text('Description', 20, 125);
    doc.text('Amount', 160, 125);
    doc.line(20, 128, 190, 128);

    doc.setFont('helvetica', 'normal');
    const packageName = ad.packageName ? `${ad.packageName} Ad Package` : 'Ad Listing';
    doc.text(packageName, 20, 138);
    doc.text(`EUR ${amount.toFixed(2)}`, 160, 138);

    if (ad.title) {
      doc.setFontSize(9);
      doc.setTextColor(100);
      doc.text(`Listing: ${ad.title}`, 20, 145);
      doc.setTextColor(0);
      doc.setFontSize(10);
    }

    doc.line(20, 155, 190, 155);
    doc.setFont('helvetica', 'bold');
    doc.text('Total Paid:', 120, 163);
    doc.text(`EUR ${amount.toFixed(2)}`, 160, 163);

    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(120);
    doc.text('Thank you for your payment. This receipt was issued electronically by AutoMax.', 20, 185);
    doc.text('For questions about this transaction, contact support@automax.ie', 20, 191);

    const pdfBuffer = Buffer.from(doc.output('arraybuffer'));

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="automax-receipt-${receiptId}.pdf"`,
        'Access-Control-Allow-Origin': '*',
      },
      isBase64Encoded: true,
      body: pdfBuffer.toString('base64'),
    };
  } catch (error) {
    console.error('downloadReceipt error:', error);
    return json(500, { error: error.message });
  }
};
