<?php

// Configurações para a conexão com o servidor MySQL
define('DB_SERVER', 'localhost');
define('DB_USERNAME', 'root');     // Usuário padrão do XAMPP
define('DB_PASSWORD', '');         // Senha padrão do XAMPP é vazia
define('DB_NAME', 'flashcards_db'); // Nome do banco de dados

// 1. Tenta estabelecer a conexão APENAS com o servidor MySQL (sem especificar o DB)
$conexao = new mysqli(DB_SERVER, DB_USERNAME, DB_PASSWORD);

// 2. Verifica se a conexão com o servidor falhou
if($conexao->connect_error){
    die("Erro ao conectar ao Servidor MySQL: " . $conexao->connect_error);
}

// 3. Comando SQL para criar o banco de dados SE ELE NÃO EXISTIR
$sql_criar_db = "CREATE DATABASE IF NOT EXISTS " . DB_NAME;

if ($conexao->query($sql_criar_db) === TRUE) {
    // Apenas informa que criou (ou que já existia), para fins de debug
    // echo "Banco de dados '" . DB_NAME . "' verificado/criado com sucesso.<br>";
} else {
    // Se a tentativa de criar/verificar falhar, exibe o erro
    die("Erro ao criar/verificar banco de dados: " . $conexao->error);
}

// 4. Seleciona o banco de dados para todas as consultas futuras
$conexao->select_db(DB_NAME);

// Agora a variável $conexao está pronta para uso e o DB existe
// Você pode continuar com a criação de tabelas aqui, se quiser:
// $sql_criar_tabela = "CREATE TABLE IF NOT EXISTS cartoes ( id INT PRIMARY KEY, ... )";
// $conexao->query($sql_criar_tabela);

?>