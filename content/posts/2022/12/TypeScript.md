---
title: "TypeScript"
date: 2022-12-19
lastmod: 2022-12-19
draft: false
tags: ['js']
categories: ["前端"]
author: "lei"
---

# TypeScript

## 初始

### TypeScript 的介绍

TypeScript是一种由微软开发的开源、跨平台的编程语言。它是JavaScript的超集，最终会被编译为JavaScript代码

2012年10月，微软发布了首个公开版本的TypeScript，2013年6月19日，在经历了一个预览版之后微软正式发布了正式版TypeScript

TypeScript的作者是安德斯·海尔斯伯格，C#的首席架构师。它是开源和跨平台的编程语言

TypeScript扩展了JavaScript的语法，所以任何现有的JavaScript程序可以运行在TypeScript环境中

TypeScript是为大型应用的开发而设计，并且可以编译为JavaScript

TypeScript 是 JavaScript 的一个超集，主要提供了类型系统和对 ES6+ 的支持**，它由 Microsoft 开发，代码开源于 GitHub 上

**TypeScript 是 JavaScript 的一个超集**，主要提供了**类型系统**和**对 ES6+ 的支持**，它由 Microsoft 开发，代码[开源于 GitHub (opens new window)](https://github.com/Microsoft/TypeScript)上

**总结**：TypeScript 在社区的流行度越来越高，它非常适用于一些大型项目，也非常适用于一些基础库，极大地帮助我们提升了开发效率和体验

### 特点

TypeScript 主要有 3 大特点：

- **始于JavaScript，归于JavaScript**

  TypeScript 可以编译出纯净、 简洁的 JavaScript 代码，并且可以运行在任何浏览器上、Node.js 环境中和任何支持 ECMAScript 3（或更高版本）的JavaScript 引擎中。

- **强大的类型系统**

  *类型系统**允许 JavaScript 开发者在开发 JavaScript 应用程序时使用高效的开发工具和常用操作比如静态检查和代码重构。

- **先进的 JavaScript**

  TypeScript 提供最新的和不断发展的 JavaScript 特性，包括那些来自 2015 年的 ECMAScript 和未来的提案中的特性，比如异步功能和 Decorators，以帮助建立健壮的组件

### 安装

1. 全局安装

   ```bash
   npm install -g typescript
   ```

2. 安装完成后，在控制台运行如下命令，检查安装是否成功

   ```bash
   tsc -V
   ```

## hello TS

### hello TS

1. 编写01_hello.ts文件

   ```typescript
   (()=>{
       // string 表示参数str为string类型
       function sayHello(str:string){
           console.log("Hello "+str)
       }
       let str='TypeScript'
       sayHello(str)
   })()
   ```

2. 打开控制台，编译ts文件；编译成功后同级目录下会多出一个`.js文件`

   ```bash
   tsc 01_hello.ts
   ```

3. 新建index.html，引入编译后的 js 脚本

   ```html
   <!DOCTYPE html>
   <html lang="en">
   <head>
       <meta charset="UTF-8">
       <meta http-equiv="X-UA-Compatible" content="IE=edge">
       <meta name="viewport" content="width=device-width, initial-scale=1.0">
       <script src="./01_hello.ts" ></script>
       <title>Document</title>
   </head>
   <body>
   </body>
   </html>
   ```

4. 打开浏览器，可以看到控制台输出了：Hello TypeScript

**总结**

- 如果 ts 文件中不包含 ts 特有语法，则 html 引入浏览器可直接执行
- 如果 ts 文件中包含 ts 特有语法，浏览器执行报错
- ts 编译为js代码后，let 修饰的变量会变为 var 修饰

### vscode 中自动编译

1. 使用命令生成配置文件`tsconfig.json`

   ```bash
   tsc --init
   ```

2. 修改配置文件中以下内容

   ```json
   {
     "compilerOptions": {
   	 "outDir": "./js",                  /* 编译后的js文件保存目录 */
         "strict": false,                /* 不启用严格模式 */
   }
   ```

3. 然后在菜单栏 `终端-->运行任务-->tsc:监视` 运行监视任务即可

4. 此时编写 ts 文件会自动编译，并保存在当前项目的 js 目录下

###  类型注解

类型注解是 TypeScript 语法，是一种轻量级的为函数或变量添加约束的方式；如下：

```typescript
(()=>{
    function sayHello(str:string){
        console.log("Hello "+str)
    }
    let str='TypeScript'
    sayHello(str)
})()
```

sayHello 函数入参，使用了类型注解，此时如果调用时传入函数参数不是 string 类型编译器就会报错

并且进行编译时就会抛错：

```bash
6:14 - error TS2345: Argument of type 'number' is not assignable to parameter of type 'string'.
```

**总结**：TypeScript提供了静态的代码分析，它可以分析代码结构和提供的类型注解

### 接口和类的演示

**接口**

接口是一种约束，TypeScript中也可以使用类型注解对接口进行实时的代码分析，如下：

```typescript
(()=>{
    interface Person{
        firstName:string
        lastName:string
    }
    function getName(person:Person){
        return person.firstName + person.lastName
    }
    const p1={
        firstName:'唐',
        lastName:'每天八杯水'
    }
    // 如果这里传入参数p1的结构不满足接口约定，则会抛错
    console.log(getName(p1))
})()
```

这样使用，在 TS 中编写代码时会有提示检查

**类**

```typescript
(()=>{
    class User{
        firstName:string
        lastName:string
        fullName:string

        //定义构造函数
        constructor(firstName:string,lastName:string){
            this.firstName=firstName
            this.lastName=lastName
            this.fullName=firstName+'_'+lastName
        }
    }

    function getName(person:User){
        return person.fullName
    }

    const u1=new User('唐','每天八杯水')

    console.log(getName(u1))

})()
```

**总结**：查看编译后的js文件，可以看到看到 TypeScript 里的类只是一个语法糖，本质上还是 JavaScript 函数的实现

## 常用语法

### 数据类型

TypeScript 支持与 JavaScript 几乎相同的数据类型

**布尔值**

最基本的数据类型就是简单的 true/false 值，在JavaScript 和 TypeScript 里叫做 `boolean`

```typescript
let isDone: boolean = false;
isDone = true;
// isDone = 2 // error
```

**数字**

和 JavaScript 一样，TypeScript 里的所有数字都是浮点数。 这些浮点数的类型是 number。

```typescript
let a1: number = 10 // 十进制
let a2: number = 0b1010  // 二进制
let a3: number = 0o12 // 八进制
let a4: number = 0xa // 十六进制
```

**字符串**

 和 JavaScript 一样，可以使用双引号（`"`）或单引号（`'`）表示字符串

```typescript
let name:string = 'tom'
name = 'jack'
// name = 12 // error
let age:number = 12
const info = `My name is ${name}, I am ${age} years old!`
```

**undefined 和 null**

TypeScript 里，`undefined` 和 `null` 两者各自有自己的类型分别叫做 `undefined` 和 `null`；默认情况下 `null` 和 `undefined` 是所有类型的子类型。 就是说你可以把 `null` 和 `undefined` 赋值给 `number` 类型的变量

```typescript
let num1: number = 1
num1 = undefined  // 取消严格模式检测
let u: undefined = undefined
let n: null = null
```

**数组**

TypeScript 像 JavaScript 一样可以操作数组元素。 有两种方式可以定义数组。 第一种，可以在`元素类型后面接上[]`

```typescript
// 方式一
let list1: number[] = [1, 2, 3]
// 方式二
let list2: Array<number> = [1, 2, 3]
```

**元组 Tuple**

元组类型允许表示一个已知元素数量和类型的数组，`各元素的类型不必相同`

```typescript
let t1: [string, number]
t1 = ['hello', 10] // OK
t1 = [10, 'hello'] // Error
```

 **枚举**

enum` 类型是对 JavaScript 标准数据类型的一个补充。 使用枚举类型可以`为一组数值赋予友好的名字

默认情况下，从 `0` 开始为元素编号。 你也可以手动的指定成员的数值

枚举类型提供的一个便利是你可以由枚举的值得到它的名字

```typescript
enum Color {
  Red = 1,
  Green,
  Blue
}

// 枚举数值默认从0开始依次递增
// 根据特定的名称得到对应的枚举数值
let myColor: Color = Color.Green  // 2
let colorName: string = Color[2]  // Green
```

**any**

`any` 类型，类型检查器不进行检查而是直接让它们通过编译阶段的检查

```typescript
let notSure: any = 4
notSure = 'maybe a string'
notSure = false // 也可以是个 boolean
```

**void**

表示没有任何类型

```typescript
// 表示没有任何类型, 一般用来说明函数的返回值不能是undefined和null之外的值
function fn(): void {
  console.log('fn()')
  // return undefined
  // return null
  // return 1 // error
}

// 无实际作用，因为你只能赋值 undefined 和 null
let unusable: void = undefined
```

 **never**

一个从来不会有返回值的函数（如：如果函数内含有 `while(true) {}`

一个总是会抛出错误的函数（如：`function foo() { throw new Error('Not Implemented') }`，`foo` 的返回类型是 `never`

never 类型变量只能赋值另外一个 never

```typescript
let bar: never = (() => {
    throw new Error('Throw my hands in the air like I just dont care');
})();


let b: never = (() => {
    while (true) { }
})()
```

当一个函数返回空值时，它的返回值为 void 类型，但是，当一个函数永不返回时（或者总是抛出错误），它的返回值为 never类型

**object**

`object` 表示非原始类型，也就是除 `number`，`string`，`boolean`之外的类型

```typescript
function fn2(obj:object):object {
  console.log('fn2()', obj)
  return {}
  // return undefined
  // return null
}
console.log(fn2(new String('abc')))
// console.log(fn2('abc') // error
console.log(fn2(String))
```

**联合类型**

联合类型（Union Types）表示取值可以为多种类型中的一种 ，使用`|`来创建联合类型

```typescript
/*
  语法：number | string | boolean
*/

// 定义一个一个函数得到一个数字或字符串值的字符串形式值
function toString2(x: number | string) : string {
  return x.toString()
}


// 返回长度
function getLength(x: number | string) {

  // return x.length // error 因为可能为number类型
    
  return x.toString().length
}
```

**类型断言**

通过类型断言这种方式可以告诉编译器，“相信我，我知道自己在干什么”

 它没有运行时的影响，只是在编译阶段起作用

```typescript
/* 
类型断言(Type Assertion): 可以用来手动指定一个值的类型
语法:
    方式一: <类型>值
    方式二: 值 as 类型  tsx中只能用这种方式
*/
function getLength(x: number | string) {
    // 类型断言，表示确定为string类型
    let size = (x as string).length
    if (typeof x === 'string') {
        // typeof 会被编译器推断出，这里 x 为 string 类型
        return x.length
    } else {
        return x.toString().length
    }
}
console.log(getLength('abcd'), getLength(1234))
```

**类型推断**

类型推断: TS会在没有明确的指定类型的时候推测出一个类型

有下面2种情况: 1. 定义变量时赋值了, 推断为对应的类型. 2. 定义变量时没有赋值, 推断为any类型

```typescript
/* 定义变量时赋值了, 推断为对应的类型 */
let b9 = 123 // number
// b9 = 'abc' // error

/* 定义变量时没有赋值, 推断为any类型 */
let b10  // any类型
b10 = 123
b10 = 'abc'
```

### 接口

TypeScript 的核心原则之一是对值所具有的结构进行类型检查。我们使用接口（Interfaces）来定义对象的类型。`接口是对象的状态(属性)和行为(方法)的抽象(描述)`

- 接口是一种规范、是一种规则
- 接口里面可以定义方法和属性，对于属性来说可以是非必须属性和只读属性
- 除了描述带有属性的普通对象外，接口也可以描述函数类型

**初探**

```typescript
interface IPerson1{
    // readonly 表示只读属性，初始化对象后不能再次赋值
    readonly id:number,
    name:string,
    // ? 表示改属性非必须属性
    sex?:string
}

// sex为非必需属性，可以不填
const p1:IPerson1={
    id:1,
    name:'唐'
    // age: 25  // err not assignable to type
}
// p1.id=2   // err read-only property
```

**函数类型**

```typescript
// 接口可以描述函数类型(参数的类型与返回的类型)
interface SearchFunc {
    // 定义函数的参数和返回值
    (source: string, subString: string): boolean
}

const mySearch: SearchFunc = function (source, subString): boolean {
    return source.indexOf(subString) != -1
}
```

**类类型**

```typescript
// 定义接口 IPerson1 ，里面规定了一个 fly 行为
interface IPerson1 {
    fly()
}

// 定义接口 IPerson2 ，里面规定了一个 swim 行为
interface IPerson2 {
    swim()
}

// 定义接口 IPerson3，继承了 IPerson1 和 IPerson2 接口
interface IPerson3 extends IPerson1, IPerson2 {
}

// 定义类实现接口 ， 并实现里面的方法
class Person1 implements IPerson1 {
    fly() {
        console.log('飞1')
    }
}

// 可以实现多个接口
class Person2 implements IPerson1, IPerson2 {
    fly() {
        console.log('飞2')
    }
    swim() {
        console.log('游泳2')
    }
}

// 实现接口 IPerson3，因为接口 IPerson3 继承了两个接口，因此该类也需要实现两个方法
class Person3 implements IPerson3 {
    fly() {
        console.log('飞2')
    }
    swim() {
        console.log('游泳2')
    }
}
```

### 类

**类定义基础示例**

类是为了可以更好地面向对象编程

```typescript
// 定义类，关键字 class
class Person{
    // 定义类属性 name age
    name:string
    age:number
    // 构造方法，传入参数 name age，指定默认值
    constructor(name:string='张三',age:number=18){
        this.name=name
        this.age=age
    } 
    //定义类方法
    saySomeThings(str:string){
        console.log(`${this.name}说:${str}`)
    }
}
const p:Person=new Person("李四");
p.saySomeThings('hello')   // 李四说:hello
```

**继承和多态**

- 继承关键字 `extends`

- 如果 B 继承了 A，那么 A 被称为父类/基类，B 被称为子类/派生类
- 子类实例化时，必须调用super方法；子类可以通过 `super` 关键字调用父类的属性和方法
- 多态指的是子类实例可以用父类类型进行引用

示例：

```typescript
class Student extends Person {
    teacher: string
    // 构造方法，传入参数 name age，指定默认值
    constructor(name: string = '张三', age: number = 18, teacher: string) {
        // super 调用父类方法
        super(name, age)
        this.teacher = teacher
    }
}
// 多态的体现，这里父类引用，子类实例
const stu1:Person = new Student("李四",18,"李老师")
```

**修饰符**

类属性和方法的修饰符，默认为public

- private：被修饰的属性或方法不能在类定义以外的任何地方访问（包括子类的 super 调用）
- protected：可以在子类中访问，不可以在外部访问
- public：可以在任何地方访问
- readonly：被修饰的属性，只能在构造方法或定义时进行赋值操作

> 注意：如果在构造函数的参数上使用修饰符，那么会默认存在该属性

```typescript
class TuGou{
    constructor(public name:string){
        // 这里因为构造方法参数存在修饰符，所以this可以调用到
        this.name=name
    }
}
```

**存取器（封装）**

`TypeScript` 支持通过 `getters/setters` 来截取对对象成员的访问

示例：

```typescript
class It民工{
    private firstName:string
    private lastName:string
    // 该类会多一个fullName 属性
    set fullName(value:string){
        const  =value.split('-')
        this.firstName=names[0]
        this.lastName=names[1]
    }
    get fullName () {
         return this.firstName + '-' + this.lastName
    }
}
const t1:It民工=new It民工()
t1.fullName
```

**静态属性**

使用 `static` 关键字修饰属性或方法，然后可以通过类名直接调用而不必实例化

```typescript
class Teacher{
    static kinds:string='老师'
    static say(str:string){
        console.log(`我是${str}老师`)
    }
}
console.log(Teacher.kinds) // 老师
Teacher.say('王')  // 我是王老师
```

**抽象类**

- 使用 `abstract` 关键字定义抽象类
- 抽象类做为其它派生类的基类使用， 它们不能被实例化
- 不同于接口，抽象类可以包含成员的实现细节

示例：

```typescript
/* 
  抽象类 不能创建实例对象, 只有实现类才能创建实例
  可以包含未实现的抽象方法
*/

abstract class Animal {
	// 抽象方法，子类必须实现该方法
    abstract cry()
	// 非抽象方法，子类可以直接调用
    run() {
        console.log('run()')
    }
}

class Dog extends Animal {
    cry() {
        console.log(' Dog cry()')
    }
}

const dog = new Dog()
dog.cry()
dog.run()
```

### 函数

函数是 JavaScript 应用程序的基础，它帮助你实现抽象层，模拟类，信息隐藏和模块

在 TypeScript 里，虽然已经支持类，命名空间和模块，但函数仍然是主要的定义行为的地方

TypeScript 为 JavaScript 函数添加了额外的功能，让我们可以更容易地使用

**基本示例**

```typescript
// 命名函数
function add(x, y) {
  return x + y
}

// 匿名函数
let myAdd = function(x, y) { 
  return x + y;
}
```

**函数类型**

示例

```typescript
function add(x: number, y: number): number {
  return x + y
}

let myAdd = function(x: number, y: number): number { 
  return x + y
}
```

**可选参数和默认参数**

TypeScript 里的每个函数参数都是必须的，传递给一个函数的参数个数必须与函数期望的参数个数一致

JavaScript 里，每个参数都是可选的，可传可不传。 没传参的时候，它的值就是 `undefined`。 在TypeScript 里我们可以在参数名旁使用 `?` 实现可选参数的功能

```typescript
// firstName 指定默认参数A，调用时可不传；lastName是可选参数，可不传
function buildName(firstName: string='A', lastName?: string): string {
  if (lastName) {
    return firstName + '-' + lastName
  } else {
    return firstName
  }
}

console.log(buildName('C', 'D'))
console.log(buildName('C'))
console.log(buildName())
```

**剩余参数**

在 TypeScript 里，可以把所有参数收集到一个变量里：剩余参数会被当做个数不限的可选参数。 可以一个都没有，同样也可以有任意个。 编译器创建参数数组，名字是你在省略号（ `...`）后面给定的名字，你可以在函数体内使用这个数组。 默认参数关键字：`...`

剩余参数必须在参数列表末尾

示例

```typescript
// args 为默认茶树
function info(x: string, ...args: string[]) {
  console.log(x, args)
}
info('abc', 'c', 'b', 'a')
```

**函数重载**

函数重载: 函数名相同, 而形参不同的多个函数

在JS中, 由于弱类型的特点和形参与实参可以不匹配, 是没有函数重载这一说的 但在TS中, 与其它面向对象的语言(如Java)就存在此语法

示例

```typescript
// 函数重载声明(表示add函数只支持入参同时为number或string)
function add(a:number,b:number):number
function add(a:string,b:string):string
// 函数定义
function add(a:number|string,b:number|string):number|string{
    if(typeof a==='string' && typeof b==='string'){
        return a+b
    }else if(typeof a==='number' && typeof b==='number'){
        return a+b
    }
}
```

### 泛型

**基础示例**

指在定义函数、接口或类的时候，不预先指定具体的类型，而在使用的时候再指定具体类型的一种特性

示例：

```typescript
// 根据指定的数量 count 和数据 value , 创建一个包含 count 个 value 的数组
// T 为泛型标识符，在调用该函数时传入具体类型
// 也可以将类型指定为any，这样后续会使用数组中元素时没有提示
function creatArr<T>(value:T,count:number):T[]{
    const arr:T[]=[]
    for(let i=0;i<count;i++){
        arr.push(value)
    }
    return arr
}
// 泛型为Number，该函数返回Number数组
creatArr<Number>(123,10)
```

**泛型接口**

```typescript
interface IbaseCRUD <T> {
  data: T[]
  add: (t: T) => void
  getById: (id: number) => T
}

class User {
  id?: number; //id主键自增
  name: string; //姓名
  age: number; //年龄

  constructor (name, age) {
    this.name = name
    this.age = age
  }
}

class UserCRUD implements IbaseCRUD <User> {
  data: User[] = []
  
  add(user: User): void {
    user = {...user, id: Date.now()}
    this.data.push(user)
    console.log('保存user', user.id)
  }

  getById(id: number): User {
    return this.data.find(item => item.id===id)
  }
}


const userCRUD = new UserCRUD()
userCRUD.add(new User('tom', 12))
userCRUD.add(new User('tom2', 13))
console.log(userCRUD.data)
```

**泛型类**

```typescript
class GenericNumber<T> {
  zeroValue: T
  add: (x: T, y: T) => T
}

let myGenericNumber = new GenericNumber<number>()
myGenericNumber.zeroValue = 0
myGenericNumber.add = function(x, y) {
  return x + y 
}

let myGenericString = new GenericNumber<string>()
myGenericString.zeroValue = 'abc'
myGenericString.add = function(x, y) { 
  return x + y
}

console.log(myGenericString.add(myGenericString.zeroValue, 'test'))
console.log(myGenericNumber.add(myGenericNumber.zeroValue, 12))
```

 **泛型约束**

```typescript
interface Lengthwise {
  length: number;
}

// 指定泛型约束
function fn2 <T extends Lengthwise>(x: T): void {
  console.log(x.length)
}

fn2('abc')
// fn2(123) // error  number没有length属性
```

### 其他

 **声明文件**

当使用第三方库时，我们需要引用它的声明文件，才能获得对应的代码补全、接口提示等功能

什么是声明语句

假如我们想使用第三方库 jQuery，一种常见的方式是在 html 中通过 `<script>` 标签引入 `jQuery`，然后就可以使用全局变量 `$` 或 `jQuery` 了。

但是在 ts 中，编译器并不知道 $ 或 jQuery 是什么东西

```typescript
/* 
当使用第三方库时，我们需要引用它的声明文件，才能获得对应的代码补全、接口提示等功能。
声明语句: 如果需要ts对新的语法进行检查, 需要要加载了对应的类型说明代码
  declare var jQuery: (selector: string) => any;
声明文件: 把声明语句放到一个单独的文件（jQuery.d.ts）中, ts会自动解析到项目中所有声明文件
下载声明文件: npm install @types/jquery --save-dev
*/

jQuery('#foo');
// ERROR: Cannot find name 'jQuery'.
```

这时，我们需要使用 declare var 来定义它的类型

```typescript
declare var jQuery: (selector: string) => any;
jQuery('#foo');
```

declare var 并没有真的定义一个变量，只是定义了全局变量 jQuery 的类型，仅仅会用于编译时的检查，在编译结果中会被删除。它编译结果是：

```typescript
jQuery('#foo');
```

一般声明文件都会单独写成一个 `xxx.d.ts` 文件

创建 `01_jQuery.d.ts`, 将声明语句定义其中, TS编译器会扫描并加载项目中所有的TS声明文件

```typescript
declare var jQuery: (selector: string) => any;
```

很多的第三方库都定义了对应的声明文件库, 库文件名一般为 `@types/xxx`, 可以在 `https://www.npmjs.com/package/package` 进行搜索

有的第三库在下载时就会自动下载对应的声明文件库(比如: webpack),有的可能需要单独下载(比如jQuery/react)

示例：

1. 安装jquery依赖

   ```bash
   npm install jquery
   ```

2. 安装jquery声明文件

   ```bash
   npm install @types/jquery
   ```

**内置对象**

JavaScript 中有很多内置对象，它们可以直接在 TypeScript 中当做定义好了的类型。

内置对象是指根据标准在全局作用域（Global）上存在的对象。这里的标准是指 ECMAScript 和其他环境（比如 DOM）的标准。

1. ECMAScript 的内置对象

> Boolean
> Number
> String
> Date
> RegExp
> Error

```typescript
/* 1. ECMAScript 的内置对象 */
let b: Boolean = new Boolean(1)
let n: Number = new Number(true)
let s: String = new String('abc')
let d: Date = new Date()
let r: RegExp = /^1/
let e: Error = new Error('error message')
b = true
// let bb: boolean = new Boolean(2)  // error
```

1. BOM 和 DOM 的内置对象

> Window
> Document
> HTMLElement
> DocumentFragment
> Event
> NodeList

```typescript
const div: HTMLElement = document.getElementById('test')
const divs: NodeList = document.querySelectorAll('div')
document.addEventListener('click', (event: MouseEvent) => {
  console.dir(event.target)
})
const fragment: DocumentFragment = document.createDocumentFragment()
```

