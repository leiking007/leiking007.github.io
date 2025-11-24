---
title: "Java常用类"
date: 2021-05-14
lastmod: 2021-05-24
draft: false
tags: ['JavaSE']
categories: ["☕️Java编程"]
author: "lei"
---

# Java常用类

## BigDecimal

### 常用构造函数

1. BigDecimal(int)

   创建一个具有参数所指定整数值的对象

2. BigDecimal(double)

   创建一个具有参数所指定双精度值的对象

3. BigDecimal(long)

   创建一个具有参数所指定长整数值的对象

4. BigDecimal(String)

   创建一个具有参数所指定以字符串表示的数值的对象

推荐使用字符串方式构建，这样不会损失精度值

### 常用方法

```java
BigDecimal b1=new BigDecimal("1E11");
BigDecimal b2=new BigDecimal("648");
BigDecimal b3 = b1.divide(b2, 6, RoundingMode.HALF_UP);

b1.subtract(b2);	//减法 -  b1-b2

b1.add(b2);		//加法 +  b1+b2

// RoundingMode.DOWN  向零取舍  1.5->1  -1.5->-1
// RoundingMode.UP  向零反向取舍  1.5->2  -1.5->-2
// RoundingMode.CEILING  向上取舍  1.5->2  -1.5->-1
// RoundingMode.FLOOR  向下取舍  1.5->1  -1.5->-2
// RoundingMode.HALF_UP  向最近的进行取舍，相同向零反向取舍  1.5->2  -1.5->-1  -1.4->-1
// RoundingMode.HALF_DOWN  向最近的进行取舍，相同向零舍入  1.5->1  -1.5->-1  -1.4->-1
// RoundingMode.ROUND_HALF_EVEN  向最近的进行取舍，相同向偶数位取舍  1.5->2  2.5->2  -1.5->-2  -1.6->-3
b1.divide(b2,2, RoundingMode.HALF_DOWN);	//除法 /  b1/b2   保留小数，取舍方式

b1.multiply(b2);	//乘法 *  b1*b2

b3.setScale(3, RoundingMode.HALF_UP);	//设置保留小数，取舍方式

//转换为字符串
b1.toPlainString();		//返回字符串，非科学技术法
b1.toEngineeringString();	//返回字符串，100E+9
b1.toString();		//返回字符串，1E+11
```

### DecimalFormat

|    符号    | 位置       | 本地化? | 含义                                                         |
| :--------: | :--------- | :-----: | :----------------------------------------------------------- |
|     0      | 数字       |   是    | 阿拉伯数字                                                   |
|     ##      | 数字       |   是    | 阿拉伯数字如果不存在就显示为空                               |
|     .      | 数字       |   是    | 小数分隔符或货币小数分隔符                                   |
|     -      | 数字       |   是    | 减号                                                         |
|     ,      | 数字       |   是    | 分组分隔符                                                   |
|     E      | 数字       |   是    | 分割科学技术法中的尾数和指数。在前缀和后缀中无需添加引号     |
|     ;      | 子模式边界 |   是    | 分隔正数和负数子模式                                         |
|     %      | 前缀或后缀 |   是    | 乘以100并显示为百分数                                        |
|   \u2030   | 前缀或后缀 |   是    | 乘以1000并显示为千分数                                       |
| ¤ (\u00A4) | 前缀或后缀 |   否    | 货币记号，由货币符号替换。如果两个同时出现，则用国际货币符号替换。如果出现在某个模式中，则使用货币小数分隔符，而不使用小数分隔符 |
|     '      | 前缀或后缀 |   否    | 用于在前缀或或后缀中为特殊字符加引号，例如 "'#'#" 将 123 格式化为 "#123"。要创建单引号本身，请连续使用两个单引号："## o''clock" |

```java
BigDecimal b3=new BigDecimal("154.319444");
new DecimalFormat("0.0\u2030").format(b3);	//154319.4‰
new DecimalFormat("0.0\u00A4").format(b3);	//154.3￥
new DecimalFormat("0.0%").format(b3);	//15431.9%
new DecimalFormat("0.0").format(b3);	//154.3
new DecimalFormat("0.00").format(b3);	//154.32
```



## Logger

Logger 是jdk自带的日志工具

### Logger简单使用

