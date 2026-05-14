<?php include 'includes/head.php'; ?>
<body>
<?php include 'includes/nav.php'; ?>

<main class="main-content">
  <header class="page-header">
    <div>
      <h1><i class="fa-solid fa-microphone-lines"></i> Equipamentos</h1>
      <p class="page-subtitle">Catálogo de equipamentos disponíveis para locação.</p>
    </div>
    <?php if (hasPermission('edit')): ?>
    <button class="btn btn-primary" id="btnNovoEquip">
      <i class="fa-solid fa-plus"></i> Novo Equipamento
    </button>
    <?php endif; ?>
  </header>

  <!-- Filtros combinados -->
  <form method="GET" class="search-bar glass">
    <div class="input-icon" style="flex:1">
      <i class="fa-solid fa-magnifying-glass"></i>
      <input type="text" name="busca" placeholder="Buscar por nome…"
             value="<?= htmlspecialchars($busca) ?>">
    </div>
    <select name="status" class="select-filter">
      <option value="">Todos os Status</option>
      <option value="disponivel" <?= $filtroStatus === 'disponivel' ? 'selected' : '' ?>>Disponível</option>
      <option value="manutencao" <?= $filtroStatus === 'manutencao' ? 'selected' : '' ?>>Manutenção</option>
    </select>
    <button type="submit" class="btn btn-primary">Filtrar</button>
    <?php if ($busca || $filtroStatus): ?>
      <a href="equipamentos.php" class="btn btn-ghost">Limpar</a>
    <?php endif; ?>
  </form>

  <section class="section-card glass">
    <div class="table-responsive">
      <table class="data-table">
        <thead>
          <tr>
            <th>#</th><th>Equipamento</th><th>Descrição</th>
            <th>Valor/Sessão</th><th>Status</th><th>Ações</th>
          </tr>
        </thead>
        <tbody>
          <?php if (empty($equipamentos)): ?>
            <tr>
              <td colspan="6" class="empty-state">
                <i class="fa-solid fa-box-open"></i> Nenhum equipamento encontrado.
              </td>
            </tr>
          <?php else: ?>
            <?php foreach ($equipamentos as $eq): ?>
            <tr>
              <td><?= $eq['id'] ?></td>
              <td><strong><?= htmlspecialchars($eq['nome']) ?></strong></td>
              <td><?= htmlspecialchars($eq['descricao'] ?? '—') ?></td>
              <td>R$ <?= number_format($eq['valor_locacao'], 2, ',', '.') ?></td>
              <td>
                <span class="badge badge-<?= $eq['status'] === 'disponivel' ? 'confirmado' : 'cancelado' ?>">
                  <?= $eq['status'] === 'disponivel' ? 'Disponível' : 'Manutenção' ?>
                </span>
              </td>
              <td class="action-btns">
                <?php if (hasPermission('edit')): ?>
                <button class="btn btn-icon btn-edit" title="Editar"
                  data-id="<?= $eq['id'] ?>"
                  data-nome="<?= htmlspecialchars($eq['nome'],       ENT_QUOTES) ?>"
                  data-desc="<?= htmlspecialchars($eq['descricao'] ?? '', ENT_QUOTES) ?>"
                  data-valor="<?= $eq['valor_locacao'] ?>"
                  data-status="<?= $eq['status'] ?>">
                  <i class="fa-solid fa-pen-to-square"></i>
                </button>
                <?php endif; ?>
                <?php if (hasPermission('delete')): ?>
                <button class="btn btn-icon btn-delete" title="Excluir"
                  data-id="<?= $eq['id'] ?>"
                  data-nome="<?= htmlspecialchars($eq['nome'], ENT_QUOTES) ?>">
                  <i class="fa-solid fa-trash"></i>
                </button>
                <?php endif; ?>
              </td>
            </tr>
            <?php endforeach; ?>
          <?php endif; ?>
        </tbody>
      </table>
    </div>
  </section>
</main>

<!-- Modal: Criar / Editar Equipamento -->
<div class="modal-overlay" id="modalOverlay">
  <div class="modal glass">
    <div class="modal-header">
      <h2 id="modalTitulo">Novo Equipamento</h2>
      <button class="modal-close" id="btnFecharModal"><i class="fa-solid fa-xmark"></i></button>
    </div>
    <form id="formEquip" method="POST" action="api/equipamentos_action.php" novalidate>
      <input type="hidden" name="acao" id="inputAcao" value="criar">
      <input type="hidden" name="id"   id="inputId"   value="">
      <div class="form-grid">
        <div class="form-group span-2">
          <label for="nome">Nome do Equipamento *</label>
          <input type="text" id="nome" name="nome"
                 placeholder="Ex: Marshall JCM800" required>
          <span class="field-error" id="err-nome"></span>
        </div>
        <div class="form-group span-2">
          <label for="descricao">Descrição</label>
          <input type="text" id="descricao" name="descricao"
                 placeholder="Breve descrição técnica">
        </div>
        <div class="form-group">
          <label for="valor_locacao">Valor por Sessão (R$) *</label>
          <input type="number" id="valor_locacao" name="valor_locacao"
                 step="0.01" min="0" placeholder="0.00" required>
          <span class="field-error" id="err-valor_locacao"></span>
        </div>
        <div class="form-group">
          <label for="status">Status *</label>
          <select id="status" name="status" required>
            <option value="disponivel">Disponível</option>
            <option value="manutencao">Manutenção</option>
          </select>
        </div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-ghost" id="btnCancelarModal">Cancelar</button>
        <button type="submit" class="btn btn-primary">
          <i class="fa-solid fa-floppy-disk"></i> Salvar
        </button>
      </div>
    </form>
  </div>
</div>

<!-- Modal: Confirmar Exclusão -->
<div class="modal-overlay" id="modalDelOverlay">
  <div class="modal modal-sm glass">
    <div class="modal-header">
      <h2><i class="fa-solid fa-triangle-exclamation"></i> Confirmar Exclusão</h2>
      <button class="modal-close" id="btnFecharModalDel"><i class="fa-solid fa-xmark"></i></button>
    </div>
    <p id="textoConfirmacao" style="margin:1rem 0 1.5rem;color:var(--text-secondary)"></p>
    <form method="POST" action="api/equipamentos_action.php">
      <input type="hidden" name="acao" value="excluir">
      <input type="hidden" name="id"   id="inputDelId" value="">
      <div class="modal-footer">
        <button type="button" class="btn btn-ghost" id="btnCancelarDel">Cancelar</button>
        <button type="submit" class="btn btn-danger">
          <i class="fa-solid fa-trash"></i> Excluir
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
<script src="assets/js/equipamentos.js"></script>
</body>
</html>
