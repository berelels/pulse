/**
 * scripts/script.js — Pulse
 * Global: Supabase client, autenticação, nav, toasts, helpers.
 */

'use strict';

// =============================================================
// CONFIGURAÇÃO SUPABASE — substitua pelos seus valores
// Supabase Dashboard → Settings → API
// =============================================================
const SUPABASE_URL      = 'https://SEU_PROJECT_REF.supabase.co';
const SUPABASE_ANON_KEY = 'SUA_ANON_KEY_AQUI';

const db = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// =============================================================
// AUTENTICAÇÃO
// =============================================================

/** Redireciona para login se não houver sessão ativa. */
async function checkAuth() {
  const { data: { session } } = await db.auth.getSession();
  if (!session) {
    window.location.href = 'index.html';
    return null;
  }
  return session;
}

/** Retorna perfil completo do usuário logado (com is_admin). */
async function getPerfil() {
  const { data: { user } } = await db.auth.getUser();
  if (!user) return null;
  const { data } = await db.from('perfis').select('*').eq('id', user.id).single();
  return data;
}

/** Faz logout e redireciona para login. */
async function sair() {
  await db.auth.signOut();
  window.location.href = 'index.html';
}

// =============================================================
// NAV — renderiza a sidebar em todas as páginas internas
// =============================================================

async function renderNav(paginaAtual) {
  const placeholder = document.getElementById('nav-placeholder');
  if (!placeholder) return;

  const perfil = await getPerfil();
  const inicial = perfil?.nome ? perfil.nome.charAt(0).toUpperCase() : '?';

  const items = [
    { href: 'dashboard.html',    icon: 'fa-gauge-high',       label: 'Dashboard'     },
    { href: 'agendamentos.html', icon: 'fa-calendar-days',    label: 'Agendamentos'  },
    { href: 'bandas.html',       icon: 'fa-guitar',           label: 'Bandas'        },
    { href: 'equipamentos.html', icon: 'fa-microphone-lines', label: 'Equipamentos'  },
    { href: 'relatorios.html',   icon: 'fa-chart-line',       label: 'Relatórios'    },
  ];

  if (perfil?.is_admin) {
    items.push({ href: 'usuarios.html', icon: 'fa-users-gear', label: 'Usuários' });
  }

  const navItems = items.map(item => {
    const ativo = window.location.pathname.endsWith(item.href) ? 'active' : '';
    return `<a href="${item.href}" class="nav-item ${ativo}">
      <i class="fa-solid ${item.icon}"></i><span>${item.label}</span>
    </a>`;
  }).join('');

  placeholder.innerHTML = `
    <aside class="sidebar glass">
      <div class="sidebar-logo">
        <i class="fa-solid fa-circle-waveform-lines"></i>
        <span>Pulse</span>
      </div>
      <nav class="sidebar-nav">${navItems}</nav>
      <div class="sidebar-footer">
        <div class="user-chip">
          <div class="user-avatar">${inicial}</div>
          <div class="user-info">
            <span class="user-name">${perfil?.nome ?? 'Usuário'}</span>
            <span class="user-role">${perfil?.is_admin ? 'Administrador' : 'Colaborador'}</span>
          </div>
        </div>
        <button class="btn-logout" id="btnLogout" title="Sair">
          <i class="fa-solid fa-arrow-right-from-bracket"></i>
        </button>
      </div>
    </aside>`;

  document.getElementById('btnLogout').addEventListener('click', sair);
}

// =============================================================
// TOASTS
// =============================================================

function showToast(mensagem, tipo = 'info', duracao = 3500) {
  const container = document.getElementById('toast-container');
  if (!container) return;
  const icones = { success: 'fa-circle-check', error: 'fa-circle-exclamation', warning: 'fa-triangle-exclamation', info: 'fa-circle-info' };
  const toast = document.createElement('div');
  toast.className = `toast toast-${tipo}`;
  toast.innerHTML = `
    <i class="fa-solid ${icones[tipo] || icones.info}"></i>
    <span>${mensagem}</span>
    <button class="toast-close" onclick="this.parentElement.remove()"><i class="fa-solid fa-xmark"></i></button>`;
  container.appendChild(toast);
  requestAnimationFrame(() => toast.classList.add('toast-visible'));
  setTimeout(() => {
    toast.classList.remove('toast-visible');
    toast.addEventListener('transitionend', () => toast.remove(), { once: true });
  }, duracao);
}

// =============================================================
// MODAIS — helpers genéricos
// =============================================================

function abrirModal(id) { document.getElementById(id).classList.add('active'); }
function fecharModal(id) { document.getElementById(id).classList.remove('active'); }

function bindFecharModal(overlayId, ...btnIds) {
  const overlay = document.getElementById(overlayId);
  if (!overlay) return;
  overlay.addEventListener('click', e => { if (e.target === overlay) fecharModal(overlayId); });
  btnIds.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('click', () => fecharModal(overlayId));
  });
}

// ESC fecha todos os modais abertos
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    document.querySelectorAll('.modal-overlay.active').forEach(o => o.classList.remove('active'));
  }
});

// =============================================================
// FORMATAÇÃO
// =============================================================

function fmtData(iso) {
  if (!iso) return '—';
  const [y, m, d] = iso.split('-');
  return `${d}/${m}/${y}`;
}

function fmtHora(h) { return h ? h.slice(0, 5) : '—'; }

function fmtMoeda(v) {
  return Number(v || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

const BADGE = {
  confirmado: '<span class="badge badge-confirmado">Confirmado</span>',
  concluido:  '<span class="badge badge-concluido">Concluído</span>',
  pendente:   '<span class="badge badge-pendente">Pendente</span>',
  cancelado:  '<span class="badge badge-cancelado">Cancelado</span>',
  disponivel: '<span class="badge badge-confirmado">Disponível</span>',
  manutencao: '<span class="badge badge-cancelado">Manutenção</span>',
};

// =============================================================
// ANIMAÇÃO DE ENTRADA NOS CARDS
// =============================================================

document.addEventListener('DOMContentLoaded', () => {
  if (!('IntersectionObserver' in window)) return;
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('card-visible'); obs.unobserve(e.target); } });
  }, { threshold: 0.1 });
  document.querySelectorAll('.kpi-card, .section-card').forEach(c => obs.observe(c));
});
