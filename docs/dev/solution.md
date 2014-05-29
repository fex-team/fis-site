---
layout: post
title: 解决方案封装
category: dev
---

解决方案封装
===========================

## 什么时候需要封装？

* 现有解决不能满足你的需求：[fis-plus](https://github.com/fex-team/fis-plus), [jello](https://github.com/fex-team/jello), [spmx](https://github.com/fouber/spmx), [phiz](https://github.com/fouber/phiz/), [gois](https://github.com/xiangshouding/gois)。
* 基于某一解决方案，需要配置的东西和安装的插件过多，不便于组内交接。
* 需要覆写某些插件。
* 你想采用更 nice 的命令名字。

## 如何封装？

1. 先取一个名字，以下示例就用 hello 作为命令名字吧。
1. 新建一个入口 js 文件。如： index.js
1. npm init 初始化项目

    ```bash
    ~/projects/hello touch index.js
    ~/projects/hello npm init
    This utility will walk you through creating a package.json file.
    It only covers the most common items, and tries to guess sane defaults.

    See `npm help json` for definitive documentation on these fields
    and exactly what they do.

    Use `npm install <pkg> --save` afterwards to install a package and
    save it as a dependency in the package.json file.

    Press ^C at any time to quit.
    name: (hello)
    version: (0.0.0) 0.0.1
    description: hello
    entry point: (index.js)
    test command:
    git repository:
    keywords: fis
    author: name
    license: (ISC) BSD
    About to write to /Users/liaoxuezhi/projects/hello/package.json:

    {
      "name": "hello",
      "version": "0.0.1",
      "description": "hello",
      "main": "index.js",
      "scripts": {
        "test": "echo \"Error: no test specified\" && exit 1"
      },
      "keywords": [
        "fis"
      ],
      "author": "name",
      "license": "BSD"
    }


    Is this ok? (yes) yes
    ~/projects/hello
    ```
1. 安装 fis 依赖

    ```bash
    npm install fis --save
    ```
1. 修改 index.js 内容为：

    ```javascript
    var fis = module.exports = require('fis');

    fis.cli.name = 'hello';
    fis.cli.info = fis.util.readJSON(__dirname + '/package.json');
    ```
1. 新建 hello bin 文件。

    ```bash
    ~/projects/hello mkdir bin
    ~/projects/hello touch bin/hello
    ~/projects/hello echo "require('../hello.js').cli.run( process.argv );" >> bin/hello
    ```
1. 到此一个简单的包装已经完成，此 hello 项目安装到 global 后，已经具有所有 fis 所有的功能。

## 捆绑插件

可以把一些常用的插件捆绑进来，比如 fis 中没有捆绑 markdown 的解析器，以下示例把 markdown 的解析器捆绑进来。

1. `npm install fis-parser-marked --save`

    执行完成后可以发现 `package.json` 文件里面多了一个依赖。

    ```json
    "dependencies": {
        "fis": "~1.7.9",
        "fis-parser-marked": "0.0.1"
    }
    ```
1. 修改 hello.js， 添加配置项，开启此插件。

    ```javascript
    fis.config.merge({
        roadmap : {
            ext : {
                md : 'html'
            }
        },
        modules : {
            parser : {
                md : 'marked'
            }
        }
    });
    ```
1. 到此 `fis-parser-marked` 便捆绑进了 hello 工具中，其他人员只需安转 hello 就可以使用 md 文件自动装成 html 的功能。

## 覆写插件

写过 node 的同学应该都知道 require 的查找顺序，比如 require('fis-command-release')。当第一加载此模块的时候，先会尝试当前脚本所在的目录下查找 node_modules/fis-command-release 模块，如果没找到，再往上级目录找，知道找到或者没有上级目录了。那么，当fis cli执行的时候，require 某个命令模块，其实最先找到的是 fis 模块下的 fis-command-xxx 然后才是 hello 模块的 fis-command-xxx。如是出现了一个问题就是，我们的模块里面只能新加模块，而不能覆写模块。

的确，之前确实是这样的，好在 fis 内部所有 require 模块的地方不是直接使用系统的require 方法，而是 fis.require 方法。如是，小修改了下逻辑，原来是固定查找 fis- 打头的插件，现在你可以控制，让其先加载 hello- 打头的插件，然后才查找 fis- 打头的插件。

```javascript
fis.require.prefixes.unshift('hello');
```

如是，在 hello 模块下安装 hello-command-release 便可以优先与 fis-command-release 被加载，如此实现了对 `hello release` 命令的覆写。

## 更多扩展

原来写在 fis-conf.js 的内容，如果足够通用，其实可以完全写在 hello.js 文件里面。这样封装好后，其他同学可以减少使用成本。

更多配置移步到[配置API](/docs/api/fis-conf.html)页面。
