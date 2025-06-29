-- ========================================
-- 1) Primero las tablas de lookup (sin dependencias)
-- ========================================
-- Drop tables if they exist (en orden inverso a las dependencias)
DROP TABLE IF EXISTS asistencia;
DROP TABLE IF EXISTS clase;
DROP TABLE IF EXISTS boleta;
DROP TABLE IF EXISTS rutina_ejercicio;
DROP TABLE IF EXISTS ejercicio;
DROP TABLE IF EXISTS cliente_rutina;
DROP TABLE IF EXISTS rutina;
DROP TABLE IF EXISTS entrenador_tipo;
DROP TABLE IF EXISTS cliente;
DROP TABLE IF EXISTS entrenador;
DROP TABLE IF EXISTS usuario;
DROP TABLE IF EXISTS contacto_emergencia;
DROP TABLE IF EXISTS membresia;
DROP TABLE IF EXISTS tipo_metodo_pago;
DROP TABLE IF EXISTS tipo_ejercicio;
DROP TABLE IF EXISTS tipo_grupo_muscular;
DROP TABLE IF EXISTS tipo_especialidad;
DROP TABLE IF EXISTS tipo_membresia;
DROP TABLE IF EXISTS tipo_genero;
DROP TABLE IF EXISTS tipo_sexo;
DROP TABLE IF EXISTS tipo_usuario;

