---
title: "Rust"
date: 2026-01-03
lastmod: 2026-01-03
draft: false
tags: ['Rust']
categories: ["⚙️Rust编程"]
author: "lei"
---

# Rust

## 入门

### 简介

Rust 最早是 Mozilla 雇员 Graydon Hoare 的个人项目。从 2009 年开始，得到了 Mozilla 研究院的资助，2010 年项目对外公布，2010 ～ 2011 年间实现自举。自此以后，Rust 在部分重构 -> 崩溃的边缘反复横跳（历程极其艰辛），终于，在 2015 年 5 月 15 日发布 1.0 版

 rust 无 GC、效率高、工程性强、强安全性

### 安装

1. 先安装 [Microsoft C++ Build Tools](https://visualstudio.microsoft.com/zh-hans/visual-cpp-build-tools/)，勾选安装 C++ 环境即可

   ![image-20260103015941971](./assets/image-20260103015941971.png)

2. 在 [RUSTUP-INIT](https://www.rust-lang.org/learn/get-started) 下载系统相对应的 Rust 安装程序，直接默认安装

3. 检查安装结果

   ```bash
   # 查看rust编译器版本
   $ rustc -V
   
   # 查看cargo版本
   $ cargo -V
   ```

4. 更新和卸载

   ```bash
   # 更新
   $ rustup update
   
   # 卸载
   $ rustup self uninstall
   ```

### cargo

cargo 包管理工具，提供了一系列的工具，从项目的建立、构建到测试、运行直至部署，为 Rust 项目的管理提供尽可能完整的手段

常用命令

```bash
# 新建项目
$ cargo new xxxx


# 运行项目
$ cargo run 

# 编译项目
$ cargo build

# 编译和运行
# 默认都是debug模式，编译速度会很快，但是运行速度就慢了，debug模式下Rust编译器不会做任何优化
# 使用参数 --release 可以构建高性能程序
# cargo run --release
# cargo build --release


# 项目大了后，cargo run 和 cargo build 不可避免的会变慢
# cargo check 快速检查代码是否能编译通过
$ cargo check
```

Cargo.toml和Cargo.lock

`Cargo.toml` 和 `Cargo.lock` 是 `cargo` 的核心文件

- `Cargo.toml` 是 `cargo` 特有的**项目数据描述文件**。它存储了项目的所有元配置信息
- `Cargo.lock` 文件是 `cargo` 工具根据同一项目的 `toml` 文件生成的**项目依赖详细清单**。一般不需要手动更改

**Cargo.toml**

package 配置

```toml
[package]
name = "hellow_world"
version = "0.1.0"
edition = "2024"

# name 字段定义了项目名称，version 字段定义当前版本，新项目默认是 0.1.0，edition 字段定义了我们使用的 Rust 大版本
```

定义项目依赖

- 基于 Rust 官方仓库 `crates.io`，通过版本说明来描述
- 基于项目源代码的 git 仓库地址，通过 URL 来描述
- 基于本地项目的绝对路径或者相对路径，通过类 Unix 模式的路径来描述

```toml
[dependencies]
rand = "0.3"
hammer = { version = "0.5.0"}
color = { git = "https://github.com/bjz/color-rs" }
geometry = { path = "crates/geometry" }
```

### hellow world

1. 新建项目

   ```bash
   $ cargo new hellow_world
   ```

2. 查看目录结构

   ```bash
   $ tree /f /a
   .
   |   .gitignore
   |   Cargo.lock
   |   Cargo.toml
   |
   \---src
           main.rs
   ```


## 基础

### 简单的示例

```rust
// Rust 程序入口函数，和其他语言一样，都是main，该函数无返回值
fn main() {
    // 使用 let 来声明变量，进行绑定，a 是不可变的
    // 这里未指定 a 的类型，编译器会默认根据 a 的值推断类型为：i32（有符号32位整数）
    // 语句的末尾必须以分好结尾
    let a=10;

    // 主动指定类型为 i32
    let b:i32=20;

    // 可以在数值中带上类型:30i32表示数值是30，类型是i32
    // c是可变的，mut是mutable的缩写
    let mut c=30i32;

    // 还能在数值和类型中间添加一个下划线，让可读性更好
    let d=30_i32;

    // 跟其它语言一样，可以使用一个函数的返回值来作为另一个函数的参数
    let e=add(add(a,b), add(c, d));

    // println!是宏调用，它返回的是宏定义的代码块
    // 该函数将指定的格式化字符串输出到标准输出中(控制台)
    // {}是占位符，在具体执行过程中，会把e的值代入进来
    println!("(a + b) + (c + d) = {}",e)
}

// 定义一个函数，输入两个i32类型的32位有符号整数，返回它们的和
fn add(a:i32,b:i32)->i32{
    // 返回相加值，这里可以省略return
    a+b
}
```

### 变量绑定与解构

Rust 变量在默认情况下是不可变的，可以通过`mut`关键字声明可变变量；

不可变变量一旦绑定值就不能修改，除非使用使用`mut`关键字修饰，如下：

```rust
fn main() {
    let x=6;
    println!("x的值为：{x}");
    // x=7;  // cannot mutate immutable variable 'x'；修改未使用mut修饰变量，出错
	
    let mut y = 6;
    println!("y的值为：{y}");
    y=7;  // warning: value assigned to `y` is never read；未使用的变量会有警告
}

```

------

使用下划线开头忽略未使用变量，如下：

```rust
fn main() {
    let x=6;  // warning: unused variable: `x`
    let _y=6;
}
```

------

let 关键字除了变量绑定，还可以进行复杂变量解构，如下：

```rust
fn main() {
    let (a,b) = (1,2);  // a=1,b=2
    // _ 代表匹配一个值
    let [c,..,d,_]=[1,2,3,4,5];  // c=1,d=4
}
```

------

常量：

- 常量不允许使用 `mut`。**常量不仅仅默认不可变，而且自始至终不可变**，因为常量在编译完成后，已经确定它的值。
- 常量使用 `const` 关键字而不是 `let` 关键字来声明，并且值的类型**必须**标注。

```rust
const PI:f32 = 3.1415926;
```

------

变量遮蔽：

Rust 中允许声明相同的变量名，在后面声明的变量会遮蔽掉前面声明的

```rust
fn main() {
    let x = 5;
    {
        // x="a";   // expected i32, found &' static str
        let x = "a";
        println!("inner x : {}",x)
    }
    println!("x : {}",x)
}
/*
输出：
	inner x : a
	x : 5
*/
```

