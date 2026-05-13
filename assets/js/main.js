/**
 * PULSE — assets/js/main.js
 * Funções globais: toasts, validações reutilizáveis e utilitários.
 */

'use strict';

// =============================================================
// TOAST NOTIFICATIONS
// =============================================================

/**
 * Exibe uma notificação toast na tela.
 * @param {string} mensagem - Texto a exibir.
 * @param {'success'|'error'|'info'|'warning'} tipo - Tipo visual do toast.
 * @param {number} duracao - Tempo em ms antes de desaparecer (padrão 3500ms).
 */
function showToast(mensagem, tipo = 'info', duracao = 3500) {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const icones = {
    success: 'fa-circle-check',
    error:   'fa-circle-exclamation',
    warning: 'fa-triangle-exclamation',
    info:    'fa-circle-info',
  };

  const toast = document.createElement('div');
  toast.className = `toast toast-${tipo}`;
  toast.innerHTML = `
    <i class="fa-solid ${icones[tipo] || icones.info}"></i>
    <span>${mensagem}</span>
    <button class="toast-close" onclick="this.parentElement.remove()">
      <i class="fa-solid fa-xmark"></i>
    </button>
  `;

  container.appendChild(toast);

  // Acionar animação de entrada
  requestAnimationFrame(() => toast.classList.add('toast-visible'));

  // Remover automaticamente após 'duracao' ms
  setTimeout(() => {
    toast.classList.remove('toast-visible');
    toast.addEventListener('transitionend', () => toast.remove(), { once: true });
  }, duracao);
}


// =============================================================
// VALIDAÇÕES REUTILIZÁVEIS
// =============================================================

/**
 * Valida se um campo de texto não está vazio.
 * Retorna true se válido, false se inválido (e marca o campo).
 */
function validarCampoObrigatorio(campoId, erroId) {
  const el  = document.getElementById(campoId);
  const err = document.getElementById(erroId);
  if (!el) return true;

  if (!el.value.trim()) {
    if (err) err.textContent = 'Campo obrigatório.';
    el.classList.add('input-invalid');
    return false;
  }
  if (err) err.textContent = '';
  el.classList.remove('input-invalid');
  return true;
}

/**
 * Valida formato de e-mail.
 */
function validarEmail(campoId, erroId) {
  const el  = document.getElementById(campoId);
  const err = document.getElementById(erroId);
  if (!el) return true;

  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!regex.test(el.value.trim())) {
    if (err) err.textContent = 'Informe um e-mail válido.';
    el.classList.add('input-invalid');
    return false;
  }
  if (err) err.textContent = '';
  el.classList.remove('input-invalid');
  return true;
}


// =============================================================
// NAVEGAÇÃO LATERAL (MOBILE TOGGLE)
// =============================================================

document.addEventListener('DOMContentLoaded', function () {
  // Fechar modais com ESC
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal-overlay.active').forEach(function (overlay) {
        overlay.classList.remove('active');
      });
    }
  });

  // Animar KPI cards ao entrar na tela
  if ('IntersectionObserver' in window) {
    const cards = document.querySelectorAll('.kpi-card, .section-card');
    const obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('card-visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    cards.forEach(function (c) { obs.observe(c); });
  }
});
