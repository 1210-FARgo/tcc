<?php
// processa_login.php

// Inicia a sessão. Essencial para manter o usuário logado entre as páginas.
session_start();

// Inclui o arquivo de configuração
require_once "config.php";

// Verifica se o formulário foi enviado
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $nome = $_POST['nome'];
    $senha_texto = $_POST['senha'];

    // Prepara a consulta para buscar o usuário pelo nome
    $sql = "SELECT id, nome, senha FROM usuarios WHERE nome = ?";

    if ($stmt = $conexao->prepare($sql)) {
        // Vincula o nome de usuário ao parâmetro da consulta
        $stmt->bind_param("s", $nome);

        // Executa a consulta
        if ($stmt->execute()) {
            // Armazena o resultado
            $stmt->store_result();

            // Verifica se o usuário foi encontrado (se existe 1 linha de resultado)
            if ($stmt->num_rows == 1) {
                // Vincula o resultado às variáveis
                $stmt->bind_result($id, $nome_usuario, $senha_hash_db);
                if ($stmt->fetch()) {
                    
                    // --- SEGURANÇA: Verifica a senha ---
                    // Usa password_verify() para comparar a senha digitada com a senha criptografada no banco
                    if (password_verify($senha_texto, $senha_hash_db)) {
                        
                        // Senha correta! Inicia a sessão do usuário.
                        session_start();
                        $_SESSION["loggedin"] = true;
                        $_SESSION["id"] = $id;
                        $_SESSION["nome"] = $nome_usuario;
                        
                        // Redireciona para uma página de boas-vindas
                        header("location: bemvindo.php");
                        exit();
                    } else {
                        // Senha incorreta
                        echo "A senha que você digitou não é válida.";
                    }
                }
            } else {
                // Usuário não encontrado
                echo "Nenhuma conta encontrada com esse nome de usuário.";
            }
        } else {
            echo "Ops! Algo deu errado. Por favor, tente novamente mais tarde.";
        }
        $stmt->close();
    }
}
$conexao->close();
?>