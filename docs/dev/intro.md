---
layout: post
title: 二次开发
category: dev
---

# 二次开发

FIS具有高扩展性，可以通过配置进行各种目录结构等的定制，同时FIS拥有足够数量的插件，用户可以下载这些插件，配置使用。也可以按照自己的需求开发定制插件。可能有些人会问，如果插件多了后该如何维护。其实，FIS具有可包装性。比如现在市面上的[fis-plus](https://github.com/fex-team/fis-plus)、[gois](https://github.com/xiangshouding/gois)、[jello](https://github.com/fex-team/jello)、[spt](https://github.com/fouber/spt)等都是包装了FIS，可以使用这种包装性，把多个插件以及FIS包装成为新的一个工具。这就是为什么FIS会定义为工具框架的原因。

+ 简单的一个配置即可成为另外一个工具
+ 自定义插件+规范+... 一个解决诸多问题的解决方案

这些包装了FIS的扩展我们定义为**解决方案**，也许包装了只是一个简单的配置，如[spt](https://github.com/fouber/spt)，抑或是放置了很多自定义的插件、目录规范等的[fis-plus](https://github.com/fex-team/fis-plus)、[jello](https://github.com/fex-team/jello)、[gois](https://github.com/xiangshouding/gois)。

在二次开发这一栏，我们要探讨如何写一个插件，以及包装自己的解决方案。

+ [如何写插件](http://fex.baidu.com/fis-site/docs/dev/plugin.html)
+ [解决方案的包装](http://fex.baidu.com/fis-site/docs/dev/solution.html)

插件开发需要对FIS的基础原理做一些了解；

+ [编译过程运行原理](http://fex.baidu.com/fis-site/docs/more/fis-base.html)
+ [插件调用机制](http://fex.baidu.com/fis-site/docs/more/how-plugin-works.html)
+ [插件扩展点列表](http://fex.baidu.com/fis-site/docs/more/extension-point.html)
+ [基于map.json的前后端架构设计指导](http://fex.baidu.com/fis-site/docs/more/mapjson.html)

_如果嫌麻烦，也可以暂时不看原理部分，直接点击上面的链接进入实战，在实战的过程中对照参考_
