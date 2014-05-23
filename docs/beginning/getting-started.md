---
layout: post
title: 快速入门- F.I.S
category: beginning
---

# 快速入门

FIS无需任何插件支持就能够满足前端项目中诸如资源压缩、加[md5戳](http://to.why.md5)、[图片base64嵌入](http://to.why.inline)等构建需求，让我们试试看。

## 工具安装

FIS使用[Node.js](http://nodejs.org/)开发，以[npm](http://npmjs.org/)包的形式发布。因此使用FIS需要先[安装Node.js](http://www.baidu.com/?isidx=1#wd=Node.js+%E5%AE%89%E8%A3%85)，再通过npm安装命令进行FIS安装。

```
$ npm install -g fis
```

安装遇到困难？[点击这里](http://to.install.fail)

<i class="anchor" id="optimize"></i>

## 资源压缩

在使用FIS进行前端项目资源压缩、优化性能前，我们需要准备一个前端示例项目，可以使用[Lights包管理](http://lightjs.duapp.com/)安装，也可以从[Github](https://github.com/hefangshi/fis-quickstart-demo)获取。

```
$ npm install -g lights
$ lights install fis-quickstart-demo
```

我们可以看到这个简单的项目拥有若干资源文件和一个HTML页面，那么接下来我们试试如何使用FIS来对这个简单的项目进行优化：

首先我们可以通过 ```fis server start``` 命令启动FIS的本地调试服务器功能对构建发布的项目进行预览调试

```
$ cd fis-quickstart-demo
$ fis release #不进行任何优化重新发布一次
$ fis server start #如果8080端口被占用，使用-p参数设置可用的端口
```

本地调试服务器启动成功后，就会自动打开 ```http://127.0.0.1:8080```。

我们可以利用浏览器的开发者工具查看一下网站的静态资源统计 ```15 requests|399KB transferred```

接下来我们可以使用FIS对示例项目进行资源压缩

```
$ fis release --optimize
```

再次查看一下网站的静态资源统计 ```15 requests|146KB transferred``` ，可以发现静态资源已经被压缩。

细心的朋友可能还会发现，index.html中原本使用相对路径对资源定位，在我们的构建产出中已经全部修改为了绝对路径，这是因为FIS构建工具内置了[三种语言能力](/docs/advance/fis-standard.html)，其中资源定位功能会将所有路径引用调整为绝对路径，如果只希望对静态资源进行压缩，不希望对路径进行调整，可以通过[配置文件](https://gist.github.com/hefangshi/a7bee8a1b29f3f85f1a0)关闭标准化处理功能。

## 静态资源添加md5戳

使用FIS为静态资源添加md5戳，我们可以实现与添加[时间戳](http://to.how.add.timestamp)一样的静态资源缓存管理能力。但是md5戳比时间戳在版本管理和发布部署上都有更多的优势，点击[了解更多](http://to.why.md5)。

由于添加md5戳功能依赖FIS的三种语言能力的扩展，因此如果在上面的例子中通过配置关闭了标准化处理功能，需要**删除**相应配置。

```
$ fis release --optimize --md5
```

查看一下源代码，可以看到所有静态资源引用都被设置了md5戳。

值得注意的是我们上面的操作均是[零配置](/docs/api/fis-conf.html)，并未像其他构建工具一样必须先添加配置才能进行优化工作，这就是FIS对前端项目构建的理解能力，通过指定简单的参数，就可以完成传统前端项目的性能优化工作。

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
