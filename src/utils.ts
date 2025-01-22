import bcrypt from 'bcrypt'
import { newUserEntry, updateUserEntry } from './types'

export async function encryptPwd (plainPassword: string): Promise<string> {
  const saltRounds = 10
  const hashedPassword = await bcrypt.hash(plainPassword, saltRounds)
  return hashedPassword
}

export async function verifyPassword (plainPassword: string, hashedPassword: string): Promise<boolean> {
  const isMatch = await bcrypt.compare(plainPassword, hashedPassword)
  return isMatch
}

const parseUserEntry = (object: any): string => {
  if (!isString(object)) {
    throw new Error('Incorrect entries')
  }

  return object
}

const isString = (string: string): boolean => {
  return typeof string === 'string'
}

const parseUserId = (object: any): number => {
  if (typeof object !== 'number' || isNaN(object)) {
    throw new Error('Incorrect entries')
  }
  return object
}

export function checkPostUserEntry (object: any): newUserEntry {
  const newEntry = {
    name: parseUserEntry(object.name),
    surname: parseUserEntry(object.surname),
    email: parseUserEntry(object.email.toLowerCase()),
    password: parseUserEntry(object.password)
  }

  return newEntry
}

export function checkPutUserEntry (object: any): updateUserEntry {
  const newEntry = {
    id: parseUserId(object.id),
    password: parseUserEntry(object.password),
    newEmail: object.newEmail === undefined ? undefined : parseUserEntry(object.newEmail.toLowerCase()),
    newPassword: object.newPassword === undefined ? undefined : parseUserEntry(object.newPassword)
  }

  return newEntry
}
