---
title: "Java中正则的使用"
date: 2021-11-24
lastmod: 2021-11-24
draft: false
tags: ['JavaSE']
categories: ["笔记"]
author: "lei"
---

# Java中正则的使用

## 正则简介

非常常见的问题：

- 如何判断字符串是否是有效的电话号码？例如：`010-1234567`，`123ABC456`，`13510001000`等
- 如何判断字符串是否是有效的电子邮件地址？例如：`test@example.com`，`test#example`等
- 如何判断字符串是否是有效的时间？例如：`12:34`，`09:60`，`99:99`等

如何通过程序判断，这种方法需要为每种用例创建规则，然后用代码实现，太过复杂；因此出现了正则表达式

正则表达式就是一个描述规则的字符串，所以，只需要编写正确的规则，我们就可以让正则表达式引擎去判断目标字符串是否符合规则；

`正则适用于任何语言`

正则表达式是用字符串描述的一个匹配规则，使用正则表达式可以快速判断给定的字符串是否符合匹配规则。Java标准库`Java.util.regex`内建了正则表达式引擎

## 匹配规则

**基本的规则**

- `.`：匹配任意字符
- `\d`：匹配数字；`\D`表示匹配非数字
- `\w`：匹配一个字母、数字或下划线，w的意思是word；`\W`表示匹配非字母
- `\s`：匹配空格、tab键；`S`表示匹配非空格
- `[ABC]`：匹配方括号中任意字符
- `[axA-F1-9]`：匹配 a、x、A-F、1-9中的任意字符
- AB|CD|EF：匹配 AB或CD或EF
- `[\u4e00-\u9fa5]`：匹配中文
- `[^A-F]`：匹配不包含 A-F 的字符，^ 放在 [] 中表示不匹配
- `^`：匹配开头，放在 [] 中表示不匹配
- `$`：匹配结尾
- `^[0-9]\*$`：^ 表示以什么开头，$ 表示以什么结尾，这里正则代表匹配数字

**匹配次数**

- `{n}`：匹配 n 次

- `{n,m}`：匹配 n-m 次
- `{n,}`：匹配最少n次，最大无上限
- `*`：匹配任意次
- `+`：匹配至少一次以上

注意：Java中字符的转义和正则表达式中的转义

```java
//简单的正则匹配，注意转义字符的使用
boolean b1 = "abc".matches("abc");		//true
boolean b2="19882445846".matches("1\\d{10}");		//true
boolean b3="lei@sdadsa.com".matches("\\w{1,4}@\\w{5,6}\\.\\w{2,3}");		//true
boolean b4="A19a".matches("[A19]{4}");		//false，因为[]中没有字符 a
boolean b5="045875641".matches("[1-9]*");	//false
boolean b6="145875641".matches("[1-9]*");	//true
```

## 分组匹配

使用`(...)`进行分组匹配

`姓名：电话`这个规则，匹配字符串后，分别取出姓名和电话，方便后续操作

**分组匹配单次**

```java
/*
* 注意：
*   m.matches() 判断的是匹配的整个字符串，匹配成功返回 true，失败返回 false
* */
Pattern p = Pattern.compile("([\\u4e00-\\u9fa5]{2,3})-(1\\d{10})");
Matcher m = p.matcher("张三-15196116945");
int start=0;
if (m.matches()){
    m.group(0);		//张三-15196116945
    m.group(1);		//张三
    m.group(2)		//15196116945
}
```

**分组匹配多次**

```java
/*
* 注意:
*	m.matches() 在这里会返回 false，因为 正则规则此时不能完全匹配字符串
*   m.find(i) 带参数时，表示从字符串索引 i 后开始寻找匹配，不带参数表示从头开始
*   m.end() 返回当前匹配字符串最后位置索引
*   m.group() 表示当前已经匹配上的字符串，参数0 表示当前匹配的字符串全部，参数1 表示当前匹配的分组规则1的字符换 ......
* */
Pattern p = Pattern.compile("([\\u4e00-\\u9fa5]{2,3})-(1\\d{10})");
Matcher m = p.matcher("张三-15196111945李四-19882415846");
int start=0;
while (m.find(start)){
    System.out.println(m.group(0)+m.group(1)+":"+m.group(2));
    m.group(1);
    m.group(2);
    start=m.end();
}
```

**例子**：获取`2021-09-11 23:01:59`的年月日和时分秒

```java
Pattern pattern = Pattern.compile("(\\d{4})-(\\d{2})-(\\d{2})\\s(\\d{2}):(\\d{2}):(\\d{2})");
Matcher matcher = pattern.matcher("2021-09-11 23:01:59");
if (matcher.matches()) {
    System.out.println(matcher.group(1)+"年"+matcher.group(2)+"月"+matcher.group(3)+"日");
    System.out.println(matcher.group(4)+"时"+matcher.group(5)+"分"+matcher.group(6)+"秒");
}
```



## 非贪婪匹配

