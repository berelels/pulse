<?php
/**
 * controllers/regras_ctrl.php
 * Gerencia as regras de negócio do estúdio.
 */
require_once 'config/conexao.php';
require_once 'config/sessao.php';
requireAuth();

// Apenas admins podem acessar
if (!usuarioLogado()['is_admin']) {
    header('Location: dashboard.php');
    exit;
}

$pageTitle = 'Regras de Negócio';
$pdo       = getConexao();
$usuario   = usuarioLogado();
$toastParam = $_GET['toast'] ?? '';

// Busca todas as regras ordenadas
$regras = $pdo->query('SELECT * FROM regras_negocio ORDER BY id')->fetchAll();
