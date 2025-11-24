---
title: "HTML"
date: 2020-09-09
lastmod: 2020-09-09
draft: false
tags: ['HTML']
categories: ["🌐Web前端"]
author: "lei"
---

HTML

## 概述

1. \<!DOCTYPE HTML\>有这个标志代表HTML5，没有代表HTML4

```html
<!DOCTYPE HTML>
<!--根节点-->
<HTML>
    <!--头-->
	<head>
		<meta charset="utf-8" />
		<title></title>
	</head>
    <!--体-->
	<body>
		<!--主题内容-->
	</body>
</HTML>
```

2. id在同一个HTML文档中,id不能重复,唯一标识,id可以使我们更方便的获取这个元素

## div和span

1. div和span都可以称为"图层",使页面可以灵活布局
2. div默认独占一行
3. span不会独占一行

## 基本标签

1. 段落标签:\<p\>\</p\>
2. 标题:\<h1\>\<h1\>
3. 换行:\<br\>;这种的标签称为独目标签
4. 预留格式:\<pre\>\<pre\>;源代码什么样式,网页中就怎么显示
5. 删除字:\<del\>\<del\>
6. 插入字:\<ins\>\<ins\>
7. 粗体字:\<b\>\<b\>
8. 斜体字:\<i\>\<i\>
9. 右上角加字:10\<sup\>2\<sip\>;10的平方
10. 右下角加字:10\<sub\>m\<sub\>;10米
11. 字体标签:\<font\>\<font\>
12. 图片标签:\<img src="地址" title="鼠标悬停显示" alt="图片未加载时文字" /\> ;设置图片大小,只设置宽度,高度会自动适应
13. 超链接:\<a href="链接地址" target="以什么方式打开连接" \>文字\</a\> ; 有下划线,鼠标停留手形状,点击跳转

## 实体符号

网页中显示某些符号,可能会被浏览器解析,如a大于b大于c : b\<a\>c;所以有实体符号;所有实体符号以 **\&**开始 以**;**结尾

大于:**\&lt;**

小于:**\&gt;**

空格:**\&nbsp;**

## 表格

\<table border="1px" width="300px"\>边框为1px宽为300px的表格

\<tr align="center"\>\<tr\> 居中对齐的 行

\<td\>\<td\>每一个单元格

合并单元格

1. row合并:找到需要合并的单元格,找到需要合并的单元格,**删除下面**一个,另一个上面添加属性rowspan:\<td rowspan="2"\>\<td\>
2. col合并:找到需要合并的单元格,找到需要合并的单元格,随意删除一个,另一个上面添加属性colspan:\<td colspan="2"\>\<td\>
3. \<th\>标签:也是个单元格标签,其中的内容会自动加粗居中

thead tbody tfoot:非必须,为了后期js代码的编写,将一个表格切分为三部分,头,身体,脚

## 背景色和背景图

1. \<meta charset="utf-8"\>:告诉浏览器应该采用什么编码打开该文件
2. 背景色:bgcolor="red"
3. 背景图片:background="图片地址"
4. 背景色在背景图片下面

## 表单

1. 表单用于收集用户信息;比超链接高级的是表单发送请求时可以携带数据
2. form标签
3. 表单form,action属性,用于指定表单信息提交到的服务器地址(request)
4. \<input type="submit"\>,input输入域属性为submit具有提交表单的效果
5. 表单数据提交必须有name属性值,提交时:服务器地址?name1=key1&name2=key2
6. \<input type="file"\>,文件上传专用
7. \<input type="text" readonly\>:只读,可以选中;数据会提交到服务器
8. \<input type="text" disable\>:只读,不能选中;数据不会提交给服务器,即使有name属性
9. maxlength:设置文本框可输入的长度

