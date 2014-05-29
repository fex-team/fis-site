---
layout: post
title: 前端模块化- F.I.S
category: advance
---

# 前端模块化

> 随着现代互联网的快速发展，Web2.0、HTML5、Web App、Hybird App等技术或概念的引入，以及浏览器终端性能的提升，前端开发已经不再仅仅是对制作静态页面或者使用脚本添加一些动态效果和内容，而是承载了更多的业务逻辑与功能。

> 然而作为前端承载的基础，无论是HTTP协议、浏览器内核、JavaScript、CSS等技术，虽然已经有了长足的发展，但是仍然无法满足如今的前端需求，因此为了解决这些先天存在的前端语言能力和性能问题，解决各种问题的手段和框架也层出不穷。而前端模块化就是目前解决这些语言能力问题最热门也是最基础的方法之一。

## 纯前端模块化方案

已经对FIS有过了解的同学一定知道FIS的模块化思路是依托于静态资源表[map.json](/docs/more/mapjson.html)与后端静态资源管理框架来进行细粒度的模块化管理工作，但是这也对很多希望使用FIS的同学造成了困扰，是不是不进行后端扩展，就无法将FIS与模块化管理紧密的结合在一起了呢？答案当然是否定的，无论出于什么原因，即使无法对后端进行任何扩展，甚至项目就是一个类似Backbone或者Angularjs的纯前端网站，我们也是可以使用FIS来进行模块化开发的。

