import { Client } from "pg";

export const newClient = async () => {
  const martinsClient = new Client({
    user: "postgres",
    host: "localhost",
    database: "week_11_code_test_2",
    password: "E#gkP!bv",
    port: 5432
  })
  await martinsClient.connect()
  return martinsClient
}