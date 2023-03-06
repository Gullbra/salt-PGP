import express from "express";
import { routing } from "./routes";
import cors from 'cors'

const app = express();

app.use(cors())
app.use(express.json())
app.use('/', routing)

const ENV_PORT: number = Number(process.env.ENV_PORT) || 8000;
const ENV_DOMAIN: string = process.env.ENV_DOMAIN || `http://localhost:${ENV_PORT}`
app.listen(ENV_PORT, () => console.log(`Server listening to ${ENV_DOMAIN}`));
