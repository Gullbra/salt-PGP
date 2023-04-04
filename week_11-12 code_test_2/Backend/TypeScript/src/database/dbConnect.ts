import { Client } from "pg";
import path from "path";
import * as dotenv from 'dotenv'

dotenv.config({ path: path.join(__dirname, ".local.env") })
dotenv.config({ path: path.join(__dirname, ".env") })


export const newClient = async () => {
  console.log(`\nConnecting to ${process.env.DB_LOCAL ? "local" : "hosted"} database`)
  const martinsClient = new Client(
    process.env.DB_LOCAL
      ? process.env.ELEPHANT_SQL_CON
      : {
          user: process.env.PGADMIN_USER,
          host: process.env.PGADMIN_HOST,
          database: process.env.PGADMIN_DATABASE,
          password: process.env.PGADMIN_PWD,
          port: Number(process.env.PGADMIN_PORT)
        }
  )
    
  await martinsClient.connect()
  return martinsClient
}