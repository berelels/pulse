<?php
require_once '../config/conexao.php';
require_once '../config/sessao.php';
requireAuth();
if (!isAdmin()) { header('Location: ../dashboard.php'); exit; }

$pdo  = getConexao();
$acao = $_POST['acao'] ?? '';

function redir(string $msg): never {
    header('Location: ../usuarios.php?toast=' . $msg);
    exit;
}

switch ($acao) {
    case 'criar':
        $nome    = trim($_POST['nome']  ?? '');
        $email   = trim($_POST['email'] ?? '');
        $senha   = $_POST['senha'] ?? '';
        $isAdmin = !empty($_POST['is_admin']) ? 1 : 0;
        $perms   = $_POST['perms'] ?? [];
        $permsJson = json_encode($perms);

        if (!$nome || !$email || $senha === '') redir('erro');
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) redir('erro');
        $stmt = $pdo->prepare('INSERT INTO usuarios (nome, email, senha, is_admin, permissoes) VALUES (:n,:e,:s,:a,:p)');
        try {
            $stmt->execute([':n' => $nome, ':e' => $email, ':s' => $senha, ':a' => $isAdmin, ':p' => $permsJson]);
        } catch (\PDOException $ex) {
            redir('erro'); // e-mail duplicado
        }
        redir('ok');

    case 'editar':
        $id      = (int)($_POST['id']    ?? 0);
        $nome    = trim($_POST['nome']   ?? '');
        $email   = trim($_POST['email']  ?? '');
        $senha   = $_POST['senha'] ?? '';
        $isAdmin = !empty($_POST['is_admin']) ? 1 : 0;
        $perms   = $_POST['perms'] ?? [];
        $permsJson = json_encode($perms);

        if (!$id || !$nome || !$email) redir('erro');

        if ($senha !== '') {
            $stmt = $pdo->prepare('UPDATE usuarios SET nome=:n, email=:e, senha=:s, is_admin=:a, permissoes=:p WHERE id=:id');
            $stmt->execute([':n' => $nome, ':e' => $email, ':s' => $senha, ':a' => $isAdmin, ':p' => $permsJson, ':id' => $id]);
        } else {
            $stmt = $pdo->prepare('UPDATE usuarios SET nome=:n, email=:e, is_admin=:a, permissoes=:p WHERE id=:id');
            $stmt->execute([':n' => $nome, ':e' => $email, ':a' => $isAdmin, ':p' => $permsJson, ':id' => $id]);
        }
        redir('ok');

    case 'excluir':
        $id = (int)($_POST['id'] ?? 0);
        $me = (int) usuarioLogado()['id'];
        if (!$id || $id === $me) redir('erro');
        $stmt = $pdo->prepare('DELETE FROM usuarios WHERE id=:id');
        $stmt->execute([':id' => $id]);
        redir('del');

    default:
        redir('erro');
}
