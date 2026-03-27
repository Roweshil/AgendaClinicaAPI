import dotenv from 'dotenv'
import { createClient } from "@libsql/client"

dotenv.config()

export const db = createClient({
  url: process.env.DB_URL,
  authToken: process.env.DB_TOKEN
})