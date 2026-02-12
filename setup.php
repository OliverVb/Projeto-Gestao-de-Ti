<?php
/**
 * Script para configurar a tabela de usuários
 * Execute apenas UMA VEZ para criar a tabela e o usuário admin
 * APAGUE ESTE ARQUIVO APÓS USAR!
 */

require_once 'config.php';

$messages = [];

try {
    $db = getDB();
    
    // Criar tabela de usuários
    $sql = "CREATE TABLE IF NOT EXISTS usuarios (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nome VARCHAR(100) NOT NULL,
        usuario VARCHAR(50) NOT NULL UNIQUE,
        email VARCHAR(100) NOT NULL UNIQUE,
        senha VARCHAR(255) NOT NULL,
        perfil ENUM('admin', 'usuario') NOT NULL DEFAULT 'usuario',
        ativo TINYINT(1) NOT NULL DEFAULT 1,
        ultimo_acesso DATETIME NULL,
        data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci";
    
    $db->exec($sql);
    $messages[] = "✅ Tabela 'usuarios' criada com sucesso!";
    
    // Verificar se já existe um admin
    $stmt = $db->query("SELECT COUNT(*) FROM usuarios WHERE usuario = 'admin'");
    $exists = $stmt->fetchColumn();
    
    if ($exists > 0) {
        $messages[] = "⚠️ Usuário 'admin' já existe. Nenhuma alteração feita.";
    } else {
        // Criar usuário admin
        $senha = password_hash('admin123', PASSWORD_DEFAULT);
        
        $stmt = $db->prepare("INSERT INTO usuarios (nome, usuario, email, senha, perfil) VALUES (?, ?, ?, ?, ?)");
        $stmt->execute(['Administrador', 'admin', 'admin@cotec.com', $senha, 'admin']);
        
        $messages[] = "✅ Usuário 'admin' criado com sucesso!";
        $messages[] = "📝 Dados de acesso:";
        $messages[] = "   • Usuário: admin";
        $messages[] = "   • Senha: admin123";
    }
    
} catch (PDOException $e) {
    $messages[] = "❌ Erro: " . $e->getMessage();
}
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Setup - Sistema COTEC</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: 'Segoe UI', Tahoma, sans-serif;
            background: linear-gradient(135deg, #1a1a2e, #16213e);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #fff;
        }
        .container {
            background: rgba(255,255,255,0.1);
            backdrop-filter: blur(10px);
            border-radius: 16px;
            padding: 40px;
            max-width: 500px;
            width: 90%;
            box-shadow: 0 20px 50px rgba(0,0,0,0.3);
        }
        h1 { 
            text-align: center; 
            margin-bottom: 30px;
            font-size: 1.8rem;
        }
        .message {
            padding: 12px 16px;
            margin: 10px 0;
            border-radius: 8px;
            background: rgba(255,255,255,0.1);
            line-height: 1.6;
        }
        .success { border-left: 4px solid #4caf50; }
        .warning { border-left: 4px solid #ff9800; }
        .error { border-left: 4px solid #f44336; }
        .btn {
            display: block;
            width: 100%;
            padding: 14px;
            margin-top: 25px;
            background: linear-gradient(135deg, #57bd9e, #3d8b6a);
            color: white;
            text-decoration: none;
            text-align: center;
            border-radius: 10px;
            font-weight: 600;
            font-size: 1rem;
            transition: transform 0.2s, box-shadow 0.2s;
        }
        .btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(87, 189, 158, 0.4);
        }
        .warning-box {
            background: rgba(255, 152, 0, 0.2);
            border: 1px solid #ff9800;
            border-radius: 8px;
            padding: 15px;
            margin-top: 25px;
            text-align: center;
            font-size: 0.9rem;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🔧 Setup do Sistema</h1>
        
        <?php foreach ($messages as $msg): ?>
            <div class="message <?php 
                echo strpos($msg, '✅') !== false ? 'success' : 
                    (strpos($msg, '⚠️') !== false ? 'warning' : 
                    (strpos($msg, '❌') !== false ? 'error' : '')); 
            ?>">
                <?php echo nl2br(htmlspecialchars($msg)); ?>
            </div>
        <?php endforeach; ?>
        
        <a href="login.html" class="btn">🔐 Ir para o Login</a>
        
        <div class="warning-box">
            ⚠️ <strong>IMPORTANTE:</strong> Apague este arquivo (setup.php) após usar por questões de segurança!
        </div>
    </div>
</body>
</html>
