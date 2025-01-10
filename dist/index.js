"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
console.log('Happy developing ✨');
const core_1 = __importDefault(require("@actions/core"));
try {
    // Fetch the value of the input 'who-to-greet' specified in action.yml
    const host = core_1.default.getInput('host');
    console.log(`Uploading file to host: ${host}!`);
    // Record the time of greeting as an output
    const blossomHash = "ljsdlkfjhdslkhjfoiejofeljlksjlke";
    core_1.default.setOutput("blossom-hash", blossomHash);
}
catch (error) {
    console.log(error);
    if (error instanceof Error) {
        core_1.default.setFailed(error.message);
    }
    else {
        core_1.default.setFailed("unexpected error");
    }
}
