'use strict';
// ── VIEWS ────────────────────────────────────────────────────────

function viewLogin() {
  document.body.className = '';
  const app = document.getElementById('app');
  app.style.cssText = 'display:flex;min-height:100vh;width:100%;position:relative;overflow:hidden;background:linear-gradient(135deg,#002A54 0%,#003f7a 50%,#1a2a4a 100%)';
  app.innerHTML = `
    <button id="theme-toggle" class="btn-icon" style="position:fixed;top:1.5rem;right:1.5rem;z-index:100;color:var(--text-secondary);background:var(--glass-bg);border:1px solid var(--glass-border);border-radius:50%;width:36px;height:36px;display:flex;align-items:center;justify-content:center;cursor:pointer;"><i class="fa-solid fa-sun"></i></button>
    <div class="login-left">
      <div class="login-left-content">
        <div class="login-logo-flat"><img src="assets/img/pulse_logo2.svg" alt="Pulse Logo" style="height:36px"></div>
        <h1 class="login-heading">Olá,<br>Bem-vindo de volta!</h1>
        <p class="login-sub">Acesse o painel de gestão do estúdio.</p>
        <div id="loginError" class="alert alert-error" style="display:none"></div>
        <form id="formLogin" novalidate>
          <div class="form-group">
            <label for="email">E-mail</label>
            <div class="input-icon">
              <i class="fa-regular fa-envelope"></i>
              <input type="email" id="email" placeholder="admin@pulse.studio" autocomplete="email">
            </div>
            <span class="field-error" id="err-email"></span>
          </div>
          <div class="form-group">
            <label for="senha">Senha</label>
            <div class="input-icon">
              <i class="fa-solid fa-lock"></i>
              <input type="password" id="senha" placeholder="••••••••" autocomplete="current-password">
              <button type="button" class="toggle-pass" onclick="toggleSenha()" aria-label="Mostrar senha"><i class="fa-regular fa-eye" id="icone-olho"></i></button>
            </div>
            <span class="field-error" id="err-senha"></span>
          </div>
          <button type="submit" class="btn-login-flat" id="btnLogin"><span>Entrar</span><i class="fa-solid fa-arrow-right"></i></button>
        </form>
        <p class="login-hint-flat">Acesso restrito à equipe do estúdio.</p>
      </div>
    </div>
    <div class="login-right">
      <div class="login-illus-wrap">
        <img src="assets/img/login_illustration.png" alt="Estúdio" draggable="false">
        <div class="login-badge badge-top"><i class="fa-solid fa-guitar"></i><span>Bandas Ativas</span></div>
        <div class="login-badge badge-mid"><i class="fa-solid fa-calendar-check"></i><span>Agendamentos</span></div>
        <div class="login-badge badge-bot"><i class="fa-solid fa-circle-dollar-to-slot"></i><span>Faturamento</span></div>
      </div>
      <p class="login-right-title">Pulse Studio · Gestão Inteligente</p>
    </div>
    <div id="toast-container"></div>
  `;

  initTheme();

  document.getElementById('formLogin').addEventListener('submit', function(e) {
    e.preventDefault();
    const email = document.getElementById('email').value.trim();
    const senha = document.getElementById('senha').value;
    const errEmail = document.getElementById('err-email');
    const errSenha = document.getElementById('err-senha');
    errEmail.textContent = ''; errSenha.textContent = '';
    let ok = true;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { errEmail.textContent = 'Informe um e-mail válido.'; ok = false; }
    if (senha.length < 4) { errSenha.textContent = 'Senha muito curta.'; ok = false; }
    if (!ok) return;
    if (PulseAuth.login(email, senha)) {
      window.location.hash = '#dashboard';
    } else {
      const errDiv = document.getElementById('loginError');
      errDiv.style.display = 'flex';
      errDiv.innerHTML = '<i class="fa-solid fa-circle-exclamation"></i> E-mail ou senha incorretos.';
    }
  });
}

function toggleSenha() {
  const c = document.getElementById('senha');
  const i = document.getElementById('icone-olho');
  if (!c) return;
  if (c.type === 'password') { c.type = 'text'; i.className = 'fa-regular fa-eye-slash'; }
  else { c.type = 'password'; i.className = 'fa-regular fa-eye'; }
}

function viewDashboard() {
  if (!PulseAuth.check()) return;
  document.body.className = '';
  const _app = document.getElementById('app'); if(_app) _app.style.cssText = '';
  const u = PulseAuth.current();
  const bandas = PulseStore.getAll('bandas');
  const ags = PulseStore.getAll('agendamentos');
  const equips = PulseStore.getAll('equipamentos');
  const now = new Date();
  const m = now.getMonth(), y = now.getFullYear();
  const ativas = ags.filter(a => a.status !== 'cancelado');
  const faturamento = ags.filter(a => a.status === 'concluido' && new Date(a.data_ensaio).getMonth()===m && new Date(a.data_ensaio).getFullYear()===y).reduce((s,a) => s + parseFloat(a.valor_total), 0);
  const proximos = ags.filter(a => a.status !== 'cancelado' && new Date(a.data_ensaio) >= new Date()).slice(0,5).map(a => {
    const banda = bandas.find(b => b.id === a.banda_id);
    return `<tr>
      <td><strong>${banda ? banda.nome_banda : '—'}</strong></td>
      <td>${fmtDate(a.data_ensaio)}</td>
      <td>${fmtTime(a.hora_inicio)} – ${fmtTime(a.hora_fim)}</td>
      <td>${fmtMoney(a.valor_total)}</td>
      <td>${badgeHtml(a.status)}</td>
    </tr>`;
  }).join('') || '<tr><td colspan="5" class="empty-state"><i class="fa-regular fa-calendar-xmark"></i> Nenhum agendamento próximo.</td></tr>';

  const today = `${String(now.getDate()).padStart(2,'0')}/${String(now.getMonth()+1).padStart(2,'0')}/${now.getFullYear()}`;
  document.getElementById('app').innerHTML = `
  ${renderNav('dashboard')}
  <main class="main-content">
    <header class="page-header">
      <div><h1>Dashboard</h1><p class="page-subtitle">Bem-vindo de volta, <strong>${u.nome}</strong> 👋</p></div>
      <div class="header-actions" style="display:flex;align-items:center;gap:1rem">
        <div class="header-date"><i class="fa-regular fa-calendar"></i>${today}</div>
        <button id="theme-toggle" class="btn-icon" style="color:var(--text-secondary);background:var(--glass-bg);border:1px solid var(--glass-border);border-radius:50%;width:36px;height:36px;display:flex;align-items:center;justify-content:center;cursor:pointer;"><i class="fa-solid fa-sun"></i></button>
      </div>
    </header>
    <section class="kpi-grid">
      <div class="kpi-card glass"><div class="kpi-icon kpi-blue"><i class="fa-solid fa-guitar"></i></div><div class="kpi-info"><span class="kpi-value">${bandas.length}</span><span class="kpi-label">Bandas Cadastradas</span></div></div>
      <div class="kpi-card glass"><div class="kpi-icon kpi-orange"><i class="fa-solid fa-calendar-check"></i></div><div class="kpi-info"><span class="kpi-value">${ativas.length}</span><span class="kpi-label">Agendamentos Ativos</span></div></div>
      <div class="kpi-card glass"><div class="kpi-icon kpi-green"><i class="fa-solid fa-microphone-lines"></i></div><div class="kpi-info"><span class="kpi-value">${equips.filter(e=>e.status==='disponivel').length}</span><span class="kpi-label">Equipamentos Disponíveis</span></div></div>
      <div class="kpi-card glass"><div class="kpi-icon kpi-teal"><i class="fa-solid fa-circle-dollar-to-slot"></i></div><div class="kpi-info"><span class="kpi-value">${fmtMoney(faturamento)}</span><span class="kpi-label">Faturamento do Mês</span></div></div>
    </section>
    <section class="section-card glass">
      <div class="section-header"><h2><i class="fa-solid fa-clock"></i> Próximos Ensaios</h2><a href="#agendamentos" class="btn btn-ghost btn-sm">Ver todos <i class="fa-solid fa-arrow-right"></i></a></div>
      <div class="table-responsive"><table class="data-table"><thead><tr><th>Banda</th><th>Data</th><th>Horário</th><th>Valor</th><th>Status</th></tr></thead><tbody>${proximos}</tbody></table></div>
    </section>
  </main>
  <div id="toast-container"></div>`;

  document.getElementById('btnLogout').addEventListener('click', () => { PulseAuth.logout(); });
  initTheme(); animateCards();
}