```java
public static final Logger logger= Logger.getLogger(ForkJoinDemo.class.getName());
public void someMethod(){
    logger.info("some msg.....")
}
```



### Logger 简易工具类

```java
public class LogUtil {
    private LogUtil() {
    }

    public static Logger getLogger(String name) {
        Logger logger = Logger.getLogger(name == null ? Thread.currentThread().getStackTrace()[1].getClassName() : name);
        ConsoleHandler handler = new ConsoleHandler();
        try {
            // 设置handler编码格式
            handler.setEncoding(StandardCharsets.UTF_8.name());
            // 设置handler打印格式
            handler.setFormatter(new Formatter() {
                @Override
                public String format(LogRecord record) {
                    ZonedDateTime zdt = ZonedDateTime.ofInstant(record.getInstant(), ZoneId.systemDefault());
                    return String.format("\u001B[32m[%1$s]\u001B[0m\u001B[30m%2$tF %2$tr: %3$s\u001B[0m%n", record.getLevel(), zdt, record.getMessage());
                }
            });
        } catch (UnsupportedEncodingException ignored) {
        }
        //禁用根 handler
        logger.setUseParentHandlers(false);
        //添加打印控制台的handler
        logger.addHandler(handler);
        logger.getHandlers();
        //设置打印日期的等级
        logger.setLevel(Level.ALL);
        return logger;
    }

    public static void info(String msg) {
        Logger logger = getLogger(new Throwable().getStackTrace()[1].getClassName());
        logger.info(msg);
    }

    public static void warning(String msg) {
        Logger logger = getLogger(new Throwable().getStackTrace()[1].getClassName());
        logger.warning(msg);
    }

    private class Color {
        public static final String ANSI_RESET = "\u001B[0m";
        public static final String ANSI_BLACK = "\u001B[30m";
        public static final String ANSI_RED = "\u001B[31m";
        public static final String ANSI_GREEN = "\u001B[32m";
        public static final String ANSI_YELLOW = "\u001B[33m";
        public static final String ANSI_BLUE = "\u001B[34m";
        public static final String ANSI_PURPLE = "\u001B[35m";
        public static final String ANSI_CYAN = "\u001B[36m";
        public static final String ANSI_WHITE = "\u001B[37m";
        public static final String ANSI_BLACK_BACKGROUND = "\u001B[40m";
        public static final String ANSI_RED_BACKGROUND = "\u001B[41m";
        public static final String ANSI_GREEN_BACKGROUND = "\u001B[42m";
        public static final String ANSI_YELLOW_BACKGROUND = "\u001B[43m";
        public static final String ANSI_BLUE_BACKGROUND = "\u001B[44m";
        public static final String ANSI_PURPLE_BACKGROUND = "\u001B[45m";
        public static final String ANSI_CYAN_BACKGROUND = "\u001B[46m";
        public static final String ANSI_WHITE_BACKGROUND = "\u001B[47m";
    }
}
```

## ArrayBlockingQueue

ArrayBlockingQueue 是一个具有线程安全性和阻塞性的有界队列

### 安全性演示

```java
/**
 * ArrayBlockingQueue的线程安全是通过底层的ReentrantLock保证的，因此在元素出入队列操作时，无需额外加锁
 * 下面代码会 1--7 都输出一次，并没有出现重复取出的情况，即保证了多个线程对资源竞争的互斥访问
 */
private static void c10Test01() {
    // 容量,是否为阻塞队列、初始包含的元素集合
    ArrayBlockingQueue<Integer> arrayBlockingQueue = new ArrayBlockingQueue<>(7, true,
            new ArrayList<>(Arrays.asList(1, 2, 3, 4, 5, 6, 7)));
    Runnable runnable = () -> {
        while (true) {
            try {
                System.out.println(Thread.currentThread().getName() + "take:" + arrayBlockingQueue.take());
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }
    };
    new Thread(runnable, "线程1").start();
    new Thread(runnable, "线程2").start();
}
```

### 阻塞性演示

