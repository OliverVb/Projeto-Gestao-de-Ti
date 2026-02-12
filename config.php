<?php
/**
 * Configuração de Conexão com Banco de Dados
 * Sistema COTEC - Gestão de COTECs de Goiás
 * Data: 02/02/2026
 */

// Configurações do Banco de Dados - KingHost
define('DB_HOST', 'mysql.oliverit.com.br');
define('DB_NAME', 'oliverit');
define('DB_USER', 'oliverit');
define('DB_PASS', 'Oliveira369');
define('DB_CHARSET', 'utf8mb4');

// Classe de Conexão com o Banco de Dados
class Database {
    private static $instance = null;
    private $conn;
    
    private function __construct() {
        try {
            $dsn = "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=" . DB_CHARSET;
            $options = [
                PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES   => false,
                PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES " . DB_CHARSET
            ];
            
            $this->conn = new PDO($dsn, DB_USER, DB_PASS, $options);
            
        } catch(PDOException $e) {
            die("Erro de conexão: " . $e->getMessage());
        }
    }
    
    public static function getInstance() {
        if (self::$instance === null) {
            self::$instance = new self();
        }
        return self::$instance;
    }
    
    public function getConnection() {
        return $this->conn;
    }
    
    // Prevenir clonagem
    private function __clone() {}
    
    // Prevenir unserialize
    public function __wakeup() {
        throw new Exception("Não é possível unserialize singleton");
    }
}

// Função auxiliar para obter conexão
function getDB() {
    return Database::getInstance()->getConnection();
}

// Configurações adicionais
date_default_timezone_set('America/Sao_Paulo');
ini_set('display_errors', 1);
error_reporting(E_ALL);

?>
