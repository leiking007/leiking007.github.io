---
title: "JavaScript"
date: 2020-09-09
lastmod: 2020-09-09
draft: false
tags: ['js']
categories: ["🌐Web前端"]
author: "lei"
---

# JavaScript

## 简介

1. JavaScript是运行在浏览器上的脚本语言；简称js

2. js不需要程序员手动编译，源代码浏览器直接打开运行；js“目标程序”以普通文本形式保存，这种语言叫做“脚本语言”

3. js是一门事件驱动型编程语言，依靠事件驱动，然后执行对应的程序；任何事件都会对应一个事件句柄：on+事件【事件句柄和事件的区别，事件句柄是在事件单词前添加一个on】，事件句柄是以HTML标签的属性存在的

4. onclick=“js代码”执行原理：页面打开时，并不会执行，而是将js程序注册到元素的click事件上，等待事件触发，浏览器才会调用js程序

5. js中可以使用单引号，也可以使用双引号

6. js一条语句结束，可以使用分号，也可以不用

7. html中嵌入JavaScript代码

   1. ```html
      <input type="text" onclick="window.alert('hell')"/>/*onclick是事件句柄，click才是事件*/
      ```

   2. ```html
      <script type="text/script">
      	window.alert("hellow")//alert会阻塞当前页面加载作用，直到用户点击确定按钮
      	/*暴露在脚本块当中的js代码，会在页面打开时执行，
      	并遵循自上而下逐行执行（这个代码块不需要事件）*/
      </script>
      <!--脚本块方式,脚本快可以放在随意位置，可以写多个脚本块-->
      ```

   3. ```html
      <!--引入外部独立的js文件-->
      <script type="text/script" src="js文件"></script>
      <!--引入的js文件会自上而下的顺序依次执行-->
      ```

8. window：浏览器对象

9. document：文档对象

## 变量

### 简介

1. 声明：var 变量名;
2. 赋值：变量名=值;
3. 变量没有手动赋值时，系统默认赋值undefined，undefined是一个值
4. js是弱类型语言，没有编译阶段，一个变量可以随意赋值，什么类型都可以

### 局部变量

1. 函数体类声明

2. 生命周期：函数开始执行时开辟空间，函数执行结束后，局部变量释放空间

3. 函数体中就近原则访问变量

4. 如果变量声明时没有var关键字，那么无论在哪里声明都是全局变量

   ```js
   function myfun(){
   	myname="lei"
   	alert(myname)
   }
   alert(myname) //可以访问到函数体中声明变量，因为没有var关键字声明
   ```

### 全局变量

1. 函数体之外声明的变量
2. 生命周期：浏览器打开时声明，浏览器关闭时销毁
3. 尽量使用局部变量，性能问题

### 函数

1. 函数可以重复利用的代码片段
2. 定义：
   function 函数名 （形参列表）{ 方法体 }
   函数名=function（形参列表）{ 函数体 }
3. NaN是一个值，该值表是不是数字（not a number）
4. 往函数传值，少了会给形参列表前面赋值，后面赋值undefined；多了，会将传入参数多出的省略
5. js中如果两个函数同名，后面声明的函数会覆盖前面的同名函数（js中只靠函数名分辨函数）

## 数据类型

### 简介

1. 虽然js变量声明不需要指定数据类型，但是在赋值时每一个数据还是有类型的

2. js中数据类型有

   1. 原始类型：Undefined、Number、String、Boolean、Null
   2. 引用类型：Object

3. Undefined：Undefined类型只有一个值，这个值就是undefined；变量没有赋值时，系统默认赋值undefined值

4. ES6较以上多了一个数据类型，Symbol类型，有7中

5. js运算符 typeof，这个运算符可以在程序运行阶段动态的获取变量数据类型；typeof 变量名，运算结果有：undefined、number、string、boolean、object、function六个结果字符串之一；js中使用==双等号，判断字符串是否相等

   ```js
   var a=null;
   var b=typeof a;//b的值时object
   ```

### number类型

1. number类型包括：整数、小数、正数、负数、不是数字(NaN) 、无穷大(Infinty)
2. NaN:运算结果本来应该是数字，最后算完不是数字时；如：8/"中"、10+"a"(字符串拼接)
3. 当除数为0时，结果为无穷大(Infinty)
4. isNaN(数据)：结果为true表示不是数字，结果是false表示是一个数字
5. parseInt("数字")：可以将字符串转换为数字，并且取整数位
6. parseFloat("数字")：可以将字符串转换为数字
7. Math.ceil(数字)：向上取整，Math是数学类

### boolean类型

1. js中布尔类型永远只有两个值：true、false
2. js中有个函数叫做布尔函数：Boolean()将非布尔类型转换为布尔类型，如if("jack")，if后括号会自动调用布尔函数转换为布尔类型；布尔函数转换规律：有转换为true、没有转换为false

Null类型只有一个值：null；typeof null 判断类型返回object

### string类型

1. 在js中字符串可以使用单引号或者双引号
2. 创建字符串对象：
   1. var s="abc"；称为小string；typeof s属于string类型
   2. var s=new String("abc")；称为大string；String是一个内置类，可以直接使用，继承Object；typeof s属于object类型
   3. 以上两种属性方法通用
