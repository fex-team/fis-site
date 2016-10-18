---
layout: post
title: 资源定位- F.I.S
category: advance
---

# 资源定位

<i class="anchor" id='html'></i>

## 在html中定位资源

> fis支持对html中的script、link、style、video、audio、embed等标签的src或href属性进行分析，一旦这些标签的资源定位属性可以命中已存在文件，则把命中文件的url路径替换到属性中，同时可保留原来url中的query查询信息。

例如：

```html
<!--源码：
<img title="百度logo" src="images/logo.gif"/>
编译后-->
<img title="百度logo" src="/images/logo_74e5229.gif"/>

<!--源码：
<link rel="stylesheet" type="text/css" href="demo.css">
编译后-->
<link rel="stylesheet" type="text/css" href="/demo_7defa41.css">

<!--源码：
<script type="text/javascript" src="demo.js"></script>
编译后-->
<script type="text/javascript" src="/demo_33c5143.js"></script>
```

值得注意的是， **资源定位结果可以被fis的配置文件控制**，比如添加配置，调整文件发布路径：

![资源定位工作原理](https://raw.githubusercontent.com/fouber/fis-wiki-img/master/uri.png)

```javascript
fis.config.merge({
    roadmap : {
        path : [
            {
                //所有的js文件
                reg : '**.js',
                //发布到/static/js/xxx目录下
                release : '/static/js$&'
            },
            {
                //所有的css文件
                reg : '**.css',
                //发布到/static/css/xxx目录下
                release : '/static/css$&'
            },
            {
                //所有image目录下的.png，.gif文件
                reg : /^\/images\/(.*\.(?:png|gif))/i,
                //发布到/static/pic/xxx目录下
                release : '/static/pic/$1'
            }
        ]
    }
});
```

再次编译得到：

```html
<!--源码：
<img title="百度logo" src="images/logo.gif"/>
编译后-->
<img title="百度logo" src="/static/pic/logo_74e5229.gif"/>

<!--源码：
<link rel="stylesheet" type="text/css" href="demo.css">
编译后-->
<link rel="stylesheet" type="text/css" href="/static/css/demo_7defa41.css">

<!--源码：
<script type="text/javascript" src="demo.js"></script>
编译后-->
<script type="text/javascript" src="/static/js/demo_33c5143.js"></script>
```

我们甚至可以让 **url和发布目录不一致**。比如：

```javascript
fis.config.merge({
    roadmap : {
        path : [
            {
                //所有的js文件
                reg : '**.js',
                //发布到/static/js/xxx目录下
                release : '/static/js$&',
                //访问url是/mm/static/js/xxx
                url : '/mm/static/js$&'
            },
            {
                //所有的css文件
                reg : '**.css',
                //发布到/static/css/xxx目录下
                release : '/static/css$&',
                //访问url是/pp/static/css/xxx
                url : '/pp/static/css$&'
            },
            {
                //所有image目录下的.png，.gif文件
                reg : /^\/images\/(.*\.(?:png|gif))/i,
                //发布到/static/pic/xxx目录下
                release : '/static/pic/$1',
                //访问url是/oo/static/baidu/xxx
                url : '/oo/static/baidu$&'
            }
        ]
    }
});
```

再次编译得到：

```html
<!--源码：
<img title="百度logo" src="images/logo.gif"/>
编译后-->
<img title="百度logo" src="/oo/static/baidu/logo_74e5229.gif"/>

<!--源码：
<link rel="stylesheet" type="text/css" href="demo.css">
编译后-->
<link rel="stylesheet" type="text/css" href="/pp/static/css/demo_7defa41.css">

<!--源码：
<script type="text/javascript" src="demo.js"></script>
编译后-->
<script type="text/javascript" src="/mm/static/js/demo_33c5143.js"></script>
```

<i class="anchor" id='js'></i>

## 在js中定位资源

> js语言中，可以使用编译函数 **__uri(path)** 来定位资源，fis分析js文件或 **html中的script标签内内容** 时会替换该函数所指向文件的线上url路径。

* 源码:

    ```javascript
    var img = __uri('images/logo.gif');
    ```

* 编译后

    ```javascript
    var img = '/images/logo_74e5229.gif';
    ```

* 源码:

    ```javascript
    var css = __uri('demo.css');
    ```

* 编译后

    ```javascript
    var css = '/demo_7defa41.css';
    ```

* 源码:

    ```javascript
    var js = __uri('demo.js');
    ```

* 编译后

    ```javascript
    var js = '/demo_33c5143.js';
    ```

**资源定位结果可以被fis的配置文件控制**，比如添加配置，调整文件发布路径：

```javascript
fis.config.merge({
    roadmap : {
        path : [
            {
                //所有的js文件
                reg : '**.js',
                //发布到/static/js/xxx目录下
                release : '/static/js$&'
            },
            {
                //所有的css文件
                reg : '**.css',
                //发布到/static/css/xxx目录下
                release : '/static/css$&'
            },
            {
                //所有image目录下的.png，.gif文件
                reg : /^\/images\/(.*\.(?:png|gif))/i,
                //发布到/static/pic/xxx目录下
                release : '/static/pic/$1'
            }
        ]
    }
});
```

再次编译得到：

* 源码:

    ```javascript
    var img = __uri('images/logo.gif');
    ```

* 编译后

    ```javascript
    var img = '/static/pic/logo_74e5229.gif';
    ```

* 源码:

    ```javascript
    var css = __uri('demo.css');
    ```

* 编译后

    ```javascript
    var css = '/static/css/demo_7defa41.css';
    ```

* 源码:

    ```javascript
    var js = __uri('demo.js');
    ```

* 编译后

    ```javascript
    var js = '/static/js/demo_33c5143.js';
    ```

<i class="anchor" id='css'></i>

## 在css中定位资源

> fis编译工具会识别css文件或 **html的style标签内容** 中 **url(path)** 以及 **src=path** 字段，并将其替换成对应资源的编译后url路径

* 源码：

    ```css
    @import url('demo.css');
    ```

* 编译后

    ```css
    @import url('/demo_7defa41.css');
    ```

* 源码：

    ```css
    .style {
        background: url('images/body-bg.png');
    }
    ```

* 编译后

    ```css
    .style {
        background: url('/images/body-bg_1b8c3e0.png');
    }
    ```

* 源码：

    ```css
    .style {
        _filter:progid:DXImageTransform.Microsoft.AlphaImageLoader(src='images/body-bg.png');
    }
    ```

* 编译后

    ```css
    .style {
        _filter:progid:DXImageTransform.Microsoft.AlphaImageLoader(src='/images/body-bg_1b8c3e0.png');
    }
    ```

**资源定位结果可以被fis的配置文件控制**，比如添加配置，调整文件发布路径：

```javascript
fis.config.merge({
    roadmap : {
        path : [
            {
                //所有的css文件
                reg : '**.css',
                //发布到/static/css/xxx目录下
                release : '/static/css$&'
            },
            {
                //所有image目录下的.png，.gif文件
                reg : /^\/images\/(.*\.(?:png|gif))/i,
                //发布到/static/pic/xxx目录下
                release : '/static/pic/$1'
            }
        ]
    }
});
```

再次编译得到：

* 源码：

    ```css
    @import url('demo.css');
    ```

* 编译后

    ```css
    @import url('/static/css/demo_7defa41.css');
    ```

* 源码：

    ```css
    .style {
        background: url('images/body-bg.png');
    }
    ```

* 编译后

    ```css
    .style {
        background: url('/static/pic/body-bg_1b8c3e0.png');
    }
    ```

* 源码：

    ```css
    .style {
        _filter:progid:DXImageTransform.Microsoft.AlphaImageLoader(src='images/body-bg.png');
    }
    ```

* 编译后

    ```css
    .style {
        _filter:progid:DXImageTransform.Microsoft.AlphaImageLoader(src='/static/pic/body-bg_1b8c3e0.png');
    }
    ```
