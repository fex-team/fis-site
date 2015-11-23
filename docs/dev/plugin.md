---
layout: post
title: 插件开发
category: dev
---
# 插件开发

**前置阅读**，*请详细阅读以下文档，因为这些文档非常重要*

+ [编译过程运行原理](/docs/more/fis-base.html)
+ [插件调用机制](/docs/more/how-plugin-works.html)
+ [插件扩展点列表](/docs/more/extension-point.html)

> 注意，**FIS 插件不支持异步**

按照[插件扩展点列表](/docs/more/extension-point.html)文档的介绍，在整个编译流程可以扩展的点有；

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


## 开发插件

FIS API

* fis.file      file对象
* fis.project   project对象
* fis.util      util类
* fis.compile   编译

@see [开发插件API](/docs/api/dev.html)

### 编译阶段插件

**插件接口**

```js
/**
 * Compile 阶段插件接口
 * @param  {string} content     文件内容
 * @param  {File}   file        fis 的 File 对象
 * @param  {object} settings    插件配置属性
 * @return {string}             处理后的文件内容
 */
module.exports = function (content, file, settings) {
    // 你在此处设置你的逻辑修改文件内容 content，或者文件对象 file
    return content;
};
```

fis 的插件是以 NPM 包的形式提供的，这将意味着 fis 的插件都是一个 NPM 包，并且最终也需要发布到 NPM 平台上。为了方便管理，FIS 只能加载 NPM 全局安装的插件，这将意味着你开发的时候需要把你的插件放到 NPM 全局插件目录下。

我们如何知道这个全局插件目录在什么地方呢，一般需要通过在 CMD （Windows） 或者 终端
 （类 Unix）执行命令 `npm prefix -g` 得到一个目录，比如

 ```bash
➜  fis-site git:(master) npm prefix -g
/Users/shouding/Bin
 ```

那么这个全局安装的目录就是 `/Users/shouding/Bin/lib/node_modules`，在命令输出的路径后跟 `lib/node_modules`，这个就是全局安装的目录了。

Windows & 类 Unix 都可以通过**软链**的方式把你开发插件的目录软链过去。

以下示例插件都放到 **NPM 全局安装目录下**，我们假定这个目录叫 `<npm/global/path>`

**插件目录**

```
<npm/global/path>/fis-<type>-<name>
<npm/global/path>/fis-<type>-<name>/index.js
```

- `<type>` 插件扩展点名字
- `<name>` 插件名，只要不跟 NPM 平台上其他插件重名即可，不然无法发布上去


以parser插件为例，如果使用了less、sass、coffescript等开发维护css和js。在这个阶段就是要把它们解析为标准的css和js。

- 插件开发

    那么我们要解析的是 sass 文件，插件扩展点为 parser，我们可以取名叫 `my-sass`

    ```
    <npm/global/path>/fis-parser-my-sass
    <npm/global/path>/fis-parser-my-sass/index.js
    ```

    *index.js*

    ```javascript
    /*
     * fis
     * http://fis.baidu.com/
     */

    'use strict';

    var sass = require('node-sass');

    module.exports = function(content, file, settings){
        var opts = fis.util.clone(settings);
        opts.data = content;
        return sass.renderSync(opts);
    };

    ```

- 插件配置调用

    我们开发完了 `fis-parser-my-sass`，那么改如何使用呢，如上我们就是在`<npm/global/path>` 目录下开发的插件，那么这时候配置调用就很简单了。

    ```js
    // vi fis-conf.js
    // 文件后缀 .scss 的调用插件 my-sass 进行解析
    fis.config.set('modules.parser.scss', 'my-sass');
    fis.config.set('settings.parser.my-sass', {
        // my-sass 的配置
    });
    fis.config.set('roadmap.ext.scss', 'css'); // 由于 scss 文件最终会编译成 css，设置最终产出文件后缀为 css
    ```

- 发布到 NPM 平台

    发布 NPM 请参考，https://docs.npmjs.com/getting-started/publishing-npm-packages

### 打包阶段插件

如运行原理，打包阶段是多文件处理的阶段；

**插件接口**

```js
/**
 * 打包阶段插件接口
 * @param  {Object} ret      一个包含处理后源码的结构
 * @param  {Object} conf     一般不需要关心，自动打包配置文件
 * @param  {Object} settings 插件配置属性
 * @param  {Object} opt      命令行参数
 * @return {undefined}          
 */
module.exports = function (ret, conf, settings, opt) {
    // ret.src 所有的源码，结构是 {'<subpath>': <File 对象>}
    // ret.ids 所有源码列表，结构是 {'<id>': <File 对象>}
    // ret.map 如果是 spriter、postpackager 这时候已经能得到打包结果了，
    //         可以修改静态资源列表或者其他
}
```

以prepackager插件为例。prepackager即打包前需要对文件做某些处理，比如想在所有的html注释里面插入编译时间。

- 插件开发

    我们为这个插件取名叫 `append-build-time`

    ```
    <npm/global/path>/fis-prepackager-append-build-time
    <npm/global/path>/fis-prepackager-append-build-time/index.js
    ```
    *index.js*

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

- 配置使用

    ```js
    // vi fis-conf.js
    fis.config.set('modules.prepackager', 'append-build-time'); // packager阶段插件处理所有文件，所以不需要给某一类后缀的文件设置。
    fis.config.set('settings.prepackager.append-build-time', {
        // settings
    })
    ```

- 发布 NPM
    
    发布 NPM 请参考，https://docs.npmjs.com/getting-started/publishing-npm-packages

--------

当然为了更快速的搞定一些小需求，可以把插件功能直接写到配置文件 `fis-conf.js` 中；

```js
// vi fis-conf.js
fis.config.set('modules.postprocessor.js', function (content) {
    return content += '\n// build time: ' + Date.now();
});
```

**注意**

配置使用插件时，同一个扩展点可以配置多个插件，比如；

```js
// 调用 fis-prepackager-a, fis-prepackager-b ...插件
fis.config.set('modules.prepackager', 'a,b,c,d');
// or
fis.config.set('modules.prepackager', ['a', 'b', 'c', 'd']);
// or
fis.config.set('modules.prepackager', [function () {}, function () {}])
```

## 扩展阅读

- http://div.io/topic/1027 `require()` 源码解读
