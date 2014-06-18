---
layout: post
title: 更多文档- F.I.S
category: advance
---

# 更多文档

## 原理文章

### FIS原理

 - [三种语言能力](/docs/more/fis-standard.html)
 - [编译过程运行原理](/docs/more/fis-base.html)

### 性能优化

 - [静态资源版本更新与缓存](http://www.infoq.com/cn/articles/front-end-engineering-and-performance-optimization-part1)

### 插件系统

 - [插件调用机制](/docs/more/how-plugin-works.html)
 - [插件扩展点列表](/docs/more/extension-point.html)

### 前端工程化

 - [基于map.json的前后端架构设计指导](/docs/more/mapjson.html)，利用FIS的核心产出map.json与后端相结合进行前端工程化优化的基础原理
 - [静态资源管理与模板框架](http://www.infoq.com/cn/articles/front-end-engineering-and-performance-optimization-part2/)，基于map.json的前端工程化实现思路其二
 - [前端工程之模块化](http://fex.baidu.com/blog/2014/03/fis-module/)，详细描述了如何搭建一个完备的前端模块化系统
 - [如何高效地管理网站静态资源](http://fex.baidu.com/blog/2014/04/fis-static-resource-management/)，脱离FIS，从抽象层面描述了静态资源管理思路
 - [手机百度前端工程化之路](http://mweb.baidu.com/p/baidusearch-front-end-road.html)，针对移动端的缓存现状，利用后端模板框架实现资源管理

### FIS杂谈

 - [FIS与FIS-PLUS的区别](http://fex.baidu.com/blog/2014/03/fis-plus/)
 - [如何利用FIS构建纯前端模块化方案](/docs/more/fis-mod.html)

<i class="anchor" id="solution"></i>

## 更多解决方案

### 后端静态资源管理

这里列举的是一些基于FIS扩展出的更完备的解决方案，建议希望自己搭建如[基于map.json的前后端架构设计指导](/docs/more/mapjson.html)文中描述的细粒度静态资源管理框架的朋友可以对照参考。

 - [fis-plus](/fis-plus)：适用于PHP+Smarty后端选型
 - [jello](https://github.com/fex-team/jello)：适用于Java+Velocity后端选型
 - [goiz](https://github.com/xiangshouding/gois)：适用于go+martini后端选型
 - [fis-php-md](https://github.com/fouber/fis-php-md.js)：适用于纯PHP后端选型


### 前端静态资源管理

这里列举的是传统的前端静态资源管理方案，供尚无法对后端框架进行扩展的朋友参考使用。

 - [fis-pure](https://github.com/fex-team/fis-pure)：适用于纯前端的模块化开发
 - [spmx](https://github.com/fouber/spmx)：适用于Sea.js+FIS
