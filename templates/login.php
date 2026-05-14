<?php include 'includes/head.php'; ?>
<body class="login-body">
  <!-- Theme Toggle for Login Page -->
  <button id="theme-toggle" class="btn-icon" style="position: absolute; top: 1.5rem; right: 1.5rem; z-index: 100; color: var(--text-secondary); background: var(--glass-bg); border: 1px solid var(--glass-border); border-radius: 50%; width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; cursor: pointer;">
    <i class="fa-solid fa-sun"></i>
  </button>

  <!-- Painel esquerdo: formulário flat -->
  <div class="login-left">
    <div class="login-left-content">
      <div class="login-logo-flat">
        <img src="assets/img/pulse_logo2.svg" alt="Pulse Logo" style="height: 36px;">
      </div>

    <h1 class="login-heading">Olá,<br>Bem-vindo de volta!</h1>
    <p class="login-sub">Acesse o painel de gestão do estúdio.</p>

    <?php if ($erro): ?>
      <div class="alert alert-error">
        <i class="fa-solid fa-circle-exclamation"></i>
        <?= htmlspecialchars($erro) ?>
      </div>
    <?php endif; ?>

    <form id="formLogin" method="POST" action="login.php" novalidate>
      <div class="form-group">
        <label for="email">E-mail</label>
        <div class="input-icon">
          <i class="fa-regular fa-envelope"></i>
          <input type="email" id="email" name="email"
                 placeholder="admin@pulse.studio"
                 autocomplete="email" required
                 value="<?= htmlspecialchars($emailPost) ?>">
        </div>
        <span class="field-error" id="err-email"></span>
      </div>

      <div class="form-group">
        <label for="senha">Senha</label>
        <div class="input-icon">
          <i class="fa-solid fa-lock"></i>
          <input type="password" id="senha" name="senha"
                 placeholder="••••••••" autocomplete="current-password" required>
          <button type="button" class="toggle-pass"
                  onclick="toggleSenha()" aria-label="Mostrar senha">
            <i class="fa-regular fa-eye" id="icone-olho"></i>
          </button>
        </div>
        <span class="field-error" id="err-senha"></span>
      </div>

      <button type="submit" class="btn-login-flat" id="btnLogin">
        <span>Entrar</span>
        <i class="fa-solid fa-arrow-right"></i>
      </button>
    </form>

      <p class="login-hint-flat">Acesso restrito à equipe do estúdio.</p>
    </div>
  </div>

  <!-- Painel direito: ilustração isométrica -->
  <div class="login-right">
    <div class="login-illus-wrap">
      <img src="assets/img/login_illustration.png" alt="Estúdio de gravação" draggable="false">

      <!-- Badges flutuantes -->
      <div class="login-badge badge-top">
        <i class="fa-solid fa-guitar"></i>
        <span>Bandas Ativas</span>
      </div>
      <div class="login-badge badge-mid">
        <i class="fa-solid fa-calendar-check"></i>
        <span>Agendamentos</span>
      </div>
      <div class="login-badge badge-bot">
        <i class="fa-solid fa-circle-dollar-to-slot"></i>
        <span>Faturamento</span>
      </div>
    </div>
    <p class="login-right-title">Pulse Studio · Gestão Inteligente</p>
  </div>

  <div id="toast-container"></div>
  <script src="assets/js/main.js"></script>
  <script src="assets/js/login.js"></script>
</body>
</html>
