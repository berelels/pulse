/**
 * assets/js/relatorios.js
 * Exportação para Excel (SheetJS) e PDF (jsPDF + AutoTable).
 * As datas do período são lidas do data island #pageData no HTML.
 */

'use strict';

const _relData = JSON.parse(document.getElementById('pageData').textContent);

// ---- Exportar para Excel ----
document.getElementById('btnExcelRel').addEventListener('click', function () {
  const tabela = document.getElementById('tabelaRelatorio');
  if (!tabela) return;

  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.table_to_sheet(tabela);
  XLSX.utils.book_append_sheet(wb, ws, 'Relatório Pulse');
  XLSX.writeFile(wb, 'Pulse_Relatorio.xlsx');
  showToast('Exportado para Excel!', 'success');
});

// ---- Exportar para PDF ----
document.getElementById('btnPdfRel').addEventListener('click', function () {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ orientation: 'landscape' });

  doc.setFontSize(16);
  doc.text('Pulse – Relatório de Agendamentos', 14, 15);

  doc.setFontSize(10);
  doc.text(
    `Período: ${_relData.dataIni} a ${_relData.dataFim}`,
    14, 22
  );

  doc.autoTable({
    html: '#tabelaRelatorio',
    startY: 28,
    styles: { fontSize: 8, cellPadding: 3 },
    headStyles: { fillColor: [0, 42, 84], textColor: 255 },
    alternateRowStyles: { fillColor: [245, 248, 255] },
  });

  doc.save('Pulse_Relatorio.pdf');
  showToast('Exportado para PDF!', 'success');
});
