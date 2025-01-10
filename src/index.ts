import {getInput, setFailed, setOutput} from "@actions/core"
import { readFileSync } from 'fs';
import { BlossomClient } from "blossom-client-sdk";
import {NSecSigner} from "@nostrify/nostrify/_dist/NSecSigner";

console.log('Starting blossom Upload');

const secretKey: Uint8Array =new TextEncoder().encode("5de4e082b712da4364685141aa06b7d0fec9b178e1246c74dc66bc3dc03e5e61")
const privateKeySigner = new NSecSigner(secretKey)


async function upload(filePath: string, host:string): Promise<string>    {
    const data = readFileSync(filePath, 'utf-8');
    const blob = new Blob([data], {type: 'text/plain'});

    const client = new BlossomClient(host, (event) => privateKeySigner.signEvent(event));

    const uploadAuthEvent = await client.createUploadAuth(blob, 'Upload file')
    const result = await client.uploadBlob(blob, {auth: uploadAuthEvent})

    const url = result.url

    console.log(result)
    console.log(`Blob uploaded!, ${url}`);
    return url;
}

try {
    // Fetch the value of the input 'who-to-greet' specified in action.yml
    const host = getInput('host');
    const filePath = getInput('filePath');

    console.log(`Uploading file ${filePath} to host: ${host}!`);

    upload(filePath, host)
        .then(blossomHash => {
            setOutput("blossom-hash", blossomHash);
        })
        .catch((error) => {
            console.error("Blossom Upload failed with error", error);

            if(error instanceof Error) {
                setFailed(error.message);
            } else{
                setFailed("unexpected error");
            }
        })

} catch (error) {
    console.error("Blossom Upload failed with error", error);

    if(error instanceof Error) {
        setFailed(error.message);
    } else{
        setFailed("unexpected error");
    }

}