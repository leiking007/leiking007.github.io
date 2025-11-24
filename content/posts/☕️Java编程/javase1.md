---
title: "JavaSE1"
date: 2020-06-09
lastmod: 2020-06-09
draft: false
tags: ['JavaSE']
categories: ["☕️Java编程"]
author: "lei"
---

# JavaSE1

##  Java基础

### 名词介绍

**Java三个版本**

- Java SE：Standard Edition ，Java SE 就是标准版，包含标准的 JVM 和标准库
- Java EE：Enterprise Edition，Java EE是企业版，它只是在Java SE的基础上加上了大量的API和库，以便方便开发Web应用、数据库、消息服务等
- Java ME：Micro Edition，Java ME就和Java SE不同，它是一个针对嵌入式设备的“瘦身版”，Java SE的标准库无法在Java ME上使用，Java ME的虚拟机也是“瘦身版”

**JDK JRE区别**

- JDK：Java Development Kit，Java开发环境
- JRE：Java Runtime Environment，Java运行环境（相比 JDK 少了编译器，调式器等）

**JSR JCP是什么**

- JSR规范：Java Specification Request，SUN公司规定的 JSR 规范，凡是想给Java平台加一个功能，比如说访问数据库的功能，要先创建一个JSR规范，定义好接口，这样，各个数据库厂商都按照规范写出Java驱动程序
- JCP组织：Java Community Process，负责审核 JSR 的组织

### 安装

1. 下载 jdk 压缩包，解压到任意目录

2. 配置环境变量 `Java_HOME`指向 JDK 安装目录；然后，把`Java_HOME`的`bin`目录附加到系统环境变量`PATH`上

   ```tex
   新建Java_home环境变量
       Java_HOME
       F:\study\environment\JavaDevelopmentKit\graalvm-ee-Java11-22.2.0
   
   在path环境变量下添加
       %Java_HOME%\bin
   ```

3. 命令行执行

   ```bash
   Java --version
   ## 输出 Java 11.0.16 2022-07-19 LTS 版本号，即安装成功
   ```

**常用命令解释**

- Java：这个可执行程序其实就是JVM，运行Java程序，就是启动JVM，然后让JVM执行指定的编译后的代码；
- Javac：这是Java的编译器，它用于把Java源码文件（以`.Java`后缀结尾）编译为Java字节码文件（以`.class`后缀结尾）；
- jar：用于把一组`.class`文件打包成一个`.jar`文件，便于发布；
- Javadoc：用于从Java源码中自动提取注释并生成文档；
- jdb：Java调试器，用于开发阶段的运行调试

### Hello World

1. 打开文本编辑器输入以下代码，然后保存为 Hello.Java

   ```java
   public class Hello {
       public static void main(String[] args) {
           System.out.println("Hello, world!");
       }
   }
   ```

2. 编译，在保存 Hello.Java 的目录下执行下面命令编译，编译成功会在当前目录下会产生一个`Hello.class`文件

   ```bash
   $ Javac Hello.Java
   ```

3. 执行Hello.class ，

   ```bash
   $ Java Hello
   Hello, world!
   ```

> 注意：一个Java源码只能定义一个`public`类型的class，并且class名称和文件名要完全一致

**Java程序运行流程**

Java源码本质上是一个文本文件，我们需要先用`Javac`把`Hello.Java`编译成字节码文件`Hello.class`，然后，用`Java`命令执行这个字节码文件：

```ascii
┌──────────────────┐
│    Hello.Java    │◀── source code
└──────────────────┘
          │ compile
          ▼
┌──────────────────┐
│   Hello.class    │◀── byte code
└──────────────────┘
          │ execute
          ▼
┌──────────────────┐
│    Run on JVM    │
└──────────────────┘
```

### Java程序基础结构

**结构**

```java
/**
 * 可以用来自动创建文档的注释
 */
public class Hello {
    public static void main(String[] args) {
        // 向屏幕输出文本:
        System.out.println("Hello, world!");
        /* 多行注释开始
        注释内容
        注释结束 */
    }
} // class定义结束
```

