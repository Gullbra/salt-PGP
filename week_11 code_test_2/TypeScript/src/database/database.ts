import { Client } from "pg";

export const martinsClient = new Client({
  user: "postgres",
  host: "localhost",
  database: "week_11_code_test_2",
  password: "E#gkP!bv",
  port: 5432
})

// const getUsersAsJson = (): Promise<IUserSQL[]> => fs.promises
//   .readFile("./database/mock/User_Mock_data.json")
//   .then(data => JSON.parse(data.toString()));


export function dbStartupCheck() {
  console.log("\n🎤 Checking db...")

  martinsClient
    .connect()
    .then(() => {
      console.log('✔ ...connected to postgres server')
      return martinsClient.query('SELECT 1 FROM flights_table, users_table')
        .then(() => console.log("✔ \"flights_table\" and \"users_table\" present!"))
        .catch(err => { throw err })
    })
    .catch((err) => console.error('❌ connection error:', err.message))
    .finally(() => {
      console.log("Shutting down connection")
      martinsClient.end()
    })
}






  // const getUsersAsJson = (): Promise<IUserSQL[]> => fs.promises
  // .readFile("./database/mock/User_Mock_data.json")
  // .then(data => JSON.parse(data.toString()));