"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util = require("util");
const child_process_1 = require("child_process");
class Main {
    constructor() {
        /*
            * port can be passed as an argument through the command line
            * PORT=1234 node main.js
            *
            * Also: The default port of adb is 5555, so if no port is passed
            * on the terminal, it will just be 5555.
        */
        this.PORT = process.env.PORT || 5555;
        this.execPromise = util.promisify(child_process_1.exec);
        console.log(`Remote access called at: ${new Date()}\n`);
    }
    async getSanitizedIpAddresses() {
        try {
            const { stdout } = await this.execPromise('nmap -sn 10.0.0.0/24 | grep "Nmap"');
            console.log(stdout);
            const ipAddresses = stdout.split('\n');
            /*
                * Sanitizing the ipAddresses array
                * removing the first line
                    * Starting Nmap 7.60 ( https://nmap.org ) at 2020-08-22 16:42 -03
                * removing the last two lines
                    * Nmap done: 256 IP addresses (3 hosts up) scanned in 2.58 seconds
                    * ''
            */
            const sanitizedIpAddresses = ipAddresses.splice(1, stdout.split('\n').length);
            sanitizedIpAddresses.pop();
            sanitizedIpAddresses.pop();
            return sanitizedIpAddresses;
        }
        catch (error) {
            console.error(error);
        }
    }
    async connectToIpAddress(sanitizedIpAddresses) {
        try {
            for (let i = 0; i < sanitizedIpAddresses.length; i++) {
                /*
                    * sanitizedIpAddresses[i]: Nmap scan report for _gateway (10.0.0.1)
                    * But we need: 10.0.0.1
                    *
                    * element.split(' '): ['Nmap', 'scan', 'report', 'for', '_gateway', '(10.0.0.1)']
                    * element.split(' ').length - 1: 5
                    *
                    * ip: (10.0.0.1)
                    * sanitizedIp: 10.0.0.1
                */
                const element = sanitizedIpAddresses[i];
                const ip = element.split(' ')[(element.split(' ').length - 1)];
                const sanitizedIp = ip.replace(/[()]/g, '');
                const { stdout } = await this.execPromise(`adb connect ${sanitizedIp}:${this.PORT}`);
                // if it has already connected, there's no need to keep checking for open ports
                if (stdout.startsWith('connected'))
                    return true;
            }
            return false;
        }
        catch (error) {
            console.error(error);
        }
    }
    async runScrcpy() {
        await this.execPromise('scrcpy');
    }
    async controller() {
        const ipAddresses = await this.getSanitizedIpAddresses();
        const result = await this.connectToIpAddress(ipAddresses);
        if (result)
            await this.runScrcpy();
        else
            console.log('Something went wrong!');
    }
}
const main = new Main();
main.controller();