**注释**

```java
// 这是单行注释...


/*
    这是多行注释
    blablabla...
    这是多行注释
*/


/**
 * 可以用来自动创建文档的注释
 * @auther liaoxuefeng
 */
```

## 数据类型

**4大类，8小类**

1. 整数型：byte、short、int、long
2. 浮点型：float、double；默认浮点型数据，会被当作double类型处理
3. 布尔型：boolean；只有true与false，没有0、1
4. 字符型：char；只能存储单个字符，byte、short、char做混合运算先转化为int

|  类型   | 占用字节数量（byte） |        取值范围        |
| :-----: | :------------------: | :--------------------: |
|  byte   |          1           |        -128~127        |
|  short  |          2           |      -32768~32767      |
|   int   |          4           | -2147483648~2147483647 |
|  long   |          8           |                        |
|  flaot  |          4           |                        |
| double  |          8           |                        |
| boolean |          1           |                        |
|  char   |          2           |        0~65535         |

**计算机内存的基本结构**

计算机内存的最小存储单元是字节（byte），一个字节就是一个8位二进制数，即8个bit

它的二进制表示范围从`00000000`~`11111111`，换算成十进制是0~255，换算成十六进制是`00`~`ff`

内存单元从0开始编号，称为内存地址。每个内存单元可以看作一间房间，内存地址就是门牌号

```ascii
  0   1   2   3   4   5   6  ...
┌───┬───┬───┬───┬───┬───┬───┐
│   │   │   │   │   │   │   │...
└───┴───┴───┴───┴───┴───┴───┘
```

一个字节是1byte，1024字节是1K，1024K是1M，1024M是1G，1024G是1T。一个拥有4T内存的计算机的字节数量就是：

```ascii
4T = 4 x 1024G
   = 4 x 1024 x 1024M
   = 4 x 1024 x 1024 x 1024K
   = 4 x 1024 x 1024 x 1024 x 1024
   = 4398046511104
```

不同的数据类型占用的字节数不一样。Java基本数据类型占用的字节数：

```ascii
       ┌───┐
  byte │   │
       └───┘
       ┌───┬───┐
 short │   │   │
       └───┴───┘
       ┌───┬───┬───┬───┐
   int │   │   │   │   │
       └───┴───┴───┴───┘
       ┌───┬───┬───┬───┬───┬───┬───┬───┐
  long │   │   │   │   │   │   │   │   │
       └───┴───┴───┴───┴───┴───┴───┴───┘
       ┌───┬───┬───┬───┐
 float │   │   │   │   │
       └───┴───┴───┴───┘
       ┌───┬───┬───┬───┬───┬───┬───┬───┐
double │   │   │   │   │   │   │   │   │
       └───┴───┴───┴───┴───┴───┴───┴───┘
       ┌───┬───┐
  char │   │   │
       └───┴───┘
```

`byte`恰好就是一个字节，而`long`和`double`需要8个字节

**基本数据转换的6条规则**

1. 只有boolean类型不能转换，其他都可以
2. 自动类型转换，byte**<**short(char)**<**int**<**long**<**float**<**double
3. 强制类型转换需要加强制类型转换符，可能损失精度
4. 当一个整数没有超出byte、short、char取值范围时，可以直接复制给byte、short、char类型的变量
5. byte、short、chart混合运算时，先各自转化为int类型
6. 多种数据类型混合运算时，先转化成容量最大的那一种，再做运算

## 运算符

**算数运算符**

+、-、*、/、%（取模）、++（自加）、--（自减）

**关系运算符**

\>、>=、==、<、<=、!=

**逻辑运算符**

&(逻辑与)、|（逻辑或）、！（逻辑非）、&&（短路与）、||（短路或）
true||表达式：表达式不执行，表	true
false&&表达式：表达式不执行，表	false

**赋值运算符**

```java
byte a=100;
a=a+1;	//报错，类型不兼容
a+=1;		//不会报错
```

