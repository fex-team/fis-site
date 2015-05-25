---
layout: post
title: 配置API- F.I.S
category: api
---

# 配置API

## 零配置

不使用任何配置，fis将支持：

1. 使用 **fis install &lt;name&gt;** 命令安装fis仓库提供的各种 **组件、框架、示例、素材、配置等** 开发资源。
1. 使用 **fis server start** 命令启动一个本地调试服务器，完美支持php后端程序
1. 使用 **fis release --dest ./output --md5** 命令为所有静态资源文件（js、css、图片、flash等）添加md5戳，并修改文件中的引用路径
1. 使用 **fis release --dest ./output --optimize** 命令对js、css、html、htm文件进行压缩（后续还会加上对图片的自动压缩）
1. 编译中对 **js**、 **css** 以及 **类html** ( _html, htm, xhtml, tpl, php, jsp, asp_ ) 文件分别支持三种扩展语言能力：
    * **资源定位**：获取任何开发中所使用资源的线上路径；
    * **内容嵌入**：把一个文件的内容(文本)或者base64编码(图片)嵌入到另一个文件中；
    * **依赖声明**：在一个文本文件内标记对其他文件的依赖关系；

以上功能可满足传统前端开发所需的基本要求

## 使用配置文件

在项目目录下新建一个 **fis-conf.js** 文件，我们可以对fis的编译系统做各种定制化配置。配置fis系统的接口是：

```javascript
fis.config.set(key, value);
```

或者

```javascript
fis.config.merge({...});
```

由于fis自动化工具采用nodejs作为平台，因此其配置文件也是js书写的。fis变量是全局注册，config属性是fis系统的配置对象实例，merge或set方法用以合并配置数据。

### 内置的默认配置

由于fis系统是完全插件化的，因此fis.config对象会有一些内置配置用以为用户提供零配置下的基本功能，所以配置文件中使用``fis.config.merge`` 或者 ``fis.config.set`` 接口来追加用户配置。而内部初始化的配置数是：

```javascript
fis.config.init({
    project : {
        charset : 'utf8',
        md5Length : 7
    }
});
```
<i class="anchor" id='project'></i>

## 项目配置

配置项 `project`

### charset

* 解释：指定项目编译后产出文件的编码。
* 值类型：``string``
* 默认值：'utf8'
* 用法：在项目的fis-conf.js里可以覆盖为

    ```javascript
    fis.config.set('project.charset', 'gbk');
    ```

    或者

    ```javascript
    fis.config.merge({
        project : { charset : 'gbk' }
    });
    ```

### md5Length

* 解释：文件MD5戳长度。
* 值类型：``number``
* 默认值：7
* 用法：在项目的fis-conf.js里可以修改为

    ```javascript
    fis.config.set('project.md5Length', 8);
    ```

    或者

    ```javascript
    fis.config.merge({
        project : { md5Length : 8 }
    });
    ```

### md5Connector

* 解释：设置md5与文件的连字符。
* 值类型：``string``
* 默认值：'_'
* 用法：在项目的fis-conf.js里可以修改为

    ```javascript
    fis.config.set('project.md5Connector ', '.');
    ```

    或者

    ```javascript
    fis.config.merge({
        project : { md5Connector : '.' }
    });
    ```

### include

* 解释：设置项目源码文件include过滤器。只有命中include的文件才被视为源码，其他文件则忽略。
* 值类型：``Array`` | ``string`` | ``RegExp``
* 默认值：无
* 用法：在项目的fis-conf.js里可以修改为

    ```javascript
    fis.config.set('project.include', 'src/**');
    ```

    或者

    ```javascript
    fis.config.merge({
        project : { include : 'src/**' }
    });
    ```

    或者

    ```javascript
    fis.config.set('project.include', ['src/**', /^\/vendor\//i]);
    ```

### exclude

