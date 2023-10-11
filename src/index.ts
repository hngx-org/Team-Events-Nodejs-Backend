import express, { Express } from 'express'
import cors from 'cors'
import { config } from 'dotenv'
import swaggerUi from "swagger-ui-express"
config()
import index from './Routes/index'
const PORT: number = Number(process.env.PORT) || 8080;
import * as YAML from "yaml";
import swagger from '../swagger'

// Parse the API documentation file.
const swaggerDocument = YAML.parse(swagger);

import connectDB from './config/connect.db'

const app: Express = express()
app.use(cors({ origin: '*' }))
app.use(express.json())

connectDB()

app.use('/api', index);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));



const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})


export default server;