3. 属性
   1. length：获取字符串长度
4. 方法
   1. indexOf()：获取指定字符串在当前字符串第一次出现索引
   2. lastIndexOf()：获取指定字符串在当前字符串最后出现索引
   3. replace()：替换；只替换第一个
   4. substr(startIndex,length)：截取子字符串
   5. substring(startIndex,endIndex)：截取子字符串，不包含endindex
   6. toLowerCase()：转小写
   7. toUpperCase()：转大写
   8. split()：拆分字符串

### object类型

1. 所有类型的超类，自定义任何类型，默认都继承Object

2. 属性

   1. prototype属性：给类动态的扩展属性和函数
   2. constructor属性：

3. 函数

   1. toString()
   2. valueOf()
   3. toLocaleString()

4. js中类的定义、对象的创建

   1. 定义类：function 类名(形参){  }；类名=function(形参){  }
   2. 创建对象：new 构造方法名(实参)；//构造方法名和类名一致
   3. js中类的定义和构造函数是一起完成的

   ```js
   
   function myclass1(a,b,c){ //类的定义
   	this.no=a
   	this.name=b
   	this.place=c
   	this.fun1=function(){
   		return this.no+this.name+this.place
   	}
   }
   var mc=new myclass1(123,"tanglei","旺苍") //对象的创建
   console.log(mc.fun1())
   myclass1.prototype.fun2=function(){ //prototype动态给类添加属性
   	return "prototype添加的函数"
   }
   console.log(mc.fun2()) //prototype添加的函数
   ```

### null NAN undefined

1. type时类型不一致
   1. null：object
   2. NAN：number
   3. undefined：undefined
2. ==比较
   1. null==NAN：false
   2. null==undefined：true；null和undefined可以等同
   3. NAN==undefined：false
3. ==（等同于运算符，值判断值是否相等）；===（全等运算符，及判断值是否相等，又判断数据类型是否相等）

### 代码示例

```js
myfun1=function(a,b){
	console.log("1 "+(a+b))
}
function myfun2(a,b){
	console.log("2 "+a+b)
}
myfun1(1,6) //1 7 计算
myfun2(1,6,4) //2 16 拼接
myfun2(1) //2 1undefined 拼接
myfun1(1,"a") // 1 1a 拼接

function test1(){
	console.log(isNaN("a")) //true，不是数字
	console.log(parseInt("3.14")) //3
	console.log(parseFloat("3.14")) //3.14
	console.log(Math.ceil(3.4)) //4，向上取整
}
function test2(){
	console.log(Boolean(null)) //false
	console.log(Boolean(0)) //false
	console.log(Boolean(1)) //false
	console.log(Boolean(Infinity)) //false
}
function test3(){
	console.log(typeof null) //Object
	console.log(typeof 1) //Number
	console.log(typeof "abc") //string
	console.log(typeof Infinity) //Number
	console.log(typeof NaN) //Number
	console.log(typeof undefined)
}
function test4(){
	var s1=new String("abcababc") //大String
	var s2="abcababc" //小String
	console.log(typeof s1) //object类型
	console.log(typeof s2) //string类型
	console.log(s1.length) //字符串长度8
	console.log(s1.indexOf("bc")) //"bc"首次出现下标为1
	console.log(s1.lastIndexOf("bc")) //"bc"最后出现下标为6
	console.log(s1.replace("ab","de")) //"decababc" 替换首个"ab"为"de"
	console.log(s1.substr(2,4)) //caba，从索引2开始取四个字符
	console.log(s1.substring(2,4)) //ca,不包含索引为4的字符
    console.log(s1.toLowerCase()) //全部转换为小写
	console.log(s1.toUpperCase()) //全部转换为大写
}

```

## 常用事件

### 简介

1. blur失去焦点
2. focus获得焦点
3. change下拉列表选中项改变，或文本框内容改变
4. click鼠标单击
5. dblclick鼠标双击
6. keydown键盘按下
7. keyup键盘弹起
8. load页面加载完毕，整个html页面元素全部加载内存中触发
9. mousedown鼠标按下
10. mouseup鼠标弹起
11. mousemove鼠标移动
12. mouseover鼠标经过
13. mouseout鼠标离开
14. select文本被选定
15. reset表单重置
16. submit表单提交

任何一个事件都会对应一个事件句柄，事件前加on，事件句柄出现在元素属性位置

### 注册事件

1. 事件句柄方式，元素属性位置加个on

2. 纯js代码完成事件注册

   1. 获取元素对象
   2. 给按钮对象的属性添加回调函数

   ```javascript
   var a=document.getElementById("mybtn")
   a.onclick=myfun //将myfun函数注册到事件上，这里直接写函数名，不要小括号
   a.onclick=function(){
       //匿名函数，事件绑定
   }
   ```

### 回调函数

1. 回调函数自己书写，但是自己不调用，由其他程序负责调用该函数