function viewBandas() {
  if (!PulseAuth.check()) return;
  document.body.className = '';
  const _app = document.getElementById('app'); if(_app) _app.style.cssText = '';
  const u = PulseAuth.current();
  const canEdit = u.is_admin || (u.permissoes||[]).includes('edit');
  const canDel = u.is_admin || (u.permissoes||[]).includes('delete');
  const bandas = PulseStore.getAll('bandas');
  const rows = bandas.length ? bandas.map(b => `
    <tr>
      <td>${b.id}</td><td><strong>${b.nome_banda}</strong></td><td>${b.responsavel}</td>
      <td>${b.telefone||'—'}</td><td>${b.genero||'—'}</td><td>${fmtDate(b.criado_em)}</td>
      <td class="action-btns">
        ${canEdit ? `<button class="btn btn-icon btn-edit" data-id="${b.id}" data-nome="${b.nome_banda}" data-resp="${b.responsavel}" data-tel="${b.telefone||''}" data-gen="${b.genero||''}" title="Editar"><i class="fa-solid fa-pen-to-square"></i></button>` : ''}
        ${canDel ? `<button class="btn btn-icon btn-delete" data-id="${b.id}" data-nome="${b.nome_banda}" title="Excluir"><i class="fa-solid fa-trash"></i></button>` : ''}
      </td>
    </tr>`).join('') : '<tr><td colspan="7" class="empty-state"><i class="fa-solid fa-face-meh"></i> Nenhuma banda encontrada.</td></tr>';

  document.getElementById('app').innerHTML = `
  ${renderNav('bandas')}
  <main class="main-content">
    <header class="page-header">
      <div><h1><i class="fa-solid fa-guitar"></i> Bandas &amp; Clientes</h1><p class="page-subtitle">Gerencie o cadastro de bandas e responsáveis.</p></div>
      ${canEdit ? '<button class="btn btn-primary" id="btnNovaBanda"><i class="fa-solid fa-plus"></i> Nova Banda</button>' : ''}
    </header>
    <section class="section-card glass">
      <div class="table-responsive"><table class="data-table" id="tabelaBandas">
        <thead><tr><th>#</th><th>Banda</th><th>Responsável</th><th>Telefone</th><th>Gênero</th><th>Cadastro</th><th>Ações</th></tr></thead>
        <tbody>${rows}</tbody>
      </table></div>
    </section>
  </main>
  <div class="modal-overlay" id="modalOverlay">
    <div class="modal glass">
      <div class="modal-header"><h2 id="modalTitulo">Nova Banda</h2><button class="modal-close" id="btnFecharModal"><i class="fa-solid fa-xmark"></i></button></div>
      <form id="formBanda" novalidate>
        <input type="hidden" id="inputAcao" value="criar"><input type="hidden" id="inputId" value="">
        <div class="form-grid">
          <div class="form-group span-2"><label>Nome da Banda *</label><input type="text" id="nome_banda" placeholder="Ex: The Analog Keys"><span class="field-error" id="err-nome_banda"></span></div>
          <div class="form-group"><label>Responsável *</label><input type="text" id="responsavel" placeholder="Nome completo"><span class="field-error" id="err-responsavel"></span></div>
          <div class="form-group"><label>Telefone</label><input type="text" id="telefone" placeholder="(11) 99999-9999"></div>
          <div class="form-group span-2"><label>Gênero Musical</label><input type="text" id="genero" placeholder="Ex: Rock, Jazz, MPB…"></div>
        </div>
        <div class="modal-footer"><button type="button" class="btn btn-ghost" id="btnCancelarModal">Cancelar</button><button type="submit" class="btn btn-primary"><i class="fa-solid fa-floppy-disk"></i> Salvar</button></div>
      </form>
    </div>
  </div>
  <div class="modal-overlay" id="modalDelOverlay">
    <div class="modal modal-sm glass">
      <div class="modal-header"><h2><i class="fa-solid fa-triangle-exclamation"></i> Confirmar Exclusão</h2><button class="modal-close" id="btnFecharModalDel"><i class="fa-solid fa-xmark"></i></button></div>
      <p id="textoConfirmacao" style="margin:1rem 0 1.5rem;color:var(--text-secondary)"></p>
      <div class="modal-footer"><button type="button" class="btn btn-ghost" id="btnCancelarDel">Cancelar</button><button class="btn btn-danger" id="btnConfirmarDel"><i class="fa-solid fa-trash"></i> Excluir</button></div>
    </div>
  </div>
  <div id="toast-container"></div>`;

  document.getElementById('btnLogout').addEventListener('click', () => PulseAuth.logout());
  initTheme(); animateCards();

  if (canEdit) {
    document.getElementById('btnNovaBanda').addEventListener('click', () => {
      document.getElementById('modalTitulo').textContent = 'Nova Banda';
      document.getElementById('inputAcao').value = 'criar';
      document.getElementById('inputId').value = '';
      document.getElementById('formBanda').reset();
      ['nome_banda','responsavel'].forEach(c => { document.getElementById('err-'+c).textContent = ''; });
      openModal('modalOverlay');
    });
  }

  document.getElementById('tabelaBandas').addEventListener('click', function(e) {
    const edit = e.target.closest('.btn-edit');
    if (edit) {
      document.getElementById('modalTitulo').textContent = 'Editar Banda';
      document.getElementById('inputAcao').value = 'editar';
      document.getElementById('inputId').value = edit.dataset.id;
      document.getElementById('nome_banda').value = edit.dataset.nome;
      document.getElementById('responsavel').value = edit.dataset.resp;
      document.getElementById('telefone').value = edit.dataset.tel;
      document.getElementById('genero').value = edit.dataset.gen;
      openModal('modalOverlay');
    }
    const del = e.target.closest('.btn-delete');
    if (del) {
      document.getElementById('textoConfirmacao').textContent = `Deseja excluir a banda "${del.dataset.nome}"? Esta ação é irreversível.`;
      document.getElementById('btnConfirmarDel').dataset.id = del.dataset.id;
      openModal('modalDelOverlay');
    }
  });

  document.getElementById('formBanda').addEventListener('submit', function(e) {
    e.preventDefault();
    const nome = document.getElementById('nome_banda').value.trim();
    const resp = document.getElementById('responsavel').value.trim();
    let ok = true;
    if (!nome) { document.getElementById('err-nome_banda').textContent = 'Campo obrigatório.'; ok = false; }
    if (!resp) { document.getElementById('err-responsavel').textContent = 'Campo obrigatório.'; ok = false; }
    if (!ok) return;
    const obj = { nome_banda: nome, responsavel: resp, telefone: document.getElementById('telefone').value.trim(), genero: document.getElementById('genero').value.trim() };
    const acao = document.getElementById('inputAcao').value;
    if (acao === 'criar') PulseStore.create('bandas', obj);
    else PulseStore.update('bandas', parseInt(document.getElementById('inputId').value), obj);
    closeModal('modalOverlay');
    showToast('Banda salva com sucesso!', 'success');
    viewBandas();
  });

  ['btnFecharModal','btnCancelarModal'].forEach(id => { const el = document.getElementById(id); if(el) el.addEventListener('click', () => closeModal('modalOverlay')); });
  ['btnFecharModalDel','btnCancelarDel'].forEach(id => { const el = document.getElementById(id); if(el) el.addEventListener('click', () => closeModal('modalDelOverlay')); });
  document.getElementById('btnConfirmarDel').addEventListener('click', function() {
    PulseStore.remove('bandas', parseInt(this.dataset.id));
    closeModal('modalDelOverlay');
    showToast('Banda excluída.', 'info');
    viewBandas();
  });

  document.addEventListener('keydown', function esc(e) {
    if (e.key === 'Escape') { closeModal('modalOverlay'); closeModal('modalDelOverlay'); }
  }, {once:true});
}

