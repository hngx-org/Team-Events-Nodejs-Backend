import express, { Express } from 'express'
import cors from 'cors'
import { config } from 'dotenv'
config()
import index from './Routes/index'
import connectDB from './config/connect.db'

const app: Express = express()
app.use(cors({ origin: '*' }))
app.use(express.json())

connectDB()

app.use('/api', index)

const PORT: number = Number(process.env.PORT) || 8080

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
