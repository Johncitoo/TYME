-- ========================================
-- 1) Borrar tablas (en orden inverso a dependencias)
-- ========================================
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
-- 2) Tablas de lookup y población
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

-- -- Inserts tipos
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

-- Amplía los tipos para los usados en rutina
INSERT INTO tipo_ejercicio (nombre) VALUES
  ('Fuerza'),
  ('Cardio'),
  ('Flexibilidad'),
  ('Resistencia'),
  ('Potencia'),
  ('Velocidad'),
  ('Equilibrio')
ON CONFLICT DO NOTHING;

INSERT INTO tipo_grupo_muscular (nombre) VALUES
  ('Piernas'),
  ('Pecho'),
  ('Espalda'),
  ('Brazos'),
  ('Hombros'),
  ('Espalda baja'),
  ('Core'),
  ('Tríceps'),
  ('Femoral')
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
-- 3) Entidades principales y relaciones
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
  id_usuario, id_tipo_usuario, correo, contrasena, primer_nombre, segundo_nombre,
  primer_apellido, segundo_apellido, telefono, cuerpo_rut, dv_rut,
  direccion, fecha_nacimiento, id_tipo_genero, id_tipo_sexo, id_contacto_emergencia
) VALUES 
  (1, 1, 'admin@tyme.com',      'AdminPass123!',      'Admin',      'System', 'Master',  'Control', '+56912345678', '11111111', '1', 'Dirección Admin 123',    '1990-01-01', 1, 1, 1),
  (2, 3, 'entrenador@tyme.com', 'EntrenadorPass123!', 'Entrenador', 'Expert', 'Pro',     'Trainer', '+56934567890', '33333333', '3', 'Dirección Entrenador 789','1985-10-10', 1, 1, 3),
  (3, 2, 'cliente@tyme.com',    'ClientePass123!',    'Cliente',    'Test',   'Prueba',  'Demo',    '+56923456789', '22222222', '2', 'Dirección Cliente 456',  '1995-05-05', 2, 2, 2)
ON CONFLICT DO NOTHING;


CREATE TABLE IF NOT EXISTS entrenador (
  id_entrenador SERIAL PRIMARY KEY,
  id_usuario    INTEGER UNIQUE NOT NULL REFERENCES usuario(id_usuario)
);

INSERT INTO entrenador (id_entrenador, id_usuario)
VALUES (1, 1)
ON CONFLICT DO NOTHING;

CREATE TABLE IF NOT EXISTS cliente (
  id_cliente        SERIAL PRIMARY KEY,
  id_usuario        INTEGER UNIQUE NOT NULL REFERENCES usuario(id_usuario),
  id_tipo_membresia INTEGER NOT NULL DEFAULT 1 REFERENCES tipo_membresia(id_tipo_membresia),
  id_entrenador     INTEGER NOT NULL REFERENCES entrenador(id_entrenador)
);

INSERT INTO cliente (id_cliente, id_usuario, id_tipo_membresia, id_entrenador)
VALUES (1, 2, 1, 1)
ON CONFLICT DO NOTHING;

CREATE TABLE IF NOT EXISTS entrenador_tipo (
  id_entrenador_tipo SERIAL PRIMARY KEY,
  id_entrenador      INTEGER NOT NULL REFERENCES entrenador(id_entrenador),
  id_tipo_especialidad INTEGER NOT NULL REFERENCES tipo_especialidad(id_tipo_especialidad)
);

INSERT INTO entrenador_tipo (id_entrenador, id_tipo_especialidad)
VALUES (1, 2)
ON CONFLICT DO NOTHING;

-- ========================================
-- 4) Tablas de rutinas y ejercicios
-- ========================================
CREATE TABLE IF NOT EXISTS rutina (
  id_rutina     SERIAL PRIMARY KEY,
  id_entrenador INTEGER NOT NULL REFERENCES entrenador(id_entrenador),
  fecha_inicio  DATE NOT NULL,
  descripcion   TEXT,
  nombre        VARCHAR(100) NOT NULL
);

-- Rutina principal de ejemplo (id_rutina=3)
INSERT INTO rutina (id_rutina, id_entrenador, fecha_inicio, descripcion, nombre)
VALUES (3, 1, CURRENT_DATE, 'Rutina personalizada 3 días x 5 ejercicios', 'Rutina completa de fuerza')
ON CONFLICT DO NOTHING;