```java
/**
 * 入队阻塞：当队列中的元素个数等于队列长度时，会阻塞向队列中放入元素的操作，当有出队操作取走队列中元素，队列出现空缺位置后，才会再进行入队
 * 出队阻塞：当队列中的元素为空时，执行出队操作的线程将被阻塞，直到队列不为空时才会再次执行出队操作
 * 出队的次数设为了队列中元素数量加一，因此这个线程最后会被一直阻塞，程序将一直执行不会结束
 */
private static void c10Test02() {
    ArrayBlockingQueue<Integer> arrayBlockingQueue = new ArrayBlockingQueue<>(3);
    int size = 7;
    new Thread(() -> {
        for (int i = 1; i < 7; i++) {
            try {
                arrayBlockingQueue.put(i);
                TimeUnit.SECONDS.sleep(1);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }
    }).start();
    new Thread(() -> {
        for (int i = 1; i < size+1; i++) {
            try {
                System.out.println(arrayBlockingQueue.take());
                TimeUnit.SECONDS.sleep(3);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }
    }).start();
}
```

### 相关方法

**插入**

- add(e)：当队列满时会抛出异常 `IllegalStateException: Queue full`
- offer(e)：会返回元素是否插入成功状态，成功返回true，失败返回false
- put(e)：队列满时会阻塞插入元素的线程，知道有元素被取出时才会插入
- offer(e,time,unit)：有超时机制的offer(e)，队列满且超时会返回false

**移除**

- remove()：移除队首元素，成功返回true，队列为空抛出异常 NoSuchElementException
- remove(e)：移除指定元素，成功返回true，队列为空返回false
- poll()：获取并移除队首元素，队列为空时返回null
- take()：阻塞方式获取队列元素，队列为空时阻塞直到队列中有数据
- poll(time,unit)：有超时机制的poll()，队列为空且超时返回null

```java
private static void c10Test04() throws InterruptedException {
    ArrayBlockingQueue<Integer> arrayBlockingQueue = new ArrayBlockingQueue<>(1,
            true, new ArrayList<>(List.of(1)));
    arrayBlockingQueue.remove();
//  arrayBlockingQueue.remove();  // 移除队首元素，成功返回true，队列为空抛出异常 NoSuchElementException
//  arrayBlockingQueue.remove(2);  // 移除指定元素，成功返回true，队列为空返回false
//  arrayBlockingQueue.poll();  // 获取并移除队首元素，队列为空时返回null
//  arrayBlockingQueue.take();  // 阻塞方式获取队列元素，队列为空时阻塞直到队列中有数据
//  arrayBlockingQueue.poll(3,TimeUnit.SECONDS);  // 有超时机制的poll()，队列为空且超时返回null
}


private static void c10Test03() throws InterruptedException {
    ArrayBlockingQueue<Integer> arrayBlockingQueue = new ArrayBlockingQueue<>(1);
    arrayBlockingQueue.add(1);
//  arrayBlockingQueue.add(2);   // 队列满时抛出异常 IllegalStateException: Queue full
//  arrayBlockingQueue.offer(2);    // 会返回元素是否插入成功状态，成功返回true，失败返回false
//  arrayBlockingQueue.put(2);  // 队列满时会阻塞插入元素的线程，知道有元素被取出时才会插入
//  arrayBlockingQueue.offer(2, 3, TimeUnit.SECONDS);   // 有超时机制的offer(e)，队列满且超时会返回false
}
```



## Optional

Optional 类是一个可以为null的容器对象。如果值存在则isPresent()方法会返回true，调用get()方法会返回该对象。

Optional 是个容器：它可以保存类型T的值，或者仅仅保存null

### Optional实例

```java
private static void lambda1Test_1(){
    A a=null;

    // NullPointerException
    Optional.of(a).orElse(new A("ofOrElse"));

    // 两者区别，orElseGet是调用其他返回对象，orElse是直接返回对象
    Optional.ofNullable(a).orElse(new A("ofNullableOrElse"));
    Optional.ofNullable(a).orElseGet(() -> new A("ofNullableorElseGet"));


    //为null抛出异常
    Optional.ofNullable(a).orElseThrow();
    //为null抛出，自定义异常
    //Optional.ofNullable(a).orElseThrow(() -> new RuntimeException("值为null"));

    // return value != null
    Optional.ofNullable(a).isPresent();
    //return value == null
    Optional.ofNullable(a).isEmpty();

    //为null 返回传入的 Optional 实例
    Optional.ofNullable(a).or(() -> Optional.of(new A("or")));

}
```