function viewEquipamentos() {
  if (!PulseAuth.check()) return;
  document.body.className = '';
  const _app = document.getElementById('app'); if(_app) _app.style.cssText = '';
  const u = PulseAuth.current();
  const canEdit = u.is_admin || (u.permissoes||[]).includes('edit');
  const canDel = u.is_admin || (u.permissoes||[]).includes('delete');
  const equips = PulseStore.getAll('equipamentos');
  const rows = equips.length ? equips.map(eq => `
    <tr>
      <td>${eq.id}</td><td><strong>${eq.nome}</strong></td><td>${eq.descricao||'—'}</td>
      <td>${fmtMoney(eq.valor_locacao)}</td><td>${badgeHtml(eq.status)}</td>
      <td class="action-btns">
        ${canEdit ? `<button class="btn btn-icon btn-edit" data-id="${eq.id}" data-nome="${eq.nome}" data-desc="${eq.descricao||''}" data-valor="${eq.valor_locacao}" data-status="${eq.status}" title="Editar"><i class="fa-solid fa-pen-to-square"></i></button>` : ''}
        ${canDel ? `<button class="btn btn-icon btn-delete" data-id="${eq.id}" data-nome="${eq.nome}" title="Excluir"><i class="fa-solid fa-trash"></i></button>` : ''}
      </td>
    </tr>`).join('') : '<tr><td colspan="6" class="empty-state"><i class="fa-solid fa-box-open"></i> Nenhum equipamento encontrado.</td></tr>';

  document.getElementById('app').innerHTML = `
  ${renderNav('equipamentos')}
  <main class="main-content">
    <header class="page-header">
      <div><h1><i class="fa-solid fa-microphone-lines"></i> Equipamentos</h1><p class="page-subtitle">Catálogo de equipamentos disponíveis para locação.</p></div>
      ${canEdit ? '<button class="btn btn-primary" id="btnNovoEquip"><i class="fa-solid fa-plus"></i> Novo Equipamento</button>' : ''}
    </header>
    <section class="section-card glass">
      <div class="table-responsive"><table class="data-table">
        <thead><tr><th>#</th><th>Equipamento</th><th>Descrição</th><th>Valor/Sessão</th><th>Status</th><th>Ações</th></tr></thead>
        <tbody>${rows}</tbody>
      </table></div>
    </section>
  </main>
  <div class="modal-overlay" id="modalOverlay">
    <div class="modal glass">
      <div class="modal-header"><h2 id="modalTitulo">Novo Equipamento</h2><button class="modal-close" id="btnFecharModal"><i class="fa-solid fa-xmark"></i></button></div>
      <form id="formEquip" novalidate>
        <input type="hidden" id="inputAcao" value="criar"><input type="hidden" id="inputId" value="">
        <div class="form-grid">
          <div class="form-group span-2"><label>Nome do Equipamento *</label><input type="text" id="nome" placeholder="Ex: Marshall JCM800"><span class="field-error" id="err-nome"></span></div>
          <div class="form-group span-2"><label>Descrição</label><input type="text" id="descricao" placeholder="Breve descrição técnica"></div>
          <div class="form-group"><label>Valor por Sessão (R$) *</label><input type="number" id="valor_locacao" step="0.01" min="0" placeholder="0.00"><span class="field-error" id="err-valor_locacao"></span></div>
          <div class="form-group"><label>Status *</label><select id="status"><option value="disponivel">Disponível</option><option value="manutencao">Manutenção</option></select></div>
        </div>
        <div class="modal-footer"><button type="button" class="btn btn-ghost" id="btnCancelarModal">Cancelar</button><button type="submit" class="btn btn-primary"><i class="fa-solid fa-floppy-disk"></i> Salvar</button></div>
      </form>
    </div>
  </div>
  <div class="modal-overlay" id="modalDelOverlay">
    <div class="modal modal-sm glass">
      <div class="modal-header"><h2><i class="fa-solid fa-triangle-exclamation"></i> Confirmar Exclusão</h2><button class="modal-close" id="btnFecharModalDel"><i class="fa-solid fa-xmark"></i></button></div>
      <p id="textoConfirmacao" style="margin:1rem 0 1.5rem;color:var(--text-secondary)"></p>
      <div class="modal-footer"><button type="button" class="btn btn-ghost" id="btnCancelarDel">Cancelar</button><button class="btn btn-danger" id="btnConfirmarDel"><i class="fa-solid fa-trash"></i> Excluir</button></div>
    </div>
  </div>
  <div id="toast-container"></div>`;

  document.getElementById('btnLogout').addEventListener('click', () => PulseAuth.logout());
  initTheme(); animateCards();

  if (canEdit) {
    document.getElementById('btnNovoEquip').addEventListener('click', () => {
      document.getElementById('modalTitulo').textContent = 'Novo Equipamento';
      document.getElementById('inputAcao').value = 'criar';
      document.getElementById('inputId').value = '';
      document.getElementById('formEquip').reset();
      ['nome','valor_locacao'].forEach(c => { const e=document.getElementById('err-'+c); if(e) e.textContent=''; });
      openModal('modalOverlay');
    });
  }

  document.querySelector('.data-table').addEventListener('click', function(e) {
    const edit = e.target.closest('.btn-edit');
    if (edit) {
      document.getElementById('modalTitulo').textContent = 'Editar Equipamento';
      document.getElementById('inputAcao').value = 'editar';
      document.getElementById('inputId').value = edit.dataset.id;
      document.getElementById('nome').value = edit.dataset.nome;
      document.getElementById('descricao').value = edit.dataset.desc;
      document.getElementById('valor_locacao').value = edit.dataset.valor;
      document.getElementById('status').value = edit.dataset.status;
      openModal('modalOverlay');
    }
    const del = e.target.closest('.btn-delete');
    if (del) {
      document.getElementById('textoConfirmacao').textContent = `Excluir o equipamento "${del.dataset.nome}"?`;
      document.getElementById('btnConfirmarDel').dataset.id = del.dataset.id;
      openModal('modalDelOverlay');
    }
  });

  document.getElementById('formEquip').addEventListener('submit', function(e) {
    e.preventDefault();
    const nome = document.getElementById('nome').value.trim();
    const valor = document.getElementById('valor_locacao').value;
    let ok = true;
    if (!nome) { document.getElementById('err-nome').textContent = 'Campo obrigatório.'; ok = false; }
    if (!valor) { document.getElementById('err-valor_locacao').textContent = 'Campo obrigatório.'; ok = false; }
    if (!ok) return;
    const obj = { nome, descricao: document.getElementById('descricao').value.trim(), valor_locacao: parseFloat(valor), status: document.getElementById('status').value };
    if (document.getElementById('inputAcao').value === 'criar') PulseStore.create('equipamentos', obj);
    else PulseStore.update('equipamentos', parseInt(document.getElementById('inputId').value), obj);
    closeModal('modalOverlay');
    showToast('Equipamento salvo!', 'success');
    viewEquipamentos();
  });

  ['btnFecharModal','btnCancelarModal'].forEach(id => { const el=document.getElementById(id); if(el) el.addEventListener('click',()=>closeModal('modalOverlay')); });
  ['btnFecharModalDel','btnCancelarDel'].forEach(id => { const el=document.getElementById(id); if(el) el.addEventListener('click',()=>closeModal('modalDelOverlay')); });
  document.getElementById('btnConfirmarDel').addEventListener('click', function() {
    PulseStore.remove('equipamentos', parseInt(this.dataset.id));
    closeModal('modalDelOverlay');
    showToast('Equipamento excluído.', 'info');
    viewEquipamentos();
  });
}

