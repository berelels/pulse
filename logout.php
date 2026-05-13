<?php
require_once 'config/sessao.php';
session_destroy();
header('Location: login.php');
exit;
