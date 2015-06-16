---
layout: post
title: 插件开发API
category: api
---
# 插件开发API

插件开发中需要用到的一些接口。

> 如果说明还是不够清晰，nodejs里面查看方法最好最容易的方法就是require这个包，并`console.log`出来。这样就可以一个一个尝试效果。
>> \#打开node交互命令行。<br />
>> $ node <br />
>> \> var fis = require("fis"); <br/>
>> \> console.log(fis.file);

## Object-Oriented

FIS在OO这块扩展了Object，给其添加了一个派生方法`Object.derive`。细节就不说了，直接来看使用。

定义一个Object

```javascript

var Foo = Object.derive(function() {
    //constructor
}, {
    //extend
});

```
使用Object

```javascript
var foo = new Foo();
```

## fis.util
`fis.util`包含了很多有用的工具方法，比如转码、读取文件、map等。

### is(source, type)

```javascript
fis.util.is('fis', 'String');
// => true
```
### map(obj, callback)

```javascript
var arr = [1, 2, 3];
fis.util.map(arr, function(key, value) {
    console.log(key + ' => ' + value);
})
// => 
//  0 => 1 
//  1 => 2 
//  2 => 3
```

### pad(str, len, fill, pre)
    
```javascript
fis.util.pad('aaa', 5, '.');
// => aaa..
fis.util.pad('aaa', 5, '.', true);
// => ..aaa
```
### merge(source, target)
    
```javascript
var a = {
    key: 'value';
};
var b = {
    key1: 'value1'
};

var ab = fis.util.merge(a, b);
// => {key: 'value', key1: 'value1'}
```

### clone(source)
    
```javascript
var a = {data: 'string'};
var b = fis.util.clone(a);
assert(a == b, 'a != b');
// => AssertionError: a != b
```
### escapeReg(str)

```javascript
fis.util.escapeReg('/home/fis/a.js');
// => \\/home\\/fis\\/a\\.js
```
### escapeShellCmd(str)
### escapeShellArg(str)

### stringQuote(str [, quotes])
- `str` String 字符串
- `quotes` String 引号

```javascript
fis.util.stringQuote('"fis"');
// => { origin: '"fis"', rest: 'fis', quote: '"' }
```

### getMimeType(ext)
- `ext` String 文件后缀

获取对于文件后缀的 MIME

```javascript
fis.util.getMimeType('png')
// => image/png
```

### realpath(path)
- `path` String

```javascript
//cwd: /home/fis
fis.util.realpath('..');
// => /home
```
### realpathSafe(path)
- `path` String 路径

