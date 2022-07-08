---
theme: default
class: text-center
title: Web Component 分享
---

# Web Component

&nbsp;

                              ———— 贺晋飞


---
layout: quote
---

# Web Component 简介


---

# 组件化架构

&nbsp;

现在主流的框架都可以实现组件化。

组件化可以增强代码可读性，提高代码复用率，提升开发效率，更好维护。

一个组件有：  
DOM 结构：由自己管理，无法被外部代码操作。  
CSS 样式：作用在这个组件上。  
API：事件，类方法等，用于与其他组件交互。

&nbsp;

开发复杂软件的原则：不要让软件复杂。  
**只有让复杂的事情简单化的架构才是好架构。**


---

# 支持情况

&nbsp;

1. Custom elements ： 自定义元素。
2. Shadow DOM ： 影子DOM。对外部是不可见的内部 DOM 。
3. HTML Templates ：模板，`<template>`、`<slot>`。
4. HTML Imports ：引入外部内容。

Web Components 不是一个规范，每个规范都是独立的。  
比如可以只用 Custom Elements 来扩展 HTML 语义；使用 Shadow DOM 来隔离 CSS 。

&nbsp;

到目前为止，Web Components 还有部分特性仍然在制定中。

[支持情况](https://caniuse.com/?search=Web%20components)


---

# 案例

&nbsp;

Electronic Arts：https://www.ea.com/zh-cn

css-doodle ：https://css-doodle.com/

腾讯的前端跨框架框架 omi ：https://github.com/Tencent/omi

Web Components 分享网站：https://www.webcomponents.org/


---
layout: quote
---

# Custom elements

自定义元素，已经被很广泛支持的 Web Components 重要组成部分。

---


# 创建自定义元素类

&nbsp;

Custom elements 类型：
1. 自主自定义元素：继承自 HTMLElement 抽象类，全新的元素。
2. 自定义内建元素：继承内建的 HTML 元素。

```js
class MyElement extends HTMLElement { /*...*/ }
class MyButton extends HTMLButtonElement { /*...*/ }
```


---

```js
class MyElement extends HTMLElement {
  constructor() {
    super(); // 元素在这里创建
  }
  connectedCallback() {
    // 生命周期，在元素被添加到文档之后，浏览器会调用这个方法
    // 如果一个元素被反复添加到文档 / 移除文档，那么这个方法会被多次调用
  }
  disconnectedCallback() {
    // 生命周期，在元素从文档移除的时候，浏览器会调用这个方法
    // 如果一个元素被反复添加到文档 / 移除文档，那么这个方法会被多次调用
  }
  static get observedAttributes() {
    return [/* 属性数组，这些属性的变化会被监视 */];
  }
  attributeChangedCallback(name, oldValue, newValue) {
    // 生命周期，当上面数组中的属性发生变化的时候，这个方法会被调用
  }
  adoptedCallback() {
    // 生命周期
    // 在元素被移动到新的文档的时候，这个方法会被调用
    // （document.adoptNode 会用到, 非常少见）
  }
  // 还可以添加更多的元素方法和属性
}
```


---

# 注册自定义元素

&nbsp;

`customElements.define(tag, class)`

名称必须包括一个短横线 `-` ，确保和内建 HTML 元素之间不会发生命名冲突。

```js
// 注册全新的元素
customElements.define("my-element", MyElement);
// 已有元素的扩展
customElements.define('my-button', MyElement, { extends: 'button' });
```


---

# 使用自定义元素

&nbsp;

```html
<!-- 全新的元素 -->
<my-element></my-element>
<!-- 已有元素的扩展，使用 is -->
<button is="hello-button">...</button>
<!-- 可以使用内建按钮相同的样式和标准特性 -->
<button is="hello-button" disabled>Disabled</button>
```

---

# 示例

&nbsp;

<time-formatted id="elem" datetime="2023/1/1"></time-formatted>

在 `constructor` 中渲染时，元素实例已经被创建，但还没有插入页面，  
浏览器还没有处理 / 创建元素属性，调用 `getAttribute` 将会得到 `null`。


---

# 渲染顺序

&nbsp;

HTML 解析器构建 DOM 时，会先处理父级元素再处理子元素。  
如果要传入信息，可以使用元素属性，是即时生效的。

在 `connectedCallback` 内访问 `.innerHTML` 什么也拿不到，  
可以使用延迟时间为零的 `setTimeout` 来推迟访问子元素。

---

# API

&nbsp;

customElements.get(name) ：返回指定自定义元素的类。  
customElements.whenDefined(name) ：返回一个 Promise，在自定义元素变为已定义状态时 resolve 。

浏览器在 `customElements.define` 之前见到了自定义元素，会当作未定义元素。  
CSS 选择器对未定义的元素加上样式 **`:not(:defined)`**。  
`customElement.define` 被调用时，这些标签就变成了 `:defined`

---
layout: quote
---

# Shadow DOM

为封装而生。让一个组件拥有自己的「影子」DOM 树。


---

# shadow DOM特点

&nbsp;

两类 DOM ：Light DOM、Shadow DOM。

Shadow DOM 元素对于 light DOM 中的 querySelector 等不可见。  
Shadow DOM 元素有自己的 id 空间。  

Shadow DOM 有自己的样式。  
外部样式规则在 shadow DOM 中不产生作用。

---

# 查看 shadow DOM

&nbsp;

复杂的浏览器控件，如 `<input type="range">` 有 shadow DOM

<input type="range" />

Chrome 开发者工具设置中开启 **显示用户代理 shadow DOM** 。  
看到的最终样子，所有的内容都在 `#shadow-root` 下。


---

# 创建 shadow DOM

&nbsp;

`elem.attachShadow({mode: ...})`

`mode` 封装等级：`'open'` 外部可以访问。`'closed'` 外部无法访问。

限制：  
1、 每个元素只能创建一个 shadow root  
2、 `elem` 必须是自定义元素，或以下元素的其中一个：  
`article`、`aside`、`blockquote`、`body`、`div`、`footer`、`h1..h6`、  
`header`、`main`、`nav`、`p`、`section`、`span`  
其他元素，如 `img` 不能容纳 shadow tree


---
layout: quote
---

# 模板元素

内建的 `<template>` 元素用来存储 HTML 模板。  
浏览器将忽略它的内容，仅检查语法的有效性。

---

# 独特的 `<template>` 标签

&nbsp;

1. 浏览器将检查其中的HTML语法，与在脚本中使用模板字符串不同。
2. 允许使用任何顶级 HTML 标签，即使没有适当包装元素的无意义的元素，如 `<tr>`。
3. 其内容是交互式的：插入其文档后，应用样式，运行脚本。如插入 `<video autoplay>` 会自动播放。

`.content` 属性可看作 `DocumentFragment`  
除了，将其插入某个位置时，会被插入的则是其子节点。


---

```html
<template id="tmpl">
  <style> p { font-weight: bold; } </style>
  <p id="message"></p>
</template>

<div id="elem">Click me</div>

<script>
  elem.onclick = function() {
    elem.attachShadow({mode: 'open'});
    elem.shadowRoot.append(tmpl.content.cloneNode(true));
    elem.shadowRoot.getElementById('message').innerHTML = "Hello from the shadows!";
  };
</script>
```


---
layout: quote
---

# 插槽

允许在 shadow DOM 中显示 light DOM 子元素。


---

# 插槽类型

&nbsp;

- 具名插槽：`<slot name="X">...</slot>` 定义插入点。  
接收 `slot="X"` 的 light 子元素。
- 默认插槽：第一个没有名字的 `<slot>`  
接收不是插槽的 light 子元素。

如果同一插槽中有很多元素，会被一个接一个地添加。


---

# 扁平化 DOM

&nbsp;

组合：在插槽内渲染插槽元素的过程，结果称为**扁平化 DOM**  
组合不会真实的去移动节点，从 JavaScript 的视角看 DOM 仍然是相同的。


---

# 插槽后备内容

&nbsp;

`<slot>` 元素的内容作为备用。  
如果插槽没有对应 light 型的子元素，就会显示。


---

# 插槽更新

&nbsp;

如果 添加/删除 了插槽元素，无需执行任何操作即可更新渲染。  
由于不复制 light 节点，而是仅在插槽中进行渲染，所以内部的变化是立即可见的。

如果想知道内容的更改，可使用：  
- `slotchange` 事件：插槽第一次填充时、插槽元素的 添加/删除/替换 时触发。  
`event.target` 是插槽。直接更改插槽内容不会触发。
- `MutationObserver` ：DOM 变动观察器。

---

# JavaScript 插槽 API

&nbsp;

- `node.assignedSlot` 返回 `node` 分配给的 `<slot>` 元素。
- `slot.assignedNodes({flatten: boolean = false})` ：分配给插槽的 DOM 节点。  
`flatten` 为 `true` 时，将更深入地查看扁平化 DOM ，  
如果嵌套了组件，则返回嵌套的插槽，如果未分配节点，则返回备用内容。
- `slot.assignedElements({flatten})` ：分配给插槽的 DOM 元素。  
与上面相同，但仅元素节点。



---
layout: quote
---

# 样式


---

# 添加样式

&nbsp;

shadow DOM 可以引入样式，如 `<style>`、`<link rel="stylesheet">`。

在后一种情况下，样式表是 HTTP 缓存的，不会为使用同一模板的多个组件重新下载样式表。


---

# 宿主相关选择器

&nbsp;

- `:host` 选择器：选择 shadow 宿主。
- `:host(selector)` 选择器：仅在 shadow 宿主与 `selector` 匹配时。  
如含有`centered`属性，`:host([centered])`
- `:host-context(selector)` 仅当 shadow 宿主或任何祖先节点与 `selector` 匹配时。  
如`:host-context(.dark-theme)`

文档样式和局部样式冲突时，文档样式优先，除非局部样式中属性设置了 `!important`。


---

# 插槽相关选择器

&nbsp;

- `::slotted(selector)` 选择占槽元素本身，不能用于任何插槽中更深层的内容。  
只能在 CSS 中使用，不能在 querySelector 中使用。
- `slot[name="slotname"]` 选择占槽元素。


---


# 自定义 CSS 属性

&nbsp;

自定义 CSS 属性存在于所有层次，可以穿透 shadow DOM 。  
可用作 **钩子** 来设计组件的样式。  
赋值：`--user-card-field-color: green;`  
使用：`color: var(--user-card-field-color, black);`


---

# 引入外部样式的三种方法

&nbsp;

https://www.zhangxinxu.com/wordpress/2021/02/web-components-import-css

---
layout: quote
---

# 事件处理


---

# 事件的重新定位

&nbsp;

浏览器会重新定位（retarget）事件。  
如果单击事件发生在源自 shadow DOM 的元素上，  
当它冒泡出 shadow DOM 后，其 event.target 将重置为 shadow 宿主元素。  
当事件在组件内部捕获时，`event.target` 是触发事件的元素。  
当事件在组件外部捕获时，`event.target` 是宿主元素。

如果事件发生在 slotted 元素上，由于插槽元素实际存在于 light DOM 上，  
事件不会重新定位。

如果 shadow 树是用 `{mode: 'open'}` 创建的，  
使用 `event.composedPath()` 由于发生在插槽组合之后，获取的路径是扁平化 DOM 的路径。  
如果 shadow 树是用 `{mode: 'closed'}` 创建的，路径就直接从 host 开始。


---

# 事件的冒泡

&nbsp;

事件有只读属性 `composed`，为 `true` 时，能冒泡通过 shadow DOM 边界。  
大多数内建事件能成功冒泡到 shadow DOM 边界，如指针事件、触摸事件等。

`composed: false` 的内建事件：  
`mouseenter`，`mouseleave`（也不冒泡），  
`load`，`unload`，`abort`，`error`，`select`，`slotchange`。

发送（dispatch）自定义事件时，  
可以设置 `bubbles` 和 `composed` 为 `true` 使其冒泡并从组件中冒泡出来。

```js
inner.dispatchEvent(new CustomEvent('test', {
  bubbles: true,
  composed: true,
  detail: "composed"
}));
```

