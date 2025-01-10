console.log('Happy developing ✨')

import core from "@actions/core"

try {
    // Fetch the value of the input 'who-to-greet' specified in action.yml
    const host = core.getInput('host');
    console.log(`Uploading file to host: ${host}!`);

    // Record the time of greeting as an output
    const blossomHash = "ljsdlkfjhdslkhjfoiejofeljlksjlke"
    core.setOutput("blossom-hash", blossomHash);

} catch (error) {
    console.log(error);

    if(error instanceof Error) {
        core.setFailed(error.message);
    } else{
        core.setFailed("unexpected error");
    }

}