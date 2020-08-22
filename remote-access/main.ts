import * as util from 'util';
import { exec } from 'child_process';

class Main {
    /*
        * port can be passed as an argument through the command line
        * PORT=1234 node main.js
        * 
        * Also: The default port of adb is 5555, so if no port is passed
        * on the terminal, it will just be 5555.
    */
    port: number | string = process.env.PORT || 5555;

    constructor() {
        console.log(`Remote access called at ${new Date()}`);
    }
}

new Main();