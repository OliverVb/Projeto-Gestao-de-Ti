@echo off
echo ====================================
echo   COTEC - Criacao do Banco de Dados
echo ====================================
echo.
echo Executando script SQL...
echo.

mysql -u root -pOliveira369 < database_setup.sql

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ====================================
    echo   SUCESSO! Banco criado com sucesso
    echo ====================================
    echo.
    echo Tabelas criadas:
    echo   - equipe_ti
    echo   - impressoras
    echo   - internet
    echo   - equipamentos
    echo   - emails_corporativos
    echo   - auditoria_logs
    echo.
    echo Total: 147 registros inseridos
    echo.
    echo Teste a conexao: test_connection.php
    echo ====================================
) else (
    echo.
    echo ====================================
    echo   ERRO ao criar banco de dados
    echo ====================================
    echo.
    echo Verifique:
    echo   1. MySQL esta rodando?
    echo   2. Senha correta: Oliveira369
    echo   3. Usuario root tem permissoes?
    echo.
)

pause
