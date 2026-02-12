<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Teste de Conexão - COTEC oliverit</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #57bd9e 0%, #42a589 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
        }
        .container {
            background: white;
            border-radius: 20px;
            padding: 40px;
            max-width: 900px;
            width: 100%;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
        }
        h1 {
            color: #333;
            margin-bottom: 10px;
            text-align: center;
            font-size: 32px;
        }
        .subtitle {
            text-align: center;
            color: #666;
            margin-bottom: 30px;
            font-size: 14px;
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
            background: #e8f8f5;
            color: #0c5460;
            border-left: 4px solid #57bd9e;
            padding: 20px;
            border-radius: 10px;
            margin-top: 20px;
        }
        .info strong {
            display: block;
            margin-bottom: 15px;
            font-size: 18px;
            color: #42a589;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 15px;
            background: white;
        }
        th, td {
            padding: 14px;
            text-align: left;
            border-bottom: 1px solid #e0e0e0;
        }
        th {
            background: #f8f9fa;
            font-weight: 600;
            color: #333;
            font-size: 14px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        tr:hover {
            background: #f5f5f5;
        }
        .icon {
            font-size: 60px;
            text-align: center;
            margin-bottom: 20px;
        }
        .btn {
            display: inline-block;
            padding: 14px 35px;
            background: #57bd9e;
            color: white;
            text-decoration: none;
            border-radius: 8px;
            margin-top: 25px;
            text-align: center;
            transition: all 0.3s;
            font-weight: 600;
            box-shadow: 0 4px 12px rgba(87, 189, 158, 0.3);
        }
        .btn:hover {
            background: #42a589;
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(87, 189, 158, 0.4);
        }
        .badge {
            display: inline-block;
            padding: 6px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 600;
        }
        .badge-success {
            background: #d4edda;
            color: #155724;
        }
        .badge-warning {
            background: #fff3cd;
            color: #856404;
        }
        .grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 15px;
            margin-top: 20px;
        }
        .card {
            background: linear-gradient(135deg, #57bd9e 0%, #42a589 100%);
            color: white;
            padding: 20px;
            border-radius: 12px;
            text-align: center;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }
        .card-number {
            font-size: 32px;
            font-weight: bold;
            margin-bottom: 5px;
        }
        .card-label {
            font-size: 13px;
            opacity: 0.9;
        }
    </style>
</head>
<body>
    <div class="container">
<?php
// Configuração de conexão
$host = 'localhost';
$dbname = 'oliverit';
$user = 'root';
$pass = 'Oliveira369';

try {
    // Tentar conectar
    $dsn = "mysql:host=$host;dbname=$dbname;charset=utf8mb4";
    $options = [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
    ];
    
    $pdo = new PDO($dsn, $user, $pass, $options);
    
    echo '<div class="icon">✅</div>';
    echo '<h1>Conexão Estabelecida!</h1>';
    echo '<p class="subtitle">Banco de dados: <strong>oliverit</strong></p>';
    
    echo '<div class="status success">';
    echo '<strong>✓ Status:</strong> Conectado ao MySQL com sucesso<br>';
    echo '<strong>✓ Banco:</strong> ' . $dbname . '<br>';
    echo '<strong>✓ Host:</strong> ' . $host . '<br>';
    echo '<strong>✓ Usuário:</strong> ' . $user;
    echo '</div>';
    
    // Buscar informações das tabelas
    $stmt = $pdo->query("
        SELECT 
            'equipe_ti' AS tabela, 
            COUNT(*) AS total, 
            'Equipe de TI' AS descricao 
        FROM equipe_ti
        UNION ALL
        SELECT 'impressoras', COUNT(*), 'Impressoras' FROM impressoras
        UNION ALL
        SELECT 'internet', COUNT(*), 'Conexões Internet' FROM internet
        UNION ALL
        SELECT 'equipamentos', COUNT(*), 'Equipamentos' FROM equipamentos
        UNION ALL
        SELECT 'emails_corporativos', COUNT(*), 'Emails Corporativos' FROM emails_corporativos
        UNION ALL
        SELECT 'auditoria_logs', COUNT(*), 'Logs de Auditoria' FROM auditoria_logs
    ");
    
    $tabelas = $stmt->fetchAll();
    $totalGeral = array_sum(array_column($tabelas, 'total'));
    
    // Cards com estatísticas
    echo '<div class="grid">';
    foreach ($tabelas as $tabela) {
        echo '<div class="card">';
        echo '<div class="card-number">' . $tabela['total'] . '</div>';
        echo '<div class="card-label">' . $tabela['descricao'] . '</div>';
        echo '</div>';
    }
    echo '</div>';
    
    // Tabela detalhada
    echo '<div class="info">';
    echo '<strong>📊 Detalhamento das Tabelas</strong>';
    echo '<table>';
    echo '<tr><th>#</th><th>Tabela</th><th>Descrição</th><th>Registros</th><th>Status</th></tr>';
    
    $i = 1;
    foreach ($tabelas as $tabela) {
        $statusClass = $tabela['total'] > 0 ? 'badge-success' : 'badge-warning';
        $statusText = $tabela['total'] > 0 ? 'Populada' : 'Vazia';
        
        echo '<tr>';
        echo '<td>' . $i . '</td>';
        echo '<td><strong>' . $tabela['tabela'] . '</strong></td>';
        echo '<td>' . $tabela['descricao'] . '</td>';
        echo '<td><strong>' . $tabela['total'] . '</strong></td>';
        echo '<td><span class="badge ' . $statusClass . '">' . $statusText . '</span></td>';
        echo '</tr>';
        $i++;
    }
    
    echo '</table>';
    echo '<p style="margin-top: 20px; font-size: 16px; color: #42a589;"><strong>Total de Registros: ' . $totalGeral . '</strong></p>';
    echo '</div>';
    
    // Verificar Views
    $viewsStmt = $pdo->query("SHOW FULL TABLES WHERE Table_type = 'VIEW'");
    $views = $viewsStmt->fetchAll();
    
    if (count($views) > 0) {
        echo '<div class="info">';
        echo '<strong>👁️ Views Criadas (' . count($views) . ')</strong>';
        echo '<ul style="margin-top: 10px; padding-left: 20px;">';
        foreach ($views as $view) {
            echo '<li>' . reset($view) . '</li>';
        }
        echo '</ul>';
        echo '</div>';
    }
    
    // Verificar Procedures
    $procStmt = $pdo->query("SHOW PROCEDURE STATUS WHERE Db = '$dbname'");
    $procedures = $procStmt->fetchAll();
    
    if (count($procedures) > 0) {
        echo '<div class="info">';
        echo '<strong>⚙️ Stored Procedures (' . count($procedures) . ')</strong>';
        echo '<ul style="margin-top: 10px; padding-left: 20px;">';
        foreach ($procedures as $proc) {
            echo '<li>' . $proc['Name'] . '</li>';
        }
        echo '</ul>';
        echo '</div>';
    }
    
    echo '<div style="text-align: center;">';
    echo '<a href="index.html" class="btn">🏠 Voltar ao Sistema</a>';
    echo '</div>';
    
} catch(PDOException $e) {
    echo '<div class="icon">❌</div>';
    echo '<h1>Erro de Conexão</h1>';
    echo '<p class="subtitle">Não foi possível conectar ao banco de dados</p>';
    
    echo '<div class="status error">';
    echo '<strong>✗ Erro:</strong> ' . $e->getMessage() . '<br><br>';
    echo '<strong>Possíveis soluções:</strong><br>';
    echo '1. Verifique se o MySQL está rodando<br>';
    echo '2. Confirme usuário e senha: root / Oliveira369<br>';
    echo '3. Verifique se o banco "oliverit" existe<br>';
    echo '4. Execute o arquivo database_setup.sql';
    echo '</div>';
    
    echo '<div style="text-align: center;">';
    echo '<a href="index.html" class="btn">🏠 Voltar ao Sistema</a>';
    echo '</div>';
}
?>
    </div>
</body>
</html>
