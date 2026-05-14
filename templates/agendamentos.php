<?php include 'includes/head.php'; ?>
<body>
<?php include 'includes/nav.php'; ?>

<main class="main-content">
  <header class="page-header">
    <div>
      <h1><i class="fa-solid fa-calendar-days"></i> Agendamentos</h1>
      <p class="page-subtitle">Gerencie os ensaios e gravações do estúdio.</p>
    </div>
    <?php if (hasPermission('edit')): ?>
    <button class="btn btn-primary" id="btnNovoAg">
      <i class="fa-solid fa-plus"></i> Novo Agendamento
    </button>
    <?php endif; ?>
  </header>

  <!-- Filtros combinados: banda + datas + status -->
  <form method="GET" class="search-bar glass filter-grid">
    <div class="input-icon">
      <i class="fa-solid fa-guitar"></i>
      <input type="text" name="banda" placeholder="Filtrar por banda…"
             value="<?= htmlspecialchars($filtroBanda) ?>">
    </div>
    <div class="input-icon">
      <i class="fa-regular fa-calendar"></i>
      <input type="date" name="data_ini" title="Data inicial"
             value="<?= htmlspecialchars($filtroDataIni) ?>">
    </div>
    <div class="input-icon">
      <i class="fa-regular fa-calendar-check"></i>
      <input type="date" name="data_fim" title="Data final"
             value="<?= htmlspecialchars($filtroDataFim) ?>">
    </div>
    <select name="status" class="select-filter">
      <option value="">Todos</option>
      <option value="confirmado" <?= $filtroStatus === 'confirmado' ? 'selected' : '' ?>>Confirmado</option>
      <option value="pendente"   <?= $filtroStatus === 'pendente'   ? 'selected' : '' ?>>Pendente</option>
      <option value="concluido"  <?= $filtroStatus === 'concluido'  ? 'selected' : '' ?>>Concluído</option>
      <option value="cancelado"  <?= $filtroStatus === 'cancelado'  ? 'selected' : '' ?>>Cancelado</option>
    </select>
    <button type="submit" class="btn btn-primary">Filtrar</button>
    <a href="agendamentos.php" class="btn btn-ghost">Limpar</a>
  </form>

  <section class="section-card glass">
    <div class="table-responsive">
      <table class="data-table" id="tabelaAgendamentos">
        <thead>
          <tr>
            <th>Banda</th><th>Data</th><th>Horário</th>
            <th>Valor</th><th>Status</th><th>Responsável</th><th>Ações</th>
          </tr>
        </thead>
        <tbody>
          <?php if (empty($agendamentos)): ?>
            <tr>
              <td colspan="7" class="empty-state">
                <i class="fa-regular fa-calendar-xmark"></i> Nenhum agendamento encontrado.
              </td>
            </tr>
          <?php else: ?>
            <?php foreach ($agendamentos as $ag): ?>
            <?php $agEquipIds = $equipPorAg[$ag['id']] ?? []; ?>
            <tr>
              <td><strong><?= htmlspecialchars($ag['nome_banda']) ?></strong></td>
              <td><?= date('d/m/Y', strtotime($ag['data_ensaio'])) ?></td>
              <td><?= substr($ag['hora_inicio'], 0, 5) ?> – <?= substr($ag['hora_fim'], 0, 5) ?></td>
              <td>R$ <?= number_format($ag['valor_total'], 2, ',', '.') ?></td>
              <td><span class="badge badge-<?= $ag['status'] ?>"><?= ucfirst($ag['status']) ?></span></td>
              <td><?= htmlspecialchars($ag['usuario_nome']) ?></td>
              <td class="action-btns">
                <!-- Editar -->
                <?php if (hasPermission('edit')): ?>
                <button class="btn btn-icon btn-edit" title="Editar"
                  data-id="<?= $ag['id'] ?>"
                  data-banda="<?= $ag['banda_id'] ?>"
                  data-data="<?= $ag['data_ensaio'] ?>"
                  data-ini="<?= substr($ag['hora_inicio'], 0, 5) ?>"
                  data-fim="<?= substr($ag['hora_fim'],    0, 5) ?>"
                  data-valor="<?= $ag['valor_total'] ?>"
                  data-status="<?= $ag['status'] ?>"
                  data-obs="<?= htmlspecialchars($ag['observacoes'] ?? '', ENT_QUOTES) ?>"
                  data-equipamentos="<?= htmlspecialchars(json_encode($agEquipIds), ENT_QUOTES) ?>">
                  <i class="fa-solid fa-pen-to-square"></i>
                </button>
                <?php endif; ?>

                <!-- Ações de Status -->
                <?php if (hasPermission('edit')): ?>
                  <?php if ($ag['status'] === 'pendente'): ?>
                  <form method="POST" action="api/agendamentos_action.php" style="display:inline">
                    <input type="hidden" name="acao" value="confirmar">
                    <input type="hidden" name="id"   value="<?= $ag['id'] ?>">
                    <button type="submit" class="btn btn-icon btn-confirm" title="Confirmar">
                      <i class="fa-solid fa-check"></i>
                    </button>
                  </form>
                  <?php elseif ($ag['status'] === 'confirmado'): ?>
                  <form method="POST" action="api/agendamentos_action.php" style="display:inline">
                    <input type="hidden" name="acao" value="concluir">
                    <input type="hidden" name="id"   value="<?= $ag['id'] ?>">
                    <button type="submit" class="btn btn-icon btn-success" title="Concluir" style="color:var(--clr-green); background:rgba(0,255,0,0.1)">
                      <i class="fa-solid fa-flag-checkered"></i>
                    </button>
                  </form>
                  <?php endif; ?>
                <?php endif; ?>

                <!-- Cancelar -->
                <?php if (hasPermission('delete') && $ag['status'] !== 'cancelado'): ?>
                <button class="btn btn-icon btn-delete" title="Cancelar"
                  data-id="<?= $ag['id'] ?>"
                  data-nome="<?= htmlspecialchars($ag['nome_banda'], ENT_QUOTES) ?>">
                  <i class="fa-solid fa-ban"></i>
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

