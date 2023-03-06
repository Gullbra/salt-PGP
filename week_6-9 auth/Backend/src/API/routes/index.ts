import { Request, Response, Router } from "express";
import './auth/middleware'
import { router as authRoutes } from "./auth/authRoutes";
// import { router as routes } from "./public";
import { router as secureRoutes } from "./secure";

export const routing = Router()

routing.use(
  authRoutes,
  //routes, 
  secureRoutes
);


// Enables handling error by passing them down in Next(err) errors.
routing.use(
  function(
    err: Error & { status: number }, 
    _: Request, 
    res: Response
  ) {
    res.status(err.status || 500).json({ error: err });
  }
);
