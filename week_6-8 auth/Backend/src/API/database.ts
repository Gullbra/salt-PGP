import pkg from 'sqlite3';
import path from 'path';
const {verbose} = pkg;
const sqlite3 = verbose();
import fs from "fs";
import { IProductsSQL, IStoreSQL, IUserSQL } from '../interfaces/interfaces';

const DBSOURCE = path.join("@root", "database", "db.sqlite")

const getUsersAsJson = (): Promise<IUserSQL[]> => fs.promises
  .readFile("@root/database/mock/User_Mock_data.json")
  .then(data => JSON.parse(data.toString()));

const getStoresAsJson = (): Promise<IStoreSQL[]> => fs.promises
  .readFile("@root/database/mock/Store_Mock_data.json")
  .then(data => JSON.parse(data.toString()));

const getProductsAsJson = (): Promise<IProductsSQL[]> => fs.promises
  .readFile("@root/database/mock/Products_Mock_data.json")
  .then(data => JSON.parse(data.toString()))

let db = new sqlite3.Database(DBSOURCE, (err) => {
  if (err) throw err; console.log(`\nConnected to SQLite database at \"${DBSOURCE}\"`);

  db.run(
    `CREATE TABLE user_data (
      user_id INTEGER PRIMARY KEY AUTOINCREMENT,
      email VARCHAR(50),
      password VARCHAR(50),
      role VARCHAR(11),
      store_id INT
    );`, 
    err => {
      if (err) return console.log ('Already User-table there');

      getUsersAsJson().then(users => {
        users.map((newUser) => db.run(
          `INSERT INTO user_data (user_id, email, password, role, store_id) 
          VALUES (?,?,?,?,?)`, 
          [newUser.user_id, newUser.email, newUser.password, newUser.role, newUser.store_id]
        ))
        console.log(`${users.length} User(s) created`);
      })
    }
  )
  db.run(
    `CREATE TABLE store_data (
      store_id INTEGER PRIMARY KEY AUTOINCREMENT,
      name VARCHAR(50)
    );`, 
    err => {
      if (err) return console.log('Already Store-table there');

      getStoresAsJson().then(stores => {
        stores.map((newStore) => db.run(
          `INSERT INTO store_data (store_id, name) 
          VALUES (?,?)`, 
          [newStore.store_id, newStore.name]
        ))
        console.log(`${stores.length} Store(s) created`);
      })
    }
  )
  db.run(
    `CREATE TABLE product_data (
      product_id INTEGER PRIMARY KEY AUTOINCREMENT, 
      title VARCHAR(50), 
      description TEXT, 
      image_url VARCHAR(50),
      store_id INT, 
      price VARCHAR(50), 
      quantity INT, 
      category VARCHAR(50)
    );`, 
    err => {
      if (err) return console.log('Already Product-table there');

      getProductsAsJson().then(products => {
        products.map((newProduct) => db.run(
          `INSERT INTO product_data (
            product_id, 
            title, 
            description, 
            image_url, 
            store_id, 
            price, 
            quantity, 
            category
          ) 
          VALUES (?,?,?,?,?,?,?,?)`, 
          [
            newProduct.product_id, 
            newProduct.title, 
            newProduct.description, 
            newProduct.image_url, 
            newProduct.store_id, 
            newProduct.price, 
            newProduct.quantity, 
            newProduct.category
          ]
        ))
        console.log(`${products.length} Products(s) created`);
      })
    }
  )
});

// ** Close connection:
// db.close

// ** Database vars:
// sqlite3.OPEN_CREATE; sqlite3.OPEN_READWRITE; sqlite3.OPEN_READONLY

export default db;