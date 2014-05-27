---
layout: post
title: 二次开发
category: dev
---

## 二次开发

FIS具有高扩展性，可以通过配置进行各种目录结构等的定制，同时FIS拥有足够数量的插件，用户可以下载这些插件，配置使用。也可以按照自己的需求开发定制插件。可能有些人会问，如果插件多了后该如何维护。其实，FIS具有可包装性。比如现在市面上的[fis-plus][fis-plus]、[gois][gois]、[jello][jello]、[spt][spt]等都是包装了FIS，可以使用这种包装性，把多个插件以及FIS包装成为新的一个工具。这就是为什么FIS会定义为工具框架的原因。

+ 简单的一个配置即可成为另外一个工具
+ 自定义插件+规范+... 一个解决诸多问题的解决方案

这些包装了FIS的扩展我们定义为**解决方案**，也许包装了只是一个简单的配置，如[spt][spt]，抑或是放置了很多自定义的插件、目录规范等的[fis-plus][fis-plus]、[jello][jello]、[gois][gois]。

在二次开发这一栏，我们要探讨如何写一个插件，以及包装自己的解决方案。

+ [如何写插件](/docs/dev/plugin.html)
+ [解决方案的包装](/docs/dev/solution.html)

首先说明一些原理

### 编译过程运行原理

> fis的编译过程可以分为两个阶段： **单文件编译** 和 **打包**。处理流程如下图

