<?php
/**
 * PULSE — scripts/gerar_hash.php
 * Utilitário para gerar o hash bcrypt de uma senha.
 * Acesse via browser: http://localhost/pulse/scripts/gerar_hash.php
 * ⚠️ REMOVA este arquivo antes de ir para produção!
 */

$hash = '';
$senha = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $senha = $_POST['senha'] ?? '';
    if (strlen($senha) >= 6) {
        $hash = password_hash($senha, PASSWORD_BCRYPT);
    }
}
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <title>Gerador de Hash — Pulse</title>
  <style>
    body { font-family: monospace; max-width: 600px; margin: 40px auto; padding: 20px; background: #111; color: #eee; }
    input, button { padding: 8px 12px; margin: 6px 0; width: 100%; box-sizing: border-box; }
    button { background: #7c3aed; color: #fff; border: none; cursor: pointer; border-radius: 4px; }
    .hash { background: #1e1e1e; padding: 12px; border-radius: 4px; word-break: break-all; color: #4ade80; margin-top: 12px; }
    .sql  { background: #1e1e1e; padding: 12px; border-radius: 4px; color: #60a5fa; margin-top: 8px; font-size: 0.85em; }
  </style>
</head>
<body>
  <h2>🔑 Gerador de Hash — PULSE</h2>
  <p>Use para gerar o hash bcrypt e atualizar o banco.</p>
  <form method="POST">
    <input type="password" name="senha" placeholder="Digite a senha (mín. 6 chars)" required>
    <button type="submit">Gerar Hash</button>
  </form>

  <?php if ($hash): ?>
    <p><strong>Hash gerado:</strong></p>
    <div class="hash"><?= htmlspecialchars($hash) ?></div>
    <p><strong>SQL para atualizar o admin:</strong></p>
    <div class="sql">UPDATE usuarios SET senha_hash='<?= htmlspecialchars($hash) ?>' WHERE email='admin@pulse.studio';</div>
  <?php elseif ($_SERVER['REQUEST_METHOD'] === 'POST'): ?>
    <p style="color:red">⚠ Senha deve ter pelo menos 6 caracteres.</p>
  <?php endif; ?>

  <p style="color:#ef4444;margin-top:30px">⚠️ <strong>Remova este arquivo antes de ir para produção!</strong></p>
</body>
</html>
