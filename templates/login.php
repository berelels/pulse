<?php include 'includes/head.php'; ?>
<body class="login-body">

  <div class="login-bg">
    <div class="login-blob blob1"></div>
    <div class="login-blob blob2"></div>
  </div>

  <main class="login-container">
    <div class="login-card glass">
      <div class="login-logo">
        <i class="fa-solid fa-circle-waveform-lines"></i>
        <span>Pulse</span>
      </div>
      <p class="login-subtitle">Gestão para Estúdios de Gravação</p>

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

        <button type="submit" class="btn btn-primary btn-block" id="btnLogin">
          <span>Entrar</span>
          <i class="fa-solid fa-arrow-right"></i>
        </button>
      </form>

      <p class="login-hint">Acesso restrito à equipe do estúdio.</p>
    </div>
  </main>

  <div id="toast-container"></div>
  <script src="assets/js/main.js"></script>
  <script src="assets/js/login.js"></script>
</body>
</html>