![编译流程](https://raw.githubusercontent.com/fouber/fis-wiki-img/master/workflow.png)

#### 单文件编译过程 ( [源码](https://github.com/fis-dev/fis-kernel/blob/master/lib/compile.js#L246-L260) )

该过程对每个文件采用管道式处理流程，并在最开始处建立缓存，以提升编译性能。每个文件的处理过程又可细分为：

1. **parser**(编译器)：将其他语言编译为标准js、css，比如将前端模板、coffee-script编译为js，将less、sass编译为css。
1. **preprocessor**(标准预处理器)：在fis进行标准化处理之前进行某些修改，比如 [支持image-set语法的预处理插件](https://github.com/fouber/fis-preprocessor-image-set)
1. **standard**(标准化处理)：前面两项处理会将文件处理为标准的js、css、html语法，fis内核的标准化处理过程对这些语言进行 [三种语言能力](https://github.com/fis-dev/fis/wiki/三种语言能力) 扩展处理。这也就意味着，使用less、coffee等语法在fis系统中一样具备 **资源定位、内容嵌入，依赖声明** 的能力。该过程 **不可扩展**。
1. **postprocessor**(标准后处理器)：对文件进行标准化之后的处理，比如利用依赖声明能力实现的 [js包装器插件](https://github.com/fouber/fis-postprocessor-jswrapper)，可以获取js文件的依赖关系，并添加define包装。
1. **lint**(校验器)：代码校验阶段，使用 fis release命令的 **--lint** 参数会调用该过程。
1. **test**(测试器)：自动测试阶段，使用 fis release命令的 **--test** 参数会调用该过程。
1. **optimizer**(优化器)：代码优化阶段，使用 fis release命令的 **--optimize** 参数会调用该过程。fis内置的[fis-optimizer-uglify-js](https://github.com/fis-dev/fis-optimizer-uglify-js)插件和[fis-optimizer-clean-css](https://github.com/fis-dev/fis-optimizer-clean-css)插件都是这类扩展。

#### 打包过程 ( [源码](https://github.com/fis-dev/fis-kernel/blob/master/lib/release.js) )

fis的打包概念和传统编译工具 **概念上有很大区别**，如果为了实现简单的文件合并，可以使用三种语言能力中的 **内容嵌入** 能力来实现，比如创建一个aio.js，里面写上对需要合并的文件的内容嵌入语法：

```javascript
__inline('a.js');
__inline('b.js');
__inline('c.js');
```

编译之后得到

```javascript
//a.js content;
//b.js content;
//c.js content;
```

而fis的打包概念实际上是 **资源备份**。fis在打包期间最重要的生成物是 **map.json**，当使用fis release命令添加 **--pack** 参数时，会触发打包过程，此时，会根据fis-conf.js中的 **pack** 节点配置将文件进行合并，然后把合并后的打包文件相关信息记录到map.json中，并生成相应文件。所以fis的打包结果并 **不会再嵌入到某个文件内**，而是利用map.json中的数据进行运行时打包信息查询。举个栗子：

1. fis-conf.js中配置:

    ```javascript
    fis.config.merge({
        pack : {
            'aio.js' : ['a.js', 'b.js', 'c.js']
        }
    });
    ```

1. 执行命令 fis release **--pack** --dest ./output
1. 进入output目录，查看map.json文件，得到内容：

    ```json
    {
        "res" : {
            "a.js" : {
                "uri" : "/a.js",
                "type" : "js",
                "pkg" : "p0"
            },
            "b.js" : {
                "uri" : "/b.js",
                "type" : "js",
                "pkg" : "p0"
            },
            "c.js" : {
                "uri" : "/c.js",
                "type" : "js",
                "pkg" : "p0"
            }
        },
        "pkg" : {
            "p0" : {
                "uri" : "/aio.js",
                "type" : "js",
                "has" : ["a.js", "b.js", "c.js"]
            }
        }
    }
    ```
1. 将map.json交给某个前端或后端框架，当运行时需要“a.js”资源的时候，该框架应该读取map.json的信息，并根据一定的策略决定是否应该返回“a.js”资源所标记的“p0”包的uri。

再次强调，在fis系统内， **打包只是资源的备份**，这样做的原因有：

* 如果打包生成资源通过配置再嵌入到已处理过的文件内，会导致编译的性能快速下降，可能会间接影响md5戳的准确性，甚至造成编译过程的死循环。
* fis的嵌入内容语言能力已经提供了简单的内容合并功能，如果不想使用fis的打包方案，可以使用这种方式来合并文件
* 可以运行时控制资源输出策略。fis团队 **强烈推荐** 使用线下生成打包资源文件，运行时决定是否输出打包后的资源这样的策略。这样做好处很多：
    * 框架非常容易实现通过外部参数来切换输出打包/不打包资源策略，方便工程师线上调试。资源加载框架可以根据url的get参数或者cookie之类的外部变量来切换在查找资源时是否关心资源打包的情况。这意味着，工程师可以很方便的在浏览线上页面时让整个页面的资源都分开输出，从而快速定位问题。
    * 可以有效监控资源加载情况，为自适应网站系统设计做基础。由于资源都是通过前端或者后端框架查map.json表来加载，因此可以通过统计框架的这个接口来统计线上静态资源的访问情况，从而自动生成打包配置，让网站能自动进行性能优化，无须人工干预。
    * 能全局控制资源加载方式，并且很好的管理依赖，解决去重、调序等问题。资源通过框架查表获得之后，框架可以做适当的调整甚至处理，以达到性能优化的目的，自由切换PIPE_LINE、QUICKLING、NO_SCRIPT等页面输出模式，并且对工程师完全透明。
    * 细粒度控制资源使用，防止出现某个包太大，不能删减的情况。比如传统的合包方式，由于难以统计合包后的资源的使用情况，导致合并的资源中即使出现了不再使用的资源也不敢删除的情况。合并的资源越来越大，冗余越来越多。fis的合包概念只是资源的备份。哪怕把所有包都删除了，资源大不了是独立输出的而已，不会出现丢失的情况。

fis系统的打包过程提供了4个可扩展的处理过程，它们是：

1. **prepackager**(打包预处理器)：在打包前进行资源预处理。
1. **packager**(打包处理器)：对资源进行打包。默认的打包器就是收集资源表，建立map.json的过程
1. **spriter**(csssprite处理器)：对css进行sprites化处理
1. **postpackager**(打包后处理器)：打包之后对文件进行处理，通常用来将map.json转换成其他语言的文件，比如php

### FIS插件调用机制

插件调用机制的 [实现](https://github.com/fis-dev/fis-kernel/blob/master/fis-kernel.js#L77-L86) 非常简单：

![fis.require实现机制](https://raw.githubusercontent.com/fouber/fis-wiki-img/master/fis.require.png)

fis的插件也是一个npm包，利用fis.require函数来加载。当我们在fis系统中加载一个插件的时候，会利用 [nodejs的require向上查找机制](http://nodejs.org/api/modules.html#modules_loading_from_node_modules_folders) 从 **fis-kernel** 模块出发，向上查找所需模块，产生这样的效果：

![fis.require调用示意图](https://raw.githubusercontent.com/fouber/fis-wiki-img/master/fis.require2.png)

fis插件系统巧妙的利用了nodejs的require机制来实现其扩展机制。这意味着，要想扩展fis可以有 **三种途径** ：

1. 使用fis的用户，自己需要某种插件，可以在fis安装目录的 **同级**，安装自己扩展的插件。比如：

    ```bash
    $ npm install -g fis
    $ npm install -g fis-parser-coffee-script
    ```

1. fis团队会衡量某个插件的通用性，把它放到fis的依赖里，最优先加载。目前已经内置的插件包括：
    * [fis-kernel](https://github.com/fis-dev/fis-kernel)：fis编译机制内核
    * [fis-command-release](https://github.com/fis-dev/fis-command-release)：fis release命令的提供者，处理编译过程，并提供文件监听、自动上传等功能
    * [fis-command-install](https://github.com/fis-dev/fis-command-install)：fis install命令的提供者，用于从fis仓库下载组件、配置、框架、素材等资源
    * [fis-command-server](https://github.com/fis-dev/fis-command-server)：fis server命令的提供者，用于开启一个本地php-cgi服务器，对项目进行预览、调试。
    * [fis-optimizer-uglify-js](https://github.com/fis-dev/fis-optimizer-uglify-js)：fis的优化插件，调用uglify-js对文件内容进行js压缩。
    * [fis-optimizer-clean-css](https://github.com/fis-dev/fis-optimizer-clean-css)：fis的优化插件，调用clean-css对文件内容进行css压缩。
    * [fis-optimizer-html-minifier](https://github.com/fis-dev/fis-optimizer-html-minifier)：fis的优化插件，调用html-minifier对文件内容进行html压缩。
    * [fis-postprocessor-jswrapper](https://github.com/fis-dev/fis-postprocessor-jswrapper)：fis的后处理器插件，用于对js文件进行包装，支持amd的define包装或者匿名自执行函数包装。
1. 开发一个依赖于fis模块的npm包，并在这个包里定制所需要的插件。这种方式与上一条类似，也是将插件安装在fis的同级目录下。

### 插件扩展点

> fis的编译过程可以分为两个阶段： **单文件编译** 和 **打包**。处理流程如下图

![编译流程](https://raw.githubusercontent.com/fouber/fis-wiki-img/master/workflow.png)

fis编译系统具有一个既简单又容易扩展的插件体系，它是fis编译系统生命力的源泉。在了解插件机制之前，你可能需要了解一下fis的 [运行原理](https://github.com/fis-dev/fis/wiki/运行原理)，使用插件的说明请阅读 [插件调用机制](https://github.com/fis-dev/fis/wiki/插件调用机制)

fis在不做任何定制的情况下即可满足前端开发的基本需求，于此同时，系统也具有极强的可扩展性，fis的两大编译流程一共提供了10项扩展点，再加上命令行扩展能力，fis系统一共具有 **11项扩展点**：

#### 单文件编译扩展

> fis的单文件编译过程有6项扩展点

##### parser(编译器插件)
* 命名规则：fis-parser-xxx
* 功能职责：将文件编译成标准js、css或者html语言
* 使用示例：

    ```javascript
    //fis-conf.js
    fis.config.merge({
        modules : {
            parser : {
                //coffee后缀的文件使用fis-parser-coffee-script插件编译
                coffee : 'coffee-script',
                //less后缀的文件使用fis-parser-less插件编译
                //处理器支持数组，或者逗号分隔的字符串配置
                less : ['less'],
                //md后缀的文件使用fis-parser-marked插件编译
                md : 'marked'
            }
        },
        roadmap : {
            ext : {
                //less后缀的文件将输出为css后缀
                //并且在parser之后的其他处理流程中被当做css文件处理
                less : 'css',
                //coffee后缀的文件将输出为js文件
                //并且在parser之后的其他处理流程中被当做js文件处理
                coffee : 'js',
                //md后缀的文件将输出为html文件
                //并且在parser之后的其他处理流程中被当做html文件处理
                md : 'html'
            }
        }
    });
    ```

* 插件配置：
    ```javascript
    //fis-conf.js
    fis.config.merge({
        settings : {
            parser : {
                //此处的配置数据将在fis调度fis-parser-coffee-script插件时传递给插件的入口函数接收。
                'coffee-script' : {}
            }
        }
    });
    ```
* 示例插件：
    * [fis-parser-coffee-script](https://github.com/fouber/fis-parser-coffee-script)：把coffee-script编译成js
    * [fis-parser-bdtmpl](https://github.com/fouber/fis-parser-bdtmpl)：使用baiduTemplate将前端模板文件编译成js
    * [fis-parser-less](https://github.com/fouber/fis-parser-less)：将less文件编译成css
    * [fis-parser-marked](https://github.com/fouber/fis-parser-marked)：把markdown文件编译成html
    * [fis-parser-utc](https://github.com/fouber/fis-parser-utc)：把underscore前端模板编译成js

##### preprocessor(标准预处理器插件)
* 命名规则：fis-preprocessor-xxx
* 功能职责：在标准化处理之前进行预处理
* 使用示例：

    ```javascript
    //fis-conf.js
    fis.config.merge({
        modules : {
            preprocessor : {
                //css后缀文件会经过fis-preprocessor-image-set插件的预处理
                css : 'image-set'
            }
        }
    });
    ```
* 插件配置：

    ```javascript
    //fis-conf.js
    fis.config.merge({
        settings : {
            preprocessor : {
                //此处的配置数据将在fis调度fis-preprocessor-image-set插件时传递给插件的入口函数接收。
                'image-set' : {}
            }
        }
    });
    ```
* 示例插件：
    * [fis-preprocessor-image-set](https://github.com/fouber/fis-preprocessor-image-set)：如果css中使用的背景图比如a.png，旁边有一个a_2x.png文件，则将图片的背景设置为-    webkit-image-set形式。此功能为retina屏适配项目开发。

##### postprocessor(标准后处理器插件)
* 命名规则：fis-postprocessor-xxx
* 功能职责：在fis对js、css和类html文件进行语言能力扩展之后调用的插件，该阶段可获取到文件的requires等信息。
* 示例插件：
    * [fis-postprocessor- jswrapper](https://github.com/fis-dev/fis-postprocessor-jswrapper)：用于对js文件进行amd定义包装。

##### lint(校验器插件)
* 命名规则：fis-lint-xxx
* 功能职责：用于对代码进行校验，执行fis release命令时添加 **--lint**参数会调用该类型插件。
* 示例插件： _暂无_

##### test(自动测试插件)
* 命名规则：fis-test-xxx
* 功能职责：用于对代码进行测试，执行fis release命令时添加 **--test**参数会调用该类型插件。
* 示例插件： _暂无_

##### optimizer(代码优化器插件)
* 命名规则：fis-optimizer-xxx
* 功能职责：代码优化插件，用于对代码进行压缩等优化，执行fis release命令时添加 **--optimize**参数会调用该类型插件。
* 示例插件： 
    * [fis-optimizer-uglify-js](https://github.com/fis-dev/fis-optimizer-uglify-js)：调用uglify-js对js文件进行压缩优化。
    * [fis-optimizer-clean-css](https://github.com/fis-dev/fis-optimizer-clean-css)：调用clean-css对css文件进行压缩优化。
    * [fis-optimizer-html-minifier](https://github.com/fis-dev/fis-optimizer-html-minifier)：调用html-minifier对html、htm文件进行压缩优化。

#### 打包扩展

> fis的打包流程有4项扩展点：

##### prepackager(打包预处理器插件)
* 命名规则：fis-prepackager-xxx
* 功能职责：用于对要打包的文件进行预处理。
* 示例插件： _暂无_

##### packager(打包处理器插件)
* 命名规则：fis-packager-xxx
* 功能职责：用于对要打包的文件进行处理，fis内置的处理逻辑是收集依赖关系，生成map.json文件，执行fis release命令时添加 **--pack** 参数会调用该类型插件。
* 注意事项：fis内置的packager插件即是 **收集、生成map.json的过程**，除非你有非常好的打包策略，否则请不要随意扩展这个接口。
* 示例插件：
    * [fis-packager-map](https://github.com/fis-dev/fis-packager-map)：将打包资源输出给map表。

##### spriter(sprite处理器插件)
* 命名规则：fis-spriter-xxx
* 功能职责：用于要发布的文件进行css sprite处理。
* 示例插件： _暂无_

##### postpackager(打包后处理器插件)
* 命名规则：fis-postpackager-xxx
* 功能职责：用于要发布的文件进行打包后处理。
* 示例插件： _暂无_

#### 命令行扩展

> fis还提供了扩展命令行命令的方式，fis内置了3条命令：fis release，fis server，fis install。如果还嫌这些不够，用户可以自行扩展。

##### command(命令行插件)
* 命名规则：fis-command-xxx
* 功能职责：对fis的命令行进行扩展。
* 示例插件：
    * [fis-command-release](https://github.com/fis-dev/fis-command-release)：fis release命令的提供者，处理编译过程，并提供文件监听、自动上传等功能
    * [fis-command-install](https://github.com/fis-dev/fis-command-install)：fis install命令的提供者，用于从fis仓库下载组件、配置、框架、素材等资源
    * [fis-command-server](https://github.com/fis-dev/fis-command-server)：fis server命令的提供者，用于开启一个本地php-cgi服务器，对项目进行预览、调试。

### 基于map.json的前后端框架设计

前端工具在解决了编译、优化之后，最重要的问题就是打包（静态资源合并）了。我们来看一个最常见的前端开发栗子：

> 这个例子来自[Facebook静态网页资源的管理和优化@Velocity China 2010](http://velocity.oreilly.com.cn/2010/index.php?func=session&name=%E9%9D%99%E6%80%81%E7%BD%91%E9%A1%B5%E8%B5%84%E6%BA%90%E7%9A%84%E7%AE%A1%E7%90%86%E5%92%8C%E4%BC%98%E5%8C%96)

```php
<html>
    <link href="A.css">
    <link href="B.css">
    <link href="C.css">
    <div>html of A</div>
    <div>html of B</div>
    <div>html of C</div>
</html>
```

传统的前端开发模式选择 **简单的文件合并** 策略，直观的认为，A、B、C经常一起使用，那我们把它打包好了，于是得到：

```php
<html>
    <link href="A-B-C.css">
    <div>html of A</div>
    <div>html of B</div>
    <div>html of C</div>
</html>
```

某天，C功能有些变化了，会有后端逻辑控制C功能的输出，代码变成了这样：

```php
<html>
    <link href="A-B-C.css">
    <div>html of A</div>
    <div>html of B</div>
    <?php if($user_has_C){?>
        <div>html of C</div>
    <?php } ?>
</html>
```

这时候我们再看页面使用的资源A-B-C.css，A和B还好啦，可是 **C资源已经不是那么合群了** 。。。

又过了几天，项目经理突然说，C这个功能我们不用了！，把它注释掉吧，这个时候，代码就这样了：

```php
<html>
    <link href="A-B-C.css">
    <div>html of A</div>
    <div>html of B</div>
    <!--
    <?php if($user_has_C){?>
        <div>html of C</div>
    <?php } ?>
    -->
</html>
```

再看看我们使用的资源A-B-C.css，工程师经常会忘记（或者主动避免）将C资源从打包中移除，尤其是在规模稍大一些的团队里，工程师通常没有十足的把握可以确保删除这个资源之后页面其他功能都是ok的，而且不删除C资源，线上的代码运行的还很正确嘛，yep！然而，一个月后：

```php
<html>
    <link href="A-B-C-D-E-F-G-H....css">
    <div>html of A</div>
    <div>html of B</div>
    ...
    <?php if($not_used_F){ ?>
        <div>html of E</div>
    <?php } else { ?>
        <div>html of F</div>
        <div>html of G</div>
    <?php } ?>
    ...
</html>
```

我们在页面有了一堆冗余的资源，有些资源（比如皮肤）， **甚至是互斥的**！大家可以看到，传统的前端性能优化方式在大型互联网项目中很有可能非但不能优化性能，反倒会导致性能的下降。相信每个开发过大型互联网应用的前端er都遇到过这样的问题，那么，我们如何将性能优化理论在大规模的平台上应用起来呢？这将是一个非常大的挑战！让我们来看看fis是如何解决这个问题的：

#### FIS的静态资源管理方案

##### 组件化拆分你的页面

首先，我们将页面的每个小部件，当做一个组件，在fis中，我们叫它 **widget** ——你也可以叫它pagelet、component神马的——接下来，让我们回到上面小栗子的开始，经过我们的 **组件化** 之后，页面代码变成了：

```php
<html>
<?php load_widget('A');?>
<?php load_widget('B');?>
<?php load_widget('C');?>
</html>
```

这个网站的目录结构变成了：

    根目录
      ├ index.tpl
      ├ A
      │ ├ A.tpl
      │ └ A.css
      ├ B
      │ ├ B.tpl
      │ └ B.css
      └ C
        ├ C.tpl
        └ C.css

##### 让fis帮你产出静态资源表

大家还记得fis会产出的那个 [map.json](https://github.com/fis-dev/fis/wiki/%E8%BF%90%E8%A1%8C%E5%8E%9F%E7%90%86#----1) 么？使用fis，加入适当的配置，对这个项目进行编译会得到一个 map.json的文件，它的内容是：

```json
{
    "res" : {
        "A/A.tpl" : {
            "uri" : "/template/A.tpl",
            "deps" : [ "A/A.css" ]
        },
        "A/A.css" : {
            "uri" : "/static/css/A_7defa41.css"
        },

        "B/B.tpl" : {
            "uri" : "/template/B.tpl",
            "deps" : [ "B/B.css" ]
        },
        "B/B.css" : {
            "uri" : "/static/css/B_33c5143.css"
        },

        "C/C.tpl" : {
            "uri" : "/template/C.tpl",
            "deps" : [ "C/C.css" ]
        },
        "C/C.css" : {
            "uri" : "/static/css/C_ba59c31.css"
        }
    }
}
```

到这里或许你已经猜到我们的 **load_widget(id)** 是如何工作的了：

##### 静态资源管理系统

1. 准备两个数据结构：
    * uris = []，数组，顺序存放要输出资源的uri
    * has = {}，hash表，存放已收集的静态资源，防止重复加载
1. 加载资源表 **map.json**
1. 执行 &lt;?php load_widget('A');?&gt;
    1. 在表中查找id为 **A/A.tpl** 的资源，取得它的资源路径 _/template/A.tpl_，记为 **tpl_path**
    1. 模板引擎加载并渲染 tpl_path 所指向的模板文件，即 /template/A.tpl，并输出它的html内容
    1. 查看 A/A.tpl 资源的 **deps** 属性，发现它依赖资源 **A/A.css**
    1. 在表中查找id为 A/A.css 的资源，取得它的资源路径为 _/static/css/A_7defa41.css_，存入 **uris数组** 中，并在 **has表** 里标记已加载 A/A.css 资源，我们得到：
    
        ```javascript
        uris = [
            '/static/css/A_7defa41.css'
        ];
        has = {
            'A/A.css' : true
        };
        ```
1. 执行 load_widget('B')，步骤与上述步骤3相同，我们得到：
    
    ```javascript
    uris = [
        '/static/css/A_7defa41.css',
        '/static/css/B_33c5143.css'
    ];
    has = {
        'A/A.css' : true,
        'B/B.css' : true
    };
    ```

1. 执行 load_widget('C')，步骤与上述步骤3相同，我们得到：
    
    ```javascript
    uris = [
        '/static/css/A_7defa41.css',
        '/static/css/B_33c5143.css',
        '/static/css/C_ba59c31.css'
    ];
    has = {
        'A/A.css' : true,
        'B/B.css' : true,
        'C/C.css' : true
    };
    ```
1. 在要输出的html前面，我们读取 **uris数组** 的数据，生成静态资源外链，我们得到最终的html结果：

    ```html
    <html>
        <link href="/static/css/A_7defa41.css">
        <link href="/static/css/B_33c5143.css">
        <link href="/static/css/C_ba59c31.css">
        <div>html of A</div>
        <div>html of B</div>
        <div>html of C</div>
    </html>
    ```

看到了么！！！，我们不但可以让资源按需加载，还能全部映射到正确的md5戳哦，这全依赖fis的表生成技术！那么，基于这项技术，我们是如何处理打包的呢：

##### 打包——资源的备份读取

现在，我们再来使用fis的 [pack配置项](https://github.com/fis-dev/fis/wiki/配置API#pack)，对网站的静态资源进行打包，配置文件大致为：

```javascript
fis.config.merge({
    pack : {
        'pkg/aio.css' : '**.css'
    }
});
```
执行fis的编译命令并使用 **pack、md5** 等功能：

    fis release --pack --md5

再来查看我们的 map.json, 它的内容变为：

```json
{
    "res" : {
        "A/A.tpl" : {
            "uri" : "/template/A.tpl",
            "deps" : [ "A/A.css" ]
        },
        "A/A.css" : {
            "uri" : "/static/css/A_7defa41.css",
            "pkg" : "p0"
        },

        "B/B.tpl" : {
            "uri" : "/template/B.tpl",
            "deps" : [ "B/B.css" ]
        },
        "B/B.css" : {
            "uri" : "/static/css/B_33c5143.css",
            "pkg" : "p0"
        },

        "C/C.tpl" : {
            "uri" : "/template/C.tpl",
            "deps" : [ "C/C.css" ]
        },
        "C/C.css" : {
            "uri" : "/static/css/C_ba59c31.css",
            "pkg" : "p0"
        }
    },
    "pkg" : {
        "p0" : {
            "uri" : "/static/pkg/aio_0cb4a19.css",
            "has" : [ "A/A.css", "B/B.css", "C/C.css" ]
        }
    }
}
```

大家注意到了么，表里多了一张 **pkg** 表，所有被打包的资源会有一个 **pkg属性** 指向该表中的资源，而这个资源，正是我们配置的打包策略。好，让我们看看这种情况下，我们的 **load_widget(id)**是怎么工作的吧（ **注意，这个过程工程师的代码从未改动过哦** ）：

1. 准备两个数据结构：
    * uris = []，数组，顺序存放要输出资源的uri
    * has = {}，hash表，存放已收集的静态资源，防止重复加载
1. 加载资源表 **map.json**
1. 执行 ``load_widget('A')``
    1. 在表中查找id为 **A/A.tpl** 的资源，取得它的资源路径 _/template/A.tpl_，记为 **tpl_path**
    1. 模板引擎加载并渲染 tpl_path 所指向的模板文件，即 /template/A.tpl，并输出它的html内容
    1. 查看 A/A.tpl 资源的 **deps** 属性，发现它依赖资源 **A/A.css**
    1. 在表中查找id为 A/A.css 的资源，我们发现该资源有 **pkg属性**，表明它被 **备份** 在了一个打包文件中。
    1. 我们使用它的pkg属性值 **p0** 作为key，在pkg表里读取信息，取的这个包的资源路径为 _/static/pkg/aio_0cb4a19.css_ 存入 **uris数组** 中
    1. 将p0包的 **has** 属性所声明的资源加入到 **has表** 里我们得到：
        
        ```javascript
        uris = [
            '/static/pkg/aio_0cb4a19.css'
        ];
        has = {
            'A/A.css' : true,
            'B/B.css' : true,
            'C/C.css' : true
        };
        ```
1. 执行 ``load_widget('B')``，步骤与上述步骤3相同，但当我们要加载B/B.tpl的资源B/B.css时，发现它已经被has表标记为 **已收集**，因此跳过资源收集过程
1. 执行 ``load_widget('C')``，结果与步骤4相同
1. 在要输出的html前面，我们读取 **uris数组** 的数据，生成静态资源外链，我们得到最终的html结果：
    
    ```html
    <html>
        <link href="/static/pkg/aio_0cb4a19.css">
        <div>html of A</div>
        <div>html of B</div>
        <div>html of C</div>
    </html>
    ```

**出现打包了有木有啊！！！**

##### 这样做的好处

> 抱歉，这货好处实在太多了。

* 我们可以统计 ``load_widget(id)`` 插件的调用情况，然后自动生成最优的打包配置，让网站可以 **自适应优化**
* 工程师不用关心资源在哪，怎么来的，怎么没的，所有 [资源定位](https://github.com/fis-dev/fis/wiki/三种语言能力) 的事情，都交给fis好了。解决了前面说的 **功能下线不敢删除相应资源** 的问题
* 静态资源路径都带md5戳，这个值只跟内容有关，静态资源服务器从此可以放心开启强缓存了！还能实现静态资源的分级发布，回滚神马的超方便哦！
* 我们给 ``load_widget(id)`` 加一个小小的“后门”，我们可以利用cookie、url中的get参数来控制瞬间切换线上的页面输出结果为打包或者不打包、甚至是压缩或者不压缩的资源， **方便定位线上问题** 有木有！
* 我们再给 ``load_widget(id)`` 加一个小小的“后门”，让它可以读取一个 domains.conf 配置文件，内容形如：

    ```ini
    default=http://static.example.com
    debug=http://localhost:8080
    ```
然后我们约定一个cookie或者url值，可以一键 **把线上资源映射到本地** 有木有！！！方便调试啊，魂淡！
* 我们还可以继续折腾，比如根据国际化、皮肤，终端等信息约定一种资源路径规范，当后端适配到特定地区、特定机型的访问时，静态资源管理系统帮你 **送达不同的资源给不同的用户** 啊，有木有！
* 更多好处，等你来挖掘，请鞭挞我吧，公瑾！

##### 说到这里，一些同学可能会问：
> 这样做岂不是增加了后端性能开销？

对于这个问题，我只想说，这非常值得！其实这个后端开销很少，算法非常简单直白，但他所换来的前端工程化水平提高非常大！！

> 你们还不是抄袭了facebook

不可否认，我们在一开始是受了fb的启发，他是理想社会的老大哥，但后来我们发现已知的信息实在太少了，建设有fis特色的解决方案必须靠我们自己，这个探索，花了1年多的时间。况且facebook这个网站根本不存在嘛！


[fis-plus]: https://github.com/fex-team/fis-plus "基于Smarty的解决方案"
[jello]: https://github.com/fis-dev/jello "基于Java的解决方案"
[spt]: https://github.com/fouber/spt "基于FIS简单压缩工具"
[gois]: https://github.com/xiangshouding/gois "基于go语言的解决方案"