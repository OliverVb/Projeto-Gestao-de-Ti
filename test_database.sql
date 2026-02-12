-- =============================================
-- Script de Teste do Banco de Dados
-- Verifica se todas as tabelas e dados foram criados
-- =============================================

USE oliverit;

-- Mostrar todas as tabelas
SHOW TABLES;

-- Contar registros em cada tabela
SELECT '=' AS separador, 'RESUMO DE REGISTROS' AS titulo, '=' AS separador;

SELECT 'equipe_ti' AS Tabela, COUNT(*) AS Total_Registros FROM equipe_ti
UNION ALL
SELECT 'impressoras', COUNT(*) FROM impressoras
UNION ALL
SELECT 'internet', COUNT(*) FROM internet
UNION ALL
SELECT 'equipamentos', COUNT(*) FROM equipamentos
UNION ALL
SELECT 'emails_corporativos', COUNT(*) FROM emails_corporativos
UNION ALL
SELECT 'auditoria_logs', COUNT(*) FROM auditoria_logs;

-- Verificar estrutura das tabelas
SELECT '=' AS separador, 'ESTRUTURA DAS TABELAS' AS titulo, '=' AS separador;

SHOW TABLES;

-- Amostra de dados de cada tabela
SELECT '=' AS separador, 'AMOSTRA EQUIPE TI' AS titulo, '=' AS separador;
SELECT id, cotec, cidade, nome FROM equipe_ti LIMIT 3;

SELECT '=' AS separador, 'AMOSTRA IMPRESSORAS' AS titulo, '=' AS separador;
SELECT id, cotec, cidade, monocromatica, policromatica FROM impressoras LIMIT 3;

SELECT '=' AS separador, 'AMOSTRA INTERNET' AS titulo, '=' AS separador;
SELECT id, cotec, cidade, operadora, velocidade_link FROM internet LIMIT 3;

SELECT '=' AS separador, 'AMOSTRA EQUIPAMENTOS' AS titulo, '=' AS separador;
SELECT id, cotec, cidade, unifi FROM equipamentos LIMIT 3;

SELECT '=' AS separador, 'AMOSTRA EMAILS' AS titulo, '=' AS separador;
SELECT id, nome, email_corporativo, status FROM emails_corporativos LIMIT 5;

-- Verificar Views criadas
SELECT '=' AS separador, 'VIEWS CRIADAS' AS titulo, '=' AS separador;
SHOW FULL TABLES WHERE Table_type = 'VIEW';

-- Teste da View de estatísticas
SELECT '=' AS separador, 'ESTATÍSTICAS DE EMAILS' AS titulo, '=' AS separador;
SELECT * FROM vw_estatisticas_emails;

-- Verificar Stored Procedures
SELECT '=' AS separador, 'PROCEDURES CRIADAS' AS titulo, '=' AS separador;
SHOW PROCEDURE STATUS WHERE Db = 'oliverit';

SELECT '=' AS separador, 'TESTE CONCLUÍDO COM SUCESSO!' AS titulo, '=' AS separador;
