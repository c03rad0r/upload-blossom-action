"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@actions/core");
console.log('Happy developing ✨');
try {
    // Fetch the value of the input 'who-to-greet' specified in action.yml
    const host = (0, core_1.getInput)('host');
    console.log(`Uploading file to host: ${host}!`);
    // Record the time of greeting as an output
    const blossomHash = "ljsdlkfjhdslkhjfoiejofeljlksjlke";
    (0, core_1.setOutput)("blossom-hash", blossomHash);
}
catch (error) {
    console.log(error);
    if (error instanceof Error) {
        (0, core_1.setFailed)(error.message);
    }
    else {
        (0, core_1.setFailed)("unexpected error");
    }
}
