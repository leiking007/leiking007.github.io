---
title: "JavaSE基础"
date: 2020-06-09
lastmod: 2020-06-09
draft: false
tags: ['JavaSE']
categories: ["☕️Java编程"]
author: "lei"
summary: "JavaSE 是 Java 生态的基础，核心围绕「面向对象编程」展开，掌握封装、继承、多态三大特性是关键。本文从核心概念、基础语法、OOP 特性、关键字、内部类等维度进行了体系化梳理，并融入了开发规范、最佳实践和避坑指南，适合初学者夯实基础，也适合开发者作为日常参考。"
---

# Java基础

## 核心概念与环境搭建

### Java 三大版本与应用场景
| 版本       | 全称                  | 核心定位                                                                 | 典型应用场景                     |
|------------|-----------------------|--------------------------------------------------------------------------|----------------------------------|
| Java SE    | Standard Edition      | 标准版（核心基础），包含 JVM + 标准库                                    | 桌面应用、控制台程序、后端基础    |
| Java EE    | Enterprise Edition    | 企业版（基于 SE 扩展），提供 Web/数据库/消息服务等企业级 API             | 分布式系统、微服务、电商平台      |
| Java ME    | Micro Edition         | 微型版（瘦身版），针对嵌入式设备优化，仅支持简化版 JVM 和库              | 智能硬件、嵌入式设备（逐渐被替代）|

### JDK 与 JRE 核心区别
- **JDK（Java Development Kit）**：Java 开发工具包  
  ✅ 包含 JRE + 编译器（javac）、调试器（jdb）、打包工具（jar）等开发工具  
  ✅ 开发人员必备（编写、编译、调试代码）
- **JRE（Java Runtime Environment）**：Java 运行环境  
  ✅ 包含 JVM + 核心类库（rt.jar）  
  ✅ 仅用于运行已编译的 `.class` 文件（用户/服务器部署场景）

> 最佳实践：开发环境安装 JDK（推荐 JDK 11/17 LTS 版本），生产环境可仅安装 JRE 减少资源占用

### 环境变量配置
核心配置项

```bash
# 1. 配置 JAVA_HOME（指向 JDK 安装根目录）
JAVA_HOME=/usr/local/jdk-17.0.9  # Linux
JAVA_HOME=C:\Program Files\Java\jdk-17.0.9  # Windows

# 2. 配置 PATH（添加 JDK 二进制目录）
PATH=$JAVA_HOME/bin:$PATH  # Linux
PATH=%JAVA_HOME%\bin;%PATH%  # Windows

# 3. 验证配置（命令行执行）
java -version  # 输出版本信息即成功
javac -version
```

常见问题排查

- 报错 "javac 不是内部或外部命令"：检查 PATH 是否正确添加 `%JAVA_HOME%\bin`
- 版本不匹配：确认 JAVA_HOME 指向的 JDK 版本与预期一致
- Linux 权限问题：给 JDK 目录添加执行权限 `chmod +x $JAVA_HOME/bin/*`

### Hello World 入门
```java
/**
 *  Java 入门示例（遵循 Google Java 规范）
 *  类名使用 PascalCase 命名法，文件名与公共类名一致
 */
public class HelloWorld {
    // 程序入口：main 方法固定格式（public static void 不可修改）
    public static void main(String[] args) {
        // 标准输出：使用 println 自动换行（推荐），print 不换行
        System.out.println("Hello, Java SE!");
    }
}
```

编译与运行流程

```bash
# 1. 编译：javac + 文件名（带 .java 后缀）
javac HelloWorld.java  # 生成 HelloWorld.class 字节码文件

# 2. 运行：java + 类名（不带 .class 后缀）
java HelloWorld  # 输出：Hello, Java SE!
```

核心原理

```ascii
┌──────────────────┐    编译（javac）    ┌──────────────────┐    运行（java）    ┌──────────────────┐
│  HelloWorld.java  │  ────────────────>  │  HelloWorld.class  │  ───────────────>  │  JVM 执行字节码  │
│  （源码：文本文件） │                    │  （字节码：二进制） │                    │  （跨平台核心）  │
└──────────────────┘                    └──────────────────┘                    └──────────────────┘
```

## Java 基础语法
### 数据类型（4大类8小类）
**基础数据类型**

