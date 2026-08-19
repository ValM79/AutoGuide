import { createClientFromRequest } from 'npm:@base44/sdk@0.8.38';
import { jsPDF } from 'npm:jspdf@4.0.0';

const PACKAGE_PRICES = { 'Basic': 1, 'Standard': 3, 'Premium': 7 };
const BIKE_PACKAGE_PRICES = { 'Basic': 0.50, 'Standard': 1, 'Premium': 3 };
const BIKE_SUBSECTIONS = ['Bikes & Bicycles', 'Car Extras', 'Car Parts', 'Boat Extras', 'Other items', 'Motorbike Extras'];

function getPaymentAmount(ad) {
  if (ad.paymentAmount != null) {
    return ad.paymentAmount / 100;
  }
  const isBike = BIKE_SUBSECTIONS.includes(ad.subsection);
  const prices = isBike ? BIKE_PACKAGE_PRICES : PACKAGE_PRICES;
  return prices[ad.packageName] || 0;
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const { adId } = body;
    if (!adId) return Response.json({ error: 'Missing adId' }, { status: 400 });

    const ad = await base44.entities.UserAd.get(adId);
    if (!ad) return Response.json({ error: 'Ad not found' }, { status: 404 });
    if (ad.created_by_id !== user.id) return Response.json({ error: 'Forbidden' }, { status: 403 });

    const amount = getPaymentAmount(ad);
    const dateStr = ad.created_date ? new Date(ad.created_date).toLocaleDateString('en-IE') : 'N/A';
    const receiptId = `RCPT-${ad.id.slice(-8).toUpperCase()}`;

    const doc = new jsPDF();

    // Header
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

    // Receipt meta
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Receipt No: ${receiptId}`, 20, 65);
    doc.text(`Date: ${dateStr}`, 20, 72);
    doc.text(`Payment Method: Credit / Debit Card`, 20, 79);

    // Bill To
    doc.setFont('helvetica', 'bold');
    doc.text('Billed To:', 20, 95);
    doc.setFont('helvetica', 'normal');
    doc.text(user.full_name || user.email || 'Valued Customer', 20, 102);
    if (user.email) doc.text(user.email, 20, 109);

    // Item table
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

    // Total
    doc.line(20, 155, 190, 155);
    doc.setFont('helvetica', 'bold');
    doc.text('Total Paid:', 120, 163);
    doc.text(`EUR ${amount.toFixed(2)}`, 160, 163);

    // Footer
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(120);
    doc.text('Thank you for your payment. This receipt was issued electronically by AutoMax.', 20, 185);
    doc.text('For questions about this transaction, contact support@automax.ie', 20, 191);
    doc.setTextColor(0);

    const pdfBytes = doc.output('arraybuffer');
    return new Response(pdfBytes, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="automax-receipt-${receiptId}.pdf"`,
      },
    });
  } catch (error) {
    console.error('downloadReceipt error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});