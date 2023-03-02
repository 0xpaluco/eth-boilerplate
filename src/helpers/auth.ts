import Moralis from 'moralis';
import { EvmChain } from 'moralis/common-evm-utils';


interface RequestMessage {
    address: string;
    chain: string;
    network: 'evm'
}

interface VerifyMessage {
    network: 'evm'
    signature: string
    message: string
}

const config = {
    domain: process.env.APP_DOMAIN!,
    statement: 'Please sign this message to confirm your identity.',
    uri: process.env.NEXTAUTH_URL!,
    timeout: 120,
};

export async function requestMessage({ address, chain, network }: RequestMessage) {
    
    const data = {
        address,
        chain: EvmChain.create(chain).hex,
        network,
        ...config,
    };    
    
    const result = await Moralis.Auth.requestMessage(data);    
    const { message } = result.toJSON();
    return message;
}

export async function verifyMessage({ network, signature, message }: VerifyMessage) {
    
    const result = await Moralis.Auth.verify({
        network,
        signature,
        message,
    });

    const authData = result.toJSON();
   

    return { authData };
}