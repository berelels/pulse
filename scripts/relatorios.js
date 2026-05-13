/** scripts/relatorios.js — Analytics + exportação Excel/PDF */
'use strict';

let _dataIni = '';
let _dataFim = '';
let _detalhes = [];

(async () => {
  await checkAuth();
  await renderNav('relatorios');

  // Período padrão: mês atual
  const hoje = new Date();
  _dataIni = new Date(hoje.getFullYear(), hoje.getMonth(), 1).toISOString().split('T')[0];
  _dataFim = new Date(hoje.getFullYear(), hoje.getMonth()+1, 0).toISOString().split('T')[0];
  document.getElementById('dataIni').value = _dataIni;
  document.getElementById('dataFim').value = _dataFim;

  await carregar();

  document.getElementById('btnAtualizar').addEventListener('click', () => {
    _dataIni = document.getElementById('dataIni').value;
    _dataFim = document.getElementById('dataFim').value;
    carregar();
  });

  document.getElementById('btnExcel').addEventListener('click', exportarExcel);
  document.getElementById('btnPdf').addEventListener('click', exportarPdf);
})();

async function carregar() {
  const [fatRes, statusRes, topRes, detRes] = await Promise.all([
    db.from('agendamentos').select('valor_total').eq('status','concluido')
      .gte('data_ensaio',_dataIni).lte('data_ensaio',_dataFim),
    db.from('agendamentos').select('status').gte('data_ensaio',_dataIni).lte('data_ensaio',_dataFim),
    db.from('agendamentos')
      .select('valor_total, bandas(nome_banda)')
      .neq('status','cancelado').gte('data_ensaio',_dataIni).lte('data_ensaio',_dataFim),
    db.from('agendamentos')
      .select('id, data_ensaio, hora_inicio, hora_fim, valor_total, status, bandas(nome_banda), perfis(nome)')
      .gte('data_ensaio',_dataIni).lte('data_ensaio',_dataFim).order('data_ensaio',{ascending:false}),
  ]);

  const faturamento = (fatRes.data??[]).reduce((s,r)=>s+Number(r.valor_total),0);

  // Contagem por status
  const counts = {};
  (statusRes.data??[]).forEach(r => { counts[r.status] = (counts[r.status]||0)+1; });

  // KPIs
  const kpiGrid = document.getElementById('kpiRel');
  kpiGrid.innerHTML = `
    <div class="kpi-card glass card-visible">
      <div class="kpi-icon kpi-teal"><i class="fa-solid fa-circle-dollar-to-slot"></i></div>
      <div class="kpi-info">
        <span class="kpi-value">${fmtMoeda(faturamento)}</span>
        <span class="kpi-label">Faturamento (concluídos)</span>
      </div>
    </div>
    ${Object.entries(counts).map(([st,total])=>`
    <div class="kpi-card glass card-visible">
      <div class="kpi-icon kpi-blue"><i class="fa-solid fa-layer-group"></i></div>
      <div class="kpi-info"><span class="kpi-value">${total}</span><span class="kpi-label">${ucfirst(st)}</span></div>
    </div>`).join('')}`;

  // Top 5 bandas
  const topMap = {};
  (topRes.data??[]).forEach(r=>{
    const n = r.bandas?.nome_banda ?? '?';
    if (!topMap[n]) topMap[n] = {total:0,fat:0};
    topMap[n].total++;
    topMap[n].fat += Number(r.valor_total);
  });
  const topBandas = Object.entries(topMap).sort((a,b)=>b[1].total-a[1].total).slice(0,5);
  const secTop = document.getElementById('secTopBandas');
  if (topBandas.length) {
    secTop.style.display = '';
    document.getElementById('tbodyTop').innerHTML = topBandas.map(([nome,d],i)=>`
      <tr>
        <td><span class="rank-badge">${i+1}</span> ${esc(nome)}</td>
        <td>${d.total}</td>
        <td>${fmtMoeda(d.fat)}</td>
      </tr>`).join('');
  }

  // Detalhes
  _detalhes = detRes.data ?? [];
  const tbody = document.getElementById('tbodyRel');
  if (!_detalhes.length) {
    tbody.innerHTML = `<tr><td colspan="7" class="empty-state"><i class="fa-solid fa-chart-simple"></i> Sem dados no período.</td></tr>`;
    return;
  }
  tbody.innerHTML = _detalhes.map(d=>`
    <tr>
      <td>${d.id}</td>
      <td><strong>${esc(d.bandas?.nome_banda??'—')}</strong></td>
      <td>${fmtData(d.data_ensaio)}</td>
      <td>${fmtHora(d.hora_inicio)} – ${fmtHora(d.hora_fim)}</td>
      <td>${fmtMoeda(d.valor_total)}</td>
      <td>${BADGE[d.status]??d.status}</td>
      <td>${esc(d.perfis?.nome??'—')}</td>
    </tr>`).join('');
}

function exportarExcel() {
  const tabela = document.getElementById('tabelaRelatorio');
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, XLSX.utils.table_to_sheet(tabela), 'Relatório');
  XLSX.writeFile(wb, 'Pulse_Relatorio.xlsx');
  showToast('Exportado para Excel!', 'success');
}

function exportarPdf() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ orientation:'landscape' });
  doc.setFontSize(16);
  doc.text('Pulse — Relatório de Agendamentos', 14, 15);
  doc.setFontSize(10);
  doc.text(`Período: ${fmtData(_dataIni)} a ${fmtData(_dataFim)}`, 14, 22);
  doc.autoTable({
    html: '#tabelaRelatorio', startY: 28,
    styles: { fontSize:8, cellPadding:3 },
    headStyles: { fillColor:[0,42,84], textColor:255 },
    alternateRowStyles: { fillColor:[245,248,255] },
  });
  doc.save('Pulse_Relatorio.pdf');
  showToast('Exportado para PDF!', 'success');
}

function esc(s){return String(s??'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');}
function ucfirst(s){return s?s.charAt(0).toUpperCase()+s.slice(1):s;}