2. ```html
   <script>
   	function myfun(){
           alert("1")
       }
   </script>
   <!--以下代码只是将myfun函数注册到按钮上，等待click事件发生，该函数被浏览器调用，称该函数是回调函数-->
   <input type="button" onclick="myfun()">
   ```

### js代码执行顺序

```js
window.onload=function(){
    //这个函数会在页面加载完成后执行
    //页面加载是注册函数，页面加载完毕后onload事件触发，回调函数执行
}
```

```js
<input type="text" id="btn" />
window.onload=function(){
    var a=document.getElementById("btn")
    a.type="checkbox" //修改属性type=checkbox
}
//获取的元素节点，有什么属性，都可以使用.进行修改
```

### 获取键值

1. 对于键盘事件对象来说，都有keyCode属性获取键值

```javascript
//回车键键值：13；esc键值27
document.getElementById("btn").onkeydown=
    function(event){//可以不接收
    if(event.keyCode==13){
    	console.log("输入enter了")
    }
}
```

## js运算符

+、-、*、/、++、--

### void运算符

void(表达式)：执行表达式，不返回任何结果

jsvascript: ：告诉浏览器后面跟的 是js代码

```html
<a href="JavaScript:void(0)" onclick="console.log('e')">点击超链接，执行js代码，但页面不跳转</a>
```

### 正则表达式

1. 什么是正则表达式：正则表达式主要用在字符串格式匹配当中，包括搜索方面

2. 正则表达式是独立的学科，在大多数语言中都支持

3. 常见的正则符号：

   1. .  匹配除换行符以外的任意字符
   2. \w   匹配字母或数字或下划线或汉字
   3. \s  匹配任意空白符
   4. \d  匹配数字
   5. \b  匹配单词的开始或结束
   6. ^  匹配字符串的开始
   7. $  匹配字符串的结束

   

   1. \*   重复零次或多次
   2. \+  重复一次或多次
   3. ？ 重复零次或一次  
   4. {n,}  重复n次或更多次
   5. {n,m}  重复n到m次
   6. | 表示或

   

   1. \W  匹配任意非字母、数字、下划线、汉字的字符
   2. \S  匹配任意非空白符的字符
   3. \D  匹配任意非数字的字符
   4. \B  匹配不是单词开始或结束的位置
   5. [^x]  匹配除x以外的任意字符
   6. [^aeiou]  匹配除aeiou这几个字母以外的任意字符

4. 简单正则表达(正则表达式中的小括号优先级较高)

   1. \[1-9\] 表示1到9的任意一个数字

   2. [A-Za-z0-9]  表示A-Z、a-z、0-9中的任意一个字符

   3. [A-Za-z0-9-]  表示A-Z、a-z、0-9、-中的任意一个字符

   4. QQ：\[1-9\]\[0-9\]{4,}$

   5. 邮箱：

      ```js
      ^\w+([-+.])*@\w+([-.]\w+)*.\w+([-.]\w+)*$
      ```

5. 创建正则

   ```js
   //第一种
   var regExp=/正则表达式/flags
   //第二种
   var regExp=new RegExp("正则表达式","flags")
   //flags可以传值：g 全局匹配、i 忽略大小写、m 前面是正则表达式时不能使用m，只能前面是普通字符串才能使用m
   ```

   ```js
   window.onload=function(){
   	document.getElementById("btn1").onclick=function(){
   		var email=document.getElementById("txt1").value
   		var eregExp=/^\w+([-+.])*@\w+([-.]\w+)*.\w+([-.]\w+)*$/
   		if(eregExp.test(email)){//正则匹配，成功返回true，失败返回false
   			document.getElementById("txt2").innerHTML="<font style='color: #7FFF00;'>邮箱合法</font>"
   		}else{
   			document.getElementById("txt2").innerHTML="<font style='color: red;'>邮箱不合法</font>"
   		}
   	}
   	document.getElementById("txt1").onfocus=function(){
   		document.getElementById("txt2").innerHTML=""
   	}
   }
   ```

   

6. 正则表达式对象的方法

   1. test(用户写好的字符串)：返回true字符串格式匹配成功；返回false字符串格式匹配失败

7. trim函数：

   ```js
   window.onload=function(){
       //低版本ie不支持trim函数解决方案，对String类进行扩展
   	String.prototype.qukong=function(){
           //去除前后空白，在当前方法中的this代表就是当前字符串
   		return this.replace(/^\s+|\s+$/g,"")
   	}
   	document.getElementById("btn1").onclick=function(){
   		console.log("--->"+document.getElementById("username").value.qukong()+"<---")
   		//去除username变量的前后空白
           //console.log("--->"+document.getElementById("username").value.trim()+"<---")
   	}
   }
   ```

## 代码实例

### 表单验证

#### html代码

