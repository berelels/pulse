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
  senha     VARCHAR(255) NOT NULL,
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

-- -------------------------------------------------------------
-- Tabela Pivot: Agendamento de Equipamentos
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS agendamento_equipamentos (
  agendamento_id INT UNSIGNED NOT NULL,
  equipamento_id INT UNSIGNED NOT NULL,
  PRIMARY KEY (agendamento_id, equipamento_id),
  CONSTRAINT fk_ae_agendamento FOREIGN KEY (agendamento_id) REFERENCES agendamentos(id) ON DELETE CASCADE,
  CONSTRAINT fk_ae_equipamento FOREIGN KEY (equipamento_id) REFERENCES equipamentos(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- -------------------------------------------------------------
-- Regras de Negócio (Configurações do Estúdio)
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS regras_negocio (
  id            INT UNSIGNED NOT NULL AUTO_INCREMENT,
  chave         VARCHAR(50)  NOT NULL UNIQUE,
  valor         VARCHAR(255) NOT NULL,
  descricao     VARCHAR(255),
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =============================================================
-- DADOS DE EXEMPLO
-- =============================================================

-- Usuário admin  (senha plain: admin123)
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


-- Regras de Negócio padrão
INSERT INTO regras_negocio (chave, valor, descricao) VALUES
  ('preco_hora_ensaio',    '150.00', 'Valor por hora de ensaio (R$)'),
  ('preco_hora_gravacao',  '250.00', 'Valor por hora de gravação (R$)'),
  ('min_horas_reserva',    '2',      'Mínimo de horas por reserva'),
  ('max_horas_reserva',    '12',     'Máximo de horas por reserva'),
  ('desconto_fidelidade',  '10',     'Desconto (%) para bandas com 5+ agendamentos'),
  ('taxa_cancelamento',    '20',     'Taxa (%) cobrada em cancelamentos com < 24h'),
  ('horario_abertura',     '08:00',  'Horário de abertura do estúdio'),
  ('horario_fechamento',   '23:00',  'Horário de fechamento do estúdio'),
  ('nome_estudio',         'Pulse Studio', 'Nome do estúdio'),
  ('moeda',                'BRL',    'Moeda utilizada (ISO 4217)');

-- =============================================================
-- ACESSO:  admin@pulse.studio  /  admin123
-- GERE NOVO HASH EM: http://localhost/pulse/scripts/gerar_hash.php
-- IMPORTAR: phpMyAdmin → Importar → selecione este arquivo
-- =============================================================
