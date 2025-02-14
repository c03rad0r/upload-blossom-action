"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@actions/core");
const fs_1 = require("fs");
const ndk_1 = require("@nostr-dev-kit/ndk");
const blossom_client_sdk_1 = require("blossom-client-sdk");
// import {EventTemplate, SignedEvent} from "blossom-client-sdk";
console.log('Starting blossom Upload');
const secretKey = new TextEncoder().encode("5de4e082b712da4364685141aa06b7d0fec9b178e1246c74dc66bc3dc03e5e61");
// const privateKeySigner = new NSecSigner(secretKey)
async function upload(filePath, host) {
    const data = (0, fs_1.readFileSync)(filePath, 'utf-8');
    const blob = new Blob([data], { type: 'text/plain' });
    async function signer(event) {
        const signer = new ndk_1.NDKPrivateKeySigner(secretKey);
        const pubkey = await signer.user().then(u => u.pubkey);
        const signature = await signer.sign(event);
        const y = event;
        const x = { ...event, pubkey: pubkey, sig: signature, id: y.id };
        // return x;
        // const x : BlossomClient.SignedEvent = {
        //     content: "",
        //     created_at: 0,
        //     id: "",
        //     kind: 0,
        //     pubkey: "",
        //     sig: "",
        //     tags: []
        // }
        return x;
    }

    const client = new blossom_client_sdk_1.BlossomClient(host, signer);

    try {
        const uploadAuthEvent = await client.createUploadAuth(blob, 'Upload file');
        const result = await client.uploadBlob(blob, { auth: uploadAuthEvent });
        core_1.setOutput("blossom-hash", result.url);
        return result.url;
    } catch (error) {
        console.error("Blossom Upload failed with error", error);
        core_1.setFailed(error.message); // Set action as failed *within the function*
        throw error; // Re-throw the error to be caught by the outer try-catch
    }
}

try {
    // Fetch the value of the input 'who-to-greet' specified in action.yml
    const host = (0, core_1.getInput)('host');
    const filePath = (0, core_1.getInput)('filePath');
    console.log(`Uploading file ${filePath} to host: ${host}!`);
    upload(filePath, host)
        .then(blossomHash => {
            console.log("Blossom Hash:", blossomHash); // Log the hash!
            core_1.setOutput("blossom-hash", blossomHash); // Set the output
        })
        .catch((error) => { // Catch errors from upload()
            console.error("Blossom Upload failed with error", error);
            core_1.setFailed(error.message); // Set the action as failed *here*
        });

} catch (error) { // Catch errors from getInput() or other top-level errors
    console.error("Blossom Upload failed with error", error);
    core_1.setFailed(error.message); // Set the action as failed *here*
}
