import express, { Application, Request, Response, 
  //NextFunction 
} from "express";

import db from "./database"
import md5 from "md5";
import cors from 'cors'
import { RunResult } from "sqlite3";

const app: Application = express();

app.use(cors())
app.use(express.json())

const HTTP_PORT: number = 8000;
const DOMAIN: string = `http://localhost:${HTTP_PORT}`

app.listen(HTTP_PORT, () => console.log(`Server listening to ${DOMAIN}`));

app.route("/").get((_, res: Response) => res.json({"message":"Ok"}));

app.route("/api/users")
  .get((_, res: Response) => {
    const sql:string = `
      SELECT * 
      FROM user_data;
    `;
    const params:string[] = [];
    
    db.all(sql, params, (err, rows) => {
      if (err) return res.status(400).json({"error": err.message});
          
      return res.json({ "message": "success", "data": rows})
    })
  })
  .post((req: Request, res: Response) => {
    const newUserArr: (string | number)[] = []
    const errors: string[] = [];

    req.body.email ? newUserArr.push(req.body.email) : errors.push("No email provided");
    req.body.password ? newUserArr.push(md5(req.body.password)) : errors.push("No password provided");
    req.body.role ? newUserArr.push(req.body.role) : errors.push("No role provided");
    req.body.storeId ? newUserArr.push(req.body.storeId) : errors.push("No storeId provided");

    if (errors.length) return res.status(400).json({"error": errors.join(",")});

    const sql = `
      INSERT INTO user_data (email, password, role, store_id) 
      VALUES (?,?,?,?);
    `    
    return db.run(sql, newUserArr, function (this: RunResult, err:(Error | null)) {
      if (err) return res.status(400).json({"error": err.message})

      return res.json({
        "message": "success",
        "data": {
          userId: this.lastID,
          email: newUserArr[0],
          password: newUserArr[1],
          role: newUserArr[2],
          storeId: newUserArr[3]
        },
      })
    });
  })
  .patch((req: Request, res: Response) => {
    //db.run()
  })

app.route("/api/users/:userId")
  .get((req, res) => {
    const sql = `
      SELECT * 
      FROM user_data 
      WHERE user_id = ?;
    `;
    const params = [req.params.userId];
    db.get(sql, params, (err, row) => {
        if (err) return res.status(400).json({"error":err.message});

        return res.json({
            "message": "success",
            "data": row
        })
    });
  })
// //Patch a specific user
// .patch( (req, res, next) => {
//     const data = {
//         email: req.body.email,
//         password : req.body.password,
//         role : req.body.role,
//         storeId: req.body.storeId
//     }
//     db.run(
//         `UPDATE UserData set 
//           email = COALESCE(?,email), 
//           password = COALESCE(?,password)
//           role = COALESCE(?,role)
//           storeId = COALESCE(?,storeId)
//           WHERE id = ?`,
//         [data.email, data.password, data.role, data.storeId, req.params.id],
//         function (err, result) {
//             if (err){
//                 res.status(400).json({"error": res.message})
//                 return;
//             }
//             res.json({
//                 message: "success",
//                 data: data,
//                 changes: this.changes
//             })
//         });
// })
// .delete((req, res, next) => {
//   db.run(
//       'DELETE FROM UserData WHERE id = ?',
//       req.params.id,
//       function (err, result) {
//           if (err){
//               res.status(400).json({"error": res.message})
//               return;
//           }
//           res.json({"message":"deleted", changes: this.changes})
//       });
// })

app.route("/api/products")
  .get((req, res, next) => {
    const sql = `
      SELECT *
      FROM product_data;
    `;
    const params: string[] = [];

    db.all(sql, params, (err, rows) => {
      if (err) return res.status(400).json({"error":err.message});

      return res.json({
          "message":"success",
          "data":rows
      })
    });
  })
  .post((req: Request, res: Response) => {
    const newProductArr: (string | number)[] = []
    const errors: string[] = [];

    req.body.title ? newProductArr.push(req.body.title) : errors.push("No title provided");
    req.body.description ? newProductArr.push(req.body.description) : errors.push("No description provided");
    req.body.imageUrl ? newProductArr.push(req.body.imageUrl) : errors.push("No imageUrl provided");
    req.body.storeId ? newProductArr.push(req.body.storeId) : errors.push("No storeId provided");
    req.body.price ? newProductArr.push(req.body.price) : errors.push("No price provided");
    req.body.quantity ? newProductArr.push(req.body.quantity) : errors.push("No quantity provided");
    req.body.category ? newProductArr.push(req.body.category) : errors.push("No category provided");

    if (errors.length) return res.status(400).json({"error": errors.join(",")});

    const sql = `
      INSERT INTO product_data (title, description, image_url, store_id, price, quantity, category) 
      VALUES (?,?,?,?,?,?,?);
    `    
    return db.run(sql, newProductArr, function (this: RunResult, err:(Error | null)) {
      if (err) return res.status(400).json({"error": err.message})

      return res.json({
        "message": "success",
        "data": {
          productId: this.lastID,
          title: newProductArr[0],
          description: newProductArr[1],
          imageUrl: newProductArr[2],
          storeId: newProductArr[3],
          price: newProductArr[4],
          quantity: newProductArr[5],
          category: newProductArr[6]
        },
      })
    });
  })

app.route("/api/products/:productId")
  .get((req, res, next) => {
    const sql = `
      SELECT * 
      FROM product_data 
      WHERE product_id = ?;
    `;
    const params = [req.params.productId];
    db.get(sql, params, (err, row) => {
      if (err) return res.status(400).json({"error":err.message});

      return res.json({
          "message":"success",
          "data":row
      })
    });
  });

app.route("/api/stores")
  .get((req, res, next) => {
    const sql = `
      SELECT * 
      FROM store_data;
    `;
    const params: string[] = [];
    db.all(sql, params, (err, rows) => {
      if (err) return res.status(400).json({"error":err.message});

      return res.json({
          "message":"success",
          "data":rows
      })
    });
  })
  .post((req: Request, res: Response) => {
    const newStoreArr: (string | number)[] = []
    const errors: string[] = [];

    req.body.name ? newStoreArr.push(req.body.name) : errors.push("No name provided");

    if (errors.length) return res.status(400).json({"error": errors.join(",")});

    const sql = `
      INSERT INTO store_data (name) 
      VALUES (?);
    `    
    return db.run(sql, newStoreArr, function (this: RunResult, err:(Error | null)) {
      if (err) return res.status(400).json({"error": err.message})

      return res.json({
        "message": "success",
        "data": {
          storeId: this.lastID,
          name: newStoreArr[0],
        },
      })
    });
  })

app.route("/api/stores/:storeId")
  .get((req, res, next) => {
    const sql = `
      SELECT * 
      FROM store_data 
      WHERE store_id = ?  
    `;
    const params = [req.params.storeId];
    db.get(sql, params, (err, row) => {
        if (err) return res.status(400).json({"error":err.message});

        return res.json({
            "message":"success",
            "data":row
        })
    });
  });

app.route('*').all((_,res) => res.status(404).json({message: "These are not the droids you're looking for"}))