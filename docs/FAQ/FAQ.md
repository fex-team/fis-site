---
layout: post
title: FAQ- F.I.S
category: FAQ
---

1. fis安装不上怎么办？

[npm](https://www.npmjs.org/)是nodejs的包管理工具。安装nodejs后，npm就自动一起安装了。

* 用nodejs写的模块都发布在npm上。[npm网站](https://www.npmjs.org/)
* 用户需要使用npm install命令来安装nodejs模块。更多npm使用，执行 npm -h 来查看
* ``由于npm经常被墙，安装fis的时候会出现速度过慢，或者安装不上的问题`` 。
* 可以通过 npm的 ``--registry`` 参数指定仓库。指定国内的npm镜像来解决npm被墙的问题。

例如： 

```bash
npm install some-npm-module -g --registry=国内镜像
```
* 下面提供一个国内镜像。其他镜像大家可以自己找找
* --registry=http://r.cnpmjs.org


2. fis中怎么使用less和coffee？

项目中使用less、coffee的方法：

安装less、coffee的fis扩展插件： shell npm install -g fis-parser-less npm install -g fis-parser-coffee
配置fis，调用相关插件

```javascript
fis.config.set('modules.parser.less', 'less');
fis.config.set('modules.parser.coffee', 'coffee');
```

这样，你项目中的less、coffee后缀的文件就都能被编译成css或者js了。

另外，wiki看过了么： https://github.com/fis-dev/fis/wiki

fis的编译有一个内置的流程，你可以根据需要在适当的流程中使用插件处理你的文件。每个文件的处理，以后缀名为依据，分别会经过：语言处理（parser）→标准预处理（preprocessor）→标准后处理（postprocessor）→校验（lint）→测试（test）→优化（optimizer）

配置的方式是

```javascript
fis.config.set('modules.流程名.文件后缀', '插件名');
```

这里涉及到两个概念：流程 与 插件

流程：比如你希望用fis开发less，首先，less文件的语言处理阶段是 parser ，这个阶段负责把less、coffee这样的非标准化语言，转换成标准语言（标准语言只有js、css和html）。
插件：在 parser 阶段，fis会根据fis-conf.js的配置和文件后缀调用插件，fis内置了几个插件，但没有less、coffee，所以在需要less、coffee构建的时候，你需要先安装相关插件，来扩展fis的功能。插件的命名是 fis-流程名-插件名，比如这里我们要在parser阶段编译less，那么我们的插件名就是 fis-parser-less。


3. release的时候有error，怎么看详细信息？

fis release 加上 --verbose参数，可以显示详细信息.


4. deploy时如何进行多个字符串替换？

```javascript
{
    ....
    replace : {
        from : /http:\/\/www\.(\w+)\.com/g,
        to : function(m, $1){
            switch($1){
                case 'online1':
                    return 'http://www.offline1.com';
                case 'online2':
                    return 'http://www.offline2.com';
                default : 
                    return 'http://www.offline.com';
            }
        }
    },
    ....
}
```

利用replace的function功能

**这个功能一般是给发布的时候需要替换线上线下路径用的** ，如果希望针对文件内容做一些处理，应该用fis的插件系统：

```javascript
fis.config.set('modules.preprocessor.js', function(content){
    //这里处理content，并返回处理结果
    return content;
});
```

上面的配置只是针对js后缀的文件的。


5. fis release 之后得目录在哪里啊?
如果没有指定或者設置常量会存放到用戶跟目錄下。可以使用以下命令打开。

```bash
    fis server open
```


6. fis & fisp 区别

可以参考以下文章：
http://fex.baidu.com/blog/2014/03/fis-plus/


7. less @import (inline)时，--watch不起作用？

import (inline) 是less处理的，没有让fis管理。可以尝试把@import (inline) "b.less"改成@import url('b.less?__inline'); 有FIS来管理。

4. 想扩展fis，实现manifest功能怎么做？

可以的，fis没有针对前端领域开发的方方面面做出demo，但fis是一个很灵活的构建系统，以manifest为例，可以这样配置fis来生成：

```javascript
//配置fis在打包后处理阶段的一些操作
fis.config.set('modules.postpackager', function(ret){
    //创建一个新文件
    var manifest = fis.file(fis.getProjectPath('res.manifest'));
    //文件内容
    var content = [ 'CACHE MANIFEST', 'CACHE:' ];
    //manifest文件的url路径
    var url = manifest.getUrl();
    //ret参数已经帮你准备好了所有源码文件，这里只要遍历就好了
    fis.util.map(ret.src, function(subpath, file){
        if(file.isHtmlLike){ //如果是html类文件
            //把manifest文件的url插入到html标签之后
            file.setContent(file.getContent().replace(/<html\s+/g, '$&manifest="' + url + '" '));
        } else if (file.isJsLike || fils.isCssLike){ //如果是js、css类文件
            content.push(file.getUrl()); //把文件的url放到manifest文件中
        }
    });
    //设置manifest文件内容
    manifest.setContent(content.join('\n'));
    //把文件对象加到打包文件表中，fis会自动发布出来
    ret.pkg[manifest.subpath] = manifest;
});
```


这样，我们就基于fis，开发出了一种manifest支持的模式，工程师无需手动维护文件的内容。当然，我们也可以给文件自定义一些属性，来控制是否加入到manifest表中。比如我们假设 只允许某些特定文件做manifest，其他文件不需要。我们可以修改前面的配置，加上一个小小的标示：

```javascript
fis.config.set('modules.postpackager', function(ret){
    var manifest = fis.file(fis.getProjectPath('res.manifest'));
    var content = [ 'CACHE MANIFEST', 'CACHE:' ];
    var url = manifest.getUrl();
    fis.util.map(ret.src, function(subpath, file){
        if(file.isHtmlLike){ //如果是html类文件
            file.setContent(file.getContent().replace(/<html\s+/g, '$&manifest="' + url + '" '));
        } else if (file.useManifest){ //如果文件有useManifest属性，才加入缓存
            content.push(file.getUrl()); 
        }
    });
    manifest.setContent(content.join('\n'));
    ret.pkg[manifest.subpath] = manifest;
});

```


这里我们使用到了文件的一个叫 useManifest 的属性，这个属性其实是不存在的，我新增加的，如果我们希望某个文件有这样的属性值，比如我们希望 lib目录下的js加入到manifest中，那么我们只要再追加这样的配置就好了：

```javascript
fis.config.set('roadmap.path', [
    {
        reg : 'lib/**.js',           //lib目录下的所有js文件
        useManifest : true   //文件属性中useManifest为true
    }
]);

```

这个 roadmap.path 就是fis内部文件系统的配置选项，我们可以用reg这个属性来匹配文件路径，然后追加或修改文件的属性，roadmap.path作为前端架构设计中的规范设计描述提供给使用者。

另外，经过许多团队的实践表明，application cache目前还有各种莫名其妙的坑，如果决定使用，请仔细验证可行性和可靠性问题


