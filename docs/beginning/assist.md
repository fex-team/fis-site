---
layout: post
title: 辅助开发- F.I.S
category: beginning
---

# 辅助开发

## 语言扩展

使用FIS可以方便的将各种异构语言转换为前端语言，比如说可以将CoffeeScript编译为JavaScript、LESS编译为CSS、前端模板预编译、Markdown编译为HTML等等，并且可以做到各种异构语言无缝混用，我们以LESS为例演示如何使用FIS来扩展前端开发语言。

> 更多的语言扩展类插件可以查看[更多插件](/docs/advance/plugin-list.html)

### 插件安装

```bash
$ npm install -g fis-parser-less
```

### 开启插件

```javascript
//file: fis-conf.js

//后缀名的less的文件使用fis-parser-less编译
//modules.parser.less中的less表示的是LESS文件后缀名
//第二个less表示的是使用fis-parser-less插件进行编译
fis.config.set('modules.parser.less', 'less');
//将less文件编译为css
fis.config.set('roadmap.ext.less', 'css');
```

### 快速试用

在fis-conf.js同目录编写一个LESS文件

```css
body {
    .container {
        width: 980px;
    }
}
```

使用发布到当前

```bash
$ fis release -wd ./
```

可以看到同目录下出现一个同名的CSS文件

```css
body .container {
  width: 980px;
}
```

由于我们添加了 ```-w``` 参数，你还可以随意修改LESS文件，FIS将会自动监听文件修改，自动编译发布CSS文件

## 自动化

### 文件监视

通过文件监视功能，我们可以要求FIS在项目文件出现修改时，自动增量构建项目文件。并且增量构建是考虑了各种**嵌入关系**的，比如a.css文件内嵌了b.css文件，那么当b.css文件修改时，FIS会自动重新构建a.css和b.css两个文件。

可以使用快速入门中的fis-quickstart-demo试试看，首先开启文件监听功能

```bash
fis release --watch #fis release -w
```

随意修改项目内容，返回页面刷新即可查看到相应的变化。

### 自动刷新

我们只需要在文件监视的参数基础上添加 ```--live``` 或 ```-L``` 参数即可实现在项目文件发生修改后，自动刷新页面的功能，大幅提高页面制作效率。

```bash
fis release --watch --live #fis release -wL
```
随意修改项目内容，页面将会应用修改并自动刷新。

> 目前FIS采用的方案是在页面底部插入[liveload.js](https://github.com/livereload/livereload-js)来实现自动刷新，因此要求浏览器环境支持WebSocket。

### 快速部署

通过配置我们可以快速的将FIS的编译结果上传至指定的文件夹甚至远程服务器与后端联调，结合文件监视、自动刷新功能我们可以做到修改文件后自动更新远程服务器内容，并刷新调试页面。详细配置可以参见[deploy](/docs/api/fis-conf.html#deploy)。

更多的辅助开发能力可以参考[命令行](/docs/api/cli.html)。

<!--
## 功能介绍

* 超低学习成本，只须使用 ``1`` 条命令即可满足大量需求
* 可以高效的对各种静态资源进行压缩，提高页面性能
* 所有静态资源自动加 ``md5版本戳``，服务端可放心开启永久强缓存
* 内置强大的[图片合并](https://github.com/fex-team/fis-spriter-csssprites)功能，简单易用，
* 内置对html、js、css的 [三种语言能力](/docs/more/fis-standard.html) 扩展，解决绝大多数前端构建问题
* 内置本地开发调试服务器，支持完美运行 ``java``、``jsp``、``php`` 等服务端语言
* 支持文件监听，文件一旦修改，将会自动增量编译
* 支持浏览器自动刷新，可同时刷新多个终端中的页面，配合文件监听功能可实现保存即刷新
* 支持部署到远端服务器，配合文件监听，浏览器自动刷新功能，可实现保存即增量编译部署
* 可灵活扩展的插件系统，支持对构建过程和命令功能进行扩展，现已发布N多 [插件](https://npmjs.org/search?q=fis)
* 通过插件配置可以在一个项目中无缝使用 [less](https://github.com/fouber/fis-parser-less)、[coffee](https://github.com/fouber/fis-parser-coffee-script)、[markdown](https://github.com/fouber/fis-parser-marked)、[jade](https://npmjs.org/package/fis-parser-jade)等语言开发
* 可配置 [目录规范](/docs/api/fis-conf.html#roadmap)，使前端项目的开发路径与部署路径解耦
* 支持二次包装，比如 [spmx](https://github.com/fouber/spmx)、 [phiz](https://github.com/fouber/phiz/)、 [chassis](https://github.com/xspider/fis-chassis)，对fis进行包装后可内置新的插件、配置，从而打造属于你们团队的自己的开发工具
* 抹平编码差异，开发中无论是gbk、gb2312、utf8、utf8-bom等编码的文件，输出时都能统一指定为utf8无bom（默认）或者gbk文件
-->
