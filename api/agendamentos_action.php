<?php
require_once '../config/conexao.php';
require_once '../config/sessao.php';
requireAuth();

$pdo  = getConexao();
$acao = $_POST['acao'] ?? '';

function redir(string $msg): never {
    header('Location: ../agendamentos.php?toast=' . $msg);
    exit;
}

switch ($acao) {
    case 'criar':
        $bandaId    = (int)($_POST['banda_id']    ?? 0);
        $usuarioId  = (int)($_POST['usuario_id']  ?? 0);
        $data       = trim($_POST['data_ensaio']  ?? '');
        $ini        = trim($_POST['hora_inicio']  ?? '');
        $fim        = trim($_POST['hora_fim']     ?? '');
        $valor      = (float)($_POST['valor_total'] ?? 0);
        $status     = in_array($_POST['status']??'', ['confirmado','cancelado','concluido','pendente']) ? $_POST['status'] : 'confirmado';
        $obs        = trim($_POST['observacoes']  ?? '');

        if (!$bandaId || !$usuarioId || !$data || !$ini || !$fim) redir('erro');

        $stmt = $pdo->prepare('INSERT INTO agendamentos (banda_id, usuario_id, data_ensaio, hora_inicio, hora_fim, valor_total, status, observacoes)
                                VALUES (:bid,:uid,:d,:i,:f,:v,:s,:o)');
        $stmt->execute([':bid'=>$bandaId,':uid'=>$usuarioId,':d'=>$data,':i'=>$ini,':f'=>$fim,':v'=>$valor,':s'=>$status,':o'=>$obs?:null]);
        redir('ok');

    case 'editar':
        $id     = (int)($_POST['id']           ?? 0);
        $data   = trim($_POST['data_ensaio']   ?? '');
        $ini    = trim($_POST['hora_inicio']   ?? '');
        $fim    = trim($_POST['hora_fim']      ?? '');
        $valor  = (float)($_POST['valor_total'] ?? 0);
        $status = in_array($_POST['status']??'', ['confirmado','cancelado','concluido','pendente']) ? $_POST['status'] : 'confirmado';
        $obs    = trim($_POST['observacoes']   ?? '');

        if (!$id || !$data || !$ini || !$fim) redir('erro');

        $stmt = $pdo->prepare('UPDATE agendamentos SET data_ensaio=:d, hora_inicio=:i, hora_fim=:f, valor_total=:v, status=:s, observacoes=:o WHERE id=:id');
        $stmt->execute([':d'=>$data,':i'=>$ini,':f'=>$fim,':v'=>$valor,':s'=>$status,':o'=>$obs?:null,':id'=>$id]);
        redir('ok');

    case 'cancelar':
        $id = (int)($_POST['id'] ?? 0);
        if (!$id) redir('erro');
        $stmt = $pdo->prepare("UPDATE agendamentos SET status='cancelado' WHERE id=:id");
        $stmt->execute([':id'=>$id]);
        redir('cancelado');

    default:
        redir('erro');
}
