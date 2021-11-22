## Quick Start

1.After install you should Configure Vulfocus `username` and `license`. The corresponding information can be obtained by logging into your account on the Vulfocus official website:

> http://vulfocus.fofa.so/#/profile/index

2.`LocalVulAddress` is the address of the local vulnerability environment. Please ensure that the format of `LocalVulAddress` is in the form of `http://ip:port`, `UsernameLocal` is the username of the local vulnerability environment, and `LicenseLocal` is the license value of the local vulnerability environment. If there is no local vulnerability environment, you only need to fill in `Username` and `License` instead of the last three configuration items.

![](https://gobies.org/vulfocus1.jpg)

3.Open the plug-in to display all the vulnerability environments contained in Vulfocus. If there is one Goby PoC that supports this environment, a start button will be displayed.

4.Filtering conditions can be used to display only the environments that have the corresponding PoC in Goby that can be scanned for vulnerabilities.

![](https://gobies.org/vulfocus2.gif)

5.Click the start button to prompt that the vulnerability environment has been successfully started, and you can click Scan to start scanning the vulnerabilities corresponding to the vulnerability environment.

![](https://gobies.org/vulfocus3.gif)

6.After scanning the vulnerabilities, you can enter the Goby process to verify the vulnerabilities.

7.Github: [https://github.com/gobysec/GobyExtension/tree/master/samples/Vulfocus](https://github.com/gobysec/GobyExtension/tree/master/samples/Vulfocus) ,You can also download the plugin from git, manually put it in the /extensions directory, and then restart Goby.
