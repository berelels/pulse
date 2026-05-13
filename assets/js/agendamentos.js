/**
 * assets/js/agendamentos.js
 * Modais, validação e toasts da página de Agendamentos.
 */

'use strict';

function abrirOverlay(id)  { document.getElementById(id).classList.add('active');    }
function fecharOverlay(id) { document.getElementById(id).classList.remove('active'); }

const camposObrigatorios = ['banda_id', 'data_ensaio', 'hora_inicio', 'hora_fim', 'valor_total'];

// ---- Modal Novo ----
document.getElementById('btnNovoAg').addEventListener('click', function () {
  document.getElementById('modalTitulo').textContent = 'Novo Agendamento';
  document.getElementById('inputAcao').value = 'criar';
  document.getElementById('inputId').value   = '';
  document.getElementById('formAg').reset();
  camposObrigatorios.forEach(function (c) {
    const err = document.getElementById('err-' + c);
    if (err) err.textContent = '';
    document.getElementById(c).classList.remove('input-invalid');
  });
  abrirOverlay('modalOverlay');
});

// ---- Modal Editar (delegação) ----
document.getElementById('tabelaAgendamentos').addEventListener('click', function (e) {
  const btn = e.target.closest('.btn-edit');
  if (!btn) return;
  document.getElementById('modalTitulo').textContent = 'Editar Agendamento';
  document.getElementById('inputAcao').value    = 'editar';
  document.getElementById('inputId').value      = btn.dataset.id;
  document.getElementById('data_ensaio').value  = btn.dataset.data;
  document.getElementById('hora_inicio').value  = btn.dataset.ini;
  document.getElementById('hora_fim').value     = btn.dataset.fim;
  document.getElementById('valor_total').value  = btn.dataset.valor;
  document.getElementById('status_ag').value    = btn.dataset.status;
  document.getElementById('observacoes').value  = btn.dataset.obs;
  abrirOverlay('modalOverlay');
});

document.getElementById('btnFecharModal').addEventListener('click',  () => fecharOverlay('modalOverlay'));
document.getElementById('btnCancelarModal').addEventListener('click', () => fecharOverlay('modalOverlay'));
document.getElementById('modalOverlay').addEventListener('click', function (e) {
  if (e.target === this) fecharOverlay('modalOverlay');
});

// ---- Validação ----
document.getElementById('formAg').addEventListener('submit', function (e) {
  let ok = true;
  camposObrigatorios.forEach(function (c) {
    const el  = document.getElementById(c);
    const err = document.getElementById('err-' + c);
    if (err && !el.value.trim()) {
      err.textContent = 'Campo obrigatório.';
      el.classList.add('input-invalid');
      ok = false;
    } else if (err) {
      err.textContent = '';
      el.classList.remove('input-invalid');
    }
  });
  if (!ok) e.preventDefault();
});

// ---- Modal Cancelamento ----
document.getElementById('tabelaAgendamentos').addEventListener('click', function (e) {
  const btn = e.target.closest('.btn-delete');
  if (!btn) return;
  document.getElementById('inputDelId').value = btn.dataset.id;
  document.getElementById('textoConfirmacao').textContent =
    `Cancelar o agendamento de "${btn.dataset.nome}"? O registro será marcado como cancelado.`;
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
    ok:        ['Agendamento salvo!', 'success'],
    cancelado: ['Agendamento cancelado.', 'info'],
    erro:      ['Erro ao processar.', 'error'],
  };
  const p = JSON.parse(document.getElementById('pageData').textContent);
  if (p.toast && msgs[p.toast]) showToast(...msgs[p.toast]);
})();
