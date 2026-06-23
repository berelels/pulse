'use strict';
// ── ROUTER ───────────────────────────────────────────────────────
const PulseRouter = {
  routes: {
    '#login':        viewLogin,
    '#dashboard':    viewDashboard,
    '#bandas':       viewBandas,
    '#equipamentos': viewEquipamentos,
    '#agendamentos': viewAgendamentos,
    '#relatorios':   viewRelatorios,
    '#usuarios':     viewUsuarios,
    '#regras':       viewRegras,
  },
  navigate(hash) {
    const handler = this.routes[hash];
    if (handler) handler();
    else if (hash === '' || hash === '#') {
      if (PulseAuth.current()) window.location.hash = '#dashboard';
      else window.location.hash = '#login';
    }
  },
  init() {
    PulseStore.init();
    window.addEventListener('hashchange', () => {
      if (window.location.hash === '#login' && PulseAuth.current()) {
        PulseAuth.logout();
      }
      this.navigate(window.location.hash);
    });
    const h = window.location.hash || '';
    if (!h || h === '#') {
      window.location.hash = PulseAuth.current() ? '#dashboard' : '#login';
    } else {
      this.navigate(h);
    }
  }
};

document.addEventListener('DOMContentLoaded', () => PulseRouter.init());
