<?php
/**
 * controllers/agendamentos_ctrl.php
 * Filtros combinados: banda + intervalo de datas + status. Sem HTML.
 */
require_once 'config/conexao.php';
require_once 'config/sessao.php';
requireAuth();

$pageTitle = 'Agendamentos';
$pdo       = getConexao();

// Selects para o formulário modal
$bandas = $pdo->query('SELECT id, nome_banda FROM bandas ORDER BY nome_banda')->fetchAll();

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
    SELECT a.id, b.nome_banda, u.nome AS usuario_nome,
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

$usuario = usuarioLogado();
