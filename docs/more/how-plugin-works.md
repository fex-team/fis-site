---
layout: post
title: 插件调用机制- F.I.S
category: more
---

# 插件调用机制

插件调用机制的 [实现](https://github.com/fis-dev/fis-kernel/blob/master/fis-kernel.js#L77-L86) 非常简单：

![fis.require实现机制](https://raw.githubusercontent.com/fouber/fis-wiki-img/master/fis.require.png)

fis的插件也是一个npm包，利用fis.require函数来加载。当我们在fis系统中加载一个插件的时候，会利用 [nodejs的require向上查找机制](http://nodejs.org/api/modules.html#modules_loading_from_node_modules_folders) 从 **fis-kernel** 模块出发，向上查找所需模块，产生这样的效果：

![fis.require调用示意图](https://raw.githubusercontent.com/fouber/fis-wiki-img/master/fis.require2.png)

fis插件系统巧妙的利用了nodejs的require机制来实现其扩展机制。这意味着，要想扩展fis可以有 **三种途径** ：

1. 使用fis的用户，自己需要某种插件，可以在fis安装目录的 **同级**，安装自己扩展的插件。比如：
```bash
npm install -g fis
npm install -g fis-parser-coffee-script
```
1. fis团队会衡量某个插件的通用性，把它放到fis的依赖里，最优先加载。目前已经内置的插件包括：
    * [fis-kernel](https://github.com/fis-dev/fis-kernel)：fis编译机制内核
    * [fis-command-release](https://github.com/fis-dev/fis-command-release)：fis release命令的提供者，处理编译过程，并提供文件监听、自动上传等功能
    * [fis-command-install](https://github.com/fis-dev/fis-command-install)：fis install命令的提供者，用于从fis仓库下载组件、配置、框架、素材等资源
    * [fis-command-server](https://github.com/fis-dev/fis-command-server)：fis server命令的提供者，用于开启一个本地php-cgi服务器，对项目进行预览、调试。
    * [fis-optimizer-uglify-js](https://github.com/fis-dev/fis-optimizer-uglify-js)：fis的优化插件，调用uglify-js对文件内容进行js压缩。
    * [fis-optimizer-clean-css](https://github.com/fis-dev/fis-optimizer-clean-css)：fis的优化插件，调用clean-css对文件内容进行css压缩。
    * [fis-postprocessor-jswrapper](https://github.com/fis-dev/fis-postprocessor-jswrapper)：fis的后处理器插件，用于对js文件进行包装，支持amd的define包装或者匿名自执行函数包装。
1. 开发一个依赖于fis模块的npm包，并在这个包里定制所需要的插件。这种方式与上一条类似，也是将插件安装在fis的同级目录下。