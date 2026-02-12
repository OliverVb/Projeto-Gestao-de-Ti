<?php
/**
 * Gerenciador de Usuários via Banco de Dados
 * Acesse este arquivo para criar/listar/gerenciar usuários
 * APAGUE APÓS USAR!
 */

require_once 'config.php';

$mensagem = '';
$tipo = '';
$usuarios = [];

try {
    $db = getDB();
    
    // Criar tabela se não existir
    $db->exec("CREATE TABLE IF NOT EXISTS usuarios (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nome VARCHAR(100) NOT NULL,
        usuario VARCHAR(50) NOT NULL UNIQUE,
        email VARCHAR(100) NOT NULL UNIQUE,
        senha VARCHAR(255) NOT NULL,
        perfil ENUM('admin', 'usuario') NOT NULL DEFAULT 'usuario',
        ativo TINYINT(1) NOT NULL DEFAULT 1,
        ultimo_acesso DATETIME NULL,
        data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci");
    
    // Processar ações
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $acao = isset($_POST['acao']) ? $_POST['acao'] : '';
        
        // Criar usuário
        if ($acao === 'criar') {
            $nome = trim($_POST['nome']);
            $usuario = trim($_POST['usuario']);
            $email = trim($_POST['email']);
            $senha = $_POST['senha'];
            $perfil = $_POST['perfil'];
            
            if (empty($nome) || empty($usuario) || empty($email) || empty($senha)) {
                $mensagem = 'Todos os campos são obrigatórios!';
                $tipo = 'error';
            } else {
                $senhaHash = password_hash($senha, PASSWORD_DEFAULT);
                
                try {
                    $stmt = $db->prepare("INSERT INTO usuarios (nome, usuario, email, senha, perfil) VALUES (?, ?, ?, ?, ?)");
                    $stmt->execute([$nome, $usuario, $email, $senhaHash, $perfil]);
                    $mensagem = "Usuário '$usuario' criado com sucesso! Senha: $senha";
                    $tipo = 'success';
                } catch (PDOException $e) {
                    if (strpos($e->getMessage(), 'Duplicate') !== false) {
                        $mensagem = 'Usuário ou email já existe!';
                    } else {
                        $mensagem = 'Erro: ' . $e->getMessage();
                    }
                    $tipo = 'error';
                }
            }
        }
        
        // Redefinir senha
        if ($acao === 'redefinir_senha') {
            $id = (int)$_POST['id'];
            $novaSenha = $_POST['nova_senha'];
            
            if (empty($novaSenha)) {
                $mensagem = 'Digite a nova senha!';
                $tipo = 'error';
            } else {
                $senhaHash = password_hash($novaSenha, PASSWORD_DEFAULT);
                $stmt = $db->prepare("UPDATE usuarios SET senha = ? WHERE id = ?");
                $stmt->execute([$senhaHash, $id]);
                $mensagem = "Senha redefinida com sucesso! Nova senha: $novaSenha";
                $tipo = 'success';
            }
        }
        
        // Alterar status
        if ($acao === 'toggle_status') {
            $id = (int)$_POST['id'];
            $stmt = $db->prepare("UPDATE usuarios SET ativo = NOT ativo WHERE id = ?");
            $stmt->execute([$id]);
            $mensagem = 'Status alterado com sucesso!';
            $tipo = 'success';
        }
        
        // Excluir
        if ($acao === 'excluir') {
            $id = (int)$_POST['id'];
            $stmt = $db->prepare("DELETE FROM usuarios WHERE id = ?");
            $stmt->execute([$id]);
            $mensagem = 'Usuário excluído!';
            $tipo = 'success';
        }
        
        // Alterar perfil
        if ($acao === 'alterar_perfil') {
            $id = (int)$_POST['id'];
            $perfil = $_POST['perfil'];
            $stmt = $db->prepare("UPDATE usuarios SET perfil = ? WHERE id = ?");
            $stmt->execute([$perfil, $id]);
            $mensagem = 'Perfil alterado com sucesso!';
            $tipo = 'success';
        }
    }
    
    // Listar usuários
    $stmt = $db->query("SELECT * FROM usuarios ORDER BY id");
    $usuarios = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
} catch (PDOException $e) {
    $mensagem = 'Erro de conexão: ' . $e->getMessage();
    $tipo = 'error';
}
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Gerenciador de Usuários - Banco de Dados</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: 'Segoe UI', sans-serif;
            background: linear-gradient(135deg, #1a1a2e, #16213e);
            min-height: 100vh;
            padding: 20px;
            color: #333;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
        }
        h1 {
            color: white;
            text-align: center;
            margin-bottom: 30px;
            font-size: 1.8rem;
        }
        .card {
            background: white;
            border-radius: 16px;
            padding: 25px;
            margin-bottom: 25px;
            box-shadow: 0 10px 40px rgba(0,0,0,0.3);
        }
        .card h2 {
            color: #57bd9e;
            margin-bottom: 20px;
            font-size: 1.2rem;
        }
        .alert {
            padding: 15px 20px;
            border-radius: 10px;
            margin-bottom: 20px;
            font-weight: 500;
        }
        .alert-success {
            background: #d4edda;
            color: #155724;
            border: 1px solid #c3e6cb;
        }
        .alert-error {
            background: #f8d7da;
            color: #721c24;
            border: 1px solid #f5c6cb;
        }
        .form-row {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 15px;
            margin-bottom: 15px;
        }
        .form-group {
            display: flex;
            flex-direction: column;
            gap: 6px;
        }
        label {
            font-weight: 600;
            color: #555;
            font-size: 0.9rem;
        }
        input, select {
            padding: 10px 14px;
            border: 2px solid #e0e0e0;
            border-radius: 8px;
            font-size: 0.95rem;
            transition: border-color 0.2s;
        }
        input:focus, select:focus {
            outline: none;
            border-color: #57bd9e;
        }
        .btn {
            padding: 10px 20px;
            border: none;
            border-radius: 8px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s;
            font-size: 0.9rem;
        }
        .btn-primary {
            background: linear-gradient(135deg, #57bd9e, #3d8b6a);
            color: white;
        }
        .btn-primary:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 15px rgba(87, 189, 158, 0.4);
        }
        .btn-danger {
            background: #e53935;
            color: white;
        }
        .btn-warning {
            background: #ff9800;
            color: white;
        }
        .btn-sm {
            padding: 6px 12px;
            font-size: 0.8rem;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 15px;
        }
        th, td {
            padding: 12px 10px;
            text-align: left;
            border-bottom: 1px solid #eee;
        }
        th {
            background: #f8f9fa;
            font-weight: 700;
            color: #555;
            font-size: 0.85rem;
        }
        tr:hover {
            background: #f8f9fa;
        }
        .badge {
            display: inline-block;
            padding: 4px 10px;
            border-radius: 20px;
            font-size: 0.75rem;
            font-weight: 600;
        }
        .badge-admin {
            background: linear-gradient(135deg, #667eea, #764ba2);
            color: white;
        }
        .badge-user {
            background: #e3f2fd;
            color: #1976d2;
        }
        .badge-active {
            background: #e8f5e9;
            color: #2e7d32;
        }
        .badge-inactive {
            background: #ffebee;
            color: #c62828;
        }
        .actions {
            display: flex;
            gap: 5px;
            flex-wrap: wrap;
        }
        .warning-box {
            background: rgba(255, 152, 0, 0.1);
            border: 2px solid #ff9800;
            border-radius: 10px;
            padding: 15px;
            margin-top: 20px;
            color: #e65100;
            text-align: center;
        }
        .back-link {
            display: inline-block;
            color: white;
            text-decoration: none;
            margin-bottom: 20px;
            font-weight: 500;
        }
        .back-link:hover {
            text-decoration: underline;
        }
        .senha-info {
            background: #fff3cd;
            border: 1px solid #ffc107;
            padding: 10px;
            border-radius: 8px;
            margin-top: 10px;
            font-size: 0.85rem;
        }
    </style>
</head>
<body>
    <div class="container">
        <a href="index.html" class="back-link">← Voltar ao Sistema</a>
        <h1>🔧 Gerenciador de Usuários (Banco de Dados)</h1>
        
        <?php if ($mensagem): ?>
            <div class="alert alert-<?php echo $tipo; ?>">
                <?php echo htmlspecialchars($mensagem); ?>
            </div>
        <?php endif; ?>
        
        <!-- Criar Novo Usuário -->
        <div class="card">
            <h2>➕ Criar Novo Usuário</h2>
            <form method="POST">
                <input type="hidden" name="acao" value="criar">
                <div class="form-row">
                    <div class="form-group">
                        <label>Nome Completo</label>
                        <input type="text" name="nome" required placeholder="Ex: João Silva">
                    </div>
                    <div class="form-group">
                        <label>Usuário (login)</label>
                        <input type="text" name="usuario" required placeholder="Ex: joao.silva">
                    </div>
                    <div class="form-group">
                        <label>Email</label>
                        <input type="email" name="email" required placeholder="Ex: joao@email.com">
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Senha</label>
                        <input type="text" name="senha" required placeholder="Digite a senha">
                    </div>
                    <div class="form-group">
                        <label>Perfil</label>
                        <select name="perfil">
                            <option value="usuario">👤 Usuário (somente leitura)</option>
                            <option value="admin">👑 Administrador (acesso total)</option>
                        </select>
                    </div>
                    <div class="form-group" style="justify-content: flex-end;">
                        <button type="submit" class="btn btn-primary">Criar Usuário</button>
                    </div>
                </div>
            </form>
        </div>
        
        <!-- Lista de Usuários -->
        <div class="card">
            <h2>📋 Usuários Cadastrados (<?php echo count($usuarios); ?>)</h2>
            
            <?php if (empty($usuarios)): ?>
                <p style="color: #999; text-align: center; padding: 40px;">Nenhum usuário cadastrado ainda.</p>
            <?php else: ?>
                <div style="overflow-x: auto;">
                    <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Nome</th>
                                <th>Usuário</th>
                                <th>Email</th>
                                <th>Perfil</th>
                                <th>Status</th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php foreach ($usuarios as $u): ?>
                                <tr>
                                    <td><?php echo $u['id']; ?></td>
                                    <td><strong><?php echo htmlspecialchars($u['nome']); ?></strong></td>
                                    <td><?php echo htmlspecialchars($u['usuario']); ?></td>
                                    <td><?php echo htmlspecialchars($u['email']); ?></td>
                                    <td>
                                        <span class="badge <?php echo $u['perfil'] === 'admin' ? 'badge-admin' : 'badge-user'; ?>">
                                            <?php echo $u['perfil'] === 'admin' ? '👑 Admin' : '👤 Usuário'; ?>
                                        </span>
                                    </td>
                                    <td>
                                        <span class="badge <?php echo $u['ativo'] ? 'badge-active' : 'badge-inactive'; ?>">
                                            <?php echo $u['ativo'] ? '✓ Ativo' : '✗ Inativo'; ?>
                                        </span>
                                    </td>
                                    <td>
                                        <div class="actions">
                                            <!-- Redefinir Senha -->
                                            <form method="POST" style="display:inline;" onsubmit="return confirm('Redefinir senha?');">
                                                <input type="hidden" name="acao" value="redefinir_senha">
                                                <input type="hidden" name="id" value="<?php echo $u['id']; ?>">
                                                <input type="text" name="nova_senha" placeholder="Nova senha" style="width:100px;padding:5px;" required>
                                                <button type="submit" class="btn btn-warning btn-sm">🔑</button>
                                            </form>
                                            
                                            <!-- Toggle Status -->
                                            <form method="POST" style="display:inline;">
                                                <input type="hidden" name="acao" value="toggle_status">
                                                <input type="hidden" name="id" value="<?php echo $u['id']; ?>">
                                                <button type="submit" class="btn btn-sm" style="background:#607d8b;color:white;">
                                                    <?php echo $u['ativo'] ? '🚫' : '✓'; ?>
                                                </button>
                                            </form>
                                            
                                            <!-- Alterar Perfil -->
                                            <form method="POST" style="display:inline;">
                                                <input type="hidden" name="acao" value="alterar_perfil">
                                                <input type="hidden" name="id" value="<?php echo $u['id']; ?>">
                                                <input type="hidden" name="perfil" value="<?php echo $u['perfil'] === 'admin' ? 'usuario' : 'admin'; ?>">
                                                <button type="submit" class="btn btn-sm" style="background:#9c27b0;color:white;" title="Alternar perfil">
                                                    <?php echo $u['perfil'] === 'admin' ? '👤' : '👑'; ?>
                                                </button>
                                            </form>
                                            
                                            <!-- Excluir -->
                                            <form method="POST" style="display:inline;" onsubmit="return confirm('Excluir este usuário?');">
                                                <input type="hidden" name="acao" value="excluir">
                                                <input type="hidden" name="id" value="<?php echo $u['id']; ?>">
                                                <button type="submit" class="btn btn-danger btn-sm">🗑️</button>
                                            </form>
                                        </div>
                                    </td>
                                </tr>
                            <?php endforeach; ?>
                        </tbody>
                    </table>
                </div>
            <?php endif; ?>
        </div>
        
        <div class="warning-box">
            ⚠️ <strong>SEGURANÇA:</strong> Apague este arquivo (gerenciar_usuarios.php) após configurar os usuários!
        </div>
    </div>
</body>
</html>