function viewAgendamentos() {
  if (!PulseAuth.check()) return;
  document.body.className = '';
  const _app = document.getElementById('app'); if(_app) _app.style.cssText = '';
  const u = PulseAuth.current();
  const canEdit = u.is_admin || (u.permissoes||[]).includes('edit');
  const canDel = u.is_admin || (u.permissoes||[]).includes('delete');
  const bandas = PulseStore.getAll('bandas');
  const ags = PulseStore.getAll('agendamentos');
  const equips = PulseStore.getAll('equipamentos');
  const precoHora = PulseStore.getPrecoHora();

  const rows = ags.length ? ags.map(a => {
    const banda = bandas.find(b => b.id === a.banda_id);
    const nomeUser = u.nome;
    return `<tr>
      <td><strong>${banda?banda.nome_banda:'—'}</strong></td>
      <td>${fmtDate(a.data_ensaio)}</td>
      <td>${fmtTime(a.hora_inicio)} – ${fmtTime(a.hora_fim)}</td>
      <td>${fmtMoney(a.valor_total)}</td>
      <td>${badgeHtml(a.status)}</td>
      <td>${nomeUser}</td>
      <td class="action-btns">
        ${canEdit ? `<button class="btn btn-icon btn-edit" data-id="${a.id}" data-banda="${a.banda_id}" data-data="${a.data_ensaio}" data-ini="${fmtTime(a.hora_inicio)}" data-fim="${fmtTime(a.hora_fim)}" data-valor="${a.valor_total}" data-status="${a.status}" data-obs="${a.observacoes||''}" data-equipamentos='${JSON.stringify(a.equipamentos||[])}' title="Editar"><i class="fa-solid fa-pen-to-square"></i></button>` : ''}
        ${canEdit && a.status==='pendente' ? `<button class="btn btn-icon btn-confirm btn-status" data-id="${a.id}" data-acao="confirmar" title="Confirmar"><i class="fa-solid fa-check"></i></button>` : ''}
        ${canEdit && a.status==='confirmado' ? `<button class="btn btn-icon btn-status" data-id="${a.id}" data-acao="concluir" title="Concluir" style="color:var(--clr-green,#27ae60)"><i class="fa-solid fa-flag-checkered"></i></button>` : ''}
        ${canDel && a.status!=='cancelado' ? `<button class="btn btn-icon btn-delete" data-id="${a.id}" data-nome="${banda?banda.nome_banda:'—'}" title="Cancelar"><i class="fa-solid fa-ban"></i></button>` : ''}
      </td>
    </tr>`;
  }).join('') : '<tr><td colspan="7" class="empty-state"><i class="fa-regular fa-calendar-xmark"></i> Nenhum agendamento encontrado.</td></tr>';

  const bandaOptions = bandas.map(b => `<option value="${b.id}">${b.nome_banda}</option>`).join('');
  const equipChecks = equips.map(eq => `
    <label class="equip-check-item">
      <input type="checkbox" name="equipamentos[]" class="equip-checkbox" data-equip-id="${eq.id}" data-valor="${eq.valor_locacao}" value="${eq.id}">
      <span class="equip-check-label"><i class="fa-solid fa-plug"></i>${eq.nome} (+${fmtMoney(eq.valor_locacao)})</span>
    </label>`).join('');

  document.getElementById('app').innerHTML = `
  ${renderNav('agendamentos')}
  <main class="main-content">
    <header class="page-header">
      <div><h1><i class="fa-solid fa-calendar-days"></i> Agendamentos</h1><p class="page-subtitle">Gerencie os ensaios e gravações do estúdio.</p></div>
      ${canEdit ? '<button class="btn btn-primary" id="btnNovoAg"><i class="fa-solid fa-plus"></i> Novo Agendamento</button>' : ''}
    </header>
    <section class="section-card glass">
      <div class="table-responsive"><table class="data-table" id="tabelaAgendamentos">
        <thead><tr><th>Banda</th><th>Data</th><th>Horário</th><th>Valor</th><th>Status</th><th>Responsável</th><th>Ações</th></tr></thead>
        <tbody>${rows}</tbody>
      </table></div>
    </section>
  </main>
  <div class="modal-overlay" id="modalOverlay">
    <div class="modal glass modal-lg">
      <div class="modal-header"><h2 id="modalTitulo">Novo Agendamento</h2><button class="modal-close" id="btnFecharModal"><i class="fa-solid fa-xmark"></i></button></div>
      <form id="formAg" novalidate>
        <input type="hidden" id="inputAcao" value="criar"><input type="hidden" id="inputId" value="">
        <div class="form-grid">
          <div class="form-group span-2"><label>Banda *</label><select id="banda_id"><option value="">Selecione a banda…</option>${bandaOptions}</select><span class="field-error" id="err-banda_id"></span></div>
          <div class="form-group"><label>Data do Ensaio *</label><input type="date" id="data_ensaio"><span class="field-error" id="err-data_ensaio"></span></div>
          <div class="form-group"><label>Status</label><select id="status_ag"><option value="confirmado">Confirmado</option><option value="pendente">Pendente</option><option value="concluido">Concluído</option><option value="cancelado">Cancelado</option></select></div>
          <div class="form-group"><label>Hora Início *</label><input type="time" id="hora_inicio"><span class="field-error" id="err-hora_inicio"></span></div>
          <div class="form-group"><label>Hora Fim *</label><input type="time" id="hora_fim"><span class="field-error" id="err-hora_fim"></span></div>
          <div class="form-group"><label>Valor Total (R$) *</label><input type="number" id="valor_total" step="0.01" min="0" placeholder="0.00" readonly data-preco-hora="${precoHora}"><span class="field-error" id="err-valor_total"></span><small style="color:var(--text-muted);font-size:.75rem;margin-top:4px;display:block">Cálculo automático: ${fmtMoney(precoHora)}/hora + Equipamentos</small></div>
          <div class="form-group span-2"><label>Equipamentos Utilizados</label><div class="equip-checkboxes">${equipChecks||'<p style="color:var(--text-muted)">Nenhum equipamento disponível.</p>'}</div></div>
          <div class="form-group span-2"><label>Observações</label><textarea id="observacoes" rows="2" placeholder="Notas adicionais…"></textarea></div>
        </div>
        <div class="modal-footer"><button type="button" class="btn btn-ghost" id="btnCancelarModal">Cancelar</button><button type="submit" class="btn btn-primary"><i class="fa-solid fa-floppy-disk"></i> Salvar</button></div>
      </form>
    </div>
  </div>
  <div class="modal-overlay" id="modalDelOverlay">
    <div class="modal modal-sm glass">
      <div class="modal-header"><h2><i class="fa-solid fa-ban"></i> Cancelar Agendamento</h2><button class="modal-close" id="btnFecharModalDel"><i class="fa-solid fa-xmark"></i></button></div>
      <p id="textoConfirmacao" style="margin:1rem 0 1.5rem;color:var(--text-secondary)"></p>
      <div class="modal-footer"><button type="button" class="btn btn-ghost" id="btnCancelarDel">Voltar</button><button class="btn btn-danger" id="btnConfirmarDel"><i class="fa-solid fa-ban"></i> Confirmar Cancelamento</button></div>
    </div>
  </div>
  <div id="toast-container"></div>`;

  document.getElementById('btnLogout').addEventListener('click', () => PulseAuth.logout());
  initTheme(); animateCards();

  function recalc() {
    const ini = document.getElementById('hora_inicio').value;
    const fim = document.getElementById('hora_fim').value;
    const ph = parseFloat(document.getElementById('valor_total').dataset.precoHora || 150);
    let v = 0;
    if (ini && fim) {
      const [h1,m1] = ini.split(':').map(Number);
      const [h2,m2] = fim.split(':').map(Number);
      let diff = (h2+m2/60)-(h1+m1/60);
      if (diff < 0) diff += 24;
      v = diff * ph;
    }
    document.querySelectorAll('.equip-checkbox:checked').forEach(cb => { v += parseFloat(cb.dataset.valor||0); });
    if (v > 0) document.getElementById('valor_total').value = v.toFixed(2);
  }

  ['hora_inicio','hora_fim'].forEach(id => { const el=document.getElementById(id); if(el) el.addEventListener('change',recalc); });
  document.querySelectorAll('.equip-checkbox').forEach(cb => cb.addEventListener('change', recalc));

  if (canEdit) {
    document.getElementById('btnNovoAg').addEventListener('click', () => {
      document.getElementById('modalTitulo').textContent = 'Novo Agendamento';
      document.getElementById('inputAcao').value = 'criar';
      document.getElementById('inputId').value = '';
      document.getElementById('formAg').reset();
      document.querySelectorAll('.equip-checkbox').forEach(cb => cb.checked = false);
      openModal('modalOverlay');
    });
  }

  document.getElementById('tabelaAgendamentos').addEventListener('click', function(e) {
    const edit = e.target.closest('.btn-edit');
    if (edit) {
      document.getElementById('modalTitulo').textContent = 'Editar Agendamento';
      document.getElementById('inputAcao').value = 'editar';
      document.getElementById('inputId').value = edit.dataset.id;
      document.getElementById('banda_id').value = edit.dataset.banda;
      document.getElementById('data_ensaio').value = edit.dataset.data;
      document.getElementById('hora_inicio').value = edit.dataset.ini;
      document.getElementById('hora_fim').value = edit.dataset.fim;
      document.getElementById('valor_total').value = edit.dataset.valor;
      document.getElementById('status_ag').value = edit.dataset.status;
      document.getElementById('observacoes').value = edit.dataset.obs;
      const eqIds = JSON.parse(edit.dataset.equipamentos||'[]');
      document.querySelectorAll('.equip-checkbox').forEach(cb => { cb.checked = eqIds.includes(parseInt(cb.value)); });
      openModal('modalOverlay');
    }
    const status = e.target.closest('.btn-status');
    if (status) {
      const acao = status.dataset.acao;
      const id = parseInt(status.dataset.id);
      PulseStore.update('agendamentos', id, { status: acao==='confirmar'?'confirmado':'concluido' });
      showToast(acao==='confirmar'?'Agendamento confirmado!':'Agendamento concluído!', 'success');
      viewAgendamentos();
    }
    const del = e.target.closest('.btn-delete');
    if (del) {
      document.getElementById('textoConfirmacao').textContent = `Cancelar o agendamento de "${del.dataset.nome}"?`;
      document.getElementById('btnConfirmarDel').dataset.id = del.dataset.id;
      openModal('modalDelOverlay');
    }
  });

  document.getElementById('formAg').addEventListener('submit', function(e) {
    e.preventDefault();
    const campos = ['banda_id','data_ensaio','hora_inicio','hora_fim','valor_total'];
    let ok = true;
    campos.forEach(c => {
      const el=document.getElementById(c); const err=document.getElementById('err-'+c);
      if (err&&!el.value.trim()) { err.textContent='Campo obrigatório.'; ok=false; } else if(err) err.textContent='';
    });
    if (!ok) return;
    const eqSel = Array.from(document.querySelectorAll('.equip-checkbox:checked')).map(cb => parseInt(cb.value));
    const obj = { banda_id: parseInt(document.getElementById('banda_id').value), usuario_id: u.id, data_ensaio: document.getElementById('data_ensaio').value, hora_inicio: document.getElementById('hora_inicio').value, hora_fim: document.getElementById('hora_fim').value, valor_total: parseFloat(document.getElementById('valor_total').value), status: document.getElementById('status_ag').value, observacoes: document.getElementById('observacoes').value.trim(), equipamentos: eqSel };
    if (document.getElementById('inputAcao').value === 'criar') PulseStore.create('agendamentos', obj);
    else PulseStore.update('agendamentos', parseInt(document.getElementById('inputId').value), obj);
    closeModal('modalOverlay');
    showToast('Agendamento salvo!', 'success');
    viewAgendamentos();
  });

  ['btnFecharModal','btnCancelarModal'].forEach(id => { const el=document.getElementById(id); if(el) el.addEventListener('click',()=>closeModal('modalOverlay')); });
  ['btnFecharModalDel','btnCancelarDel'].forEach(id => { const el=document.getElementById(id); if(el) el.addEventListener('click',()=>closeModal('modalDelOverlay')); });
  document.getElementById('btnConfirmarDel').addEventListener('click', function() {
    PulseStore.update('agendamentos', parseInt(this.dataset.id), { status: 'cancelado' });
    closeModal('modalDelOverlay');
    showToast('Agendamento cancelado.', 'info');
    viewAgendamentos();
  });
}