```html
		<form id="userForm">
			<table>
				<tr>
					<td>用户名：</td>
					<td><input type="text" id="username" name="username" /></td>
					<td><span id="errusername"></span></td>
				</tr>
				<tr>
					<td>密码：</td>
					<td><input type="text" id="password" name="password" /></td>
					<td><span id="errpassword"></span></td>
				</tr>
				<tr>
					<td>确认密码：</td>
					<td><input type="text" id="repassword" /></td>
					<td><span id="errrepassword"></span></td>
				</tr>
				<tr>
					<td>邮箱：</td>
					<td><input type="text" id="email" name="email" /></td>
					<td><span id="erremail"></span></td>
				</tr>
				<tr>
					<td ><input id="btn1" type="button" value="提交验证" /></td>
					<td ><input type="reset" value="重置" /></td>
				</tr>
			</table>
		</form>
```

#### js代码

```js
/*
	1.用户名不能为空
	2.用户名必须在6-14位之间
	3.用户名只能由数字和字母组成，不能包含其他符号（正则表达）
	4.密码和确认密码一致，邮箱地址合法
	5.统一失去焦点验证
	6.错误提示信息同意在span标签中提示，并且要求字体12号，红色
	7.文本框再次获得焦点后，清空错误提示信息，如果文本框数据不合法，清空文本框的value
	8.最终表单所有项合法方可提交
*/
window.onload = function() {
	//用户名验证
	var userElem = document.getElementById("username")
	var userErr = document.getElementById("errusername")
	userElem.onblur = function() {
		//获取用户名
		username = userElem.value.trim()
		if (!username) {
			userErr.innerHTML = "用户名不能为空"
			return 
		}
		if (username.length < 6 || username.length > 14) {
			userErr.innerHTML = "长度在6--14之间"
			return 
		}
		var regExp = /^[A-Za-z0-9]+$/
		if (!regExp.test(username)) {
			userErr.innerHTML = "用户名只能为数字和字母组成"
			return 
		}
	}
	userElem.onfocus = function() {
		//清空不合法输入
		if (userErr.innerHTML != "") {
			userElem.value = ""
		}
		//清空错误信息
		userErr.innerHTML = ""
	}
	//密码验证
	var repwdElem = document.getElementById("repassword")
	var pwdElem = document.getElementById("password")
	var repwdErr = document.getElementById("errrepassword")
	repwdElem.onblur = function() {
		if (repwdElem.value != pwdElem.value) {
			repwdErr.innerHTML = "两次密码输入必须一致"
		}
	}
	repwdElem.onfocus = function() {
		//清空密码
		if (repwdErr.innerHTML) {
			repwdElem.value = ""
		}
		//清空提示信息
		if (repwdErr.value != "") {
			repwdErr.innerHTML = ""
		}
	}
	//邮箱验证
	var emailElem = document.getElementById("email")
	var emailErr = document.getElementById("erremail")
	emailElem.onblur = function() {
		var regExp = /^\w+([-+.])*@\w+([-.]\w+)*.\w+([-.]\w+)*$/
		if (!regExp.test(emailElem.value)) {
			emailErr.innerHTML = "邮箱地址不合法"
			return
		}
	}
	emailElem.onfocus = function() {
		//清空非法邮箱
		if (emailErr.innerHTML) {
			emailElem.value = ""
		}
		//清空提示信息
		if (emailErr.innerHTML != "") {
			emailErr.innerHTML = ""
		}

	}
	//提交表单
	var userForm = document.getElementById("userForm")
	var btn = document.getElementById("btn1")
	btn.onclick = function() {
		//触发事件，不需要手动触发
		userElem.focus() //获得焦点
		userElem.blur() //失去焦点
		
		repwdElem.focus()
		repwdElem.blur()
		
		emailElem.focus()
		emailElem.blur()
		//如果数据全部合法，则提交
		if (userErr.innerHTML=="" && repwdErr.innerHTML=="" && emailErr.innerHTML=="") {
			userForm.action = "localhost"
			userForm.method = "get"
			userForm.submit()
		}
	}
}
```

### 复选框全选

#### html代码

```html
		<input type="checkbox" id="che" /><br />
		<input type="checkbox" name="aihao" value="篮球" />篮球<br />
		<input type="checkbox" name="aihao" value="乒乓球" />乒乓球<br />
		<input type="checkbox" name="aihao" value="羽毛球" />羽毛球<br />
```

#### js代码

```js
window.onload = function() {
	var checkElem = document.getElementById("che")
	//通过name选择元素
	var checks = document.getElementsByName("aihao")
	checkElem.onclick = function() {
		for (var i = 0; i < checks.length; i++) {
			//设置选中属性
			checks[i].checked = checkElem.checked
		}
	}
	for (var i = 0; i < checks.length; i++) {
		//设置选中属性
		checks[i].onclick = function(){
			var count=0 //统计选中的总量,每次单击总量为0，然后统计选中的总量
			for (var i = 0; i < checks.length; i++){
				if(checks[i].checked==true){
					count++
				}
			}
			if(count==checks.length){//选中总数和数组长度相等
				//最开始按钮选中
				checkElem.checked=true
			}else{
				//最开始按钮取消选中
				checkElem.checked=false
			}
		}
	}
}
```

### 获取下拉列表value

#### html代码

```html
<select onchange="alert(this.value)">
	<option value="">请选择省份</option>
	<option value="001">河南省</option>
	<option value="002">福建省</option>
	<option value="003">四川省</option>
	<option value="004">广东省</option>
</select>
```