基本赋值：=
扩展赋值运算符：+=、-=、/=、*=、%=
使用扩展运算符，不会改变数据类型，a+=100相当于a=（a数据类型)(a+1)

**位运算符**

**条件运算符**

布尔表达式	**？**	表达式1（true时） **：** 表达式2（false时）
必须将运算结果处理，不然编译报错，不是语句

**字符串连接运算符（+）**

当表达式含有字符串时，+号作用为字符串拼接，拼接完还是一个字符串
表达式有多个+号时，从左到右依次执行，有括号除外

**其他运算符**

new：实例化一个对象

instanceof：

1. 可以在运行阶段动态判断引用指向的对象的类型
2. instanceof语法：(引用  instanceof  类型)
3. instanceof运算结果只能是：true/false
4. c是一个引用，指向堆内存中地址；如果 c  instanceof  Cat  返回true，表示c指向是一个Cat对象
5. 任何时候向下转型都需要使用instanceof运算

## 控制语句

### 接受用户输入

```jade
//创建一个键盘扫描器对象
Java.util.Scanner s = new Java.util.Scanner(System.in);
int i=s.nextInt();	//等待接受用户输入一个int,敲击回车结束
System.out.println("你输入的数字是："+i)；
```

### 选择语句

if语句
在if分支中，如果只有一条语句可以省略{}

```java
if(sex)
	System.out.println("男");
System.out.println("123");
else		//这一行报错，提示有else确没有if
	System.out.println("女");

//根据输入年龄判断属于什么人群
		Java.util.Scanner s=new Java.util.Scanner(System.in);
		System.out.print("请输入年龄：");
		int age=s.nextInt();
		if(age>150 || age<0){
			System.out.println("不合法输入");
		}else{
			if(age<=10){
				System.out.println("小学生");
			}else if(age<=22){
					System.out.println("还是个学生");
			}else if(age<=60){
						System.out.println("上班族");
			}else{
					System.out.println("养老族");
			}
		}
```

switch语句
switch语句条件只支持int、String两种类型
遇到break;case结束		没有遇到break;case穿透		case合并

```java
Java.util.Scanner s=new Java.util.Scanner(System.in);
		System.out.print("请输入成绩:");
		double score=s.nextDouble();
		if(score > 100 || score<0){
			System.out.println("成绩输入不合法");
			return;
		}
		int a=(int)(score/10);
		String str="不合格";
		switch(a){
			case 10: case 9:
				str="优秀";
				break;
			case 8:
				str="良";
				break;
			case 6: case 7:
				str="及格";
				break;
		}
		System.out.println(str);
```



### 循环语句

循环语句为了解决代码的复用
for循环

```java
		int i = 0;
		for(;i<10;i++){
			//System.out.println("i-->"+i);
		}
		System.out.println("i-->"+i); //i此时值为10
```

- 最先执行初始化步骤。
- 然后，检测布尔表达式的值。
- 执行一次循环后，更新循环控制变量。
- 再次检测布尔表达式。循环执行上面的过程。

while循环

```java
		while(i<20){
			//System.out.print("i-->"+i);
			i++;
		}
		System.out.println("i-->"+i);
```

只要布尔表达式为 true，循环就会一直执行下去

do...while...循环

```java
		do{
			i++;
		}while(i<20);
```

即使不满足条件，也至少执行一次

### 转向语句

break
	break 主要用在循环语句或者 switch 语句中，用来跳出整个语句块。
	break 跳出最近的循环，并且继续执行该循环下面的语句。

```java
		a:for(;true;){
			b:for(int i =0; i<5 ; i++){
				if(i==4){
					System.out.println("i-->"+i);
					break a;	//跳出指定循环
				}
			}
		}
```

continue
	continue 适用于任何循环控制结构中。作用是让程序立刻跳转到下一次循环的迭代。与break一样，可以指定继续进行哪一个循环

return	终止一个方法；和break不是一个级别

## 方法

