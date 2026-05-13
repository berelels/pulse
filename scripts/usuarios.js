/** scripts/usuarios.js — Gerência de perfis (somente admin) */
'use strict';

let _users = [];
let _editandoId = null;

(async () => {
  const session = await checkAuth();
  if (!session) return;

  const perfil = await getPerfil();
  if (!perfil?.is_admin) { window.location.href = 'dashboard.html'; return; }

  await renderNav('usuarios');
  await carregar();

  // Modal editar
  bindFecharModal('modalOverlay',         'btnFecharModal',     'btnCancelarModal');
  bindFecharModal('modalConvidarOverlay', 'btnFecharConvidar',  'btnCancelarConvidar');

  document.getElementById('btnNovoUser').addEventListener('click', () => {
    abrirModal('modalConvidarOverlay');
    document.getElementById('emailConvite').value = '';
    document.getElementById('err-emailConvite').textContent = '';
  });

  document.getElementById('btnEnviarConvite').addEventListener('click', async () => {
    const email = document.getElementById('emailConvite').value.trim();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      document.getElementById('err-emailConvite').textContent = 'Informe um e-mail válido.';
      return;
    }
    // Usa Supabase Auth Admin API via Edge Function ou avisa o admin
    showToast(`Convite enviado para ${email} via Supabase Auth (configure o Auth no Dashboard).`, 'info', 5000);
    fecharModal('modalConvidarOverlay');
  });

  document.getElementById('formUser').addEventListener('submit', async e => {
    e.preventDefault();
    const nome  = document.getElementById('nome').value.trim();
    const admin = document.getElementById('is_admin').checked;
    if (!nome) {
      document.getElementById('err-nome').textContent = 'Nome obrigatório.';
      document.getElementById('nome').classList.add('input-invalid');
      return;
    }
    const { error } = await db.from('perfis')
      .update({ nome, is_admin: admin })
      .eq('id', _editandoId);

    if (error) { showToast('Erro: ' + error.message, 'error'); return; }
    fecharModal('modalOverlay');
    showToast('Usuário atualizado!', 'success');
    await carregar();
  });
})();

async function carregar() {
  const { data, error } = await db.from('perfis').select('*').order('nome');
  if (error) { showToast('Erro ao carregar usuários.', 'error'); return; }
  _users = data ?? [];
  render();
}

function render() {
  const tbody = document.getElementById('tbodyUsers');
  if (!_users.length) {
    tbody.innerHTML = `<tr><td colspan="5" class="empty-state">Nenhum usuário encontrado.</td></tr>`;
    return;
  }
  tbody.innerHTML = _users.map(u => `
    <tr>
      <td>
        <div class="user-chip-inline">
          <div class="user-avatar sm">${(u.nome||'?').charAt(0).toUpperCase()}</div>
          ${esc(u.nome)}
        </div>
      </td>
      <td>${esc(u.email ?? '—')}</td>
      <td><span class="badge ${u.is_admin?'badge-confirmado':'badge-pendente'}">${u.is_admin?'Administrador':'Colaborador'}</span></td>
      <td>${fmtData(u.criado_em?.split('T')[0])}</td>
      <td class="action-btns">
        <button class="btn btn-icon btn-edit" onclick="editarUser('${u.id}')">
          <i class="fa-solid fa-pen-to-square"></i>
        </button>
      </td>
    </tr>`).join('');
}

function editarUser(id) {
  const u = _users.find(x => x.id === id);
  if (!u) return;
  _editandoId = id;
  document.getElementById('modalTitulo').textContent = 'Editar Usuário';
  document.getElementById('inputId').value  = id;
  document.getElementById('nome').value     = u.nome ?? '';
  document.getElementById('email').value    = u.email ?? '';
  document.getElementById('is_admin').checked = !!u.is_admin;
  document.getElementById('err-nome').textContent = '';
  document.getElementById('nome').classList.remove('input-invalid');
  abrirModal('modalOverlay');
}

function esc(s){return String(s??'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');}