| 类型       | 占用字节 | 取值范围                     | 默认值  | 核心注意事项                                  |
|------------|----------|------------------------------|---------|-----------------------------------------------|
| byte       | 1        | -128 ~ 127                   | 0       | 适合存储小范围整数（如状态码），避免内存浪费   |
| short      | 2        | -32768 ~ 32767               | 0       | 较少直接使用，多作为中间类型转换               |
| int        | 4        | -2¹⁴⁷⁴⁸³⁶⁴⁸ ~ 2¹⁴⁷⁴⁸³⁶⁴⁷    | 0       | 整数默认类型（推荐优先使用）                  |
| long       | 8        | -9²³³³⁷²⁰³⁶⁸⁵⁴⁷⁷⁵⁸⁰⁸ ~ ...   | 0L      | 赋值需加后缀 L（如 100L），避免溢出            |
| float      | 4        | 单精度浮点型（精度约 6-7 位） | 0.0f    | 赋值需加后缀 f（如 3.14f），适合不需要高精度场景 |
| double     | 8        | 双精度浮点型（精度约 15-17 位）| 0.0d    | 浮点默认类型（推荐优先使用）                  |
| boolean    | 1        | true / false                 | false   | 不可用 0/1 替代，仅表示布尔逻辑               |
| char       | 2        | 0 ~ 65535（Unicode 字符）    | '\u0000'| 可存储中文（如 '中'），需用单引号包裹          |

**引用数据类型**

- 包括：类（Class）、接口（Interface）、数组（Array）、枚举（Enum）等
- 默认值：`null`（表示未引用任何对象）
- 核心注意：`null` 引用调用方法/属性会抛出 `NullPointerException`（NPE）

### 类型转换（6大核心规则）
**自动类型转换（隐式转换）**

- 规则：小范围类型 → 大范围类型（无精度损失）
- 顺序：`byte < short(char) < int < long < float < double`
- 示例：
  ```java
  int num = 100;
  long bigNum = num;  // 自动转换（int → long）
  double d = 3.14f;  // 自动转换（float → double）
  ```

**强制类型转换（显式转换）**

- 规则：大范围类型 → 小范围类型（可能损失精度，需手动添加转换符）
- 语法：`目标类型 变量名 = (目标类型) 源变量;`
- 示例（合法/非法场景）：
  ```java
  long bigNum = 200L;
  int num = (int) bigNum;  // 合法（200 在 int 范围内）
  
  double d = 3.14;
  int num2 = (int) d;  // 合法但精度损失（结果为 3）
  
  long overflowNum = 2147483648L;  // 超出 int 最大值
  int num3 = (int) overflowNum;  // 非法（溢出，结果为负数）
  ```

**避坑指南**

1. 整数常量直接赋值给 `byte/short/char` 时，若值在取值范围内可自动转换：
   ```java
   byte b = 127;  // 合法（127 在 byte 范围内）
   byte b2 = 128; // 编译报错（超出范围）
   ```
2. `byte/short/char` 混合运算时，先自动转换为 `int`：
   ```java
   byte a = 10;
   short b = 20;
   int c = a + b;  // 结果为 int 类型
   ```
3. 浮点数转整数时，直接舍弃小数部分（非四舍五入）：
   ```java
   double d = 3.99;
   int num = (int) d;  // 结果为 3（不是 4）
   ```

### 运算符
**核心运算符分类**

| 类别         | 运算符                                  | 核心注意事项                                  |
|--------------|-----------------------------------------|-----------------------------------------------|
| 算术运算符   | +、-、*、/、%、++、--                   | 1. 整数除法会舍弃小数（如 5/2=2）；2. ++i 先自增后使用，i++ 先使用后自增 |
| 关系运算符   | >、>=、<、<=、==、!=                    | 1. 比较对象地址用 ==，比较内容用 equals()；2. 浮点数避免用 == 比较（精度问题） |
| 逻辑运算符   | &、\|、!、&&、\|\|                      | 1. && 短路与（左为 false 则右不执行）；2. \|\| 短路或（左为 true 则右不执行） |
| 赋值运算符   | =、+=、-=、*=、/=、%=                   | 扩展赋值运算符自动类型转换（如 byte b=1; b+=2; 不会报错） |
| 条件运算符   | 布尔表达式 ? 表达式1 : 表达式2          | 结果必须被使用（赋值/打印），否则编译报错      |
| 字符串连接符 | +（一方为字符串则触发拼接）             | 从左到右执行（如 "a"+1+2 → "a12"，1+2+"a" → "3a"） |

