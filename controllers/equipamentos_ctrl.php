<?php
/**
 * controllers/equipamentos_ctrl.php
 * Filtros combinados: nome + status. Sem HTML.
 */
require_once 'config/conexao.php';
require_once 'config/sessao.php';
requireAuth();

$pageTitle    = 'Equipamentos';
$pdo          = getConexao();
$busca        = trim($_GET['busca']  ?? '');
$filtroStatus = trim($_GET['status'] ?? '');
$toastParam   = $_GET['toast'] ?? '';

$where  = [];
$params = [];

if ($busca !== '') {
    $where[]      = 'nome LIKE :b';
    $params[':b'] = "%$busca%";
}
if (in_array($filtroStatus, ['disponivel', 'manutencao'], true)) {
    $where[]      = 'status = :s';
    $params[':s'] = $filtroStatus;
}

$sql = 'SELECT * FROM equipamentos';
if ($where) {
    $sql .= ' WHERE ' . implode(' AND ', $where);
}
$sql .= ' ORDER BY nome';

$stmt = $pdo->prepare($sql);
$stmt->execute($params);
$equipamentos = $stmt->fetchAll();
