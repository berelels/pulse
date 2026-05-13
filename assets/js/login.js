/**
 * assets/js/login.js
 * Validação do formulário de login e toggle de senha.
 */

'use strict';

document.getElementById('formLogin').addEventListener('submit', function (e) {
  let ok = true;

  const email = document.getElementById('email');
  const senha = document.getElementById('senha');
  const errEmail = document.getElementById('err-email');
  const errSenha = document.getElementById('err-senha');

  errEmail.textContent = '';
  errSenha.textContent = '';

  // Validar e-mail
  if (!email.value.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
    errEmail.textContent = 'Informe um e-mail válido.';
    email.classList.add('input-invalid');
    ok = false;
  } else {
    email.classList.remove('input-invalid');
  }

  // Validar senha (mínimo 4 chars para não bloquear erros reais do backend)
  if (senha.value.length < 4) {
    errSenha.textContent = 'Senha muito curta.';
    senha.classList.add('input-invalid');
    ok = false;
  } else {
    senha.classList.remove('input-invalid');
  }

  if (!ok) {
    e.preventDefault();
  }
});

/**
 * Alterna visibilidade do campo de senha.
 * Chamado pelo atributo onclick do botão toggle no template.
 */
function toggleSenha() {
  const campo = document.getElementById('senha');
  const icone = document.getElementById('icone-olho');

  if (campo.type === 'password') {
    campo.type = 'text';
    icone.className = 'fa-regular fa-eye-slash';
  } else {
    campo.type = 'password';
    icone.className = 'fa-regular fa-eye';
  }
}
