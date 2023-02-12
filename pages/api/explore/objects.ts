// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import data from "@/assets/compositex-backup-20230212.json"
import type { NextApiRequest, NextApiResponse } from "next"

type ExploreObject = any

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ExploreObject | ExploreObject[]>
) {
  res.status(200).json(data)
}
