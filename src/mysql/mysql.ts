import { Pool, createPool } from 'mysql2/promise'
import { newUserEntry, updateUserEntry, users } from '../types'
import { encryptPwd, verifyPassword } from '../utils'

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

export async function findAllUsers (): Promise<users[]> {
  const db = await connect()
  const [usersList]: users[] | any = await db.query('SELECT userId, name, surname, email, createDate FROM users;')
  return usersList as users[]
}

export async function findUser (id: number): Promise<users | null> {
  const db = await connect()
  const [rows] = await db.query('SELECT userId, name, surname, email, createDate FROM users WHERE userId = ?;', [id])
  const user = Array.isArray(rows) && rows.length > 0 ? rows[0] : null
  return user as users | null
}

export async function insertUser (newUserEntry: newUserEntry): Promise<any> {
  // Encriptamos contraseña
  const hashedPassword = await encryptPwd(newUserEntry.password)

  const db = await connect()
  const insertedUser = await db.query('INSERT INTO users (name, surname, email, password) VALUES (?, ?, ?, ?);', [newUserEntry.name, newUserEntry.surname, newUserEntry.email, hashedPassword])

  return insertedUser
}

export async function deleteUser (id: number): Promise<any> {
  const db = await connect()
  await db.query('DELETE FROM users WHERE userId = ?', [id])

  return 'User already deleted'
}

export async function updateUser (updateUserEntry: updateUserEntry): Promise<any> {
  try {
    const db = await connect()

    // Selecionamos la contraseña del usuario para verificarlo
    const [rows]: [any[], any] = await db.query('SELECT password FROM users WHERE userID = ?', [updateUserEntry.id])
    const userPassword = Array.isArray(rows) && rows.length > 0 ? rows[0] : null

    // Verificamos si la contraseña del usuario coincide
    const verifyUser: boolean = await verifyPassword(updateUserEntry.password, userPassword.password)

    if (!verifyUser) {
      return { error: 'Wrong password' }
    }

    if (updateUserEntry.newEmail !== undefined) {
      await db.query('UPDATE users SET email = ? WHERE userId = ?', [updateUserEntry.newEmail, updateUserEntry.id])
    }

    if (updateUserEntry.newPassword !== undefined) {
      // Encriptamos contraseña
      const hashedPassword = await encryptPwd(updateUserEntry.newPassword)
      await db.query('UPDATE users SET password = ? WHERE userId = ?', [hashedPassword, updateUserEntry.id])
    }

    if (updateUserEntry.newPassword === undefined && updateUserEntry.newEmail === undefined) {
      return { OK: 'Nothing was changes' }
    }

    return { OK: 'User successfully updated' }
  } catch (e) {
    throw new Error('Error updating user')
  }
}
