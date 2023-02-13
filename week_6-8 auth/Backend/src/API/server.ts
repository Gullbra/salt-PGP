import express, { Application, 
  Request, 
  Response, 
  //NextFunction 
} from "express";

import db from "./database.js"
import md5 from "md5";
import bodyParser from "body-parser";
import cors from 'cors'

const app: Application = express();

app.use(cors())
//app.use(express.json())
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const HTTP_PORT:number = 8000;
const DOMAIN:string = `http://localhost:${HTTP_PORT}`

app.listen(HTTP_PORT, () => console.log(`Server listening to ${DOMAIN}`));

app.route("/")
  .get((_, res: Response) => res.json({"message":"Ok"}));



app.route("/api/users")
  .get((_, res: Response) => {
    const sql:string = "SELECT * FROM UserData";
    const params:string[] = [];
    
    res.send("hey")
    db.all(sql, params, (err, rows) => {
      if (err) return res.status(400).json({"error": err.message});
          
      return res.json({ "message": "success", "data": rows})
    })
  })
  .post((req: Request, res: Response) => {
    
    const reqBody = req.body as {email: string, password: string, role: string} 
    const errors:string[] = [];
    if (!reqBody.email) errors.push("No email provided");
    if (!reqBody.password) errors.push("No password provided");
    if (!reqBody.role) errors.push("No role provided");
    // if (!reqBody.storeId) errors.push("No storeId provided");

    if (errors.length) return res.status(400).json({"error": errors.join(",")});

    const sql = 'INSERT INTO UserData (email, password, role, storeId) VALUES (?,?,?,?)'
    const paramArr = [
      reqBody.email,
      md5(reqBody.password),
      reqBody.role,
      //req.body.storeId
    ]
    
    return db.run(sql, paramArr, (err:(Error | null), result:string[]) => {
      if (err) return res.status(400).json({"error": err.message})

      return res.json({
          "message": "success",
          "data": {
            email: paramArr[0],
            hashedPW: paramArr[1],
            role: paramArr[2]
          },
          // "id" : this.lastID
      })
    });
    /*
    */
  })

/*


app.route("/api/users/:id")
  //Get specific user by id endpoint
  .get((req, res, next) => {
      const sql = "select * from UserData where id = ?";
      const params = [req.params.id];
      db.get(sql, params, (err, row) => {
          if (err) {
              res.status(400).json({"error":err.message});
              return;
          }
          res.json({
              "message":"success",
              "data":row
          })
      });
  })
  //Patch a specific user
  .patch( (req, res, next) => {
      const data = {
          email: req.body.email,
          password : req.body.password,
          role : req.body.role,
          storeId: req.body.storeId
      }
      db.run(
          `UPDATE UserData set 
            email = COALESCE(?,email), 
            password = COALESCE(?,password)
            role = COALESCE(?,role)
            storeId = COALESCE(?,storeId)
            WHERE id = ?`,
          [data.email, data.password, data.role, data.storeId, req.params.id],
          function (err, result) {
              if (err){
                  res.status(400).json({"error": res.message})
                  return;
              }
              res.json({
                  message: "success",
                  data: data,
                  changes: this.changes
              })
          });
  })
  .delete((req, res, next) => {
    db.run(
        'DELETE FROM UserData WHERE id = ?',
        req.params.id,
        function (err, result) {
            if (err){
                res.status(400).json({"error": res.message})
                return;
            }
            res.json({"message":"deleted", changes: this.changes})
        });
  })




//Get all products endpoint
app.get("/api/products", (req, res, next) => {
    const sql = "select * from ProductData";
    const params = [];
    db.all(sql, params, (err, rows) => {
        if (err) {
            res.status(400).json({"error":err.message});
            return;
        }
        res.json({
            "message":"success",
            "data":rows
        })
    });
});

//Get specific product by id endpoint
app.get("/api/products/:id", (req, res, next) => {
    const sql = "select * from ProductData where id = ?";
    const params = [req.params.id];
    db.get(sql, params, (err, row) => {
        if (err) {
            res.status(400).json({"error":err.message});
            return;
        }
        res.json({
            "message":"success",
            "data":row
        })
    });
});

//get all stores by id
app.get("/api/store", (req, res, next) => {
  const sql = "select * from StoreData";
  const params = [];
  db.all(sql, params, (err, rows) => {
      if (err) {
          res.status(400).json({"error":err.message});
          return;
      }
      res.json({
          "message":"success",
          "data":rows
      })
  });
});

//get specific store by id
app.get("/api/store/:id", (req, res, next) => {
    const sql = "select * from StoreData where id = ?";
    const params = [req.params.id];
    db.get(sql, params, (err, row) => {
        if (err) {
            res.status(400).json({"error":err.message});
            return;
        }
        res.json({
            "message":"success",
            "data":row
        })
    });
});


//get all with storeId :something

// Default response for any other request
app.use(function(req, res){
    res.status(404);
});

*/