---
layout: post
title: 插件扩展点列表- F.I.S
category: more
---

# 插件扩展点列表

> fis的编译过程可以分为两个阶段： **单文件编译** 和 **打包**。处理流程如下图

![编译流程](https://raw.githubusercontent.com/fouber/fis-wiki-img/master/workflow.png)

fis编译系统具有一个既简单又容易扩展的插件体系，它是fis编译系统生命力的源泉。在了解插件机制之前，你可能需要了解一下fis的 [运行原理](/docs/more/fis-base.html)，使用插件的说明请阅读 [插件调用机制](https://github.com/fis-dev/fis/wiki/插件调用机制)

fis在不做任何定制的情况下即可满足前端开发的基本需求，于此同时，系统也具有极强的可扩展性，fis的两大编译流程一共提供了10项扩展点，再加上命令行扩展能力，fis系统一共具有 **11项扩展点**：

## 单文件编译扩展

> fis的单文件编译过程有6项扩展点

### parser(编译器插件)
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

### preprocessor(标准预处理器插件)
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

### postprocessor(标准后处理器插件)
* 命名规则：fis-postprocessor-xxx
* 功能职责：在fis对js、css和类html文件进行语言能力扩展之后调用的插件，该阶段可获取到文件的requires等信息。
* 示例插件：
    * [fis-postprocessor- jswrapper](https://github.com/fis-dev/fis-postprocessor-jswrapper)：用于对js文件进行amd定义包装。

### lint(校验器插件)
* 命名规则：fis-lint-xxx
* 功能职责：用于对代码进行校验，执行fis release命令时添加 **--lint**参数会调用该类型插件。
* 示例插件： _暂无_

### test(自动测试插件)
* 命名规则：fis-test-xxx
* 功能职责：用于对代码进行测试，执行fis release命令时添加 **--test**参数会调用该类型插件。
* 示例插件： _暂无_

### optimizer(代码优化器插件)
* 命名规则：fis-optimizer-xxx
* 功能职责：代码优化插件，用于对代码进行压缩等优化，执行fis release命令时添加 **--optimize**参数会调用该类型插件。
* 示例插件：
    * [fis-optimizer-uglify-js](https://github.com/fis-dev/fis-optimizer-uglify-js)：调用uglify-js对js文件进行压缩优化。
    * [fis-optimizer-clean-css](https://github.com/fis-dev/fis-optimizer-clean-css)：调用clean-css对css文件进行压缩优化。
    * [fis-optimizer-html-minifier](https://github.com/fis-dev/fis-optimizer-html-minifier)：调用html-minifier对html、htm文件进行压缩优化。

## 打包扩展

> fis的打包流程有4项扩展点：

### prepackager(打包预处理器插件)
* 命名规则：fis-prepackager-xxx
* 功能职责：用于对要打包的文件进行预处理。
* 示例插件： _暂无_

### packager(打包处理器插件)
* 命名规则：fis-packager-xxx
* 功能职责：用于对要打包的文件进行处理，fis内置的处理逻辑是收集依赖关系，生成map.json文件，执行fis release命令时添加 **--pack** 参数会调用该类型插件。
* 注意事项：fis内置的packager插件即是 **收集、生成map.json的过程**，除非你有非常好的打包策略，否则请不要随意扩展这个接口。
* 示例插件：
    * [fis-packager-map](https://github.com/fis-dev/fis-packager-map)：将打包资源输出给map表。

### spriter(sprite处理器插件)
* 命名规则：fis-spriter-xxx
* 功能职责：用于要发布的文件进行css sprite处理。
* 示例插件： _暂无_

### postpackager(打包后处理器插件)
* 命名规则：fis-postpackager-xxx
* 功能职责：用于要发布的文件进行打包后处理。
* 示例插件： _暂无_

## 命令行扩展

> fis还提供了扩展命令行命令的方式，fis内置了3条命令：fis release，fis server，fis install。如果还嫌这些不够，用户可以自行扩展。

### command(命令行插件)
* 命名规则：fis-command-xxx
* 功能职责：对fis的命令行进行扩展。
* 示例插件：
    * [fis-command-release](https://github.com/fis-dev/fis-command-release)：fis release命令的提供者，处理编译过程，并提供文件监听、自动上传等功能
    * [fis-command-install](https://github.com/fis-dev/fis-command-install)：fis install命令的提供者，用于从fis仓库下载组件、配置、框架、素材等资源
    * [fis-command-server](https://github.com/fis-dev/fis-command-server)：fis server命令的提供者，用于开启一个本地php-cgi服务器，对项目进行预览、调试。