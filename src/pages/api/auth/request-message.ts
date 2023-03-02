// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { requestMessage } from '@src/helpers/auth'
import type { NextApiRequest, NextApiResponse } from 'next'
import Moralis from 'moralis';

type Data = {
    message: string
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    const { address, chain, network } = req.body
    await Moralis.start({ apiKey: process.env.MORALIS_API_KEY });
    const message = await requestMessage({ address, chain, network });
    res.status(200).json({ message })
}
