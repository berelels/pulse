# Pulse — Recording Studio Management System 🎙️

**Pulse** is a comprehensive and modern solution for managing recording and rehearsal studios. The system centralizes the control of bands, equipment, scheduling, and billing, offering a premium user experience through an interface based on *Bento Pro*, *Glassmorphism*, and *Dynamic Island* design principles.

---

## 🏗️ Overview

The system was designed to streamline the daily operations of music studios, allowing administrators and staff to manage complex workflows intuitively, featuring automatic value calculations and granular permission control.

---

## 🛠 Technologies

| Layer | Technology |
| --- | --- |
| Backend | Native PHP 8.x (Simplified MVC, PDO) |
| Database | MySQL (Local XAMPP) |
| Frontend | Semantic HTML5 + Pure CSS3 + JS ES6+ |
| Icons | Font Awesome 6 |
| Exporting | SheetJS (Excel) + jsPDF (PDF) |

---

## 📁 Folder Structure

```
pulse/
├── assets/         # CSS (main styles, login), JS, and Images
├── config/         # PDO connection and session settings
├── controllers/    # Business logic and actions (MVC)
├── css/            # CSS files (mirror of assets/css for development)
├── database/       # SQL script for database creation
├── includes/       # Header, Dynamic Island (Nav), utilities
├── templates/      # HTML Views for pages
└── *.php           # Main routing files

```

---

## 🚀 Installation and Configuration

### 1. Database (MySQL via XAMPP)

1. Start Apache and MySQL in the **XAMPP Control Panel**.
2. Access `http://localhost/phpmyadmin`.
3. Import the `database/init.sql` file to create the `pulse` database and its tables, which are pre-populated with initial data.

### 2. Configure Connection

Database credentials are pre-configured for the default local XAMPP settings in `config/conexao.php`:

```php
define('DB_HOST', 'localhost');
define('DB_PORT', '3306');
define('DB_NAME', 'pulse');
define('DB_USER', 'root');
define('DB_PASS', '');

```

### 3. Accessing the System

1. Place the project folder (`pulse`) inside your XAMPP `htdocs` directory (e.g., `C:\xampp\htdocs\pulse` or `/opt/lampp/htdocs/pulse`).
2. Access the system via browser at the URL: `http://localhost/pulse`.

### 4. Default Login

| Field | Value |
| --- | --- |
| Email | admin@pulse.studio |
| Password | admin123 |

---

## ✅ Features

### Authentication

* Login and protection via PHP sessions on all internal pages.
* Two access levels: **Administrator** and **Staff**.

### Bands / Clients

* Full CRUD (Create, Read, Update, Delete).
* Search by band name or representative.
* Frontend (JS) and Backend (PHP) validation.

### Equipment

* Full CRUD.
* Combined filters: name + status (`available` / `maintenance`).
* Rental fee per session.

### Scheduling

* Full CRUD with creation/editing modal.
* **Combined filters**: Band + Date Range + Status.
* Secure cancellation (marks as `cancelled` instead of deleting).

### Reports

* Filter by period (start/end date).
* KPIs: Completed billing, count by status.
* Top 5 bands of the period.
* **Export to Excel** (SheetJS).
* **Export to PDF** (jsPDF + AutoTable).

### Users (Admin Only)

* Registration of new team members.
* Access management.
* Deletion (except for the currently logged-in user).

---

## 🔐 Security

* Secure queries using **Prepared Statements (PDO)** to prevent SQL Injection.
* Dual validation: JavaScript (UX) + PHP (Security).
* Route access protected by `session_start()` + `$_SESSION` verification.
* Admin page restricted to users with `is_admin = true`.

---

## 🎨 Design

* **Palette**: `#282829` · `#FFFDF0` · `#002A54` · `#8AA8FF` · `#FF9800`
* **Global Aesthetic**: Liquid Glass UI (Subtle Glassmorphism).
* **Navigation**: Responsive Dynamic Island (centralized floating pill).
* **Login**: 50/50 layout with Flat design and integrated Isometric illustration.
* **Typography**: Outfit (Titles) and Nunito (Body) - Google Fonts.
* **Animations**: Micro-animations on cards, modals, and toasts.

---

*Developed as an academic project and SaaS portfolio — Pulse Studio Management System.*
