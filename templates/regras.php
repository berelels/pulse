<?php include 'includes/head.php'; ?>
<body>
<?php include 'includes/nav.php'; ?>

<main class="main-content">
  <header class="page-header">
    <div>
      <h1><i class="fa-solid fa-sliders"></i> Regras de Negócio</h1>
      <p class="page-subtitle">Configure as políticas e preços do estúdio.</p>
    </div>
    <button class="btn btn-primary" id="btnNovaRegra">
      <i class="fa-solid fa-plus"></i> Nova Regra
    </button>
  </header>

  <!-- Formulário de edição em massa -->
  <form method="POST" action="api/regras_action.php" id="formRegras">
    <input type="hidden" name="acao" value="salvar">

    <!-- Seção: Preços -->
    <section class="section-card glass regra-section">
      <div class="section-header">
        <h2><i class="fa-solid fa-dollar-sign"></i> Precificação</h2>
      </div>
      <div class="regras-grid">
        <?php
        $grupos = [
          'Precificação'  => ['preco_hora_ensaio', 'preco_hora_gravacao'],
          'Reservas'      => ['min_horas_reserva', 'max_horas_reserva'],
          'Políticas'     => ['desconto_fidelidade', 'taxa_cancelamento'],
          'Funcionamento' => ['horario_abertura', 'horario_fechamento', 'nome_estudio', 'moeda'],
        ];
        $chavesAgrupadas = array_merge(...array_values($grupos));
        ?>
        <?php foreach ($regras as $r): ?>
          <?php if (!in_array($r['chave'], $chavesAgrupadas)): ?>
          <div class="regra-card glass-inner">
            <div class="regra-info">
              <span class="regra-chave"><?= htmlspecialchars($r['chave']) ?></span>
              <?php if ($r['descricao']): ?>
                <span class="regra-desc"><?= htmlspecialchars($r['descricao']) ?></span>
              <?php endif; ?>
            </div>
            <div class="regra-valor-wrap">
              <input type="text" name="regras[<?= htmlspecialchars($r['chave']) ?>]"
                     value="<?= htmlspecialchars($r['valor']) ?>"
                     class="regra-input">
            </div>
            <form method="POST" action="api/regras_action.php" class="regra-del-form">
              <input type="hidden" name="acao" value="excluir">
              <input type="hidden" name="id"   value="<?= $r['id'] ?>">
              <button type="submit" class="btn btn-icon btn-delete" title="Excluir regra">
                <i class="fa-solid fa-trash"></i>
              </button>
            </form>
          </div>
          <?php endif; ?>
        <?php endforeach; ?>
      </div>
    </section>

    <?php foreach ($grupos as $grupoNome => $chaves): ?>
    <?php
    $regrasGrupo = array_filter($regras, fn($r) => in_array($r['chave'], $chaves));
    if (empty($regrasGrupo)) continue;
    ?>
    <section class="section-card glass regra-section">
      <div class="section-header">
        <h2>
          <?php
          $icons = [
            'Precificação'  => 'fa-tag',
            'Reservas'      => 'fa-clock',
            'Políticas'     => 'fa-shield-halved',
            'Funcionamento' => 'fa-store',
          ];
          ?>
          <i class="fa-solid <?= $icons[$grupoNome] ?? 'fa-gear' ?>"></i> <?= $grupoNome ?>
        </h2>
      </div>
      <div class="regras-grid">
        <?php foreach ($regrasGrupo as $r): ?>
        <div class="regra-card glass-inner">
          <div class="regra-info">
            <span class="regra-label"><?= htmlspecialchars($r['descricao'] ?: $r['chave']) ?></span>
            <span class="regra-chave-badge"><?= htmlspecialchars($r['chave']) ?></span>
          </div>
          <div class="regra-valor-wrap">
            <?php
            // Detecta tipo do campo pela chave
            $isTime = str_contains($r['chave'], 'horario');
            $isNum  = in_array($r['chave'], ['preco_hora_ensaio','preco_hora_gravacao','min_horas_reserva','max_horas_reserva','desconto_fidelidade','taxa_cancelamento']);
            ?>
            <?php if ($isTime): ?>
              <input type="time" name="regras[<?= htmlspecialchars($r['chave']) ?>]"
                     value="<?= htmlspecialchars($r['valor']) ?>"
                     class="regra-input">
            <?php elseif ($isNum): ?>
              <input type="number" name="regras[<?= htmlspecialchars($r['chave']) ?>]"
                     value="<?= htmlspecialchars($r['valor']) ?>"
                     step="0.01" min="0"
                     class="regra-input">
            <?php else: ?>
              <input type="text" name="regras[<?= htmlspecialchars($r['chave']) ?>]"
                     value="<?= htmlspecialchars($r['valor']) ?>"
                     class="regra-input">
            <?php endif; ?>
          </div>
        </div>
        <?php endforeach; ?>
      </div>
    </section>
    <?php endforeach; ?>

    <div class="regras-save-bar">
      <button type="submit" class="btn btn-primary btn-lg">
        <i class="fa-solid fa-floppy-disk"></i> Salvar Todas as Alterações
      </button>
    </div>
  </form>