-- ========================================
-- 2) Crear tablas de lookup
-- ========================================
CREATE TABLE IF NOT EXISTS tipo_usuario (
  id_tipo_usuario SERIAL PRIMARY KEY,
  nombre          VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS tipo_sexo (
  id_tipo_sexo SERIAL PRIMARY KEY,
  nombre       VARCHAR(20) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS tipo_genero (
  id_tipo_genero  SERIAL PRIMARY KEY,
  nombre          VARCHAR(20) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS tipo_membresia (
  id_tipo_membresia SERIAL PRIMARY KEY,
  nombre            VARCHAR(50) NOT NULL UNIQUE,
  descripcion       TEXT NOT NULL DEFAULT ''
);

CREATE TABLE IF NOT EXISTS tipo_ejercicio (
  id_tipo_ejercicio SERIAL PRIMARY KEY,
  nombre            VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS tipo_grupo_muscular (
  id_grupo_muscular SERIAL PRIMARY KEY,
  nombre            VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS tipo_metodo_pago (
  id_metodo SERIAL PRIMARY KEY,
  nombre    VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS tipo_especialidad (
  id_tipo_especialidad SERIAL PRIMARY KEY,
  nombre               VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS membresia (
  id_membresia   SERIAL PRIMARY KEY,
  nombre         VARCHAR(50) NOT NULL UNIQUE,
  descripcion    TEXT NOT NULL DEFAULT '',
  precio         NUMERIC(10,2) NOT NULL,
  duracion_dias  INTEGER NOT NULL
);

-- ========================================
-- 3) Población inicial de lookup
-- ========================================
INSERT INTO tipo_usuario (nombre) VALUES
  ('admin'),
  ('cliente'),
  ('entrenador')
ON CONFLICT DO NOTHING;

INSERT INTO tipo_genero (nombre) VALUES
  ('Masculino'),
  ('Femenino'),
  ('No binario'),
  ('Prefiero no decirlo')
ON CONFLICT DO NOTHING;

INSERT INTO tipo_sexo (nombre) VALUES
  ('Masculino'),
  ('Femenino'),
  ('Otro'),
  ('Prefiero no decirlo')
ON CONFLICT DO NOTHING;

INSERT INTO tipo_membresia (nombre, descripcion) VALUES
  ('Mensual', 'Acceso completo por 30 días'),
  ('Trimestral', 'Acceso completo por 90 días'),
  ('Semestral', 'Acceso completo por 180 días'),
  ('Anual', 'Acceso completo por 365 días')
ON CONFLICT DO NOTHING;

INSERT INTO membresia (nombre, descripcion, precio, duracion_dias) VALUES
  ('Plan Mensual Básico', 'Acceso a gimnasio en horario regular', 30000, 30),
  ('Plan Trimestral', 'Acceso a gimnasio + 1 clase grupal semanal', 80000, 90),
  ('Plan Semestral', 'Acceso completo + 2 clases grupales semanales', 150000, 180),
  ('Plan Anual Premium', 'Acceso total + clases ilimitadas', 280000, 365)
ON CONFLICT DO NOTHING;

INSERT INTO tipo_ejercicio (nombre) VALUES
  ('Cardiovascular'),
  ('Fuerza'),
  ('Flexibilidad'),
  ('Funcional')
ON CONFLICT DO NOTHING;

INSERT INTO tipo_grupo_muscular (nombre) VALUES
  ('Pecho'),
  ('Espalda'),
  ('Piernas'),
  ('Brazos'),
  ('Core')
ON CONFLICT DO NOTHING;

INSERT INTO tipo_metodo_pago (nombre) VALUES
  ('Efectivo'),
  ('Tarjeta de Débito'),
  ('Tarjeta de Crédito'),
  ('Transferencia')
ON CONFLICT DO NOTHING;

INSERT INTO tipo_especialidad (nombre) VALUES
  ('Cardio'),
  ('Fuerza'),
  ('Funcional'),
  ('Nutrición')
ON CONFLICT DO NOTHING;

-- ========================================
-- 4) Tablas con dependencias en orden
-- ========================================
CREATE TABLE IF NOT EXISTS contacto_emergencia (
  id_contacto    SERIAL PRIMARY KEY,
  telefono       VARCHAR(20) NOT NULL,
  relacion       VARCHAR(50) NOT NULL,
  nombre         VARCHAR(100) NOT NULL,
  direccion      VARCHAR(200) NOT NULL DEFAULT ''
);

INSERT INTO contacto_emergencia (telefono, relacion, nombre, direccion) VALUES 
  ('+56912345678', 'Familiar', 'Contacto Admin', 'Dirección 1'),
  ('+56923456789', 'Familiar', 'Contacto Cliente', 'Dirección 2'),
  ('+56934567890', 'Familiar', 'Contacto Entrenador', 'Dirección 3')
ON CONFLICT DO NOTHING;

CREATE TABLE IF NOT EXISTS usuario (
  id_usuario            SERIAL PRIMARY KEY,
  id_tipo_usuario       INTEGER NOT NULL REFERENCES tipo_usuario(id_tipo_usuario),
  correo                VARCHAR(100) UNIQUE NOT NULL,
  contrasena            VARCHAR(100) NOT NULL,
  primer_nombre         VARCHAR(50) NOT NULL,
  segundo_nombre        VARCHAR(50) NOT NULL DEFAULT '',
  primer_apellido       VARCHAR(50) NOT NULL,
  segundo_apellido      VARCHAR(50) NOT NULL DEFAULT '',
  telefono              VARCHAR(20) NOT NULL,
  cuerpo_rut            VARCHAR(8) NOT NULL,
  dv_rut                CHAR(1) NOT NULL,
  direccion             VARCHAR(200) NOT NULL DEFAULT '',
  fecha_nacimiento      DATE NOT NULL,
  fecha_registro        DATE NOT NULL DEFAULT CURRENT_DATE,
  activo                BOOLEAN NOT NULL DEFAULT TRUE,
  id_tipo_genero        INTEGER NOT NULL REFERENCES tipo_genero(id_tipo_genero),
  id_tipo_sexo          INTEGER NOT NULL REFERENCES tipo_sexo(id_tipo_sexo),
  id_contacto_emergencia INTEGER NOT NULL REFERENCES contacto_emergencia(id_contacto)
);

INSERT INTO usuario (
  id_tipo_usuario, correo, contrasena, primer_nombre, segundo_nombre,
  primer_apellido, segundo_apellido, telefono, cuerpo_rut, dv_rut,
  direccion, fecha_nacimiento, id_tipo_genero, id_tipo_sexo, id_contacto_emergencia
) VALUES 
  ((SELECT id_tipo_usuario FROM tipo_usuario WHERE nombre='admin'),     'admin@tyme.com',     'AdminPass123!', 'Admin',       'System', 'Master',  'Control', '+56912345678', '11111111', '1', 'Dirección Admin 123',    '1990-01-01', 1, 1, 1),
  ((SELECT id_tipo_usuario FROM tipo_usuario WHERE nombre='cliente'),   'cliente@tyme.com',   'ClientePass123!','Cliente',     'Test',   'Prueba',  'Demo',    '+56923456789', '22222222', '2', 'Dirección Cliente 456',  '1995-05-05', 2, 2, 2),
  ((SELECT id_tipo_usuario FROM tipo_usuario WHERE nombre='entrenador'),'entrenador@tyme.com','EntrenadorPass123!','Entrenador','Expert', 'Pro',     'Trainer', '+56934567890', '33333333', '3', 'Dirección Entrenador 789','1985-10-10', 1, 1, 3)
ON CONFLICT DO NOTHING;

CREATE TABLE IF NOT EXISTS entrenador (
  id_entrenador SERIAL PRIMARY KEY,
  id_usuario    INTEGER UNIQUE NOT NULL REFERENCES usuario(id_usuario)
);

INSERT INTO entrenador (id_usuario)
SELECT id_usuario FROM usuario WHERE correo='entrenador@tyme.com'
ON CONFLICT DO NOTHING;

CREATE TABLE IF NOT EXISTS cliente (
  id_cliente        SERIAL PRIMARY KEY,
  id_usuario        INTEGER UNIQUE NOT NULL REFERENCES usuario(id_usuario),
  id_tipo_membresia INTEGER NOT NULL REFERENCES tipo_membresia(id_tipo_membresia),
  id_entrenador     INTEGER NOT NULL REFERENCES entrenador(id_entrenador)
);

-- CORRECCIÓN: usar CROSS JOIN para asegurar la inserción de cliente
INSERT INTO cliente (id_usuario, id_tipo_membresia, id_entrenador)
SELECT 
  u.id_usuario,
  1,  -- Mensual
  e.id_entrenador
FROM usuario u
CROSS JOIN entrenador e
WHERE u.correo = 'cliente@tyme.com'
  AND e.id_usuario = (SELECT id_usuario FROM usuario WHERE correo='entrenador@tyme.com')
ON CONFLICT DO NOTHING;

CREATE TABLE IF NOT EXISTS entrenador_tipo (
  id_entrenador_tipo SERIAL PRIMARY KEY,
  id_entrenador      INTEGER NOT NULL REFERENCES entrenador(id_entrenador),
  id_tipo_especialidad INTEGER NOT NULL REFERENCES tipo_especialidad(id_tipo_especialidad)
);

INSERT INTO entrenador_tipo (id_entrenador, id_tipo_especialidad)
SELECT e.id_entrenador, te.id_tipo_especialidad
FROM entrenador e
CROSS JOIN tipo_especialidad te
WHERE e.id_usuario = (SELECT id_usuario FROM usuario WHERE correo='entrenador@tyme.com')
ON CONFLICT DO NOTHING;

-- ========================================
-- 5) Tablas de rutinas y ejercicios
-- ========================================
CREATE TABLE IF NOT EXISTS rutina (
  id_rutina     SERIAL PRIMARY KEY,
  id_entrenador INTEGER NOT NULL REFERENCES entrenador(id_entrenador),
  fecha_inicio  DATE NOT NULL,
  descripcion   TEXT,
  nombre        VARCHAR(100) NOT NULL
);

INSERT INTO rutina (id_entrenador, fecha_inicio, descripcion, nombre) VALUES
  (1, '2025-06-01', 'Rutina de fuerza enfocada en pecho y espalda', 'Fuerza Plus'),
  (1, '2025-06-02', 'Rutina de cardio y resistencia',         'Cardio Express')
ON CONFLICT DO NOTHING;

CREATE TABLE IF NOT EXISTS cliente_rutina (
  id_cliente_rutina SERIAL PRIMARY KEY,
  estado            VARCHAR(20) NOT NULL,
  id_rutina         INTEGER NOT NULL REFERENCES rutina(id_rutina),
  id_cliente        INTEGER NOT NULL REFERENCES cliente(id_cliente)
);

INSERT INTO cliente_rutina (estado, id_rutina, id_cliente) VALUES
  ('Activa',    1, 1),
  ('Pendiente', 2, 1)
ON CONFLICT DO NOTHING;

CREATE TABLE IF NOT EXISTS ejercicio (
  id_ejercicio      SERIAL PRIMARY KEY,
  nombre            VARCHAR(100) NOT NULL,
  descripcion       TEXT,
  video_url         TEXT,
  imagen_url        TEXT,
  id_grupo_muscular INTEGER REFERENCES tipo_grupo_muscular(id_grupo_muscular),
  id_tipo_ejercicio INTEGER REFERENCES tipo_ejercicio(id_tipo_ejercicio)
);

INSERT INTO ejercicio (nombre, descripcion, video_url, imagen_url, id_grupo_muscular, id_tipo_ejercicio) VALUES
  ('Press de banca', 'Ejercicio de fuerza para pecho', 'http://video1', 'http://img1', 1, 2),
  ('Sentadilla',     'Ejercicio de fuerza para piernas', 'http://video2', 'http://img2', 3, 2)
ON CONFLICT DO NOTHING;

CREATE TABLE IF NOT EXISTS rutina_ejercicio (
  id_rutina_ejercicio SERIAL PRIMARY KEY,
  id_rutina           INTEGER NOT NULL REFERENCES rutina(id_rutina),
  id_ejercicio        INTEGER NOT NULL REFERENCES ejercicio(id_ejercicio),
  dia                 INTEGER NOT NULL,
  orden               INTEGER NOT NULL,
  series              INTEGER NOT NULL,
  peso                NUMERIC(5,2),
  descanso            INTEGER,
  observacion         TEXT
);

INSERT INTO rutina_ejercicio (id_rutina, id_ejercicio, dia, orden, series, peso, descanso, observacion) VALUES
  (1, 1, 1, 1, 4,  60,  90, 'Mantener control de la barra'),
  (1, 2, 1, 2, 4,  80, 120, '')
ON CONFLICT DO NOTHING;

-- ========================================
-- 6) Tablas de pago y boletas
-- ========================================
CREATE TABLE IF NOT EXISTS boleta (
  id_boleta    SERIAL PRIMARY KEY,
  fecha_pago   DATE NOT NULL,
  metodo_pago  INTEGER NOT NULL REFERENCES tipo_metodo_pago(id_metodo),
  monto        NUMERIC(10,2) NOT NULL,
  observacion  TEXT,
  id_cliente   INTEGER NOT NULL REFERENCES cliente(id_cliente),
  id_membresia INTEGER NOT NULL REFERENCES membresia(id_membresia)
);

INSERT INTO boleta (fecha_pago, metodo_pago, monto, observacion, id_cliente, id_membresia) VALUES
  ('2025-06-05', 2, 30000, 'Pago mensual', 1, 1)
ON CONFLICT DO NOTHING;

-- ========================================
-- 7) Tablas de clases y asistencia
-- ========================================
CREATE TABLE IF NOT EXISTS clase (
  id_clase      SERIAL PRIMARY KEY,
  fecha_clase   DATE NOT NULL,
  nombre        VARCHAR(100) NOT NULL,
  descripcion   TEXT,
  hora_inicio   TIME NOT NULL,
  hora_fin      TIME NOT NULL,
  cupo_maximo   INTEGER NOT NULL,
  id_entrenador INTEGER NOT NULL REFERENCES entrenador(id_entrenador)
);

INSERT INTO clase (nombre, descripcion, hora_inicio, hora_fin, cupo_maximo, id_entrenador) VALUES
  ('2025-06-30','Yoga Matutino', 'Clase suave de yoga',               '08:00', '09:00', 15, 1),
  ('2025-06-29','HIIT',           'Entrenamiento intervalico de alta intensidad', '18:00', '18:45', 10, 1)
ON CONFLICT DO NOTHING;

CREATE TABLE IF NOT EXISTS asistencia (
  id_asistencia SERIAL PRIMARY KEY,
  id_cliente    INTEGER NOT NULL REFERENCES cliente(id_cliente),
  id_clase      INTEGER NOT NULL REFERENCES clase(id_clase),
  fecha         DATE NOT NULL
);

INSERT INTO asistencia (id_cliente, id_clase, fecha) VALUES
  (1, 1, '2025-06-06'),
  (1, 2, '2025-06-07')
ON CONFLICT DO NOTHING;
