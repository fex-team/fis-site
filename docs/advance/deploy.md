---
layout: post
title: 项目部署 - roadmap.path
category: advance
---

在FIS中通过配置`roadmap.path`来磨平源码路径和线上路径的差异；整个FIS设计中你不需要去关心产出线上路径是什么，而只需要关心源码路径。这句话怎么理解呢，假设你源码目录是这样的；
```bash
➜  tree
.
├── all.css
└── static
    └── a.css

1 directory, 2 files
```

其中`all.css`要import `a.css`；无需关心`a.css`最终会被产出到什么路径下，无需关心`a.css`是否会加`domain`、`md5`而导致无法访问到`a.css`。只需要关注源码路径；
_all.css_

```css
@import url('./static/a.css');
```

可能编译以后得到的结果是这样的

_all\_<md5>.css_

```css
@import url('http://static.baidu.com/static/release/a_123acda.css');
```

也有可能是其他形式。

那么这一切是如何做到的？

**roadmap.path**可以配置任意资源的产出路径。

就比如上面这个例子；只需要配置

_fis-conf.js_

```javascript
fis.config.set("roadmap.domain", "http://static.baidu.com"); //配置domain
fis.config.set("roadmap.path", [{
    reg: /^\/static\/a\.css$/,
    release: '/static/release/a.css' //配置产出路径
}]);
```

有这样一个配置文件`fis-conf.js`

就可以轻松修改资源的线上部署路径，也能搞定上面例子中看到的情况。

执行命令 `fis release -Dmd output`，可在`output`目录下看到产出结果。