function viewRelatorios() {
  if (!PulseAuth.check()) return;
  document.body.className = '';
  const _app = document.getElementById('app'); if(_app) _app.style.cssText = '';
  const ags = PulseStore.getAll('agendamentos');
  const bandas = PulseStore.getAll('bandas');
  const now = new Date();
  const dataIni = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().slice(0,10);
  const dataFim = now.toISOString().slice(0,10);

  function calcular(ini, fim) {
    const filtered = ags.filter(a => a.data_ensaio >= ini && a.data_ensaio <= fim);
    const faturado = filtered.filter(a=>a.status==='concluido').reduce((s,a)=>s+parseFloat(a.valor_total),0);
    const porStatus = ['confirmado','pendente','concluido','cancelado'].map(s => ({status:s, total: filtered.filter(a=>a.status===s).length})).filter(s=>s.total>0);
    const topMap = {};
    filtered.forEach(a => {
      const b = bandas.find(x=>x.id===a.banda_id);
      const n = b?b.nome_banda:'—';
      if (!topMap[n]) topMap[n]={nome:n,total:0,faturamento:0};
      topMap[n].total++;
      topMap[n].faturamento+=parseFloat(a.valor_total);
    });
    const top = Object.values(topMap).sort((a,b)=>b.faturamento-a.faturamento).slice(0,5);
    return {filtered,faturado,porStatus,top};
  }

  let {filtered,faturado,porStatus,top} = calcular(dataIni, dataFim);

  function renderPage(ini,fim,data) {
    const statusCards = data.porStatus.map(s=>`<div class="kpi-card glass"><div class="kpi-icon kpi-blue"><i class="fa-solid fa-layer-group"></i></div><div class="kpi-info"><span class="kpi-value">${s.total}</span><span class="kpi-label">${s.status.charAt(0).toUpperCase()+s.status.slice(1)}</span></div></div>`).join('');
    const topRows = data.top.map((t,i)=>`<tr><td><span class="rank-badge">${i+1}</span>${t.nome}</td><td>${t.total}</td><td>${fmtMoney(t.faturamento)}</td></tr>`).join('');
    const detRows = data.filtered.length ? data.filtered.map(d=>{const b=bandas.find(x=>x.id===d.banda_id); return `<tr><td>${d.id}</td><td><strong>${b?b.nome_banda:'—'}</strong></td><td>${fmtDate(d.data_ensaio)}</td><td>${fmtTime(d.hora_inicio)} – ${fmtTime(d.hora_fim)}</td><td>${fmtMoney(d.valor_total)}</td><td>${badgeHtml(d.status)}</td><td>—</td></tr>`;}).join('') : '<tr><td colspan="7" class="empty-state"><i class="fa-solid fa-chart-simple"></i> Sem dados no período.</td></tr>';
    return `
    ${renderNav('relatorios')}
    <main class="main-content">
      <header class="page-header">
        <div><h1><i class="fa-solid fa-chart-line"></i> Relatórios</h1><p class="page-subtitle">Análise de desempenho e faturamento do estúdio.</p></div>
        <div class="export-btns"><button class="btn btn-ghost" id="btnExcelRel"><i class="fa-solid fa-file-excel"></i> Excel</button><button class="btn btn-primary" id="btnPdfRel"><i class="fa-solid fa-file-pdf"></i> PDF</button></div>
      </header>
      <form id="formPeriodo" class="search-bar glass">
        <label style="font-weight:500;color:var(--text-secondary)">Período:</label>
        <div class="input-icon"><i class="fa-regular fa-calendar"></i><input type="date" id="filtroIni" value="${ini}"></div>
        <span style="color:var(--text-muted)">até</span>
        <div class="input-icon"><i class="fa-regular fa-calendar-check"></i><input type="date" id="filtroFim" value="${fim}"></div>
        <button type="submit" class="btn btn-primary">Atualizar</button>
      </form>
      <section class="kpi-grid">
        <div class="kpi-card glass"><div class="kpi-icon kpi-teal"><i class="fa-solid fa-circle-dollar-to-slot"></i></div><div class="kpi-info"><span class="kpi-value">${fmtMoney(data.faturado)}</span><span class="kpi-label">Faturamento (concluídos)</span></div></div>
        ${statusCards}
      </section>
      ${data.top.length?`<section class="section-card glass"><div class="section-header"><h2><i class="fa-solid fa-trophy"></i> Top 5 Bandas do Período</h2></div><div class="table-responsive"><table class="data-table"><thead><tr><th>Banda</th><th>Agendamentos</th><th>Faturamento</th></tr></thead><tbody>${topRows}</tbody></table></div></section>`:''}
      <section class="section-card glass"><div class="section-header"><h2><i class="fa-solid fa-table-list"></i> Detalhamento do Período</h2></div><div class="table-responsive"><table class="data-table" id="tabelaRelatorio"><thead><tr><th>#</th><th>Banda</th><th>Data</th><th>Horário</th><th>Valor</th><th>Status</th><th>Responsável</th></tr></thead><tbody>${detRows}</tbody></table></div></section>
    </main>
    <div id="toast-container"></div>`;
  }

  document.getElementById('app').innerHTML = renderPage(dataIni, dataFim, {filtered,faturado,porStatus,top});
  document.getElementById('btnLogout').addEventListener('click', () => PulseAuth.logout());
  initTheme(); animateCards();

  document.getElementById('formPeriodo').addEventListener('submit', function(e) {
    e.preventDefault();
    const ni = document.getElementById('filtroIni').value;
    const nf = document.getElementById('filtroFim').value;
    if (!ni||!nf) return;
    const d = calcular(ni,nf);
    document.getElementById('app').innerHTML = renderPage(ni, nf, d);
    document.getElementById('btnLogout').addEventListener('click', () => PulseAuth.logout());
    initTheme(); animateCards();
    attachRelExports(ni,nf);
  });

  attachRelExports(dataIni, dataFim);
}

