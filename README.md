# Projeto Gestão de TI - IT Management Automation System

Sistema automatizado para gestão de TI que elimina processos manuais e aumenta a eficiência operacional.

## 🎯 Objetivo

Este projeto foi desenvolvido para **automatizar processos manuais** na gestão de TI, incluindo:

- ✅ Gestão automatizada de ativos (hardware e software)
- ✅ Sistema de tickets com workflows automáticos
- ✅ Gestão de usuários com trilhas de auditoria
- ✅ Monitoramento de sistemas com alertas automáticos

## 🚀 Funcionalidades

### 1. Gestão de Ativos (Asset Management)
- Cadastro e rastreamento automático de equipamentos
- Categorização de ativos (Desktop, Laptop, Servidor, etc.)
- Relatórios de inventário automatizados
- Controle de status e localização

### 2. Gestão de Tickets (Ticket Management)
- Criação automática de tickets
- Workflows automatizados de atribuição
- Escalação automática de tickets críticos
- Sistema de comentários e histórico
- Relatórios de SLA e resolução

### 3. Gestão de Usuários (User Management)
- Provisionamento automatizado de contas
- Controle de acesso por função (Admin, Técnico, Usuário)
- Trilha de auditoria automática
- Ativação/desativação automatizada

### 4. Monitoramento de Sistemas (System Monitoring)
- Verificações automáticas de saúde do sistema
- Sistema de alertas automáticos em caso de erro
- Relatórios de disponibilidade
- Dashboard de status consolidado

## 📋 Pré-requisitos

- Python 3.7 ou superior
- pip (gerenciador de pacotes Python)

## 🔧 Instalação

1. Clone o repositório:
```bash
git clone https://github.com/OliverVb/Projeto-Gestao-de-Ti.git
cd Projeto-Gestao-de-Ti
```

2. Instale as dependências:
```bash
pip install -r requirements.txt
```

3. O sistema está pronto para uso!

## 💻 Uso

O sistema possui uma interface de linha de comando (CLI) para todas as operações:

### Gestão de Ativos

```bash
# Adicionar um novo ativo
python itmanager.py asset add --name "Laptop Dell XPS" --category "Laptop" --location "Sala 101"

# Listar todos os ativos
python itmanager.py asset list

# Listar ativos por categoria
python itmanager.py asset list --category "Laptop"

# Gerar relatório de ativos
python itmanager.py asset report
```

### Gestão de Tickets

```bash
# Criar um novo ticket
python itmanager.py ticket create --title "Problema de rede" --description "Internet não funciona" --priority "High"

# Listar tickets abertos
python itmanager.py ticket list --status "Open"

# Atribuir ticket a um técnico (automação de workflow)
python itmanager.py ticket assign --ticket-id TICKET-20260212120000 --assign "João Silva"

# Atualizar status do ticket (automação de notificações)
python itmanager.py ticket update --ticket-id TICKET-20260212120000 --new-status "Resolved"

# Gerar relatório de tickets
python itmanager.py ticket report
```

### Gestão de Usuários

```bash
# Criar novo usuário
python itmanager.py user create --username "jsilva" --fullname "João Silva" --email "jsilva@company.com" --role "Technician"

# Listar usuários
python itmanager.py user list

# Listar apenas administradores
python itmanager.py user list --role "Admin"

# Desativar usuário (automação de offboarding)
python itmanager.py user deactivate --user-id USER-20260212120000

# Gerar relatório de usuários
python itmanager.py user report
```

### Monitoramento de Sistemas

```bash
# Registrar verificação de sistema
python itmanager.py monitor check --system "Web Server" --check-type "HTTP" --status "OK" --message "Server responding"

# Registrar erro (gera alerta automático)
python itmanager.py monitor check --system "Database" --check-type "Connection" --status "ERROR" --message "Connection timeout"

# Ver status de todos os sistemas
python itmanager.py monitor status

# Ver status de um sistema específico
python itmanager.py monitor status --system "Web Server"

# Ver alertas recentes
python itmanager.py monitor alerts

# Gerar relatório de monitoramento
python itmanager.py monitor report
```

## 📊 Estrutura do Projeto

```
Projeto-Gestao-de-Ti/
├── src/
│   ├── __init__.py          # Inicialização do pacote
│   ├── utils.py             # Utilitários e funções comuns
│   ├── asset_manager.py     # Módulo de gestão de ativos
│   ├── ticket_manager.py    # Módulo de gestão de tickets
│   ├── user_manager.py      # Módulo de gestão de usuários
│   └── monitoring.py        # Módulo de monitoramento
├── data/                    # Dados do sistema (gerado automaticamente)
│   ├── assets.json
│   ├── tickets.json
│   ├── users.json
│   └── monitoring.json
├── config.yaml              # Configuração do sistema
├── requirements.txt         # Dependências Python
├── itmanager.py            # Interface CLI principal
└── README.md               # Este arquivo
```

## 🔄 Automações Implementadas

### 1. Escalação Automática de Tickets
- Tickets com prioridade "Critical" são automaticamente escalados
- Sistema adiciona comentários automáticos sobre escalação

### 2. Atribuição Automática de Status
- Ao atribuir um ticket, o status muda automaticamente de "Open" para "In Progress"
- Ao resolver um ticket, o timestamp de resolução é registrado automaticamente

### 3. Trilha de Auditoria Automática
- Todas as ações de usuário são registradas automaticamente
- Histórico limitado aos últimos 50 eventos para evitar bloat

### 4. Sistema de Alertas Automático
- Verificações com status "ERROR" geram alertas automáticos
- Alertas são registrados e podem ser consultados via CLI

### 5. Geração Automática de Relatórios
- Relatórios consolidados de todos os módulos
- Estatísticas automáticas por categoria, status, prioridade, etc.

## 🔐 Segurança

- Dados armazenados localmente em arquivos JSON
- Trilha de auditoria completa de todas as ações
- Controle de acesso baseado em funções (RBAC)
- Validação de entrada em todos os módulos

## 🤝 Contribuindo

Contribuições são bem-vindas! Por favor:

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/NovaFuncionalidade`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/NovaFuncionalidade`)
5. Abra um Pull Request

## 📝 Licença

Este projeto é de código aberto e está disponível para uso livre.

## 👥 Autores

Desenvolvido pela equipe de Gestão de TI

## 📧 Suporte

Para suporte ou questões, por favor abra uma issue no repositório do GitHub.
