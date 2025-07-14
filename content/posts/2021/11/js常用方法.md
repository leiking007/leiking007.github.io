---
title: "js常用方法"
date: 2021-11-01
lastmod: 2021-11-11 12:12:12
draft: false
tags: ['js']
categories: ["前端"]
author: "lei"
---

# js常用方法

## 日期

### 获取时间

```js
let d1=new Date()            //获取当前时间的Date对象

let d2=new Date("2020-12-10 17:25:55")        //获取指定是时间的Date对象
```

### 获取时间戳

```js
let t1=Date.now()            //获取当前时间戳

let t2=new Date().getTime()        //通过日期对象获取时间戳
```

### 获取moment对象

```js
let now = moment()        //获取当前时间moment对象，不传参或传入参数undefined时
let now=moment(new Date())
```

### moment对象操作

```js
let now = moment()
let old = moment("2019-12-31 14:12:14")

// diff 获取两个moment对象所代表日期之间的差
// moment().diff(moment对象，年/月/天，true/false) 第三个参数为是否保留小数
now.diff(old, 'days',true)        
```

## 运算

### 原因

js因为底层数据存储原因，计算浮点数时会发生精度丢失

例如

```js
3+0.47      // 结果为：3.4699999999999998 
0.1+0.2     // 0.30000000000000004
0.3===(0.1+0.2)    // false
```

### 解决办法

**解决办法一**

引入第三方库，例如：Decimal.js 、bigbunber.js、big.js、math.js 等

**解决办法二**

利用toPrecision()，格式化到指定小数位（四舍五入），返回的是字符串

一般精度选12就能解决掉大部分0001和0009问题

```js
parseFloat((0.37+0.123).toPrecision(12))
```

