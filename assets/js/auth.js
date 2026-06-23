'use strict';
// ── AUTH ─────────────────────────────────────────────────────────
const PulseAuth = {
  login(email, senha) {
    const u = PulseStore.getAll('usuarios').find(u => u.email === email && u.senha === senha);
    if (!u) return false;
    localStorage.setItem('pulse_session', JSON.stringify({ id: u.id, nome: u.nome, email: u.email, is_admin: u.is_admin, permissoes: u.permissoes, tema: u.tema }));
    return true;
  },
  logout() { localStorage.removeItem('pulse_session'); },
  current() {
    const s = localStorage.getItem('pulse_session');
    return s ? JSON.parse(s) : null;
  },
  check() {
    if (!this.current()) { window.location.hash = '#login'; return false; }
    return true;
  },
  hasPermission(perm) {
    const u = this.current();
    if (!u) return false;
    if (u.is_admin) return true;
    const perms = u.permissoes || [];
    return perms.includes(perm);
  }
};