### 网页时钟

#### html代码

```html
<input type="button" id="btn1" value="显示时钟" onclick="startTime()" />
<input type="button" id="btn2" value="停止时钟" onclick="stopTime()" />
<div id="demo"></div>
```

#### js代码

```js
window.onload = function() {
	//获取当前时间
	nowTime = new Date()
	// document.write(nowTime)

	//根据本地环境显示时间
	/* nowTime=nowTime.toLocaleDateString()
	document.write("<br />")
	document.write(nowTime) */

	//自定义时间格式
	/* var year=nowTime.getFullYear() //返回四位数的年份
	var month=nowTime.getMonth() //获取月份0-11
	var day=nowTime.getDate() //获取天数
	document.write(year+"年"+(month+1)+"月"+day+"日") */
}
//向网页中写入时间
function shijian() {
	document.getElementById("demo").innerHTML = new Date()
}

function startTime() {
	time = setInterval("shijian()", 1000) //设置计时器，每秒执行函数，返回的变量可以用来清除时间
}

function stopTime() {
	clearInterval(time)//清除计时器
}

```

### 设置顶级窗口

### 弹出确认框

```js
window.onload=function(){
	var btn1=document.getElementById("btn1")
	var btn2=document.getElementById("btn2")
	btn1.onclick=function(){
		window.alert("msg")
	}
	btn2.onclick=function(){
		var a=window.confirm("真的吗")
		if(a){
			//确认后逻辑
			window.location.href="https://www.baidu.com"
		}else{
			//取消后逻辑
		}
	}
}
```

### 设置table的tbody（拼接）

#### html代码

```html
<body>
		<input type="button" id="disInfo" value="展示信息" />
		<hr />
		<table border="1px" width="50%">
			<thead>
				<tr>
					<th>学号</th>
					<th>姓名</th>
					<th>性别</th>
				</tr>
			</thead>
			<tbody id="tbody">
				<tr>
					<td>1</td>
					<td>2</td>
					<td>3</td>
				</tr>
			</tbody>
		</table>
		总共记录：<span id="total">0</span>条
	</body>
```

#### js代码

```js
var studInfo = {
	"total": 4,
	"info": [{
			"sno": 0001,
			"sname": "zahngsan",
			"sex": "男"
		},
		{
			"sno": 0002,
			"sname": "lisi",
			"sex": "女"
		},
		{
			"sno": 0003,
			"sname": "wangwu",
			"sex": "男"
		}
	]
}
window.onload = function() {
	var disinfoElem = document.getElementById("disInfo")
	disinfoElem.onclick = function() {
		var html="" //拼接字符串
		for (var i=0; i < studInfo.info.length; i++) {
			html += "<tr>"
			html += "<td>"+studInfo.info[i].sno+"</td>"
			html += "<td>"+studInfo.info[i].sname+"</td>"
			html += "<td>"+studInfo.info[i].sex+"</td>"
			html += "</tr>"
		}
		document.getElementById("tbody").innerHTML=html
		document.getElementById("total").innerHTML=studInfo.total
	}
}
```

## js包括三块

### ECMAScript

1. JS核心语法（ES规范）

### DOM

1. 文档对象模型，DOM树

2. 对网页中节点进行增删改查的过程

3. 设置和获取文本框内容

4. innerHtml：向div和span中添加元素，会解析为html

5. innerText：向div和span中添加纯文字，不会被解析

6. innerHtml和innerText是元素的属性

   ```js
   window.onload=function(){
       var bt1=document.getElementById("btn") //获取内容按钮
       bt1.onclick=function(){
           var inp=document.getElementById("username")
           var username=inp.value
       }
       var bt2=document.getElementById("btn") //修改内容按钮
       bt2.onclick=function(){
           var inp=document.getElementById("username")
           inp.value="leiking"
       }
   }
   //blur失去焦点事件、this代表当前文本框对象
   <input type="text" onblur="alert(this.value)" />
   ```

   ```js
   window.onload=function(){
   	document.getElementById("btn1").onclick=function(){
   		document.getElementById("div").innerHTML="<h1>innerHtml添加内容</h1><p>i am a king</p>"
   	}
   	document.getElementById("btn2").onclick=function(){
   		document.getElementById("div").innerText="<h1>innerText添加内容</h1><p>i am a king</p>"
   	}
   }
   ```

   

### BOM

1. 浏览器对象模型

2. 打开浏览器窗口、地址栏地址等

3. BOM顶级对象是window、DOM顶级对象是document；实际上BOM包括DOM

4. window.open("url")：打开一个新的浏览器窗口或查找一个已命名的窗口

5. window.close("url")：关闭浏览器窗口

6. window.confirm("msg")：弹出确认框

7. window.alert("msg")：弹出提示框

8. window.location：地址栏对象

9. 向服务器发送数据方法

   1. 超链接
   2. form表单
   3. window.open()
   4. window.location
   5. 地址栏输入地址
   6. document.location.href='url'

   ```html
   <input type="button" value="百度" onclick="window.location.href='https://baidu.com'" />
   <input type="button" value="百度" onclick="window.open('https://baidu.com')" />
   <input type="button" value="百度" onclick="document.location.href='https://baidu.com'" />
   ```