</main>

<!-- Modal: Nova Regra Personalizada -->
<div class="modal-overlay" id="modalNovaRegra">
  <div class="modal glass modal-sm">
    <div class="modal-header">
      <h2><i class="fa-solid fa-plus-circle"></i> Nova Regra</h2>
      <button class="modal-close" id="btnFecharNovaRegra"><i class="fa-solid fa-xmark"></i></button>
    </div>
    <form method="POST" action="api/regras_action.php">
      <input type="hidden" name="acao" value="nova">
      <div class="form-group" style="margin-bottom:1rem">
        <label for="nova_chave">Chave (identificador único) *</label>
        <input type="text" id="nova_chave" name="chave"
               placeholder="ex: taxa_weekend" required
               pattern="[a-z_0-9]+">
        <span style="font-size:0.78rem;color:var(--text-muted)">Use apenas letras minúsculas e underscore.</span>
      </div>
      <div class="form-group" style="margin-bottom:1rem">
        <label for="nova_valor">Valor *</label>
        <input type="text" id="nova_valor" name="valor" placeholder="ex: 180.00" required>
      </div>
      <div class="form-group" style="margin-bottom:1rem">
        <label for="nova_desc">Descrição</label>
        <input type="text" id="nova_desc" name="descricao" placeholder="Explicação desta regra">
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-ghost" id="btnCancelarNovaRegra">Cancelar</button>
        <button type="submit" class="btn btn-primary">
          <i class="fa-solid fa-plus"></i> Adicionar
        </button>
      </div>
    </form>
  </div>
</div>

<div id="toast-container"></div>
<script id="pageData" type="application/json">
  {"toast": "<?= htmlspecialchars($toastParam) ?>"}
</script>
<script src="assets/js/main.js"></script>
<script>
'use strict';
// Modal nova regra
document.getElementById('btnNovaRegra').addEventListener('click', function () {
  document.getElementById('modalNovaRegra').classList.add('active');
});
document.getElementById('btnFecharNovaRegra').addEventListener('click', function () {
  document.getElementById('modalNovaRegra').classList.remove('active');
});
document.getElementById('btnCancelarNovaRegra').addEventListener('click', function () {
  document.getElementById('modalNovaRegra').classList.remove('active');
});
document.getElementById('modalNovaRegra').addEventListener('click', function (e) {
  if (e.target === this) this.classList.remove('active');
});

// Toasts
(function () {
  const msgs = {
    ok:       ['Regras salvas com sucesso!', 'success'],
    excluido: ['Regra removida.', 'info'],
    erro:     ['Erro ao salvar.', 'error'],
  };
  const p = JSON.parse(document.getElementById('pageData').textContent);
  if (p.toast && msgs[p.toast]) showToast(...msgs[p.toast]);
})();
</script>
</body>
</html>
