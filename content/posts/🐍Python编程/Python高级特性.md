---
title: "Python高级特性"
date: 2025-07-14
lastmod: 2025-07-14
draft: false
tags: ['Python']
categories: ["🐍Python编程"]
author: "lei"
summary: "介绍 Python 高级特性，包括类变量、类方法、静态方法，推导式（列表、字典、集合），生成器，* 号作用及装饰器，助于高效编程。"
---

# Python高级特性

## 类变量、类方法、静态方法

**类变量**

类变量是被类的所有实例共享的变量，它在类定义内部但在任何类方法外部进行定义。其主要特点为：

- 所有类的实例都能访问该变量。
- 若类变量的值被修改，所有实例访问到的都是修改后的值。
- 类变量通过类名或者实例来访问。

**类方法**

类方法是绑定到类而非类实例的方法，它通过`@classmethod`装饰器来定义，并且第一个参数通常是`cls`（代表类本身）。类方法的主要特点有：

- 类方法可以访问和修改类变量。
- 可以通过类名或者实例来调用类方法。
- 类方法常被用作工厂方法，用于创建类的实例。

**静态方法**

静态方法是类中不依赖于类或实例的方法，它通过`@staticmethod`装饰器来定义，并且没有类似`self`或`cls`这样的特殊第一个参数。静态方法的主要特点为：

- 静态方法不能访问或修改类变量和实例变量。
- 可以通过类名或者实例来调用静态方法。
- 静态方法通常用于执行与类相关但不依赖于类状态的实用函数。

```python
class Student():

    # 类变量
    student_count = 0
    
    def __init__(self,name:str,sex:str):
        self.name = name
        self.sex = sex
        Student.student_count += 1

    # 类方法
    @classmethod
    def get_student_count(cls):
        return cls.student_count
    
    # 类方法
    @classmethod
    def from_str(cls,info:str):
        return cls(info.split(',')[0],info.split(',')[1])
    
    # 静态方法
    @staticmethod
    def get_name_len(name):
        return len(name)
    
stu1=Student('张三','男')
print(Student.student_count)

stu2=Student.from_str('张三,男')
print(Student.student_count)
```

## 推导式

在 Python 里，推导式是一种可以从一个或多个可迭代对象快速创建序列（像列表、字典、集合等）的语法结构。它的优点是代码简洁，执行效率较高。

- **代码简洁**：只需要一行代码，就能替代多行的循环和条件语句。
- **执行效率高**：推导式的执行速度通常比传统的循环语句要快。
- **可读性强**：对于熟悉推导式语法的人来说，代码的意图一目了然。

**列表推导式**

列表推导式是最常用的推导式，其作用是快速生成列表

```python
[表达式 for 变量 in 可迭代对象 if 条件]
```

**字典推导式**

字典推导式用于快速生成字典

```python
{键表达式: 值表达式 for 变量 in 可迭代对象 if 条件}
```

**集合推导式**

集合推导式用于快速生成集合，它的基本语法和列表推导式类似，不过使用的是花括号`{}`

```python
{表达式 for 变量 in 可迭代对象 if 条件}
```

```python
# %%
# 列表推导式
nums = [1,2,3,4,5,6]
letters = ['a','b','c','d','e','f']

#---------0----------
my_list = []
for num in nums:
    my_list.append(num)
print(my_list)

my_list = [num for num in nums]
print(my_list)

#---------1----------
my_list = []
for num in nums:
    my_list.append(num*2)
print(my_list)

my_list = [num*2 for num in nums]
print(my_list)

#---------2----------
my_list=[]
for num in nums:
    if num%2==0:
        my_list.append(num)
print(my_list)

my_list=[num for num in nums if num%2==0]
print(my_list)

#---------3----------
my_list=[]
for num in nums:
    if num%2==0:
        my_list.append(num*2)
    else:
        my_list.append(num)
print(my_list)

my_list=[num*2 if num%2==0 else num for num in nums]
print(my_list)

#---------4----------
my_list=[]
for num1 in nums:
    for num2 in nums:
        my_list.append(num1+num2)
print(my_list)

my_list=[num1+num2 for num1 in nums for num2 in nums]
print(my_list)


# %%
# 字典推导式
nums = [1,2,3,4,5,6]
letters = ['a','b','c','d','e','f']

#---------0----------
my_dict = {}
for num,letter in zip(nums,letters):
    my_dict[num] = letter
print(my_dict)

my_dict = {num:letter for num,letter in zip(nums,letters)}
print(my_dict)


# %%
# 集合推导式
nums = [1,2,3,1,2,3]

# ----------0---------
my_set =set()
for num in nums:
    my_set.add(num)
print(my_set)

my_set = { num for num in nums}
print(my_set)
```

