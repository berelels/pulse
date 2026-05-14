<?php include 'includes/head.php'; ?>
<body>
<?php include 'includes/nav.php'; ?>

<main class="main-content">
  <header class="page-header">
    <div>
      <h1><i class="fa-solid fa-users-gear"></i> Usuários do Sistema</h1>
      <p class="page-subtitle">Apenas administradores podem gerenciar a equipe.</p>
    </div>
    <button class="btn btn-primary" id="btnNovoUser">
      <i class="fa-solid fa-user-plus"></i> Novo Usuário
    </button>
  </header>

  <section class="section-card glass">
    <div class="table-responsive">
      <table class="data-table">
        <thead>
          <tr><th>#</th><th>Nome</th><th>E-mail</th><th>Nível</th><th>Cadastro</th><th>Ações</th></tr>
        </thead>
        <tbody>
          <?php foreach ($usuarios as $u): ?>
          <tr>
            <td><?= $u['id'] ?></td>
            <td>
              <div class="user-chip-inline">
                <div class="user-avatar sm">
                  <?= mb_strtoupper(mb_substr($u['nome'], 0, 1)) ?>
                </div>
                <?= htmlspecialchars($u['nome']) ?>
              </div>
            </td>
            <td><?= htmlspecialchars($u['email']) ?></td>
            <td>
              <span class="badge <?= $u['is_admin'] ? 'badge-confirmado' : 'badge-pendente' ?>">
                <?= $u['is_admin'] ? 'Administrador' : 'Colaborador' ?>
              </span>
            </td>
            <td><?= date('d/m/Y', strtotime($u['criado_em'])) ?></td>
            <td class="action-btns">
              <button class="btn btn-icon btn-edit" title="Editar"
                data-id="<?= $u['id'] ?>"
                data-nome="<?= htmlspecialchars($u['nome'],  ENT_QUOTES) ?>"
                data-email="<?= htmlspecialchars($u['email'], ENT_QUOTES) ?>"
                data-admin="<?= $u['is_admin'] ? '1' : '0' ?>"
                data-perms='<?= $u['permissoes'] ?: "[]" ?>'>
                <i class="fa-solid fa-pen-to-square"></i>
              </button>
              <?php if ($u['id'] !== $usuarioAtual['id']): ?>
              <button class="btn btn-icon btn-delete" title="Excluir"
                data-id="<?= $u['id'] ?>"
                data-nome="<?= htmlspecialchars($u['nome'], ENT_QUOTES) ?>">
                <i class="fa-solid fa-trash"></i>
              </button>
              <?php endif; ?>
            </td>
          </tr>
          <?php endforeach; ?>
        </tbody>
      </table>
    </div>
  </section>
</main>

<!-- Modal: Criar / Editar Usuário -->
<div class="modal-overlay" id="modalOverlay">
  <div class="modal glass">
    <div class="modal-header">
      <h2 id="modalTitulo">Novo Usuário</h2>
      <button class="modal-close" id="btnFecharModal"><i class="fa-solid fa-xmark"></i></button>
    </div>
    <form id="formUser" method="POST" action="api/usuarios_action.php" novalidate>
      <input type="hidden" name="acao" id="inputAcao" value="criar">
      <input type="hidden" name="id"   id="inputId"   value="">
      <div class="form-grid">
        <div class="form-group span-2">
          <label for="nome">Nome completo *</label>
          <input type="text" id="nome" name="nome" placeholder="João da Silva" required>
          <span class="field-error" id="err-nome"></span>
        </div>
        <div class="form-group span-2">
          <label for="email">E-mail *</label>
          <input type="email" id="email" name="email" placeholder="joao@email.com" required>
          <span class="field-error" id="err-email"></span>
        </div>
        <div class="form-group span-2">
          <label for="senha">
            Senha *
            <span id="labelSenhaHint" style="font-size:.8rem;color:var(--text-muted);display:none">
              (deixe em branco para manter)
            </span>
          </label>
          <input type="password" id="senha" name="senha"
                 placeholder="Mínimo 6 caracteres">
          <span class="field-error" id="err-senha"></span>
        </div>
        <div class="form-group span-2">
          <label class="checkbox-label">
            <input type="checkbox" name="is_admin" id="is_admin" value="1">
            <span style="font-weight: 700; color: var(--clr-orange);">Acesso de Administrador (Acesso Total)</span>
          </label>
        </div>

        <div id="permissions-section" class="form-group span-2" style="border-top: 1px solid var(--glass-border); padding-top: 1rem; margin-top: 0.5rem;">
          <p style="font-weight: 600; margin-bottom: 0.8rem; font-size: 0.9rem;">Permissões Específicas (para Colaboradores):</p>
          
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
            <div>
              <p style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 0.5rem; text-transform: uppercase;">Módulos</p>
              <label class="checkbox-label" style="margin-bottom: 0.4rem;">
                <input type="checkbox" name="perms[]" value="bandas" class="perm-check"> <span>Bandas</span>
              </label>
              <label class="checkbox-label" style="margin-bottom: 0.4rem;">
                <input type="checkbox" name="perms[]" value="equipamentos" class="perm-check"> <span>Equipamentos</span>
              </label>
              <label class="checkbox-label" style="margin-bottom: 0.4rem;">
                <input type="checkbox" name="perms[]" value="agendamentos" class="perm-check"> <span>Agendamentos</span>
              </label>
              <label class="checkbox-label" style="margin-bottom: 0.4rem;">
                <input type="checkbox" name="perms[]" value="relatorios" class="perm-check"> <span>Relatórios</span>
              </label>
            </div>
            <div>
              <p style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 0.5rem; text-transform: uppercase;">Ações</p>
              <label class="checkbox-label" style="margin-bottom: 0.4rem;">
                <input type="checkbox" name="perms[]" value="edit" class="perm-check"> <span>Pode Editar</span>
              </label>
              <label class="checkbox-label" style="margin-bottom: 0.4rem;">
                <input type="checkbox" name="perms[]" value="delete" class="perm-check"> <span>Pode Excluir</span>
              </label>
            </div>
          </div>
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
      <h2><i class="fa-solid fa-triangle-exclamation"></i> Excluir Usuário</h2>
      <button class="modal-close" id="btnFecharModalDel"><i class="fa-solid fa-xmark"></i></button>
    </div>
    <p id="textoConfirmacao" style="margin:1rem 0 1.5rem;color:var(--text-secondary)"></p>
    <form method="POST" action="api/usuarios_action.php">
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
<script src="assets/js/usuarios.js"></script>
</body>
</html>
