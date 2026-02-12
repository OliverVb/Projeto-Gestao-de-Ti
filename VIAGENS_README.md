# 📋 Escala de Viagens - Instruções de Instalação

## Descrição

Módulo de controle de escala de viagens para o Sistema COTEC 2026. Permite gerenciar viagens e deslocamentos da equipe de forma manual, incluindo:

- **Responsável** pela viagem
- **Destino e Origem**
- **Datas de ida e volta**
- **Horários de saída e retorno**
- **Motivo/Objetivo da viagem**
- **Meio de transporte e placa do veículo**
- **Hospedagem** (se aplicável)
- **Contato de emergência**
- **Valor estimado**
- **Status da viagem** (Agendada, Em Andamento, Concluída, Cancelada)

---

## 🔧 Instalação

### Passo 1: Executar o Script SQL

Execute o arquivo SQL no seu banco de dados MySQL para criar a tabela de viagens:

```sql
-- Arquivo: sql/criar_tabela_viagens.sql
```

**Via phpMyAdmin:**
1. Acesse o phpMyAdmin
2. Selecione seu banco de dados
3. Vá em "Importar" ou "SQL"
4. Cole o conteúdo do arquivo `sql/criar_tabela_viagens.sql`
5. Clique em "Executar"

**Via linha de comando:**
```bash
mysql -u seu_usuario -p nome_do_banco < sql/criar_tabela_viagens.sql
```

---

## 📁 Arquivos Criados/Modificados

### Novos Arquivos:
- `sql/criar_tabela_viagens.sql` - Script de criação da tabela
- `api/get_viagens.php` - API para listar viagens

### Arquivos Modificados:
- `api/dados.php` - Adicionada entidade 'viagens' para CRUD
- `index.html` - Nova aba "Escala de Viagens" no menu e dashboard
- `script.js` - Funções de renderização e filtros para viagens
- `admin.js` - Configuração CRUD para viagens
- `styles.css` - Estilos visuais para viagens

---

## 🎯 Funcionalidades

### Dashboard
- Card com contagem de viagens agendadas/em andamento

### Aba de Viagens
- **Filtros:** Busca por texto, status, destino
- **Visualização:** Cards ou Tabela
- **Resumo:** Contadores por status e valor total estimado
- **Exportação:** Exportar para Excel
- **CRUD:** Adicionar, Editar, Excluir viagens (admin)

### Status das Viagens
- 📅 **Agendada** - Viagem programada
- 🚗 **Em Andamento** - Viagem em curso
- ✅ **Concluída** - Viagem finalizada
- ❌ **Cancelada** - Viagem cancelada

---

## 📊 Estrutura da Tabela

```sql
CREATE TABLE viagens (
    id INT AUTO_INCREMENT PRIMARY KEY,
    responsavel VARCHAR(255) NOT NULL,
    destino VARCHAR(255) NOT NULL,
    origem VARCHAR(255),
    data_ida DATE,
    data_volta DATE,
    horario_saida VARCHAR(50),
    horario_retorno VARCHAR(50),
    motivo TEXT,
    cotec VARCHAR(255),
    meio_transporte VARCHAR(100),
    placa_veiculo VARCHAR(20),
    hospedagem VARCHAR(255),
    contato_emergencia VARCHAR(100),
    valor_estimado DECIMAL(10,2),
    status ENUM('AGENDADA', 'EM_ANDAMENTO', 'CONCLUIDA', 'CANCELADA'),
    obs TEXT,
    data_cadastro DATETIME,
    data_atualizacao DATETIME
);
```

---

## 🚀 Uso

1. Acesse o sistema
2. Faça login com sua conta
3. Clique no menu "✈️ Escala de Viagens"
4. Use o botão "➕ Adicionar" para criar novas viagens
5. Preencha os campos conforme necessário
6. Gerencie o status das viagens conforme elas progridem

---

## 📝 Notas

- Somente administradores podem adicionar, editar ou excluir viagens
- As datas podem ser deixadas em branco se ainda não definidas
- O valor estimado é opcional
- Use o campo de observações para informações adicionais
