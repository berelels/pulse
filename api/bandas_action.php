<?php
/**
 * PULSE — api/bandas_action.php
 * Processa as ações POST de CRUD de bandas (criar / editar / excluir).
 */
require_once '../config/conexao.php';
require_once '../config/sessao.php';
requireAuth();

$pdo  = getConexao();
$acao = $_POST['acao'] ?? '';

// Verificação global de acesso ao módulo
if (!hasPermission('bandas')) {
    header('Location: ../dashboard.php');
    exit;
}

function redir(string $msg): never {
    header('Location: ../bandas.php?toast=' . $msg);
    exit;
}

switch ($acao) {

    // ------------------------------------------------------------------
    case 'criar':
        if (!hasPermission('edit')) redir('erro');
        $nome = trim($_POST['nome_banda']  ?? '');
        $resp = trim($_POST['responsavel'] ?? '');
        $tel  = trim($_POST['telefone']    ?? '');
        $gen  = trim($_POST['genero']      ?? '');

        if ($nome === '' || $resp === '') redir('erro');

        $stmt = $pdo->prepare(
            'INSERT INTO bandas (nome_banda, responsavel, telefone, genero) VALUES (:n,:r,:t,:g)'
        );
        $stmt->execute([':n' => $nome, ':r' => $resp, ':t' => $tel ?: null, ':g' => $gen ?: null]);
        redir('ok');

    // ------------------------------------------------------------------
    case 'editar':
        if (!hasPermission('edit')) redir('erro');
        $id   = (int)($_POST['id']          ?? 0);
        $nome = trim($_POST['nome_banda']   ?? '');
        $resp = trim($_POST['responsavel']  ?? '');
        $tel  = trim($_POST['telefone']     ?? '');
        $gen  = trim($_POST['genero']       ?? '');

        if ($id === 0 || $nome === '' || $resp === '') redir('erro');

        $stmt = $pdo->prepare(
            'UPDATE bandas SET nome_banda=:n, responsavel=:r, telefone=:t, genero=:g WHERE id=:id'
        );
        $stmt->execute([':n'=>$nome,':r'=>$resp,':t'=>$tel?:null,':g'=>$gen?:null,':id'=>$id]);
        redir('ok');

    // ------------------------------------------------------------------
    case 'excluir':
        if (!hasPermission('delete')) redir('erro');
        $id = (int)($_POST['id'] ?? 0);
        if ($id === 0) redir('erro');

        // Verificar se há agendamentos vinculados
        $count = $pdo->prepare('SELECT COUNT(*) FROM agendamentos WHERE banda_id = :id');
        $count->execute([':id' => $id]);
        if ((int)$count->fetchColumn() > 0) {
            header('Location: ../bandas.php?toast=vinculada');
            exit;
        }

        $stmt = $pdo->prepare('DELETE FROM bandas WHERE id = :id');
        $stmt->execute([':id' => $id]);
        redir('del');

    // ------------------------------------------------------------------
    default:
        redir('erro');
}