正则匹配默认为贪婪匹配，既尽可能多的进行匹配

给定一个字符串表示的数字，现判断结尾0的个数

- `157000`：三个0
- `9560`：一个零
- `595`：0个0

思路：使用分组匹配，正则表达式为：`(\d+)(0*)`，代码如下

```java
Pattern pattern = Pattern.compile("(\\d+)(0*)");
Matcher matcher = pattern.matcher("157000");
if (matcher.matches()) {
    matcher.group(1); 	// "157000"
    matcher.group(2); 	// ""
}
```

可以看到：`(\d+)`将整个数字字符串都进行匹配了，因为默认为贪婪匹配，会`尽可能多的匹配满足条件的字符`

使用`?`修改为非贪婪匹配，`(\d+?)` 此时只要匹配上就不继续进行匹配了，代码如下

```java
Pattern pattern = Pattern.compile("(\\d+?)(0*)");
Matcher matcher = pattern.matcher("1230000");
if (matcher.matches()) {
    System.out.println("group1=" + matcher.group(1)); // "123"
    System.out.println("group2=" + matcher.group(2)); // "0000"
}
```

**注意**：matcher.matches() 方法，会尽可能地去完成匹配，结合下面 matcher.find() 例子理解

```java
// matcher.find() 带参数时，从字符串首位开始进行匹配
// 这里(\d+?)表示非贪婪匹配，只要匹配到则返回；(0*)匹配 0个或多个0
// 因此这里会匹配到三次，循环输出三次，前两次group(1)都只是匹配到了一个数字结束，最后一次匹配到3000
Pattern pattern = Pattern.compile("(\\d+?)(0*)");
Matcher matcher = pattern.matcher("1230000");
int start=0;
while (matcher.find(start)){
    System.out.println(matcher.group(1)+":"+matcher.group(2));
    start=matcher.end();
}
//输出结果如下：
//	 	1:
// 		2:
// 		3:0000
```

## 搜索和替换

**分割字符串**

使用正则表达式分割字符串可以实现更加灵活的功能。`String.split()`方法传入的正是正则表达式。我们来看下面的代码：

```java
"a b c".split("\\s"); // { "a", "b", "c" }
"a b  c".split("\\s"); // { "a", "b", "", "c" }
"a, b ;; c".split("[\\,\\;\\s]+"); // { "a", "b", "c" }
```

如果我们想让用户输入一组标签，然后把标签提取出来，因为用户的输入往往是不规范的，这时，使用合适的正则表达式，就可以消除多个空格、混合`,`和`;`这些不规范的输入，直接提取出规范的字符串。

**搜索字符串**

使用正则表达式还可以搜索字符串，我们来看例子：

```java
String s = "the quick brown fox jumps over the lazy dog.";
Pattern p = Pattern.compile("\\wo\\w");
Matcher m = p.matcher(s);
while (m.find()) {
    String sub = s.substring(m.start(), m.end());
    System.out.println(sub);
}
```

我们获取到`Matcher`对象后，不需要调用`matches()`方法（因为匹配整个串肯定返回false），而是反复调用`find()`方法，在整个串中搜索能匹配上`\\wo\\w`规则的子串，并打印出来。这种方式比`String.indexOf()`要灵活得多，因为我们搜索的规则是3个字符：中间必须是`o`，前后两个必须是字符`[A-Za-z0-9_]`。

**替换字符串**

使用正则表达式替换字符串可以直接调用`String.replaceAll()`，它的第一个参数是正则表达式，第二个参数是待替换的字符串

```java
String s = "The     quick\t\t brown   fox  jumps   over the  lazy dog.";
String r = s.replaceAll("\\s+", " ");
System.out.println(r); // "The quick brown fox jumps over the lazy dog."
```

**反向引用**

如果我们要把搜索到的指定字符串按规则替换，比如前后各加一个`<b>xxxx</b>`，这个时候，使用`replaceAll()`的时候，我们传入的第二个参数可以使用`$1`、`$2`来反向引用匹配到的子串。例如：

```java
String s = "the quick brown fox jumps over the lazy dog.";
String r = s.replaceAll("\\s([a-z]{4})\\s", " <b>$1</b> ");
System.out.println(r);		//the quick brown fox jumps <b>over</b> the <b>lazy</b> dog.
```

它实际上把任何4字符单词的前后用`<b>xxxx</b>`括起来。实现替换的关键就在于`" <b>$1</b> "`，它用匹配的分组子串`([a-z]{4})`替换了`$1`

**例子**：将`2021-09-11 23:01:59`替换显示为`2021年09月11日 23时01分59秒`

```java
String time="2021-09-11 23:01:59";
String formatTime=time.replaceAll("(\\d{4})-(\\d{2})-(\\d{2})\\s(\\d{2}):(\\d{2}):(\\d{2})","$1年$2月$3日 $4时$5分$6秒");
System.out.println(s);	//2021年09月11日 23时01分59秒
```

