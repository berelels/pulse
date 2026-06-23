'use strict';
// ── UI HELPERS ───────────────────────────────────────────────────
function showToast(msg, tipo='info', dur=3500) {
  const c = document.getElementById('toast-container');
  if (!c) return;
  const icons = { success:'fa-circle-check', error:'fa-circle-exclamation', warning:'fa-triangle-exclamation', info:'fa-circle-info' };
  const t = document.createElement('div');
  t.className = `toast toast-${tipo}`;
  t.innerHTML = `<i class="fa-solid ${icons[tipo]||icons.info}"></i><span>${msg}</span><button class="toast-close" onclick="this.parentElement.remove()"><i class="fa-solid fa-xmark"></i></button>`;
  c.appendChild(t);
  requestAnimationFrame(() => t.classList.add('toast-visible'));
  setTimeout(() => { t.classList.remove('toast-visible'); t.addEventListener('transitionend', () => t.remove(), {once:true}); }, dur);
}

function fmtDate(d) {
  if (!d) return '—';
  const [y,m,day] = d.split('-');
  return `${day}/${m}/${y}`;
}
function fmtMoney(v) { return 'R$ ' + parseFloat(v||0).toFixed(2).replace('.',',').replace(/\B(?=(\d{3})+(?!\d))/g,'.'); }
function fmtTime(t) { return t ? t.slice(0,5) : '—'; }

function openModal(id) { document.getElementById(id).classList.add('active'); }
function closeModal(id) { document.getElementById(id).classList.remove('active'); }

function badgeHtml(status) {
  const map = { confirmado:'badge-confirmado',concluido:'badge-concluido',pendente:'badge-pendente',cancelado:'badge-cancelado',disponivel:'badge-confirmado',manutencao:'badge-cancelado' };
  const labels = { confirmado:'Confirmado',concluido:'Concluído',pendente:'Pendente',cancelado:'Cancelado',disponivel:'Disponível',manutencao:'Manutenção' };
  return `<span class="badge ${map[status]||''}">${labels[status]||status}</span>`;
}

function initTheme() {
  const saved = localStorage.getItem('pulse_theme') || 'escuro';
  document.documentElement.setAttribute('data-theme', saved);
  const btn = document.getElementById('theme-toggle');
  if (btn) {
    const icon = btn.querySelector('i');
    if (icon) icon.className = saved === 'escuro' ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
    btn.onclick = () => {
      const cur = document.documentElement.getAttribute('data-theme') || 'escuro';
      const next = cur === 'escuro' ? 'claro' : 'escuro';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('pulse_theme', next);
      const i = btn.querySelector('i');
      if (i) i.className = next === 'escuro' ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
    };
  }
}

function animateCards() {
  if (!('IntersectionObserver' in window)) {
    document.querySelectorAll('.kpi-card,.section-card').forEach(c => c.classList.add('card-visible'));
    return;
  }
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('card-visible'); obs.unobserve(e.target); } });
  }, {threshold:0.1});
  document.querySelectorAll('.kpi-card,.section-card').forEach(c => obs.observe(c));
}

function renderNav(page) {
  const u = PulseAuth.current();
  if (!u) return '';
  const items = [
    {href:'#dashboard',page:'dashboard',icon:'fa-gauge-high',label:'Dashboard'},
  ];
  if (u.is_admin || (u.permissoes||[]).includes('agendamentos'))
    items.push({href:'#agendamentos',page:'agendamentos',icon:'fa-calendar-days',label:'Agendamentos'});
  if (u.is_admin || (u.permissoes||[]).includes('bandas'))
    items.push({href:'#bandas',page:'bandas',icon:'fa-guitar',label:'Bandas'});
  if (u.is_admin || (u.permissoes||[]).includes('equipamentos'))
    items.push({href:'#equipamentos',page:'equipamentos',icon:'fa-microphone-lines',label:'Equipamentos'});
  if (u.is_admin || (u.permissoes||[]).includes('relatorios'))
    items.push({href:'#relatorios',page:'relatorios',icon:'fa-chart-line',label:'Relatórios'});
  if (u.is_admin) {
    items.push({href:'#usuarios',page:'usuarios',icon:'fa-users-gear',label:'Usuários'});
    items.push({href:'#regras',page:'regras',icon:'fa-sliders',label:'Regras'});
  }
  const tabs = items.map(it => `
    <a href="${it.href}" class="di-tab ${page===it.page?'di-tab--active':''}" title="${it.label}">
      <i class="fa-solid ${it.icon}"></i>
      <span class="di-tab-label">${it.label}</span>
    </a>`).join('');
  const ini = u.nome.charAt(0).toUpperCase();
  const first = u.nome.split(' ')[0];
  return `
  <header class="di-wrapper">
    <nav class="dynamic-island" id="dynamicIsland">
      <div class="di-brand"><img src="assets/img/pulse_logo1.svg" alt="Pulse" style="height:22px"></div>
      <div class="di-divider"></div>
      <div class="di-tabs">${tabs}</div>
      <div class="di-divider"></div>
      <div class="di-user">
        <div class="di-avatar">${ini}</div>
        <span class="di-username">${first}</span>
        <a href="#login" id="btnLogout" class="di-logout" title="Sair"><i class="fa-solid fa-arrow-right-from-bracket"></i></a>
      </div>
    </nav>
  </header>`;
}
