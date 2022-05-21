import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import { axios } from "../../../../utils/http";

export default async function(req: NextApiRequest, res: NextApiResponse) {
    const guildId = req.query.guildId as string
    const session = await getSession({ req })
    if (!session || typeof session.user.id !== "string") {
        res.status(401).json({
            message: "Not logged in"
        })
        return
    }
    const token = await axios.post(`/${guildId}/token/regenerate`, {}, {
        headers: {
            'x-dapi-id': session.user.id,
            'x-frontend-key': process.env.FRONTEND_AUTH!,
        }
    })
    res.status(token.status).send(token.data)
}