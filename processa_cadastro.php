<?php
// processa_cadastro.php

// Inclui o arquivo de configuração para conectar ao banco de dados
require_once "config.php";

// Verifica se o método da requisição é POST (se o formulário foi enviado)
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    
    // Coleta o nome e a senha do formulário
    $nome = $_POST['nome'];
    $senha_texto = $_POST['senha'];

    // --- SEGURANÇA: Criptografa a senha ---
    // É muito importante nunca guardar senhas em texto puro no banco de dados.
    // Usamos password_hash() para criar uma "impressão digital" segura da senha.
    $senha_hash = password_hash($senha_texto, PASSWORD_DEFAULT);

    // Prepara a consulta SQL para inserir o novo usuário
    // Usar "prepared statements" (prepare) previne injeção de SQL.
    $sql = "INSERT INTO usuarios (nome, senha) VALUES (?, ?)";

    if ($stmt = $conexao->prepare($sql)) {
        // Vincula as variáveis aos parâmetros da consulta
        // "ss" significa que estamos enviando duas strings (string, string)
        $stmt->bind_param("ss", $nome, $senha_hash);

        // Tenta executar a consulta
        if ($stmt->execute()) {
            // Se o cadastro for bem-sucedido, redireciona para a página de login
            header("location: login.php");
            exit();
        } else {
            // Se houver um erro (ex: nome de usuário já existe), exibe uma mensagem
            echo "Erro! O nome de usuário já pode existir. Tente outro.";
        }

        // Fecha o statement
        $stmt->close();
    }
}

// Fecha a conexão com o banco de dados
$conexao->close();
?>