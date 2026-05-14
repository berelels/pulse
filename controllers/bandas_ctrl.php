<?php
/**
 * controllers/bandas_ctrl.php
 * Busca lista de bandas com filtro de texto. Sem HTML.
 */
require_once 'config/conexao.php';
require_once 'config/sessao.php';
requireAuth();

if (!hasPermission('bandas')) {
    header('Location: dashboard.php');
    exit;
}

$pageTitle  = 'Bandas';
$pdo        = getConexao();
$busca      = trim($_GET['busca'] ?? '');
$toastParam = $_GET['toast'] ?? '';

if ($busca !== '') {
    $stmt = $pdo->prepare(
        "SELECT * FROM bandas WHERE nome_banda LIKE :b OR responsavel LIKE :b ORDER BY nome_banda"
    );
    $stmt->execute([':b' => "%$busca%"]);
} else {
    $stmt = $pdo->query("SELECT * FROM bandas ORDER BY nome_banda");
}

$bandas = $stmt->fetchAll();
