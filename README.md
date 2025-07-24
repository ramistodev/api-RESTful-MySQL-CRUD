# 🚀 API RESTful MySQL CRUD

Una API RESTful moderna construida con Node.js, TypeScript, Express y MySQL para gestión completa de usuarios con operaciones CRUD, autenticación segura y validación de datos.

## ✨ Características

- 🔐 **Autenticación segura** con encriptación bcrypt
- 📝 **Operaciones CRUD completas** para usuarios
- 🛡️ **Validación de datos** con TypeScript
- 🗄️ **Conexión a MySQL** con pool de conexiones
- 📊 **Logging de requests** con Morgan
- 🏗️ **Arquitectura modular** y escalable
- 🔍 **Linting con ts-standard**

## 🛠️ Stack Tecnológico

- **Runtime:** Node.js
- **Lenguaje:** TypeScript
- **Framework:** Express.js
- **Base de datos:** MySQL
- **Seguridad:** bcrypt para hash de contraseñas
- **Logging:** Morgan
- **Desarrollo:** ts-node-dev para hot reload

## 📋 Prerequisitos

- Node.js (v14 o superior)
- MySQL (v5.7 o superior)
- npm o yarn

## ⚡ Instalación Rápida

```bash
# Clonar el repositorio
git clone https://github.com/ramistodev/api-RESTful-MySQL-CRUD.git
cd api-RESTful-MySQL-CRUD

# Instalar dependencias
npm install

# Configurar base de datos (ver sección de configuración)
# Ejecutar en modo desarrollo
npm run dev
```

## 🗄️ Configuración de Base de Datos

### Crear la base de datos y tabla

```sql
CREATE DATABASE `mysql-table`;
USE `mysql-table`;

CREATE TABLE `users` (
  `userId` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `surname` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL UNIQUE,
  `password` varchar(255) NOT NULL,
  `createDate` timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`userId`)
);
```

### Configurar conexión

Actualiza los datos de conexión en `src/mysql/mysql.ts`:

```typescript
export async function connect (): Promise<Pool> {
  const connection = createPool({
    host: 'localhost',        // Tu host de MySQL
    user: 'tu_usuario',       // Tu usuario de MySQL
    password: 'tu_password',  // Tu contraseña de MySQL
    database: 'mysql-table', // Nombre de tu base de datos
    connectionLimit: 10,
    waitForConnections: true,
    queueLimit: 0
  })

  return connection
}
```

## 🚀 Scripts Disponibles

```bash
# Desarrollo con hot reload
npm run dev

# Compilar TypeScript
npm run tsc

# Linting
npm run lint
```

## 📡 Endpoints de la API

### Base URL
```
http://localhost:3000/api
```

### 👥 Usuarios

#### Obtener todos los usuarios
```http
GET /api/get/all
```

**Respuesta:**
```json
[
  {
    "userId": 1,
    "name": "Juan",
    "surname": "Pérez",
    "email": "juan@email.com",
    "createDate": "2024-01-15T10:30:00.000Z"
  }
]
```

#### Obtener usuario por ID
```http
GET /api/get/:id
```

**Ejemplo:**
```bash
curl http://localhost:3000/api/get/1
```

#### Crear nuevo usuario
```http
POST /api/post/user/
Content-Type: application/json

{
  "name": "María",
  "surname": "García",
  "email": "maria@email.com",
  "password": "miPassword123"
}
```

#### Actualizar usuario
```http
PUT /api/put/user/
Content-Type: application/json

{
  "id": 1,
  "password": "passwordActual",
  "newEmail": "nuevo@email.com",
  "newPassword": "nuevoPassword123"
}
```

#### Eliminar usuario
```http
DELETE /api/delete/user/:id
```

## 🏗️ Arquitectura del Código

### Estructura de Archivos

```
src/
├── index.ts           # Servidor principal
├── routes/
│   └── users.ts       # Rutas de usuarios
├── mysql/
│   └── mysql.ts       # Conexión y consultas DB
├── controllers/
│   └── users.ts       # Controladores (no utilizado)
├── types.d.ts         # Definiciones TypeScript
└── utils.ts           # Utilidades y validaciones
```

### 🔐 Sistema de Encriptación de Contraseñas

El sistema utiliza bcrypt para el hash seguro de contraseñas:

```typescript
// Función para encriptar contraseñas
export async function encryptPwd (plainPassword: string): Promise<string> {
  const saltRounds = 10
  const hashedPassword = await bcrypt.hash(plainPassword, saltRounds)
  return hashedPassword
}

// Función para verificar contraseñas
export async function verifyPassword (plainPassword: string, hashedPassword: string): Promise<boolean> {
  const isMatch = await bcrypt.compare(plainPassword, hashedPassword)
  return isMatch
}
```

