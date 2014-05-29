---
layout: post
title: 资源合并- F.I.S
category: beginning
---

# 资源合并

> 通过FIS，我们可以引入多种静态资源管理模式，比如百度内部使用的FIS-PLUS解决方案，通过Smarty插件扩展的形式收集静态资源，同时可以根据模块的线上调用统计日志智能化的进行资源合并管理。

> 关于FIS的静态资源管理思路，可以参考 [静态资源管理与模板框架](http://www.infoq.com/cn/articles/front-end-engineering-and-performance-optimization-part2/)，但是这里描述的是一种较完备的方案，需要根据后端的技术选型进行一些后端模板开发。本篇指南则是介绍一种利用FIS在构建阶段自动完成资源合并工作的方法，使用成本更加低，更加适合中小型项目。

## 示例准备

本篇指南使用的示例与资源压缩指南中使用的是相同的示例，示例项目的准备工作可以参考[资源压缩](/docs/beginning/getting-started.html)

为了达到静态资源自动合并的目的，我们需要扩展FIS的功能，添加插件[fis-postpackager-combine](https://github.com/hefangshi/fis-postpackager-combine)，它的功能是收集页面中的已有的script和link标签，将这些标签引用的资源进行自动合并，并将原有的script和link标签替换为自动合并后的标签，最终达到页面级的静态资源合并能力。

## 插件安装

> FIS的编译系统拥有一个使用简单、扩展方便的插件体系，这套插件体系保证了FIS编译工具的灵活性和生命力。这里我们简单介绍一下FIS插件的安装方法，更加详细的插件系统介绍可以查看配置API [modules](/docs/api/fis-conf.html#modules)。

插件的安装分为两步，首先我们需要通过[npm](http://npmjs.org)包管理工具进行插件安装

```
$ npm install -g fis-postpackager-combine
```

插件安装到本地后，我们还需要通过项目配置文件开启插件，修改项目根目录下的fis-conf.js配置，加入combine插件

```
$ cd fis-quickstart-demo
$ vi fis-conf.js
```

```javascript
//file : fis-conf.js
fis.config.set('modules.postpackager', 'combine');
```

## 资源合并

### 查看项目

首先我们按照快速入门中的方法开启本地预览服务器

```bash
$ cd fis-quickstart-demo
$ fis release --optimize
$ fis server start #如果8080端口被占用，使用-p参数设置可用的端口，可以忽略Java与PHP环境依赖的报错
```

查看一下示例项目，我们可以发现所有的静态都是独立加载的。

### 资源合并优化

对于[减少HTTP连接数](http://www.baidu.com/?isidx=1#wd=%E5%87%8F%E5%B0%91HTTP%E8%BF%9E%E6%8E%A5%E6%95%B0)的必要性在这里我们就不再赘述。让我们直接试试看在combine插件支持下，如何通过FIS对这些独立的请求进行合并。

```bash
$ fis release --optimize --pack
```

如果觉得参数输入比较麻烦，实际上也有等价的更短的命令可以灵活组合，更多的参数可以参考[命令行](/docs/api/cli.html)。

```bash
$ fis release -op
```

再次浏览我们可以发现所有的脚本资源均被自动合并为了一个文件，并且原来的script标签的引用路径也被自动替换为合并文件的路径。

不仅如此，combine插件还自动将原来在顶部的脚本资源引用移动到了页面最下方，进一步的加快了页面的展现速度，关于combine插件更多的静态资源处理策略和使用方法，请参考[fis-postpackager-combine](https://github.com/hefangshi/fis-postpackager-combine#%E9%9D%99%E6%80%81%E8%B5%84%E6%BA%90%E5%A4%84%E7%90%86%E7%AD%96%E7%95%A5)。

### 人工干预合并

我们可以通过[pack](/docs/api/fis-conf.html#pack)设置来干预合并结果。人工干预的必要性在于我们可以将类似underscore、jquery、backbone等基础库固定打包，首先我们可以让不同页面之间公用这些基础库而不用重新下载，其次由于基础库不容易改变，这种策略也对缓存更加友好。

修改fis-conf.js配置，加入pack配置

```javascript
fis.config.set('pack', {
    'pkg/lib.js': [
        '/lib/mod.js',
        '/modules/underscore/**.js',
        '/modules/backbone/**.js',
        '/modules/jquery/**.js',
        '/modules/vendor/**.js',
        '/modules/common/**.js'
    ]
});
```

再次运行FIS构建项目

```bash
$ fis release -op
```

我们会发现原有的 ```auto_combine_0.js``` 被分解为了 ```auto_combine_0.js``` 和 ```lib.js``` ，```lib.js``` 被独立打成了一个包。

### 合并图片

通过上述几个步骤，我们已经成功将脚本资源和样式表资源进行了合并，但是为了进一步的减少HTTP连接数，我们还可以对引用的图片资源进行进一步的合并。

用于图片合并的插件[csssprites](https://github.com/fex-team/fis-spriter-csssprites)已经在FIS中内置了，因此无需安装，只需要在fis-conf.js的配置中开启即可

```javascript
//为所有样式资源开启csssprites
fis.config.set('roadmap.path', [{
    reg: '**.css',
    useSprite: true
}]);
//设置csssprites的合并间距
fis.config.set('settings.spriter.csssprites.margin', 20);
```

> 使用csssprites合并的图片需要在图片路径处添加query标识，示例项目中已经预先添加，更详细的使用方法可以参考[使用文档](https://github.com/fex-team/fis-spriter-csssprites#%E4%BD%BF%E7%94%A8)

再次运行FIS构建项目

```bash
$ fis release -op
```

再次查看项目，添加几个待办项，我们会发现所有待办项的图片都合并在了一张图片中。

## 写在最后

至此，我们完整的演示了如何使用FIS对一个传统的Web项目如何进行资源压缩、合并等优化工作，大幅提高网站性能，并且整个过程需要的配置文件也非常的少，而配置完成后仅需一个命令，就可以完成一系列的优化工作，节约大量的手工维护成本。

但是这样就满足还是太早了，有没有觉得就算有了资源自动合并，但是每次还要手动的添加资源引用是一件非常繁琐的事情，并且可能有一天某个资源已经不需要使用了，还需要去手工维护这段代码的引用是不是非常烦恼呢？

实际上这些问题都可以用前端模块化来解决，通过前端模块化开发，我们可以不再担心各种资源加载问题，就像编写Node.js程序一样编写前端项目。那么除了业界流行的各种前端模块化加载库，FIS也提供了一种新的思路来解决模块化加载问题，点击[前端模块化](/docs/advance/modjs-solution.html)了解更多。
