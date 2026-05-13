/**
 * assets/js/equipamentos.js
 * Controle dos modais, validação e toasts da página de Equipamentos.
 */

'use strict';

function abrirOverlay(id)  { document.getElementById(id).classList.add('active');    }
function fecharOverlay(id) { document.getElementById(id).classList.remove('active'); }

// ---- Modal Criar ----
document.getElementById('btnNovoEquip').addEventListener('click', function () {
  document.getElementById('modalTitulo').textContent = 'Novo Equipamento';
  document.getElementById('inputAcao').value  = 'criar';
  document.getElementById('inputId').value    = '';
  document.getElementById('formEquip').reset();
  ['nome', 'valor_locacao'].forEach(function (c) {
    document.getElementById('err-' + c).textContent = '';
    document.getElementById(c).classList.remove('input-invalid');
  });
  abrirOverlay('modalOverlay');
});

// ---- Modal Editar (delegação) ----
document.querySelector('.data-table').addEventListener('click', function (e) {
  const btn = e.target.closest('.btn-edit');
  if (!btn) return;
  document.getElementById('modalTitulo').textContent = 'Editar Equipamento';
  document.getElementById('inputAcao').value     = 'editar';
  document.getElementById('inputId').value       = btn.dataset.id;
  document.getElementById('nome').value          = btn.dataset.nome;
  document.getElementById('descricao').value     = btn.dataset.desc;
  document.getElementById('valor_locacao').value = btn.dataset.valor;
  document.getElementById('status').value        = btn.dataset.status;
  abrirOverlay('modalOverlay');
});

document.getElementById('btnFecharModal').addEventListener('click',  () => fecharOverlay('modalOverlay'));
document.getElementById('btnCancelarModal').addEventListener('click', () => fecharOverlay('modalOverlay'));
document.getElementById('modalOverlay').addEventListener('click', function (e) {
  if (e.target === this) fecharOverlay('modalOverlay');
});

// ---- Validação ----
document.getElementById('formEquip').addEventListener('submit', function (e) {
  let ok = true;
  ['nome', 'valor_locacao'].forEach(function (c) {
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
  if (!ok) e.preventDefault();
});

// ---- Modal Exclusão ----
document.querySelector('.data-table').addEventListener('click', function (e) {
  const btn = e.target.closest('.btn-delete');
  if (!btn) return;
  document.getElementById('inputDelId').value = btn.dataset.id;
  document.getElementById('textoConfirmacao').textContent =
    `Excluir o equipamento "${btn.dataset.nome}"?`;
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
    ok:   ['Equipamento salvo!', 'success'],
    del:  ['Equipamento excluído.', 'info'],
    erro: ['Erro ao processar.', 'error'],
  };
  const p = JSON.parse(document.getElementById('pageData').textContent);
  if (p.toast && msgs[p.toast]) showToast(...msgs[p.toast]);
})();
