import { Client } from "pg";
import path from "path";
import * as dotenv from 'dotenv'

dotenv.config({ path: path.join(__dirname, ".env") })

export const newClient = async () => {

  // * Local pgAdmin
  // const martinsClient = new Client({
  //   user: "postgres",
  //   host: "localhost",
  //   database: "week_11_code_test_2",
  //   password: "E#gkP!bv",
  //   port: 5432
  // })

  const martinsClient = new Client(process.env.ELEPHANT_SQL_CON)
  await martinsClient.connect()

  return martinsClient
}