**最佳实践示例**

```java
// 1. 浮点数比较（使用误差范围）
double a = 0.1 + 0.2;
double b = 0.3;
boolean isEqual = Math.abs(a - b) < 1e-6;  // 推荐（误差小于 10^-6 则认为相等）

// 2. 字符串拼接（大量拼接用 StringBuilder，避免 String 低效）
StringBuilder sb = new StringBuilder();
sb.append("Hello").append(" ").append("Java");
String result = sb.toString();  // 高效拼接

// 3. 条件运算符简化判断
int score = 85;
String grade = score >= 60 ? "及格" : "不及格";  // 简洁替代 if-else
```

### 控制语句
**条件语句（if-else/switch）**

if-else 规范

- 单条语句也建议保留 `{}`（避免后续扩展出错）
- 多条件判断优先使用 `else if`，避免嵌套过深
- 示例：
  ```java
  int age = 25;
  if (age < 0 || age > 150) {
      System.out.println("年龄非法");
  } else if (age <= 18) {
      System.out.println("未成年人");
  } else if (age <= 60) {
      System.out.println("成年人");
  } else {
      System.out.println("老年人");
  }
  ```

**switch 规范**

- 支持类型：`int`、`String`、`enum`（JDK 7+ 支持 String）
- 推荐使用 `break` 避免穿透（如需穿透需加注释）
- JDK 14+ 支持 `yield` 返回值（替代 break + 赋值）
- 示例（增强版 switch）：
  ```java
  String grade = "A";
  int score = switch (grade) {
      case "A" -> 90;
      case "B" -> 80;
      case "C" -> 70;
      default -> {
          System.out.println("无效等级");
          yield 0;  // 返回默认值
      }
  };
  System.out.println(score);  // 输出 90
  ```

**循环语句（for/while/do-while）**

for 循环（推荐用于已知循环次数）

- 规范：循环变量声明在循环体内（避免污染外部作用域）
- 示例：
  ```java
  // 普通 for 循环
  for (int i = 0; i < 10; i++) {
      System.out.println("循环次数：" + (i + 1));
  }
  
  // 增强 for 循环（遍历数组/集合，JDK 5+）
  int[] arr = {1, 2, 3, 4, 5};
  for (int num : arr) {
      System.out.println(num);  // 依次输出 1-5
  }
  ```

while 循环（推荐用于未知循环次数）

- 规则：先判断条件，条件成立才执行循环体
- 示例：
  ```java
  int count = 0;
  while (count < 5) {
      System.out.println("count：" + count);
      count++;
  }
  ```

do-while 循环（最少执行一次）

- 规则：先执行循环体，再判断条件
- 示例：
  ```java
  int num = 0;
  do {
      System.out.println("num：" + num);
      num++;
  } while (num < 3);  // 输出 0、1、2（执行 3 次）
  ```

**转向语句（break/continue/return）**

- **break**：跳出当前循环/switch（可配合标签跳出多层循环）
  ```java
  // 跳出多层循环（标签用法）
  outer: for (int i = 0; i < 3; i++) {
      inner: for (int j = 0; j < 3; j++) {
          if (j == 1) {
              break outer;  // 跳出 outer 循环
          }
          System.out.println(i + "," + j);
      }
  }
  ```
- **continue**：跳过当前循环次，进入下一次循环
- **return**：终止当前方法（带返回值时需指定返回值）

## 面向对象编程（OOP 三大特性）
### 封装（Encapsulation）
**核心思想**

- 隐藏对象内部细节，仅通过公共接口（getter/setter）暴露对外访问
- 目的：保证数据安全性（防止非法赋值）、简化使用（屏蔽复杂逻辑）

**封装步骤（规范实现）**

1. 属性私有化（`private` 修饰，仅本类可访问）
2. 提供公共 getter 方法（获取属性值）和 setter 方法（设置属性值）
3. 在 setter 方法中添加数据校验逻辑
4. 示例：
  ```java
  /**
   * 人员类（遵循封装规范）
   */
  public class Person {
      // 1. 属性私有化
      private String name;  // 姓名
      private int age;      // 年龄

      // 2. getter 方法（获取属性值）
      public String getName() {
          return name;
      }

      // 3. setter 方法（设置属性值，添加校验）
      public void setName(String name) {
          // 校验：姓名不能为空
          if (name == null || name.trim().isEmpty()) {
              throw new IllegalArgumentException("姓名不能为空");
          }
          this.name = name;
      }

      public int getAge() {
          return age;
      }

      public void setAge(int age) {
          // 校验：年龄必须在 0-150 之间
          if (age < 0 || age > 150) {
              throw new IllegalArgumentException("年龄必须在 0-150 之间");
          }
          this.age = age;
      }
  }
  ```

