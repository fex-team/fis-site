---
layout: post
title: 快速入门- F.I.S
category: beginning
---

# 快速入门

> FIS是一个专为解决前端开发中有关自动化工具、性能优化、模块化框架、开发规范、代码部署、开发流程等问题的工具框架。

> FIS与目前流行的构建工具的不同之处在于FIS更加专注于前端构建，对前端项目天生就有理解能力。通过内建功能就可以满足绝大部分前端构建需求，甚至无需进行任何配置就可以实现很多实用的功能。

> 同时FIS不仅仅是配置简单，使用方便。FIS还有完善的插件系统和扩展能力满足你各式各样的需求，更赞的是FIS还支持二次包装，你可以通过对FIS进行简单的封装来打造属于你自己的开发工具。

让我们快速上手，一起了解一下如何使用FIS轻松的完成一个传统前端项目的资源压缩、添加md5戳、资源合并等性能优化工作。

## 工具安装

FIS使用[Node.js](http://nodejs.org/)开发，以[npm](http://npmjs.org/)包的形式发布。因此使用FIS需要先[安装Node.js](http://www.baidu.com/?isidx=1#wd=Node.js+%E5%AE%89%E8%A3%85)，再通过npm安装命令进行FIS安装。

```
$ npm install -g fis
```

安装遇到困难？[点击这里](http://to.install.fail)

## 示例准备

在介绍FIS的主要功能前，需要先准备一个示例项目。你可以使用[Lights包管理](http://lightjs.duapp.com/)安装，也可以从[Github](https://github.com/hefangshi/fis-quickstart-demo)获取。

```
$ npm install -g lights
$ lights install fis-quickstart-demo
```

## 本地预览

首先我们可以通过 ```fis server start``` 命令启动FIS的本地调试服务器功能对构建发布的项目进行预览调试

```
$ cd fis-quickstart-demo
$ fis release #不进行任何优化重新发布一次
$ fis server start #如果8080端口被占用，使用-p参数设置可用的端口
```

本地调试服务器启动成功后，就会自动打开 ```http://127.0.0.1:8080```

我们可以利用浏览器的开发者工具查看一下网站的静态资源统计 ```15 requests|399KB transferred```

<i class="anchor" id="optimize"></i>

## 资源压缩

资源压缩一直是前端项目优化中非常重要的一环，接下来我们演示如何使用FIS对示例项目进行资源压缩

```
$ fis release --optimize
```

再次查看一下网站的静态资源统计 ```15 requests|146KB transferred``` ，可以发现静态资源已经被压缩。

是不是很简单呢？FIS会默认对脚本与样式表资源进行压缩，通过安装插件还可以无缝使用[coffescript](https://github.com/fouber/fis-parser-coffee-script)、[less](https://github.com/fouber/fis-parser-less)、[sass](https://github.com/fouber/fis-parser-sass)等前端语言进行开发并对其编译结果进行压缩。

> 细心的朋友可能还会发现，index.html中原本使用相对路径对资源定位，在我们的构建产出中已经全部修改为了**绝对路径**，这是因为FIS构建工具内置了[三种语言能力](/docs/advance/fis-standard.html)，其中资源定位功能会将所有路径引用调整为绝对路径。

> 如果只希望对静态资源进行压缩，不希望对路径进行调整，可以通过[配置文件](https://gist.github.com/hefangshi/a7bee8a1b29f3f85f1a0)关闭标准化处理功能。但是标准化处理功能是FIS的核心特色，除非需求仅是对资源进行压缩，否则不建议关闭。

## 静态资源添加md5戳

使用FIS为静态资源添加md5戳，md5戳的添加实际上是[静态资源版本更新与缓存](http://www.infoq.com/cn/articles/front-end-engineering-and-performance-optimization-part1)方面非常重要的能力，但是如果采用手动添加的形式，工作量会比目前大量使用的版本号或时间戳的模式大很多，但是使用FIS，我们可以仅仅通过一个参数，完成这个繁重的工作。

<!-- 我们可以实现与添加[时间戳](http://to.how.add.timestamp)一样的静态资源缓存管理能力。但是md5戳比时间戳在版本管理和发布部署上都有更多的优势，点击[了解更多](http://to.why.md5)。 -->

由于添加md5戳功能依赖FIS的三种语言能力的扩展，因此如果在上面的例子中通过配置关闭了标准化处理功能，需要**删除**相应配置。

那么接下来，我们通过开启 ```--md5``` 参数，为项目中的静态资源添加md5戳

```
$ fis release --optimize --md5
```

查看一下源代码，可以看到不仅静态资源文件被加上了md5戳，所有静态资源引用都被设置了md5戳。

## 休息一下

介绍到这里，快速入门就算完成了，值得注意的是我们以上的操作均是[零配置](/docs/api/fis-conf.html)，并不像其他构建工具一样必须先添加配置才能进行优化工作，这就是FIS对前端项目构建的理解能力，通过指定简单的参数，就可以进行传统前端项目的性能优化工作。

那么总结一下，我们通过简单的两个参数，完成了对前端项目的资源压缩和版本管理工作。但是对比雅虎的14条性能优化原则，我们还没有演示如何使用FIS进行减少连接数、页面结构调整等方面的工作，而这也是FIS实践中非常重要的一环，在静态资源加载方面，基于FIS，我们可以衍伸出各式各样的资源加载的方案，点击了解[资源合并](/docs/beginning/resource-combine.html)。

<!--
## 功能介绍

* 超低学习成本，只须使用 ``1`` 条命令即可满足大量需求
* 可以高效的对各种静态资源进行压缩，提高页面性能
* 所有静态资源自动加 ``md5版本戳``，服务端可放心开启永久强缓存
* 内置强大的[图片合并](https://github.com/fex-team/fis-spriter-csssprites)功能，简单易用，
* 内置对html、js、css的 [三种语言能力](https://github.com/fis-dev/fis/wiki/三种语言能力) 扩展，解决绝大多数前端构建问题
* 内置本地开发调试服务器，支持完美运行 ``java``、``jsp``、``php`` 等服务端语言
* 支持文件监听，文件一旦修改，将会自动增量编译
* 支持浏览器自动刷新，可同时刷新多个终端中的页面，配合文件监听功能可实现保存即刷新
* 支持部署到远端服务器，配合文件监听，浏览器自动刷新功能，可实现保存即增量编译部署
* 可灵活扩展的插件系统，支持对构建过程和命令功能进行扩展，现已发布N多 [插件](https://npmjs.org/search?q=fis)
* 通过插件配置可以在一个项目中无缝使用 [less](https://github.com/fouber/fis-parser-less)、[coffee](https://github.com/fouber/fis-parser-coffee-script)、[markdown](https://github.com/fouber/fis-parser-marked)、[jade](https://npmjs.org/package/fis-parser-jade)等语言开发
* 可配置 [目录规范](https://github.com/fis-dev/fis/wiki/配置API#wiki-roadmappath)，使前端项目的开发路径与部署路径解耦
* 支持二次包装，比如 [spmx](https://github.com/fouber/spmx)、 [phiz](https://github.com/fouber/phiz/)、 [chassis](https://github.com/xspider/fis-chassis)，对fis进行包装后可内置新的插件、配置，从而打造属于你们团队的自己的开发工具
* 抹平编码差异，开发中无论是gbk、gb2312、utf8、utf8-bom等编码的文件，输出时都能统一指定为utf8无bom（默认）或者gbk文件
-->
