<?php
/**
 * PULSE — includes/nav.php
 * Barra lateral de navegação reutilizável.
 * Inclua no topo de cada página interna após requireAuth().
 */
$paginaAtual = basename($_SERVER['PHP_SELF'], '.php');
$usuario = usuarioLogado();
?>
<aside class="sidebar glass">
  <div class="sidebar-logo">
    <i class="fa-solid fa-circle-waveform-lines"></i>
    <span>Pulse</span>
  </div>

  <nav class="sidebar-nav">
    <a href="dashboard.php"     class="nav-item <?= $paginaAtual === 'dashboard'     ? 'active' : '' ?>">
      <i class="fa-solid fa-gauge-high"></i><span>Dashboard</span>
    </a>
    <a href="agendamentos.php"  class="nav-item <?= $paginaAtual === 'agendamentos'  ? 'active' : '' ?>">
      <i class="fa-solid fa-calendar-days"></i><span>Agendamentos</span>
    </a>
    <a href="bandas.php"        class="nav-item <?= $paginaAtual === 'bandas'        ? 'active' : '' ?>">
      <i class="fa-solid fa-guitar"></i><span>Bandas</span>
    </a>
    <a href="equipamentos.php"  class="nav-item <?= $paginaAtual === 'equipamentos'  ? 'active' : '' ?>">
      <i class="fa-solid fa-microphone-lines"></i><span>Equipamentos</span>
    </a>
    <a href="relatorios.php"    class="nav-item <?= $paginaAtual === 'relatorios'    ? 'active' : '' ?>">
      <i class="fa-solid fa-chart-line"></i><span>Relatórios</span>
    </a>
    <?php if ($usuario['is_admin']): ?>
    <a href="usuarios.php"      class="nav-item <?= $paginaAtual === 'usuarios'      ? 'active' : '' ?>">
      <i class="fa-solid fa-users-gear"></i><span>Usuários</span>
    </a>
    <a href="regras.php"        class="nav-item <?= $paginaAtual === 'regras'        ? 'active' : '' ?>">
      <i class="fa-solid fa-sliders"></i><span>Regras</span>
    </a>
    <?php endif; ?>

  </nav>

  <div class="sidebar-footer">
    <div class="user-chip">
      <div class="user-avatar"><?= mb_strtoupper(mb_substr($usuario['nome'], 0, 1)) ?></div>
      <div class="user-info">
        <span class="user-name"><?= htmlspecialchars($usuario['nome']) ?></span>
        <span class="user-role"><?= $usuario['is_admin'] ? 'Administrador' : 'Colaborador' ?></span>
      </div>
    </div>
    <a href="logout.php" class="btn-logout" title="Sair"><i class="fa-solid fa-arrow-right-from-bracket"></i></a>
  </div>
</aside>
