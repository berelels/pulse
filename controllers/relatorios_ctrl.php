<?php
/**
 * controllers/relatorios_ctrl.php
 * Queries analíticas para o período selecionado. Sem HTML.
 */
require_once 'config/conexao.php';
require_once 'config/sessao.php';
requireAuth();

$pageTitle = 'Relatórios';
$pdo       = getConexao();

$dataIni = $_GET['data_ini'] ?? date('Y-m-01');
$dataFim = $_GET['data_fim'] ?? date('Y-m-t');

// CDNs de exportação carregados no <head>
$extraHeadScripts = [
    'https://cdn.sheetjs.com/xlsx-0.20.1/package/dist/xlsx.full.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.8.2/jspdf.plugin.autotable.min.js',
];

// Faturamento concluído no período
$stmtFat = $pdo->prepare(
    "SELECT COALESCE(SUM(valor_total), 0) FROM agendamentos
     WHERE status = 'concluido' AND data_ensaio BETWEEN :ini AND :fim"
);
$stmtFat->execute([':ini' => $dataIni, ':fim' => $dataFim]);
$totalFaturado = (float) $stmtFat->fetchColumn();

// Contagem por status
$stmtStatus = $pdo->prepare(
    "SELECT status, COUNT(*) AS total FROM agendamentos
     WHERE data_ensaio BETWEEN :ini AND :fim
     GROUP BY status ORDER BY total DESC"
);
$stmtStatus->execute([':ini' => $dataIni, ':fim' => $dataFim]);
$porStatus = $stmtStatus->fetchAll();

// Top 5 bandas do período
$stmtTop = $pdo->prepare(
    "SELECT b.nome_banda, COUNT(*) AS total, COALESCE(SUM(a.valor_total), 0) AS faturamento
     FROM agendamentos a JOIN bandas b ON b.id = a.banda_id
     WHERE a.data_ensaio BETWEEN :ini AND :fim AND a.status != 'cancelado'
     GROUP BY b.nome_banda ORDER BY total DESC LIMIT 5"
);
$stmtTop->execute([':ini' => $dataIni, ':fim' => $dataFim]);
$topBandas = $stmtTop->fetchAll();

// Detalhes exportáveis
$stmtDet = $pdo->prepare(
    "SELECT a.id, b.nome_banda, a.data_ensaio, a.hora_inicio, a.hora_fim,
            a.valor_total, a.status, u.nome AS responsavel
     FROM agendamentos a
     JOIN bandas   b ON b.id = a.banda_id
     JOIN usuarios u ON u.id = a.usuario_id
     WHERE a.data_ensaio BETWEEN :ini AND :fim
     ORDER BY a.data_ensaio DESC"
);
$stmtDet->execute([':ini' => $dataIni, ':fim' => $dataFim]);
$detalhes = $stmtDet->fetchAll();

// Datas formatadas para exportação no JS (passadas via data island)
$dataIniFormatada = date('d/m/Y', strtotime($dataIni));
$dataFimFormatada = date('d/m/Y', strtotime($dataFim));
