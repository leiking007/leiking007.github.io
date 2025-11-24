---
title: "CSS"
date: 2020-09-09
lastmod: 2020-09-09
draft: false
tags: ['CSS']
categories: ["🌐Web前端"]
author: "lei"
---

# CSS

## 简介

1. CSS（cascading style sheet）：层叠样式表
2. 修饰html页面，设置html页面中元素样式；就像是html的化妆品一样

## 使用CSS三种方式

1. 内联定义

   ```html
   <p style="margin:0 auto">
       内联定义CSS
   </p>
   ```

2. 样式块

   ```html
   <head>
       <style type="text/CSS">
           选择器 {
               样式名：样式值
           }
       </style>
   </head>
   ```

3. 外联样式

   ```html
   <link type="text/CSS" rel="stylesheet" href="CSS文件路径" />
   ```

4. 选择器

   1. id选择器：**#**id
   2. 类选择器：**.**类名
   3. 标签选择器：标签名

## 常用样式

1. display：布局样式
2. width：宽；height：高
3. border-style：边框风格；border-style：边框宽度；border-color：边框颜色；border 宽度 风格 颜色：统一设置
4. font-size：字体大小；color：字体颜色
5. background-color：背景颜色
6. text-decoration：文本修饰，下划线之类的
7. cursor：鼠标样式，加载小手之类的
8. list-style-type：列表样式

## 定位

`position`属性用来指定一个元素在网页上的位置，一共有5种定位方式，即`position`属性主要有五个值

- `static`：默认值，浏览器会按照源码的顺序，决定每个元素的位置，这称为"正常的页面流"（normal flow）。每个块级元素占据自己的区块（block），元素与元素之间不产生重叠，这个位置就是元素的默认位置
- `relative`：**相对定位**，相对于默认位置（即`static`时的位置）进行偏移，即定位基点是元素的默认位置；必须搭配`top`、`bottom`、`left`、`right`这四个属性一起使用，用来指定偏移的方向和距离
- `fixed`：**固定定位**，相对于视口（viewport，浏览器窗口）进行偏移，即定位基点是浏览器窗口；元素的位置不随页面滚动而变化，好像固定在网页上一样；可以搭配`top`、`bottom`、`left`、`right`这四个属性一起使用
- `absolute`：**绝对定位**，相对于上级元素（一般是父元素）进行偏移，即定位基点是父元素；也必须搭配`top`、`bottom`、`left`、`right`这四个属性一起使用
- `sticky`：**粘性定位**，很像 relative 和 fixed 的结合；必须搭配`top`、`bottom`、`left`、`right`这四个属性一起使用



### 绝对定位

1. position：absolute；绝对定位
2. 元素会脱离文档流，如果设置偏移量，会影响其他元素的位置定位
3. 在父元素没有设置相对定位或绝对定位的情况下，元素相对于根元素定位（即html元素）（是父元素没有）
4. 父元素设置了相对定位或绝对定位，元素会相对于离自己最近的设置了相对或绝对定位的父元素进行定位（或者说离自己最近的不是static的父元素进行定位，因为元素默认是static）。

### 相对定位

1. position：relative；相对定位
2. 相对于原来位置移动，元素设置此属性之后仍然处在文档流中，不影响其他元素的布局