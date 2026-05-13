# Pulse — Sistema de Gestão para Estúdios de Gravação 🎙️

![PHP](https://img.shields.io/badge/PHP-8.x-777BB4?logo=php) ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Supabase-3ECF8E?logo=supabase) ![CSS3](https://img.shields.io/badge/CSS3-Liquid%20Glass-1572B6?logo=css3)

## Visão Geral

**Pulse** é um Sistema Web de Gestão e Locação para Estúdios de Gravação e Ensaios.
Permite que a equipe do estúdio gerencie bandas, equipamentos e agendamentos de forma eficiente, com uma interface moderna estilo *Liquid Glass UI*.

---

## 🛠 Tecnologias

| Camada     | Tecnologia                               |
|------------|------------------------------------------|
| Backend    | PHP 8.x nativo (sessões + PDO)           |
| Banco      | PostgreSQL via **Supabase**              |
| Frontend   | HTML5 semântico + CSS3 puro + JS ES6+   |
| Ícones     | Font Awesome 6                           |
| Exportação | SheetJS (Excel) + jsPDF (PDF)            |

---

## 📁 Estrutura de Pastas

```
pulse/
├── api/
│   ├── agendamentos_action.php
│   ├── bandas_action.php
│   ├── equipamentos_action.php
│   └── usuarios_action.php
├── assets/
│   ├── css/style.css
│   └── js/main.js
├── config/
│   ├── conexao.php
│   └── sessao.php
├── database/
│   └── init.sql
├── includes/
│   └── nav.php
├── agendamentos.php
├── bandas.php
├── dashboard.php
├── equipamentos.php
├── index.php
├── login.php
├── logout.php
├── relatorios.php
└── usuarios.php
```

---

## 🚀 Instalação e Configuração

### 1. Banco de Dados (Supabase)

1. Acesse [supabase.com](https://supabase.com) e crie um projeto.
2. Vá em **SQL Editor** e execute o arquivo `database/init.sql`.
3. Anote a **Connection String** em `Settings → Database`.

### 2. Configurar Conexão

Edite `config/conexao.php` com as credenciais do seu projeto Supabase:

```php
define('DB_HOST', 'db.SEU_PROJECT_REF.supabase.co');
define('DB_PORT', '5432');
define('DB_NAME', 'postgres');
define('DB_USER', 'postgres');
define('DB_PASS', 'SUA_SENHA');
```

> **Recomendado:** Use variáveis de ambiente em produção.

### 3. Servidor Local (PHP)

```bash
cd /caminho/para/pulse
php -S localhost:8080
```

Acesse `http://localhost:8080`.

### 4. Login Padrão

| Campo | Valor              |
|-------|--------------------|
| Email | admin@pulse.studio |
| Senha | admin123           |

> ⚠️ **Troque a senha do admin imediatamente após o primeiro login!**

---

## ✅ Funcionalidades

### Autenticação
- Login com hash bcrypt (`password_hash` / `password_verify`)
- Sessões PHP protegendo todas as páginas internas
- Dois níveis de acesso: **Administrador** e **Colaborador**

### Bandas / Clientes
- CRUD completo (criar, listar, editar, excluir)
- Busca por nome da banda ou responsável
- Validação no frontend (JS) e no backend (PHP)

### Equipamentos
- CRUD completo
- Filtros combinados: nome + status (`disponivel` / `manutencao`)
- Valor de locação por sessão

### Agendamentos
- CRUD completo com modal de criação/edição
- **Filtros combinados**: Banda + Intervalo de Datas + Status
- Cancelamento seguro (marca como `cancelado`, não deleta)

### Relatórios
- Filtro por período (data início / fim)
- KPIs: Faturamento concluído, contagem por status
- Top 5 bandas do período
- **Exportar para Excel** (SheetJS)
- **Exportar para PDF** (jsPDF + AutoTable)

### Usuários (Admin Only)
- Cadastro de novos membros da equipe
- Edição de senha com hash automático
- Exclusão (exceto o próprio usuário logado)

---

## 🔐 Segurança

- Senhas armazenadas com `password_hash(PASSWORD_BCRYPT)`
- Todas as queries usam **Prepared Statements (PDO)**
- Validação dupla: JavaScript (UX) + PHP (segurança)
- Acesso às rotas protegido por `session_start()` + verificação de `$_SESSION`
- Página de administração de usuários restrita a `is_admin = true`

---

## 🎨 Design

- **Paleta**: `#282829` · `#FFFDF0` · `#002A54` · `#8AA8FF` · `#FF9800`
- **Estética**: Liquid Glass UI (Glassmorphism sutil)
- **Tipografia**: Inter (Google Fonts)
- **Layout**: Sidebar fixa + grid responsivo
- **Animações**: Micro-animações em cards, modais e toasts

---

*Desenvolvido como projeto acadêmico e portfólio SaaS — Pulse Studio Management System.*
