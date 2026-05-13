<?php
/**
 * PULSE - Sistema de Gestão para Estúdios
 * config/conexao.php
 *
 * Estabelece a conexão PDO com o MySQL (XAMPP).
 * Retorna uma instância singleton de PDO para ser reutilizada em toda a aplicação.
 */

// ---------------------------------------------------------------
// CONFIGURAÇÕES DE CONEXÃO — XAMPP (padrão)
// Ajuste apenas DB_NAME se criar o banco com outro nome.
// ---------------------------------------------------------------
define('DB_HOST',    'localhost');
define('DB_PORT',    '3306');
define('DB_NAME',    'pulse');
define('DB_USER',    'root');
define('DB_PASS',    '');          // XAMPP padrão: sem senha
define('DB_CHARSET', 'utf8mb4');

// ---------------------------------------------------------------
// FUNÇÃO: getConexao()
// Retorna a instância PDO. Padrão Singleton para evitar múltiplas
// conexões ao banco durante o mesmo request.
// ---------------------------------------------------------------
function getConexao(): PDO
{
    static $pdo = null;

    if ($pdo === null) {
        $dsn = sprintf(
            'mysql:host=%s;port=%s;dbname=%s;charset=%s',
            DB_HOST,
            DB_PORT,
            DB_NAME,
            DB_CHARSET
        );

        try {
            $pdo = new PDO($dsn, DB_USER, DB_PASS, [
                PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES   => false,
            ]);
        } catch (PDOException $e) {
            error_log('[PULSE DB ERROR] ' . $e->getMessage());
            http_response_code(503);
            die(json_encode([
                'erro'     => true,
                'mensagem' => 'Serviço temporariamente indisponível. Tente novamente em breve.',
            ]));
        }
    }

    return $pdo;
}