方法可以达到”代码复用“

### 方法的定义

[修饰符列表]	返回值类型	方法名（）{
	方法体;
}
[]符号叫做中括号，里面内容不是必须的；方法体是Java语句构成

修饰符列表：可选项

返回值类型：可以是Java中所有合法的数据类型；当方法不返回任何值时，使用void关键字；如果不是返回值类型void，方法结束后必须return，否则报错

方法名：驼峰命名，首字母小写，见名知意

形参列表：0~N个；方法结束后内存释放；形参的数据类型起决定性作用

方法体：逻辑业务；自上而下执行

方法调用：实参形参类型对应，个数对应，否则报错；类名.方法名(实参)；调用当前类中的方法可以不加类名调用方法

### JVM内存结构

栈内存（stack）：在方法被调用时，发生进栈（分配空间）、方法执行完，发生弹栈（释放空间）；栈数据结构先进后出，有入栈（push）、出栈（pop）、栈帧始终指着栈顶元素、栈底元素、处于栈顶的元素具有活跃权

堆区（堆内存）：new运算符创建的对象都存储在堆内存中；new运算符就是在堆内存中开辟出一块空间；实例变量存储在堆内存中

方法区内存：classloader将类加载时，会放入方法区；存储代码片段，字节码；最先有数据

### 方法重载

优点：代码整齐美观、功能相似的可以让方法名相同
在Java语言中，首先通过方法名区分方法，名相同时，通过参数类型区分
在同一个类中，如果两个方法功能相似，可以考虑方法重载（方法名一样）
方法重载条件：同一个类、方法名相同、参数列表不同（类型，个数，顺序）
方法重载和**修饰列表**与**返回值类型**无关

### 方法递归

方法自己调用自己，被称作方法递归
当递归程序没有结束条件时，一定会发生栈溢出错误；递归结束条件太深，也有可能会发生溢出；所以递归必须要有结束条件
尽量使用循环代替递归
Java -X可以查看调整栈内存大小的参数

```java
	public static void main(String[] args)
	{
		int n=10;
		int a=sum(n);
		System.out.println(a);
	}
	public static int sum(int n){
		if(n==1){
			return 1;
		}
		return n + sum(n-1);
	}
```

## 面向对象

### 简述

面向过程：注重实现功能的步骤；注重实现功能的因果关系；A步骤因果关系到B步骤，组成一个子模块，子模块之间又因为因果关系结合，其中任何地方出现问题，整个系统就出错了（代码耦合度高，扩展性差）；开发小型项目效率高（不需要对象的提取）
面向对象：对象A，对象B，对象A与B的组合；符合人类的认知；耦合度低，扩展性强

### OOA/OOD/OOP

OOA：面向对象分析（analysis）

OOD：面向对象设计（design）

OOP：面向对象编程（programming）

整个开发过程都采用OO贯穿的

### 面向对象三大特性

封装：

继承：

多态：

### 类

Java中对象是通过类创建出的个体

类：现实中不存在，是思考、总结、抽象出来的概念（例如：明星）；类中描述的所有对象的共同特征信息

对象：真实存在的个体（例如：刘德华）

类-->对象：实例化；	对象-->类：抽象

类的共同特征包括：名词（状态特征）、动词（动作特征）

类的属性来源于状态；类的方法来源于动作

### 类的定义

语法格式：
[修饰符列表]	class	类名{
		//类体=属性+方法
		//属性以变量形式体现（属性对应的数据）
		//方法表述动作、行为
}

### 对象的创建

```java
Xuesheng	s1	=	new	 Xuesheng();
class XueSheng{
    //类体
}
```

new：运算符，用于对象创建
Xuesheng：引用数据类型
new	Xuesheng()：一个对象

编译时，如果类没有编译，会自动查找该类的.Java文件，并进行编译

对于成员变量来说，如果声明时没有赋值，系统会赋值该类型的默认值
引用类型的默认值为*null*

对象存储在堆内存中，new出来的；引用是一个变量，存储堆中内存地址的变量

