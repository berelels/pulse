<?php
require_once '../config/conexao.php';
require_once '../config/sessao.php';
requireAuth();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    $novoTema = $data['tema'] ?? '';

    if (in_array($novoTema, ['claro', 'escuro'])) {
        $pdo = getConexao();
        $stmt = $pdo->prepare('UPDATE usuarios SET tema = :tema WHERE id = :id');
        $stmt->execute([':tema' => $novoTema, ':id' => $_SESSION['usuario_id']]);

        $_SESSION['tema'] = $novoTema;

        echo json_encode(['success' => true]);
        exit;
    }
}

echo json_encode(['success' => false, 'error' => 'Tema inválido']);