## JSON

1. 什么是JSON：JavaScript Object Notation（数据交换）；JSON主要作用是：一种标准的数据交换格式
2. JSON是一种标准的轻量级的数据交换格式，优点：体积小，易解析
3. XML：也是一种数据交换格式；体积大，解析麻烦，不过结构严谨，适合银行等系统；HTML和SML有一个父亲：SGML(标准通用标记语言)
4. eval函数：将字符串当作一条js代码执行；jsva发送的是一个JSON格式的字符串，使用这个函数可以将字符串转化为JSON对象

```js
window.eval("var i=0")//这里会执行js代码var i=0
alert(i)
```

JSON

```js
//创建JSON对象(无类型对象，轻量级)
var studentObj={
    "sno":"110",
    "sname":"zahngsan"
}
//访问JSON对象中属性
console.log(studentobj.sno+studentobj.sname)
//JSON数组
var students=[
    {
        "sno":110,
    	"sname":"zahngsan"
    },{
        "sno":111,
    	"sname":"李四"
    }
]
//复杂一些的JSON
var studJson={
    "total":3,
    "students":[
        {"name":"zahnsgan","sno":001},
        {"name":"lisi","sno":002},
        {"name":"wangwu","sno":003}
    ]
}
```



## 其他

document.querySelector('#id');
	静态选择元素，相当于返回一个元素快照，可以像使用css选择器一样的选择元素
document.getElementById("id")
	返回的对象是动态的，某种情况下消费大
toLocaleTimeString()
	方法可根据本地时间把 Date 对象的时间部分转换为字符串，并返回结果
	
Js原型的理解
	//封装的函数，如果通过new操作符来调用的，就是构造函数，
	//如果没有通过new操作符来调用的，就是普通函数
	function person(name) {
		this.name=name;
		this.say=function (){
			console.log(this.name);
		}
	}
	var a=new person('lei');
	a.say();
	console.log(typeof a);	//对象
	console.log(typeof person);	//函数（person）
	console.log(typeof person.prototype);		//对象
	console.log(typeof person.prototype.constructor);	//函数（person）
	console.log(typeof a.prototype);	//未定义
	//每个对象都有peototype原型！！！
	person.prototype.stop=function (){
		console.log('我不能说话!!!');
	};
	a.stop();	//能执行stop函数
	应该有：person.prototype.constructor==person
	并且当函数对象本身的属性或方法与原型的属性或方法同名的时候：
		1、默认调用的是函数对象本身的属性或方法.
		2、通过原型增加的属性或方法的确是存在的.
		3、函数对象本身的属性或方法的优先级要高于原型的属性或方法.

## Ajax

### 全局刷新和全局刷新

1. 浏览器发送请求，得到后台返回数据，**只能**展示得到的数据
2. 浏览器得到后台返回的数据，能**同时**展示后台返回数据和原有数据

### 全局刷新和局部刷新原理

1. 全局刷新：**浏览器**发送请求，服务端响应协议包直接推送到浏览器内存；
   覆盖内存中原有数据，浏览器只能展示响应数据
2. 局部刷新：禁止浏览器发送请求；由浏览器内存中的**js脚本对象**代替浏览器发送请求协议包；
   服务端返回响应协议包覆盖的时js脚本对象内容；
   浏览器可以从js脚本对象拿到服务端的响应协议包，更新到浏览器指定标签上
   浏览器可以展示原有内容和服务端响应内容

### AJAX

1. 异步请求对象（Asynchronization JavaScript And XML）
2. ajax帮助开发人员管理浏览器中**异步请求对象**

### AJAX开发步骤

1. 在浏览器内存中，创建一个脚本对象（异步请求对象）
2. 为**异步请求对象**添加**工作状态监听器**，帮助开发人员确定何时得到从它身上响应数据
3. 初始化异步请求对象
   1. 通知异步请求对象**以什么方式**发送求情报协议包（post/get）
   2. 通知异步请求对象本次要访问的**资源文件地址**
   3. 通知异步请求对象，在它工作期间，浏览器是否会等它（同步请求/异步请求）
4. 通知异步请求对象发送请求

### 同步请求与异步请求区别

1. 同步请求：在当前异步请求对象工作期间，浏览器只能等待，不可再委派异步请求对象发送请求
2. 异步请求：在当前异步请求对象工作期间，浏览器还可委派其他异步请求对象

### AJAX命令

1. 创建异步请求对象
   var xmlHttp=new XMLHttpRequest();

