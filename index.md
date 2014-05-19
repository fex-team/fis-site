---
layout: index
title: 前端解决方案通用框架- F.I.S
---

## FIS是什么

FIS是一个专为解决前端开发中有关自动化工具、性能优化、模块化框架、开发规范、代码部署、开发流程等问题的工具框架。

FIS与目前流行的构建工具的不同之处在于FIS更加专注于前端构建，对前端项目天生就有理解能力。通过内建功能就可以满足绝大部分前端[构建需求](http://to.why.build)，甚至无需进行任何配置就可以实现很多实用的功能。

同时FIS不仅仅是配置简单，使用方便。FIS还有完善的插件系统和扩展能力满足你各式各样的需求，更赞的是FIS还支持二次包装，你可以通过对FIS进行简单的封装来打造属于你自己的开发工具。

## 快速上手

FIS无需任何插件支持就能够满足前端项目中诸如资源压缩、加[md5戳](http://to.why.md5)、[图片base64嵌入](http://to.why.inline)等构建需求，让我们试试看。

### 安装

FIS使用[Node.js](http://nodejs.org/)开发，以[npm](http://npmjs.org/)包的形式发布。

```
$ npm install -g fis
```

安装遇到困难？[点击这里](http://to.install.fail)

### 试用

使用FIS前，我们需要准备一个前端示例项目，你可以尝试使用你自己的前端项目，或者使用我们提供的示例项目

```
$ fis install firstblood-demo #利用FIS内置的包管理能力下载示例项目
```

我们可以看到这个简单的项目拥有若干资源文件和一个HTML页面，不包含任何配置文件，那么接下来我们试试如何使用FIS来对这个简单的项目进行优化

```
$ cd firstblood
$ fis release -omd ../dist #参数的含义可以通过 fis release -h 查看
$ cd ../dist
```

让我们看看产出的内容

```
firstblood/
  |-- images
  |     |-- body-bg_dbb75d9.png
  |     \-- logo_74e5229.gif
  |-- demo_4de27aa.css
  |-- demo_762c284.js
  |-- index.html
  |-- map.json
  |-- script_d41d8cd.js
  \-- style_ab25b35.css
```

我们可以看到所有静态资源均被添加md5版本戳，所有脚本资源均进行了压缩处理，同时图片也已经经过了无损压缩。如果打开index.html，你还会发现index.html中所有对这些路径的引用均以更新md5版本戳。

这里需要注意的是我们并未像其他构建工具一样必须事先配置才能进行优化工作，这就是FIS对前端项目构建工作的理解能力，通过指定简单的参数，节约大量的人工优化操作。

这些功能不能满足你的需求？可以看看更全面的教程[了解更多](http://to.get.started)。

## 功能介绍

* 超低学习成本，只须使用 ``1`` 条命令即可满足大量需求
* 可以高效的对各种静态资源进行压缩，提高页面性能
* 所有静态资源自动加 ``md5版本戳``，服务端可放心开启永久强缓存
* 内置强大的图片合并功能，简单易用，[css sprites插件](https://github.com/fex-team/fis-spriter-csssprites)
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
