import { PinataSDK } from "pinata-web3";
const TinyURL = require('tinyurl');

async function shortenUrl(longUrl: string): Promise<string> {
    try {
        const shortUrl = await TinyURL.shorten(longUrl);
        return shortUrl;
    } catch (error) {
        throw new Error(`Error shortening URL: ${error}`);
    }
}

export const pinata = new PinataSDK({
   pinataJwt: process.env.NEXT_PUBLIC_PINATA_JWT,
   pinataGateway: "example-gateway.mypinata.cloud",
});

export const shortUrlImage = async(url: string) => {
    const shortedUrl = await shortenUrl(url) 
    return shortedUrl;
}
