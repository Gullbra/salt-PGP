import { NextApiRequest, NextApiResponse } from "next"

// called by <root_path>/api/<name_of_file>

export default (req:NextApiRequest, res:NextApiResponse) => {
  res.status(200).json({ text: 'Hello Man' })
}