* 解释：设置项目源码文件exclude过滤器。如果同时设置了 [project.include](/docs/api/fis-conf.html#include) 和 ``project.exclude`` 则表示在include所命中的文件中排除掉某些文件。
* 值类型：``Array`` | ``string`` | ``RegExp``
* 默认值：无
* 用法：在项目的fis-conf.js里可以修改为

    ```javascript
    fis.config.set('project.exclude', /^\/_build\//i);
    ```

    或者

    ```javascript
    fis.config.merge({
        project : { exclude : /^\/_build\//i }
    });
    ```


    或者

    ```javascript
    fis.config.set('project.exclude', ["dist/**", /^\/_build\//i]);
    ```

### fileType.text

* 解释：追加文本文件后缀列表。
* 值类型：``Array`` | ``string``
* 默认值：无
* 说明：fis系统在编译时会对文本文件和图片类二进制文件做不同的处理，文件分类依据是后缀名。虽然内部已列出一些常见的文本文件后缀，但难保用户有其他的后缀文件，内部已列入文本文件后缀的列表为： [ **'css', 'tpl', 'js', 'php', 'txt', 'json', 'xml', 'htm', 'text', 'xhtml', 'html', 'md', 'conf', 'po', 'config', 'tmpl', 'coffee', 'less', 'sass', 'jsp', 'scss', 'manifest', 'bak', 'asp', 'tmp'** ]，用户配置会 **追加**，而非覆盖内部后缀列表。
* 用法：编辑项目的fis-conf.js配置文件

    ```javascript
    fis.config.set('project.fileType.text', 'tpl, js, css');
    ```

    或者

    ```javascript
    fis.config.merge({
        project : {
            fileType : {
                text : 'tpl, js, css'
            }
        }
    });
    ```

### fileType.image

* 解释：追加图片类二进制文件后缀列表。
* 值类型：``Array`` | ``string``
* 默认值：无
* 说明：fis系统在编译时会对文本文件和图片类二进制文件做不同的处理，文件分类依据是后缀名。虽然内部已列出一些常见的图片类二进制文件后缀，但难保用户有其他的后缀文件，内部已列入文本文件后缀的列表为： [ **'svg', 'tif', 'tiff', 'wbmp', 'png', 'bmp', 'fax', 'gif', 'ico', 'jfif', 'jpe', 'jpeg', 'jpg', 'woff', 'cur', 'webp', 'swf', 'ttf', 'eot'** ]，用户配置会 **追加**，而非覆盖内部后缀列表。
* 用法：编辑项目的fis-conf.js配置文件

    ```javascript
    fis.config.set('project.fileType.image', 'swf, cur, ico');
    ```

    或者

    ```javascript
    fis.config.merge({
        project : {
            fileType : {
                image : 'swf, cur, ico'
            }
        }
    });
    ```

### watch.exclude

* 解释：设置项目源码监听时不监听的文件列表。
* 值类型：``Array`` | ``string`` | ``RegExp``
* 默认值：无
* 用法：在项目的fis-conf.js里可以覆盖为

    ```javascript
    fis.config.set('project.watch.exclude', 'node_modules');
    ```

    或者

    ```javascript
    fis.config.set('project.watch.exclude', ['node_modules', /docs/]);
    ```

### watch.usePolling

* 解释：设置项目源码监听的方式， `usePolling` 为 `true` 时会使用轮询的方式检查文件是否被修改，比较消耗CPU，但是适用场景更广。设置为 `false` 后会使用系统API进行文件修改检查，对性能消耗较小，但是可能由于系统版本不同，会存在兼容性问题。
* 值类型：``boolean``
* 默认值：`false`
* 用法：在项目的fis-conf.js里可以覆盖为

    ```javascript
    fis.config.set('project.watch.usePolling', true);
    ```

<i class="anchor" id='modules'></i>

## 插件配置

配置项 `modules`

> fis系统有非常灵活的插件扩展能力，详细内容请参看 [运行原理](/docs/more/fis-base.html)，[插件调用机制](/docs/more/how-plugin-works.html)，[插件扩展点列表](/docs/more/extension-point.html)等文档。
>
> fis所有的插件配置都支持定义一个 **数组或者逗号分隔的字符串序列** 来依次处理文件内容。

### parser

* 解释：配置编译器插件，可以根据 **文件后缀** 将某种语言编译成标准的js、css、html语言。
* 值类型：``Object``
* 默认值：无
* 说明：fis对文件进行编译时，首先进入的是parser阶段，该阶段的定义是： **将非标准语言编译成标准的html、js、css语言**。例如我们可以利用这个阶段的处理把coffee、前端模板文件编译成js，less、sass、compass编译成css。在该阶段配置的插件，实际调用的是 **fis-parser-xxx**，这是fis [parser插件命名规范](/docs/more/extension-point.html#parser) 所约束的。parser插件通常不会内置，如需要相关插件，可以使用npm安装，具体说明请参考文档 [插件调用机制](/docs/more/how-plugin-works.html)。由于parser的主要职责是统一标准语言，因此它经常会和 **roadmap.ext** 配置配合使用，用于标记某个后缀的文件在parser阶段之后当做某种标准语言进行处理。
* 用法：

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

### preprocessor

* 解释：配置 标准化预处理器插件，可以根据 **文件后缀** 对文件进行预处理。
* 值类型：``Object``
* 默认值：无
* 说明：标准化预处理的下一个阶段就是标准化处理阶段，标准化处理阶段主要责任是 [扩展三种语言能力](/docs/more/fis-standard.html)，因此preprocessor插件可以在标准化处理之前对内容进行某些修改，比如 [fis-preprocessor-image-set](https://github.com/fouber/fis-preprocessor-image-set) 插件，用于实现对retina屏的css的image-set属性支持。
* 用法：

    ```javascript
    fis.config.set('modules.preprocessor.css', 'image-set');
    ```

    或者

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

### postprocessor

* 解释：在fis对js、css和类html文件进行语言能力扩展之后调用的插件配置，可以根据 **文件后缀** 对文件进行后处理。该阶段的插件可以获取文件对象的完整requires信息。
* 值类型：``Object``
* 默认值：

    ```javascript
    { js : 'jswrapper' }
    ```
* 说明：标准化处理之后，fis已经完成了对前端领域语言的 [三种语言能力](/docs/more/fis-standard.html) 扩展，此时文件对象的相关信息已经获取到了，这个阶段我们可以对文件进行一些相关处理，比如amd包装等。fis内置的 [fis-postprocessor- jswrapper](https://github.com/fis-dev/fis-postprocessor-jswrapper) 插件就是在这个阶段对js进行包装的。
* 用法：类似 [modules.preprocessor](#preprocessor)

### lint

* 解释：单文件编译过程中的代码检查插件。
* 值类型：``Object``
* 默认值：无
* 说明：fis支持在文件进行编译的过程中进行代码检查，这类插件 **不会对文件内容做任何修改**。fis模块内置没有安装任何校验插件，用户如果需要，可以自行开发，并发布到npm上。
* 用法：

    ```javascript
    fis.config.set('modules.lint.js', 'jshint');
    ```

    或者

    ```javascript
    //fis-conf.js
    fis.config.merge({
        modules : {
            lint : {
                //js后缀文件会经过fis-lint-jshint插件的代码校验检查
                js : 'jshint'
            }
        }
    });
    ```

### test

* 解释：单文件编译过程中的自动测试插件。
* 值类型：``Object``
* 默认值：无
* 说明：fis支持在文件进行编译的过程中进行自动化测试，这类插件 **不会对文件内容做任何修改**。fis模块没有内置任何测试插件，用户如果需要，可以自行开发，并发布到npm上。
* 用法：

    ```javascript
    fis.config.set('modules.test.js', 'phantomjs');
    ```

    或者

    ```javascript
    //fis-conf.js
    fis.config.merge({
        modules : {
            test : {
                //js后缀文件会经过fis-test-phantomjs插件的测试
                js : 'phantomjs'
            }
        }
    });
    ```

### optimizer

* 解释：单文件编译过程中的最后阶段，对文件进行优化。
* 值类型：``Object``
* 默认值：

    ```javascript
    {
        js : 'uglify-js',
        css : 'clean-css',
        png : 'png-compressor'
    }
    ```

* 说明：单文件编译的最后阶段，可以对代码进行优化，通常是压缩、xss修复等工作，fis内置了3个压缩插件： [fis-optimizer-uglify-js](https://github.com/fis-dev/fis-optimizer-uglify-js)、[fis-optimizer-clean-css](https://github.com/fis-dev/fis-optimizer-clean-css)、[fis-optimizer-png-compressor](https://github.com/fex-team/fis-optimizer-png-compressor)。
* 用法：

    ```javascript
    fis.config.set('modules.optimizer.js', 'uglify-js');
    ```

    或者

    ```javascript
    //fis-conf.js
    fis.config.merge({
        modules : {
            optimizer : {
                //js后缀文件会经过fis-optimizer-uglify-js插件的压缩优化
                js : 'uglify-js'
            }
        }
    });
    ```

### prepackager

* 解释：打包预处理插件。
* 值类型：``Array`` | ``string``
* 默认值：无
* 说明：在fis打包操作前调用的插件， **不管调用fis release命令时是否使用 --pack 参数，该插件均会被调用**。
* 用法：

    ```javascript
    fis.config.set('modules.prepackager', 'oo, xx');
    ```

    或者

    ```javascript
    //fis-conf.js
    fis.config.merge({
        modules : {
            //打包前调用fis-prepackager-oo和fis-prepackager-xx插件进行处理
            prepackager : 'oo, xx'
        }
    });
    ```

### packager

* 解释：打包处理插件。
* 值类型：``Array`` | ``string``
* 默认值：'map', fis内置了打包插件 ``fis-packager-map``，生成 **map.json** 文件
* 说明：调用fis release命令时，添加 **--pack** 参数，该插件才会被调用。
* 用法：

    ```javascript
    fis.config.set('modules.packager', 'your_packager');
    ```

    或者

    ```javascript
    //fis-conf.js
    fis.config.merge({
        modules : {
            //打包调用fis-packager-your_packager插件进行处理
            packager : 'your_packager'
        }
    });
    ```

### spriter
* 解释：打包后处理csssprite的插件。
* 值类型：``Array`` | ``string``
* 默认值：'csssprites'，fis内置了spriter插件 ``fis-spriter-csssprites``，支持自动css打包
* 说明：调用fis release命令时，添加 **--pack** 参数，该插件才会被调用。
* 用法：

    ```javascript
    fis.config.set('modules.spriter', 'your_spriter');
    ```

    或者

    ```javascript
    //fis-conf.js
    fis.config.merge({
        modules : {
            //打包后调用fis-spriter-your_spriter插件进行css sprites化处理
            spriter : 'your_spriter'
        }
    });
    ```

### postpackager

* 解释：打包后处理插件。
* 值类型：``Array`` | ``string``
* 默认值：无
* 说明：在fis打包操作后调用的插件， **不管调用fis release命令时是否使用 --pack 参数，该插件均会被调用**。
* 用法：

    ```javascript
    fis.config.set('modules.postpackager', 'your_postpackager');
    ```

    或者

    ```javascript
    //fis-conf.js
    fis.config.merge({
        modules : {
            //打包后调用fis-postpackager-your_postpackager插件进行处理
            postpackager : 'your_postpackager'
        }
    });
    ```

<i class="anchor" id='settings'></i>

## 插件运行配置

配置项 `settings`

* 解释：插件的运行配置节点。
* 值类型：``Object``
* 默认值：无
* 说明：插件要工作，偶尔也需要配置数据，比如fis内置的[fis-optimizer-uglify-js](https://github.com/fis-dev/fis-optimizer-uglify-js/blob/master/index.js#L12)、[fis-optimizer-clean-css](https://github.com/fis-dev/fis-optimizer-clean-css/blob/master/index.js#L11)，它们的配置都是fis直接传递的，具体细节可以查看相应源码。配置节点具有很强的规律性，请参考下面的例子，小编就不一一枚举了。
* 用法：

    ```javascript
    fis.config.set('settings.optimizer.uglify-js.output.max_line_len', 500);
    fis.config.set('settings.optimizer.clean-css.keepBreaks', true);
    ```

    或者

    ```javascript
    //fis-conf.js
    fis.config.merge({
        settings : {
            optimizer : {
                //fis-optimizer-uglify-js插件的配置数据
                'uglify-js' : {
                    output : {
                        max_line_len : 500
                    }
                },
                //fis-optimizer-clean-css插件的配置数据
                'clean-css' : {
                    keepBreaks : true
                }
            }
        }
    });
    ```

## 内置插件运行配置

### postprocessor.jswrapper

* 项目：https://github.com/fis-dev/fis-postprocessor-jswrapper
* 解释：用于自动包装js代码的插件。
* 值类型：``Object``
* 默认值：无
* 选项：
    * ``type``：包装方式。可选值目前只有 'amd'，amd包装结构请参考 [这里](https://github.com/fis-dev/fis-postprocessor-jswrapper/blob/master/index.js#L16)，非amd包装结构参考 [这里](https://github.com/fis-dev/fis-postprocessor-jswrapper/blob/master/index.js#L20)
    * "template"：使用模板来定义包装结构，对template属性的设置优先级高于type属性。
    * ``wrapAll``：是否包装所有js文件。默认是false，只对标记为 ``isMod`` 的文件进行包装
* 用法：

    ```javascript
    fis.config.set('settings.postprocessor.jswrapper.template', 'try{ ${content} }catch(e){e.message+="${id}";throw e;}');
    ```

    或者

    ```javascript
    fis.config.merge({
        settings : {
            postprocessor : {
                jswrapper : {
                    template : 'try{ ${content} }catch(e){ e.message += "${id}"; throw e; }'
                }
            }
        }
    });
    ```

### optimizer.uglify-js

* 项目：https://github.com/fis-dev/fis-optimizer-uglify-js
* 解释：uglify-js压缩器配置。fis-optimizer-uglify-js 插件内置了 [uglify-js](https://github.com/mishoo/UglifyJS2) 包，并调用了它的 [minify](https://github.com/mishoo/UglifyJS2/blob/master/tools/node.js#L52) 接口，把配置选项直接传递过去。因此，fis的配置完全等价于uglify-js的minify函数所需的配置
* 值类型：``Object``
* 默认值：无
* 选项：
    * ``mangle``：混淆控制，参看uglify-js文档 [mangle](http://lisperator.net/uglifyjs/mangle) 部分
    * ``output``：输出控制，参看uglify-js文档 [codegen](http://lisperator.net/uglifyjs/codegen) 部分
    * ``compress``：优化参数，参看uglify-js文档 [compress](http://lisperator.net/uglifyjs/compress) 部分
* 用法：

    ```javascript
    //配置字符串全部转换为ascii字符
    fis.config.set('settings.optimizer.uglify-js.output.ascii_only', true);
    ```

    或者

    ```javascript
    //配置字符串全部转换为ascii字符
    fis.config.merge({
        settings : {
            optimizer : {
                'uglify-js' : {
                    output : {
                        ascii_only : true
                    }
                }
            }
        }
    });
    ```

### optimizer.clean-css

* 项目：https://github.com/fis-dev/fis-optimizer-clean-css
* 解释：clean-css压缩器配置。fis-optimizer-clean-css 插件调用 [clean-css](https://github.com/GoalSmashers/clean-css) 的压缩接口进行压缩，fis负责把 ``settings.optimizer.clean-css`` 配置节点的数据传递给压缩器，因此，这里的配置完全等价于clean-css的运行配置。
* 值类型：``Object``
* 默认值：无
* 选项：参看clean-css的 [文档](https://github.com/GoalSmashers/clean-css#how-to-use-clean-css-programmatically)
* 用法：

    ```javascript
    //配置压缩css时保留换行
    fis.config.set('settings.optimizer.clean-css.keepBreaks', true);
    ```

    或者

    ```javascript
    //配置压缩css时保留换行
    fis.config.merge({
        settings : {
            optimizer : {
                'clean-css' : {
                    keepBreaks : true
                }
            }
        }
    });
    ```

### optimizer.png-compressor

* 项目：https://github.com/fis-dev/fis-optimizer-png-compressor
* 解释：png图片压缩器运行配置。fis团队将 ``pngquant`` 和 ``pngcrush`` 两个优秀的png图片压缩工具移植为nodejs的原生扩展（[node-pngcrush](https://github.com/xiangshouding/node-pngcrush)与[node-pngquant-native](https://github.com/xiangshouding/node-pngquant-native)），相比同类型工具采用进程调用的方式更高性能，压缩速度更快。
* 值类型：``Object``
* 默认值：无
* 选项：
    * ``type``：选择压缩器类型，默认是 'pngcrush'，可选值为 'pngquant'，pngquant会将所有 ``png24`` 的图片压缩为 ``png8``，压缩率极高，但alpha通道信息会有损失。
* 用法：

    ```javascript
    //使用pngquant进行压缩，png图片压缩后均为png8
    fis.config.set('settings.optimizer.png-compressor.type', 'pngquant');
    ```

    或者

    ```javascript
    //使用pngquant进行压缩，png图片压缩后均为png8
    fis.config.merge({
        settings : {
            optimizer : {
                'png-compressor' : {
                    type : 'pngquant'
                }
            }
        }
    });
    ```

### spriter.csssprites

* 项目：https://github.com/fis-dev/fis-spriter-csssprites
* 解释：csssprite处理运行配置，以css文件为单位，对其引用的png、gif、jpg、jpeg等图片进行csssprite合并处理。[@zhangyuanwei](https://github.com/zhangyuanwei) 同学将常用图片处理库的c++版本移植为nodejs的原生扩展，得到npm包 [node-images](https://npmjs.org/package/node-images)，fis团队在此基础上进行包装，开发出了这款十分易用的csssprite插件。
* 值类型：``Object``
* 默认值：

    ```javascript
    {
        margin       : 3,
        layout       : 'linear',
        width_limit  : 10240,
        height_limit : 10240
    }
    ```

* 选项：
    * ``margin``：图之间的边距，单位像素。
    * ``layout``：布局算法，默认是 'linear'，图片垂直布局，水平方向无需 ``遮盖处理`` 。可选项还有 ``matrix``，图片矩阵布局，面积最小化，但需要提供额外的dom控制水平方向图片的遮盖处理
* 注意：使用csssprite需要满足以下条件
    1. 使用release命令时，添加 ``-p`` 或者 ``--pack`` 参数。由于csssprite处理需要消耗一定的计算资源，并且开发过程中并不需要时刻做图片合并，因此fis将其定义为打包处理流程，启动csssprite处理需要指定--pack参数。
    1. 只有 [打包的css文件](/docs/api/fis-conf.html#pack) 或者 [roadmap.path](/docs/api/fis-conf.html#roadmappath) 中 ``useSprite`` 属性标记为 ``true`` 的文件才会进行csssprite处理，因此请合理安排要进行csssprite处理的文件，尽量对合并后的文件做处理。
    1. 在css中引用图片时，只要加上 ``?__sprite`` 这个query标记就可以使用csssprite了。详情请参考fis-spriter-csssprites插件的 [使用文档](https://github.com/fis-dev/fis-spriter-csssprites#%E4%BD%BF%E7%94%A8)。
* 用法：

    ```javascript
    //使用矩阵布局
    fis.config.set('settings.spriter.csssprites.layout', 'matrix');
    ```

    或者

    ```javascript
    //使用矩阵布局
    fis.config.merge({
        settings : {
            spriter : {
                csssprites : {
                    layout : 'matrix'
                }
            }
        }
    });
    ```

<i class="anchor" id='roadmap'></i>

## 目录规范与域名配置

配置项 `roadmap`

### roadmap.path

* 解释：定制项目文件属性，包括但不限于 **产出路径，访问url，资源id，默认依赖，文件类型**。
* 值类型：``Array``
* 默认值：无
* 说明：roadmap.path配置是fis编译系中非常核心的机制，使用它可以控制文件编译后发布的路径或访问的url、操纵文件属性、为fis产出的资源表添加扩展信息，它的 [实现原理](https://github.com/fouber/fis-kernel/blob/master/lib/uri.js#L45-L67) 也很简单：当fis创建一个内部的 [file对象](https://github.com/fouber/fis-kernel/blob/master/lib/file.js#L130) 时，会利用roadmap.path来匹配文件路径，如果命中，则将当前规则下的属性及其值赋给file对象，从而影响file对象的相关信息(发布路径、访问url、资源表属性等)。roadmap.path是fis系统中资源定位的核心能力，具有非常重要的意义。由于fis自动化工具接管了js、css和类html语言的 **资源定位能力**，因此，用户在开发时只需使用相对路径对资源进行引用，fis编译时会根据roadmap.path的配置调整引用内容，并将代码产出到配置指定的位置，一切都配合的非常完美！
* 支持的配置项：
    * ``reg``：用于匹配文件路径的正则(RegExp)或通配(String)。文件路径是相对项目根目录的路径，以 ``/`` 开头。
    * ``release``：设置文件的产出路径。默认是文件相对项目根目录的路径，以 ``/`` 开头。该值可以设置为 ``false`` ，表示为不产出（unreleasable）文件。
    * ``url``：指定文件的资源定位路径，以 ``/`` 开头。默认是 ``release`` 的值，url可以与发布路径 ``release`` 不一致。
    * ``query``：指定文件的资源定位路径之后的query，比如'?t=123124132'。
    * ``id``：指定文件的资源id。默认是 ``namespace`` + ``subpath`` 的值。
    * ``charset``：指定文本文件的输出编码。默认是 ``utf8``，可以制定为 ``gbk`` 或 ``gb2312``等。
    * ``isHtmlLike``：指定对文件进行html相关的 [语言能力扩展](/docs/more/fis-standard.html)
    * ``isJsLike``：指定对文件进行js相关的 [语言能力扩展](/docs/more/fis-standard.html)
    * ``isCssLike``：指定对文件进行css相关的 [语言能力扩展](/docs/more/fis-standard.html)
    * ``useCompile``：指定文件是否经过fis的编译处理，如果为false，则该文件不会做任何编译处理。
    * ``useHash``：指定文件产出后是否添加md5戳。默认只有js、css、图片文件会添加。
    * ``useDomain``：指定文件引用处是否添加域名。
    * ``useCache``：指定文件编译过程中是否创建缓存，默认值是 ``true``。
    * ``useMap``：指定fis在打包阶段是否将文件加入到map.json中索引。默认只有isJsLike、isCssLike、isMod的文件会加入表中
    * ``useParser``：指定文件是否经过parser插件处理。默认为true，值为 ``false`` 时才会关闭。
    * ``usePreprocessor``：指定文件是否经过preprocessor插件处理。默认为true，值为 ``false`` 时才会关闭。
    * ``useStandard``：指定文件是否经过内置的三种语言标准化流程处理。默认为true，值为 ``false`` 时才会关闭。
    * ``usePostprocessor``：指定文件是否经过postprocessor插件处理。默认为true，值为 ``false`` 时才会关闭。
    * ``useLint``：指定文件是否经过lint插件处理。默认为true，值为 ``false`` 时才会关闭。
    * ``useTest``：指定文件是否经过test插件处理。默认为true，值为 ``false`` 时才会关闭。
    * ``useOptimizer``：指定文件是否经过optimizer插件处理
    * ``useSprite``：指定文件是否进行csssprite处理。默认是 ``false``，即不对单个文件进行csssprite操作的，而只对合并后的文件进行。fis release中使用 ``--pack`` 参数即可触发csssprite操作。
    * ``isMod``：标记文件为组件化文件。被标记成组件化的文件会入map.json表。并且会对js文件进行组件化包装。
    * ``extras``：在map.json中的附加数据，用于扩展map.json表的功能。
    * ``requires``：默认依赖的资源id表，类型为Array。
* 用法：

    ```javascript
    fis.config.merge({
        roadmap : {
            path : [
                {
                    //所有widget目录下的js文件
                    reg : 'widget/**.js',
                    //是模块化的js文件（标记为这种值的文件，会进行amd或者闭包包装）
                    isMod : true,
                    //默认依赖lib.js
                    requires : [ 'lib.js' ],
                    //向产出的map.json文件里附加一些信息
                    extras : { say : '123' },
                    //编译后产出到 /static/widget/xxx 目录下
                    release : '/static$&'
                },
                {
                    //所有的js文件
                    reg : '**.js',
                    //发布到/static/js/xxx目录下
                    release : '/static/js$&'
                },
                {
                    //所有的ico文件
                    reg : '**.ico',
                    //发布的时候即使加了--md5参数也不要生成带md5戳的文件
                    useHash : false,
                    //发布到/static/xxx目录下
                    release : '/static$&'
                },
                {
                    //所有image目录下的.png，.gif文件
                    reg : /^\/images\/(.*\.(?:png|gif))/i,
                    //访问这些图片的url是 '/m/xxxx?log_id=123'
                    url : '/m/$1?log_id=123',
                    //发布到/static/pic/xxx目录下
                    release : '/static/pic/$1'
                },
                {
                    //所有template目录下的.php文件
                    reg : /^\/template\/(.*\.php)/i,
                    //是类html文件，会进行html语言能力扩展
                    isHtmlLike : true,
                    //发布为gbk编码文件
                    charset : 'gbk',
                    //发布到/php/template/xxx目录下
                    release : '/php/template/$1'
                },
                {
                    //前面规则未匹配到的其他文件
                    reg : /.*/,
                    //编译的时候不要产出了
                    release : false
                }
            ]
        }
    });
    ```

### roadmap.ext

* 解释：指定后缀名与标准化语言的映射关系。
* 值类型：``Object``
* 默认值：无
* 说明：fis允许在前端开发中使用less、coffee、utc等非标准语言，并能利用插件将它们编译成标准的js、css语言。这个过程是由modules.parser配置的插件处理的。编译之后，less会变成css文件，那么，后续对于css的处理应该同样可以适用于less的生成文件，因此，这个时候需要通过配置告诉fis，less文件会编译为css文件，并在后续的处理过程中当做css文件对待。
* 用法：

    ```javascript
    //fis-conf.js
    fis.config.merge({
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

### roadmap.domain

* 解释：设置静态资源的域名前缀。
* 值类型：``Object`` | ``string``
* 默认值：无
* 说明：fis扩展了html、js、css的[三种语言能力](/docs/more/fis-standard.html)，并支持对资源的定位，定位包括 **开发路径与发布路径的映射关系** 以及 **静态资源服务器域名设置**。roadmap.domain节点就是用于控制该能力的配置。
* 注意：domain的值如果不是特殊需要，请 **不要以"/"结尾**。
* 用法：

    ```javascript
    //fis-conf.js
    //用法一
    fis.config.merge({
        roadmap : {
            //所有静态资源文件都使用 http://s1.example.com 或者 http://s2.example.com 作为域名
            domain : 'http://s1.example.com, http://s2.example.com'
        }
    });
    //用法二
    fis.config.merge({
        roadmap : {
            domain : {
                //widget目录下的所有css文件使用 http://css1.example.com 作为域名
                'widget/**.css' : 'http://css1.example.com',
                //所有的js文件使用 http://js1.example.com 或者  http://js2.example.com 作为域名
                '**.js' : ['http://js1.example.com', 'http://js2.example.com']
            }
        }
    });
    ```
    编译时使用fis release的 ``--domains`` 参数来控制是否添加domain

    ```bash
    $ fis release --domains --dest ../output
    ```

### roadmap.domain.image

* 解释：设置图片资源的域名前缀。
* 值类型：``Array`` | ``string``
* 默认值：无
* 说明：由于使用配置roadmap.domain.ext方式来配置图片资源太麻烦，fis提供了image字段，对于符合 [project.fileType.image](/docs/api/fis-conf.html#fileTypeimage) 规则的文件，设置相应domain配置。
* 用法：

    ```javascript
    //fis-conf.js
    fis.config.merge({
        roadmap : {
            domain : {
                //所有图片文件，使用 http://img.example.com 作为域名
                'image' : ['http://img.example.com']
            }
        }
    });
    ```
    编译时使用fis release的 ``--domains`` 参数来控制是否添加domain

    ```bash
    $ fis release --domains --dest ../output
    ```

<i class="anchor" id='deploy'></i>

## 部署配置

配置项 `deploy`

* 解释：设置项目的发布方式。
* 值类型：``Object``
* 默认值：无
* 说明：当使用 fis release 命令时，参数 **--dest &lt;name&gt;** 可以指定项目发布配置。deploy配置是一个key-value的object对象，--dest参数的值如果与配置的key相同，则执行该配置的部署设置。fis支持使用post请求向http服务器发送文件，服务器端可以使用php、java等后端逻辑进行接收，[fis-command-release](https://github.com/fis-dev/fis-command-release)插件中提供了一个这样的 [php版示例](https://github.com/fis-dev/fis-command-release/blob/master/tools/receiver.php)，用户可以直接部署此文件于接收端服务器上。
* 用法：

    ```javascript
    //fis-conf.js
    fis.config.merge({
        deploy : {
            //使用fis release --dest remote来使用这个配置
            remote : {
                //如果配置了receiver，fis会把文件逐个post到接收端上
                receiver : 'http://www.example.com/path/to/receiver.php',
                //从产出的结果的static目录下找文件
                from : '/static',
                //保存到远端机器的/home/fis/www/static目录下
                //这个参数会跟随post请求一起发送
                to : '/home/fis/www/',
                //通配或正则过滤文件，表示只上传所有的js文件
                include : '**.js',
                //widget目录下的那些文件就不要发布了
                exclude : /\/widget\//i,
                //支持对文件进行字符串替换
                replace : {
                    from : 'http://www.online.com',
                    to : 'http://www.offline.com'
                }
            },
            //名字随便取的，没有特殊含义
            local : {
                //from参数省略，表示从发布后的根目录开始上传
                //发布到当前项目的上一级的output目录中
                to : '../output'
            },
            //也可以是一个数组
            remote2 : [
                {
                    //将static目录上传到/home/fis/www/webroot下
                    //上传文件路径为/home/fis/www/webroot/static/xxxx
                    receiver : 'http://www.example.com/path/to/receiver.php',
                    from : '/static',
                    to : '/home/fis/www/webroot'
                },
                {
                    //将template目录内的文件（不包括template一级）
                    //上传到/home/fis/www/tpl下
                    //上传文件路径为/home/fis/www/tpl/xxxx
                    receiver : 'http://www.example.com/path/to/receiver.php',
                    from : '/template',
                    to : '/home/fis/www/tpl',
                    subOnly : true
                }
            ]
        }
    });
    ```

* 小贴士：

* **--dest参数** 支持使用逗号（,）分割多个发布配置，比如上面的例子，我们可以使用fis release --dest **remote,plugin** 命令在一次编译中同时发布多个目标。

* subOnly参数
默认上传from整个目录到测试机。添加subOnly参数仅上传from目录下文件。

* replace替换多个字符串
需要replace替换多个字符串，可以使用正则的方式。例如：

```javascript
replace : {
    from : /www\.a\.com|www\.b\.com/,
    to : function(m){
        if(m === 'www.a.com') return 'www.x.com';
        if(m === 'www.b.com') return 'www.y.com';
    }
}
```

### deploy 扩展

通过 `deploy扩展` 能力，用户可以自定义 fis 的产出功能，更方便的实现自动化部署功能。目前官方提供的 `deploy扩展` 有

    - [tar](https://github.com/fex-team/fis-deploy-tar)
    - [git](https://github.com/fex-team/fis-deploy-git)
    - [bcs](https://github.com/fex-team/fis-deploy-bcs)

此外还有社区贡献的如

    - [aliyun](https://github.com/suiqirui1987/fis-deploy-aliyun)
    - [zip](https://github.com/zhaoran/fis-deploy-zip)
    - [ftp](https://github.com/qdsang/fis-deploy-ftp)

* 用法：

```javascript
// 设置开启deploy扩展，可以输入数组来开启多个扩展
fis.config.set('modules.deploy', 'tar');

// 为指定扩展设置发布配置
fis.config.set('settings.deploy.tar', {
    publish : {
        from : '/',
        to: '/',
        gzip: true,
        level: 0, //压缩质量 0-9，越大压缩比越高
        memLevel: 6, //压缩使用的内存量 1-9， 越大占用内存越多，执行速度越快
        file: './output/output.tar.gz'
    }
});
```

```bash
# 发布至output/output.tar.gz
fis release -d publish
```

<i class="anchor" id='pack'></i>

## 打包配置


配置项 `pack`

* 解释：配置要打包合并的文件。
* 值类型：``Object``
* 默认值：无
* 说明：fis内置的 [打包策略](/docs/more/fis-base.html#pack) 与传统的打包概念不同，fis的打包实际上是在建立一个资源表，并将其描述并产出为一份map.json文件，用户应该围绕着这份描述文件来设计前后端运行框架，从而实现运行时判断打包输出策略的架构。
* 用法：

    ```javascript
    //fis-conf.js
    fis.config.merge({
        pack : {
            //打包所有的demo.js, script.js文件
            //将内容输出为static/pkg/aio.js文件
            'pkg/aio.js' : ['**/demo.js', /\/script\.js$/i],
            //打包所有的css文件
            //将内容输出为static/pkg/aio.css文件
            'pkg/aio.css' : '**.css'
        }
    });
    ```

* 输出结果：使用命令 fis release **--pack** --md5 --dest ./output 编译项目，然后到output目录下查看产出的map.json内容得到：

    ```json
    {
        "res": {
            "demo.css": {
                "uri": "/static/css/demo_7defa41.css",
                "type": "css",
                "pkg": "p1"
            },
            "demo.js": {
                "uri": "/static/js/demo_33c5143.js",
                "type": "js",
                "deps": [
                    "demo.css"
                ],
                "pkg": "p0"
            },
            "index.html": {
                "uri": "/index.html",
                "type": "html",
                "deps": [
                    "demo.js",
                    "demo.css"
                ]
            },
            "script.js": {
                "uri": "/static/js/script_32300bf.js",
                "type": "js",
                "pkg": "p0"
            },
            "style.css": {
                "uri": "/static/css/style_837b297.css",
                "type": "css",
                "pkg": "p1"
            }
        },
        "pkg": {
            "p0": {
                "uri": "/static/pkg/aio_5bb04ef.js",
                "type": "js",
                "has": [
                    "demo.js",
                    "script.js"
                ],
                "deps": [
                    "demo.css"
                ]
            },
            "p1": {
                "uri": "/static/pkg/aio_cdf8bd3.css",
                "type": "css",
                "has": [
                    "demo.css",
                    "style.css"
                ]
            }
        }
    }
    ```
