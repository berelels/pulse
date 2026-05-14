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
            'SELECT id, nome, email, senha, is_admin, tema FROM usuarios WHERE email = :email LIMIT 1'
        );
        $stmt->execute([':email' => $emailPost]);
        $user = $stmt->fetch();

        // Suporta bcrypt e texto puro (migração)
        $senhaValida = password_verify($senha, $user['senha'] ?? '')
                    || ($user && $senha === $user['senha']);

        if ($user && $senhaValida) {
            // Se senha ainda é texto puro, atualiza para bcrypt automaticamente
            if ($user && !password_needs_rehash($user['senha'], PASSWORD_BCRYPT)
                === false && $senha === $user['senha']) {
                $upd = $pdo->prepare('UPDATE usuarios SET senha=:h WHERE id=:id');
                $upd->execute([':h' => password_hash($senha, PASSWORD_BCRYPT), ':id' => $user['id']]);
            }
            $_SESSION['usuario_id']    = $user['id'];
            $_SESSION['usuario_nome']  = $user['nome'];
            $_SESSION['usuario_email'] = $user['email'];
            $_SESSION['usuario_admin'] = (bool) $user['is_admin'];
            $_SESSION['tema']          = $user['tema'] ?? 'escuro';
            $_SESSION['play_intro'] = true;
            
            if (isset($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) === 'xmlhttprequest') {
                header('Content-Type: application/json');
                echo json_encode(['success' => true]);
                exit;
            }

            header('Location: dashboard.php');
            exit;
        }

        $erro = 'E-mail ou senha inválidos.';
        if (isset($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) === 'xmlhttprequest') {
            header('Content-Type: application/json');
            echo json_encode(['success' => false, 'error' => $erro]);
            exit;
        }
    }
}
