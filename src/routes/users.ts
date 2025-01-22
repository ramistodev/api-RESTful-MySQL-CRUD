import express from 'express'
import { findUser, insertUser, findAllUsers, deleteUser, updateUser } from '../mysql/mysql'
import { newUserEntry, updateUserEntry, users } from '../types'
import { checkPostUserEntry, checkPutUserEntry } from '../utils'

const router = express.Router()

router.get('/get/all', async (_, res) => {
  try {
    // Buscamos mediante una funcion todos los usuarios
    const usersList: users[] = await findAllUsers()

    res.send(usersList)
  } catch (e) {
    res.status(404).send({ error: 'Something goes wrong' })
  }
})

router.get('/get/:id', async (req, res) => {
  try {
    const userId = +req.params.id

    // Buscamos mediante una funcion de SQL el usuario por ID
    const user: users | null = await findUser(userId)

    // Si existe un usuario se muestra, si no da error
    if (user != null) {
      res.send(user)
    } else {
      res.status(404).send({ error: 'User not found' })
    }
  } catch (e) {
    res.status(404).send({ error: 'Something goes wrong' })
  }
})

router.post('/post/user/', async (req, res) => {
  try {
    // Analizamos si los datos introducidos son validos
    const newUserEntry: newUserEntry = checkPostUserEntry(req.body)

    // Mediante una funcion de SQL metemos el usuario a la base de datos
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

router.delete('/delete/user/:id', async (req, res) => {
  try {
    const userId = +req.params.id

    // Buscamos si el usuario existe
    const userToDelete: users | null = await findUser(userId)

    // Si existe lo podemos eliminar
    if (userToDelete != null) {
      const deleteUserFromId: any = await deleteUser(userId)

      res.send(deleteUserFromId)
    } else {
      res.status(404).send({ error: 'User not found' })
    }
  } catch (e) {
    res.status(404).send({ error: 'Something goes wrong' })
  }
})

router.put('/put/user/', async (req, res) => {
  try {
    // Analizamos si los datos introducidos son validos
    const updateUserEntry: updateUserEntry = checkPutUserEntry(req.body)
    const userToUpdate: users | null = await findUser(updateUserEntry.id)

    if (userToUpdate != null) {
      const updateUserFromId = await updateUser(updateUserEntry)
      res.send(updateUserFromId)
    } else {
      res.status(404).send({ error: 'User not found' })
    }
  } catch (e) {
    res.status(404).send({ error: 'Something goes wrong' })
  }
})

export default router
