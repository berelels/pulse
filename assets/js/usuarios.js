/**
 * assets/js/usuarios.js
 * Modais, validação e toasts da página de Usuários.
 */

'use strict';

let _modoEdicao = false;

function abrirOverlay(id)  { document.getElementById(id).classList.add('active');    }
function fecharOverlay(id) { document.getElementById(id).classList.remove('active'); }

// ---- Modal Novo ----
document.getElementById('btnNovoUser').addEventListener('click', function () {
  _modoEdicao = false;
  document.getElementById('modalTitulo').textContent = 'Novo Usuário';
  document.getElementById('inputAcao').value  = 'criar';
  document.getElementById('inputId').value    = '';
  document.getElementById('formUser').reset();
  document.getElementById('labelSenhaHint').style.display = 'none';
  ['nome', 'email', 'senha'].forEach(function (c) {
    const err = document.getElementById('err-' + c);
    if (err) err.textContent = '';
    document.getElementById(c).classList.remove('input-invalid');
  });
  abrirOverlay('modalOverlay');
});

// ---- Modal Editar (delegação) ----
document.querySelector('.data-table').addEventListener('click', function (e) {
  const btn = e.target.closest('.btn-edit');
  if (!btn) return;
  _modoEdicao = true;
  document.getElementById('modalTitulo').textContent = 'Editar Usuário';
  document.getElementById('inputAcao').value   = 'editar';
  document.getElementById('inputId').value     = btn.dataset.id;
  document.getElementById('nome').value        = btn.dataset.nome;
  document.getElementById('email').value       = btn.dataset.email;
  document.getElementById('senha').value       = '';
  document.getElementById('is_admin').checked  = btn.dataset.admin === '1';
  document.getElementById('labelSenhaHint').style.display = 'inline';
  abrirOverlay('modalOverlay');
});

document.getElementById('btnFecharModal').addEventListener('click',  () => fecharOverlay('modalOverlay'));
document.getElementById('btnCancelarModal').addEventListener('click', () => fecharOverlay('modalOverlay'));
document.getElementById('modalOverlay').addEventListener('click', function (e) {
  if (e.target === this) fecharOverlay('modalOverlay');
});

// ---- Validação ----
document.getElementById('formUser').addEventListener('submit', function (e) {
  let ok = true;

  ['nome', 'email'].forEach(function (c) {
    const el  = document.getElementById(c);
    const err = document.getElementById('err-' + c);
    if (!el.value.trim()) {
      err.textContent = 'Campo obrigatório.';
      el.classList.add('input-invalid');
      ok = false;
    } else {
      err.textContent = '';
      el.classList.remove('input-invalid');
    }
  });

  const senhaEl  = document.getElementById('senha');
  const senhaErr = document.getElementById('err-senha');
  if (!_modoEdicao && senhaEl.value.length < 6) {
    senhaErr.textContent = 'Mínimo 6 caracteres.';
    senhaEl.classList.add('input-invalid');
    ok = false;
  } else {
    senhaErr.textContent = '';
    senhaEl.classList.remove('input-invalid');
  }

  if (!ok) e.preventDefault();
});

// ---- Modal Exclusão ----
document.querySelector('.data-table').addEventListener('click', function (e) {
  const btn = e.target.closest('.btn-delete');
  if (!btn) return;
  document.getElementById('inputDelId').value = btn.dataset.id;
  document.getElementById('textoConfirmacao').textContent =
    `Excluir o usuário "${btn.dataset.nome}"? Esta ação é permanente.`;
  abrirOverlay('modalDelOverlay');
});
document.getElementById('btnFecharModalDel').addEventListener('click',  () => fecharOverlay('modalDelOverlay'));
document.getElementById('btnCancelarDel').addEventListener('click',     () => fecharOverlay('modalDelOverlay'));
document.getElementById('modalDelOverlay').addEventListener('click', function (e) {
  if (e.target === this) fecharOverlay('modalDelOverlay');
});

// ---- Toasts ----
(function () {
  const msgs = {
    ok:   ['Usuário salvo!', 'success'],
    del:  ['Usuário excluído.', 'info'],
    erro: ['Erro ao processar.', 'error'],
  };
  const p = JSON.parse(document.getElementById('pageData').textContent);
  if (p.toast && msgs[p.toast]) showToast(...msgs[p.toast]);
})();
