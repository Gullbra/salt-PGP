import express from 'express';
import { Request, Response, Application } from 'express';
import { Db } from '../db/db'

const PuppyDb = new Db(5)
const app: Application = express();
app.use(express.json())

app
  .route('/api/puppies')
  .get((_req: Request, res: Response) => {
    return res.status(200).json({ result: PuppyDb.getAll() });
  })
  .post((_req: Request, res: Response) => {
    try {
      res.status(201).json({ result: PuppyDb.addPuppy({..._req.body}) })
    } catch(err) {
      res.status(502).send({ error: err.message })
    }
  })

app
  .route('/api/puppies/:id')
  .get((_req: Request, res: Response) => {
    try {
      res.status(200).json({ result : PuppyDb.getByID(Number(_req.params.id) )})
    } catch(err) {
      res.status(404).json({ error: err.message })
    }
  })
  .put((_req: Request, res: Response) => {
    try {
      res.status(201).json({ result: PuppyDb.editPuppyById(Number(_req.params.id), {..._req.body}) })
    } catch(err) {
      res.status(502).send({ error: err.message })
    }
  })
  .delete((_req: Request, res: Response) => {
    try {
      res.status(201).json({ result: PuppyDb.deletePuppyById(Number(_req.params.id)) })
    } catch(err) {
      res.status(502).send({ error: err.message })
    }
  })

export default app;