引用也有可能是实例变量，存储在堆中

### 对象创建内存图

```java
class  Test01
{
	A a;
	public static void main(String[] args)
	{
		A a=new A();
		B b=new B();
		C c=new C();
		D d=new D();
		Test01 t=new Test01();

		t.a=a;
		a.b=b;
		b.c=c;
		c.d=d;
		//通过t访问d中的i
		t.a.b.c.d.i=1;
		System.out.println(d.i);
	}
}

class A
{
	B b;
}

class	B
{
	C c;
}

class C
{
	D d;
}

class D
{
	int i;
}
```

可以通过画内存图进行分析。
关键字：空指针异常（空引用访问对象相关的数据时）；GC主要回收堆内存的数据（没有任何引用指向的对象）

### 方法调用时的参数传递

参数传递时，永远都是将实参盒子中的值复制一份传递过去

### 构造方法

语法结构：
[修饰符列表]		构造方法名	（形式参数列表）{ //创建对象、给属性赋值

​		//构造方法体
}

构造方法是一个特殊的方法；构造方法名与类名必须一致、构造方法没有放返回值，不能使用void修饰；通过构造方法可以完成对象的创建，以及实例变量的初始化

当一个类没有任何构造方法时，系统会默认提供一个无参数的构造方法（缺省构造器）

使用new运算符调用构造方法

构造方法支持方法重载；一个类中可以有多个方法名相同的构造方法

实例变量，是在构造方法调用（创建对象）时赋值的（包括默认值）

## 封装

### 简要

有了封装才有继承，有了继承才有多态

封装：1.保证内部结构的安全性；2.屏蔽复杂，暴露简单

### 怎么封装

1. 属性私有化（private修饰，只能在本类中访问）
2. 对外提供简单的入口（getAttr、setAttr）；可以在set方法中设立关卡，保证数据安全性

```java
class  Test02
{
	public static void main(String[] args)
	{
		Person a=new Person();
		a.setAge(100);	//调用set方法，设置年龄属性
		System.out.println(a.getAge());	//调用get方法，获取年龄属性
	}
}
class Person
{
	private int age;	//私有化
	//get和set都不带static，为实例方法
	public int getAge(){	//get方法有个返回值
		return age;
	}
	public void setAge(int a){	//set方法有个形参
		//设定关卡
		if(a<0||a>150){
			System.out.println("年龄输入不合法");
			return;	//直接终止程序
		}
		age=a;
	}
}
```

## this与static

### static

1. static翻译为静态
2. 所有static关键字修饰的都是类相关的，类级别的
3. 所有static修饰的都采用**”类名.“**的方式访问
4. 采用static修饰的为静态方法/变量

类属性分为：实例相关的（需先new个对象，引用访问）、静态相关的（类.直接访问）

不会因为对象的变化而变化的属性，用**static**进行修饰，例如：中国人类的国籍属性

不需要对象参与的方法，用static进行修饰，例如：工具类

static修饰变量，静态变量；在类加载时静态变量空间就开辟出来了；静态变量存储在方法区	**（**局部变量->栈；实例变量（对象级别）->堆；静态变量（类级别）->方法区**）**

### 静态代码块

使用static定义静态代码块；静态代码块在类加载时执行，且仅执行一次，在main之前执行，自上而下；常用于记录类加载时机，哪个类加载到JVM中了

```java
class Test04
{
	//静态代码块，一个特殊的时机，类加载时机
	static	{
		System.out.println("A");
	}
	static	{
		System.out.println("B");
	}
	public static void main(String[] args)
	{
		System.out.println("最后打印");
	}
	static	{
		System.out.println("C");
	}
	//打印顺序：A B C 最后打印
}
```

### 实例代码块

实例语块在类加载时没有执行，在new时，先执行实例语块，再执行构造方法；Java提供的对象创建时机

### this

this是一个关键字，全部小写；保存的内存地址指向当前对象自己本身;不能使用在类的静态方法中

