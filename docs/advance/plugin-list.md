---
layout: post
title: 插件列表- F.I.S
category: plugin
---

# 插件列表

插件列表中并未列举所有FIS插件扩展点的插件，仅提供了比较具有通用性的插件。FIS的具体扩展点以及功能可以参见[插件扩展点列表](/docs/more/extension-point.html)。

通过FIS内置的[目录规范设置](/docs/api/fis-conf.html#roadmap)，配合下列插件，我们可以满足绝大部分的前端构建需求，如果这里的插件仍无法满足你的需求，你也可以考虑自行通过配置扩展或[插件扩展](/docs/dev/plugin.html)的形式定制构建流程。

希望将自己插件放在列表中的朋友也可以[联系我们](/index.html#contact-sec)添加。

## 语言扩展类插件

> 语言扩展类插件的主要工作是将异构语言编译为前端语言。举例来说将CoffeeScript或TypeScript翻译为JavaScript、将Less或Sass翻译为CSS、将各种前端模版预编译为JavaScript提高运行时的效率，总之就是将各种非原生前端语言编译为浏览器支持的前端语言。通过语言扩展类插件我们可以按照自己喜好混合各种语言，无需各种工具支撑，使用FIS发布一次就全部处理完成。

* [fis-parser-coffee-script](https://github.com/fouber/fis-parser-coffee-script)：将[CoffeeScript](http://coffeescript.org/)编译成JavaScript
* [fis-parser-typescript](https://github.com/jakeauyeung/fis-parser-typescript)：将[TypeScript](http://www.typescriptlang.org/)编译成JavaScript
* [fis-parser-less](https://github.com/fouber/fis-parser-less)：将[Less](http://lesscss.org/)编译成CSS
* [fis-parser-sass](https://github.com/fouber/fis-parser-sass)：将[Sass](http://www.sass-lang.com/)编译成CSS
* [fis-parser-jade](fis-parser-jade)：将[Jade](http://jade-lang.com)编译成HTML
* [fis-parser-marked](https://github.com/fouber/fis-parser-marked)：将Markdown文件编译成HTML
* [fis-parser-handlebars](https://github.com/fouber/fis-parser-handlebars)：将[handlebars](http://handlebarsjs.com/)前端模板编译成JavaScript
* [fis-parser-utc](https://github.com/fouber/fis-parser-utc)：将[Underscore](http://underscorejs.org)前端模板编译成JavaScript
* [fis-parser-bdtmpl](https://github.com/fouber/fis-parser-bdtmpl)：将[baiduTemplate](http://baidufe.github.io/BaiduTemplate/)前端模板文件编译成JavaScript
* [fis-parser-react](https://github.com/fouber/fis-parser-react)：预编译[react](http://facebook.github.io/react/)项目

> 此类插件一般都会使用parser扩展点，可以在npm中搜索[fis parser](https://www.npmjs.org/search?q=fis+parser)找到更多。

## 标准后处理器插件

> 标准后处理器插件的运行时间是在FIS进行了异构语言编译以及标准化处理后。主要用于对文件文件编译内容做最后的调整。

* [fis-postprocessor-require-async](https://github.com/xiangshouding/fis-postprocessor-require-async)：识别代码中的 ```require.async('path/to/js')``` ，将动态加载的组件信息加入map.json中，方便后续在打包和资源管理等插件中调用。
* [fis-postprocessor-jswrapper](https://github.com/fex-team/fis-postprocessor-jswrapper)：自动为代码添加amd包装代码，在代码编写时就无需手动添加，使得编写前端模块化代码的开发体验与Node.js一致，已内置。

## 代码检查插件

> 用于对代码进行校验，执行fis release命令时添加 --lint参数会调用该类型插件。

* [fis-lint-jshint](https://github.com/fouber/fis-lint-jshint)：使用jshint进行Javascript代码静态分析
* [fis-lint-csslint](https://github.com/BenzLeung/fis-lint-csslint)：使用csslint进行CSS静态分析

## 代码优化插件

> 用于各种文件优化，比如脚本、图片、样式文件压缩

* [fis-optimizer-uglify-js](https://github.com/fex-team/fis-optimizer-uglify-js)：使用uglify-js压缩脚本资源，已内置。
* [fis-optimizer-clean-css](https://github.com/fex-team/fis-optimizer-clean-css)：使用clean-css压缩样式资源，已内置。
* [fis-optimizer-png-compressor](https://github.com/fex-team/fis-optimizer-png-compressor):压缩图片，已内置。
* [fis-optimizer-shutup](https://github.com/fouber/fis-optimizer-shutup)：移除alert，console，console.log等调试信息

## 打包前处理插件

> 在项目进行打包处理操作前，用于处理整个项目的插件。在这个阶段的插件获取了所有源代码信息，包括资源依赖信息、文件发布路径等等。

* [fis-prepackager-autoload](https://github.com/hefangshi/fis-prepackager-autoload)：自动加载页面依赖的脚本与样式资源

## 打包后处理插件

> 在项目进行打包处理操作后，用于处理整个项目的插件。在这个阶段的插件除了源代码插件信息，还能够获取到打包文件信息。

* [fis-postpackager-simple](https://github.com/hefangshi/fis-postpackager-simple)：自动合并页面中引用的脚本、样式资源，减少HTTP连接数。