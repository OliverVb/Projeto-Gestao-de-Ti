<?php
/**
 * Teste de Conexão com Banco de Dados
 * Sistema COTEC - Gestão de COTECs de Goiás
 */

require_once 'config.php';

echo "<!DOCTYPE html>
<html lang='pt-BR'>
<head>
    <meta charset='UTF-8'>
    <meta name='viewport' content='width=device-width, initial-scale=1.0'>
    <title>Teste de Conexão - COTEC</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
        }
        .container {
            background: white;
            border-radius: 15px;
            padding: 40px;
            max-width: 600px;
            width: 100%;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
        }
        h1 {
            color: #333;
            margin-bottom: 30px;
            text-align: center;
            font-size: 28px;
        }
        .status {
            padding: 20px;
            border-radius: 10px;
            margin-bottom: 20px;
            font-size: 16px;
        }
        .success {
            background: #d4edda;
            color: #155724;
            border-left: 4px solid #28a745;
        }
        .error {
            background: #f8d7da;
            color: #721c24;
            border-left: 4px solid #dc3545;
        }
        .info {
            background: #d1ecf1;
            color: #0c5460;
            border-left: 4px solid #17a2b8;
            margin-top: 20px;
        }
        .info strong {
            display: block;
            margin-bottom: 10px;
            font-size: 18px;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 15px;
        }
        th, td {
            padding: 12px;
            text-align: left;
            border-bottom: 1px solid #ddd;
        }
        th {
            background: #f8f9fa;
            font-weight: 600;
        }
        .icon {
            font-size: 50px;
            text-align: center;
            margin-bottom: 20px;
        }
        .btn {
            display: inline-block;
            padding: 12px 30px;
            background: #57bd9e;
            color: white;
            text-decoration: none;
            border-radius: 5px;
            margin-top: 20px;
            text-align: center;
            transition: background 0.3s;
        }
        .btn:hover {
            background: #42a589;
        }
    </style>
</head>
<body>
    <div class='container'>";

try {
    $db = getDB();
    
    echo "<div class='icon'>✅</div>";
    echo "<h1>Conexão Estabelecida com Sucesso!</h1>";
    
    echo "<div class='status success'>";
    echo "<strong>✓ Status:</strong> Conectado ao banco de dados MySQL<br>";
    echo "<strong>✓ Banco:</strong> " . DB_NAME . "<br>";
    echo "<strong>✓ Host:</strong> " . DB_HOST . "<br>";
    echo "<strong>✓ Charset:</strong> " . DB_CHARSET;
    echo "</div>";
    
    // Verificar tabelas existentes
    $stmt = $db->query("SHOW TABLES");
    $tables = $stmt->fetchAll(PDO::FETCH_COLUMN);
    
    if (count($tables) > 0) {
        echo "<div class='info'>";
        echo "<strong>📊 Tabelas Encontradas (" . count($tables) . "):</strong>";
        echo "<table>";
        echo "<tr><th>#</th><th>Nome da Tabela</th><th>Registros</th></tr>";
        
        $i = 1;
        foreach ($tables as $table) {
            $countStmt = $db->query("SELECT COUNT(*) as total FROM `$table`");
            $count = $countStmt->fetch()['total'];
            echo "<tr><td>$i</td><td>$table</td><td>$count</td></tr>";
            $i++;
        }
        echo "</table>";
        echo "</div>";
    } else {
        echo "<div class='info'>";
        echo "<strong>ℹ️ Informação:</strong><br>";
        echo "Nenhuma tabela encontrada no banco '<strong>" . DB_NAME . "</strong>'.<br>";
        echo "Execute o arquivo <strong>database_setup.sql</strong> para criar as tabelas.";
        echo "</div>";
    }
    
    echo "<div style='text-align: center;'>";
    echo "<a href='index.html' class='btn'>← Voltar ao Sistema</a>";
    echo "</div>";
    
} catch(PDOException $e) {
    echo "<div class='icon'>❌</div>";
    echo "<h1>Erro de Conexão</h1>";
    echo "<div class='status error'>";
    echo "<strong>✗ Erro:</strong> " . $e->getMessage() . "<br><br>";
    echo "<strong>Possíveis soluções:</strong><br>";
    echo "1. Verifique se o MySQL está rodando<br>";
    echo "2. Confirme usuário e senha em config.php<br>";
    echo "3. Verifique se o banco 'oliverit' existe<br>";
    echo "4. Execute: <code>mysql -u root -p < database_setup.sql</code>";
    echo "</div>";
}

echo "
    </div>
</body>
</html>";
?>