在实例方法中 this.no=no 增加可读性时，this不能省略

this除了使用在实例方法，也可用在构造方法；通过当前的构造方法，调用另一个构造方法
语法：this（实际参数列表）；存在意义：代码复用；只能出现在构造方法的第一行

```java
class Test06
{
	public static void main(String[] args)
	{
		Student a=new Student();
		System.out.println(a);	//输出Student@5ae50ce6
		a.write();		////输出Student@5ae50ce6
	}
}
class Student
{
	String name;
    public Student(){
        this("王五");	//无参构造，name默认为王五
    }
    public Student(String name){
        this.name=name;
    }
	public void write(){
		System.out.println(this);
	}
    public void shuChu(){
		System.out.println(this.name);
	}
}
```

### 总结代码

```java
/*
	实例变量
	实例方法

	静态变量
	静态方法

	静态代码区
	实例代码区

	实例方法(){
		局部变量
	}
*/
class Zongjie
{
	public static void main(String[] args)
	{
		Student.setSchool("旺苍中学");	//调用静态方法
		Student s1=new Student(1000,"小明");
		Student s2=new Student(1001,"小红");
		System.out.println(s1.getName()+":"+s1.getNo()+"-->"+Student.getSchool());
		System.out.println(s2.getName()+":"+s2.getNo()+"-->"+Student.getSchool());
	}
}
class Student
{
	static{
		System.out.println("静态代码块执行了");
	}
	{
		System.out.println("实例代码块执行");
	}
	//实例变量，私有化，封装
	private int no;
	private String name;
	//静态变量
	private static String school="希望小学";
	public  Student(){
		this(1111,"张三");	//无参构造调用有参构造，赋值默认值
	}
	public  Student(int no,String name){
		this.no=no;
		this.name=name;
		System.out.println(this.name+"创建成功！！！");
	}
	//静态方法
	public static void goSchool(){
		System.out.println("上学时间到！！！");
	}
	public static String getSchool(){
		return Student.school;
	}
	public static void setSchool(String school){
		Student.school=school;
	}
	//实例方法
	public int getNo(){
		return this.no;
	}
	public void setNo(int no){
		this.no=no;
	}
	public String getName(){
		return this.name;
	}
	public void setName(String name){
		this.name=name;
	}
}
```

## 继承

### 方法修饰符

默认为default

### 简要

子类继承父类，代码得到复用；因为继承关系，才有了方法覆盖与多态机制

凡是可以用“A is a B“描述的，都可以使用继承，例如：Cat is a Animal

特性：

1. B类继承A类，则A类被称为超类（superclass）、父类、基类；B类称为子类（subclass）、派生类、扩展类
2. Java中只支持单继承，但有些时候会产生间接继承的效果，如：C继承B，B继承A，则C间接继承A
3. 规定，除了private修饰数据与构造方法不能继承，其他的都可以继承下来（相当于复制一份，会打上继承过来的标记）
4. Java中没有任何继承时，则默认继承Object类，Object类为根类
5. 继承缺点，父类改变，会影响子类

Object(根类)中toString()方法：
toString()方法的作用：将一个对象转换为字符串形式；  toString()方法，大多时候是需要进行方法重写的。

当原码中一个方法以” **;** “结尾，并且修饰符列表有”**native**“关键字，表示调用C++写的dll程序（dll动态链接库文件）

```java
	public static void main(String[] args)
	{
		Test01 a=new Test01();
		String str=a.toString();//Object中的方法，继承过来了
		System.out.println(str);//输出为Test01@be64738
		System.out.println(a);	//输出为Test01@be64738
		/*
			be64738可以看作对象的内存地址，是经过哈希算法处理的地址
			从上分析出，在打印a对象引用时，默认调用了toString()方法
			同时证明了所有类都继承成Object类
		*/
	}
```

### 方法覆盖

当子类继承过来的方法无法满足需求时，可以考虑方法的覆盖；方法的覆盖又叫做方法的重写（Override、Overwrite）

