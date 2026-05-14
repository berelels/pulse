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

  // Limpar erros
  camposObrigatorios.forEach(function (c) {
    const err = document.getElementById('err-' + c);
    if (err) err.textContent = '';
    const el = document.getElementById(c);
    if (el) el.classList.remove('input-invalid');
  });

  // Desmarcar todos os equipamentos
  document.querySelectorAll('.equip-checkbox').forEach(cb => cb.checked = false);

  abrirOverlay('modalOverlay');
});

// ---- Modal Editar (delegação) ----
document.getElementById('tabelaAgendamentos').addEventListener('click', function (e) {
  const btn = e.target.closest('.btn-edit');
  if (!btn) return;

  document.getElementById('modalTitulo').textContent = 'Editar Agendamento';
  document.getElementById('inputAcao').value    = 'editar';
  document.getElementById('inputId').value      = btn.dataset.id;

  // Pré-selecionar banda ✅
  const bandaSel = document.getElementById('banda_id');
  if (bandaSel) bandaSel.value = btn.dataset.banda;

  document.getElementById('data_ensaio').value  = btn.dataset.data;
  document.getElementById('hora_inicio').value  = btn.dataset.ini;
  document.getElementById('hora_fim').value     = btn.dataset.fim;
  document.getElementById('valor_total').value  = btn.dataset.valor;
  document.getElementById('status_ag').value    = btn.dataset.status;
  document.getElementById('observacoes').value  = btn.dataset.obs;

  // Pré-selecionar equipamentos ✅
  const equipIds = JSON.parse(btn.dataset.equipamentos || '[]');
  document.querySelectorAll('.equip-checkbox').forEach(function (cb) {
    cb.checked = equipIds.includes(parseInt(cb.dataset.equipId));
  });

  abrirOverlay('modalOverlay');
});

document.getElementById('btnFecharModal').addEventListener('click',  () => fecharOverlay('modalOverlay'));
document.getElementById('btnCancelarModal').addEventListener('click', () => fecharOverlay('modalOverlay'));
document.getElementById('modalOverlay').addEventListener('click', function (e) {
  if (e.target === this) fecharOverlay('modalOverlay');
});

// ---- Cálculo Dinâmico de Valor ----
const valInput = document.getElementById('valor_total');
const precoHora = parseFloat(valInput.dataset.precoHora || 150);

function recalcularValor() {
  const ini = document.getElementById('hora_inicio').value;
  const fim = document.getElementById('hora_fim').value;
  let valor = 0;

  if (ini && fim) {
    const [h1, m1] = ini.split(':').map(Number);
    const [h2, m2] = fim.split(':').map(Number);
    let diff = (h2 + m2/60) - (h1 + m1/60);
    if (diff < 0) diff += 24; // Virou a noite
    valor = diff * precoHora;
  }

  document.querySelectorAll('.equip-checkbox:checked').forEach(cb => {
    valor += parseFloat(cb.dataset.valor || 0);
  });

  if (valor > 0) {
    valInput.value = valor.toFixed(2);
  }
}

document.getElementById('hora_inicio').addEventListener('change', recalcularValor);
document.getElementById('hora_fim').addEventListener('change', recalcularValor);
document.querySelectorAll('.equip-checkbox').forEach(cb => {
  cb.addEventListener('change', recalcularValor);
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
    ok:          ['Agendamento salvo!', 'success'],
    confirmado:  ['Agendamento confirmado!', 'success'],
    concluido:   ['Agendamento concluído!', 'success'],
    cancelado:   ['Agendamento cancelado.', 'info'],
    erro:        ['Erro ao processar.', 'error'],
  };
  const p = JSON.parse(document.getElementById('pageData').textContent);
  if (p.toast && msgs[p.toast]) showToast(...msgs[p.toast]);
})();