**调用示例（安全访问）**

```java
Person person = new Person();
person.setName("张三");  // 合法赋值
person.setAge(25);      // 合法赋值

// person.setAge(200);  // 抛出异常（年龄非法）
// person.setName("");  // 抛出异常（姓名为空）

System.out.println(person.getName() + "，" + person.getAge() + "岁");
```

### 继承（Inheritance）
**核心思想**

- 子类（Subclass）继承父类（Superclass）的属性和方法（除 `private` 修饰）
- 目的：代码复用、建立类之间的层级关系（如 "Cat is a Animal"）
- 关键字：`extends`（Java 仅支持单继承，一个子类只能有一个直接父类）

**继承核心规则**

1. **可继承的成员**：
   - 父类的 `public`、`protected`、默认访问权限（同包）的属性和方法
   - 构造方法不可继承，但子类可通过 `super()` 调用父类构造方法
2. **默认继承**：所有类默认继承 `java.lang.Object`（Java 根类），拥有 `toString()`、`equals()` 等基础方法
3. **继承传递性**：若 C 继承 B，B 继承 A，则 C 间接继承 A 的所有可继承成员

**构造方法的继承规则**

- 子类构造方法执行时，会先调用父类的构造方法（默认调用无参构造）
- 若父类无无参构造，子类必须通过 `super(参数)` 显式调用父类有参构造（且必须在子类构造方法第一行）
- 示例：
  ```java
  // 父类
  public class Animal {
      private String name;
  
      // 父类有参构造（无无参构造）
      public Animal(String name) {
          this.name = name;
      }
  
      // getter/setter
      public String getName() {
          return name;
      }
  }
  
  // 子类
  public class Cat extends Animal {
      // 子类构造方法必须显式调用父类有参构造
      public Cat(String name) {
          super(name);  // 调用父类构造方法（必须在第一行）
      }
  }
  
  // 调用示例
  public class Test {
      public static void main(String[] args) {
          Cat cat = new Cat("小白");
          System.out.println(cat.getName());  // 输出：小白
      }
  }
  ```

**方法重写**

- **核心场景**：子类继承的父类方法无法满足需求时，重新实现该方法
- **重写规则（五大黄金法则）**：
  1. 方法名、参数列表、返回值类型必须与父类完全一致（返回值为引用类型时，可子类化，如父类返回 `Animal`，子类可返回 `Cat`）
  2. 访问权限不能低于父类（如父类为 `public`，子类不能为 `protected`）
  3. 不能抛出比父类更多的异常（可抛出更少或子类异常）
  4. 静态方法不能重写（静态方法属于类，不属于对象）
  5. `final` 方法不能重写（`final` 修饰的方法不可修改）
- 示例：
  ```java
  // 父类
  public class Animal {
      public void move() {
          System.out.println("动物在移动");
      }
  }
  
  // 子类重写 move 方法
  public class Bird extends Animal {
      @Override  // 注解：标记方法重写（编译器校验合法性）
      public void move() {
          System.out.println("鸟儿在飞翔");  // 子类特有实现
      }
  }
  
  // 调用示例
  public class Test {
      public static void main(String[] args) {
          Animal bird = new Bird();
          bird.move();  // 输出：鸟儿在飞翔（执行子类重写后的方法）
      }
  }
  ```

### 多态（Polymorphism）
**核心思想**

- 同一行为在不同对象上表现出不同的形态（如 "move" 行为：鸟飞、鱼游、狗跑）
- 实现条件：
  1. 存在继承关系（子类继承父类）
  2. 子类重写父类方法
  3. 父类引用指向子类对象（向上转型）

**多态的两种核心表现**

1. **向上转型（自动转换）**：父类引用指向子类对象
   - 语法：`父类类型 引用名 = new 子类类型();`
   - 特点：只能调用父类中定义的方法（包括子类重写的方法），不能调用子类特有方法
   - 示例：
     ```java
     Animal cat = new Cat();  // 向上转型（父类引用指向子类对象）
     cat.move();  // 执行子类重写的 move 方法
     // cat.catchMouse();  // 编译报错（父类无该方法，无法调用子类特有方法）
     ```

