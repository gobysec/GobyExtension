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
![image](https://user-images.githubusercontent.com/32918050/109417139-48cccc00-79fd-11eb-8df9-78277975b8ad.png)

* vulmap.py 位置：需要指定vulmap.py的绝对路径  
* python3 命令或位置：需要填写当前环境变量中python3的命令或绝对路径  

## 三、使用 vulmap 插件
插件接口目前有两个地方，分别在goby的右侧任务栏的"Web检测"和"资产中"  
