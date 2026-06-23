# Pulse — Sistema de Gestão para Estúdios de Gravação 🎙️

**Pulse** é uma solução completa e moderna para gestão de estúdios de gravação e ensaio. Centraliza o controle de bandas, equipamentos, agendamentos e faturamento com uma interface premium baseada em *Liquid Glass UI*, *Dynamic Island* e *Glassmorphism*.

> **Tags:** #SaaS #StudioManagement #PHP #MySQL #JavaScript #LocalStorage #GitHubPages #BentoGrid #ModernUI #DynamicIsland

[![Deploy GitHub Pages](https://github.com/berelels/pulse/actions/workflows/deploy.yml/badge.svg)](https://github.com/berelels/pulse/actions/workflows/deploy.yml)
[![Live Demo](https://img.shields.io/badge/Live%20Demo-GitHub%20Pages-orange?logo=github)](https://berelels.github.io/pulse)

---

## 🌐 Dois Modos de Execução

O Pulse suporta **dois modos** de execução, sem conflito entre eles:

| Modo | Tecnologia | Persistência | URL |
|------|-----------|--------------|-----|
| **GitHub Pages** | HTML + JS puro (SPA) | `localStorage` do navegador | [berelels.github.io/pulse](https://berelels.github.io/pulse) |
| **XAMPP (local)** | PHP 8.x + MySQL | Banco de dados MySQL | `http://localhost/pulse` |

### Modo GitHub Pages
- Não requer servidor ou banco de dados
- Funciona 100% no navegador
- Dados persistidos no `localStorage` do usuário
- Deploy automático via GitHub Actions a cada push na branch `main`
- **Credenciais demo:** `admin@pulse.studio` / `admin123`

### Modo XAMPP
- Backend PHP completo com sessões e segurança por prepared statements
- Banco MySQL com schema relacional
- Todas as funcionalidades avançadas (permissões granulares, faturamento real, etc.)

---

## 🏗️ Estrutura do Projeto

```
pulse/
├── .github/workflows/  # GitHub Actions — deploy automático para GitHub Pages
├── gh-pages/           # ← Versão estática (GitHub Pages)
│   ├── index.html      #   SPA única (todas as rotas via hash)
│   └── assets/
│       ├── css/        #   Mesmos estilos do XAMPP
│       └── js/
│           ├── store.js    # CRUD localStorage
│           ├── auth.js     # Autenticação simulada
│           ├── ui.js       # Helpers: toast, nav, temas
│           ├── views.js    # Views de todas as páginas
│           └── router.js   # Roteamento hash-based
├── assets/             # ← CSS/JS/Imagens compartilhados
├── config/             # Configuração PDO (XAMPP)
├── controllers/        # Lógica de negócio PHP
├── database/           # Schema SQL (init.sql)
├── includes/           # head.php, nav.php
├── templates/          # Views PHP
└── *.php               # Arquivos de roteamento PHP
```

---

## 🚀 Instalação e Configuração

### Modo GitHub Pages (Demo Online)

Acesse diretamente: **[berelels.github.io/pulse](https://berelels.github.io/pulse)**

O deploy é automático via GitHub Actions a cada push. Para publicar manualmente:

```bash
git add .
git commit -m "feat: sua alteração"
git push origin main
# O workflow deploy.yml publica gh-pages/ na branch gh-pages automaticamente
```

### Modo XAMPP (Local)

#### 1. Banco de Dados (MySQL)
1. Inicie Apache e MySQL no **XAMPP Control Panel**
2. Acesse `http://localhost/phpmyadmin`
3. Importe `database/init.sql` para criar o banco `pulse`

#### 2. Conexão (já configurada para XAMPP padrão)
```php
// config/conexao.php
define('DB_HOST', 'localhost');
define('DB_NAME', 'pulse');
define('DB_USER', 'root');
define('DB_PASS', '');
```

#### 3. Acessar
Coloque a pasta em `htdocs/pulse` e acesse: `http://localhost/pulse`

#### 4. Login Padrão
| Campo | Valor |
|-------|-------|
| Email | `admin@pulse.studio` |
| Senha | `admin123` |

---

## ✅ Funcionalidades

| Módulo | GitHub Pages | XAMPP |
|--------|:-----------:|:-----:|
| **Login** (autenticação) | ✅ (simulado) | ✅ (sessão PHP) |
| **Dashboard** (KPIs, próximos ensaios) | ✅ | ✅ |
| **Bandas** (CRUD completo + busca) | ✅ | ✅ |
| **Equipamentos** (CRUD + status) | ✅ | ✅ |
| **Agendamentos** (CRUD + filtros + cálculo automático) | ✅ | ✅ |
| **Relatórios** (faturamento, top bandas, exportação) | ✅ | ✅ |
| **Usuários** (gerenciamento de equipe) | ✅ | ✅ |
| **Regras de Negócio** (preços, horários) | ✅ | ✅ |
| **Exportar Excel** (SheetJS) | ✅ | ✅ |
| **Exportar PDF** (jsPDF) | ✅ | ✅ |
| **Tema claro/escuro** | ✅ | ✅ |
| **Intro animation** (primeiro login) | — | ✅ |
| **Permissões granulares** | ✅ | ✅ |

---

## 🛠 Tecnologias

| Camada | Tecnologia |
|--------|-----------|
| Backend (XAMPP) | PHP 8.x nativo (MVC simplificado, PDO) |
| Banco (XAMPP) | MySQL via XAMPP |
| Frontend (ambos) | HTML5 semântico + CSS3 puro + JS ES6+ |
| SPA Engine (Pages) | Vanilla JS — Hash Router + localStorage Store |
| Ícones | Font Awesome 6 |
| Exportação | SheetJS (Excel) + jsPDF (PDF) |
| CI/CD | GitHub Actions (`peaceiris/actions-gh-pages`) |

---

## 🎨 Design

- **Paleta:** `#282829` · `#FFFDF0` · `#002A54` · `#8AA8FF` · `#FF9800`
- **Estética:** Liquid Glass UI (Glassmorphism sutil)
- **Navegação:** Dynamic Island (pill flutuante centralizada)
- **Login:** Layout 50/50 flat + ilustração isométrica
- **Tipografia:** Outfit (títulos) + Nunito (corpo) — Google Fonts
- **Animações:** Micro-animações em cards, modais e toasts

---

## 🔐 Segurança (Modo XAMPP)

- Queries com **Prepared Statements (PDO)** — proteção contra SQL Injection
- Validação dupla: JavaScript (UX) + PHP (segurança)
- Rotas protegidas por `session_start()` + verificação de `$_SESSION`
- Área de administração restrita a `is_admin = true`

---

*Desenvolvido como projeto de portfólio — Pulse Studio Management System.*
*Suporta execução via GitHub Pages (localStorage) e via XAMPP (PHP + MySQL).*
