import { create } from 'ipfs-http-client'
import { Buffer } from 'buffer'

export const resolveIPFS = (url?: string) => {
  if (!url || !url.includes('ipfs://')) {
    return url;
  }
  return url.replace('ipfs://', 'https://gateway.ipfs.io/ipfs/');
};

export const cleanBaseUri = (url?: string, item?: string) => {
  if (!url || !item || !url.includes(item, (url.length - item.length)) ) {
    return url;
  }
  return url.replace(item, '');
};

export const ipfsClient = () => {

  const auth = 'Basic ' + Buffer.from(process.env.NEXT_PUBLIC_INFURA_PROJECT_ID + ':' + process.env.NEXT_PUBLIC_INFURA_KEY_SECRET).toString('base64')

  return create({
    host: 'ipfs.infura.io',
    port: 5001,
    protocol: 'https',
    headers: {
      authorization: auth,
    },
  })
}