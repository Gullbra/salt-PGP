import { RequestHandler } from "express"

export const validateUserMiddleware: RequestHandler = (req, res, next) => {
  if (!req.body.email) 
    return res.status(401).json({error: "No email/username provided"})

  if (!req.body.password) 
    return res.status(401).json({error: "No password provided"})

  return validateUser(req.body.email, req.body.password)
    ? res.status(401).json({error: "Validation failed"})
    : next()
}

export const validateUser = (email: string, password: string) => {
  return true
}