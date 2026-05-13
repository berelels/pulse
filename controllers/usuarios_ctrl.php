<?php
/**
 * controllers/usuarios_ctrl.php
 * Lista usuários — somente administradores. Sem HTML.
 */
require_once 'config/conexao.php';
require_once 'config/sessao.php';
requireAuth();

// Bloqueia não-administradores
if (!isAdmin()) {
    header('Location: dashboard.php');
    exit;
}

$pageTitle    = 'Usuários';
$pdo          = getConexao();
$toastParam   = $_GET['toast'] ?? '';
$usuarioAtual = usuarioLogado();

$usuarios = $pdo->query(
    'SELECT id, nome, email, is_admin, criado_em FROM usuarios ORDER BY nome'
)->fetchAll();
