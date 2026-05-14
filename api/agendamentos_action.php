<?php
require_once '../config/conexao.php';
require_once '../config/sessao.php';
requireAuth();

$pdo  = getConexao();
$acao = $_POST['acao'] ?? '';

// Verificação global de acesso ao módulo
if (!hasPermission('agendamentos')) {
    header('Location: ../dashboard.php');
    exit;
}

function redir(string $msg): never {
    header('Location: ../agendamentos.php?toast=' . $msg);
    exit;
}

/**
 * Salva a relação agendamento <-> equipamentos.
 */
function salvarEquipamentos(PDO $pdo, int $agId, array $equipIds): void {
    $pdo->prepare('DELETE FROM agendamento_equipamentos WHERE agendamento_id=:id')
        ->execute([':id' => $agId]);
    if (empty($equipIds)) return;
    $stmt = $pdo->prepare('INSERT IGNORE INTO agendamento_equipamentos (agendamento_id, equipamento_id) VALUES (:ag, :eq)');
    foreach ($equipIds as $eqId) {
        $eqId = (int) $eqId;
        if ($eqId > 0) $stmt->execute([':ag' => $agId, ':eq' => $eqId]);
    }
}

switch ($acao) {
    case 'criar':
        if (!hasPermission('edit')) redir('erro');
        $bandaId    = (int)($_POST['banda_id']    ?? 0);
        $usuarioId  = (int)($_POST['usuario_id']  ?? 0);
        $data       = trim($_POST['data_ensaio']  ?? '');
        $ini        = trim($_POST['hora_inicio']  ?? '');
        $fim        = trim($_POST['hora_fim']     ?? '');
        $valor      = (float)($_POST['valor_total'] ?? 0);
        $status     = in_array($_POST['status']??'', ['confirmado','cancelado','concluido','pendente']) ? $_POST['status'] : 'confirmado';
        $obs        = trim($_POST['observacoes']  ?? '');
        $equipIds   = $_POST['equipamentos'] ?? [];

        if (!$bandaId || !$usuarioId || !$data || !$ini || !$fim) redir('erro');

        $stmt = $pdo->prepare('INSERT INTO agendamentos (banda_id, usuario_id, data_ensaio, hora_inicio, hora_fim, valor_total, status, observacoes)
                                VALUES (:bid,:uid,:d,:i,:f,:v,:s,:o)');
        $stmt->execute([':bid'=>$bandaId,':uid'=>$usuarioId,':d'=>$data,':i'=>$ini,':f'=>$fim,':v'=>$valor,':s'=>$status,':o'=>$obs?:null]);
        $agId = (int) $pdo->lastInsertId();
        salvarEquipamentos($pdo, $agId, $equipIds);
        redir('ok');

    case 'editar':
        if (!hasPermission('edit')) redir('erro');
        $id     = (int)($_POST['id']           ?? 0);
        $bandaId= (int)($_POST['banda_id']     ?? 0);
        $data   = trim($_POST['data_ensaio']   ?? '');
        $ini    = trim($_POST['hora_inicio']   ?? '');
        $fim    = trim($_POST['hora_fim']      ?? '');
        $valor  = (float)($_POST['valor_total'] ?? 0);
        $status = in_array($_POST['status']??'', ['confirmado','cancelado','concluido','pendente']) ? $_POST['status'] : 'confirmado';
        $obs    = trim($_POST['observacoes']   ?? '');
        $equipIds = $_POST['equipamentos'] ?? [];

        if (!$id || !$data || !$ini || !$fim) redir('erro');

        $stmt = $pdo->prepare('UPDATE agendamentos SET banda_id=:bid, data_ensaio=:d, hora_inicio=:i, hora_fim=:f, valor_total=:v, status=:s, observacoes=:o WHERE id=:id');
        $stmt->execute([':bid'=>$bandaId,':d'=>$data,':i'=>$ini,':f'=>$fim,':v'=>$valor,':s'=>$status,':o'=>$obs?:null,':id'=>$id]);
        salvarEquipamentos($pdo, $id, $equipIds);
        redir('ok');

    case 'confirmar':
        if (!hasPermission('edit')) redir('erro');
        $id = (int)($_POST['id'] ?? 0);
        if (!$id) redir('erro');
        $pdo->prepare("UPDATE agendamentos SET status='confirmado' WHERE id=:id")->execute([':id'=>$id]);
        redir('confirmado');

    case 'concluir':
        if (!hasPermission('edit')) redir('erro');
        $id = (int)($_POST['id'] ?? 0);
        if (!$id) redir('erro');
        $pdo->prepare("UPDATE agendamentos SET status='concluido' WHERE id=:id")->execute([':id'=>$id]);
        redir('concluido');

    case 'cancelar':
        if (!hasPermission('delete')) redir('erro');
        $id = (int)($_POST['id'] ?? 0);
        if (!$id) redir('erro');
        $pdo->prepare("UPDATE agendamentos SET status='cancelado' WHERE id=:id")->execute([':id'=>$id]);
        redir('cancelado');

    default:
        redir('erro');
}