### 🗄️ Operaciones de Base de Datos

#### Conexión con Pool

```typescript
export async function connect (): Promise<Pool> {
  const connection = createPool({
    host: 'localhost',
    user: 'username',
    password: 'password',
    database: 'mysql-table',
    connectionLimit: 10,
    waitForConnections: true,
    queueLimit: 0
  })

  return connection
}
```

#### Operación de Inserción

```typescript
export async function insertUser (newUserEntry: newUserEntry): Promise<any> {
  // Encriptamos contraseña
  const hashedPassword = await encryptPwd(newUserEntry.password)

  const db = await connect()
  const insertedUser = await db.query(
    'INSERT INTO users (name, surname, email, password) VALUES (?, ?, ?, ?);',
    [newUserEntry.name, newUserEntry.surname, newUserEntry.email, hashedPassword]
  )

  return insertedUser
}
```

### 📝 Validación de Datos

#### Tipos TypeScript

```typescript
export interface users {
  userId: number
  name: string
  surname: string
  email: string
  createDate: string
}

export interface newUserEntry {
  name: string
  surname: string
  email: string
  password: string
}

export interface updateUserEntry {
  id: number
  password: string
  newEmail?: string | undefined
  newPassword?: string | undefined
}
```

#### Función de Validación

```typescript
export function checkPostUserEntry (object: any): newUserEntry {
  const newEntry = {
    name: parseUserEntry(object.name),
    surname: parseUserEntry(object.surname),
    email: parseUserEntry(object.email.toLowerCase()),
    password: parseUserEntry(object.password)
  }

  return newEntry
}
```

### 🛣️ Sistema de Rutas

```typescript
const router = express.Router()

// Obtener todos los usuarios
router.get('/get/all', async (_, res) => {
  try {
    const usersList: users[] = await findAllUsers()
    res.send(usersList)
  } catch (e) {
    res.status(404).send({ error: 'Something goes wrong' })
  }
})

// Crear nuevo usuario
router.post('/post/user/', async (req, res) => {
  try {
    const newUserEntry: newUserEntry = checkPostUserEntry(req.body)
    const result = await insertUser(newUserEntry)
    const newUser: users | null = await findUser(result[0].insertId)
    
    if (newUser != null) {
      res.send(newUser)
    } else {
      res.status(404).send({ error: 'User not found' })
    }
  } catch (e) {
    res.status(404).send({ error: 'Something goes wrong' })
  }
})
```

## 🧪 Ejemplos de Uso

### Crear un usuario

```bash
curl -X POST http://localhost:3000/api/post/user/ \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Carlos",
    "surname": "Rodriguez",
    "email": "carlos@email.com",
    "password": "miPassword123"
  }'
```

### Actualizar email de usuario

```bash
curl -X PUT http://localhost:3000/api/put/user/ \
  -H "Content-Type: application/json" \
  -d '{
    "id": 1,
    "password": "passwordActual",
    "newEmail": "nuevoemail@email.com"
  }'
```

### Eliminar usuario

```bash
curl -X DELETE http://localhost:3000/api/delete/user/1
```

## 🔧 Configuración de Desarrollo

### Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto:

```env
DB_HOST=localhost
DB_USER=tu_usuario
DB_PASSWORD=tu_password
DB_NAME=mysql-table
PORT=3000
```

### Hot Reload

El proyecto utiliza `ts-node-dev` para recarga automática durante el desarrollo:

```bash
npm run dev
```

## 🐛 Manejo de Errores

La API incluye manejo centralizado de errores con respuestas consistentes:

```typescript
// Ejemplo de manejo de errores
try {
  const user: users | null = await findUser(userId)
  if (user != null) {
    res.send(user)
  } else {
    res.status(404).send({ error: 'User not found' })
  }
} catch (e) {
  res.status(404).send({ error: 'Something goes wrong' })
}
```

## 🔒 Seguridad

- **Contraseñas hasheadas** con bcrypt y salt rounds = 10
- **Validación de entrada** para prevenir inyección SQL
- **Preparación de consultas** SQL para evitar ataques
- **Verificación de contraseñas** antes de actualizaciones

## 📝 Licencia

ISC License

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 👨‍💻 Autor

**ramistodev** - [GitHub Profile](https://github.com/ramistodev)

---

⭐ ¡No olvides darle una estrella al proyecto si te fue útil!