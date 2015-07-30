---
layout: post
title: 基于map.json的前后端架构设计指导- F.I.S
category: more
---

# 基于map.json的前后端架构设计指导

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

## FIS的静态资源管理方案

#### 组件化拆分你的页面

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

#### 让fis帮你产出静态资源表

大家还记得fis会产出的那个 [map.json](http://fex-team.github.io/fis-site/docs/more/fis-base.html#pack) 么？使用fis，加入适当的配置，对这个项目进行编译会得到一个 map.json的文件，它的内容是：

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

#### 静态资源管理系统

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

#### 打包——资源的备份读取

现在，我们再来使用fis的 [pack配置项](http://fex-team.github.io/fis-site/docs/api/fis-conf.html#pack)，对网站的静态资源进行打包，配置文件大致为：

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

#### 这样做的好处

> 抱歉，这货好处实在太多了。

* 我们可以统计 ``load_widget(id)`` 插件的调用情况，然后自动生成最优的打包配置，让网站可以 **自适应优化**
* 工程师不用关心资源在哪，怎么来的，怎么没的，所有 [资源定位](http://fex-team.github.io/fis-site/docs/more/fis-standard.html) 的事情，都交给fis好了。解决了前面说的 **功能下线不敢删除相应资源** 的问题
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

#### 说到这里，一些同学可能会问：
> 这样做岂不是增加了后端性能开销？

对于这个问题，我只想说，这非常值得！其实这个后端开销很少，算法非常简单直白，但他所换来的前端工程化水平提高非常大！！

> 你们还不是抄袭了facebook

不可否认，我们在一开始是受了fb的启发，他是理想社会的老大哥，但后来我们发现已知的信息实在太少了，建设有fis特色的解决方案必须靠我们自己，这个探索，花了1年多的时间。况且facebook这个网站根本不存在嘛！