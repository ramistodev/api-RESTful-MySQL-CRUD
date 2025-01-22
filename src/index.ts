import express from 'express'
import morgan from 'morgan'
import usersRoute from './routes/users'

const app = express()
app.use(express.json())

// MiddleWare
app.use(morgan('dev'))

const PORT = 3000

app.get('/', (_req, res) => {
  res.send('Todo OKAY')
})

app.use('/api/', usersRoute)

app.listen(PORT, () => {
  console.log(`Server Running On Port: ${PORT}`)
  console.log(`http://localhost:${PORT}`)
})
