<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Cadastro - Flash Cards</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <a href="index.php" class="back-arrow">&#x2190;</a>

    <div class="form-container">
        <h1>CADASTRO</h1>
        <form action="processa_cadastro.php" method="POST">
            <div class="input-group">
                <label for="nome">Nome</label>
                <input type="text" id="nome" name="nome" placeholder="Digite seu nome" required>
            </div>
            <div class="input-group">
                <label for="senha">Senha</label>
                <input type="password" id="senha" name="senha" placeholder="Digite sua senha" required>
            </div>
            <button type="submit" class="btn-principal">CADASTRAR</button>
        </form>
    </div>
</body>
</html>