// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { verifyMessage } from '@src/helpers/auth'
import Moralis from 'moralis';
import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
    authData: any;
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    const { message, signature, network } = req.body
    await Moralis.start({ apiKey: process.env.MORALIS_API_KEY });
    const { authData } = await verifyMessage({ message, signature, network });
    res.status(200).json({ authData })
}
