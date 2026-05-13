<?php
/**
 * controllers/dashboard_ctrl.php
 * Busca KPIs e próximos agendamentos. Sem HTML.
 */
require_once 'config/conexao.php';
require_once 'config/sessao.php';
requireAuth();

$pageTitle = 'Dashboard';
$pdo       = getConexao();

$totalBandas       = (int) $pdo->query('SELECT COUNT(*) FROM bandas')->fetchColumn();
$totalAgendamentos = (int) $pdo->query("SELECT COUNT(*) FROM agendamentos WHERE status != 'cancelado'")->fetchColumn();
$totalEquip        = (int) $pdo->query("SELECT COUNT(*) FROM equipamentos WHERE status = 'disponivel'")->fetchColumn();
$faturamentoMes    = (float) $pdo->query(
    "SELECT COALESCE(SUM(valor_total),0) FROM agendamentos
     WHERE status = 'concluido'
       AND MONTH(data_ensaio) = MONTH(CURDATE())
       AND YEAR(data_ensaio)  = YEAR(CURDATE())"
)->fetchColumn();

$stmtProx = $pdo->query(
    "SELECT a.id, b.nome_banda, a.data_ensaio, a.hora_inicio, a.hora_fim, a.status, a.valor_total
     FROM agendamentos a
     JOIN bandas b ON b.id = a.banda_id
     WHERE a.data_ensaio >= CURDATE() AND a.status != 'cancelado'
     ORDER BY a.data_ensaio, a.hora_inicio
     LIMIT 5"
);
$proxAgendamentos = $stmtProx->fetchAll();

$usuario = usuarioLogado();
