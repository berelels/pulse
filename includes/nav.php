<?php
/**
 * PULSE — includes/nav.php
 * Dynamic Island: pill flutuante no topo com abas de navegação.
 */
$paginaAtual = basename($_SERVER['PHP_SELF'], '.php');
$usuario = usuarioLogado();

$navItems = [
  ['href' => 'dashboard.php',    'page' => 'dashboard',    'icon' => 'fa-gauge-high',         'label' => 'Dashboard'],
];

if (hasPermission('agendamentos')) {
  $navItems[] = ['href' => 'agendamentos.php', 'page' => 'agendamentos', 'icon' => 'fa-calendar-days', 'label' => 'Agendamentos'];
}
if (hasPermission('bandas')) {
  $navItems[] = ['href' => 'bandas.php', 'page' => 'bandas', 'icon' => 'fa-guitar', 'label' => 'Bandas'];
}
if (hasPermission('equipamentos')) {
  $navItems[] = ['href' => 'equipamentos.php', 'page' => 'equipamentos', 'icon' => 'fa-microphone-lines', 'label' => 'Equipamentos'];
}
if (hasPermission('relatorios')) {
  $navItems[] = ['href' => 'relatorios.php', 'page' => 'relatorios', 'icon' => 'fa-chart-line', 'label' => 'Relatórios'];
}
if ($usuario['is_admin']) {
  $navItems[] = ['href' => 'usuarios.php', 'page' => 'usuarios', 'icon' => 'fa-users-gear', 'label' => 'Usuários'];
  $navItems[] = ['href' => 'regras.php',   'page' => 'regras',   'icon' => 'fa-sliders',    'label' => 'Regras'];
}
?>

<header class="di-wrapper">
  <nav class="dynamic-island" id="dynamicIsland" role="navigation" aria-label="Navegação principal">

    <!-- Logo / Brand -->
    <div class="di-brand">
      <img src="assets/img/pulse_logo1.svg" alt="Pulse Logo" style="height: 22px;">
    </div>

    <div class="di-divider"></div>

    <!-- Nav Tabs -->
    <div class="di-tabs">
      <?php foreach ($navItems as $item): ?>
        <a href="<?= $item['href'] ?>"
           class="di-tab <?= $paginaAtual === $item['page'] ? 'di-tab--active' : '' ?>"
           title="<?= $item['label'] ?>">
          <i class="fa-solid <?= $item['icon'] ?>"></i>
          <span class="di-tab-label"><?= $item['label'] ?></span>
        </a>
      <?php endforeach; ?>
    </div>

    <div class="di-divider"></div>

    <!-- User + Logout -->
    <div class="di-user">
      <div class="di-avatar"><?= mb_strtoupper(mb_substr($usuario['nome'], 0, 1)) ?></div>
      <span class="di-username"><?= htmlspecialchars(explode(' ', $usuario['nome'])[0]) ?></span>
      <a href="logout.php" class="di-logout" title="Sair">
        <i class="fa-solid fa-arrow-right-from-bracket"></i>
      </a>
    </div>

  </nav>
</header>
