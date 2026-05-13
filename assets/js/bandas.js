/**
 * assets/js/bandas.js
 * Controle dos modais, validação e toasts da página de Bandas.
 */

'use strict';

// ---- Helpers de modal ----

function abrirOverlay(id) {
  document.getElementById(id).classList.add('active');
}
function fecharOverlay(id) {
  document.getElementById(id).classList.remove('active');
}

// ---- Modal Criar / Editar ----

document.getElementById('btnNovaBanda').addEventListener('click', function () {
  document.getElementById('modalTitulo').textContent = 'Nova Banda';
  document.getElementById('inputAcao').value = 'criar';
  document.getElementById('inputId').value   = '';
  document.getElementById('formBanda').reset();
  // limpar erros residuais
  ['nome_banda', 'responsavel'].forEach(function (c) {
    document.getElementById('err-' + c).textContent = '';
    document.getElementById(c).classList.remove('input-invalid');
  });
  abrirOverlay('modalOverlay');
});

// Delegação de clique nos botões de edição da tabela
document.getElementById('tabelaBandas').addEventListener('click', function (e) {
  const btn = e.target.closest('.btn-edit');
  if (!btn) return;

  document.getElementById('modalTitulo').textContent = 'Editar Banda';
  document.getElementById('inputAcao').value  = 'editar';
  document.getElementById('inputId').value    = btn.dataset.id;
  document.getElementById('nome_banda').value = btn.dataset.nome;
  document.getElementById('responsavel').value= btn.dataset.resp;
  document.getElementById('telefone').value   = btn.dataset.tel;
  document.getElementById('genero').value     = btn.dataset.gen;
  abrirOverlay('modalOverlay');
});

document.getElementById('btnFecharModal').addEventListener('click', function () {
  fecharOverlay('modalOverlay');
});
document.getElementById('btnCancelarModal').addEventListener('click', function () {
  fecharOverlay('modalOverlay');
});
document.getElementById('modalOverlay').addEventListener('click', function (e) {
  if (e.target === this) fecharOverlay('modalOverlay');
});

// ---- Validação do formulário ----

document.getElementById('formBanda').addEventListener('submit', function (e) {
  let ok = true;
  ['nome_banda', 'responsavel'].forEach(function (campo) {
    const el  = document.getElementById(campo);
    const err = document.getElementById('err-' + campo);
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

document.getElementById('tabelaBandas').addEventListener('click', function (e) {
  const btn = e.target.closest('.btn-delete');
  if (!btn) return;
  document.getElementById('inputDelId').value = btn.dataset.id;
  document.getElementById('textoConfirmacao').textContent =
    `Deseja excluir a banda "${btn.dataset.nome}"? Esta ação é irreversível.`;
  abrirOverlay('modalDelOverlay');
});

document.getElementById('btnFecharModalDel').addEventListener('click', function () {
  fecharOverlay('modalDelOverlay');
});
document.getElementById('btnCancelarDel').addEventListener('click', function () {
  fecharOverlay('modalDelOverlay');
});
document.getElementById('modalDelOverlay').addEventListener('click', function (e) {
  if (e.target === this) fecharOverlay('modalDelOverlay');
});

// ---- Toasts via parâmetro da URL ----

(function () {
  const msgs = {
    ok:        ['Banda salva com sucesso!', 'success'],
    del:       ['Banda excluída.', 'info'],
    vinculada: ['Esta banda possui agendamentos e não pode ser excluída.', 'warning'],
    erro:      ['Erro ao processar. Tente novamente.', 'error'],
  };
  const p = JSON.parse(document.getElementById('pageData').textContent);
  if (p.toast && msgs[p.toast]) {
    showToast(...msgs[p.toast]);
  }
})();
