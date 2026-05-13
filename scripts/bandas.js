/** scripts/bandas.js — CRUD completo de Bandas via Supabase */
'use strict';

let _bandas = [];
let _deletandoId = null;

(async () => {
  await checkAuth();
  await renderNav('bandas');
  await carregarBandas();

  // Busca
  document.getElementById('btnBuscar').addEventListener('click', carregarBandas);
  document.getElementById('campoBusca').addEventListener('keydown', e => { if (e.key === 'Enter') carregarBandas(); });
  document.getElementById('btnLimpar').addEventListener('click', () => {
    document.getElementById('campoBusca').value = '';
    carregarBandas();
  });

  // Modal Criar
  document.getElementById('btnNovaBanda').addEventListener('click', () => {
    document.getElementById('modalTitulo').textContent = 'Nova Banda';
    document.getElementById('inputId').value = '';
    document.getElementById('formBanda').reset();
    limparErros(['nome_banda','responsavel']);
    abrirModal('modalOverlay');
  });

  // Fechar modais
  bindFecharModal('modalOverlay', 'btnFecharModal', 'btnCancelarModal');
  bindFecharModal('modalDelOverlay', 'btnFecharModalDel', 'btnCancelarDel');

  // Submit salvar
  document.getElementById('formBanda').addEventListener('submit', async e => {
    e.preventDefault();
    if (!validar([{id:'nome_banda',label:'Nome da Banda'},{id:'responsavel',label:'Responsável'}])) return;

    const payload = {
      nome_banda:  document.getElementById('nome_banda').value.trim(),
      responsavel: document.getElementById('responsavel').value.trim(),
      telefone:    document.getElementById('telefone').value.trim() || null,
      genero:      document.getElementById('genero').value.trim()   || null,
    };

    const idVal = document.getElementById('inputId').value;
    const { error } = idVal
      ? await db.from('bandas').update(payload).eq('id', idVal)
      : await db.from('bandas').insert(payload);

    if (error) { showToast('Erro ao salvar: ' + error.message, 'error'); return; }

    fecharModal('modalOverlay');
    showToast('Banda salva com sucesso!', 'success');
    await carregarBandas();
  });

  // Confirmar exclusão
  document.getElementById('btnConfirmarDel').addEventListener('click', async () => {
    if (!_deletandoId) return;
    const { error } = await db.from('bandas').delete().eq('id', _deletandoId);
    if (error) { showToast('Não é possível excluir: banda possui agendamentos.', 'warning'); }
    else        { showToast('Banda excluída.', 'info'); await carregarBandas(); }
    fecharModal('modalDelOverlay');
    _deletandoId = null;
  });
})();

async function carregarBandas() {
  const busca = document.getElementById('campoBusca').value.trim();
  let query = db.from('bandas').select('*').order('nome_banda');
  if (busca) query = query.or(`nome_banda.ilike.%${busca}%,responsavel.ilike.%${busca}%`);

  const { data, error } = await query;
  if (error) { showToast('Erro ao carregar bandas.', 'error'); return; }
  _bandas = data ?? [];
  renderTabela();
}

function renderTabela() {
  const tbody = document.getElementById('tbodyBandas');
  if (!_bandas.length) {
    tbody.innerHTML = `<tr><td colspan="7" class="empty-state"><i class="fa-solid fa-face-meh"></i> Nenhuma banda encontrada.</td></tr>`;
    return;
  }
  tbody.innerHTML = _bandas.map(b => `
    <tr>
      <td>${b.id}</td>
      <td><strong>${esc(b.nome_banda)}</strong></td>
      <td>${esc(b.responsavel)}</td>
      <td>${esc(b.telefone ?? '—')}</td>
      <td>${esc(b.genero ?? '—')}</td>
      <td>${fmtData(b.criado_em?.split('T')[0])}</td>
      <td class="action-btns">
        <button class="btn btn-icon btn-edit"   title="Editar"  onclick="editarBanda(${b.id})"><i class="fa-solid fa-pen-to-square"></i></button>
        <button class="btn btn-icon btn-delete" title="Excluir" onclick="pedirExclusao(${b.id},'${esc(b.nome_banda)}')"><i class="fa-solid fa-trash"></i></button>
      </td>
    </tr>`).join('');
}

function editarBanda(id) {
  const b = _bandas.find(x => x.id === id);
  if (!b) return;
  document.getElementById('modalTitulo').textContent = 'Editar Banda';
  document.getElementById('inputId').value      = b.id;
  document.getElementById('nome_banda').value   = b.nome_banda;
  document.getElementById('responsavel').value  = b.responsavel;
  document.getElementById('telefone').value     = b.telefone ?? '';
  document.getElementById('genero').value       = b.genero ?? '';
  limparErros(['nome_banda','responsavel']);
  abrirModal('modalOverlay');
}

function pedirExclusao(id, nome) {
  _deletandoId = id;
  document.getElementById('textoConfirmacao').textContent = `Deseja excluir "${nome}"? Esta ação é irreversível.`;
  abrirModal('modalDelOverlay');
}

// Helpers locais
function esc(s) { return String(s ?? '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }

function validar(campos) {
  let ok = true;
  campos.forEach(({ id, label }) => {
    const el  = document.getElementById(id);
    const err = document.getElementById('err-' + id);
    if (!el.value.trim()) {
      err.textContent = `${label} é obrigatório.`;
      el.classList.add('input-invalid'); ok = false;
    } else { err.textContent = ''; el.classList.remove('input-invalid'); }
  });
  return ok;
}

function limparErros(ids) {
  ids.forEach(id => {
    const err = document.getElementById('err-' + id);
    const el  = document.getElementById(id);
    if (err) err.textContent = '';
    if (el)  el.classList.remove('input-invalid');
  });
}