## 生成器

在 Python 里，生成器是一种创建迭代器的高效方式，它的实现更为简洁。

**生成器特性**

- **惰性求值**：只有在请求时才会生成值，减少了内存的占用。
- **单遍迭代**：生成器是不可逆的，遍历结束后就不能再次使用。
- **状态自动保存**：自动保存上一次执行的状态，简化了迭代逻辑。

**停止生成器**

- 使用 `StopIteration` 异常
- 使用 `return` 语句
- 使用生成器对象的 `close()` 方法
- 通过外部条件控制生成器

**生成器函数**

借助 `yield` 关键字，普通函数能转变为生成器函数。每次调用 `next()` 时，函数会运行到 `yield` 处并返回值，随后暂停执行，保存当前状态。待下次调用 `next()`，函数会从暂停的地方继续执行。

**生成器表达式**

语法和列表推导式相似，不过使用的是圆括号。生成器表达式采用惰性求值，更节省内存。

```python
# %%
# 生成器函数
def square_numbers(nums:list):
    for num in nums:
        yield num**2

# 生成器对象
my_generator = square_numbers([1,2,3,4,5])
print(my_generator)  # <generator object square_numbers at 0x00000273F74F7D30> 打印的是内存地址
print(next(my_generator))  # 1
print(next(my_generator))  # 4
print(next(my_generator))  # 9
print(next(my_generator))  # 16
print(next(my_generator))  # 25


# %%
# 生成器表达式
my_generator = (num**2 for num in [1,2,3,4,5])
print(my_generator)  # <generator object <genexpr> at 0x0000024F2AD92A80> 打印的是内存地址
print(next(my_generator))  # 1
print(next(my_generator))  # 4
print(next(my_generator))  # 9
print(next(my_generator))  # 16
print(next(my_generator))  # 25

# %%
# 手动停止生成器

def square_numbers():
    try:
        yield '0'
        yield '1'
        raise StopIteration   # 手动报错终止生成器
        yield '2'  # 这行代码不会执行
    except GeneratorExit:
        print('GeneratorExit')

#-------------0 使用close关闭生成器------------------
my_generator = square_numbers()
print(next(my_generator))  # 0
my_generator.close() # 关闭生成器，生成器会在当前暂停的 yield 处抛出 GeneratorExit 异常。
# print(next(my_generator))  # 报错 StopIteration
```

## * 号作用

**运算符**

数值类型的乘法运算，平方运算

**字符串 / 列表 / 元组的重复**

重复生成多个相同元素

**打包**

函数入参定义使用` *` 号可以收集为一个元组，` **` 可以收集为一个字典

**解包**

使用 `*` 可以将迭代对象拆分为独立的参数，`**` 可以拆分包字典的键值对

