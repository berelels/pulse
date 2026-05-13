/** scripts/dashboard.js — KPIs e próximos agendamentos */
'use strict';

(async () => {
  const session = await checkAuth();
  if (!session) return;
  await renderNav('dashboard');

  // Data de hoje
  document.getElementById('dataHoje').textContent =
    new Date().toLocaleDateString('pt-BR', { weekday:'long', day:'2-digit', month:'long', year:'numeric' });

  // Usuário logado
  const perfil = await getPerfil();
  document.getElementById('nomeUsuario').textContent = perfil?.nome ?? 'Usuário';

  // KPIs em paralelo
  const [
    { count: totalBandas },
    { count: totalAg },
    { count: totalEquip },
    { data: fatData }
  ] = await Promise.all([
    db.from('bandas').select('*', { count:'exact', head:true }),
    db.from('agendamentos').select('*', { count:'exact', head:true }).neq('status','cancelado'),
    db.from('equipamentos').select('*', { count:'exact', head:true }).eq('status','disponivel'),
    db.from('agendamentos').select('valor_total').eq('status','concluido')
      .gte('data_ensaio', new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0])
      .lte('data_ensaio', new Date(new Date().getFullYear(), new Date().getMonth()+1, 0).toISOString().split('T')[0]),
  ]);

  const faturamento = (fatData || []).reduce((s, r) => s + Number(r.valor_total), 0);

  document.getElementById('kpiGrid').innerHTML = `
    <div class="kpi-card glass card-visible">
      <div class="kpi-icon kpi-blue"><i class="fa-solid fa-guitar"></i></div>
      <div class="kpi-info">
        <span class="kpi-value">${totalBandas ?? 0}</span>
        <span class="kpi-label">Bandas Cadastradas</span>
      </div>
    </div>
    <div class="kpi-card glass card-visible">
      <div class="kpi-icon kpi-orange"><i class="fa-solid fa-calendar-check"></i></div>
      <div class="kpi-info">
        <span class="kpi-value">${totalAg ?? 0}</span>
        <span class="kpi-label">Agendamentos Ativos</span>
      </div>
    </div>
    <div class="kpi-card glass card-visible">
      <div class="kpi-icon kpi-green"><i class="fa-solid fa-microphone-lines"></i></div>
      <div class="kpi-info">
        <span class="kpi-value">${totalEquip ?? 0}</span>
        <span class="kpi-label">Equipamentos Disponíveis</span>
      </div>
    </div>
    <div class="kpi-card glass card-visible">
      <div class="kpi-icon kpi-teal"><i class="fa-solid fa-circle-dollar-to-slot"></i></div>
      <div class="kpi-info">
        <span class="kpi-value">${fmtMoeda(faturamento)}</span>
        <span class="kpi-label">Faturamento do Mês</span>
      </div>
    </div>`;

  // Próximos ensaios
  const hoje = new Date().toISOString().split('T')[0];
  const { data: proximos } = await db.from('agendamentos')
    .select('id, data_ensaio, hora_inicio, hora_fim, valor_total, status, bandas(nome_banda)')
    .gte('data_ensaio', hoje).neq('status','cancelado')
    .order('data_ensaio').order('hora_inicio').limit(5);

  const tbody = document.getElementById('tbodyProximos');
  if (!proximos?.length) {
    tbody.innerHTML = `<tr><td colspan="5" class="empty-state"><i class="fa-regular fa-calendar-xmark"></i> Nenhum ensaio próximo.</td></tr>`;
    return;
  }
  tbody.innerHTML = proximos.map(a => `
    <tr>
      <td><strong>${a.bandas?.nome_banda ?? '—'}</strong></td>
      <td>${fmtData(a.data_ensaio)}</td>
      <td>${fmtHora(a.hora_inicio)} – ${fmtHora(a.hora_fim)}</td>
      <td>${fmtMoeda(a.valor_total)}</td>
      <td>${BADGE[a.status] ?? a.status}</td>
    </tr>`).join('');
})();
