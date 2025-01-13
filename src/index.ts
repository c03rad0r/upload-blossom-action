import {getInput, setFailed, setOutput} from "@actions/core"
import { readFileSync } from 'fs';
import {NDKPrivateKeySigner, NostrEvent} from "@nostr-dev-kit/ndk";
import {BlossomClient, EventTemplate} from "blossom-client-sdk";
import {SignedEvent} from "blossom-client-sdk";
import mime from "mime";
// import {EventTemplate, SignedEvent} from "blossom-client-sdk";

console.log('Starting blossom Upload');

// const secretKey: Uint8Array = new TextEncoder().encode("5de4e082b712da4364685141aa06b7d0fec9b178e1246c74dc66bc3dc03e5e61")
// const privateKeySigner = new NSecSigner(secretKey)


async function upload(filePath: string, host: string): Promise<string> {
    const data = readFileSync(filePath, 'utf-8');

    const fileType = mime.getType(filePath);
    const blob = new Blob([data], {type: fileType?.toString()});

    async function signer(event: EventTemplate): Promise<SignedEvent> {

        const signer = new NDKPrivateKeySigner("5de4e082b712da4364685141aa06b7d0fec9b178e1246c74dc66bc3dc03e5e61");
        const pubkey = await signer.user().then(u => u.pubkey)

        const signature =  await signer.sign(event as NostrEvent);

        const y = event as NostrEvent
        const x: SignedEvent = { ...event, pubkey: pubkey, sig: signature, id: y.id! };

        return x;
    }

    const client = new BlossomClient(host, signer);
    //
    const uploadAuthEvent = await client.createUploadAuth(blob, 'Upload file')

    const result = await client.uploadBlob(blob, {auth: uploadAuthEvent})
    //
    const url = result.url
    //
    // console.log(result)
    console.log(`Blob uploaded!, ${url}`);
    return url;
}

try {
    // Fetch the value of the input 'who-to-greet' specified in action.yml
    const host = getInput('host');
    const filePath = getInput('filePath');

    console.log(`Uploading file '${filePath}' to host: '${host}'!`);

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