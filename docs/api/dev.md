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

### stringQuote(str, quotes)

```javascript
fis.util.stringQuote('"fis"');
// => { origin: '"fis"', rest: 'fis', quote: '"' }
```

### getMimeType(ext)

```javascript
fis.util.getMimeType('png')
// => image/png
```
### realpath(path)

```javascript
//cwd: /home/fis
fis.util.realpath('..');
// => /home
```
### realpathSafe(path)
    
@see realpath，当目录或文件不存在时，不返回false，直接返回传入路径

```javascript
//cwd: /home/fis
fis.util.realpathSafe('../a.js');
///home/a.js不存在
// => ../a.js
```
### isAbsolute(path)

```javascript
fis.util.isAbsolute('/usr/');
// => true
fis.util.isAbsolute('/usr');
// => false
fis.util.isAbsolute('usr/');
// => false
```
### isFile(path)
### isDir(path)
### mtime(path)
### touch(path, mtime)
### isWin()
### isTextFile()
### isImageFile()

### md5(data, len)

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
设置项目路径

## fis.file
`fis.file`是一个比较主要的类型，每一个文件进入fis处理都会指向一个fis.file对象。可以获取文件的各种信息。比如修改事件、后缀、是否是文本、图片亦或是产出路径等等。

### wrap()
实例化一个file对象

```javascript
var file = fis.file.wrap('/home/fis/debug/static/demo.js');
```
### Object file
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
获取文件的url

```javascript
var url = file.getUrl(true, true);
```

#### addRequire(id)  
给文件添加依赖

```javascript
file.addRequire('a.js');
// demo.js 
//依赖与a.js
```
#### removeRequire(id)
    
```javascript
file.removeRequire('a.js');
// 移除对a.js的依赖
```

## fis.compile

## fis.log
打印log，适合调试报错等

### debug

```javascript
fis.log.debug('debugMessage');
// [DEBUG] 18:49:46.0958 debugMessage
```
### notice

```javascript
fis.log.notice('noticeMessage');
// [NOTICE] 18:49:46.0958 noticeMessage
```
### warning

```javascript
fis.log.warning('warningMessage');
// [WARNING] 18:49:46.0958 warningMessage
```
### error

```javascript
fis.log.error('errorMessage');
// [ERROR] 18:49:46.0958 errorMessage
// 编译中断
```

