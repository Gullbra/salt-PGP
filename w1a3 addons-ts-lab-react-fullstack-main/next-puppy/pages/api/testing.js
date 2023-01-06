// posts.js

import clientPromise from "../../lib/mongodb";

export default async function handler(req, res) {
  const client = await clientPromise;
  const db = client.db("Puppy-pgp-lab-w1");
  switch (req.method) {
    case "POST":
      // let bodyObject = JSON.parse(req.body);
      // let myPost = await db.collection("posts").insertOne(bodyObject);
      // res.json(myPost.ops[0]);
      console.log("Not Implemented!!")
      res.status(404).json({ response: "Ain't that a kick in the head"})
      break;
    case "GET":
      const allPups = await db.collection("Puppies").find({}).toArray();
      console.log(allPups)
      res.status(200).json(allPups);
      break;
  }
}