function attachRelExports(ini,fim) {
  const excelBtn = document.getElementById('btnExcelRel');
  const pdfBtn = document.getElementById('btnPdfRel');
  if (excelBtn) excelBtn.addEventListener('click', () => {
    if (typeof XLSX === 'undefined') { showToast('Biblioteca XLSX não carregada.','warning'); return; }
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.table_to_sheet(document.getElementById('tabelaRelatorio'));
    XLSX.utils.book_append_sheet(wb, ws, 'Relatório Pulse');
    XLSX.writeFile(wb, 'Pulse_Relatorio.xlsx');
    showToast('Exportado para Excel!','success');
  });
  if (pdfBtn) pdfBtn.addEventListener('click', () => {
    if (typeof window.jspdf === 'undefined') { showToast('Biblioteca jsPDF não carregada.','warning'); return; }
    const {jsPDF} = window.jspdf;
    const doc = new jsPDF({orientation:'landscape'});
    doc.setFontSize(16); doc.text('Pulse – Relatório de Agendamentos', 14, 15);
    doc.setFontSize(10); doc.text(`Período: ${fmtDate(ini)} a ${fmtDate(fim)}`, 14, 22);
    doc.autoTable({ html:'#tabelaRelatorio', startY:28, styles:{fontSize:8,cellPadding:3}, headStyles:{fillColor:[0,42,84],textColor:255} });
    doc.save('Pulse_Relatorio.pdf');
    showToast('Exportado para PDF!','success');
  });
}

