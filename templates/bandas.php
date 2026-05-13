<?php include 'includes/head.php'; ?>
<body>
<?php include 'includes/nav.php'; ?>

<main class="main-content">
  <header class="page-header">
    <div>
      <h1><i class="fa-solid fa-guitar"></i> Bandas &amp; Clientes</h1>
      <p class="page-subtitle">Gerencie o cadastro de bandas e responsáveis.</p>
    </div>
    <button class="btn btn-primary" id="btnNovaBanda">
      <i class="fa-solid fa-plus"></i> Nova Banda
    </button>
  </header>

  <!-- Busca -->
  <form method="GET" class="search-bar glass">
    <div class="input-icon">
      <i class="fa-solid fa-magnifying-glass"></i>
      <input type="text" name="busca" id="campoBusca"
             placeholder="Buscar por banda ou responsável…"
             value="<?= htmlspecialchars($busca) ?>">
    </div>
    <button type="submit" class="btn btn-primary">Buscar</button>
    <?php if ($busca): ?>
      <a href="bandas.php" class="btn btn-ghost">Limpar</a>
    <?php endif; ?>
  </form>

  <!-- Tabela -->
  <section class="section-card glass">
    <div class="table-responsive">
      <table class="data-table" id="tabelaBandas">
        <thead>
          <tr>
            <th>#</th><th>Banda</th><th>Responsável</th>
            <th>Telefone</th><th>Gênero</th><th>Cadastro</th><th>Ações</th>
          </tr>
        </thead>
        <tbody>
          <?php if (empty($bandas)): ?>
            <tr>
              <td colspan="7" class="empty-state">
                <i class="fa-solid fa-face-meh"></i> Nenhuma banda encontrada.
              </td>
            </tr>
          <?php else: ?>
            <?php foreach ($bandas as $b): ?>
            <tr>
              <td><?= $b['id'] ?></td>
              <td><strong><?= htmlspecialchars($b['nome_banda']) ?></strong></td>
              <td><?= htmlspecialchars($b['responsavel']) ?></td>
              <td><?= htmlspecialchars($b['telefone'] ?? '—') ?></td>
              <td><?= htmlspecialchars($b['genero']   ?? '—') ?></td>
              <td><?= date('d/m/Y', strtotime($b['criado_em'])) ?></td>
              <td class="action-btns">
                <button class="btn btn-icon btn-edit" title="Editar"
                  data-id="<?= $b['id'] ?>"
                  data-nome="<?= htmlspecialchars($b['nome_banda'],  ENT_QUOTES) ?>"
                  data-resp="<?= htmlspecialchars($b['responsavel'], ENT_QUOTES) ?>"
                  data-tel="<?= htmlspecialchars($b['telefone'] ?? '', ENT_QUOTES) ?>"
                  data-gen="<?= htmlspecialchars($b['genero']   ?? '', ENT_QUOTES) ?>">
                  <i class="fa-solid fa-pen-to-square"></i>
                </button>
                <button class="btn btn-icon btn-delete" title="Excluir"
                  data-id="<?= $b['id'] ?>"
                  data-nome="<?= htmlspecialchars($b['nome_banda'], ENT_QUOTES) ?>">
                  <i class="fa-solid fa-trash"></i>
                </button>
              </td>
            </tr>
            <?php endforeach; ?>
          <?php endif; ?>
        </tbody>
      </table>
    </div>
  </section>
</main>

<!-- Modal: Criar / Editar Banda -->
<div class="modal-overlay" id="modalOverlay">
  <div class="modal glass">
    <div class="modal-header">
      <h2 id="modalTitulo">Nova Banda</h2>
      <button class="modal-close" id="btnFecharModal"><i class="fa-solid fa-xmark"></i></button>
    </div>
    <form id="formBanda" method="POST" action="api/bandas_action.php" novalidate>
      <input type="hidden" name="acao" id="inputAcao" value="criar">
      <input type="hidden" name="id"   id="inputId"   value="">
      <div class="form-grid">
        <div class="form-group span-2">
          <label for="nome_banda">Nome da Banda *</label>
          <input type="text" id="nome_banda" name="nome_banda"
                 placeholder="Ex: The Analog Keys" required>
          <span class="field-error" id="err-nome_banda"></span>
        </div>
        <div class="form-group">
          <label for="responsavel">Responsável *</label>
          <input type="text" id="responsavel" name="responsavel"
                 placeholder="Nome completo" required>
          <span class="field-error" id="err-responsavel"></span>
        </div>
        <div class="form-group">
          <label for="telefone">Telefone</label>
          <input type="text" id="telefone" name="telefone"
                 placeholder="(11) 99999-9999">
        </div>
        <div class="form-group span-2">
          <label for="genero">Gênero Musical</label>
          <input type="text" id="genero" name="genero"
                 placeholder="Ex: Rock, Jazz, MPB…">
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
    <form method="POST" action="api/bandas_action.php">
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
<!-- Toast param vindo do PHP via data island -->
<script id="pageData" type="application/json">
  {"toast": "<?= htmlspecialchars($toastParam) ?>"}
</script>
<script src="assets/js/main.js"></script>
<script src="assets/js/bandas.js"></script>
</body>
</html>