2. 绑定工作状态监听器
   xmlHttp.onreadystatechange=function(){  //工作状态每改变一次，这里被调用一次，总工会被调用4次(5种状态)  }

3. 初始化（方法，地址，是否等待）

   xmlHttp.open("post/get","/myweb/oneServle?name=smith",true) 

4. 发送异步请求

   xmlHttp.send()

### 异步请求对象工作状态

| xmlHttp.readyStat |                             状态                             |         发生位置         |
| :---------------: | :----------------------------------------------------------: | :----------------------: |
|         0         |                   异步请求对象刚被创建完毕                   |   new XMLHttpRequest()   |
|         1         |                 异步请求对象已经被初始化完毕                 | xmlHttp.open("","",true) |
|         2         |               异步请求对象已经发送了请求协议包               |      xmlHttp.send()      |
|         3         | 异步请求对象已经得到了服务端响应包，此时它正在解析响应体中内容 |                          |
|         4         | 异步请求对象已经解析数据完毕，此时数据符合脚本规范，发开人员可以提取响应数据 |                          |

### 从异步请求对象得到响应数据

1. 每当事件处理函数被调用，需要判断异步请求对象当前工作状态是否为4

   ```js
   xmlTttp.onreadystatechange=function(){
       if(xmlHttp.readyStat==4&&xmlHttp.statux=200){
           //如果工作状态为4并且状态码为200，读取响应数据
           var data=xmlHTttp.responseText
           callBack(data)
       }
   }
   //局部刷新实现函数
   function callBack(param){
       $("div").text(param)
   }
   ```


## ES6

### 块级作用域

- ES5 存在全局作用域、函数作用域
- ES6 存在了块级作用域

### let

- 类似于var，但是所声明的变量仅在当前代码块生效（let变量循环时js引擎会记得上次循环的值，然后赋予本次循环）

```js
for (let i = 0; i < 3; i++) {
  let i = 'abc';
  console.log(i);// 输出三次abc
}

function f() {
	console.log("i am outside")
}
(function() {
	if (false) {
		function f() {   //这里申明的函数，根据ES6规定会被提升到函数作用域，类似于var
			console.log("i am inside")
		}
	}
	f()	//因此这里会输出f不是一个函数
}());
```

- let实际上为js新增了块级作用域；ES6中规定，函数声明可以在块级作用域中，类似var，会提升到函数作用域，外部不能引用，应当避免在块级作用域中声明函数

### 不存在变量提升

在var声明的变量之前引用，不会报错；而在let声明变量之前引用会报错

```js
	// var 的情况
	console.log(foo); // 输出undefined
	var foo = 2;

	// let 的情况
	console.log(bar); // 报错ReferenceError
	let bar = 2;
```

### 暂时性死区

- 指的是使用let或const声明变量时，会绑定在当前块级作用域中，在声明之前引用都会报错，无论是否存在同名全局变量；typeof不再是一个安全操作

```js
	if (true) {
	  // TDZ开始
	  tmp = 'abc'; // ReferenceError
	  console.log(tmp); // ReferenceError

	  let tmp; // TDZ结束
	  console.log(tmp); // undefined

	  tmp = 123;
	  console.log(tmp); // 123
	}

	//函数参数也存在暂时性死区
	function bar(x=y,y=2){
		return [x,y]
	}
	bar()  //报错y未定义
```

- let 不允许在相同作用域中重复声明一个变量

### 严格模式

```js
if(true) {
	console.log(1)	//不报错
}
if(true)  console.log(1)  //ES6语法报错,运行不报错
```

### const

const声明一个只读的常量。一旦声明，常量指向的那个内存地址不得改动（基本数据不能改，对象可以更改其中属性）

```js
function func(arg) {
  let arg; // 报错
}

function func(arg) {
  {
	let arg; // 不报错
  }
}
```

### 解构赋值

- 基本用法：`let [a,b,c]=[1,2,3]`，可以存在不完全解构

- 指定默认值：`let [foo = true] = []`

- 对象解构：对象解构和数组解构区别：对象解构时是无序的，根据变量名确定；数组解构有序

  ```js
  let { foo, bar } = { foo: "aaa", bar: "bbb" }  //foo='aaa',bar='bbb'
  let { foo: f, bar: b } = { foo: "aaa", bar: "bbb" } //f='aaa',b='bbb'
  
  let {x:x=1,y,z}={x:undefined,z:12}  //x=1,y=undefined,12
  
  let obj={
  	p: [
  		'hello',
  		{
  			y:'world'
  		}
  	]
  }
  let {p : [x,{y:y}]}=obj	//x=hello,y=world
  let {p,p:[a,{b}]}=obj	//a=hello,b=world,p=['hello',{y:'world'}]
  let {a,a:c}={a:123}   //c=123
  
  const a={
  	ioc:{
  		start:{
  			line:1,
  			colmun:5
  		}
  	}
  }
  let {ioc,ioc:{start,start:{line,colmun}}}=a  //line=1,colmun=5
  ```

- 字符串解构：`const [a, b, c, d, e] = 'hello'`

- undefined和null无法转化为对象：解构赋值的规则是，只要等号右边的值不是对象或数组，就先将其转为对象，因此无法解构

- rest参数

  ```js
  //...变量名 被称为rest参数，只能放在解构参数的末尾，相当于一个数组
  let [a,...b]=[1,2,3,4]
  //a=1
  //b=[2,3,4]
  ```

- 函数参数解构：

  ```js
  function add([x, y]){
  	return x + y;
  }
  add([1, 2]); // 3
  
  function funa([a]=[1]){
  	return a
  }
  funa()   //1    
  //注意：如果函数不指定默认值这时 a为undefined，而undefined 不支持解构,此时会报错
  funa([2])  //2
  ```

- map解构，任何部署了iterator接口的对象，都支持 for ... of ...

  ```js
  
  ```

- ES6规定，存在解构不能使用圆括号，避免歧义

- 默认值：ES6内部会使用严格等于判断，只有当元素严格等于`undefined`时，默认值才会生效

 ```js
let [a=1]=[]  //a=1let [a=1]=[undefined]  //a=1let [a=1]=[null]  //a=null
 ```

- 作用：交换变量值、从函数返回多个值、解析JSON，函数参数定义。遍历map

### 练习

```js
//练习1const obj={	id:123,	age:20,	name:'lei'}let obj1={	id:456,	...obj,	name:'tang'}console.log(obj1.id)   //20console.log(obj1.age)  //123console.log(obj1.name)  //tang//练习2let map=new Map()map.set([1],'ES6')		// 存取 使用的数组 [1] 两个数组内存地址不一样console.log(map.get([1]))	//undefined//练习3let map=new Map()let arr=new Array(1)arr[0]=1map.set(arr,'ES6')		// 存取 使用的数组 [1] 两个数组内存地址不一样console.log(map.get(arr))	//ES6
```

### 字符串扩展

- Unicode：ES6加强了对Unicode的支持，并扩展一下；允许采用\\uxxxx形式表示一个字符，其中xxxx为字符的Unicode码点
- iterator：字符串扩展 iterator 接口，使得可以通过 for ... of 遍历，通过 for ... of 遍历时，可以取得字符串每个字符的真正字符

```js
"\u0061"   //a"\{u20bb7}"  //可以将码点正确解读，UTF16let str="abc"for(let s of str){  //for of 遍历	console.log(s)  //abc}
```

- 模板编译	

```js
let a=`${a}+${b*2}`  //运算，相当于 ${a+b*2}var template = `<ul>  <% for(var i=0; i < data.supplies.length; i++) { %>	<li><%= data.supplies[i] %></li>  <% } %></ul>`
```

### 函数扩展

- 可以赋值默认值

- 参数可以使用解构赋值

- 函数参数：调用时只有末尾参数可以省略，因此一般是尾参数赋值默认值

- length属性：指向函数参数未赋值默认值的个数，指定默认值，会导致该属性失真

  ```js
  function f(x,y){	console.log(x,y)}f()f(10,)f(,10)   //语法报错
  ```

- 作用域：指定默认值参数，在初始化时会形成一个单独的作用域

  ```js
  var x=1function f(x,y=x){	console.log(y)}f(2)  //2，参数初始化单独作用域，外层x变量被覆盖let foo='a'function bar(a=()=>foo){	let foo='b'}bar()  //a，此时输出为外层定义的foo，变量默认值初始化时会形成一个单独的作用域
  ```

- 箭头函数：在返回对象时，必须在外面加上小括号，不然存在语义问题；普通函数中的this，非严格模式下指向window，严格模式下undefined；对象内部函数的this指向调用这些方法的对象；箭头函数没有 this 指向

  ```js
  let f1 = () => 5let f2 = function() {  //等价于f1	return 5}let x1 = (a,b) => {	a = a+b	return a}let x2 = function (a,b) {	a=a+b	return a}let x=()=>{   //直接返回对象，报错，{} 与 代码块语义重复	a:1,	b:2}
  ```

- Rest参数，Rest参数放在参数列表最后

### this指向问题

- 普通声明函数，非严格模式下，this指向window；严格模式下，this undefined
- 对象中函数，this指向调用它的对象
- 箭头函数，this指向外层的this；多个箭头函数嵌套，this指向最外层
- 普通函数的调用：函数的调用实际是 funa.call(obj)，此时函数中的this指向obj；当普通函数调用时 funa.call(undefined)，因此this指向为undefined
- call方法的第一个参数总是函数中this的指向；可以使用call改变this指向

```js
//函数中this，非严格模式指向window，严格模式下undefined；对象的中函数的this指向指向调用该函数的对象let a=1let b = function(s) {   console.log(this)}b()   //this指向windowb.call(a,8)   //输出的为1，call表示在a对象上调用b方法,相当于改变方法的this指向，此时this指向 alet a={	funa:function() {		console.log(this)	}}a.funa()  //输出a对象，对象中函数的this指向该对象function foo(){   setTimeout(()=>{	   console.log(this)   },100)}foo.call({id:42})  //此时箭头函数中的this指向的是外层函数的this，而外层函数的this通过call方法指向了{id:42}，这个对象function foo(){   setTimeout(function a(){	   console.log(this)   }.call({id:12}),100)}foo.call({id:42})  //此时因为setTimeout参数是非箭头函数，而且使用了call改变了this指向，此时this指向为 {id:12} 这个对象
```

### module

- 暴露：规定	模块对外接口，export
- 引入：引入其他模块对外暴露的接口，import
- default：相当于对外暴露一个名为default的接口，该接口引入时可以任意命名，用户不需要关心接口的具体名字是什么