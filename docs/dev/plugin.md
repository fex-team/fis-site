---
layout: post
title: 插件开发
category: dev
---
# 插件开发

按照[插件扩展点](/docs/dev/intro.html#插件扩展点)文档的介绍，在整个编译流程可以扩展的点有；

* 编译阶段
    * parser
    * preprocessor
    * postprocessor
    * lint
    * test
* 打包阶段
    * prepackager
    * packager
    * spriter
    * postpackager

编译阶段，处理的是单个文件，整个过程都使用了缓存；
打包阶段，处理的是编译后的所有文件；

以上扩展点也可以理解为FIS的几类插件，接下来详细说明每一类插件自定制。

* 开发插件
* 发布插件
* 使用插件

## 开发插件

FIS API

* fis.file      file对象
* fis.project   project对象
* fis.util      util类
* fis.compile   编译

@see [开发插件API](/docs/api/dev.html)

### 编译阶段插件

以parser插件为例，如果使用了less、sass、coffescript等开发维护css和js。在这个阶段就是要把它们解析为标准的css和js。

Sample:

```javascript
/*
 * fis
 * http://fis.baidu.com/
 */

'use strict';

var sass = require('node-sass');

module.exports = function(content, file, conf){
    var opts = fis.util.clone(conf);
    opts.data = content;
    return sass.renderSync(opts);
};

```

如上示例代码，插件需要导出一个function，参数分别是content，file，conf。

* content 源码内容
* file 文件对象，可以获取文件路径、文件名...
* conf 用户配置信息

最后return处理后的结果。

### 打包阶段插件
以prepackager插件为例。prepackager即打包前需要对文件做某些处理，比如想在所有的html注释里面插入编译时间。

Sample:

```javascript
module.exports = function(ret, conf, settings, opt) {
    fis.util.map(ret.src, function(subpath, file) {
        if (file.isHtmlLike) {
            var content = file.getContent();
            content += '<!-- build '+ (new Date())+'-->';
            file.setContent(content);
        }
    });
};
```

如上，导出function参数；

* ret    所有文件信息
* conf   打包信息 -- 一般用不到
* settings  插件用户配置信息
* opt    命令行参数

## 发布插件

在插件开发目录下执行

```bash
$ npm init
```
比如开发一个sass的parser插件。name必须为fis-parser-为前缀的名字，如"fis-parser-sass"

```bash
$ npm publish . #发布
```

## 使用插件

先全局安装

```bash
$ npm install -g fis-parser-sass
```

然后在fis-conf.js里面配置使用

```javascript
fis.config.merge({
    modules: {
        parser: {
            sass: 'sass' // sass后缀的使用fis-parser-sass处理
        }
    }
});
```