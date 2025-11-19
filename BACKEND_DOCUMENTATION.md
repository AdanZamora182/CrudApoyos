# Documentación del Backend - CrudApoyos

## Tabla de Contenidos

1. [Descripción General](#descripción-general)
2. [Tecnologías Utilizadas](#tecnologías-utilizadas)
3. [Arquitectura del Sistema](#arquitectura-del-sistema)
4. [Configuración de Base de Datos](#configuración-de-base-de-datos)
5. [Módulos del Sistema](#módulos-del-sistema)
6. [Entidades y Esquemas](#entidades-y-esquemas)
7. [API Endpoints](#api-endpoints)
8. [Relaciones entre Entidades](#relaciones-entre-entidades)
9. [Seguridad](#seguridad)
10. [Monitoreo de Salud](#monitoreo-de-salud)
11. [Comandos de Consola](#comandos-de-consola)
12. [Variables de Entorno](#variables-de-entorno)

---

## Descripción General

El backend de **CrudApoyos** es una API RESTful construida con **NestJS** que gestiona un sistema de apoyos sociales organizados por círculos. El sistema permite administrar cabezas de círculo, integrantes, apoyos entregados, usuarios del sistema y direcciones basadas en códigos postales de México.

### Características Principales

- Gestión completa de cabezas de círculo y sus integrantes
- Registro y seguimiento de apoyos entregados
- Sistema de autenticación con registro protegido por reCAPTCHA
- Búsqueda de direcciones por código postal (base de datos SEPOMEX)
- Exportación de datos a Excel
- Monitoreo automático de salud de base de datos
- Comandos de consola para administración de usuarios

---

## Tecnologías Utilizadas

### Framework y Lenguaje

- **NestJS**: Framework progresivo de Node.js para aplicaciones del lado del servidor
- **TypeScript**: Lenguaje de programación tipado

### Bases de Datos

- **MySQL**: Base de datos principal para entidades del negocio
- **MongoDB**: Base de datos para direcciones y códigos postales de México

### ORMs y ODMs

- **TypeORM**: Object-Relational Mapping para MySQL
- **Mongoose**: Object-Document Mapping para MongoDB

### Librerías Principales

- **bcrypt**: Hashing de contraseñas
- **ExcelJS**: Generación de archivos Excel
- **@nestjs/axios**: Cliente HTTP para consumir APIs externas
- **@nestjs/config**: Gestión de variables de entorno
- **nest-commander**: Comandos de consola CLI

### Seguridad

- **Google reCAPTCHA v2**: Protección contra bots en el registro de usuarios

---

## Arquitectura del Sistema

### Estructura Modular

El backend está organizado en módulos independientes siguiendo el patrón de arquitectura de NestJS:

```
backend/src/
├── apoyo/                  # Módulo de apoyos
├── cabeza-circulo/         # Módulo de cabezas de círculo
├── integrante-circulo/     # Módulo de integrantes
├── usuario/                # Módulo de usuarios y autenticación
├── direcciones/            # Módulo de direcciones (MongoDB)
├── database/               # Módulo de salud de base de datos
├── app.module.ts           # Módulo principal
├── main.ts                 # Punto de entrada de la aplicación
└── console.ts              # Punto de entrada para comandos CLI
```

### Patrón de Diseño

Cada módulo sigue el patrón **MVC adaptado a NestJS**:

- **Entity/Schema**: Define la estructura de datos
- **Service**: Contiene la lógica de negocio
- **Controller**: Maneja las peticiones HTTP y rutas
- **Module**: Configura y exporta el módulo

---

## Configuración de Base de Datos

### Conexión a MySQL

El sistema utiliza TypeORM con una configuración robusta de pool de conexiones:

```typescript
// Configuración en app.module.ts
TypeOrmModule.forRootAsync({
  type: 'mysql',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT, 10),
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  synchronize: false,
  logging: ['error', 'warn'],

  // Pool de conexiones optimizado
  extra: {
    connectionLimit: 10,
    waitForConnections: true,
    queueLimit: 0,
    connectTimeout: 60000,        // 60 segundos
    enableKeepAlive: true,
    keepAliveInitialDelay: 0,
    idleTimeoutMillis: 30000,     // 30 segundos
    maxLifetime: 1800000,         // 30 minutos
  }
})
```

### Conexión a MongoDB

Utilizada exclusivamente para el módulo de direcciones:

```typescript
// Configuración en app.module.ts
MongooseModule.forRootAsync({
  uri: process.env.MONGO_URI,
  dbName: 'direccionesBD',
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
})
```

### CORS

El servidor tiene CORS habilitado para el frontend en `http://localhost:5173`:

```typescript
// main.ts
app.enableCors({
  origin: 'http://localhost:5173',
  methods: 'GET,POST,PUT,DELETE',
  credentials: true,
});
```

---

## Módulos del Sistema

### 1. Módulo de Cabezas de Círculo (`cabeza-circulo`)

**Propósito**: Gestionar a los líderes de cada círculo de apoyo.

**Archivos**:
- `cabeza-circulo.entity.ts`: Entidad TypeORM
- `cabeza-circulo.service.ts`: Lógica de negocio
- `cabeza-circulo.controller.ts`: Endpoints HTTP
- `cabeza-circulo.module.ts`: Configuración del módulo

**Funcionalidades**:
- CRUD completo de cabezas de círculo
- Búsqueda por nombre, apellidos o clave de elector
- Exportación a Excel

---

### 2. Módulo de Integrantes de Círculo (`integrante-circulo`)

**Propósito**: Gestionar a los integrantes que pertenecen a un líder (cabeza de círculo).

**Archivos**:
- `integrante-circulo.entity.ts`: Entidad TypeORM con relación a CabezaCirculo
- `integrante-circulo.service.ts`: Lógica de negocio
- `integrante-circulo.controller.ts`: Endpoints HTTP
- `integrante-circulo.module.ts`: Configuración del módulo

**Funcionalidades**:
- CRUD completo de integrantes
- Relación ManyToOne con cabeza de círculo (líder)
- Búsqueda por nombre, apellidos o clave de elector
- Exportación a Excel con información del líder

---

### 3. Módulo de Apoyos (`apoyo`)

**Propósito**: Registrar y gestionar los apoyos entregados a cabezas de círculo o integrantes.

**Archivos**:
- `apoyo.entity.ts`: Entidad TypeORM con relaciones a CabezaCirculo e IntegranteCirculo
- `apoyo.service.ts`: Lógica de negocio
- `apoyo.controller.ts`: Endpoints HTTP
- `apoyo.module.ts`: Configuración del módulo

**Funcionalidades**:
- CRUD completo de apoyos
- Relación ManyToOne con IntegranteCirculo (persona)
- Relación ManyToOne con CabezaCirculo (cabeza)
- Exportación a Excel con información completa del beneficiario

---

### 4. Módulo de Usuarios (`usuario`)

**Propósito**: Gestionar usuarios del sistema con autenticación segura.

**Archivos**:
- `usuario.entity.ts`: Entidad TypeORM
- `usuario.service.ts`: Lógica de negocio con bcrypt y reCAPTCHA
- `usuario.controller.ts`: Endpoints de registro y login
- `usuario.command.ts`: Comandos CLI para gestión de usuarios
- `usuario.module.ts`: Configuración del módulo

**Funcionalidades**:
- Registro de usuarios con validación de reCAPTCHA
- Login con autenticación bcrypt
- Comandos CLI para gestión administrativa

---

### 5. Módulo de Direcciones (`direcciones`)

**Propósito**: Proporcionar búsqueda de colonias y municipios basados en códigos postales de México.

**Archivos**:
- `schemas/direccion.schema.ts`: Esquema de Mongoose (MongoDB)
- `direcciones.service.ts`: Lógica de negocio
- `direcciones.controller.ts`: Endpoints HTTP
- `direcciones.module.ts`: Configuración del módulo

**Funcionalidades**:
- Búsqueda de colonias por código postal
- Retorna municipio asociado al código postal
- Base de datos SEPOMEX completa

---

### 6. Módulo de Salud de Base de Datos (`database`)

**Propósito**: Monitorear y mantener la salud de la conexión a la base de datos MySQL.

**Archivos**:
- `database-health.service.ts`: Servicio de monitoreo con reconexión automática
- `database-health.controller.ts`: Endpoints de salud
- `database-health.module.ts`: Módulo global

**Funcionalidades**:
- Ping periódico cada 5 minutos a la base de datos
- Reconexión automática en caso de fallo
- Detección de errores de conexión
- Endpoints HTTP para verificar estado de salud

---

## Entidades y Esquemas

### CabezaCirculo (MySQL)

```typescript
@Entity('cabezas_Circulo')
export class CabezaCirculo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'Nombre' })
  nombre: string;

  @Column({ name: 'Apellido_Paterno' })
  apellidoPaterno: string;

  @Column({ name: 'Apellido_Materno' })
  apellidoMaterno: string;

  @Column({ name: 'Fecha_Nacimiento', type: 'date' })
  fechaNacimiento: Date;

  @Column({ name: 'Telefono', type: 'bigint' })
  telefono: number;

  @Column({ name: 'Calle' })
  calle: string;

  @Column({ name: 'No_Exterior', nullable: true })
  noExterior: number;

  @Column({ name: 'No_Interior' })
  noInterior: number;

  @Column({ name: 'Colonia' })
  colonia: string;

  @Column({ name: 'Codigo_Postal' })
  codigoPostal: number;

  @Column({ name: 'Municipio', nullable: true })
  municipio: string;

  @Column({ name: 'Clave_Elector', unique: true })
  claveElector: string;

  @Column({ name: 'Email' })
  email: string;

  @Column({ name: 'Facebook', nullable: true })
  facebook: string;

  @Column({ name: 'Otra_RedSocial', nullable: true })
  otraRedSocial: string;

  @Column({ name: 'Estructura_Territorial' })
  estructuraTerritorial: string;

  @Column({ name: 'Posicion_Estructura' })
  posicionEstructura: string;
}
```

**Campos clave**:
- `claveElector`: Identificador único electoral (UNIQUE)
- `estructuraTerritorial`: Categorización territorial
- `posicionEstructura`: Rol dentro de la estructura

---

### IntegranteCirculo (MySQL)

```typescript
@Entity('integrantes_Circulo')
export class IntegranteCirculo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'Nombre' })
  nombre: string;

  @Column({ name: 'Apellido_Paterno' })
  apellidoPaterno: string;

  @Column({ name: 'Apellido_Materno' })
  apellidoMaterno: string;

  @Column({ name: 'Fecha_Nacimiento', type: 'date' })
  fechaNacimiento: Date;

  @Column({ name: 'Calle' })
  calle: string;

  @Column({ name: 'No_Exterior', nullable: true })
  noExterior: number;

  @Column({ name: 'No_Interior', nullable: true })
  noInterior: number;

  @Column({ name: 'Colonia' })
  colonia: string;

  @Column({ name: 'Codigo_Postal', nullable: true })
  codigoPostal: number;

  @Column({ name: 'Municipio', nullable: true })
  municipio: string;

  @Column({ name: 'Clave_Elector', unique: true })
  claveElector: string;

  @Column({ name: 'Telefono', type: 'bigint' })
  telefono: number;

  @ManyToOne(() => CabezaCirculo, (cabezaCirculo) => cabezaCirculo.id, {
    nullable: true,
    onDelete: 'SET NULL'
  })
  @JoinColumn({ name: 'Lider_id' })
  lider: CabezaCirculo;
}
```

**Relaciones**:
- `lider`: Relación ManyToOne con CabezaCirculo
- `onDelete: 'SET NULL'`: Si se elimina el líder, el campo se establece a NULL

---

### Apoyo (MySQL)

```typescript
@Entity('apoyos')
export class Apoyo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'Cantidad', type: 'int' })
  cantidad: number;

  @Column({ name: 'Tipo_Apoyo', length: 150 })
  tipoApoyo: string;

  @Column({ name: 'Fecha_Entrega', type: 'date' })
  fechaEntrega: Date;

  @ManyToOne(() => IntegranteCirculo, (integrante) => integrante.id, {
    onDelete: 'CASCADE'
  })
  @JoinColumn({ name: 'Persona_id' })
  persona: IntegranteCirculo;

  @ManyToOne(() => CabezaCirculo, (cabeza) => cabeza.id, {
    onDelete: 'CASCADE'
  })
  @JoinColumn({ name: 'Cabeza_id' })
  cabeza: CabezaCirculo;
}
```

**Relaciones**:
- `persona`: Relación ManyToOne con IntegranteCirculo
- `cabeza`: Relación ManyToOne con CabezaCirculo
- `onDelete: 'CASCADE'`: Si se elimina el beneficiario, se eliminan sus apoyos

**Nota**: Un apoyo puede ser entregado a una cabeza de círculo O a un integrante, no ambos.

---

### Usuario (MySQL)

```typescript
@Entity('usuarios')
export class Usuario {
  @PrimaryColumn()
  id: number;

  @Column()
  nombre: string;

  @Column()
  apellidos: string;

  @Column({ nullable: true })
  correo: string;

  @Column()
  usuario: string;

  @Column()
  contraseña: string;  // Hasheada con bcrypt

  @Column()
  codigoUusuario: string;
}
```

**Seguridad**:
- Contraseña hasheada con bcrypt (10 salt rounds)
- Campo `codigoUusuario` requerido durante el registro

---

### Direccion (MongoDB)

```typescript
@Schema({ collection: 'direcciones' })
export class Direccion extends Document {
  @Prop({ required: true })
  d_codigo: number;          // Código postal

  @Prop({ required: true })
  d_asenta: string;          // Nombre del asentamiento/colonia

  @Prop({ required: true })
  d_tipo_asenta: string;     // Tipo de asentamiento

  @Prop({ required: true })
  D_mnpio: string;           // Municipio

  @Prop({ required: true })
  d_estado: string;          // Estado

  @Prop({ required: true })
  d_ciudad: string;          // Ciudad
}
```

**Base de datos**: SEPOMEX - Códigos postales de México

---

## API Endpoints

### Cabezas de Círculo

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `POST` | `/cabezas-circulo` | Crear nueva cabeza de círculo |
| `GET` | `/cabezas-circulo` | Obtener todas las cabezas de círculo |
| `GET` | `/cabezas-circulo/:id` | Obtener cabeza de círculo por ID |
| `GET` | `/cabezas-circulo/buscar?query=` | Buscar por nombre o clave de elector |
| `PUT` | `/cabezas-circulo/:id` | Actualizar cabeza de círculo |
| `DELETE` | `/cabezas-circulo/:id` | Eliminar cabeza de círculo |
| `GET` | `/cabezas-circulo/export/excel` | Exportar a Excel |

**Ejemplo de creación (POST)**:
```json
{
  "nombre": "Juan",
  "apellidoPaterno": "Pérez",
  "apellidoMaterno": "García",
  "fechaNacimiento": "1980-05-15",
  "telefono": 5512345678,
  "calle": "Av. Principal",
  "noExterior": 123,
  "noInterior": 4,
  "colonia": "Centro",
  "codigoPostal": 54000,
  "municipio": "Tlalnepantla",
  "claveElector": "ABCD123456H700",
  "email": "juan@example.com",
  "facebook": "juan.perez",
  "otraRedSocial": "@juanperez",
  "estructuraTerritorial": "Distrito 1",
  "posicionEstructura": "Coordinador"
}
```

---

### Integrantes de Círculo

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `POST` | `/integrantes-circulo` | Crear nuevo integrante |
| `GET` | `/integrantes-circulo` | Obtener todos los integrantes |
| `GET` | `/integrantes-circulo?query=` | Buscar por nombre o clave |
| `GET` | `/integrantes-circulo/:id` | Obtener integrante por ID |
| `PUT` | `/integrantes-circulo/:id` | Actualizar integrante |
| `DELETE` | `/integrantes-circulo/:id` | Eliminar integrante |
| `GET` | `/integrantes-circulo/export/excel` | Exportar a Excel |

**Ejemplo de creación (POST)**:
```json
{
  "nombre": "María",
  "apellidoPaterno": "López",
  "apellidoMaterno": "Martínez",
  "fechaNacimiento": "1990-08-20",
  "calle": "Calle Secundaria",
  "noExterior": 456,
  "colonia": "Jardines",
  "codigoPostal": 54050,
  "municipio": "Tlalnepantla",
  "claveElector": "LPMR900820M100",
  "telefono": 5598765432,
  "lider": { "id": 1 }
}
```

---

### Apoyos

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `POST` | `/apoyos` | Crear nuevo apoyo |
| `GET` | `/apoyos` | Obtener todos los apoyos (ordenados por más reciente) |
| `GET` | `/apoyos/:id` | Obtener apoyo por ID |
| `PUT` | `/apoyos/:id` | Actualizar apoyo |
| `DELETE` | `/apoyos/:id` | Eliminar apoyo |
| `GET` | `/apoyos/export/excel` | Exportar a Excel con datos del beneficiario |

**Ejemplo de creación para cabeza de círculo (POST)**:
```json
{
  "cantidad": 5,
  "tipoApoyo": "Despensa alimentaria",
  "fechaEntrega": "2024-01-15",
  "cabeza": { "id": 1 }
}
```

**Ejemplo de creación para integrante (POST)**:
```json
{
  "cantidad": 3,
  "tipoApoyo": "Material escolar",
  "fechaEntrega": "2024-01-15",
  "persona": { "id": 5 }
}
```

---

### Usuarios

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `POST` | `/usuarios/registro` | Registrar nuevo usuario (requiere reCAPTCHA) |
| `POST` | `/usuarios/login` | Iniciar sesión |

**Ejemplo de registro (POST /usuarios/registro)**:
```json
{
  "usuario": {
    "id": 1,
    "nombre": "Admin",
    "apellidos": "Sistema",
    "correo": "admin@example.com",
    "usuario": "admin",
    "contraseña": "password123",
    "codigoUusuario": "CODIGO_SECRETO"
  },
  "captchaToken": "03AGdBq26..."
}
```

**Ejemplo de login (POST /usuarios/login)**:
```json
{
  "usuario": "admin",
  "contraseña": "password123"
}
```

**Respuesta exitosa**:
```json
{
  "mensaje": "Inicio de sesión exitoso",
  "usuario": {
    "id": 1,
    "nombre": "Admin",
    "apellidos": "Sistema",
    "correo": "admin@example.com",
    "usuario": "admin"
  }
}
```

---

### Direcciones

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/direcciones` | Obtener todas las direcciones (límite: 100) |
| `GET` | `/direcciones/buscar?cp=54000` | Buscar colonias y municipio por código postal |

**Ejemplo de respuesta (GET /direcciones/buscar?cp=54000)**:
```json
{
  "colonias": [
    "Centro",
    "Jardines",
    "Las Arboledas",
    "San Javier"
  ],
  "municipio": "Tlalnepantla de Baz"
}
```

---

### Salud del Sistema

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/health` | Estado general del sistema |
| `GET` | `/health/database` | Estado específico de la base de datos MySQL |

**Ejemplo de respuesta (GET /health)**:
```json
{
  "status": "healthy",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "services": {
    "database": {
      "healthy": true,
      "status": "connected"
    }
  }
}
```

---

## Relaciones entre Entidades

### Diagrama de Relaciones

```
┌─────────────────┐
│  CabezaCirculo  │
└────────┬────────┘
         │
         │ 1
         │
         │
         │ N (ManyToOne, onDelete: SET NULL)
         │
┌────────▼────────┐              ┌──────────────┐
│IntegranteCirculo│              │    Apoyo     │
└────────┬────────┘              └──────┬───────┘
         │                              │
         │ N (ManyToOne, CASCADE)       │
         └──────────────┬───────────────┘
                        │ 1
                        │
                        │ N (ManyToOne, CASCADE)
                        │
                ┌───────▼────────┐
                │  CabezaCirculo │
                └────────────────┘
```

### Descripción de Relaciones

1. **CabezaCirculo ← IntegranteCirculo** (1:N)
   - Una cabeza de círculo puede tener múltiples integrantes
   - Campo: `lider` en IntegranteCirculo
   - Estrategia de eliminación: `SET NULL` (si se elimina la cabeza, el integrante permanece sin líder)

2. **IntegranteCirculo ← Apoyo** (1:N)
   - Un integrante puede recibir múltiples apoyos
   - Campo: `persona` en Apoyo
   - Estrategia de eliminación: `CASCADE` (si se elimina el integrante, se eliminan sus apoyos)

3. **CabezaCirculo ← Apoyo** (1:N)
   - Una cabeza de círculo puede recibir múltiples apoyos
   - Campo: `cabeza` en Apoyo
   - Estrategia de eliminación: `CASCADE` (si se elimina la cabeza, se eliminan sus apoyos)

**Nota importante**: En la entidad Apoyo, solo uno de los dos campos (`persona` o `cabeza`) debe estar poblado, nunca ambos.

---

## Seguridad

### Autenticación

- **Hashing de contraseñas**: bcrypt con 10 salt rounds
- **Protección contra bots**: Google reCAPTCHA v2 en el registro
- **Código de usuario**: Validación adicional durante el registro

### Validación de reCAPTCHA

El sistema valida el token de reCAPTCHA con Google antes de permitir el registro:

```typescript
// usuario.service.ts
private async validarCaptcha(token: string): Promise<void> {
  const secretKey = this.configService.get<string>('RECAPTCHA_SECRET_KEY');
  const url = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${token}`;

  const response = await lastValueFrom(this.httpService.post(url));
  if (!response.data.success) {
    throw new BadRequestException('Error en la validación de reCAPTCHA');
  }
}
```

### Validaciones

- Claves de elector únicas (UNIQUE constraint)
- Validación de formato de datos en controllers
- Manejo de errores con BadRequestException y NotFoundException

---

## Monitoreo de Salud

### Servicio de Salud de Base de Datos

El módulo `database-health` proporciona:

1. **Verificación inicial** al iniciar la aplicación
2. **Ping periódico** cada 5 minutos a MySQL
3. **Reconexión automática** en caso de pérdida de conexión
4. **Detección de errores** de conexión específicos

### Errores de Conexión Detectados

```typescript
const connectionErrors = [
  'ECONNRESET',
  'ECONNREFUSED',
  'ETIMEDOUT',
  'ENOTFOUND',
  'EPIPE',
  'PROTOCOL_CONNECTION_LOST',
  'ER_SERVER_SHUTDOWN',
];
```

### Proceso de Reconexión

1. Detecta error de conexión
2. Intenta reconectar automáticamente
3. Si falla, reinicializa el DataSource
4. Registra todos los intentos en los logs

### Logs

```
✅ Conexión a la base de datos MySQL saludable
⚠️ DataSource no está inicializado
🔄 Intentando reconectar a la base de datos...
❌ Fallo en la conexión a la base de datos
```

---

## Comandos de Consola

### Gestión de Usuarios

El sistema incluye comandos CLI para administrar usuarios sin acceso al frontend:

```bash
# Listar todos los usuarios
npm run console usuario listar

# Buscar un usuario específico
npm run console usuario buscar <nombre-usuario>

# Cambiar contraseña de un usuario
npm run console usuario cambiar-contraseña <nombre-usuario> <nueva-contraseña>
```

### Ejemplos

```bash
# Cambiar contraseña del administrador
npm run console usuario cambiar-contraseña admin NuevaContraseña123!

# Buscar información del usuario "admin"
npm run console usuario buscar admin

# Ver todos los usuarios del sistema
npm run console usuario listar
```

### Salida de Ejemplo

```
📋 Lista de usuarios:
────────────────────────────────────────────────────────────────────────────────
ID: 1 | Usuario: admin | Nombre: Admin Sistema | Email: admin@example.com
ID: 2 | Usuario: operador | Nombre: Juan Pérez | Email: juan@example.com
────────────────────────────────────────────────────────────────────────────────
```

---

## Variables de Entorno

El sistema requiere las siguientes variables de entorno en un archivo `.env`:

```bash
# Base de Datos MySQL
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASS=password
DB_NAME=crudapoyos

# Base de Datos MongoDB
MONGO_URI=mongodb://localhost:27017

# Seguridad
RECAPTCHA_SECRET_KEY=tu_clave_secreta_recaptcha
USER_CODE=codigo_secreto_para_registro

# Puerto del servidor
PORT=3000
```

### Descripción de Variables

- **DB_HOST**: Host de MySQL
- **DB_PORT**: Puerto de MySQL (por defecto 3306)
- **DB_USER**: Usuario de MySQL
- **DB_PASS**: Contraseña de MySQL
- **DB_NAME**: Nombre de la base de datos MySQL
- **MONGO_URI**: URI de conexión a MongoDB
- **RECAPTCHA_SECRET_KEY**: Clave secreta de Google reCAPTCHA v2
- **USER_CODE**: Código requerido para registrar nuevos usuarios

---

## Exportación a Excel

### Características

Todos los módulos principales (cabezas de círculo, integrantes, apoyos) incluyen funcionalidad de exportación a Excel con:

- **Encabezados estilizados** (fondo azul, texto blanco, negrita)
- **Bordes** en todas las celdas
- **Columnas con ancho automático** para mejor legibilidad
- **Formato de fechas** en español (dd/mm/yyyy)
- **Nombre de archivo con timestamp** (ejemplo: `apoyos-2024-01-15.xlsx`)

### Estructura de Exportación de Apoyos

El archivo Excel de apoyos incluye:
- Información del apoyo (cantidad, tipo, fecha)
- Tipo de beneficiario (Cabeza de Círculo o Integrante)
- Datos completos del beneficiario (nombre, dirección, contacto)

---

## Consideraciones de Producción

### Pool de Conexiones

- **Límite de conexiones**: 10 conexiones simultáneas
- **Timeout de conexión**: 60 segundos
- **Tiempo de vida máximo**: 30 minutos por conexión
- **Tiempo de inactividad**: 30 segundos antes de cerrar conexión

### Logging

- Solo se registran errores y advertencias en producción
- Los logs de éxito de queries están deshabilitados para rendimiento

### Sincronización de Esquema

- `synchronize: false` en producción
- Los cambios al esquema deben manejarse con migraciones manuales

---

## Conclusión

Este backend proporciona una API REST completa y robusta para gestionar un sistema de apoyos sociales organizados por círculos. Con características de seguridad, monitoreo automático, y herramientas de administración CLI, el sistema está diseñado para ser mantenible, escalable y confiable.

### Próximos Pasos Recomendados

1. Implementar autenticación con JWT
2. Agregar middleware de autorización basado en roles
3. Implementar migraciones de base de datos con TypeORM
4. Agregar tests unitarios y de integración
5. Configurar documentación automática con Swagger
6. Implementar rate limiting para proteger endpoints
7. Agregar validación de DTOs con class-validator
8. Configurar logging estructurado con Winston

---

**Documentación generada el**: 2024-11-19
**Versión del Backend**: NestJS 10.x
**Desarrollador**: AdanZamora182