function viewUsuarios() {
  if (!PulseAuth.check()) return;
  document.body.className = '';
  const _app = document.getElementById('app'); if(_app) _app.style.cssText = '';
  const me = PulseAuth.current();
  if (!me.is_admin) { window.location.hash='#dashboard'; return; }
  const users = PulseStore.getAll('usuarios');
  const rows = users.map(u=>`<tr>
    <td>${u.id}</td>
    <td><div class="user-chip-inline"><div class="user-avatar sm">${u.nome.charAt(0).toUpperCase()}</div>${u.nome}</div></td>
    <td>${u.email}</td>
    <td><span class="badge ${u.is_admin?'badge-confirmado':'badge-pendente'}">${u.is_admin?'Administrador':'Colaborador'}</span></td>
    <td>${fmtDate(u.criado_em)}</td>
    <td class="action-btns">
      <button class="btn btn-icon btn-edit" data-id="${u.id}" data-nome="${u.nome}" data-email="${u.email}" data-admin="${u.is_admin?'1':'0'}" data-perms='${JSON.stringify(u.permissoes||[])}' title="Editar"><i class="fa-solid fa-pen-to-square"></i></button>
      ${u.id!==me.id?`<button class="btn btn-icon btn-delete" data-id="${u.id}" data-nome="${u.nome}" title="Excluir"><i class="fa-solid fa-trash"></i></button>`:''}
    </td>
  </tr>`).join('');

  document.getElementById('app').innerHTML = `
  ${renderNav('usuarios')}
  <main class="main-content">
    <header class="page-header">
      <div><h1><i class="fa-solid fa-users-gear"></i> Usuários do Sistema</h1><p class="page-subtitle">Apenas administradores podem gerenciar a equipe.</p></div>
      <button class="btn btn-primary" id="btnNovoUser"><i class="fa-solid fa-user-plus"></i> Novo Usuário</button>
    </header>
    <section class="section-card glass">
      <div class="table-responsive"><table class="data-table">
        <thead><tr><th>#</th><th>Nome</th><th>E-mail</th><th>Nível</th><th>Cadastro</th><th>Ações</th></tr></thead>
        <tbody>${rows}</tbody>
      </table></div>
    </section>
  </main>
  <div class="modal-overlay" id="modalOverlay">
    <div class="modal glass">
      <div class="modal-header"><h2 id="modalTitulo">Novo Usuário</h2><button class="modal-close" id="btnFecharModal"><i class="fa-solid fa-xmark"></i></button></div>
      <form id="formUser" novalidate>
        <input type="hidden" id="inputAcao" value="criar"><input type="hidden" id="inputId" value="">
        <div class="form-grid">
          <div class="form-group span-2"><label>Nome completo *</label><input type="text" id="nome" placeholder="João da Silva"><span class="field-error" id="err-nome"></span></div>
          <div class="form-group span-2"><label>E-mail *</label><input type="email" id="email" placeholder="joao@email.com"><span class="field-error" id="err-email"></span></div>
          <div class="form-group span-2"><label>Senha * <span id="labelSenhaHint" style="font-size:.8rem;color:var(--text-muted);display:none">(deixe em branco para manter)</span></label><input type="password" id="senha" placeholder="Mínimo 6 caracteres"><span class="field-error" id="err-senha"></span></div>
          <div class="form-group span-2"><label class="checkbox-label"><input type="checkbox" id="is_admin" value="1"><span style="font-weight:700;color:var(--clr-orange)">Acesso de Administrador (Acesso Total)</span></label></div>
          <div id="permissions-section" class="form-group span-2" style="border-top:1px solid var(--glass-border);padding-top:1rem">
            <p style="font-weight:600;margin-bottom:.8rem;font-size:.9rem">Permissões Específicas (para Colaboradores):</p>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem">
              <div><p style="font-size:.8rem;color:var(--text-muted);margin-bottom:.5rem;text-transform:uppercase">Módulos</p>
                ${['bandas','equipamentos','agendamentos','relatorios'].map(p=>`<label class="checkbox-label" style="margin-bottom:.4rem"><input type="checkbox" name="perms[]" value="${p}" class="perm-check"> <span>${p.charAt(0).toUpperCase()+p.slice(1)}</span></label>`).join('')}
              </div>
              <div><p style="font-size:.8rem;color:var(--text-muted);margin-bottom:.5rem;text-transform:uppercase">Ações</p>
                <label class="checkbox-label" style="margin-bottom:.4rem"><input type="checkbox" name="perms[]" value="edit" class="perm-check"> <span>Pode Editar</span></label>
                <label class="checkbox-label" style="margin-bottom:.4rem"><input type="checkbox" name="perms[]" value="delete" class="perm-check"> <span>Pode Excluir</span></label>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer"><button type="button" class="btn btn-ghost" id="btnCancelarModal">Cancelar</button><button type="submit" class="btn btn-primary"><i class="fa-solid fa-floppy-disk"></i> Salvar</button></div>
      </form>
    </div>
  </div>
  <div class="modal-overlay" id="modalDelOverlay">
    <div class="modal modal-sm glass">
      <div class="modal-header"><h2><i class="fa-solid fa-triangle-exclamation"></i> Excluir Usuário</h2><button class="modal-close" id="btnFecharModalDel"><i class="fa-solid fa-xmark"></i></button></div>
      <p id="textoConfirmacao" style="margin:1rem 0 1.5rem;color:var(--text-secondary)"></p>
      <div class="modal-footer"><button type="button" class="btn btn-ghost" id="btnCancelarDel">Cancelar</button><button class="btn btn-danger" id="btnConfirmarDel"><i class="fa-solid fa-trash"></i> Excluir</button></div>
    </div>
  </div>
  <div id="toast-container"></div>`;

  document.getElementById('btnLogout').addEventListener('click', () => PulseAuth.logout());
  initTheme(); animateCards();
  document.getElementById('is_admin').addEventListener('change', function() {
    document.getElementById('permissions-section').style.display = this.checked ? 'none' : 'block';
  });
  document.getElementById('btnNovoUser').addEventListener('click', () => {
    document.getElementById('modalTitulo').textContent='Novo Usuário';
    document.getElementById('inputAcao').value='criar'; document.getElementById('inputId').value='';
    document.getElementById('formUser').reset();
    document.getElementById('labelSenhaHint').style.display='none';
    document.getElementById('permissions-section').style.display='block';
    openModal('modalOverlay');
  });
  document.querySelector('.data-table').addEventListener('click', function(e) {
    const edit=e.target.closest('.btn-edit');
    if(edit){
      document.getElementById('modalTitulo').textContent='Editar Usuário';
      document.getElementById('inputAcao').value='editar'; document.getElementById('inputId').value=edit.dataset.id;
      document.getElementById('nome').value=edit.dataset.nome; document.getElementById('email').value=edit.dataset.email;
      document.getElementById('senha').value=''; document.getElementById('labelSenhaHint').style.display='inline';
      const isAdmin=edit.dataset.admin==='1';
      document.getElementById('is_admin').checked=isAdmin;
      document.getElementById('permissions-section').style.display=isAdmin?'none':'block';
      const perms=JSON.parse(edit.dataset.perms||'[]');
      document.querySelectorAll('.perm-check').forEach(cb=>cb.checked=perms.includes(cb.value));
      openModal('modalOverlay');
    }
    const del=e.target.closest('.btn-delete');
    if(del){
      document.getElementById('textoConfirmacao').textContent=`Excluir o usuário "${del.dataset.nome}"? Esta ação é permanente.`;
      document.getElementById('btnConfirmarDel').dataset.id=del.dataset.id;
      openModal('modalDelOverlay');
    }
  });
  document.getElementById('formUser').addEventListener('submit',function(e){
    e.preventDefault();
    const nome=document.getElementById('nome').value.trim(),email=document.getElementById('email').value.trim(),senha=document.getElementById('senha').value;
    const acao=document.getElementById('inputAcao').value;
    let ok=true;
    if(!nome){document.getElementById('err-nome').textContent='Campo obrigatório.';ok=false;}
    if(!email){document.getElementById('err-email').textContent='Campo obrigatório.';ok=false;}
    if(acao==='criar'&&senha.length<6){document.getElementById('err-senha').textContent='Mínimo 6 caracteres.';ok=false;}
    if(!ok)return;
    const isAdmin=document.getElementById('is_admin').checked?1:0;
    const perms=isAdmin?null:Array.from(document.querySelectorAll('.perm-check:checked')).map(cb=>cb.value);
    const obj={nome,email,is_admin:isAdmin,permissoes:perms};
    if(senha) obj.senha=senha;
    if(acao==='criar') PulseStore.create('usuarios',{...obj,senha:senha});
    else PulseStore.update('usuarios',parseInt(document.getElementById('inputId').value),obj);
    closeModal('modalOverlay');
    showToast('Usuário salvo!','success');
    viewUsuarios();
  });
  ['btnFecharModal','btnCancelarModal'].forEach(id=>{const el=document.getElementById(id);if(el)el.addEventListener('click',()=>closeModal('modalOverlay'));});
  ['btnFecharModalDel','btnCancelarDel'].forEach(id=>{const el=document.getElementById(id);if(el)el.addEventListener('click',()=>closeModal('modalDelOverlay'));});
  document.getElementById('btnConfirmarDel').addEventListener('click',function(){
    PulseStore.remove('usuarios',parseInt(this.dataset.id));
    closeModal('modalDelOverlay'); showToast('Usuário excluído.','info'); viewUsuarios();
  });
}

