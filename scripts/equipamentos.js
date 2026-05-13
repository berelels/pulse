/** scripts/equipamentos.js — CRUD completo de Equipamentos */
'use strict';

let _equips = [];
let _deletandoId = null;

(async () => {
  await checkAuth();
  await renderNav('equipamentos');
  await carregar();

  document.getElementById('btnBuscar').addEventListener('click', carregar);
  document.getElementById('btnLimpar').addEventListener('click', () => {
    document.getElementById('campoBusca').value = '';
    document.getElementById('filtroStatus').value = '';
    carregar();
  });

  document.getElementById('btnNovoEquip').addEventListener('click', () => {
    document.getElementById('modalTitulo').textContent = 'Novo Equipamento';
    document.getElementById('inputId').value = '';
    document.getElementById('formEquip').reset();
    limparErros(['nome','valor_locacao']);
    abrirModal('modalOverlay');
  });

  bindFecharModal('modalOverlay',    'btnFecharModal',    'btnCancelarModal');
  bindFecharModal('modalDelOverlay', 'btnFecharModalDel', 'btnCancelarDel');

  document.getElementById('formEquip').addEventListener('submit', async e => {
    e.preventDefault();
    if (!validar([{id:'nome',label:'Nome'},{id:'valor_locacao',label:'Valor'}])) return;

    const payload = {
      nome:          document.getElementById('nome').value.trim(),
      descricao:     document.getElementById('descricao').value.trim() || null,
      valor_locacao: parseFloat(document.getElementById('valor_locacao').value) || 0,
      status:        document.getElementById('status').value,
    };

    const idVal = document.getElementById('inputId').value;
    const { error } = idVal
      ? await db.from('equipamentos').update(payload).eq('id', idVal)
      : await db.from('equipamentos').insert(payload);

    if (error) { showToast('Erro: ' + error.message, 'error'); return; }
    fecharModal('modalOverlay');
    showToast('Equipamento salvo!', 'success');
    await carregar();
  });

  document.getElementById('btnConfirmarDel').addEventListener('click', async () => {
    if (!_deletandoId) return;
    const { error } = await db.from('equipamentos').delete().eq('id', _deletandoId);
    if (error) showToast('Erro ao excluir.', 'error');
    else { showToast('Equipamento excluído.', 'info'); await carregar(); }
    fecharModal('modalDelOverlay');
    _deletandoId = null;
  });
})();

async function carregar() {
  const busca  = document.getElementById('campoBusca').value.trim();
  const status = document.getElementById('filtroStatus').value;
  let q = db.from('equipamentos').select('*').order('nome');
  if (busca)  q = q.ilike('nome', `%${busca}%`);
  if (status) q = q.eq('status', status);

  const { data, error } = await q;
  if (error) { showToast('Erro ao carregar.', 'error'); return; }
  _equips = data ?? [];
  render();
}

function render() {
  const tbody = document.getElementById('tbodyEquip');
  if (!_equips.length) {
    tbody.innerHTML = `<tr><td colspan="6" class="empty-state"><i class="fa-solid fa-box-open"></i> Nenhum equipamento.</td></tr>`;
    return;
  }
  tbody.innerHTML = _equips.map(eq => `
    <tr>
      <td>${eq.id}</td>
      <td><strong>${esc(eq.nome)}</strong></td>
      <td>${esc(eq.descricao ?? '—')}</td>
      <td>${fmtMoeda(eq.valor_locacao)}</td>
      <td>${BADGE[eq.status] ?? eq.status}</td>
      <td class="action-btns">
        <button class="btn btn-icon btn-edit"   onclick="editar(${eq.id})"><i class="fa-solid fa-pen-to-square"></i></button>
        <button class="btn btn-icon btn-delete" onclick="pedirDel(${eq.id},'${esc(eq.nome)}')"><i class="fa-solid fa-trash"></i></button>
      </td>
    </tr>`).join('');
}

function editar(id) {
  const eq = _equips.find(x => x.id === id);
  if (!eq) return;
  document.getElementById('modalTitulo').textContent = 'Editar Equipamento';
  document.getElementById('inputId').value       = eq.id;
  document.getElementById('nome').value          = eq.nome;
  document.getElementById('descricao').value     = eq.descricao ?? '';
  document.getElementById('valor_locacao').value = eq.valor_locacao;
  document.getElementById('status').value        = eq.status;
  limparErros(['nome','valor_locacao']);
  abrirModal('modalOverlay');
}

function pedirDel(id, nome) {
  _deletandoId = id;
  document.getElementById('textoConfirmacao').textContent = `Excluir "${nome}"?`;
  abrirModal('modalDelOverlay');
}

function esc(s) { return String(s ?? '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
function validar(campos) {
  let ok = true;
  campos.forEach(({ id, label }) => {
    const el = document.getElementById(id), err = document.getElementById('err-' + id);
    if (!el.value.trim()) { err.textContent = `${label} é obrigatório.`; el.classList.add('input-invalid'); ok = false; }
    else { err.textContent = ''; el.classList.remove('input-invalid'); }
  });
  return ok;
}
function limparErros(ids) { ids.forEach(id => { const e=document.getElementById('err-'+id),el=document.getElementById(id); if(e) e.textContent=''; if(el) el.classList.remove('input-invalid'); }); }