为了降低大家的使用门槛，我们通过FIS的[二次封装能力](/docs/dev/solution.html)，封装了一个功能完备的纯前端模块化方案[pure](https://github.com/fex-team/fis-pure)。接下来就让我们使用[pure](https://github.com/fex-team/fis-pure)，体验一下在FIS构建能力的支持下，如何轻松的完成一个**高性能**的纯前端模块化项目的构建与优化工作。

### pure安装

[pure](https://github.com/fex-team/fis-pure)与[fis](https://github.com/fex-team/fis)一样，使用[npm](http://npmjs.org)包管理进行安装。pure的npm包名称为**fis-pure**

```bash
$ npm install -g fis-pure
$ pure -v
```

### 示例准备

与快速入门中的示例项目一样，我们可以使用[Lights包管理](http://lightjs.duapp.com/)安装，也可以从[Github](https://github.com/hefangshi/fis-pure-demo)获取。

```bash
$ npm install -g lights #如果没有安装lights，请先安装
$ lights install fis-pure-demo
```

在构建这个DEMO项目之前，我们可以先粗略的浏览一下项目情况

首先[fis-pure-demo](https://github.com/hefangshi/fis-pure-demo)与[fis-quickstart-demo](https://github.com/hefangshi/fis-quickstart-demo)都是一个TODO DEMO

但是对比一下可以发现，两个项目最大的区别在于fis-quickstart-demo得index.html中包含了大量的脚本和样式资源引用，而在fis-pure-demo中，我们只看到了对[Mod](https://github.com/fex-team/mod)库的引用。

其次通过浏览两者的脚本文件，我们会发现fis-quickstart-demo的脚本中都添加了 ```define``` 包装

```javascript
define('main', function(require, exports, module){
    //content
}
```

而在fis-pure-demo中，则完全看不到 ```define``` 的痕迹，只有与Node.js模块化语法完全一致的 ```require``` 与 ```module.exports```。

### 发布预览

首先我们不附加任何优化参数，进行发布预览

```bash
$ pure release
$ pure server start
```

打开页面，我们会发现fis-pure-demo与fis-quickstart-demo一样，在页面内准确的引用了需要的脚本与样式资源。而这不同之处在于，这些资源的引用不再需要人工维护，只要使用[pure](https://github.com/fex-team/fis-pure)进行构建工作，不需要任何配置就可以自动完成资源的加载。

当然，我们会发现所有的资源引用都是独立的，发起了大量的HTTP请求，并且随着网站复杂度的提升，这个问题也会越来越严重。可能有的同学已经想到，我们可以使用FIS的资源合并能力对当前项目进行性能优化。

### 性能优化

综合一下我们在快速入门中学到的优化命令，我们为fis-pure-demo进行资源压缩、添加md5戳、资源合并等性能优化工作

```bash
$ pure release -pmo
```

经过简单的一个命令，我们再次刷新页面，可以看到请求数已经大幅减少，可以尝试不同的release优化参数，感受不同的优化参数带来的不同体验。

简单的几个步骤，我们就实现了模块化资源的自动加载以及完全脱离后端的资源管理能力，是不是感觉很不错呢？不妨自己写一个小DEMO体验一下静态资源自动化管理、性能优化简单可依赖的快感吧！

### 了解更多

可能有的同学会问了，这个pure到底是个什么东西，和FIS是什么关系？想做纯前端的模块化开发就只能用pure了么？

实际上pure只是通过FIS的解决方案封装能力封装而成，其底层核心仍然是FIS，与FIS不同之处在于默认集成了一些功能扩展插件，比如用于模块化资源自动加载的[fis-prepackager-autoload](https://github.com/hefangshi/fis-prepackager-autoload)以及静态资源自动合并插件[fis-prepackager-combine](https://github.com/hefangshi/fis-prepackager-combine)。

除此之外，pure还对模块化开发提供了一个目录规范参考，具体可以参见[pure](https://github.com/fex-team/fis-pure)的文档内容。

而上述的这些集成实际上都是十分简单快速的，只需要通过[package.json](https://github.com/fex-team/fis-pure/blob/master/package.json#L24-L29)添加需要默认安装的插件，并通过与 ```fis-conf.js``` 语法一致的配置API开启插件并添加一些默认的目录配置即可（[源码](https://github.com/fex-team/fis-pure/blob/master/pure.js)）。

所以你也可以参照pure去实现一套属于你自己的解决方案，可能你不需要underscore的前端模版预编译功能，而是需要handlebars的前端模版预编译功能，那么简单的将[fis-parser-utc](https://github.com/fouber/fis-parser-utc)替换成[fis-parser-handlebars](https://github.com/fouber/fis-parser-handlebars)。希望能够混合使用CoffeeScript与JavaScript？没问题，只需要添加[fis-parser-coffee-script](https://github.com/fouber/fis-parser-coffee-script)即可，FIS就像乐高积木一样，你可以不断的在FIS的基础上添砖加瓦，定制属于你自己的解决方案。

可是有时候只想自己用一下，不希望发布解决方案这么麻烦？当然可以，你还可以像[modjs-autoload-demo](https://github.com/hefangshi/modjs-autoload-demo)一样通过[项目配置](https://github.com/hefangshi/modjs-autoload-demo/blob/master/fis-conf-with-combine.js)，达到pure一样的效果。

总而言之，FIS的优势在于灵活的定制、扩展、封装能力，并且通过内建的[语言能力扩展](/docs/more/fis-standard.html)能力，解决了大量复杂繁重的工作，让开发插件变成一种乐趣。无论是个人使用，还是大中小各种规模的团队，都可以通过FIS满足自己的开发需求。

## 模块化思路

体验完了FIS带来的前端模块化方案，有兴趣的话，我们可以再进一步的了解一下FIS的模块化思路。

### 模块化方案对比

实际上如果是关注前端模块化这个话题的同学肯定已经了解目前业内已经有了比较流行的前端模块化解决方案，比如[RequireJS](www.requirejs.org)或者国内的[Sea.js](http://seajs.org/)，这些模块化解决方案的基本思路均是通过对代码进行静态分析，获取各个脚本模块之间的依赖关系，根据依赖关系在前端进行动态加载。

<!-- 
而按照上述思路实现的模块化解决方案实际上会有其前端局限性，比如相对更复杂的运行库、无法通过逻辑判断声明动态依赖关系、异步加载CSS造成页面闪动、对后端Combo服务依赖性强等问题。总结一下就是受前端语言能力所限，纯前端的模块化解决方案很难在复杂项目中完成细粒度的资源管理和性能优化工作。 -->

而FIS在模块化思路上，则从一开始就没有考虑让前端承载过多的处理工作。实际上FIS除了拥有前端项目的压缩、合并等构建能力以外，还可以帮助你产出一份[map.json](/docs/more/mapjson.html)，这份文件实际上是整个FIS体系中非常重要的一环，它描述了整个项目的静态资源的情况，FIS更加推荐利用这份静态资源报表，配合后端模版框架层面来管理页面的静态资源。这种管理模式是非常具有想象力和扩展空间的，不仅更加利于实现模版、脚本、样式的整体模块化能力，而且可以对项目提供更细粒度和更加智能的静态资源管理能力。更加详细的思路和实现方法可以查看[更多文档](/docs/dev/more.html)中的前端工程化内容。

然而虽然FIS推荐采用后端扩展的形式来增强静态资源的管理能力，但是我们也意识到在不同的项目背景下，要求让大家立刻转为使用后端框架管理静态资源是非常困难和片面的。因此我们也结合FIS的静态资源管理思想，实现了一套在构建阶段就能完成静态资源管理的**纯前端**解决方案，而同时又成功保留了简单的运行库、动态加载依赖、智能灵活的资源合并等FIS模块化思想的优势。

### FIS与纯前端模块化

首先我们梳理一下纯前端的模块化开发解决方案的基础目标

1. 能够像编写Nodejs一样编写前端代码，资源自动按需加载
1. 不仅仅是脚本模块化能力，模块应该一体化管理脚本、样式、模板
1. 能够提供自动化的性能优化能力，诸如资源压缩、MD5戳、资源合并等功能

让我们一步步解决这些需求

由于FIS内置了[依赖声明](/docs/more/fis-standard-require.html)的语言能力，因此经过FIS构建的前端项目都会拥有一个带资源依赖关系的静态资源表

```javascript
{
    "res" : {
        "demo.css" : {
            "uri" : "/static/css/demo_7defa41.css",
            "type" : "css"
        },
        "demo.js" : {
            "uri" : "/static/js/demo_33c5143.js",
            "type" : "js",
            "deps" : [ "demo.css" ]
        },
        "index.html" : {
            "uri" : "/index.html",
            "type" : "html",
            "deps" : [ "demo.js", "demo.css" ]
        }
    },
    "pkg" : {}
}
```

因此我们通过读取FIS产出的静态资源表可以直接获取到资源之间的依赖关系，我们就可以直接将这些资源按照依赖顺序注入到页面中即可。基于这个思路我们实现了一个用于自动加载模块化资源并注入页面的插件[fis-prepackager-autoload](https://github.com/hefangshi/fis-prepackager-autoload)，它将提供页面级的资源自动加载能力。

相应的，我们还需要在前端使用一套类似AMD/CMD规范的模块化加载库[Mod](https://github.com/fex-team/mod)，Mod的特点在于弱化了前端的依赖分析能力，通过FIS工具在构建时期完成这些繁重的工作。这样的优势是模块化加载库的功能更加单一，逻辑更加简单，并且将资源合并工作交给编译时或后端运行时解决，进一步降低复杂度。

但是光有这些，我们的资源都还是按照模块独立的进行加载，这样很明显是不符合我们的减少HTTP请求的目标的。这个问题听起来很耳熟，有没有想到如何解决？没错！就是使用我们在快速入门时介绍过的资源合并插件[fis-postpackager-combine](https://github.com/hefangshi/fis-postpackager-combine)，通过autoload插件注入资源依赖，再通过combine插件合并资源依赖，我们就像**拼积木**一样通过FIS构建出了一套高可用性的前端模块化解决方案，最终的产出，就是我们前文中介绍的[pure](https://github.com/fex-team/fis-pure)