方法覆盖条件：

1. 两个类必须要有继承关系
2. 重写的方法和继承过来的方法有相同的名、返回类型、参数列表
3. 访问权限不能更低，可以更高
4. 重写后的方法不能比之前的方法抛出更多的异常，可以更少

方法覆盖典型案例：

```java
class Test02
{
	public static void main(String[] args)
	{
		ChinaPeople p1=new ChinaPeople();
		AmericPeople p2=new AmericPeople();
		p1.setName("张三");
		p2.setName("Jack");
		p1.speak();
		p2.speak();
	}
}

class People  //人类
{
	private String name;
	public People(){}
	public People(String name){
		this.name=name;
	}
	public void setName(String name){
		this.name=name;
	}
	public String getName(){
		return this.name;
	}
	public void speak(){
		System.out.println(this.getName()+"正在说话");
	}
}

class ChinaPeople extends People	//中国人继承人类
{
	public void speak(){	//重写speak方法
		System.out.println(this.getName()+"正在说汉语");
	}
}

class AmericPeople extends People	//美国人继承人类
{
	public void speak(){	//重写speak方法
		System.out.println(this.getName()+"speak english");
	}
}
```

## 多态（重点）

### 简介

向上转型（自动转换）：子类实例化的对象使用父类修饰

向下转型（强制转换）：父类实例化的对象使用子类修饰

例如：A类继承B类，则有：
A o1=new B();	//向下转型
B o2=new A();	//向上转型，实际上o2存储的还是A类的对象地址

### 多态

多种形态、多种状态，编译和运行有两个不同的状态

编译期叫做静态绑定

运行期叫做动态绑定

```java
Animal a=new Cat();
a.move();
//编译器编译时发现a的类型为Animal，所以会在Animal类中找move()方法，找到了，
//静态绑定，编译通过；但是运行时和底层实际对象有关，真正执行时会自动调用“堆内存中真实对象”实际有关方法。
```

代码示例

```java
/*
	程序分为 编译阶段（静态绑定） 与 运行阶段（动态绑定）；
	程序编译时碰到向上引用调用方法时，会查看父类是否有该方法，有则编译通过，父类没有则编译失败
	向上引用实际上底下的对象还是子类对象
*/
class  Test03
{
	public static void main(String[] args) 
	{
		Animal a1=new Cat();	//子类对象，父类的数据类型；称为向上转型
		Animal a2=new Dog();
		a1.move();	//执行结果“猫在走猫步”
		a2.move();	//执行结果“狗在奔跑”
		//a2.call();	//Dog类特有的方法，但是因为向上引用，所以编译器在Animal类中找该方法，
						//找不到，所以静态绑定失败，编译器报错:错误: 找不到符号；此时需要
						//向下转型（强制）
		Dog a3=(Dog)a2;	//强制向下转型
		a3.call();		//调用成功
		//但是向下转型有风险，如下：
		//Dog a4=(Dog)a1;	//强制向下转型为Dog实例，但是a1实际存储的是Cat实例
		//a4.call();	//编译通过，因为a4实际上是Cat实例，
					//所以运行报错：Java.lang.ClassCastException，类型转换异常
		//处理向下转型的风险，使用instanceof，在运行时动态的判断该引用地址对象是否为某种类型，返回true/false
		if(a1 instanceof Dog){	//因为a1引用指向不是Dog类的对象，返回false
			Dog a4=(Dog)a1;
			a4.call();
		}
	}
}

class Animal
{
	public void move(){
		System.out.println("动物在移动");
	}
}
class Dog extends Animal
{
	public void move(){	//重写方法
		System.out.println("狗在奔跑");
	}
	public void call(){	//子类特有的方法
		System.out.println("狗正在叫");
	}
}
class Cat extends Animal
{
	public void move(){
		System.out.println("猫在走猫步");
	}
}
```



### 多态在开发中作用

降低程序耦合度，增强程序扩展性

软件开发7大原则之一，OCP（对扩展开放，堆修改关闭）

