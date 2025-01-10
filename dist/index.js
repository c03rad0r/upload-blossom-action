"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@actions/core");
const BlossomClient = __importStar(require("blossom-client-sdk"));
console.log('Starting blossom Upload');
const secretKey = new TextEncoder().encode("5de4e082b712da4364685141aa06b7d0fec9b178e1246c74dc66bc3dc03e5e61");
// const privateKeySigner = new NSecSigner(secretKey)
async function upload(filePath, host) {
    // const data = readFileSync(filePath, 'utf-8');
    // const blob = new Blob([data], {type: 'text/plain'});
    async function signer(event) {
        //
        //     const signer = new NDKPrivateKeySigner(secretKey);
        //     const pubkey = await signer.user().then(u => u.pubkey)
        //
        //     const signature =  await signer.sign(event as NostrEvent);
        //
        //     const y = event as NostrEvent
        //     const x: SignedEvent = { ...event, pubkey: pubkey, sig: signature, id: y.id! };
        //
        //     return x;
        const x = {
            content: "",
            created_at: 0,
            id: "",
            kind: 0,
            pubkey: "",
            sig: "",
            tags: []
        };
        return x;
    }
    const client = new BlossomClient.BlossomClient(host, signer);
    //
    // const uploadAuthEvent = await client.createUploadAuth(blob, 'Upload file')
    // const result = await client.uploadBlob(blob, {auth: uploadAuthEvent})
    //
    const url = "hello"; //result.url
    //
    // console.log(result)
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