2. **向下转型（强制转换）**：将父类引用转换为子类类型
   - 场景：需要调用子类特有方法时
   - 语法：`子类类型 引用名 = (子类类型) 父类引用;`
   - 风险：若父类引用实际指向的对象不是该子类类型，会抛出 `ClassCastException`（类型转换异常）
   - 解决方案：先通过 `instanceof` 判断类型，再转型
   - 示例：
     ```java
     Animal animal = new Cat();
     
     // 安全向下转型
     if (animal instanceof Cat) {
         Cat cat = (Cat) animal;  // 强制转换
         cat.catchMouse();  // 调用子类特有方法
     }
     
     // 若 animal 指向 Dog 对象，instanceof 判断为 false，避免转型异常
     ```

**多态的核心价值（OCP 原则）**

- **OCP 原则**：对扩展开放，对修改关闭（软件开发七大原则之一）
- 核心价值：降低代码耦合度，提高扩展性（新增子类无需修改原有代码）
- 示例（多态在实际开发中的应用）：
  ```java
  // 抽象父类（或接口）
  public abstract class Shape {
      public abstract void draw();  // 抽象方法（无实现）
  }
  
  // 子类1：圆形
  public class Circle extends Shape {
      @Override
      public void draw() {
          System.out.println("绘制圆形");
      }
  }
  
  // 子类2：矩形
  public class Rectangle extends Shape {
      @Override
      public void draw() {
          System.out.println("绘制矩形");
      }
  }
  
  // 工具类（无需修改，支持所有 Shape 子类）
  public class DrawTool {
      // 父类引用作为参数（多态核心）
      public static void drawShape(Shape shape) {
          shape.draw();  // 执行子类具体实现
      }
  }
  
  // 调用示例
  public class Test {
      public static void main(String[] args) {
          DrawTool.drawShape(new Circle());    // 输出：绘制圆形
          DrawTool.drawShape(new Rectangle()); // 输出：绘制矩形
          // 新增三角形子类时，无需修改 DrawTool 代码，直接调用即可
      }
  }
  ```

## 核心关键字
### this 关键字
**核心作用**

- 指代当前对象（当前正在执行方法的对象）
- 只能在实例方法/构造方法中使用（不能在静态方法中使用，静态方法属于类，无对象）

**常见用法**

1. **区分成员变量和局部变量**（当变量名重名时）：
   ```java
   public class Person {
       private String name;
   
       public void setName(String name) {
           this.name = name;  // this.name 指代成员变量，name 指代局部变量
       }
   }
   ```

2. **调用当前类的其他构造方法**：
   
   - 语法：`this(参数列表);`（必须在构造方法第一行）
   - 目的：代码复用（避免构造方法中重复逻辑）
   - 示例：
     ```java
     public class Person {
         private String name;
         private int age;
     
         // 无参构造
         public Person() {
             this("未知", 0);  // 调用有参构造
         }
     
         // 有参构造
         public Person(String name, int age) {
             this.name = name;
             this.age = age;
         }
     }
     ```
   
3. **返回当前对象**（链式调用）：
   ```java
   public class Person {
       private String name;
   
       public Person setName(String name) {
           this.name = name;
           return this;  // 返回当前对象
       }
   
       // 链式调用示例
       public static void main(String[] args) {
           Person person = new Person().setName("张三");
       }
   }
   ```

### super 关键字
**核心作用**

- 指代父类对象（访问父类的成员变量、方法、构造方法）
- 只能在实例方法/构造方法中使用（不能在静态方法中使用）

**常见用法**

1. **访问父类的成员变量/方法**（当子类与父类成员重名时）：
   ```java
   public class Animal {
       protected String name = "动物";
   
       public void eat() {
           System.out.println("动物在进食");
       }
   }
   
   public class Cat extends Animal {
       private String name = "猫咪";
   
       @Override
       public void eat() {
           super.eat();  // 调用父类的 eat 方法
           System.out.println(super.name + "的子类" + this.name + "在吃鱼");
       }
   }
   
   // 调用示例
   public class Test {
       public static void main(String[] args) {
           Cat cat = new Cat();
           cat.eat(); 
           // 输出：
           // 动物在进食
           // 动物的子类猫咪在吃鱼
       }
   }
   ```