面向抽象编程，不建议面向具体

示例代码

```java
class Test04 
{
	public static void main(String[] args) 
	{
		Master ma=new Master();
		Dog dog=new Dog();
		ma.feed(dog);
		Cat cat=new Cat();
		ma.feed(cat);
	}
}

//主人类
class Master
{
	/*
	public void feed(Dog p){	//喂养狗狗
		p.eat();
	}
	方法写死了，扩展性差，如果后续添加别的宠物，需要新写方法，容易造成软件的未知错误，因此需要抽象出来，不再修改这里的代码
	*/
	public void feed(Pet pet){ //使用了多态，向上转型
		pet.eat();
	}
}

//宠物类
class Pet
{
	public void eat(){};
}
//狗类
class Dog extends Pet
{
	public void eat(){	//吃动作
		System.out.println("狗狗吃骨头！！！");
	}
}
//猫类
class Cat extends Pet
{
	public void eat(){
		System.out.println("猫咪吃鱼！！！");
	}
}
```

### 其他

方法覆盖需要和多态机制联合起来才有意义

而静态方法的覆盖在多态中就没有意义了，多态与对象相关

私有方法不能覆盖

方法重写时：对于返回值类型是基本数据类型时，必须一致！返回值为引用数据类型时，重写时返回值类型可以变小（向下转型），Java中允许；而返回值类型变大，Java中是不允许的



## super

### 简介

与this关键字对比着学，super有以下特点

1. super是一个关键字，全部小写。有super、super()
2. super不能出现在静态方法中
3. super大部分情况下可以省略
4. super()表示通过子类构造方法调用父类构造方法，只能出现在构造方法第一行
5. 如果既没有this()也没有super()系统会默认有一个super()调用父类的无参 构造方法

### 代码示例

```java
class  Test06
{
	public static void main(String[] args) 
	{
		new C();
	}
}
class A
{
	public A(){
		System.out.println("A无参构造");
	}
}
class B extends A
{
	public B(){
		System.out.println("B无参构造");
	} 
	public B(String name){	//没写，默认有一个super()调用父类无参构造
		System.out.println("B有参构造");
	}
}
class C extends B
{
	public C(){
		this("name");	//this()调用该类有参构造
		System.out.println("C无参构造");
	}
	public C(String name){
		this(name,123);	//this()出现，super()就没有了
		System.out.println("C有参构造（name）");
	}
	public C(String name,int age){
		super(name);	//调用父类有参构造方法
		System.out.println("C有参构造（name,age）");
	}
}
//输出结果应该为:A无参构造 B有参构造 C有参构造（name,age） C有参构造（name） C无参构造
```

通过以上代码，可以知道，无论怎么样，实例化子类，都会调用父类构造方法，最终会调用到Object的无参构造，并且Object的无参构造最先执行

### 其他

super()虽然调用了父类构造方法，但只是初始化了父类的特征，并不是创建新对象，可以参考super内存内存图理解。对象只是创建了一个（子类）

Java中允许在子类中出现和父类同名变量，这个时候如果使用父类的变量，必须使用super调用，不能省略

super不保存内存地址，也不指向任何对象，只是保存当前对象中一块父类的特征，使用时必须用**super.**

**super.**可以调用重写后的父类方法

实例方法存储在栈区

代码：

```java
class  Test07
{
	public static void main(String[] args) 
	{
		C ob=new C();
		ob.shuchu();
	}
}
class B
{
	private int age=19;
	public String name="张三";
	public String ring(){
		return "B";
	}
}
class C extends B
{
	public String name;
	public String ring(){
		return "C";
	}
	public void shuchu(){
		System.out.println(name);	//null
		System.out.println(super.name);	//张三
		//System.out.println(super.age);	//会报错
		System.out.println(this.ring());	//C，子类方法
		System.out.println(super.ring());	//B，调用父类方法
	}
}
```

## 内部类

成员内部类

局部内部类

匿名内部类

静态内部类
