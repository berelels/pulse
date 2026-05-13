<?php
/**
 * controllers/login_ctrl.php
 * Lógica de autenticação. Sem HTML.
 */
require_once 'config/conexao.php';
require_once 'config/sessao.php';
requireGuest();

$pageTitle = 'Login';
$erro      = '';
$emailPost = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $emailPost = trim($_POST['email'] ?? '');
    $senha     = $_POST['senha'] ?? '';

    if (empty($emailPost) || empty($senha)) {
        $erro = 'Preencha e-mail e senha.';
    } else {
        $pdo  = getConexao();
        $stmt = $pdo->prepare(
            'SELECT id, nome, email, senha, is_admin FROM usuarios WHERE email = :email LIMIT 1'
        );
        $stmt->execute([':email' => $emailPost]);
        $user = $stmt->fetch();

        if ($user && $senha === $user['senha']) {
            $_SESSION['usuario_id']    = $user['id'];
            $_SESSION['usuario_nome']  = $user['nome'];
            $_SESSION['usuario_email'] = $user['email'];
            $_SESSION['usuario_admin'] = (bool) $user['is_admin'];
            header('Location: dashboard.php');
            exit;
        }

        $erro = 'E-mail ou senha inválidos.';
    }
}
