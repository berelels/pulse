# Pulse — Sistema de Gestão para Estúdios de Gravação 🎙️

![PHP](https://img.shields.io/badge/PHP-8.x-777BB4?logo=php) ![MySQL](https://img.shields.io/badge/MySQL-XAMPP-4479A1?logo=mysql) ![CSS3](https://img.shields.io/badge/CSS3-Liquid%20Glass-1572B6?logo=css3)

## Visão Geral

**Pulse** é um Sistema Web de Gestão e Locação para Estúdios de Gravação e Ensaios.
Permite que a equipe do estúdio gerencie bandas, equipamentos e agendamentos de forma eficiente, com uma interface moderna estilo *Liquid Glass UI* e *Dynamic Island*.

---

## 🛠 Tecnologias

| Camada     | Tecnologia                               |
|------------|------------------------------------------|
| Backend    | PHP 8.x nativo (MVC simplificado, PDO)   |
| Banco      | MySQL (XAMPP local)                      |
| Frontend   | HTML5 semântico + CSS3 puro + JS ES6+   |
| Ícones     | Font Awesome 6                           |
| Exportação | SheetJS (Excel) + jsPDF (PDF)            |

---

## 📁 Estrutura de Pastas

```
pulse/
├── assets/         # CSS (estilos principais, login), JS e Imagens
├── config/         # Configurações de conexão PDO e sessão
├── controllers/    # Lógica de negócio e ações (MVC)
├── css/            # Arquivos CSS (espelho de assets/css para desenvolvimento)
├── database/       # Script SQL para criação do banco
├── includes/       # Cabeçalho, Dynamic Island (Nav), utilitários
├── templates/      # Views HTML para as páginas
└── *.php           # Arquivos de roteamento principais
```

---

## 🚀 Instalação e Configuração

### 1. Banco de Dados (MySQL via XAMPP)

1. Inicie o Apache e o MySQL no **XAMPP Control Panel**.
2. Acesse `http://localhost/phpmyadmin`.
3. Importe o arquivo `database/init.sql` para criar o banco de dados `pulse` e suas tabelas, já populadas com dados iniciais.

### 2. Configurar Conexão

As credenciais do banco já vêm configuradas para o padrão do XAMPP local em `config/conexao.php`:

```php
define('DB_HOST', 'localhost');
define('DB_PORT', '3306');
define('DB_NAME', 'pulse');
define('DB_USER', 'root');
define('DB_PASS', '');
```

### 3. Acessar o Sistema

1. Coloque a pasta do projeto (`pulse`) dentro do diretório `htdocs` do seu XAMPP (ex: `C:\xampp\htdocs\pulse` ou `/opt/lampp/htdocs/pulse`).
2. Acesse o sistema pelo navegador na URL: `http://localhost/pulse`.

### 4. Login Padrão

| Campo | Valor              |
|-------|--------------------|
| Email | admin@pulse.studio |
| Senha | admin123           |

---

## ✅ Funcionalidades

### Autenticação
- Login e proteção por sessões PHP em todas as páginas internas
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
- Gestão de acessos
- Exclusão (exceto o próprio usuário logado)

---

## 🔐 Segurança

- Queries seguras utilizando **Prepared Statements (PDO)** contra SQL Injection.
- Validação dupla: JavaScript (UX) + PHP (segurança).
- Acesso às rotas protegido por `session_start()` + verificação de `$_SESSION`.
- Página de administração restrita para usuários do tipo admin (`is_admin = true`).

---

## 🎨 Design

- **Paleta**: `#282829` · `#FFFDF0` · `#002A54` · `#8AA8FF` · `#FF9800`
- **Estética Global**: Liquid Glass UI (Glassmorphism sutil).
- **Navegação**: Dynamic Island (pill flutuante centralizada) responsiva.
- **Login**: Layout 50/50 com design Flat e ilustração Isométrica integrada.
- **Tipografia**: Inter (Google Fonts)
- **Animações**: Micro-animações em cards, modais e toasts.

---

*Desenvolvido como projeto acadêmico e portfólio SaaS — Pulse Studio Management System.*
