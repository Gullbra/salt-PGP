// Create express app
import express from "express";
import db from "./database.js";
import md5 from "md5";
import bodyParser from "body-parser";

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Server port
const HTTP_PORT = 8000;
// Start server
app.listen(HTTP_PORT, () => {
    console.log("Server running on port %PORT%".replace("%PORT%",HTTP_PORT))
});
// Root endpoint
app.get("/", (req, res, next) => {
    res.json({"message":"Ok"})
});

// Insert here other API endpoints

//Get all users endpoint
app.route("/api/user")
  .get((req, res, next) => {
      const sql = "select * from UserData";
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
  })
//Post a new user endpoint
  .post((req, res, next) => {
    console.log("Server")
    const errors=[];
    if (!req.body.password){
        errors.push("No password specified");
    }
    if (!req.body.email){
        errors.push("No email specified");
    }
    if (errors.length){
        res.status(400).json({"error":errors.join(",")});
        return;
    }
    const data = {
        role: req.body.role,
        email: req.body.email,
        password : md5(req.body.password)
    }
    const sql ='INSERT INTO UserData (id, email, password, role) VALUES (?,?,?,?)'
    const params =[data.email, data.password, data.role]
    db.run(sql, params, function (err, result) {
        if (err){
            res.status(400).json({"error": err.message})
            return;
        }
        res.json({
            "message": "success",
            "data": data,
            "id" : this.lastID
        })
    });
  })



app.route("/api/user/:id")
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
