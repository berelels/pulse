<?php
/**
 * PULSE - config/sessao.php
 * Helper de sessão: verifica autenticação e fornece dados do usuário logado.
 */

session_start();

/**
 * Redireciona para o login se o usuário não estiver autenticado.
 */
function requireAuth(): void
{
    if (empty($_SESSION['usuario_id'])) {
        header('Location: /login.php');
        exit;
    }
}

/**
 * Redireciona para o dashboard se o usuário já estiver logado.
 */
function requireGuest(): void
{
    if (!empty($_SESSION['usuario_id'])) {
        header('Location: /dashboard.php');
        exit;
    }
}

/**
 * Retorna os dados do usuário da sessão atual.
 */
function usuarioLogado(): array
{
    return [
        'id'       => $_SESSION['usuario_id']   ?? null,
        'nome'     => $_SESSION['usuario_nome'] ?? '',
        'email'    => $_SESSION['usuario_email'] ?? '',
        'is_admin' => $_SESSION['usuario_admin'] ?? false,
    ];
}

/**
 * Retorna true se o usuário logado for administrador.
 */
function isAdmin(): bool
{
    return !empty($_SESSION['usuario_admin']);
}

/**
 * Verifica se o usuário logado tem uma permissão específica.
 * Administradores possuem todas as permissões.
 */
function hasPermission(string $perm): bool
{
    if (isAdmin()) return true;
    
    $perms = $_SESSION['usuario_perms'] ?? [];
    return in_array($perm, $perms);
}
