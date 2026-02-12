<?php
/**
 * Script para corrigir a senha do admin
 * APAGUE ESTE ARQUIVO APÓS USAR!
 */

require_once 'config.php';

try {
    $db = getDB();
    
    // Gerar novo hash para a senha 'admin123'
    $novaSenha = password_hash('admin123', PASSWORD_DEFAULT);
    
    // Atualizar a senha do admin
    $stmt = $db->prepare("UPDATE usuarios SET senha = ? WHERE usuario = 'admin'");
    $stmt->execute([$novaSenha]);
    
    if ($stmt->rowCount() > 0) {
        echo "<!DOCTYPE html>
        <html>
        <head>
            <meta charset='UTF-8'>
            <title>Senha Corrigida</title>
            <style>
                body { 
                    font-family: 'Segoe UI', sans-serif; 
                    background: linear-gradient(135deg, #1a1a2e, #16213e);
                    min-height: 100vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: #fff;
                }
                .box {
                    background: rgba(255,255,255,0.1);
                    padding: 40px;
                    border-radius: 16px;
                    text-align: center;
                    max-width: 400px;
                }
                .success { color: #4caf50; font-size: 3rem; }
                h2 { margin: 20px 0; }
                p { color: #ccc; margin: 10px 0; }
                .btn {
                    display: inline-block;
                    margin-top: 20px;
                    padding: 12px 30px;
                    background: linear-gradient(135deg, #57bd9e, #3d8b6a);
                    color: white;
                    text-decoration: none;
                    border-radius: 10px;
                    font-weight: 600;
                }
                .warning { 
                    background: rgba(255,152,0,0.2);
                    border: 1px solid #ff9800;
                    padding: 15px;
                    border-radius: 8px;
                    margin-top: 20px;
                    font-size: 0.9rem;
                }
            </style>
        </head>
        <body>
            <div class='box'>
                <div class='success'>✅</div>
                <h2>Senha Corrigida!</h2>
                <p><strong>Usuário:</strong> admin</p>
                <p><strong>Senha:</strong> admin123</p>
                <a href='login.html' class='btn'>Ir para Login</a>
                <div class='warning'>⚠️ APAGUE este arquivo (corrigir_senha.php) após usar!</div>
            </div>
        </body>
        </html>";
    } else {
        echo "Nenhum usuário 'admin' encontrado para atualizar.";
    }
    
} catch (PDOException $e) {
    echo "Erro: " . $e->getMessage();
}
