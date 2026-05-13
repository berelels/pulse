/** scripts/login.js — Autenticação via Supabase Auth */
'use strict';

const formLogin    = document.getElementById('formLogin');
const btnLogin     = document.getElementById('btnLogin');
const btnLoginText = document.getElementById('btnLoginText');
const btnLoginIcon = document.getElementById('btnLoginIcon');
const btnSpinner   = document.getElementById('btnLoginSpinner');
const alertErro    = document.getElementById('alertErro');

// Redireciona se já logado
db.auth.getSession().then(({ data: { session } }) => {
  if (session) window.location.href = 'dashboard.html';
});

// Toggle senha
document.getElementById('btnToggleSenha').addEventListener('click', () => {
  const campo = document.getElementById('senha');
  const icone = document.getElementById('iconeOlho');
  campo.type  = campo.type === 'password' ? 'text' : 'password';
  icone.className = campo.type === 'password' ? 'fa-regular fa-eye' : 'fa-regular fa-eye-slash';
});

// Validação + Submit
formLogin.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('email').value.trim();
  const senha  = document.getElementById('senha').value;

  // Validação frontend
  let ok = true;
  document.getElementById('err-email').textContent = '';
  document.getElementById('err-senha').textContent = '';
  alertErro.style.display = 'none';

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    document.getElementById('err-email').textContent = 'Informe um e-mail válido.';
    document.getElementById('email').classList.add('input-invalid');
    ok = false;
  } else { document.getElementById('email').classList.remove('input-invalid'); }

  if (senha.length < 4) {
    document.getElementById('err-senha').textContent = 'Senha muito curta.';
    document.getElementById('senha').classList.add('input-invalid');
    ok = false;
  } else { document.getElementById('senha').classList.remove('input-invalid'); }

  if (!ok) return;

  // Loading state
  btnLogin.disabled  = true;
  btnLoginText.textContent = 'Entrando…';
  btnLoginIcon.style.display = 'none';
  btnSpinner.style.display   = 'inline-block';

  const { error } = await db.auth.signInWithPassword({ email, password: senha });

  if (error) {
    alertErro.innerHTML = `<i class="fa-solid fa-circle-exclamation"></i> E-mail ou senha inválidos.`;
    alertErro.style.display = 'flex';
    btnLogin.disabled  = false;
    btnLoginText.textContent = 'Entrar';
    btnLoginIcon.style.display = 'inline-block';
    btnSpinner.style.display   = 'none';
    return;
  }

  window.location.href = 'dashboard.html';
});