2. **调用父类的构造方法**：
   - 语法：`super(参数列表);`（必须在子类构造方法第一行）
   - 注意：`this()` 和 `super()` 不能同时出现（都要求在第一行）
   - 示例：参考 3.2 继承中的构造方法示例

### static 关键字
**核心作用**

- 修饰的成员（变量/方法/代码块）属于**类级别的**（不属于对象，所有对象共享）
- 生命周期：类加载时初始化，类卸载时销毁（早于对象创建）

**常见用法**

1. **静态变量（类变量）**：
   - 语法：`public static 数据类型 变量名;`
   - 访问方式：`类名.变量名`（推荐）或 `对象名.变量名`（不推荐）
   - 场景：存储所有对象共享的数据（如常量、统计信息）
   - 示例：
     ```java
     public class Student {
         // 静态变量（所有学生共享学校名称）
         public static String SCHOOL_NAME = "北京大学";
         private String name;
     
         // 构造方法
         public Student(String name) {
             this.name = name;
         }
     }
     
     // 调用示例
     public class Test {
         public static void main(String[] args) {
             Student s1 = new Student("张三");
             Student s2 = new Student("李四");
     
             System.out.println(s1.SCHOOL_NAME);  // 输出：北京大学
             System.out.println(s2.SCHOOL_NAME);  // 输出：北京大学
             System.out.println(Student.SCHOOL_NAME);  // 推荐用法
     
             // 修改静态变量（所有对象共享修改结果）
             Student.SCHOOL_NAME = "清华大学";
             System.out.println(s1.SCHOOL_NAME);  // 输出：清华大学
         }
     }
     ```

2. **静态方法（类方法）**：
   - 语法：`public static 返回值类型 方法名(参数列表) { }`
   - 访问方式：`类名.方法名()`（推荐）或 `对象名.方法名()`（不推荐）
   - 限制：
     - 不能访问实例变量和实例方法（只能访问静态变量和静态方法）
     - 不能使用 `this` 和 `super` 关键字
   - 场景：工具类方法（如 `Math.random()`、`Arrays.sort()`）
   - 示例：
     ```java
     public class MathUtil {
         // 静态工具方法（计算两数之和）
         public static int add(int a, int b) {
             return a + b;
         }
     }
     
     // 调用示例
     public class Test {
         public static void main(String[] args) {
             int result = MathUtil.add(10, 20);  // 直接通过类名调用
             System.out.println(result);  // 输出：30
         }
     }
     ```

3. **静态代码块**：
   - 语法：`static { 代码逻辑 }`
   - 执行时机：类加载时执行（仅执行一次，早于构造方法）
   - 场景：初始化静态变量、加载资源（如配置文件）
   - 示例：
     ```java
     public class StaticDemo {
         // 静态变量
         public static String CONFIG;
     
         // 静态代码块（初始化静态变量）
         static {
             System.out.println("静态代码块执行");
             CONFIG = "加载配置文件成功";
         }
     
         // 构造方法
         public StaticDemo() {
             System.out.println("构造方法执行");
         }
     }
     
     // 调用示例
     public class Test {
         public static void main(String[] args) {
             StaticDemo demo1 = new StaticDemo();
             StaticDemo demo2 = new StaticDemo();
             // 输出：
             // 静态代码块执行（仅执行一次）
             // 构造方法执行
             // 构造方法执行
             System.out.println(StaticDemo.CONFIG);  // 输出：加载配置文件成功
         }
     }
     ```

### final 关键字
**核心作用**

- 修饰变量：变量值不可修改（常量）
- 修饰方法：方法不可重写
- 修饰类：类不可继承

**常见用法**

1. **修饰变量（常量）**：
   - 局部变量：声明时可不赋值，但使用前必须赋值（且赋值后不可修改）
   - 成员变量：声明时必须赋值（或在构造方法中赋值），不可修改
   - 推荐命名规范：常量名全大写，多个单词用下划线分隔（如 `MAX_AGE`）
   - 示例：
     ```java
     public class FinalDemo {
         // 成员常量（声明时赋值）
         public static final int MAX_AGE = 150;
         private final String NAME;
     
         // 构造方法中给成员常量赋值
         public FinalDemo(String name) {
             this.NAME = name;  // 仅可赋值一次
         }
     
         public static void main(String[] args) {
             // 局部常量
             final int MIN_AGE = 0;
             // MIN_AGE = 1;  // 编译报错（不可修改）
     
             FinalDemo demo = new FinalDemo("张三");
             // demo.NAME = "李四";  // 编译报错（不可修改）
         }
     }
     ```

