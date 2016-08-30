---
layout: post
title: 命令行- F.I.S
category: api
---

# 命令行

**三条命令，满足你的所有需求**

执行 **fis --help** 让我们来看一下fis命令的相关帮助：

```
    Usage: fis <command>

    Commands:

      release     build and deploy your project
      install     install components and demos
      server      launch a php-cgi server

    Options:

      -h, --help     output usage information
      -v, --version  output the version number
      --no-color     disable colored output
```
正如你所见，使用fis你需要——也只需要——记住三条命令：

* **fis release**： 编译并发布你的项目
* **fis install**：此命令安装一些公共库组件比如 jQuery、echarts，我们提供的组件都放在 [https://github.com/fis-components](https://github.com/fis-components) 仓库中。
* **fis server**：启动一个 **1.8M** 大小的内置调试服务器，它采用php-java-bridge技术实现， _依赖java、php-cgi外部环境_ ，可以 **完美支持运行php程序** 哦。

接下来，就让小编分别介绍这三个命令的使用，见证奇迹的时刻到了。。。

## fis install &lt;name&gt;

> 难度等级：★☆☆☆☆

fis install命令经过全新升级，目前可以从Github或者各类私有Gitlab仓库下载前端组件使用，只需要两步就可以加载一个前端组件

首先我们安装一个组件

```bash
fis install jquery bootstrap

Installed
├── github:fis-components/jquery@1.9.1
└── github:fis-components/bootstrap@v3.3.1
```

然后我们就可以在Javascript中调用组件

```javascript
require('bootstrap/button');
var $ = require('jquery');


$('.btn').click(function() {
    alert('Magic');
});
```

更多详情请参考 [fis-components](https://github.com/fis-components/components)


## fis release [options]

> 难度等级：★★★☆☆

release是一个非常强大的命令，它的主要任务就是进行代码的 **编译** 与 **部署**，它的参数囊括了前端开发所需的各种基础功能：

1. 添加 **--watch** 或 **-w** 参数，支持对项目进行增量编译，监听文件变化再触发编译
1. 添加 **--live** 或 **-L** 参数，支持编译后自动刷新浏览器。Liveload功能需要浏览器支持Web Socket功能，例如Chrome、Firefox、Safari等浏览器。
1. 添加 **--dest [path|name]** 或 **-d** 参数，来指定编译后的代码部署路径，支持发布到 **本地目录、本地调试服务器目录、远程机器目录(需要配置)**，它与--watch参数配合使用，可以让你的代码保存就上传！而且--dest值支持逗号分隔，这也就意味着，你 **一次编译可以同时发布到本地以及多台远程机器上**！举几个栗子：
    * 发布到fis server open目录下用于本地调试

        ```
        fis release
        # or
        fis release --dest preview
        ```
    * 发布到项目根目录的output目录下， _注意，这里的output其实是一个内置的部署配置名，而不是一个目录名_。

        ```
        fis release -d output
        ```
    * 发布到相对 ``工作目录`` 的路径

        ```bash
        fis release -d ../output
        ```
    * 发布到绝对路径

        ```bash
        fis release -d /home/work/ouput
        # win
        fis release -d d:/work/output
        ```
    * 使用配置文件的 [deploy节点配置](http://fex-team.github.io/fis-site/docs/api/fis-conf.html#deploy) 进行发布，此配置可将代码上传至远端

        ```bash
        fis release -d remote
        ```
    * 以上所有发布规则任意组合使用（一次编译同时上传到多台远端机器 & 项目根目录下的output & 调试服务器根目录 & 本地绝对路径）

        ```bash
        fis releaes -d remote,qa,rd,output,preview,D:/work/output
        ```
1. 添加 **--md5 [level]** 或 **-m [level]** 参数，在编译的时候可以对文件自动加md5戳，从此告别在静态资源url后面写?version=xxx的时代
1. 添加 **--lint** 或 **-l** 参数，支持在编译的时候根据项目配置自动代码检查
1. 添加 **--test** 或 **-t** 参数，支持在编译的时候对代码进行自动化测试
1. 添加 **--pack** 或 **-p** 参数，对产出文件根据项目配置进行打包
1. 添加 **--optimize** 或 **-o** 参数，对js、css、html进行压缩
1. 添加 **--domains** 或 **-D** 参数，为资源添加domain域名

初步了解之后，让我们对刚刚下载的项目做一次编译，look at me：

```bash
git clone https://github.com/fex-team/fis2-demo # 或者到 github 下载
cd fis2-demo/firstblood
fis release --md5 --dest ./output
```

这里有个小小的warning，说找不到fis的配置文件，咱们不用管它，因为我们要体验 **零配置** 使用。接下来进入到firstblood/output目录看一下产出的文件，尤其是index.html，你将看到fis的自动化工具对 **html、js、css各自扩展了三种语言能力**：

* **资源定位**：获取任何开发中所使用资源的线上路径；
* **内容嵌入**：把一个文件的内容(文本)或者base64编码(图片)嵌入到另一个文件中；
* **依赖声明**：在一个文本文件内标记对其他资源的依赖关系；

有了这三种语言能力，你的团队前端工业化水平将有很大的提升，因为：

1. 资源定位能力，可以有效的分离开发路径与部署路径之间的关系，工程师不再关心资源部署到线上之后去了哪里，变成了什么名字，这些都可以通过配置来指定。而工程师只需要使用相对路径来定位自己的开发资源即可。这样的好处是 **资源可以发布到任何静态资源服务器的任何路径上而不用担心线上运行时找不到它们**，而且 代码 **具有很强的可移植性**，甚至可以从一个产品线移植到另一个产品线而不用担心线上部署不一致的问题。
1. 内容嵌入可以为工程师提供诸如图片base64嵌入到css、js里，前端模板编译到js文件中，将js、css、html拆分成几个文件最后合并到一起的能力。有了这项能力，可以有效的减少http请求数，提升工程的可维护性。fis不建议用户使用内容嵌入能力作为组件化拆分的手段，因为下面这个能力会更适合组件化开发。
1. 依赖声明，为工程师提供了声明依赖关系的编译接口。fis在执行编译的过程中，会扫描这些编译标记，从而建立一张 **静态资源关系表**，它会被产出为一份 **map.json** 文件，这份文件详细记录了项目内的静态资源开发路径、线上路径、资源类型以及 **依赖关系** 和 **资源打包信息**，这样，使用fis作为编译工具的产品线，就可以将这张表提交给后端或者前端框架去运行时根据组件使用情况来按需加载资源或者资源所在的包，从而提升前端页面运行性能。

ok，回到刚刚的firstblood示例项目，进入到output目录，你将看到：

1. 所有的资源，除了html都加了md5戳
1. 多了一个map.json文件，里面记录了当前项目下的静态资源信息。
1. 编辑器打开index.html文件，你将看到更多惊喜。

接下来，我们使用install命令安装一个配置文件，用于 **调整文件编译后的部署路径** ：

```bash
git clone https://github.com/fex-team/fis2-demo # 或者 到 github 下载
cd fis2-demo
cp firstblood-conf/fis-conf.js ./firstblood # 拷贝 fis-conf.js 到 firstblood 目录下
```
此时firstblood项目目录下会多出一个fis-conf.js文件，让我们看一下里面的内容：

```javascript
fis.config.merge({
    roadmap : {
        domain : {
            //所有css文件添加http://localhost:8080作为域名
            '**.css' : 'http://localhost:8080'
        },
        path : [
            {
                //所有的js文件
                reg : '**.js',
                //发布到/static/js/xxx目录下
                release : '/static/js$&'
            },
            {
                //所有的css文件
                reg : '**.css',
                //发布到/static/css/xxx目录下
                release : '/static/css$&'
            },
            {
                //所有image目录下的.png，.gif文件
                reg : /^\/images\/(.*\.(?:png|gif))/i,
                //发布到/static/pic/xxx目录下
                release : '/static/pic/$1'
            }
        ]
    }
});
```
删除一下output目录，再次执行编译命令：

```bash
fis release --md5 --domains --dest ./output
```
就可以看到，fis调整了编译产出的目录结构。编辑output目录下的index.html，还会发现，fis将所有引用资源的地方也都调整为了发布路径，所有css也自动添加了域名！

fis release命令还有强大的自动上传功能，这篇文档不会详细介绍此功能的使用方式，但小编可以先发个截图表示一下。截图中显示的是我在windows下编译了firstblood项目，然后自动同步到我的linux测试机上的截图。之后我修改了index.html文件，它又帮我秒传上去了，嚯嚯！

![自动上传功能](https://raw.githubusercontent.com/fouber/fis-wiki-img/master/deploy.png)

当你学习到这里时，恭喜你，你已掌握了F.I.S自动化/辅助开发工具的大部分功能，下面一条命令，会给你带来更爽的开发体验。

<i class="anchor" id='server'></i>

## fis server &lt;command&gt; [options]

> 难度等级：★★☆☆☆

考虑到工程师需要在后端程序没开始的时候就能写点东西看看效果，或者离开公司在别处与妹子把酒言欢时突然来了灵感要写码，没有一个小巧的调试服务器怎么能行？！fis团队将本地调试服务器作为一项重要功能来开发，赋予工程师无处不在的写码调试能力。不要小看这个调试服务器，它是特别定制的，使用php-java-bridge技术实现，完美支持运行php程序，可以 **比较真实** 的模拟产品线线上运行环境。

fis的调试服务器依赖于用户本地的 **jre** 和 **php-cgi** 环境，所以：

* 如果没有jre环境，请移步 [这里](http://www.java.com/) 下载
* 如果没有php-cgi环境的，请移步 [这里](http://php.net/downloads.php) 下载
* 请把java、php-cgi命令添加到环境变量中

搞定环境后，让我们来启动调试服务器看看：

```bash
fis server start
checking java support : version 1.6.0
checking php-cgi support : version 5.2.11
starting fis-server on port : 8080
```

> 不需要再使用调试服务器时，可以通过 ```fis server stop``` 关闭

服务器启动之后，它会自动检查环境，最后告诉你它监听了8080端口，这个时候，你的浏览器应该打开了一个调试服务器根目录的浏览页面，地址是 **http://localhost:8080/**。

在刚刚的firstblood项目中执行命令：

```bash
fis release --md5 --optimize --watch
```
现在，fis已经将编译好的代码发布到调试服务器中啦，刷新浏览器，你会看到我们的firstblood示例项目的运行效果。此时，你修改项目文件都将自动编译并发布到调试服务器目录下，看看页面源代码，你会发现更多惊喜！顺便恭喜你，至此你已完全掌握了fis的基本用法，你可以借助fis这个利器去挑战大型商业产品开发了！

