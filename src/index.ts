import {setFailed, getInput, setOutput} from "@actions/core"

console.log('Happy developing ✨')



try {
    // Fetch the value of the input 'who-to-greet' specified in action.yml
    const host = getInput('host');
    console.log(`Uploading file to host: ${host}!`);

    // Record the time of greeting as an output
    const blossomHash = "ljsdlkfjhdslkhjfoiejofeljlksjlke"
    setOutput("blossom-hash", blossomHash);

} catch (error) {
    console.log(error);

    if(error instanceof Error) {
        setFailed(error.message);
    } else{
        setFailed("unexpected error");
    }

}