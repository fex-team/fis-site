---
layout: post
title: 详解roadmap- F.I.S
category: advance
---

# 详解roadmap

> 相信大家在使用FIS的过程中，roadmap的配置一直都难点之一，本文会详细讲解roadmap的配置方法。
> 本文介绍的内容是面向已经对FIS基本使用有一定了解，但是对roadmap配置有疑问的同学。建议与[roadmap文档](http://fis.baidu.com/docs/api/fis-conf.html#roadmap)对照阅读。

FIS无需任何配置即可自动理解前端项目进行构建工作，通过[配置API](/docs/api/fis-conf.html)，我们可以定制FIS的功能，而其中最复杂的配置就是 `roadmap` 了，通过此配置我们可以细粒度调整FIS的编译流程、产出目录结构、资源引用路径等一系列与最终产出内容密切相关的配置，因此可以说是FIS最重要的配置，使用好这个配置，我们可以满足各式各样的产出需求。

roadmap配置拥有三个配置项

* `path` 配置承载的功能是最多的，管理的是项目的目录规范，目录规范的定义后续详解。

* `ext` 配置用于指定非标准前端语言后缀名(less, coffe, md)与标准前端语言(css, js, html)间的映射关系。

* `domain` 配置用于设置静态资源的资源路径前缀，如CDN域名等等。

## 目录规范

前面已经提到，path配置的是目录规范，目录规范承载的含义包括：
    
1. **产出路径**，项目文件在构建后产出路径的规则，相关属性为 `release`
1. **资源引用路径**，项目文件在构建后引用路径的规则，相关属性为 `release`, `url`, `query`
1. **资源ID**，项目文件的资源ID生成规则，相关属性为 `id`
1. **默认依赖**，项目文件的默认依赖配置，相关属性为 `requires`
1. **编译属性**，针对项目文件配置编译属性，用于FIS编译和插件识别文件类型，在编译期进行不同的处理，相关属性参见[编译属性](#编译属性)章节

`roadmap.path` 配置是一个数组，每一项都是一条目录规则，目录规则由 `reg` 属性确定规则应用的文件，其余属性均为附加在此文件上的目录规范。

已经对配置规则有了解的同学也可以跳过此处，但是请 **务必** 关注一下roadmap.path配置需要注意的地方。 [传送门](#注意事项)

### 指定文件

规则中必备的属性就是 `reg` 属性，他用于指定这条规则适用的文件路径，`reg` 支持两种匹配规则

1. glob模式，是一种简单的目录匹配模式，`reg` 属性设置为**字符串**代表使用glob模式进行文件匹配

    通过 `*` 可以匹配一级目录下的任意文件，也可以通过 `*.js` 指定后缀名，还可以指定更详细的目录 `/a/*.js`。
    
    通过 `**` 可以匹配任意路径深度的文件或目录，通过灵活组合，可以快速的指定目录或文件
    
    ```
    /a/a.js
    /b.js
    /a/a/a.js
    
    *.js      => /b.js
    /a/*.js   => /a/a.js
    **.js     => /a/a.js,  /b.js, /a/a/a.js
    **/a/*.js => /a/a/a.js
    ```
2. 正则模式，极为灵活强大的路径匹配方法，reg属性设置为 **正则表达式** 则代表使用正则模式进行文件匹配。

    基于正则模式，我们可以满足各种路径部署需求，关于正则的使用说明，请参考[不完全正则指南](/docs/more/regex.html)

    ```
    /modules/moduleA/a.js
    /modules/moduleA/a.css
    
    /^\/modules\/(.*)/i => /modules/moduleA/a.js, /modules/moduleA/a.css
    ```
    
    `/^\/modules\/(.*)/i` 这个正则匹配了/modules目录下的所有文件，并且通过设置了正则捕获组，将modules目录后的整个路径都保存到分组1中了，即对于`/modules/moduleA/a.js`文件，这个正则不仅匹配了整体路径，还将`moduleA/a.js`这个路径保存到了分组1中，我们可以在[产出目录](#产出目录)和[资源ID](#资源ID)一节使用这个值调整产出目录。

举个例子

```javascript
fis.config.set('roadmap.path',[
    {
        reg: /^\/modules\/(.*)/i,
        release: '/static/$1'
    },
    {
        reg: "**.html",
        release: '$&'
    }
]);
```

我们通过`reg`属性设置了规则的匹配条件，就可以将当前规则内设置的各种属性设置给匹配成功的文件了。接下来看看我们可以设置哪些目录属性。

### 产出目录

通过release属性我们可以调整文件的产出目录，比如我们希望将modules目录下的内容都保存到static文件夹中，同时还要保持原有的内部文件夹结构该怎么办呢？

首先我们需要先设置reg属性匹配到modules文件夹，如[指定文件](#指定文件)一节中提到的，我们设定 `/^\/modules\/(.*)/i` 匹配modules文件夹，同时将内部文件夹结构保存在了分组1中，那么我们就可以在release时通过`$1`来替换这个内部文件夹结构。

因此我们将release设置为`/static/$1`， 还记得$1的内容是`moduleA/a.js`么？通过$1引用捕获路径我们就可以将`/modules/moduleA/a.js` 在产出目录中移动到 `/static/moduleA/a.js`了。

```javascript
fis.config.set('roadmap.path',[
    {
        reg: /^\/modules\/(.*)/i,
        release: '/static/$1'
    }
]);
```

![](https://raw.githubusercontent.com/hefangshi/doc/127ff7dcbba76b53c3b73c3c42e4723ac52380ef/pic/path.png)

当然，使用glob规则我们也可以移动文件，但是由于没有正则捕获组的支持，我们只能通过`$&`获取整体路径，比如通过下面这个规则，我们可以将所有html文件在产出目录中移动到/page目录下

```javascript
fis.config.set('roadmap.path',[
    {
        reg: '**.html',
        release: '/page/$&'
    }
]);
```

### 资源引用路径

当我们通过release设置调整了产出目录中的目录结构后，FIS会自动帮助我们调整各种资源引用路径，来保证各个资源间的引用关系是正确的。

```html
<!-- index.html -->

<!-- source code -->
<script src="/modules/moduleA/a.js"></script>

<!-- after fis release -->
<script src="/static/moduleA/a.js"></script>
```

可是人生不如意事十之八九，总会因为各种原因我们的url路径和实体文件的路径无法匹配，举个例子，express中设定了静态资源目录后，静态资源uri路径是无需加上静态资源目录的，因此我们需要通过`<script src="/moduleA/a.js"></script>`来引用资源。

那么如何通过配置让FIS能够支持这种特殊需求呢？我们可以添加`url`参数来指定文件的资源引用路径。

```javascript
fis.config.set('roadmap.path',[
    {
        reg: /^\/modules\/(.*)/i,
        release: '/static/$1',
        url: '/$1'
    }
]);
```

通过这样的配置，我们就会发现FIS构建完成后，虽然a.js仍然在`/static/moduleA/a.js`目录中，但是a.js的资源引用都变成了`<script src="/moduleA/a.js"></script>` ，问题完美解决，可喜可贺(•̀ᴗ•́)و

除了路径调整外，FIS还可以通过设置，调整资源引用的`query`，通过这个功能，你可以用他进行自动添加时间戳之类的功能

```javascript
fis.config.set('roadmap.path',[
    {
        reg: /^\/modules\/(.*)/i,
        release: '/static/$1',
        query: '?t=20140620',
        url: '/$1'
    }
]);
```

这样资源引用地址就会进一步的变成`<script src="/moduleA/a.js?t=20140620"></script>`

当然后续可能还会有一些对资源引用路径的更多的调整，比如添加CDN域名等，但是这部分内容不建议在url属性中配置，这样会导致开发调试变的困难，FIS设置了专门的配置来解决发布前CDN域名替换的问题。

### 资源ID

资源ID设置的意义主要在于模块化开发时可以通过更短的ID进行依赖声明，如果不打算使用模块化开发，可以暂且略过此节。

```javascript
require('/modules/moduleA/a.js'); //now

require('moduleA/a'); //wanted
```

我们可以通过设置规则中的`id`属性来满足这项需求，当然正则捕获组又要立功啦。

```javascript
fis.config.set('roadmap.path',[
    {
        reg : /^\/modules\/(.*)\.js$/i,
        id : '$1',
        release : '/static/$1.js'
    },
]);
```

我们稍微调整了一下捕获的内容，将`.js`排除在捕获组外，这样我们就可以直接将分组1的内容赋给id属性，对于 `/modules/moduleA/a.js` ，`$1`的内容是 `moduleA/a` ，引用起来是不是更加方便了呢？搞定，看下一个！

### 默认依赖

默认依赖的设置用于批量添加一些基础资源的依赖，而不用在每个文件中重复添加，比如最常见的base.css， 我们可以设置所有样式都依赖这个基础样式，这样输出map.json文件时，依赖中就会自动添加base.css项。

```javascript
fis.config.set('roadmap.path',[
    {
        reg : "**.css"
        requires : ['/css/base.css']
    },
]);
```

### 编译属性

FIS提供了大量的编译属性用于控制核心编译流程与插件编译的处理方式，大致可以分为以下几类

* 语言能力扩展设置

    * ``isHtmlLike``：指定对文件进行html相关的 [语言能力扩展](http://fis.baidu.com/docs/more/fis-standard.html)
    * ``isJsLike``：指定对文件进行js相关的 [语言能力扩展](http://fis.baidu.com/docs/more/fis-standard.html)
    * ``isCssLike``：指定对文件进行css相关的 [语言能力扩展](http://fis.baidu.com/docs/more/fis-standard.html)

* 编译流程控制
    * ``useCompile``：指定文件是否经过fis的编译处理，如果为false，则该文件不会做任何编译处理。
    * ``useParser``：指定文件是否经过parser插件处理。默认为true。
    * ``usePreprocessor``：指定文件是否经过preprocessor插件处理。默认为true。
    * ``useStandard``：指定文件是否经过内置的三种语言标准化流程处理。默认为true。
    * ``usePostprocessor``：指定文件是否经过postprocessor插件处理。默认为true。
    * ``useLint``：指定文件是否经过lint插件处理。默认为true。
    * ``useTest``：指定文件是否经过test插件处理。默认为true。
    * ``useOptimizer``：指定文件是否经过optimizer插件处理。
    * ``useSprite``：指定文件是否进行csssprite处理。默认是 ``false``，即不对单个文件进行csssprite操作的，而只对合并后的文件进行。

* 特殊控制
    * ``useHash``：指定文件产出后是否添加md5戳。默认只有js、css、图片文件会添加。
    * ``useDomain``：指定文件引用处是否添加域名。
    * ``useCache``：指定文件编译过程中是否创建缓存，默认值是 ``true``。
    * ``useMap``：指定fis在打包阶段是否将文件加入到map.json中索引。默认只有isJsLike、isCssLike、isMod的文件会加入表中
    * ``isMod``：标记文件为组件化文件。被标记成组件化的文件会入map.json表。并且会对js文件进行组件化包装。

* 杂项
    * ``extras``：在map.json中的附加数据，用于扩展map.json表的功能。


其中**特殊控制**是大家经常会问到的地方，建议再看一遍！

通过语言能力扩展设置，我们可以调整文件在语言标准化处理流程中的处理规则、通过编译流程控制，我们可以细粒度的控制文件的编译流程。

特殊控制的分类可能有些不恰当，但是这几项都是roadmap.path配置中需要额外关注的配置。 `useHash`, `useDomain`, `useCache` 三项对应了 `fis release` 中的三个参数 `--md5`, `--domain`, `--clean`，通过设置这三个参数我们可以细粒度的控制静态资源在上述三种处理中的表现。

### 注意事项

看到大家已经对roadmap.path的配置有了一个总体了解，但是这个配置是有**潜规则**的！所以请大家集中注意力，仔细看看下面的内容。

#### 多次配置

roadmap.path **不建议**多次配置，由于roadmap.path本身是一个数组，因此如果多次 ```fis.config.set``` ，后一次的设置会覆盖前一次的设置，而 ```fis.config.merge``` 则完全无效，并且会提示无法merge此属性。

如果想要干预已经设置过的roadmap.path，可以使用 ```fis.config.get('roadmap.path')``` 取出配置后操作roadmap.path数组。

比如希望添加一个高优先级的处理设置，则可以通过unshift将规则插入配置

```javascript
fis.config.get('roadmap.path').unshift({
    reg : '**.css',
    extra : {
        blahblah : true
    }
});
```

#### 优先级

roadmap.path 是 **顺序敏感** 的，每个文件在处理过程中都会使用roadmap.path从上到下对文件路径进行匹配，一旦匹配成功，就会停止匹配，并将匹配项的配置赋给文件。因此 **最顶部的规则，优先级越高** 。此外即使一个文件可以匹配多个规则，也只会获得 **第一次** 匹配的配置。

举个例子，我们可能已经有了一个配置，这个配置的含义是将/modules文件夹下的内容都复制到/static/modules下

```javascript
fis.config.set('roadmap.path',[
    {
        reg: /^\/modules\/(.*)/i,
        release: '/static/$1'
    }
]);
```

但是我们可能会希望一些文件进行特殊的设置，比如设置所有CSS文件进行图片合并。

```javascript
fis.config.set('roadmap.path',[
    {
        reg: /^\/modules\/(.*\.css)$/i,
        useSprite: true
    },
    {
        reg: /^\/modules\/(.*)/i,
        release: '/static/$1'
    }
]);
```

看似我们设置的很正确，但是一旦执行构建，你就会发现所有modules文件夹下的css文件没有被产出到static目录下，这就是因为CSS文件已经命中了第一条规则，而第一条规则中没有release属性，因此就无法产出到static目录中。如何修改正确？自然就是给第一条规则也加上同样的release设置使其和原输出目录保持一致。

#### 引用配置

比如[资源引用路径](#资源引用路径)的时间戳功能，我们可能希望不用自己写具体的日期，实际上规则的release属性支持配置替换能力，举个例子

```javascript
fis.config.set('static','/static');

fis.config.set('roadmap.path',[
    {
        reg: /^\/modules\/(.*)/i,
        release: '${static}/$1'
    }
]);
```

上面的例子中release中没有直接写`/static/$1`而是写为了`${static}/$1` ，FIS会将配置中的static属性自动替换`${static}`，那么自动生成时间戳该怎么写呢？不妨自己试试看=v=

## 后缀映射

roadmap.ext是FIS设置中一个非常精巧的配置，通过这个配置我们再处理less, coffee, uct等非标准语言时会非常方便。举个例子，我们通过roadmap.path配置将所有的脚本文件使用uglifyjs压缩，并输出到指定目录

```javascript
//此处实际上是FIS的默认配置，无需额外设置
fis.config.merge('module', {
    optimizer: {
        js : 'uglify-js'
    }
});

fis.config.set('roadmap.path',[
    {
        reg: '**.js',
        release: '/static/$1'
    }
]);
```

同时我们将CoffeeScript也引入到了我们的项目中，他的后缀名是*.coffee，那么我们通过parser的配置可以将CoffeeScript文件转为Javascript文件。

```javascript
fis.config.merge('module', {
    parser: {
        coffee : 'coffee-script'
    }
});
```

那么很自然的，我们会希望CoffeeScript通过parser处理后生成的内容可以按照Javascript文件的标准进行处理，这里就是`roadmap.ext`配置的用武之地了。

```javascript
fis.config.merge({
    roadmap : {
        ext : {
            //coffee后缀的文件将输出为js文件
            //并且在parser之后的其他处理流程中被当做js文件处理
            coffee : 'js',
        }
    }
});
```

这样配置后，我们就会发现所有coffee文件都被编译为了js文件，并且也会按照我们的第一条 `roadmap.path` 配置，在压缩后被移动到static目录下，无需再为 `*.coffee` 文件独立设置一条 `roadmap.path` 。

## 域名配置

domain配置用于满足在代码部署上线时添加CDN或域名子目录需求，具体的使用方式可以参考[文档](http://fis.baidu.com/docs/api/fis-conf.html#roadmapdomain)，本文将会主要介绍一下域名子目录为何需要使用domain来处理。

为了扩展前端语言能力，完善资源定位功能，FIS会将所有相对路径改为绝对路径，具体原因可以参见[FAQ#86](https://github.com/fex-team/fis/issues/86)

但是我们解决了资源定位能力后会发现一旦我们部署到诸如 http://hefangshi.github.io/fis-pure-demo 这类子目录时，由于资源路径是绝对路径，就会导致资源找不到的情况。

![](https://raw.githubusercontent.com/hefangshi/doc/master/pic/domain.png)

那么在这种情况，我们也可以利用roadmap.domain来调整我们的静态资源在发布时的目录来满足发布时的需求

```javascript
fis.config.merge({
    roadmap : {
        domain : "http://hefangshi.github.io/fis-pure-demo"
    }
});
```

我们的项目在通过 ``` fis release --domain``` 添加了domain后资源引用的路径就变为了

```html
<script src="http://hefangshi.github.io/fis-pure-demo/static/moduleA/a.js"></script>
```

这样就解决了绝对路径与子目录之间的冲突问题。

我们之所以不在roadmap.path的配置中完成子目录的调整是为了同时满足本地调试需要和发布上线的需要，通过domain参数，我们可以使开发时的资源引用路径与发布时的资源引用路径分离，更加方便开发工作。

## 最后

roadmap的配置的确较为生涩，建议大家的使用的过程中多尝试，上手后就会发现roadmap配置能力是十分灵活强大的，我们也会进一步的改进FIS，让roadmap的配置更加容易上手，如果有好的建议也非常非常欢迎[反馈](https://github.com/fex-team/fis/issues/new) ;)

The End.