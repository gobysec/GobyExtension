## 快速开始

1.安装完后需要配置 Vulfocus 的 `username` 和 `license`。对应的信息可以在 Vulfocus 官网登陆你的靶场账户获得：

> http://vulfocus.fofa.so/#/profile/index

2.`LocalVulAddress` 为本地漏洞环境的地址，注意应该确保 `LocalVulAddress` 的格式为 `http://ip:port` 的形式，`UsernameLocal` 为本地漏洞环境的账户名，`LicenseLocal` 为本地漏洞环境的 License 值。若没有本地漏洞环境则只需填写 `Username` 和 `License`，无需填写后三项配置项。

![](https://gobies.org/vulfocus1.jpg)

3.打开插件，显示所有 Vulfocus 含有的靶场环境，如果 Goby PoC 支持该环境，则显示有启动按钮。

4.可以通过筛选条件，只显示在 Goby 中有对应的 PoC 可以进行漏洞扫描的镜像。

![](https://gobies.org/vulfocus2.gif)

5.点击启动按钮，提示靶场环境启动成功后，可点击扫描开始扫描该靶场环境对应的漏洞。

![](https://gobies.org/vulfocus3.gif)

6.扫到漏洞后即可进入 Goby 流程验证漏洞。

7.Github: [https://github.com/gobysec/GobyExtension/tree/master/samples/Vulfocus](https://github.com/gobysec/GobyExtension/tree/master/samples/Vulfocus) ，也可以从git上下载插件，手动放入到 /extensions 目录，然后重启Goby。

