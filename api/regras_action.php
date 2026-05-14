<?php
require_once '../config/conexao.php';
require_once '../config/sessao.php';
requireAuth();

if (!usuarioLogado()['is_admin']) {
    header('Location: ../dashboard.php');
    exit;
}

$pdo  = getConexao();
$acao = $_POST['acao'] ?? '';

function redir(string $msg): never {
    header('Location: ../regras.php?toast=' . $msg);
    exit;
}

switch ($acao) {
    case 'salvar':
        // Salva todas as regras enviadas via form
        $stmt = $pdo->prepare('UPDATE regras_negocio SET valor=:v WHERE chave=:c');
        foreach ($_POST['regras'] ?? [] as $chave => $valor) {
            $stmt->execute([':v' => trim($valor), ':c' => $chave]);
        }
        redir('ok');

    case 'nova':
        $chave    = trim($_POST['chave']    ?? '');
        $valor    = trim($_POST['valor']    ?? '');
        $descricao = trim($_POST['descricao'] ?? '');
        if (!$chave) redir('erro');
        $stmt = $pdo->prepare('INSERT INTO regras_negocio (chave, valor, descricao) VALUES (:c,:v,:d)
                               ON DUPLICATE KEY UPDATE valor=:v2, descricao=:d2');
        $stmt->execute([':c'=>$chave,':v'=>$valor,':d'=>$descricao,':v2'=>$valor,':d2'=>$descricao]);
        redir('ok');

    case 'excluir':
        $id = (int)($_POST['id'] ?? 0);
        if (!$id) redir('erro');
        $pdo->prepare('DELETE FROM regras_negocio WHERE id=:id')->execute([':id'=>$id]);
        redir('excluido');

    default:
        redir('erro');
}
