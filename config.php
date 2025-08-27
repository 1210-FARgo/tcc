<?php
// Configurações para a conexão com o banco de dados

// Constantes com as informações do banco de dados
define('DB_SERVER', 'localhost');
define('DB_USERNAME', 'root'); // Usuário padrão do XAMPP
define('DB_PASSWORD', '');     // Senha padrão do XAMPP é vazia
define('DB_NAME', 'flashcards_db');

// Tenta estabelecer a conexão com o banco de dados usando MySQLi
$conexao = new mysqli(DB_SERVER, DB_USERNAME, DB_PASSWORD, DB_NAME);

// Verifica se a conexão falhou
if($conexao->connect_error){
    // Se houver um erro, exibe uma mensagem e encerra o script
    die("Erro de conexão: " . $conexao->connect_error);
}

?>