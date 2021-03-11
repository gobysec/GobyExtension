Vulmap: 一款 Web 漏洞扫描和验证工具 (这里用于和goby互补poc)
## 一、部署 vulmap
如果以及部署了 vulmap 可以忽略该步骤  
否则需要前往 [https://github.com/zhzyker/vulmap](https://github.com/zhzyker/vulmap) 部署 vulmap  
> ![image](https://user-images.githubusercontent.com/32918050/109416983-8da43300-79fc-11eb-9acd-bb64a719d427.png)  
> 

```bash
# git 或前往 release 获取原码
git clone https://github.com/zhzyker/vulmap.git
# 安装所需的 python 依赖
pip3 install -r requirements.txt
# Linux & MacOS & Windows
python3 vulmap.py -u http://example.com
```

## 二、配置 vulmap 插件
![image](https://user-images.githubusercontent.com/32918050/109417385-70706400-79fe-11eb-8b4e-017252adf18f.png)  

* vulmap.py 位置：需要指定vulmap.py的绝对路径  
* python3 命令或位置：需要填写当前环境变量中python3的命令或绝对路径  

## 三、使用 vulmap 插件
插件接口目前有两个地方，分别在goby的右侧任务栏的"Web检测"和"资产中"  
![image](https://user-images.githubusercontent.com/32918050/109417336-3010e600-79fe-11eb-9d6f-2b790c2e2c17.png)  
![image](https://user-images.githubusercontent.com/32918050/109417359-4c148780-79fe-11eb-8be7-57181bea7081.png)  

点击 vulmap 便可进行扫描，再次点击查看扫描结果，目前插件版本 0.1.0 中为纯文本输出结果，后续更入 html 扫描结果  
![image](https://user-images.githubusercontent.com/32918050/109417544-12904c00-79ff-11eb-9b8b-980fbe6e5a6f.png)
![image](https://user-images.githubusercontent.com/32918050/109417627-656a0380-79ff-11eb-8dcf-de9c99284f7e.png)

## 四、功能建议或 bug 反馈
goby vulmap 插件建议和反馈请前往 [https://github.com/gobysec/GobyExtension/issues](https://github.com/gobysec/GobyExtension/issues)  
vulmap 建议和反馈请前往 [https://github.com/zhzyker/vulmap/issues](https://github.com/zhzyker/vulmap/issues)  
