
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
