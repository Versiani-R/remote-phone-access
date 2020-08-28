# How it's going to work
We will use the handy [scrcpy](https://github.com/Genymobile/scrcpy), some useful resources, such as angry ip scanner, and other stuff.  
It will use TypeScript, but I pretend in doing another repository like this, but this time using python3.  
Also, as a matter of fact, it will use quite a lot of linux terminal commands, I will cover the usage, and why to use it, but it wouldn't hurt knowing at least the basics.  

# Dependencies
1. [scrcpy](https://github.com/Genymobile/scrcpy)
    * `sudo apt install scrcpy`
1. [angry ip scanner](https://angryip.org/download/#linux)
    * `sudo apt install ./angryip`
1. [adb](https://www.xda-developers.com/install-adb-windows-macos-linux/)
    * `sudo apt install adb`
1. [nodejs](https://nodejs.org/en/)
1. ***(OPTIONAL)*** [nmap](https://nmap.org/)
    * `sudo apt install nmap`
    * You don't need to install this dependency, it's not as reliable as I want to;
    * It's only possible use case is on: `Steps To Follow > 3`;

# Usage
I just recently broke my phone's display, the touch works, but the image doesn't ( the phone's screen is black ). I tried many ways to have access to my phone, and being honest, there's a lot of great ways of achieving so.  
1. [airdroid](web.airdroid.com) Let's you do a bunch of stuff
1. The good old way of just plugging your phone on the usb and getting the files back ( although that doesn't grant me any control over the phone ).
1. [and other great ways](https://www.androidauthority.com/control-android-from-pc-854442/)
1. [mirroring your phone's screen](https://www.howtogeek.com/430466/how-to-mirror-and-control-your-android-phone-on-any-windows-pc/)
  
And the list goes on and on ...

# Steps to follow
**DISCLAIMER: I HAVE ABSOLUTELY NO IDEA IF IT WORKS ON APPLE DEVICES. TRY BY YOUR OWN RISK.**  
First of all, you must have all the dependencies installed.  
Second of all, it only works while your phone and your pc are on the same network.  
After that:
1. Get your phone, and activate the developer's options. It should be one of the following paths:
    * `Settings > About Phone > Build Number`
    * `Settings > About Phone > Status > Build Number`
    * `Settings > About Phone > Status > Info > Build Number`
1. On developer's options, enable usb-debugging
    * `Debugging > Toggle USB Debugging`

(***OPTIONAL*** *the program itself tries the connection with all the ip addresses on the network, you can skip this process if you want to* )
1. Get your ip address. It should be one of the following paths
    * `Settings > About Phone > Status > Ip Address`
    * `Settings > About Phone > Info > Ip Address`

    1. **Another great way of getting your ip address ( and every other ip address of your network ) is with the following command**
        * `ipscan -f:range 10.0.0.0 10.0.0.255 -s`
    1. **Other possible way is with the command (NOT 100% RELIABLE)**
        * `nmap -sn 10.0.0.0/24`
1. Plug your device on the computer's usb.
1. On your terminal, type the following:
    * `adb tcpip 5555`
    * *this marks your phone as open, with the port as 5555*
1. Unplug your phone
1. Run the script
    * `node main.js`
    1. **If you used other port, run:**
        * `PORT=1234 node main.js`