CREATE TABLE IF NOT EXISTS cliente_rutina (
  id_cliente_rutina SERIAL PRIMARY KEY,
  estado            VARCHAR(20) NOT NULL,
  id_rutina         INTEGER NOT NULL REFERENCES rutina(id_rutina),
  id_cliente        INTEGER NOT NULL REFERENCES cliente(id_cliente)
);

INSERT INTO cliente_rutina (id_cliente_rutina, estado, id_rutina, id_cliente)
VALUES (1, 'Activa', 3, 1)
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

-- Ejercicios, usando IDs específicos para la rutina (16-30)
INSERT INTO ejercicio (id_ejercicio, nombre, descripcion, video_url, imagen_url, id_grupo_muscular, id_tipo_ejercicio) VALUES
(16, 'Sentadillas', 'Ejercicio de piernas', NULL, NULL, 1, 1),
(17, 'Press de banca', 'Ejercicio de pecho', NULL, NULL, 2, 1),
(18, 'Remo con barra', 'Ejercicio de espalda', NULL, NULL, 3, 1),
(19, 'Curl de bíceps', 'Ejercicio de brazos', NULL, NULL, 4, 1),
(20, 'Press militar', 'Ejercicio de hombros', NULL, NULL, 5, 1),
(21, 'Peso muerto', 'Ejercicio de espalda baja', NULL, NULL, 6, 1),
(22, 'Elevaciones laterales', 'Ejercicio de hombros', NULL, NULL, 5, 1),
(23, 'Fondos en paralelas', 'Ejercicio de tríceps', NULL, NULL, 8, 1),
(24, 'Jalón al pecho', 'Ejercicio de espalda', NULL, NULL, 3, 1),
(25, 'Extensiones de tríceps', 'Ejercicio de brazos', NULL, NULL, 4, 1),
(26, 'Abdominales', 'Ejercicio de core', NULL, NULL, 7, 1),
(27, 'Prensa de piernas', 'Ejercicio de piernas', NULL, NULL, 1, 1),
(28, 'Curl femoral', 'Ejercicio de piernas', NULL, NULL, 9, 1),
(29, 'Remo sentado', 'Ejercicio de espalda', NULL, NULL, 3, 1),
(30, 'Plancha', 'Ejercicio de core', NULL, NULL, 7, 1)
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

-- Día 1
INSERT INTO rutina_ejercicio (id_rutina_ejercicio, id_rutina, id_ejercicio, dia, orden, series, peso, descanso, observacion) VALUES
(21, 3, 16, 1, 1, 4, 60, 90, 'Mantener control de la barra'),
(22, 3, 17, 1, 2, 4, 80, 120, ''),
(23, 3, 18, 1, 3, 3, 50, 60, NULL),
(24, 3, 19, 1, 4, 3, 40, 45, NULL),
(25, 3, 20, 1, 5, 3, 30, 30, 'Calentamiento');
-- Día 2
INSERT INTO rutina_ejercicio (id_rutina_ejercicio, id_rutina, id_ejercicio, dia, orden, series, peso, descanso, observacion) VALUES
(26, 3, 21, 2, 1, 4, 55, 60, NULL),
(27, 3, 22, 2, 2, 4, 45, 45, NULL),
(28, 3, 23, 2, 3, 4, 60, 90, NULL),
(29, 3, 24, 2, 4, 3, 35, 30, NULL),
(30, 3, 25, 2, 5, 3, 50, 60, NULL);
-- Día 3
INSERT INTO rutina_ejercicio (id_rutina_ejercicio, id_rutina, id_ejercicio, dia, orden, series, peso, descanso, observacion) VALUES
(31, 3, 26, 3, 1, 4, 55, 60, NULL),
(32, 3, 27, 3, 2, 4, 45, 45, NULL),
(33, 3, 28, 3, 3, 3, 65, 90, NULL),
(34, 3, 29, 3, 4, 4, 35, 30, NULL),
(35, 3, 30, 3, 5, 3, 50, 60, NULL);

-- ========================================
-- 5) Tablas de pago, boleta, clase, asistencia (opcional)
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

CREATE TABLE IF NOT EXISTS asistencia (
  id_asistencia SERIAL PRIMARY KEY,
  id_cliente    INTEGER NOT NULL REFERENCES cliente(id_cliente),
  id_clase      INTEGER NOT NULL REFERENCES clase(id_clase),
  fecha         DATE NOT NULL
);
