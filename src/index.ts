import 'dotenv/config';
import { createServer } from "node:http";
import { createApplication } from "./app/index.js";


async function main() {
    try {
        const server = createServer(createApplication());
        const PORT: number = 8080;
        // server bhai listen karo on particular port and then ham callback de sakte hai
        server.listen(PORT, () => { 
            console.log("Server is running");
        })
    } catch (e) {
        // if server is not running 
        console.log("Error in starting http server");
        throw e;
    }
}
main();