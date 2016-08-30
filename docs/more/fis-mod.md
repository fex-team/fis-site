---
layout: post
title: 如何利用FIS构建纯前端模块化方案- F.I.S
category: more
---

# 如何利用FIS构建纯前端模块化方案

## 引言

> 随着现代互联网的快速发展，Web2.0、HTML5、Web App、Hybird App等技术或概念的引入，以及浏览器终端性能的提升，前端开发已经不再仅仅是对制作静态页面或者使用脚本添加一些动态效果和内容，而是承载了更多的业务逻辑与功能。

> 然而作为前端承载的基础，无论是HTTP协议、浏览器内核、JavaScript、CSS等技术，虽然已经有了长足的发展，但是仍然无法满足如今的前端需求，因此为了解决这些先天存在的前端语言能力和性能问题，解决各种问题的手段和框架也层出不穷。而前端模块化就是目前解决这些语言能力问题最热门也是最基础的方法之一。

FIS在模块化思路上，没有考虑让前端承载过多的处理工作。实际上FIS除了拥有前端项目的压缩、合并等构建能力以外，还可以帮助你产出一份[map.json](http://fex-team.github.io/fis-site/docs/more/mapjson.html)，这份文件是整个FIS模块化思想中非常重要的一环，它描述了整个项目的静态资源的情况，将工具与具体的静态资源管理框架**解耦**。

FIS更加推崇利用这份静态资源报表，配合后端模版框架层面来管理页面的静态资源。这种管理模式是非常具有想象力和扩展空间的，不仅更加利于实现模版、脚本、样式的整体模块化能力，并且可以对项目提供更细粒度和更加智能的静态资源管理能力。更加详细的思路和实现方法可以查看[更多文档](http://fex-team.github.io/fis-site/docs/dev/more.html)中的前端工程化内容。

## 模块化思路

虽然FIS推荐采用后端扩展的形式来增强静态资源的管理能力，但是我们也意识到在不同的项目背景下，要求让大家立刻转为使用后端框架管理静态资源是非常困难和片面的。因此我们也结合FIS的静态资源管理思想，实现了一套在构建阶段就能完成静态资源管理的**纯前端**解决方案，同时又成功保留了简单的运行库、动态加载依赖、智能灵活的资源合并等FIS模块化思想的优势。

首先我们梳理一下模块化开发解决方案的基础目标

1. 能够像编写Nodejs一样编写前端代码，资源自动按需加载
1. 不仅仅是脚本模块化能力，模块应该一体化管理脚本、样式、模板
1. 能够提供自动化的性能优化能力，诸如资源压缩、MD5戳、资源合并等功能

让我们一步步解决这些需求

由于FIS内置了[依赖声明](http://fex-team.github.io/fis-site/docs/more/fis-standard-require.html)的语言能力，因此经过FIS构建的前端项目都会拥有一个带资源依赖关系的静态资源表

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

因此我们通过读取FIS产出的静态资源表可以直接获取到资源之间的依赖关系，我们就可以直接将这些资源按照依赖顺序注入到页面中即可。基于这个思路我们实现了一个用于自动加载模块化资源并注入页面的插件[fis-postpackager-autoload](https://github.com/hefangshi/fis-postpackager-autoload)，它将提供页面级的资源自动加载能力。

相应的，我们还需要在前端使用一套类似AMD/CMD规范的模块化加载库[Mod](https://github.com/fex-team/mod)，Mod的特点在于弱化了前端的依赖分析能力，通过FIS工具在构建时期完成这些繁重的工作。这样的优势是模块化加载库的功能更加单一，逻辑更加简单，并且将资源合并工作交给编译时或后端运行时解决，进一步降低复杂度。

但是光有这些，我们的资源都还是按照模块独立的进行加载，这样很明显是不符合我们的减少HTTP请求的目标的。这个问题听起来很耳熟，有没有想到如何解决？没错！就是使用我们在快速入门时介绍过的资源合并插件[fis-postpackager-simple](https://github.com/hefangshi/fis-postpackager-simple)，通过autoload插件注入资源依赖，再通过simple插件合并资源依赖，我们就像**拼积木**一样通过FIS构建出了一套高可用性的前端模块化解决方案。而上述方案组合出来的解决方案就是[fis-pure](http://fex-team.github.io/fis-site/docs/advance/modjs-solution.html)。