function viewRegras() {
  if (!PulseAuth.check()) return;
  document.body.className = '';
  const _app = document.getElementById('app'); if(_app) _app.style.cssText = '';
  const me = PulseAuth.current();
  if (!me.is_admin) { window.location.hash='#dashboard'; return; }
  const regras = PulseStore.getAll('regras');
  const grupos = {
    'Precificação':['preco_hora_ensaio','preco_hora_gravacao'],
    'Reservas':['min_horas_reserva','max_horas_reserva'],
    'Políticas':['desconto_fidelidade','taxa_cancelamento'],
    'Funcionamento':['horario_abertura','horario_fechamento','nome_estudio','moeda']
  };
  const icons = {'Precificação':'fa-tag','Reservas':'fa-clock','Políticas':'fa-shield-halved','Funcionamento':'fa-store'};
  const grouped = Object.keys(grupos).flatMap(g=>grupos[g]);

  const extraCards = regras.filter(r=>!grouped.includes(r.chave)).map(r=>`
    <div class="regra-card glass-inner">
      <div class="regra-info"><span class="regra-chave">${r.chave}</span>${r.descricao?`<span class="regra-desc">${r.descricao}</span>`:''}</div>
      <div class="regra-valor-wrap"><input class="regra-input" type="text" data-chave="${r.chave}" value="${r.valor}"></div>
      <button class="btn btn-icon btn-delete" data-id="${r.id}" title="Excluir"><i class="fa-solid fa-trash"></i></button>
    </div>`).join('');

  const groupSections = Object.entries(grupos).map(([g,chaves])=>{
    const rgs = regras.filter(r=>chaves.includes(r.chave));
    if(!rgs.length) return '';
    const cards = rgs.map(r=>{
      const isTime=r.chave.includes('horario');
      const isNum=['preco_hora_ensaio','preco_hora_gravacao','min_horas_reserva','max_horas_reserva','desconto_fidelidade','taxa_cancelamento'].includes(r.chave);
      const type=isTime?'time':isNum?'number':'text';
      return `<div class="regra-card glass-inner"><div class="regra-info"><span class="regra-label">${r.descricao||r.chave}</span><span class="regra-chave-badge">${r.chave}</span></div><div class="regra-valor-wrap"><input class="regra-input" type="${type}" data-chave="${r.chave}" value="${r.valor}"${isNum?' step="0.01" min="0"':''}></div></div>`;
    }).join('');
    return `<section class="section-card glass regra-section"><div class="section-header"><h2><i class="fa-solid ${icons[g]||'fa-gear'}"></i> ${g}</h2></div><div class="regras-grid">${cards}</div></section>`;
  }).join('');

  document.getElementById('app').innerHTML = `
  ${renderNav('regras')}
  <main class="main-content">
    <header class="page-header">
      <div><h1><i class="fa-solid fa-sliders"></i> Regras de Negócio</h1><p class="page-subtitle">Configure as políticas e preços do estúdio.</p></div>
      <button class="btn btn-primary" id="btnNovaRegra"><i class="fa-solid fa-plus"></i> Nova Regra</button>
    </header>
    ${extraCards?`<section class="section-card glass regra-section"><div class="section-header"><h2><i class="fa-solid fa-dollar-sign"></i> Personalizadas</h2></div><div class="regras-grid">${extraCards}</div></section>`:''}
    ${groupSections}
    <div class="regras-save-bar"><button class="btn btn-primary btn-lg" id="btnSalvarRegras"><i class="fa-solid fa-floppy-disk"></i> Salvar Todas as Alterações</button></div>
  </main>
  <div class="modal-overlay" id="modalNovaRegra">
    <div class="modal glass modal-sm">
      <div class="modal-header"><h2><i class="fa-solid fa-plus-circle"></i> Nova Regra</h2><button class="modal-close" id="btnFecharNovaRegra"><i class="fa-solid fa-xmark"></i></button></div>
      <form id="formNovaRegra" novalidate>
        <div class="form-group" style="margin-bottom:1rem"><label>Chave *</label><input type="text" id="nova_chave" placeholder="ex: taxa_weekend" pattern="[a-z_0-9]+"></div>
        <div class="form-group" style="margin-bottom:1rem"><label>Valor *</label><input type="text" id="nova_valor" placeholder="ex: 180.00"></div>
        <div class="form-group" style="margin-bottom:1rem"><label>Descrição</label><input type="text" id="nova_desc" placeholder="Explicação desta regra"></div>
        <div class="modal-footer"><button type="button" class="btn btn-ghost" id="btnCancelarNovaRegra">Cancelar</button><button type="submit" class="btn btn-primary"><i class="fa-solid fa-plus"></i> Adicionar</button></div>
      </form>
    </div>
  </div>
  <div id="toast-container"></div>`;

  document.getElementById('btnLogout').addEventListener('click', () => PulseAuth.logout());
  initTheme(); animateCards();

  document.getElementById('btnSalvarRegras').addEventListener('click',()=>{
    document.querySelectorAll('.regra-input').forEach(inp=>{
      const r=PulseStore.getAll('regras').find(x=>x.chave===inp.dataset.chave);
      if(r) PulseStore.update('regras',r.id,{valor:inp.value});
    });
    showToast('Regras salvas com sucesso!','success');
  });

  const btnDel = document.querySelectorAll('.btn-delete[data-id]');
  btnDel.forEach(btn=>btn.addEventListener('click',function(){
    PulseStore.remove('regras',parseInt(this.dataset.id));
    showToast('Regra removida.','info'); viewRegras();
  }));

  document.getElementById('btnNovaRegra').addEventListener('click',()=>openModal('modalNovaRegra'));
  ['btnFecharNovaRegra','btnCancelarNovaRegra'].forEach(id=>document.getElementById(id).addEventListener('click',()=>closeModal('modalNovaRegra')));

  document.getElementById('formNovaRegra').addEventListener('submit',function(e){
    e.preventDefault();
    const chave=document.getElementById('nova_chave').value.trim();
    const valor=document.getElementById('nova_valor').value.trim();
    if(!chave||!valor){showToast('Preencha chave e valor.','warning');return;}
    PulseStore.create('regras',{chave,valor,descricao:document.getElementById('nova_desc').value.trim()});
    closeModal('modalNovaRegra'); showToast('Regra adicionada!','success'); viewRegras();
  });
}
