import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { format } from 'date-fns';
import { SalesEntry, Station } from '../types';

export const generateSalesReport = (sales: SalesEntry[], station: Station) => {
  const doc = new jsPDF();

  // Add header
  doc.setFontSize(20);
  doc.text(`Sales Report - ${station.name}`, 14, 15);

  // Add metadata
  doc.setFontSize(12);
  doc.text(`Generated: ${format(new Date(), 'PPP')}`, 14, 25);
  doc.text(`Station Manager: ${station.managerName}`, 14, 35);

  // Calculate totals
  const totalVolume = sales.reduce((sum, sale) => sum + sale.volumeSold, 0);
  const totalRevenue = sales.reduce((sum, sale) => sum + sale.revenue, 0);

  // Add summary
  doc.text('Summary', 14, 50);
  doc.text(`Total Volume: ${totalVolume.toLocaleString()} L`, 14, 60);
  doc.text(`Total Revenue: ₦${totalRevenue.toLocaleString()}`, 14, 70);

  // Create sales table
  const tableData = sales.map(sale => [
    format(new Date(sale.date), 'PP'),
    sale.shift,
    `${sale.volumeSold.toLocaleString()} L`,
    `₦${sale.revenue.toLocaleString()}`,
    sale.staffName
  ]);

  autoTable(doc, {
    head: [['Date', 'Shift', 'Volume', 'Revenue', 'Staff']],
    body: tableData,
    startY: 80,
    styles: { fontSize: 10 },
    headStyles: { fillColor: [255, 215, 0] }
  });

  // Save the PDF
  const fileName = `sales-report-${station.name}-${format(new Date(), 'yyyy-MM-dd')}.pdf`;
  doc.save(fileName);
};

export const generateTankReport = (station: Station) => {
  const doc = new jsPDF();

  // Add header
  doc.setFontSize(20);
  doc.text(`Tank Status Report - ${station.name}`, 14, 15);

  // Add metadata
  doc.setFontSize(12);
  doc.text(`Generated: ${format(new Date(), 'PPP')}`, 14, 25);

  // Create tanks table
  const tableData = station.tanks.map(tank => [
    tank.name,
    tank.productType,
    `${tank.currentVolume.toLocaleString()} L`,
    `${tank.capacity.toLocaleString()} L`,
    `${((tank.currentVolume / tank.capacity) * 100).toFixed(1)}%`,
    tank.status
  ]);

  autoTable(doc, {
    head: [['Tank', 'Product', 'Current Volume', 'Capacity', 'Fill Level', 'Status']],
    body: tableData,
    startY: 40,
    styles: { fontSize: 10 },
    headStyles: { fillColor: [255, 215, 0] }
  });

  // Save the PDF
  const fileName = `tank-report-${station.name}-${format(new Date(), 'yyyy-MM-dd')}.pdf`;
  doc.save(fileName);
};