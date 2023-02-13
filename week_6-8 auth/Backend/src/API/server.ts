import express, { Application, Request, Response, 
  //NextFunction 
} from "express";

import db from "./database"
import md5 from "md5";
import cors from 'cors'

const app: Application = express();

app.use(cors())
app.use(express.json())

const HTTP_PORT:number = 8000;
const DOMAIN:string = `http://localhost:${HTTP_PORT}`

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
  // .post((req: Request, res: Response) => {
    
  //   const reqBody = req.body as {email: string, password: string, role: string} 
  //   const errors:string[] = [];
  //   if (!reqBody.email) errors.push("No email provided");
  //   if (!reqBody.password) errors.push("No password provided");
  //   if (!reqBody.role) errors.push("No role provided");
  //   // if (!reqBody.storeId) errors.push("No storeId provided");

  //   if (errors.length) return res.status(400).json({"error": errors.join(",")});

  //   const sql = 'INSERT INTO UserData (email, password, role, storeId) VALUES (?,?,?,?)'
  //   const paramArr = [
  //     reqBody.email,
  //     md5(reqBody.password),
  //     reqBody.role,
  //     //req.body.storeId
  //   ]
    
  //   return db.run(sql, paramArr, (err:(Error | null), result:string[]) => {
  //     if (err) return res.status(400).json({"error": err.message})

  //     return res.json({
  //         "message": "success",
  //         "data": {
  //           email: paramArr[0],
  //           hashedPW: paramArr[1],
  //           role: paramArr[2]
  //         },
  //         // "id" : this.lastID
  //     })
  //   });
  //   /*
  //   */
  // })

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
            "message":"success",
            "data":row
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
  });

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
  });

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