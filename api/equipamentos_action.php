<?php
require_once '../config/conexao.php';
require_once '../config/sessao.php';
requireAuth();

$pdo  = getConexao();
$acao = $_POST['acao'] ?? '';

// Verificação global de acesso ao módulo
if (!hasPermission('equipamentos')) {
    header('Location: ../dashboard.php');
    exit;
}

function redir(string $msg): never {
    header('Location: ../equipamentos.php?toast=' . $msg);
    exit;
}

switch ($acao) {
    case 'criar':
        if (!hasPermission('edit')) redir('erro');
        $nome   = trim($_POST['nome']          ?? '');
        $desc   = trim($_POST['descricao']     ?? '');
        $valor  = (float)($_POST['valor_locacao'] ?? 0);
        $status = in_array($_POST['status']??'', ['disponivel','manutencao']) ? $_POST['status'] : 'disponivel';
        if ($nome === '' || $valor < 0) redir('erro');
        $stmt = $pdo->prepare('INSERT INTO equipamentos (nome, descricao, valor_locacao, status) VALUES (:n,:d,:v,:s)');
        $stmt->execute([':n'=>$nome,':d'=>$desc?:null,':v'=>$valor,':s'=>$status]);
        redir('ok');

    case 'editar':
        if (!hasPermission('edit')) redir('erro');
        $id     = (int)($_POST['id']           ?? 0);
        $nome   = trim($_POST['nome']          ?? '');
        $desc   = trim($_POST['descricao']     ?? '');
        $valor  = (float)($_POST['valor_locacao'] ?? 0);
        $status = in_array($_POST['status']??'', ['disponivel','manutencao']) ? $_POST['status'] : 'disponivel';
        if ($id === 0 || $nome === '') redir('erro');
        $stmt = $pdo->prepare('UPDATE equipamentos SET nome=:n, descricao=:d, valor_locacao=:v, status=:s WHERE id=:id');
        $stmt->execute([':n'=>$nome,':d'=>$desc?:null,':v'=>$valor,':s'=>$status,':id'=>$id]);
        redir('ok');

    case 'excluir':
        if (!hasPermission('delete')) redir('erro');
        $id = (int)($_POST['id'] ?? 0);
        if ($id === 0) redir('erro');
        $stmt = $pdo->prepare('DELETE FROM equipamentos WHERE id=:id');
        $stmt->execute([':id'=>$id]);
        redir('del');

    default:
        redir('erro');
}
