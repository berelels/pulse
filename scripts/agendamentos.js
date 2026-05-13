/** scripts/agendamentos.js — CRUD com 3 filtros combinados */
'use strict';

let _ags = [];
let _bandas = [];
let _deletandoId = null;
let _usuarioId = null;

(async () => {
  const session = await checkAuth();
  if (!session) return;
  _usuarioId = session.user.id;

  await renderNav('agendamentos');

  // Carregar bandas para o select do modal
  const { data: bandas } = await db.from('bandas').select('id, nome_banda').order('nome_banda');
  _bandas = bandas ?? [];
  const sel = document.getElementById('banda_id');
  _bandas.forEach(b => {
    const opt = document.createElement('option');
    opt.value = b.id; opt.textContent = b.nome_banda;
    sel.appendChild(opt);
  });

  await carregar();

  document.getElementById('btnFiltrar').addEventListener('click', carregar);
  document.getElementById('btnLimpar').addEventListener('click', () => {
    document.getElementById('filtroBanda').value  = '';
    document.getElementById('filtroDataIni').value = '';
    document.getElementById('filtroDataFim').value = '';
    document.getElementById('filtroStatus').value  = '';
    carregar();
  });

  document.getElementById('btnNovoAg').addEventListener('click', () => {
    document.getElementById('modalTitulo').textContent = 'Novo Agendamento';
    document.getElementById('inputId').value = '';
    document.getElementById('formAg').reset();
    limparErros(['banda_id','data_ensaio','hora_inicio','hora_fim','valor_total']);
    abrirModal('modalOverlay');
  });

  bindFecharModal('modalOverlay',    'btnFecharModal',    'btnCancelarModal');
  bindFecharModal('modalDelOverlay', 'btnFecharModalDel', 'btnCancelarDel');

  document.getElementById('formAg').addEventListener('submit', async e => {
    e.preventDefault();
    const campos = [
      {id:'banda_id',label:'Banda'},{id:'data_ensaio',label:'Data'},
      {id:'hora_inicio',label:'Hora Início'},{id:'hora_fim',label:'Hora Fim'},
      {id:'valor_total',label:'Valor'},
    ];
    if (!validar(campos)) return;

    const idVal = document.getElementById('inputId').value;
    const payload = {
      banda_id:    parseInt(document.getElementById('banda_id').value),
      usuario_id:  _usuarioId,
      data_ensaio: document.getElementById('data_ensaio').value,
      hora_inicio: document.getElementById('hora_inicio').value,
      hora_fim:    document.getElementById('hora_fim').value,
      valor_total: parseFloat(document.getElementById('valor_total').value) || 0,
      status:      document.getElementById('status_ag').value,
      observacoes: document.getElementById('observacoes').value.trim() || null,
    };

    // Em edição, não re-atribuir usuario_id
    if (idVal) delete payload.usuario_id;

    const { error } = idVal
      ? await db.from('agendamentos').update(payload).eq('id', idVal)
      : await db.from('agendamentos').insert(payload);

    if (error) { showToast('Erro: ' + error.message, 'error'); return; }
    fecharModal('modalOverlay');
    showToast('Agendamento salvo!', 'success');
    await carregar();
  });

  document.getElementById('btnConfirmarDel').addEventListener('click', async () => {
    if (!_deletandoId) return;
    const { error } = await db.from('agendamentos').update({ status: 'cancelado' }).eq('id', _deletandoId);
    if (error) showToast('Erro ao cancelar.', 'error');
    else { showToast('Agendamento cancelado.', 'info'); await carregar(); }
    fecharModal('modalDelOverlay');
    _deletandoId = null;
  });
})();

async function carregar() {
  const banda   = document.getElementById('filtroBanda').value.trim();
  const dataIni = document.getElementById('filtroDataIni').value;
  const dataFim = document.getElementById('filtroDataFim').value;
  const status  = document.getElementById('filtroStatus').value;

  let q = db.from('agendamentos')
    .select('id, data_ensaio, hora_inicio, hora_fim, valor_total, status, observacoes, bandas(nome_banda), perfis(nome)')
    .order('data_ensaio', { ascending: false });

  if (banda)   q = q.ilike('bandas.nome_banda', `%${banda}%`);
  if (dataIni) q = q.gte('data_ensaio', dataIni);
  if (dataFim) q = q.lte('data_ensaio', dataFim);
  if (status)  q = q.eq('status', status);

  const { data, error } = await q;
  if (error) { showToast('Erro ao carregar agendamentos.', 'error'); return; }
  _ags = data ?? [];
  render();
}

function render() {
  const tbody = document.getElementById('tbodyAg');
  if (!_ags.length) {
    tbody.innerHTML = `<tr><td colspan="7" class="empty-state"><i class="fa-regular fa-calendar-xmark"></i> Nenhum agendamento.</td></tr>`;
    return;
  }
  tbody.innerHTML = _ags.map(a => `
    <tr>
      <td><strong>${esc(a.bandas?.nome_banda ?? '—')}</strong></td>
      <td>${fmtData(a.data_ensaio)}</td>
      <td>${fmtHora(a.hora_inicio)} – ${fmtHora(a.hora_fim)}</td>
      <td>${fmtMoeda(a.valor_total)}</td>
      <td>${BADGE[a.status] ?? a.status}</td>
      <td>${esc(a.perfis?.nome ?? '—')}</td>
      <td class="action-btns">
        <button class="btn btn-icon btn-edit"   onclick="editar(${a.id})"><i class="fa-solid fa-pen-to-square"></i></button>
        <button class="btn btn-icon btn-delete" onclick="pedirDel(${a.id},'${esc(a.bandas?.nome_banda??'')}')"><i class="fa-solid fa-ban"></i></button>
      </td>
    </tr>`).join('');
}

function editar(id) {
  const a = _ags.find(x => x.id === id);
  if (!a) return;
  document.getElementById('modalTitulo').textContent = 'Editar Agendamento';
  document.getElementById('inputId').value       = a.id;
  document.getElementById('banda_id').value      = ''; // não editável no select sem banda_id direto
  document.getElementById('data_ensaio').value   = a.data_ensaio;
  document.getElementById('hora_inicio').value   = a.hora_inicio?.slice(0,5) ?? '';
  document.getElementById('hora_fim').value      = a.hora_fim?.slice(0,5) ?? '';
  document.getElementById('valor_total').value   = a.valor_total;
  document.getElementById('status_ag').value     = a.status;
  document.getElementById('observacoes').value   = a.observacoes ?? '';
  abrirModal('modalOverlay');
}

function pedirDel(id, nome) {
  _deletandoId = id;
  document.getElementById('textoConfirmacao').textContent = `Cancelar o agendamento de "${nome}"?`;
  abrirModal('modalDelOverlay');
}

function esc(s) { return String(s??'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
function validar(campos) {
  let ok = true;
  campos.forEach(({id, label}) => {
    const el=document.getElementById(id), err=document.getElementById('err-'+id);
    if(err && !el.value.trim()){err.textContent=label+' obrigatório.'; el.classList.add('input-invalid'); ok=false;}
    else if(err){err.textContent=''; el.classList.remove('input-invalid');}
  });
  return ok;
}
function limparErros(ids){ids.forEach(id=>{const e=document.getElementById('err-'+id),el=document.getElementById(id);if(e)e.textContent='';if(el)el.classList.remove('input-invalid');});}