2. **修饰方法（不可重写）**：
   ```java
   public class Father {
       // final 方法不可被子类重写
       public final void sayHello() {
           System.out.println("Hello");
       }
   }
   
   public class Son extends Father {
       // @Override
       // public void sayHello() { }  // 编译报错（无法重写 final 方法）
   }
   ```

3. **修饰类（不可继承）**：
   ```java
   // final 类不可被继承
   public final class String {
       // ...
   }
   
   // public class MyString extends String { }  // 编译报错（无法继承 final 类）
   ```

## 内部类（四种类型+应用场景）
### 成员内部类
#### 定义与特点
- 定义在类的内部，无 `static` 修饰
- 属于外部类的**实例成员**（需通过外部类对象创建内部类对象）
- 可访问外部类的所有成员（包括 `private` 修饰的成员）
- 外部类访问内部类成员需通过内部类对象

#### 语法与示例
```java
// 外部类
public class Outer {
    private String outerName = "外部类";

    // 成员内部类
    public class Inner {
        private String innerName = "内部类";

        // 内部类方法（可访问外部类成员）
        public void show() {
            System.out.println(outerName);  // 访问外部类私有成员
            System.out.println(innerName);
        }
    }

    // 外部类方法（访问内部类成员需创建内部类对象）
    public void callInner() {
        Inner inner = new Inner();
        inner.show();
    }

    // 调用示例
    public static void main(String[] args) {
        // 方式1：通过外部类对象创建内部类对象
        Outer outer = new Outer();
        Outer.Inner inner = outer.new Inner();
        inner.show();

        // 方式2：外部类方法间接调用
        outer.callInner();
    }
}
```

### 静态内部类
#### 定义与特点
- 定义在类的内部，有 `static` 修饰
- 属于外部类的**类成员**（无需外部类对象，直接通过外部类名创建）
- 只能访问外部类的静态成员（不能访问实例成员）
- 外部类访问内部类成员：直接通过 `内部类名.成员`（静态成员）或创建内部类对象（实例成员）

#### 语法与示例
```java
// 外部类
public class Outer {
    private static String outerStaticName = "外部类静态变量";
    private String outerInstanceName = "外部类实例变量";

    // 静态内部类
    public static class StaticInner {
        private String innerName = "静态内部类";

        public void show() {
            System.out.println(outerStaticName);  // 可访问外部类静态成员
            // System.out.println(outerInstanceName);  // 编译报错（不能访问实例成员）
            System.out.println(innerName);
        }
    }

    // 调用示例
    public static void main(String[] args) {
        // 直接通过外部类名创建静态内部类对象（无需外部类对象）
        Outer.StaticInner inner = new Outer.StaticInner();
        inner.show();
    }
}
```

### 局部内部类
#### 定义与特点
- 定义在方法/代码块内部（无 `static` 修饰）
- 作用域仅限于当前方法/代码块（外部无法访问）
- 可访问外部类的所有成员，以及方法中的 `final` 局部变量（JDK 8+ 可省略 `final`，但变量仍为隐式常量）
- 编译后类名：`外部类名$数字内部类名.class`（如 `Outer$1LocalInner.class`）

#### 语法与示例
```java
// 外部类
public class Outer {
    private String outerName = "外部类";

    public void method() {
        // 方法中的局部变量（JDK 8+ 隐式 final）
        String localVar = "局部变量";

        // 局部内部类（定义在方法内部）
        class LocalInner {
            public void show() {
                System.out.println(outerName);  // 访问外部类成员
                System.out.println(localVar);   // 访问方法局部变量（隐式 final）
            }
        }

        // 只能在当前方法中创建内部类对象并调用
        LocalInner inner = new LocalInner();
        inner.show();
    }

    // 调用示例
    public static void main(String[] args) {
        Outer outer = new Outer();
        outer.method();
        // 输出：
        // 外部类
        // 局部变量
    }
}
```

### 匿名内部类
#### 定义与特点
- 无类名的局部内部类（简化局部内部类的写法）
- 必须继承一个父类或实现一个接口（只能继承一个类或实现一个接口）
- 作用域仅限于当前方法/代码块（外部无法访问）
- 编译后类名：`外部类名$数字.class`（如 `Outer$1.class`）
- 核心场景：简化单次使用的类（如回调接口、线程创建）