安全得获取文件的实际路径，有别于 [realpath](#realpath) 的是，其如果文件或者目录不存在返回 `false` 而此如果不存在返回传入的 `path` 。如果存在文件或者路径才返回实际路径。

```javascript
//cwd: /home/fis
fis.util.realpathSafe('../a.js');
///home/a.js不存在
// => ../a.js
```

### isAbsolute(path)
- `path` String 路径

判别给定路径是否是绝对路径，是返回 `true` 不是返回 `false`。

```javascript
fis.util.isAbsolute('/usr/');
// => true
fis.util.isAbsolute('/usr');
// => false
fis.util.isAbsolute('usr/');
// => false
```

### isFile(path)
- `path` String 路径

判别给定路径是否是一个文件，如果是返回 `true` 不是返回 `false`。

```js
console.log(file.util.isFile('path/to/exist/file'));
// => true
```

### isDir(path)
- `path` String 路径

判别给定路径是否是一个文件夹，如果是返回 `true` 不是返回 `false`。

```js
console.log(file.util.isDir('/tmp'));
// => true
```

### mtime(path)
- `path` String 文件路径

获取文件的最后修改时间

```js
fis.util.mtime('/tmp/debug/log.log');
// => Tue Jun 16 2015 15:36:13 GMT+0800 (CST)

var mtime = fis.util.mtime('/tmp/debug/log.log');

console.log(mtime instanceof Date);
// => true
```

### touch(path, mtime)
- `path` String 文件路径
- `mtime` Date  时间

修改文件的最后修改时间，如果 `mtime` 未指定，使用当前时间；

### isWin()
这个函数返回是否是 Windows 系统，如果是返回 `true` 如果不是返回 `false`。

### isTextFile()

这个函数返回一个文件是否是文本文件，是返回 `true` 不是返回 `false`。FIS 中文件类型的判别是通过文件后缀做的。相关配置[project.fileType.text](https://github.com/fex-team/fis/wiki/%E9%85%8D%E7%BD%AEAPI#projectfiletypetext)

### isImageFile()

这个函数返回一个文件是否是图片文件，是返回 `true` 不是返回 `false`，FIS 中文件类型的判别是通过文件后缀做的。相关配置[project.fileType.image](https://github.com/fex-team/fis/wiki/%E9%85%8D%E7%BD%AEAPI#projectfiletypeimage)

### md5(data, len)
- `data` String 文件内容
- `len` Int 最后获取文件的 md5 长度，默认长度为 7

```javascript
fis.util.md5('fis'); //不设定len，默认7个。最长32个
// => 37ab815
fis.util.md5('fis', 32);
// => 37ab815c056b5c5f600f6ac93e486a78
```
### base64(data)
### mkdir(path, mode)
### toEncoding(str, encoding)

```javascript
fis.util.toEncoding('中文', 'gbk');
// => <Buffer d6 d0 ce c4>
```
### isUtf8(bytes)
### readBuffer(buffer)
### read(path, convert)
### write(path, data, charset, append)

### find(rPath, include, exclude)
    
```javascript
fis.util.find('/home/fis', /.*\.js/); // all javascript file
// => [...]
```
### del(rPath, include, exclude)
### copy(rSource, target, include, exclude)
### ext(str)
### query(str)
### pathinfo(path)

## fis.config

`fis.config`提供了一个比较灵活的设置配置的方式。在`fis-conf.js`里面进行配置都可以在插件中拿到。

```javascript
fis.config.set('a.b.c', {e:'0'});
fis.config.get('a');
// => {b:{c:{e:'0'}}}
fis.config.get('a.b');
// => {c:{e:'0'}}
fis.config.get('a.b.c');
// => {e:'0'}
```

### fis.config.merge(obj)

```javascript
fis.config.merge({
    namespace: 'demo'
});
```

### fis.config.set(key, def)
    
```javascript
fis.config.set('namespace', 'demo');
```

### fis.config.get(key)
    
```javascript
fis.config.get(); //获取全部的配置信息
fis.config.get('namespace') //获取namespace
```

## fis.project

### getProjectPath()

获得项目路径

### setProjectRoot(rPath) 
- `rPath` String 目录路径

设置项目路径，如果设置的是一个不存在的目录路径，FIS 会自动创建它；

## fis.file

`fis.file`是一个比较主要的类型，每一个文件进入fis处理都会指向一个fis.file对象。可以获取文件的各种信息。比如修改事件、后缀、是否是文本、图片亦或是产出路径等等。

整个 FIS 编译阶段都是以 File 对象为基础进行编译的，所以的文件进入 FIS 编译都会被实例化成一个 File 对象；

### wrap(file)
- `file` String 文件路径

实例化一个file对象

```javascript
var file = fis.file.wrap('/home/fis/debug/static/demo.js');
```

### File 对象

#### isHtmlLike

是否是类HTML文件，比如tpl

#### isJsLike    

是否是类JS文件，比如coffeescript

#### isCssLike   

是否是类CSS文件，比如less、sass

#### requires    

文件依赖的id列表

#### extras      

文件额外属性

#### useMap      

是否记录到map.json

#### isMod       
是否需要组件化

#### exists()

```javascript
file.exists();
// => true or false
```
#### isText()

是否为一文本文件

```javascript
file.isText();
// => true or false
```
#### isImage()

是否为一个图像文件
    
```javascript
file.isImage();
// => true or false
```
#### toString() 
file的真实路径

```javascript
file.toString();
// => /home/fis/debug/static/demo.js
```
#### getMtime() 
获取文件最后修改时间
    
```javascript
var mtime = file.getMtime();
```

#### setContent(c) 
- `c` String / Buffer 文件内容

设置文件内容

```javascript
file.setContent('content');
```
#### getContent() 
获取文件内容

```javascript
var content = file.getContent();
```
#### getHash()  
获取文件内容hash

```javascript
var hash = file.getHash();
```
#### getBase64(prefix) 
获取文件的base64

```javascript
var base64 = file.getBase64();
```
#### getId() 
获取文件对应的ID

```javascript
var id = file.getId();
```

#### getUrl(withHash, withDomain)  
- `withHash` Boolean 文件 Url 是否包含 md5 戳
- `withDomain` Boolean 文件 Url 是否包含设置的 domain

获取文件的url

```javascript
var url = file.getUrl(true, true);
```

#### addRequire(id)  
- `id` String 文件 id，用 [getId()](#gitid) 获得

给文件添加依赖

```javascript
file.addRequire('a.js');
// demo.js 
//依赖与a.js
```
#### removeRequire(id)
- `id` String 文件 id，用 [getId()](#gitid) 获得

移除文件对某个其他文件的依赖

```javascript
file.removeRequire('a.js');
// 移除对a.js的依赖
```

## fis.compile

编译一个文件，注意文件的缓存控制；

> 注意，它是一个函数，而非对象

```js
var path = require('path');
var file = fis.file.wrap(path.join(fis.project.getProjectPath(), 'a.js'));
file.useCache = false; // @NOTICE
fis.compile(file);
console.log(file.getContent());
```

## fis.log
打印log，适合调试报错等

### debug(str)
- `str` String  要输出的调试信息

输出一些调试信息，当执行 `release` 时，后面带命令行参数 `--verbose` 输出这些调试信息；

```bash
fis release --verbose
```

```js
fis.log.debug('debugMessage');
// [DEBUG] 18:49:46.0958 debugMessage
```
### notice(str)
- `str` String 一些提示信息

输出一些提示信息，调用了此方法会直接输出提示，不同于 `fis.debug()`

```javascript
fis.log.notice('noticeMessage');
// [NOTICE] 18:49:46.0958 noticeMessage
```
### warning(str)
- `str` String 一些警告信息

输出一些警告信息，调用了就会输出，不同于 `fis.debug()`

```javascript
fis.log.warning('warningMessage');
// [WARNING] 18:49:46.0958 warningMessage
```
### error(err)
- `err` String / Error 错误信息

输出错误信息接口，当 `release` 添加命令行参数 `--verbose` 会打出所有的错误堆栈信息。

调用此接口并被触发后，编译会中断，因为 `Error` 是一个不可挽回的错误。

```bash
fis release --verbose
```

```javascript
fis.log.error('errorMessage');
// [ERROR] 18:49:46.0958 errorMessage
// 编译中断
```

