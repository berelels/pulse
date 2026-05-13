<?php include 'includes/head.php'; ?>
<body>
<?php include 'includes/nav.php'; ?>

<main class="main-content">
  <header class="page-header">
    <div>
      <h1>Dashboard</h1>
      <p class="page-subtitle">
        Bem-vindo de volta, <strong><?= htmlspecialchars($usuario['nome']) ?></strong> 👋
      </p>
    </div>
    <div class="header-date">
      <i class="fa-regular fa-calendar"></i>
      <?= date('d/m/Y') ?>
    </div>
  </header>

  <!-- KPI Cards -->
  <section class="kpi-grid">
    <div class="kpi-card glass">
      <div class="kpi-icon kpi-blue"><i class="fa-solid fa-guitar"></i></div>
      <div class="kpi-info">
        <span class="kpi-value"><?= $totalBandas ?></span>
        <span class="kpi-label">Bandas Cadastradas</span>
      </div>
    </div>
    <div class="kpi-card glass">
      <div class="kpi-icon kpi-orange"><i class="fa-solid fa-calendar-check"></i></div>
      <div class="kpi-info">
        <span class="kpi-value"><?= $totalAgendamentos ?></span>
        <span class="kpi-label">Agendamentos Ativos</span>
      </div>
    </div>
    <div class="kpi-card glass">
      <div class="kpi-icon kpi-green"><i class="fa-solid fa-microphone-lines"></i></div>
      <div class="kpi-info">
        <span class="kpi-value"><?= $totalEquip ?></span>
        <span class="kpi-label">Equipamentos Disponíveis</span>
      </div>
    </div>
    <div class="kpi-card glass">
      <div class="kpi-icon kpi-teal"><i class="fa-solid fa-circle-dollar-to-slot"></i></div>
      <div class="kpi-info">
        <span class="kpi-value">R$ <?= number_format($faturamentoMes, 2, ',', '.') ?></span>
        <span class="kpi-label">Faturamento do Mês</span>
      </div>
    </div>
  </section>

  <!-- Próximos Agendamentos -->
  <section class="section-card glass">
    <div class="section-header">
      <h2><i class="fa-solid fa-clock"></i> Próximos Ensaios</h2>
      <a href="agendamentos.php" class="btn btn-ghost btn-sm">
        Ver todos <i class="fa-solid fa-arrow-right"></i>
      </a>
    </div>
    <div class="table-responsive">
      <table class="data-table">
        <thead>
          <tr>
            <th>Banda</th><th>Data</th><th>Horário</th><th>Valor</th><th>Status</th>
          </tr>
        </thead>
        <tbody>
          <?php if (empty($proxAgendamentos)): ?>
            <tr>
              <td colspan="5" class="empty-state">
                <i class="fa-regular fa-calendar-xmark"></i> Nenhum agendamento próximo.
              </td>
            </tr>
          <?php else: ?>
            <?php foreach ($proxAgendamentos as $ag): ?>
            <tr>
              <td><strong><?= htmlspecialchars($ag['nome_banda']) ?></strong></td>
              <td><?= date('d/m/Y', strtotime($ag['data_ensaio'])) ?></td>
              <td><?= substr($ag['hora_inicio'], 0, 5) ?> – <?= substr($ag['hora_fim'], 0, 5) ?></td>
              <td>R$ <?= number_format($ag['valor_total'], 2, ',', '.') ?></td>
              <td><span class="badge badge-<?= $ag['status'] ?>"><?= ucfirst($ag['status']) ?></span></td>
            </tr>
            <?php endforeach; ?>
          <?php endif; ?>
        </tbody>
      </table>
    </div>
  </section>
</main>

<div id="toast-container"></div>
<script src="assets/js/main.js"></script>
</body>
</html>
