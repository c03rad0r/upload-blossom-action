"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@actions/core");
const fs_1 = require("fs");
const NSecSigner_1 = require("@nostrify/nostrify/_dist/NSecSigner");
const client_1 = require("blossom-client-sdk/lib/client");
console.log('Starting blossom Upload');
const secretKey = new TextEncoder().encode("5de4e082b712da4364685141aa06b7d0fec9b178e1246c74dc66bc3dc03e5e61");
const privateKeySigner = new NSecSigner_1.NSecSigner(secretKey);
async function upload(filePath, host) {
    const data = (0, fs_1.readFileSync)(filePath, 'utf-8');
    const blob = new Blob([data], { type: 'text/plain' });
    const client = new client_1.BlossomClient(host, (event) => privateKeySigner.signEvent(event));
    const uploadAuthEvent = await client.createUploadAuth(blob, 'Upload file');
    const result = await client.uploadBlob(blob, { auth: uploadAuthEvent });
    const url = result.url;
    console.log(result);
    console.log(`Blob uploaded!, ${url}`);
    return url;
}
try {
    // Fetch the value of the input 'who-to-greet' specified in action.yml
    const host = (0, core_1.getInput)('host');
    const filePath = (0, core_1.getInput)('filePath');
    console.log(`Uploading file ${filePath} to host: ${host}!`);
    upload(filePath, host)
        .then(blossomHash => {
        (0, core_1.setOutput)("blossom-hash", blossomHash);
    })
        .catch((error) => {
        console.error("Blossom Upload failed with error", error);
        if (error instanceof Error) {
            (0, core_1.setFailed)(error.message);
        }
        else {
            (0, core_1.setFailed)("unexpected error");
        }
    });
}
catch (error) {
    console.error("Blossom Upload failed with error", error);
    if (error instanceof Error) {
        (0, core_1.setFailed)(error.message);
    }
    else {
        (0, core_1.setFailed)("unexpected error");
    }
}
