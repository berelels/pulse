<?php
/**
 * controllers/agendamentos_ctrl.php
 * Filtros combinados: banda + intervalo de datas + status. Sem HTML.
 */
require_once 'config/conexao.php';
require_once 'config/sessao.php';
requireAuth();

if (!hasPermission('agendamentos')) {
    header('Location: dashboard.php');
    exit;
}

$pageTitle = 'Agendamentos';
$pdo       = getConexao();

// Selects para o formulário modal
$bandas      = $pdo->query('SELECT id, nome_banda FROM bandas ORDER BY nome_banda')->fetchAll();
$equipamentos_disponiveis = $pdo->query("SELECT id, nome, valor_locacao FROM equipamentos WHERE status='disponivel' ORDER BY nome")->fetchAll();

// Busca regras de negócio para cálculo no frontend
$regras_raw = $pdo->query('SELECT chave, valor FROM regras_negocio')->fetchAll(PDO::FETCH_KEY_PAIR);
$precoHoraEnsaio = (float)($regras_raw['preco_hora_ensaio'] ?? 150);

// Filtros vindos do GET
$filtroBanda   = trim($_GET['banda']    ?? '');
$filtroDataIni = trim($_GET['data_ini'] ?? '');
$filtroDataFim = trim($_GET['data_fim'] ?? '');
$filtroStatus  = trim($_GET['status']   ?? '');
$toastParam    = $_GET['toast'] ?? '';

$where  = ['1=1'];
$params = [];

if ($filtroBanda !== '') {
    $where[]       = 'b.nome_banda LIKE :bn';
    $params[':bn'] = "%$filtroBanda%";
}
if ($filtroDataIni !== '') {
    $where[]       = 'a.data_ensaio >= :di';
    $params[':di'] = $filtroDataIni;
}
if ($filtroDataFim !== '') {
    $where[]       = 'a.data_ensaio <= :df';
    $params[':df'] = $filtroDataFim;
}
if (in_array($filtroStatus, ['confirmado', 'cancelado', 'concluido', 'pendente'], true)) {
    $where[]       = 'a.status = :st';
    $params[':st'] = $filtroStatus;
}

$sql = "
    SELECT a.id, b.id AS banda_id, b.nome_banda, u.nome AS usuario_nome,
           a.data_ensaio, a.hora_inicio, a.hora_fim,
           a.valor_total, a.status, a.observacoes
    FROM agendamentos a
    JOIN bandas   b ON b.id = a.banda_id
    JOIN usuarios u ON u.id = a.usuario_id
    WHERE " . implode(' AND ', $where) . "
    ORDER BY a.data_ensaio DESC, a.hora_inicio DESC
";

$stmt = $pdo->prepare($sql);
$stmt->execute($params);
$agendamentos = $stmt->fetchAll();

// Busca os equipamentos de cada agendamento (em batch, para performance)
$agIds = array_column($agendamentos, 'id');
$equipPorAg = [];
if (!empty($agIds)) {
    $placeholders = implode(',', array_fill(0, count($agIds), '?'));
    $eqStmt = $pdo->prepare(
        "SELECT ae.agendamento_id, e.id AS equip_id
         FROM agendamento_equipamentos ae
         JOIN equipamentos e ON e.id = ae.equipamento_id
         WHERE ae.agendamento_id IN ($placeholders)"
    );
    $eqStmt->execute($agIds);
    foreach ($eqStmt->fetchAll() as $row) {
        $equipPorAg[$row['agendamento_id']][] = $row['equip_id'];
    }
}

$usuario = usuarioLogado();
