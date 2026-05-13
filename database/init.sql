-- =============================================================
-- PULSE — init.sql  (MySQL / XAMPP)
-- Execute no phpMyAdmin ou via: mysql -u root pulse < init.sql
-- =============================================================

CREATE DATABASE IF NOT EXISTS pulse
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE pulse;

-- -------------------------------------------------------------
-- Usuários do sistema (autenticação própria, sem Supabase)
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS usuarios (
  id        INT UNSIGNED NOT NULL AUTO_INCREMENT,
  nome      VARCHAR(150) NOT NULL,
  email     VARCHAR(150) NOT NULL UNIQUE,
  senha     VARCHAR(150) NOT NULL,
  is_admin  TINYINT(1)   NOT NULL DEFAULT 0,
  criado_em DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- -------------------------------------------------------------
-- Bandas / Clientes
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS bandas (
  id          INT UNSIGNED NOT NULL AUTO_INCREMENT,
  nome_banda  VARCHAR(200) NOT NULL,
  responsavel VARCHAR(150) NOT NULL,
  telefone    VARCHAR(30),
  genero      VARCHAR(80),
  criado_em   DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- -------------------------------------------------------------
-- Equipamentos
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS equipamentos (
  id            INT UNSIGNED   NOT NULL AUTO_INCREMENT,
  nome          VARCHAR(150)   NOT NULL,
  descricao     TEXT,
  valor_locacao DECIMAL(10,2)  NOT NULL DEFAULT 0.00,
  status        ENUM('disponivel','manutencao') NOT NULL DEFAULT 'disponivel',
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- -------------------------------------------------------------
-- Agendamentos
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS agendamentos (
  id          INT UNSIGNED   NOT NULL AUTO_INCREMENT,
  banda_id    INT UNSIGNED   NOT NULL,
  usuario_id  INT UNSIGNED   NOT NULL,
  data_ensaio DATE           NOT NULL,
  hora_inicio TIME           NOT NULL,
  hora_fim    TIME           NOT NULL,
  valor_total DECIMAL(10,2)  NOT NULL DEFAULT 0.00,
  status      ENUM('confirmado','cancelado','concluido','pendente') NOT NULL DEFAULT 'confirmado',
  observacoes TEXT,
  criado_em   DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  CONSTRAINT fk_ag_banda    FOREIGN KEY (banda_id)   REFERENCES bandas(id)    ON DELETE RESTRICT,
  CONSTRAINT fk_ag_usuario  FOREIGN KEY (usuario_id) REFERENCES usuarios(id)  ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =============================================================
-- DADOS DE EXEMPLO
-- =============================================================

-- Usuário admin  (senha: admin123)
INSERT INTO usuarios (nome, email, senha, is_admin) VALUES
  ('Administrador', 'admin@pulse.studio', 'admin123', 1);

-- Bandas
INSERT INTO bandas (nome_banda, responsavel, telefone, genero) VALUES
  ('The Analog Keys',  'Lucas Ferreira',  '(11) 99988-7766', 'Rock Alternativo'),
  ('Neon Wolves',      'Mariana Costa',   '(21) 98877-6655', 'Indie Pop'),
  ('Deep Groove Trio', 'Rafael Almeida',  '(31) 97766-5544', 'Jazz Fusion'),
  ('Velvet Thunder',   'Juliana Santos',  '(11) 96655-4433', 'Blues'),
  ('PixelBeat',        'Carlos Mendes',   '(41) 95544-3322', 'Eletrônico');

-- Equipamentos
INSERT INTO equipamentos (nome, descricao, valor_locacao, status) VALUES
  ('Marshall JCM800',      'Amplificador valvulado 100W',    80.00, 'disponivel'),
  ('Fender Twin Reverb',   'Combo 85W 2x12"',               70.00, 'disponivel'),
  ('Kit Bateria Pearl Export', 'Bumbo 22" completo',        120.00, 'disponivel'),
  ('Prato Zildjian A 20" Ride', 'Ride série A',              30.00, 'disponivel'),
  ('Microfone Shure SM7B', 'Dinâmico cardioide',             50.00, 'disponivel'),
  ('Microfone AKG C414',   'Condensador multi-padrão',       60.00, 'manutencao'),
  ('Mesa Behringer X32',   'Digital 32 canais',             100.00, 'disponivel'),
  ('DI Box Radial J48',    'Direct Box ativo',               20.00, 'disponivel');

-- =============================================================
-- ACESSO:  admin@pulse.studio  /  admin123
-- IMPORTAR: phpMyAdmin → Importar → selecione este arquivo
-- =============================================================