```python
# %%
# -----------运算符-----------
a=5*2   # 乘号
b=5**2  # 指数
print(f'a：{a},b:{b}')  # a：10,b:25


# %%
# -----------生成重复元素-----------
a = 'ha'*4
b=[1,3]*4
c=(1,)*4
print(a)  # hahahaha
print(b)  # [1, 3, 1, 3, 1, 3, 1, 3]
print(c)  # (1, 1, 1, 1)

# %%
# -----------打包-----------
# 使用*将入参打包成元组
def fun_a(*args):
    print(type(args))  # <class 'tuple'>
    for arg in args:
        print(arg)  # 1 2 3
fun_a(1,2,3)

def fun_b(**kwargs):
    print(type(kwargs))  # <class 'dict'>
    for key,value in kwargs.items():
        print(key,value)  # a 1 b 2 c 3

fun_b(a=1,b=2,c=3)   # 必须传入参数名，否则会报错

# %%
# -----------解包 注意一个*和两个*区别-----------
def fun_c(a,b):
    print(f'a:{a},b:{b}')

a=(1,2,)
b=[5,6]
fun_c(*a)  # 使用*将元组/列表解包成多个参数，打印：a:1,b:2
fun_c(*b)  # 使用*将元组/列表解包成多个参数，打印：a:5,b:6
print([*a,*b])  # 使用*将元组/列表解包成多个参数，打印：[1, 2, 5, 6]

a={
    'a':1,
    'b':2
}
b={
    'c':3,
    'd':4
}
print({**a,**b})  # 使用**将字典解包成多个参数，打印：{'a': 1, 'b': 2, 'c': 3, 'd': 4}
```

## 装饰器

装饰器（Decorator）是一种特殊的语法，用于修改或增强函数或类的功能，而无需修改其源代码。装饰器本质上是一个函数，它接受一个函数作为参数，并返回一个新的函数。

装饰器主要是为了解决**代码复用**和**功能增强**的问题，同时保持代码的简洁性和可读性。

当使用装饰器包装函数时，被装饰后的函数会丢失原函数的一些元信息（如函数名、文档字符串、参数列表等）。`functools.wraps` 是一个装饰器工具，用于解决这个问题 —— 它可以将原函数的元信息 “复制” 到装饰器内部的 `wrapper` 函数上，确保被装饰后的函数保留原函数的身份特征。

```python
import time
import functools
# %%
# python 中函数也是一个对象，可以作为参数传递，也可以作为返回值
def square(x):
    return x**2

def print_fun_return(fun,x):
    print(f'{fun.__name__} is runing')
    return fun(x)

x = print_fun_return(square,3)
print(x)  # 9

# %%
#  装饰器
def my_decorator(fun):
    def wrapper(*args,**kwargs):
        start_time=time.time()
        fun(*args,**kwargs)
        print(f'函数 {fun.__name__} 运行时间为：{time.time() - start_time} second')
    return wrapper

def square(x):
    time.sleep(1)
    return x**2

# 方式一
square = my_decorator(square)
square(2)

#方式二
@my_decorator
def square(x):
    time.sleep(1)
    return x**2
square(2)

# %%
# 装饰器生成器（带参数的装饰器）
def my_decorator(threshold):
    def decorator(fun):
        def wrapper(*args,**kwargs):
            start_time=time.time()
            fun(*args,**kwargs)
            if time.time()-start_time > threshold:
                print(f'函数 {fun.__name__} 运行时间超过阈值 {threshold}')
        return wrapper
    return decorator

def square(x):
    time.sleep(1)
    return x**2

# 方式一
square = my_decorator(1)(square)
square(3)

# 方式二
@my_decorator(1)
def square(x):
    time.sleep(1)
    return x**2
square(3)

# %%
def my_decorator(fun):
    def wrapper(*args,**kwargs):
        start_time=time.time()
        fun(*args,**kwargs)
        print(f'函数 {fun.__name__} 运行时间为：{time.time() - start_time} second')
    return wrapper

@my_decorator
def square(x):
    time.sleep(1)
    return x**2

print(f'function name is {square.__name__}')   # wrapper ，丢失了原来函数的属性

# ======= 使用 functools.wraps 装饰器将原函数的元信息 “复制” 到装饰器内部的 wrapper 函数上
def my_decorator(fun):
    @functools.wraps(fun)
    def wrapper(*args,**kwargs):
        start_time=time.time()
        fun(*args,**kwargs)
        print(f'函数 {fun.__name__} 运行时间为：{time.time() - start_time} second')
    return wrapper

@my_decorator
def square(x):
    time.sleep(1)
    return x**2

print(f'function name is {square.__name__}')   # wrapper ，丢失了原来函数的属性




```