<!-- Modal: Criar / Editar Agendamento -->
<div class="modal-overlay" id="modalOverlay">
  <div class="modal glass modal-lg">
    <div class="modal-header">
      <h2 id="modalTitulo">Novo Agendamento</h2>
      <button class="modal-close" id="btnFecharModal"><i class="fa-solid fa-xmark"></i></button>
    </div>
    <form id="formAg" method="POST" action="api/agendamentos_action.php" novalidate>
      <input type="hidden" name="acao"       id="inputAcao"   value="criar">
      <input type="hidden" name="id"         id="inputId"     value="">
      <input type="hidden" name="usuario_id" value="<?= $usuario['id'] ?>">
      <div class="form-grid">
        <div class="form-group span-2">
          <label for="banda_id">Banda *</label>
          <select id="banda_id" name="banda_id" required>
            <option value="">Selecione a banda…</option>
            <?php foreach ($bandas as $b): ?>
              <option value="<?= $b['id'] ?>"><?= htmlspecialchars($b['nome_banda']) ?></option>
            <?php endforeach; ?>
          </select>
          <span class="field-error" id="err-banda_id"></span>
        </div>
        <div class="form-group">
          <label for="data_ensaio">Data do Ensaio *</label>
          <input type="date" id="data_ensaio" name="data_ensaio" required>
          <span class="field-error" id="err-data_ensaio"></span>
        </div>
        <div class="form-group">
          <label for="status_ag">Status</label>
          <select id="status_ag" name="status">
            <option value="confirmado">Confirmado</option>
            <option value="pendente">Pendente</option>
            <option value="concluido">Concluído</option>
            <option value="cancelado">Cancelado</option>
          </select>
        </div>
        <div class="form-group">
          <label for="hora_inicio">Hora Início *</label>
          <input type="time" id="hora_inicio" name="hora_inicio" required>
          <span class="field-error" id="err-hora_inicio"></span>
        </div>
        <div class="form-group">
          <label for="hora_fim">Hora Fim *</label>
          <input type="time" id="hora_fim" name="hora_fim" required>
          <span class="field-error" id="err-hora_fim"></span>
        </div>
        <div class="form-group">
          <label for="valor_total">Valor Total (R$) *</label>
          <input type="number" id="valor_total" name="valor_total"
                 step="0.01" min="0" placeholder="0.00" required readonly
                 data-preco-hora="<?= $precoHoraEnsaio ?>">
          <span class="field-error" id="err-valor_total"></span>
          <small style="color:var(--text-muted);font-size:0.75rem;margin-top:4px;display:block">
            Cálculo automático: <?= number_format($precoHoraEnsaio, 2, ',', '.') ?>/hora + Equipamentos
          </small>
        </div>
        <div class="form-group span-2">
          <label>Equipamentos Utilizados</label>
          <div class="equip-checkboxes">
            <?php foreach ($equipamentos_disponiveis as $eq): ?>
            <label class="equip-check-item">
              <input type="checkbox" name="equipamentos[]"
                     value="<?= $eq['id'] ?>"
                     class="equip-checkbox"
                     data-equip-id="<?= $eq['id'] ?>"
                     data-valor="<?= $eq['valor_locacao'] ?>">
              <span class="equip-check-label">
                <i class="fa-solid fa-plug"></i>
                <?= htmlspecialchars($eq['nome']) ?> (+R$ <?= number_format($eq['valor_locacao'], 2, ',', '.') ?>)
              </span>
            </label>
            <?php endforeach; ?>
            <?php if (empty($equipamentos_disponiveis)): ?>
              <p style="color:var(--text-muted);font-size:0.85rem">Nenhum equipamento disponível.</p>
            <?php endif; ?>
          </div>
        </div>
        <div class="form-group span-2">
          <label for="observacoes">Observações</label>
          <textarea id="observacoes" name="observacoes" rows="2"
                    placeholder="Notas adicionais…"></textarea>
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

<!-- Modal: Cancelar Agendamento -->
<div class="modal-overlay" id="modalDelOverlay">
  <div class="modal modal-sm glass">
    <div class="modal-header">
      <h2><i class="fa-solid fa-ban"></i> Cancelar Agendamento</h2>
      <button class="modal-close" id="btnFecharModalDel"><i class="fa-solid fa-xmark"></i></button>
    </div>
    <p id="textoConfirmacao" style="margin:1rem 0 1.5rem;color:var(--text-secondary)"></p>
    <form method="POST" action="api/agendamentos_action.php">
      <input type="hidden" name="acao" value="cancelar">
      <input type="hidden" name="id"   id="inputDelId" value="">
      <div class="modal-footer">
        <button type="button" class="btn btn-ghost" id="btnCancelarDel">Voltar</button>
        <button type="submit" class="btn btn-danger">
          <i class="fa-solid fa-ban"></i> Confirmar Cancelamento
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
<script src="assets/js/agendamentos.js"></script>
</body>
</html>
