"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util = require("util");
const child_process_1 = require("child_process");
const fs_1 = require("fs");
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
        this.readFilePromise = util.promisify(fs_1.readFile);
        console.log(`Remote access called at: ${new Date()}\n`);
    }
    async getSanitizedIpAddresses() {
        try {
            /*
                * DOCUMENTATION: 'https://angryip.org/documentation/'

                * [options] <feeder> <exporter>

                Where <feeder> is one of:
                -f:range <Start IP> <End IP>
                -f:random <Base IP> <IP Mask> <Count>
                -f:file <File>

                <exporter> is one of:
                -o filename.txt         Text file (txt)
                -o filename.csv         Comma-separated file (csv)
                -o filename.xml         XML file (xml)
                -o filename.lst         IP:Port list (lst)

                And possible [options] are (grouping allowed):
                -s      start scanning automatically
                -q      quit after exporting the results
                -a      append to the file, do not overwrite
            */
            // change the path for your system
            const pathToFile = './scan.txt';
            /*
                * This line will execute the scan with the ip range of:
                    * 10.0.0.0 to 10.0.0.255 ( it will look for the entire network )
                * the -f flag specifies the network range
                * the -s flag means the scan will start automatically
                * the -o flag specifies the path to save the output
                * the -q flag means the program should close automatically after the scan is done
            */
            await this.execPromise(`ipscan -f:range 10.0.0.0 10.0.0.255 -s -o ${pathToFile} -q`);
            await this.readFile(pathToFile);
            return [''];
            // const ipAddresses = stdout.split('\n');
            // /*
            //     * Sanitizing the ipAddresses array
            //     * removing the first line
            //         * Starting Nmap 7.60 ( https://nmap.org ) at 2020-08-22 16:42 -03
            //     * removing the last two lines
            //         * Nmap done: 256 IP addresses (3 hosts up) scanned in 2.58 seconds
            //         * ''
            // */
            // const sanitizedIpAddresses = ipAddresses.splice(1, stdout.split('\n').length);
            // sanitizedIpAddresses.pop();
            // sanitizedIpAddresses.pop();
            // return sanitizedIpAddresses;
        }
        catch (error) {
            console.error(error);
        }
    }
    async readFile(path) {
        try {
            const file = await this.readFilePromise(path, 'utf8');
            console.log(file);
        }
        catch (error) {
            console.error(error);
        }
        return 'a';
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
        // const result = await this.connectToIpAddress(ipAddresses);
        // if (result) await this.runScrcpy();
        // else console.log('Something went wrong!');
    }
}
const main = new Main();
main.controller();