#### 语法与示例
```java
// 接口（匿名内部类实现该接口）
public interface Greeting {
    void sayHello();
}

// 外部类
public class Outer {
    public void callGreeting() {
        // 匿名内部类（实现 Greeting 接口）
        Greeting greeting = new Greeting() {
            @Override
            public void sayHello() {
                System.out.println("Hello, 匿名内部类！");
            }
        };

        greeting.sayHello();  // 调用匿名内部类的方法
    }

    // 简化写法（直接作为方法参数）
    public void callGreeting2(Greeting greeting) {
        greeting.sayHello();
    }

    // 调用示例
    public static void main(String[] args) {
        Outer outer = new Outer();
        outer.callGreeting();  // 输出：Hello, 匿名内部类！

        // 匿名内部类作为方法参数（常用场景）
        outer.callGreeting2(new Greeting() {
            @Override
            public void sayHello() {
                System.out.println("匿名内部类作为参数！");
            }
        });  // 输出：匿名内部类作为参数！
    }
}
```

#### Lambda 表达式替代（JDK 8+）
- 匿名内部类实现函数式接口（仅一个抽象方法的接口）时，可简化为 Lambda 表达式
- 示例：
  ```java
  // Lambda 表达式替代匿名内部类（实现 Greeting 接口）
  Greeting greeting = () -> System.out.println("Lambda 替代匿名内部类！");
  greeting.sayHello();  // 输出：Lambda 替代匿名内部类！
  
  // 作为方法参数
  outer.callGreeting2(() -> System.out.println("Lambda 作为参数！"));
  ```

## 常见问题与避坑指南
### 语法层面
1. **变量命名规范**：
   - 实例变量/局部变量：驼峰命名（首字母小写，如 `userName`）
   - 静态常量：全大写+下划线（如 `MAX_RETRY_COUNT`）
   - 类名：帕斯卡命名（首字母大写，如 `UserService`）
   - 方法名：驼峰命名（首字母小写，如 `getUserInfo()`）

2. **空指针异常（NPE）**：
   - 常见场景：`null` 引用调用方法/属性、数组为 `null` 时访问索引
   - 避坑方案：
     - 调用方法前先判断非空（`if (obj != null) { obj.method(); }`）
     - 使用 `Objects.requireNonNull(obj, "对象不能为空")` 校验参数
     - JDK 8+ 用 `Optional` 类处理可能为 `null` 的值

3. **数组越界异常（ArrayIndexOutOfBoundsException）**：
   - 避坑方案：访问数组前先判断索引范围（`if (index >= 0 && index < array.length) { ... }`）

### 面向对象层面
1. **equals() 与 == 的区别**：
   - `==`：比较基本数据类型的值，比较引用数据类型的地址
   - `equals()`：默认继承自 `Object`，比较地址；子类可重写（如 `String` 重写后比较内容）
   - 示例：
     ```java
     String s1 = new String("abc");
     String s2 = new String("abc");
     System.out.println(s1 == s2);  // 输出：false（地址不同）
     System.out.println(s1.equals(s2));  // 输出：true（内容相同）
     ```

2. **toString() 方法的作用**：
   - 默认继承自 `Object`，返回 `类名@哈希码`（如 `com.example.Person@1b6d3586`）
   - 推荐重写：返回对象的属性信息（便于调试）
   - 示例：
     ```java
     public class Person {
         private String name;
         private int age;
     
         @Override
         public String toString() {
             return "Person{name='" + name + "', age=" + age + "}";
         }
     }
     
     // 调用
     Person person = new Person("张三", 25);
     System.out.println(person);  // 输出：Person{name='张三', age=25}
     ```

### 性能层面
1. **字符串拼接**：
   - 避免使用 `String +=` 进行大量拼接（每次拼接创建新对象，效率低）
   - 推荐使用 `StringBuilder`（单线程）或 `StringBuffer`（多线程）
   - 示例：
     ```java
     // 低效写法
     String str = "";
     for (int i = 0; i < 1000; i++) {
         str += i;  // 每次创建新 String 对象
     }
     
     // 高效写法
     StringBuilder sb = new StringBuilder();
     for (int i = 0; i < 1000; i++) {
         sb.append(i);  // 仅操作一个对象
     }
     String result = sb.toString();
     ```

2. **静态方法与实例方法的选择**：
   - 无状态的工具方法（如数学计算、字符串处理）推荐用静态方法（无需创建对象，效率高）
   - 依赖对象状态的方法用实例方法
