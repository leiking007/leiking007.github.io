---
title: "JS中的数组"
date: 2021-11-01
lastmod: 2021-11-11
draft: false
tags: ['js']
categories: ["🌐Web前端"]
author: "lei"
---

# js中的数组

## 基本操作

```js
let arr=[1,2,3,4,5,6,7,8,9,0]        //定义数组

arr.push(123)   //追加元素到数组末尾 +1

arr.pop()        //取出数组末尾元素，数组长度 -1
arr.shift()        //取出数组首部元素，数组长度 -1

arr.indexOf(5)    //返回数组中首次出现该元素的索引，未匹配返回 -1
arr.includes(3)    //判断数组中是否包含某个元素，返回 true/false

//splice(a,b,...)  a为位置，b为删除几个元素，...为添加的元素；返回值为删除元素构成的数组
arr.splice(1,0,12,13)  //在arr数组第二位元素，删除0个元素，并插入12,13

// join 拼接数组中所有元素，返回字符串
arr.join(".")
```

## 常用方法

```js
let list = [
            { name: "zs3", data: "20200110", age: 10 },
            { name: "zs6", data: "20200113", age: 13 },
            { name: "zs2", data: "20200109", age: 9 },
            { name: "zs8", data: "20200115", age: 15 },
            { name: "zs4", data: "20200111", age: 11 },
            { name: "zs1", data: "20200108", age: 8 },
            { name: "zs7", data: "20200114", age: 14 },
            { name: "zs5", data: "20200112", age: 12 }
        ]
```

### sort()

数组排序，sort(compareFunction)；compareFunction排序顺序的函数,该函数应返回负值、零值或正值，具体取决于参数

**sort()函数会更改原数**

```js
// compareFunction 排序顺序的函数,该函数应返回负值、零值或正值
array.sort(sortfunction)    //语法

list.sort((a, b) => {
    return a.data-b.data   //从小到大
})
```

### filter()

filter() 方法创建一个新的数组，新数组中的元素是通过检查指定数组中符合条件的所有元素

**filter()不会更改原数组**

```js
/* 
   array.filter(function(currentValue,index,arr), thisValue)
   index		可选 当前元素的索引值
   arr			可选 当前元素属于的数组对象
   thisValue	可选  传入时，回调函数内this的指向，省略了thisValue，或者无效值，那么回调函数的 this 为全局对象
*/
array.filter(function(currentValue,index,arr), thisValue)  //语法

// filter 过滤满足条件数组元素，返回age<15的元素
list.filter(e=>{
    return e.age<15
})
```

### map()

map() 方法返回一个新数组，数组中的元素为原始数组元素调用函数处理后的值

**map()不会更改原数组**

```js
array.map(function(currentValue,index,arr), thisValue)   //语法

//新数组中每项元素都是原数组每项元素的2倍
listInt.map(e=>{
   return e*2
})
```

### forEach()

forEach() 方法用于调用数组的每个元素，并将元素传递给回调函数

```js
array.forEach(function(currentValue, index, arr), thisValue)     //语法

// forEach 遍历数组，无返回值
list.forEach(e=>{
    console.log(e)
})
```

### find()

查找数组中符合条件的元素



```js
array.find(function(currentValue, index, arr),thisValue)    //语法，返回首次匹配到的元素

// find 第一个满足条件的元素，没有返回undefind
list.find(e=>{
    return e.age===12
})


array.findIndex(function(currentValue, index, arr), thisValue)   //语法，返回首次匹配到元素的索引
//返回第一个满足条件元素索引，没有返回 -1
list.findIndex(e=>{
    return e.age===12
})
```

### reduce()

reduce() 方法接收一个函数作为累加器，数组中的每个值（从左到右）开始缩减，最终计算为一个值，聚合函数

```js
/*
  聚合 reduce的使用，所有的 invoiceAmount 的值求和
  total	必需。初始值, 或者计算结束后的返回值
  currentValue	必需。当前元素
  currentIndex	可选。当前元素的索引
  arr	可选。当前元素所属的数组对象
*/
array.reduce(function(total, currentValue, currentIndex, arr), initialValue)    //语法

//list数组中，所有对象age之和，从0开始累加
list.reduce((res,item)=>{return res+item.age},0)
```

### 对象数组分组

```js
//对象数组，根据某个属性进行分组
function groupBy(arrValue,field){
    //所有属性的数组
    let fieldArr=arrValue.map(e => { return e[field] })
    //去重
    fieldArr=Array.from(new Set(fieldArr))
    //去除无效属性值
    fieldArr=fieldArr.filter(e => { if (e) { return e } })
    let resultObj={}
    //根据属性分组聚合
    for(let i=0;i<fieldArr.length;i++){
        let fieldItem=fieldArr[i]
        //通过属性过滤，并写入对象，对象的键为属性，值为 该属性相等的元素 的数组
        resultObj[fieldItem]=arrValue.filter(e=>{
            if(e[field]===fieldItem){
                return e
            }
        })
    }
    return resultObj
}
```

