<?php include 'includes/head.php'; ?>
<body>
<?php include 'includes/nav.php'; ?>

<main class="main-content">
  <header class="page-header">
    <div>
      <h1><i class="fa-solid fa-chart-line"></i> Relatórios</h1>
      <p class="page-subtitle">Análise de desempenho e faturamento do estúdio.</p>
    </div>
    <div class="export-btns">
      <button class="btn btn-ghost" id="btnExcelRel">
        <i class="fa-solid fa-file-excel"></i> Excel
      </button>
      <button class="btn btn-primary" id="btnPdfRel">
        <i class="fa-solid fa-file-pdf"></i> PDF
      </button>
    </div>
  </header>

  <!-- Filtro de Período -->
  <form method="GET" class="search-bar glass">
    <label style="font-weight:500;color:var(--text-secondary)">Período:</label>
    <div class="input-icon">
      <i class="fa-regular fa-calendar"></i>
      <input type="date" name="data_ini" value="<?= $dataIni ?>">
    </div>
    <span style="color:var(--text-muted)">até</span>
    <div class="input-icon">
      <i class="fa-regular fa-calendar-check"></i>
      <input type="date" name="data_fim" value="<?= $dataFim ?>">
    </div>
    <button type="submit" class="btn btn-primary">Atualizar</button>
  </form>

  <!-- KPIs do período -->
  <section class="kpi-grid">
    <div class="kpi-card glass">
      <div class="kpi-icon kpi-teal"><i class="fa-solid fa-circle-dollar-to-slot"></i></div>
      <div class="kpi-info">
        <span class="kpi-value">R$ <?= number_format($totalFaturado, 2, ',', '.') ?></span>
        <span class="kpi-label">Faturamento (concluídos)</span>
      </div>
    </div>
    <?php foreach ($porStatus as $ps): ?>
    <div class="kpi-card glass">
      <div class="kpi-icon kpi-blue"><i class="fa-solid fa-layer-group"></i></div>
      <div class="kpi-info">
        <span class="kpi-value"><?= $ps['total'] ?></span>
        <span class="kpi-label"><?= ucfirst($ps['status']) ?></span>
      </div>
    </div>
    <?php endforeach; ?>
  </section>

  <!-- Top 5 Bandas -->
  <?php if ($topBandas): ?>
  <section class="section-card glass">
    <div class="section-header">
      <h2><i class="fa-solid fa-trophy"></i> Top 5 Bandas do Período</h2>
    </div>
    <div class="table-responsive">
      <table class="data-table">
        <thead><tr><th>Banda</th><th>Agendamentos</th><th>Faturamento</th></tr></thead>
        <tbody>
          <?php foreach ($topBandas as $i => $tb): ?>
          <tr>
            <td>
              <span class="rank-badge"><?= $i + 1 ?></span>
              <?= htmlspecialchars($tb['nome_banda']) ?>
            </td>
            <td><?= $tb['total'] ?></td>
            <td>R$ <?= number_format($tb['faturamento'], 2, ',', '.') ?></td>
          </tr>
          <?php endforeach; ?>
        </tbody>
      </table>
    </div>
  </section>
  <?php endif; ?>

  <!-- Tabela Exportável -->
  <section class="section-card glass">
    <div class="section-header">
      <h2><i class="fa-solid fa-table-list"></i> Detalhamento do Período</h2>
    </div>
    <div class="table-responsive">
      <table class="data-table" id="tabelaRelatorio">
        <thead>
          <tr>
            <th>#</th><th>Banda</th><th>Data</th><th>Horário</th>
            <th>Valor</th><th>Status</th><th>Responsável</th>
          </tr>
        </thead>
        <tbody>
          <?php if (empty($detalhes)): ?>
            <tr>
              <td colspan="7" class="empty-state">
                <i class="fa-solid fa-chart-simple"></i> Sem dados no período selecionado.
              </td>
            </tr>
          <?php else: ?>
            <?php foreach ($detalhes as $d): ?>
            <tr>
              <td><?= $d['id'] ?></td>
              <td><strong><?= htmlspecialchars($d['nome_banda']) ?></strong></td>
              <td><?= date('d/m/Y', strtotime($d['data_ensaio'])) ?></td>
              <td><?= substr($d['hora_inicio'], 0, 5) ?> – <?= substr($d['hora_fim'], 0, 5) ?></td>
              <td>R$ <?= number_format($d['valor_total'], 2, ',', '.') ?></td>
              <td><span class="badge badge-<?= $d['status'] ?>"><?= ucfirst($d['status']) ?></span></td>
              <td><?= htmlspecialchars($d['responsavel']) ?></td>
            </tr>
            <?php endforeach; ?>
          <?php endif; ?>
        </tbody>
      </table>
    </div>
  </section>
</main>

<div id="toast-container"></div>
<!-- Data island: datas formatadas para uso no JS de exportação -->
<script id="pageData" type="application/json">
  {
    "dataIni": "<?= $dataIniFormatada ?>",
    "dataFim": "<?= $dataFimFormatada ?>"
  }
</script>
<script src="assets/js/main.js"></script>
<script src="assets/js/relatorios.js"></script>
</body>
</html>
