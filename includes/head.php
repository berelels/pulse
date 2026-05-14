<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Pulse — <?= htmlspecialchars($pageTitle ?? 'Painel') ?></title>
  <meta name="description" content="Pulse Studio — Sistema de Gestão para Estúdios de Gravação">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
  <link rel="stylesheet" href="assets/css/style.css">
  <?php if (($pageTitle ?? '') === 'Login'): ?>
  <link rel="stylesheet" href="assets/css/login.css">
  <?php else: ?>
  <link rel="stylesheet" href="assets/css/app.css">
  <?php endif; ?>
  <?php if (!empty($extraHeadScripts)): foreach ($extraHeadScripts as $src): ?>
    <script src="<?= $src ?>"></script>
  <?php endforeach; endif; ?>
</head>
