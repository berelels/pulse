<?php
/**
 * PULSE — index.php
 * Redireciona para dashboard se autenticado, senão para login.
 */
session_start();
if (!empty($_SESSION['usuario_id'])) {
    header('Location: dashboard.php');
} else {
    header('Location: login.php');
}
exit;
