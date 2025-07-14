---
title: "JavaSE3"
date: 2020-06-09
lastmod: 2020-06-09
draft: false
tags: ['JavaSE']
categories: ["后端"]
author: "lei"
---

# JavaSE3

## IO流

Java.io.*

### 简介

1. 通过IO可以完成内存和硬盘之间数据的流动

2. 流方向分类：到内存叫做输入，读；从内存中出来叫做输出，写

3. 流读取方式分类：有的流按照字节读取，一次读取一个字节byte，等同于一次读取8个二进制位，这种流是万能的，什么类型文件都能读取；有的流按照字符方式读取，这种流为了方便读取普通文本文件存在，不能读取：图片，声音，视频等，只能读取纯文本文件

4. Java IO流这块有四大家族；以下是四大家族的首领（抽象类）

   1. Java.io.InputStream：字节输入流
   2. Java.io.OutputStream：字节输出流
   3. Java.io.Reader：字符输入流
   4. Java.io.Writer：字符输出流

   注意：在Java中凡是类名以Stream结尾的都是字节流。以Reader/Writer结尾的都是字符流

5. 所有的流都实现了Java.io.Closeable接口，都是可关闭的，都有close()方法；流毕竟是一个管道，会占用资源，用完后一定要关闭

6. 所有的输出流都实现了Java.io.Flushable接口，都是可刷新的，都有flush()方法；刷新表示将通道或者管道当中剩余的未输出的数据强行输出完(清空管道)

7. Java中需要掌握的io流有16个
   文件专属
   Java.io.FileInputStream
   Java.io.FileOutputStream
   Java.io.FileReader
   Java.io.FileWriter

   转换流（将字节流转化为字符流）
   Java.io.InputStreamReader
   Java.io.OutputStreamWriter

   缓冲区专属
   Java.io.BufferedReader
   Java.io.BufferedWriter
   Java.io.BufferedInputStream
   Java.io.BufferedOutputStream

   数据流专属
   Java.io.DataInputStream
   Java.io.DataOutputStream

   标准输出流
   Java.io.PrintWriter
   Java.io.PrintStream

   对象专属流
   Java.io.ObjectInputStream
   Java.io.ObjectOutputStream

### FileInputStream

1. 文件字节输入流，万能，任何文件都可以使用这个流来读；字节方式完成输入操作（硬盘-->内存）；IDEA默认当前路径为工程的根

2. int available()；返回流中剩余没有读到的字节数量

3. long skip(long n)；跳过几个字节不读

4. 代码示例

   ```java
   public static void main(String[] args) {
           FileInputStream fis=null; //创建字节输入流
           int a;
           try {
               fis=new FileInputStream("module01/src/io/leiking/Javasestud/tempfile"); //当前路径为工程路径
               byte[] b=new byte[fis.available()]; //创建一个byte数组，大小为未读文件字节的大小，不适用于大文件，因为byte数组会过大
               fis.read(b);
               /*
               *byte[] bytes=new byte[5];
               *int acount=fis.read(bytes);//这里返回值为读取到的字节数量
               *也可以设置默认byte数组长度，然后使用String(byte[] bytes, 0, a)方法，转换成字符串
                * */
   /*            还有个skip方法，用于跳过指定字节数不读取
               System.out.println(new String(b)); //使用方法，将byte数组转化为字符串
               while (((a=fis.read())!=-1)){ //一个字节一个字节的读取，返回值为读取到的字节
                   System.out.print(a+" ");
               }*/
           } catch (IOException e) {
               e.printStackTrace();
           }finally {
               if (fis!=null){
                   try {
                       fis.close();
                   } catch (IOException e) {
                       e.printStackTrace();
                   }
               }
           }
       }
   ```

### FileOutputStream

1. 文件字节输出流（内存-->硬盘）；写完之后一定要使用flush()刷新

2. 代码示例

   ```java
   public static void main(String[] args) {
           FileOutputStream fos=null;
           try {
               //true表示如果文件已经存在，会将数据追加到文件末尾
           fos=new FileOutputStream("module01/src/io/leiking/Javasestud/tempfile1",true);
               byte[] bytes={97,98,99,32};
               fos.write(bytes);//将byte数组写入文件
               fos.write(bytes,0,1);//将数组中指定元素写入文件
               fos.flush();//FileOutputStream使用后必须刷新
           } catch (IOException e) {
               e.printStackTrace();
           }finally {
               if (fos!=null){
                   try {
                       fos.close(); //关闭流
                   } catch (IOException e) {
                       e.printStackTrace();
                   }
               }
           }
       }
   ```

   ### 其他代码

   文件复制

   ```java
       public static void main(String[] args) {
           FileInputStream fis=null;
           FileOutputStream fos=null;
           try {
               fis=new FileInputStream("F:\\源码\\EditPlus5.3.0.2542\\EditPlus_5.3.0.2542_x64_SC.exe");//输入流
               fos=new FileOutputStream("Test");
               byte[] bytes=new byte[1024*1024];//一次性读取1M大小
               while (fis.read(bytes)!=-1){//当读取的字节数为-1时，结束循环，且将读取的字节存入bytes数组
                   fos.write(bytes);//向文件中写入bytes中内容
               }
           } catch (IOException e) {
               e.printStackTrace();
           } finally{
               if(fis!=null){
                   fis.close();//关闭输入流
               }
               if(fos!=null){
                   fos.close();//关闭输出流
               }
           }
       }
   ```

### Reader和Writer

1. 文件字符输入流，读取文本时比较方便

2. 按照字符方式读取，一次读取一个字符

3. 代码示例

   ```java
   public static void main(String[] args) {
           Reader reader=null;
           Writer writer=null;
           try {
               reader=new FileReader("module01/1.html"); //字符输入流
               writer=new FileWriter("2",true); //字符输出流
               char[] a=new char[10];
               int count; //记录读取文本文档字符的个数
               while ((count=reader.read(a))!=-1){
                   writer.write(a,0,count);//将数组中的元素写入文件
               };
               writer.flush(); //刷新输出流（必要步骤）
           } catch (IOException e) {
               e.printStackTrace();
           }finally {
               if (reader!=null){
                   try {
                       reader.close(); //关闭流
                   } catch (IOException e) {
                       e.printStackTrace();
                   }
               }
               if (writer!=null){
                   try {
                       writer.close(); //关闭流
                   } catch (IOException e) {
                       e.printStackTrace();
                   }
               }
           }
       }
   ```

### 缓冲流

1. 带有缓冲区的流，不需要定义char数组或者byte数组；BufferedReader、BufferedWriter

2. 当一个流的构造方法中需要传入一个流时，这个被传入的流叫做：节点流；外面的流叫做：处理流；且关闭流时只需要调用最外层流（处理流）的close()方法

3. 转换流，可以进行流之间的转换；InputStreamReader\OutputStreamWriter

4. 代码示例

   ```java
       public static void main(String[] args) throws Exception {
           FileInputStream fis=new FileInputStream("2");//字节流
           InputStreamReader isr=new InputStreamReader(fis);//字节流转换为字符流
           BufferedReader br=new BufferedReader(isr);
           String data;
           BufferedWriter bw=new BufferedWriter(new OutputStreamWriter(new FileOutputStream("3")));
           while ((data=br.readLine())!=null){//读取一行，但是读取不到换行符,没数据时返回null
               bw.write(data);//将字符串输出到文件
               bw.write("\n");
           }
           bw.flush();//刷新缓冲区输出流
           br.close();//关闭最外层流
           bw.close();//关闭最外层流
       }
   ```

### 数据流

1. 这个流可以将数据连同数据的类型一并写入文件；这个文件不是普通文本文件，不能用记事本打开

2. 读取数据类型的顺序一致，否则会出现问题；类似于加密规则

3. 代码示例

   ```java
       public static void main(String[] args) throws Exception{
           DataOutputStream dos=new DataOutputStream(new FileOutputStream("4"));
           int a=100;
           char b='a';
           dos.writeInt(a);
           dos.writeChar(b);
           dos.flush();
           dos.close();
           DataInputStream dis=new DataInputStream(new FileInputStream("4"));
           System.out.println(dis.readInt());//读取数据时，类型与存储时一致
           System.out.println(dis.readChar());
           dis.close();
       }
   ```

### 标准输出流

1. 标准字节输出流，默认输出到控制台；标准输出流不需要手动关闭流

2. 可以改变标准输出流的方向

3. 代码示例

   ```java
       public static void log(String msg){
           try {
               //改变标准输出流方向到log文件
               PrintStream ps=new PrintStream(new FileOutputStream("log",true));
               Date date=new Date();
               //时间格式化对象
               SimpleDateFormat a=new SimpleDateFormat("yyyy/MM/dd HH:mm:ss SSS");
               ps.println(a.format(date)+"-->"+msg);//输出内容到log文件
           } catch (FileNotFoundException e) {
               e.printStackTrace();
           }
       }
       public static void main(String[] args) {
           log("用户登录了");
           log("登陆失败了");
       }
   ```

### Java.io.File

1. File类与四大家族没有关系，所以File类不能完成文件的读和写

2. File对象代表的是文件和目录路径名的抽象表示形式；一个File对象可能是目录，也有可能是文件

3.   boolean createNewFile()  ；不存在时，新建一个文件

4.  boolean delete() ；删除此抽象路径名表示的文件或目录

5.  boolean mkdir()；创建此抽象路径名指定的目录 

6.  String getParent() ； 返回此抽象路径名父目录的路径名字符串；如果此路径名没有指定父目录，则返回 null 

7.  String getPath() ；将此抽象路径名转换为一个路径名字符串

8.   boolean exists() ； 测试此抽象路径名表示的文件或目录是否存在 

9.  boolean isDirectory() ； 测试此抽象路径名表示的文件是否是一个目录 

10.  boolean isFile() ；测试此抽象路径名表示的文件是否是一个标准文件 

11.  long lastModified() ；返回此抽象路径名表示的文件最后一次被修改的时间，返回的是一个毫秒，1970年到现在的总毫秒数

12.  long length()； 返回由此抽象路径名表示的文件的长度，获取文件大小

13.  File[] listFiles() ；返回一个抽象路径名数组，这些路径名表示此抽象路径名表示的目录中的文件

14. 代码示例（重点理解，目录的复制）

    ```java
        public static void main(String[] args) {
            File soufile=new File("F:\\源码\\Java");
            File desfile=new File("D:\\a");
            copy(soufile,desfile);
        }
    
        /**
         *复制文件夹的方法
         * @param soufile 源文件夹
         * @param desfile 目标文件位置
         */
        public static void copy(File soufile,File desfile){
            if (soufile.isFile()){//如果是一个文件就返回，递归终止条件
                FileInputStream fis=null;
                FileOutputStream fos=null;
                try {
                    byte[] bytes=new byte[1024*1024];
                    fis=new FileInputStream(soufile);
                    int count=0;
                    String path=(desfile.getAbsolutePath().endsWith("\\")?desfile.getAbsolutePath():desfile.getAbsolutePath()+"\\")+soufile.getAbsolutePath().substring(6);
                    System.out.println(path);
                    fos=new FileOutputStream(path);
                    while ((count=fis.read(bytes))!=-1){
                        fos.write(bytes,0,count);
                    }
                    fos.flush();//刷新流
                } catch (IOException e) {
                    e.printStackTrace();
                }finally {
                    if (fis!=null){
                        try {
                            fis.close();
                        } catch (IOException e) {
                            e.printStackTrace();
                        }
                    }
                }
                return;
            }
            File[] files=soufile.listFiles();
            for (File a:files){
                File newFile=null;
                if (a.isDirectory()){ //是否为目录
                    String srcDir=a.getAbsolutePath();//抽象路径名的绝对路径名形式
                    String desDir=(desfile.getAbsolutePath().endsWith("\\")?desfile.getAbsolutePath():desfile.getAbsolutePath()+"\\")+srcDir.substring(6);//返回绝对路径
                    newFile=new File(desDir);//创建File对象
                    if (!newFile.exists()){ //文件夹不存在
                        newFile.mkdirs();//创建文件夹,包括所有必需但不存在的父目录
                    }
                }
                copy(a,desfile);
            }
        }
    ```


### 对象流

1. 序列化：将对象存储到硬盘中（拆分对象）；反序列化：将对象从硬盘中取出（组装对象）

2. 参与序列化和反序列化的对象必须实现Serializable接口，这个接口中什么代码都没有，仅作为标识；标志接口，给JVM看的，JVM看到后会自动生成一个序列化版本号

3. Java中区分类：首先靠类名进行区分，如果一样，则靠序列化版本号区分；

4. 序列化版本号的缺陷，一旦代码确定后，后面不能修改代码，一旦修改，会重新编译，生成新的序列化版本号，JVM会认为这是一个新的类；因此，建议实现Serializable接口的，手动给予序列化版本号

5. 可以将对象放入集合，实现一次性序列化多个对象

6. 属性定义可以使用**transient**关键字修饰，表示游离的，该字段不参与序列化

7. 代码示例

   ```java
       public static void main(String[] args) throws Exception{
           Student a=new Student("李云",25);
           Student b=new Student("王炸",32);
           ArrayList<Student> al=new ArrayList<>();
           al.add(a);
           al.add(b);
           ObjectOutputStream oop=new ObjectOutputStream(new FileOutputStream("students"));
           oop.writeObject(al); //序列化ArryList集合
           oop.flush();
           oop.close();
           ObjectInputStream oip=new ObjectInputStream(new FileInputStream("students"));
           Object als=oip.readObject(); //反序列化
           ArrayList<Student> als1=(ArrayList)als;
           for (Student data:als1){
               System.out.println(data);
           }
       }
   class Student implements Serializable {
       private static final long serialVersionUID = 1L;//手动给序列化版本号
       private String name;
       private int age;
   
       public Student(String name, int age) {
           this.name = name;
           this.age = age;
       }
   
       @Override
       public String toString() {
           return "Student{" +
                   "name='" + name + '\'' +
                   ", age=" + age +
                   '}';
       }
   }
   ```

### 其他

1. IO+Properties联合使用（读取配置文件）
2. 类似于key=value，被称为属性配置文件，Java中建议使用.properties结尾；属性配置文件中使用**#**进行注释
3. 代码示例

```java
    public static void main(String[] args) throws Exception{
        FileReader fr=new FileReader("config.properties");//字符输入流
        Properties prope=new Properties();//创建一个属性集合
        prope.load(fr);//从输入流中读取数据
        System.out.println(prope.getProperty("username"));//获取username属性的值
        System.out.println(prope.getProperty("password"));//获取password属性的值
    }
```

## 多线程

### 简介

1. 进程是一个应用程序（一个进程是一个软件）；线程是一个进程的执行场景/执行单元；一个进程可以有多个线程
2. 对于Java程序来说，当在DOS命令窗口中输入：Java HellowWorld回车之后；会首先启动JVM，而JVM就是一个进程；JVM再启动一个主线程调用main方法；同时再启动一个垃圾回收线程负责看护，回收垃圾；Java程序中至少有两个线程并发
3. Java中进程内存互不干扰；线程的堆内存和方法区内存共享；栈内存独立，一个线程一个栈；多线程机制目的是提高程序执行效率
4. main方法（主线程）结束，程序不一定执行完毕，可以有其他线程还在压栈弹栈

### 实现线程两种方式

1. 第一种：编写一个类直接继承Java.lang.Thread，重写run方法；然后new就可以创建线程；使用strat()方法开辟新的栈空间，瞬间执行结束，线程就启动成功；启动成功后自动调用run方法，且压栈到新栈的底部（与main类似）

2. 第二种：编写一个类实现Java.lang.Runnable接口；这个类并不是一个线程类，是一个可运行的类；先创建一个可运行的对象，然后将可运行的对象封装成一个线程对象；同样使用start()启动线程（开辟栈空间）

3. 建议使用第二种方式，实现接口；因为这样以后还能继承其他类，比较灵活

4. 代码示例

   ```java
   public class ThreadTest01 {
       public static void main(String[] args) {
           Student stu=new Student();
           stu.start(); //开辟栈空间（很快执行结束），会自动调用run()方法，并压栈到新栈底部
           for (int i=0;i<1000;i++){
               System.out.println("main线程--->"+i);
           }
       }
   }
   class Student extends Thread{
       @Override
       public void run() {
           for (int i=0;i<1000;i++){
               System.out.println("分支线程--->"+i);
           }
       }
   }
   ```

   ```java
   public class ThreadTest02 {
       public static void main(String[] args) {
           Stud stud = new Stud();//创建可运行对象
           Thread thread = new Thread(stud);//封装成线程对象
           thread.start();//开辟栈空间
           for (int i = 0; i < 1000; i++) {
               System.out.println("main线程-->" + i);
           }
       }
   }
   
   class Stud implements Runnable {
       @Override
       public void run() {
           for (int i = 0; i < 1000; i++) {
               System.out.println("分支线程-->" + i);
           }
       }
   }
   ```

### 线程生命周期

1. 才new出来的线程叫做新建状态；通过start(),线程变成就绪状态；run()方法执行标志进入运行状态，时间片用完会继续进入就绪状态抢夺时间片，直到线程执行完，当线程遇到阻塞事件，会进入阻塞状态，此时会放弃抢夺的时间片；当阻塞清除时，会自动回到就绪状态抢夺时间片；就绪状态和运行状态切换，是JVM调度
2. 新建状态：刚new出一个线程时
3. 就绪状态：此时线程具有抢夺CPU时间片的权利，抢夺成功进入就绪状态
4. 运行状态：线程运行，时间片用完会进入就绪状态继续抢夺时间片，直到线程结束，遇到阻塞事件，会进入阻塞状态
5. 阻塞状态：此时线程放弃之前抢夺的时间片，清除阻塞时会进入就绪状态，抢夺时间片
6. 死亡状态：

### 获取线程对象

1. 获取当前线程对象：static Thread.currentThread()；出现在哪个线程对象中，就是获取哪个线程对象

2. 获取线程对象名字：getName()方法

3. 修改线程对象名字：setName()方法

   ```java
   public class ThreadTest03 {
       public static void main(String[] args) {
           Thread thread=new Thread(new Stud03());
           thread.start();//启动线程（开辟新栈）
       }
   }
   class Stud03 implements Runnable{
       @Override
       public void run() {
           Thread a=Thread.currentThread();//获取当前线程对象
           System.out.println(a.getName());//获取当前线程对象名字
           a.setName("th1");//修改当前线程对象名字
           System.out.println(a.getName());
       }
   }
   ```

   

### 线程状态改变

1. static void sleep(Long millis)；是一个静态方法；参数是毫秒；作用：让线程进入休眠，运行在哪个线程中，则让哪个线程休眠

2. t.interrupt()方法，中断t线程休眠（这种中断睡眠的方式依靠了Java的异常处理机制）

3. t.stop()强行终止线程（已过时），缺点：容易丢失数据；给一个标记，修改标记达到终止线程的目的

4. 代码示例

   ```java
   public class ThreadTest04 {
       public static void main(String[] args) {
           Mythread1 r = new Mythread1();//可运行程序
           Thread th = new Thread(r);
           th.start();//启动线程
           th.setName("t");//设置名字
           try {
               Thread.sleep(1000);//休眠1s
           } catch (InterruptedException e) {
               e.printStackTrace();
           }
           th.interrupt();//终止th线程休眠
           r.setRun(false); //采用标志终止线程
           //th.stop();//终止线程，过时，不建议使用
           System.out.println("main线程");
       }
   }
   
   class Mythread1 implements Runnable {
       private boolean run = true;//线程运行标志
       @Override
       public void run() {
           for (int i = 0; i < 100; i++) {
               if (run) {
                   System.out.println(Thread.currentThread().getName() + "-->" + i);
                   try {//这里只能使用try catah，因为实现方法，不能抛出更多异常
                       Thread.sleep(3000);//休眠3秒
                   } catch (InterruptedException e) {
                       e.printStackTrace();
                   }
               } else {
                   System.out.println("线程终止");
                   return;
               }
           }
       }
   ```

### 线程调度

1. 调度模型

   1. 抢占式调度模型（Java）：哪个线程优先级高，抢到时间片的概率就高一些
   2. 均分式调度模型：平均分配时间片，每个线程占有时间片的时间长度一样

2. Java中与线程调度有关的方法

   1.  void setPriority(int newPriority)：更改线程的优先级 ；
      int getPriority()  ：返回线程的优先级 
      最低优先级1；默认优先级5；最高优先级10；优先级高的可能获取时间片机会高一些

   2. static void yield() ：暂停当前正在执行的线程对象，并执行其他线程 ；不是阻塞方法，yield方法会让当前线程转换为就绪状态

   3. void join()：合并线程；t.jion()：当前线程进行阻塞，执行t线程，直到t线程执行结束，当前线程继续执行，相当于将t线程合并到当前线程

   4. 代码示例

      ```java
      public class ThreadTest05 {
          public static void main(String[] args) {
              Thread th=new Thread(new MyThread05());
              th.setPriority(10);//设置优先级10
              System.out.println(Thread.currentThread().getPriority());//获取当前线程优先级
              th.start();
              try {
                  th.join(); //将th线程加入当前线程，并阻塞当前线程
              } catch (InterruptedException e) {
                  e.printStackTrace();
              }
              for (int i=0;i<100;i++){
                  System.out.println(Thread.currentThread().getName()+"-->"+i);
              }
          }
      }
      class MyThread05 implements Runnable{
          @Override
          public void run() {
              System.out.println(Thread.currentThread().getPriority());//获取当前线程优先级
              for (int i=0;i<100;i++){
                  if (i%9==0){
                      Thread.yield();//暂停当前执行，转换为就绪状态抢夺时间片
                  }
                  System.out.println(Thread.currentThread().getName()+"-->"+i);
              }
          }
      }
      ```

### 线程同步

1. 注意：自己写的程序会放到多线程的环境下运行，需要关注自己写的代码在多线程环境下数据的安全问题

2. 线程安全问题

   1. 多线程并发
   2. 有共享数据
   3. 共享数据有修改行为

3. 解决线程安全问题
   线程排队执行（不能并发）机制；这种机制被称为线程同步机制；只有数据安全后才可以谈执行效率

4. 编程模型

   1. 异步编程模型：t1和t2各自互不干扰的执行，线程并发，效率高
   2. 同步编程模型：t1和t2排队执行，线程同步，效率较低

5. 同步代码块synchronized ()（排他锁）；小括号中传的数据必须是多线程共享的”数据“，才能达到多线程排队；小括号中写的内容根据需求：你需要哪些线程同步;Java中任何对象都有一把锁（标志）；字符串（常量池中）是一个万能锁

   ```java
       public void quQian(Double qu){//取钱方法
           synchronized (this){ //t1 t2共享对象，对象锁，同步代码块 线程同步
               Double after=this.money-qu;//取钱后余额
               try {
                   Thread.sleep(1000);//休眠1s，必定会出现安全问题
               } catch (InterruptedException e) {
                   e.printStackTrace();
               }
               setMoney(after);//更新余额
           }
   ```

   上面代码t1和t2线程并发执行，假设t1执行时，遇到synchronized，会自动找后面”共享对象“的对象锁，找到后并占有，直到执行完才释放；此时t2线程如果遇到synchronized时，也会去占有后面”共享对象“的这把锁，发现已经被t1占有时，只能在代码块外等待t1执行完归还锁后，才能继续占有这把锁，然后执行同步代码块（就绪状态抢夺时间片）

6. synchronized ()出现在实例方法上，锁的一定是this；缺点：代表整个方法体需要同步，可能扩大同步范围，效率低；优点：代码简洁

   ```java
   public synchronized void getChar(){}
   ```

   

7. 局部变量永远都不会存在安全问题（不共享，栈中，一个线程一个栈）；实例变量在堆中（堆只有一个），可能存在线程安全问题；静态变量存在方法区中（方法区只有一个），存在线程安全问题

8. 如果使用局部变量，建议使用StringBuilder（非线程安全），StringBuffer（线程安全）效率较低；ArrayList（不安全），Vector（安全）；HashMap（不安全），Hashtable（安全）

9. synchroized()三种写法

   1. 同步代码块
   2. 实例方法上使用synchroized
   3. 静态方法上使用synchroized，代表类锁，类锁永远只有一把

10. 死锁：不出异常，也不会出现错误

    ```java
        public void run() {
            if (Thread.currentThread().getName().equals("t1")){
                synchronized (m1){ 
                    try {
                        Thread.sleep(1000);
                    } catch (InterruptedException e) {
                        e.printStackTrace();
                    }
                    synchronized (m2){//锁m2时，等待t2执行完毕；构成死锁
                        System.out.println("t1");
                    }
                }
            }
            if (Thread.currentThread().getName().equals("t2")){
                synchronized (m2){
                    try {
                        Thread.sleep(1000);
                    } catch (InterruptedException e) {
                        e.printStackTrace();
                    }
                    synchronized (m1){//锁m1时，等待t1执行完毕；构成死锁
                        System.out.println("t2");
                    }
                }
            }
        }
    ```

11. 开发中解决线程安全问题

    1. 尽量使用局部变量代替“实例变量和静态变量”
    2. 如果必须是实例变量，那么可以创建多个对象
    3. 如果上面两条都不可以使用，那么才选择synchroized同步代码块。线程同步机制

### 守护线程

1. 线程分类

   1. 用户线程
   2. 守护线程（后台线程），垃圾回收机制

2. 守护线程特点：一般守护线程是一个死循环，所有的用户线程结束，守护线程自动结束

3. 在线程启动之前设置为守护线程：t.setDaemon(true)；将t线程设置为守护线程

4. 代码示例

   ```java
   public class ThradTest07 {
       public static void main(String[] args) {
           Thread t = new MyThrad07();
           t.setDaemon(true);//设置为守护线程
           t.start();
           for (int i=0;i<10;i++){
               try {
                   Thread.sleep(1000);
               } catch (InterruptedException e) {
                   e.printStackTrace();
               }
               System.out.println(Thread.currentThread().getName()+"-->"+i);
           }
       }
   }
   
   class MyThrad07 extends Thread {
       @Override
       public void run() {
           int i = 0;
           while (true) {
               try {
                   Thread.sleep(1000);
               } catch (InterruptedException e) {
                   e.printStackTrace();
               }
               System.out.println(Thread.currentThread().getName() + "-->" + i++);
           }
       }
   }
   ```

   

### 定时器

Java.util.Timer

1. 作用：间隔特定时间，执行特定程序

2. 创建定时器时，传入true参数，代表是守护线程

3. timer.schedule(定时任务，首次执行时间，间隔多久执行一次)

4. 定时任务需要自己编写，继承TimeTask抽象类

5. 代码示例

   ```java
   public class TimerTest {
       public static void main(String[] args) throws ParseException {
           Timer timer=new Timer();//创建定时器
           //Timer timer=new Timer(true);//创建守护线程定时器
           SimpleDateFormat sdf=new SimpleDateFormat("yyyy-MM-dd HH:mm:ss SSS");
           Date date=sdf.parse("2020-07-16 01:05:00 000");
           timer.schedule(new TimerTask() { //创建计划任务，匿名内部类方式
               @Override
               public void run() {
                   System.out.println(new Date());
               }
           },date,3000);
       }
   }
   ```

   

### 实现线程的第三种方式

1. JDK8新特性；实现Callable接口；优点：可以获取返回结果；缺点：效率较低

2. 这种方式实现的线程，可以获取线程的返回值

3. 首先创建一个“未来任务类”对象new FutureTask(...)，参数非常重要，需要给一个Callable接口实现类对象；然后创建线程对象new Thread(task)

4. 获取返回值：task.get()获取线程返回结果，会导致main()方法受阻（等待线程执行结果）

5. 代码示例

   ```java
   public class ThreadTest07 {
       public static void main(String[] args) throws ExecutionException, InterruptedException {
           FutureTask task=new FutureTask(new Callable() {//采用匿名内部类
               @Override
               public Object call() throws Exception {
                   System.out.println(Thread.currentThread().getName()+"线程执行");
                   Thread.sleep(1000);//睡1s
                   return 100+200;//自动装箱（Integer）
               }
           });
           Thread t=new Thread(task);
           t.start();//启动线程
           System.out.println(task.get());//调用Integer的toString方法，当前线程会阻塞，等待返回结果
           System.out.println("main结束");
       }
   }
   ```


### wait与notify方法

1. wait和notify是Object的方法，每个Java对象都有的方法

2. o.wait()表示，让正在o对象上活动的线程进入等待状态，无期限等待，直到调用o.notify()；o.notify()表示，唤醒正在o对象上等待的线程；notifyAll方法唤醒o对象上处于等待的所有线程

3. wait与notify建立在线程同步的基础之上，因为多线程要同时操作一个仓库，有线程安全问题；o.wait()方法是让o对象上活动的线程t进入等待状态，并且释放掉t线程之前占有的锁；o.notify()方法，让正在o对象上等待的线程唤醒，只是通知，不会释放o对象上之前占有的锁

4. 生产者消费者模式代码

   ```java
   public class ThreadTest08 {
       public static void main(String[] args) {
           ArrayList<Object> house = new ArrayList<>();//仓库
           Thread p = new Thread(new Producter(house));//生产者
           Thread c = new Thread(new Cunsumer(house));//消费者
           p.setName("生产者");
           c.setName("消费者");
           p.start();
           c.start();
       }
   }
   
   class Producter implements Runnable { //生产者
       ArrayList<Object> list;//仓库
   
       public Producter(ArrayList<Object> list) {
           this.list = list;
       }
   
       @Override
       public void run() {
           while (true) {
               synchronized (list) {//notify唤醒概率一样
                   System.out.println("producter");
                   if (this.list.size() > 0) {
                       try {
                           list.wait();
                       } catch (InterruptedException e) {
                           e.printStackTrace();
                       }
                   }
                   Object o = new Object();
                   list.add(o); //生产者生产
                   System.out.println(Thread.currentThread().getName() + "-->" + o);
                   list.notify();//唤醒在此对象上等待的单个线程
               }
           }
       }
   }
   
   class Cunsumer implements Runnable {//消费者
       ArrayList<Object> list;//仓库
   
       public Cunsumer(ArrayList<Object> list) {
           this.list = list;
       }
   
       @Override
       public void run() {
           while (true) {
               synchronized (list) {
                   System.out.println("cunsumer");
                   if (list.size() == 0) {
                       try {
                           list.wait();
                       } catch (InterruptedException e) {
                           e.printStackTrace();
                       }
                   }
                   Object o = list.remove(0);
                   System.out.println(Thread.currentThread().getName() + "-->" + o);
                   list.notify();
               }
           }
       }
   }
   ```

### 线程池

> 为什么使用线程池

线程池提供了一种限制和管理资源（包括执行一个任务）。每个线程池还维护一些基本统计信息，例如已完成任务的数量

线程池的好处

1. 降低资源消耗：通过重复利用已创建好的线程降低线程创建和销毁造成的消耗
2. 提高响应速度：当任务到达时，任务可以不需要等待线程的创建就能立即执行
3. 提高线程的可管理性：线程时稀有资源，如果无限制的差古剑，不仅会消耗系统资源，还会降低系统的稳定性，使用线程池可以进行统一分配，调优和监控

> Java提供的4种线程池

1. `FixedThreadPool：`该方法返回一个固定数量的线程池。该线程池的数量始终保持不变。当有一个新的任务提交时，线程池中若有空闲，则立即执行。若没有，则新的任务会被暂存在一个任务队列中，待线程空闲时，便处理在任务队列中的任务。
2. `SingleThreadExector：`方法返回只有一个线程的线程池。若多余的一个任务被提交到线程池，任务会被保存在一个队列中，待线程空闲，按先入先出的顺序执行队列中的任务
3. `CachedThreadPool：`该方法返回一个可根据实际情况调整线程数量的线程池。线程池数量不确定，但若有空闲线程可以复用，则会优先使用可复用的线程。若所有线程都在工作，又有新的任务被提交，则会创建新的线程处理任务。所有线程执行完毕后，将返回线程池进行复用。
4. `ScheduledThreadPoolExecutor：`主要用来在给定的延时后运行任务，或者定期执行任务；ScheduledThredPollExecutor又分为：ScheduledThreadPoolExecutor（包含多个线程）和SingleThreadScheduledExecutor （只包含一个线程）两种

> 各种线程池的使用场景介绍

- FixedThreadPool：适用于为了满足资源需求，而需要限制当前线程数量的应用场景。它适用于负载比较重的服务器
- SingleThreadExecutor：适用于需要保证顺序的执行各个任务，并且在任意时间不会有多个线程是活动的场景
- CachedThreadPool：使用于执行很多的短期异步任务的小程序，或者负载较轻的服务器
- SingleThreadScheduledExecutor：适用于单个后台线程执行周期任务，同时保证顺序的执行各个任务的应用场景

> 创建线程池的方式

1. 使用`Executors`创建：规定不允许使用这种方法，而是采用ThreadPoolExector创建，这样可以更清楚地知道线程池运行的规则，规避资源耗尽的风险

   ```tex
   Executors 返回线程池对象的弊端如下： FixedThreadPool 和 SingleThreadExecutor ： 允许请求的队列长度为 Integer.MAX_VALUE,可能堆积大量的请 求，从而导致OOM。 CachedThreadPool 和 ScheduledThreadPool ： 允许创建的线程数量为 Integer.MAX_VALUE ，可能会创建大量线程，从而导致OOM。
   ```

   

2. `ThreadPoolExector`的构造函数创建

   我们可以自己直接调用 ThreadPoolExecutor 的构造函数来自己创建线程池。在创建的同时，给 BlockQueue 指定容量就可以了

   ```java
   private static ExecutorService executor = new ThreadPoolExecutor(13, 13, 60L, TimeUnit.SECONDS, new ArrayBlockingQueue(13));
   ```

   这种情况下，一旦提交的线程数超过当前可用线程数时，就会抛出Java.util.concurrent.RejectedExecutionException，这是因为当前线程池使用的队列是有边界队列，队列已经满了便无法继续处理新的请求。但是异常（Exception）总比发生错误（Error）要好。

3. 使用开源类库

   Hollis 大佬之前在他的文章中也提到了：“除了自己定义ThreadPoolExecutor外。还有其他方法。这个时候第一时间就应该想到开源类库，如apache和guava等。”他推荐使用guava提供的ThreadFactoryBuilder来创建线程池。他推荐使用guava提供的ThreadFactoryBuilder来创建线程池。下面是参考他的代码示例

   ```java
   public class ExecutorsDemo { 
       private static ThreadFactory namedThreadFactory = new ThreadFactoryBuilder() .setNameFormat("demo-pool-%d").build();
       private static ExecutorService pool = new ThreadPoolExecutor(5, 200, 0L, TimeUnit.MILLISECONDS, new LinkedBlockingQueue<Runnable>(1024), namedThreadFactory, new ThreadPoolExecutor.AbortPolicy()); 
       public static void main(String[] args) {
           for (int i = 0; i < Integer.MAX_VALUE; i++) { pool.execute(new SubThread()); } 
       }
   ```

> 工作队列

1. ArrayBlockingQueue：基于数组的有界阻塞队列，按FIFO排序。新任务进来后，会放到该队列的队尾，有界的数组可以防止资源耗尽问题
2. LinkedBlockingQuene：基于链表的无界阻塞队列（其实最大容量为Interger.MAX）
3. SynchronousQuene：一个不缓存任务的阻塞队列，生产者放入一个任务必须等到消费者取出这个任务。也就是说新任务进来时，不会缓存，而是直接被调度执行该任务，如果没有可用线程，则创建新线程，如果线程数量达到maxPoolSize，则执行拒绝策略。
4. PriorityBlockingQueue：具有优先级的无界阻塞队列，优先级通过参数Comparator实现。

> 拒绝策略

1. CallerRunsPolicy：该策略下，在调用者线程中直接执行被拒绝任务的run方法，除非线程池已经shutdown，则直接抛弃任务
2. AbortPolicy：该策略下，直接丢弃任务，并抛出RejectedExecutionException异常
3. DiscardPolicy：该策略下，直接丢弃任务，什么都不做
4. DiscardOldestPolicy：该策略下，抛弃进入队列最早的那个任务，然后尝试把这次拒绝的任务放入队列

> 线程池执行流程

- 任务数 <= 核心池大小
  - 则每添加一个任务就会创建一个线程来执行该任务,线程最大数量等于核心池大小
- 最大线程数>任务数 > 核心池大小 && 设置的队列没有满
  - 任务放入到阻塞队列中
- 最大线程数>任务数 > 核心池大小&&设置的队列满了
  - 则会创建新的线程来处理新的任务
- 任务数 > 最大池大小
  - 则会采用拒绝策略handler
- 核心线程数==最大线程数量
  - 当任务等于核心线程数的时候，任务都往队列里面放，这时候不创建线程(因为允许的核心线程等于最大线程)

> 创建线程池重要参数

ThreadPoolExecutor构造函数重要参数分析

1. ThreadPoolExecutor 3 个最重要的参数
   1. `corePoolSize` : 核心线程数线程数定义了最小可以同时运行的线程数量。
   2. `maximumPoolSize` : 当队列中存放的任务达到队列容量的时候，当前可以同时运行的线程数量变为最大线程数。
   3. `workQueue`: 当新任务来的时候会先判断当前运行的线程数量是否达到核心线程数，如果达到的话，信任就会被存放在队列中
2. ThreadPoolExecutor其他常见参数
   1. `keepAliveTime`:当线程池中的线程数量大于 corePoolSize 的时候，如果这时没有新的任务提交，核心线程外的线程不会立即销毁，而是会等待，直到等待的时间超过了 keepAliveTime才会被回收销毁
   2. `unit` : keepAliveTime 参数的时间单位
   3. `threadFactory` :executor 创建新线程的时候会用到
   4. `handler` :饱和策略。关于饱和策略下面单独介绍一下

## 反射机制

Java.lang.refelct.*

### 简介

1. 通过Java语言中的反射机制可以直接操控字节码文件（有点像是黑客）
2. 字节码文件在装载到JVM方法区时，只装载一次
3. 反射机制相关重要类
   1. Java.lang.Class：代表字节码文件（整个类）
   2. Java.lang.reflect.Method：代表字节码中方法（类中方法）
   3. Java.lang.reflect.Constructor：代表字节码中构造方法（类中构造方法）
   4. Java.lang.reflect.Field：代表字节码中的属性（类中成员变量）
4. 获取某个类字节码(class)的三种方法
   1. Class.forName()：静态方法；方法参数是一个完整类名（字符串）；完整类名必须包含包名，Java.lang也不能省略
   2. Java中任何对象都有getClass()方法，通过这个方法获取字节码文件；Class a=o.getClass()
   3. Java中任何一种数据类型（包括基本数据类型）都有.class属性；Class a=String.class
5. 获取Class后，调用newInstance()：反射机制创建对象（调用无参构造方法），该方法已经过时

### 作用

1. 可以通过properties将数据读入，然后可以修改配置文件灵活的创建类，大部分框架都是使用反射机制实现

2. 代码示例

   ```java
       public static void main(String[] args) throws Exception{
           //字符输入流
           FileReader fr=new FileReader("module01/src/io/leiking/Javasestud/test07/class.properties");
           Properties pt = new Properties();//属性集合
           pt.load(fr);//从文件读取数据存入该集合
           Class cl=Class.forName(pt.getProperty("className"));//通过反射机制获取类
           System.out.println(cl.newInstance());//通过反射机制创建对象
       }
   ```

### Class.forName()

1. 这个方法会将类加载到JVM中，类中static静态代码块（类加载执行，且只执行一次）中的内容，会在这个方法调用时运行

### Field(反射属性)

1. Class.getFields() 获取类中的所有public属性名字；Class.getDeclaredFields() 获取类中所有属性名字

2. Filed.getType；返回一个Class，调用Class.getName()，可以获取属性的类型；Class.getSimpleName()，获取简单类型；Class.getDeclaredField(name)获取一个名为name的属性

3. Field.getModifirer()，返回值是int，是修饰符的代号；可以使用Modifier.toString(int)，这个方法可以将修饰代号转换为修饰符字符串

4. 通过反射机制获取Java对象属性

   1. 给属性赋值set：Field.set(obj,222)，给某个对象的该属性赋值（obj对象，no属性，222值）
   2. 获取属性的值get：Field.get(obj)，获取某个对象的属性的值（obj对象，no属性）
   3. Field.setAccessible(true)，可以打破封装，访问私有属性

5. 代码示例

   ```java
       public static void main(String[] args) throws Exception {
           Student obj=new Student();
           Class stu=Class.forName("io.leiking.Javasestud.test07.Student");
           Field no=stu.getDeclaredField("no"); //获取某一个属性
           no.setAccessible(true);//打破封装，访问类的私有变量
           no.set(obj,100);//通过反射机制设置属性值
           System.out.println(obj.getNo());
           System.out.println(no.get(obj));//通过反射机制获取属性值
       }
   ```

6. 反编译代码

   ```java
       public static void main(String[] args) throws Exception{
           Class c=Class.forName("io.leiking.Javasestud.test07.Student");
           StringBuffer sb=new StringBuffer();
           sb.append(Modifier.toString(c.getModifiers())+" class "+c.getSimpleName());
           sb.append("{");
           for (Field f:c.getDeclaredFields()){
               //修饰符代号转化为字符串+属性类型转换为简易标志+属性名字
               sb.append("\n"+Modifier.toString(f.getModifiers())+" "+f.getType().getSimpleName()+" "+f.getName());
           }
           sb.append("\n}");
           System.out.println(sb);
       }
   ```

### Method（反射方法）

1. 获取方法：Class.getDeclaredMethod("login",String.class,String.class)；Class.getDeclaredMethods()，返回一个Method数组，包含所有方法

2. 调用方法：Object retValue=Method.invoke(obj,...)

3. 代码示例
   调用方法

   ```java
       public static void main(String[] args) throws Exception{
           Class stuClass=Class.forName("io.leiking.Javasestud.test07.Student");
           Student stu=new Student();
           //获取方法
           Method doMethod=stuClass.getMethod("doSome", String.class, int.class);
           doMethod.invoke(stu,"LEI",125);//调用方法，传入对象
       }
   ```

   反编译

   ```java
       public static void main(String[] args) throws Exception{
           Class stuClass=Class.forName("io.leiking.Javasestud.test07.Student");
           StringBuffer sb=new StringBuffer();
           sb.append(Modifier.toString(stuClass.getModifiers())+" class "+stuClass.getSimpleName()+" {\n");
           Method[] ms=stuClass.getDeclaredMethods();
           for (Method m:ms){
               sb.append(Modifier.toString(m.getModifiers())+" ");//获取修饰符列表代号并转换为字符
               sb.append(m.getReturnType().getSimpleName()+" ");//获取返回值类型并转换为简写
               sb.append(m.getName()+"("); //获取方法名
               Class[] o=m.getParameterTypes();//根据参数列表申明顺序返回类型数组
               for (int i=0;i<o.length;i++){
                   sb.append(o[i].getSimpleName()+((i<o.length-1)?",":""));
               }
               sb.append(")"+"{"+"}"+"\n");
           }
           sb.append("}");
           System.out.println(sb);
       }
   ```

###  Constructor

1. 代码示例（调用构造方法）

   ```java
       public static void main(String[] args) throws Exception{
           Class stuClass=Class.forName("io.leiking.Javasestud.test07.Student");
           Constructor[] cs=stuClass.getConstructors();//获取所有构造方法
           for (Constructor c:cs){
               System.out.println(c.getParameterTypes().length);//输出构造方法参数列表个数
           }
           Constructor c1=stuClass.getConstructor(int.class);//获取一个构造方法，参数列表为一个int
           Object o1=c1.newInstance(123);//调用有参构造方法创建对象
           Constructor c2=stuClass.getConstructor();//获取一个构造方法，参数列表为一个int
           Object o2=c2.newInstance();//调用无参构造方法创建对象
           System.out.println(o1);
           System.out.println(o2);
       }
   ```

   

2. 代码示例(反编译构造方法)

   ```java
       public static void main(String[] args) throws Exception{
           Class stuClass=Class.forName("io.leiking.Javasestud.test07.Student");
           StringBuffer sb=new StringBuffer();
           sb.append(Modifier.toString(stuClass.getModifiers())+" class "+stuClass.getSimpleName()+"{\n");
           Constructor[] constructors=stuClass.getConstructors();
           for (Constructor c:constructors){
               sb.append("\t"+Modifier.toString(c.getModifiers())+" "+stuClass.getSimpleName());
               sb.append("(");
               Class[] params=c.getParameterTypes();
               for (Class param:params){
                   sb.append(param+",");
               }
               if (params.length>0){
                   sb.deleteCharAt(sb.length()-1);//删除某个下标字符串
               }
               sb.append("){ }\n");
           }
           sb.append("}");
           System.out.println(sb);
       }
   ```

### path问题

1. IDEA的相对路径移植性差；第二种方法，移植性好。注意：需要文件在类路径下（src下都是类路径，src是类的跟路径）；

2. Thread.currentThread().getContextClassLoader().getResource("filename").getPath()；可以拿到一个绝对路径,是通用的；getContextClassLoader()是线程对象的方法，可以获取到当前线程的类加载器对象；getResource()，（获取资源）这是类加载器对象的方法，当前线程的类加载器默认从类的根路径下加载资源

3. Thread.currentThread().getContextClassLoader().getResourceAsStream("filename")：直接以流的形式返回数据，不需要接触到绝对路径

4. 代码示例

   ```java
       public static void main(String[] args) throws Exception{
   /*        //src下获取绝对路径
           String path=Thread.currentThread().getContextClassLoader().getResource("class.properties").getPath();
           FileReader fr=new FileReader(path);//字符输入流
           */
           //以流的形式返回
           InputStream fr= Thread.currentThread().getContextClassLoader().getResourceAsStream("class.properties");
           Properties pt = new Properties();//属性集合
           pt.load(fr);//从文件读取数据存入该集合
           Class cl=Class.forName(pt.getProperty("className"));//通过反射机制获取类
           System.out.println(cl.newInstance());//通过反射机制创建对象
       }
   ```

### 资源绑定器

1. Java.util包下提供了一个资源绑定器，便于获取属性配置文件中的内容；使用这种方法时，属性配置文件xx.properties必须放到类路径下，文件扩展名必须为properties

2. 在获取xxx.properties属性配置文件时，后面必须扩展名省略；属性配置文件必须在类路径下

3. 代码示例

   ```java
       public static void main(String[] args) throws Exception {
           ResourceBundle rb=ResourceBundle.getBundle("class");//资源绑定器，class.properties，省略后缀扩展名
           String s=rb.getString("className");//获取某个键的值
           Object a=Class.forName(s).newInstance();//反射机制创建对象
           System.out.println(a);
       }
   ```

### 类加载器

1. 类加载器专门负责加载类的命令/工具；ClassLoader
2. JDK自带三个类加载器：启动类加载器；扩展类加载器；应用类加载器
3. 假设有代码：String s="abc"
   代码在开始执行前，会将所有的类全部加载到JVM中
   通过类加载器加载，看到以上代码，类加载器会找到String.class文件，找到就加载
   1. 首先通过”启动类加载器“（父加载器）
      注意：启动类加载器专门加载：”jdk/jre/lib/rt.jar“文件，rt.jar都是JDK最核心类库
   2. 如果”启动类加载器“找不到，会通过”扩展类加载器“（母加载器）加载
      注意：”扩展类加载器“专门加载：jdk/jre/lib/ext下的class文件
   3. 如果”扩展类加载器“找不到，会通过”应用类加载器“加载
      注意：应用类加载器专门加载：classpath中的类
4. Java中为了保证类加载的安全，使用了双亲委派机制；优先从”启动类加载器“加载，称为”父“；其次从”扩展类加载器“加载，成为”母“；最后才是应用类加载器

### 其他

1. 可变长参数，int... args就是可变长参数，语法是...；可变长参数个数为0~n；可变长参数在参数列表必须在最后面，且只能有一个；可变长参数可以当作一个数组看待

   ```java
       public static void main(String[] args) {
           dosome(1,2,3);
           int[] is={1,2,3,4};
           dosome(is);//可变长参数可以传入一个数组
       }
       public static void dosome(int... a){//可变长参数，有且只能有一个，并且放在参数列表末尾
           for (int i:a){//可变长参数可以看作一个数组
               System.out.print(i);
           }
           System.out.println();
       }
   ```

2. 获取一个类的父类和接口

   ```java
       public static void main(String[] args) throws Exception{
           Class strClass=Class.forName("Java.lang.String");
           Class c=strClass.getSuperclass();//获取父类
           System.out.println(c.getName());
           Class[] ims=strClass.getInterfaces();//获取所有实现的接口
           for (Class cl:ims){
               System.out.println(cl.getName());
           }
       }
   ```

### 获取Class的三种方式

1. Class cl=A.class; 
    JVM将使用类A的类装载器, 将类A装入内存(前提是:类A还没有装入内存),不对类A做类的初始化工作.返回类A的Class的对象。
2. Class cl=对象引用o.getClass();
   返回引用o运行时真正所指的对象(因为:子对象的引用可能会赋给父对象的引用变量中)所属的类的Class的对象 。
3. Class.forName("类名");
   装入类A,并做类的初始化

4. .getClass()是动态的，其余是静态的。

   .class和class.forName()只能返回类内field的默认值，getClass可以返回当前对象中field的最新值

   Class.forName() 返回的是一个类,.newInstance() 后才创建一个对象，Class.forName()的作用是要求JVM查找并加载指定的类，也就是说JVM会执行该类的

## 动态代理

### 代理

1. 代购、中介、商家等 都是生活中的代理
2. A类，本来调用C类的方法，完成某个功能，但是C类不让A类调用
   A类----不能调用C类中方法
   在A和C之间直接创建一个B类代理，C类允许B类访问
   A类-----访问B类-----访问C类
   此时B就是代理；A、B、C之间的关系就是：代理模式

### 代理模式作用

1. 功能增强：在原有的功能上增加了新的功能
2. 控制访问：代理类不让你直接访问目标，例如商家不允许用户访问厂家

### 静态代理

1. 代理类是自己手工实现的，自己创建一个Java类，表示代理类
2. 同时你所需要代理的目标类是确定的
3. 代理类一定会调用目标类的方法（因为自己没有）
4. 静态代理特点
   1. 实现简单
   2. 容易理解
5. 静态代理缺点
   1. 当目标类增多，代理类可能需要成倍的增加
   2. 当接口中功能增加，影响很多实现类（目标类、代理类）

```java
//接口
public interface UsbSell {
    /**
     * 购买u盘
     * @param amount 购买数量
     * @return 返回价格
     */
    float sell(int amount);

}

//厂家，目标类
public class UsbKingFactory implements UsbSell {
    @Override
    public float sell(int amount) {
        float price=amount*2;
        System.out.println("厂家");
        return price;
    }
}

//商家，代理类
public class TaoBao implements UsbSell {
    private UsbKingFactory factory=new UsbKingFactory();
    @Override
    public float sell(int amount) {
        float price=factory.sell(amount);
        price+=25; //功能增强
        System.out.println("淘宝商家");
        return price;
    }
}

//用户
public class ShopMain {
    public static void main(String[] args) {
        TaoBao taoBao=new TaoBao();
        float price=taoBao.sell(2);
        System.out.println(price);
    }
}

//以上 用户--商家（代理类）--厂家（目标类） 构成了代理模式
```



### 动态代理

1. 在静态代理中目标类很多时，可以使用动态代理，避免静态代理的缺点
2. 在程序的执行过程中，使用jdk的反射机制，创建代理类对象，并动态的指定要代理的目标类（不需要创建代理类，就能直接创建代理对象）
3. 优点
   1. 代理类数量可以很少
   2. 当你修改了接口中方法时，不会影响代理类

> 动态代理实现方式

1. JDK代理方式（掌握）
   1. 使用Java反射包中的类和接口实现动态代理功能
   2. 反射包 Java.lang.reflect，里面有三各类：InvocationHandler、Method、Proxy
   3. 必须有接口
2. CGLIB动态代理（了解）
   1. cglib是第三方的工具类，创建代理对象
   2. cglib的原理是继承，通过继承目标类，创建它的子类，在子类中重写父类中同名的方法，实现功能的修改
   3. 因为cglib是继承，重写方法；所以要求目标类不能是final，方法不能是final；要求比较宽松，只要是能继承的就可以了；用于许多框架，效率高于jdk

> jdk动态代理

   1. 反射，Method类，表示方法。类中的方法，通过Method可以执行某个方法；独立的方法对象

   2. 反射包 Java.lang.reflect ；里面有三个类：InvocationHandler、Method、Proxy

   3. InvocationHandler接口（调用处理器）：就一个方法invoke()

      1. invoke()：代表代理对象要执行的功能代码，代理类要完成的功能就卸载invoke()方法中
      2. 调用目标方法，执行方法功能
      3. 功能增强，在目标方法调用时，增加功能
      4. 使用：创建类实现接口InvocationHandler；重写invoke()方法
      5. 方法原型

      ```java
      //proxy，jdk创建的代理对象，无需赋值
      //method：目标类的方法，jdk提供method对象的
      //args，目标类方法的参数，jdk提供的
      public Object incoke(Object proxy,Method method,Object[] args)
      ```

      

   4. Method类：表示方法，确切说就是目标类中的方法

      1. 通过Method可以执行某个目标类的方法，Method.invoke()
      2. method.incoke(目标对象，方法参数)

   5. Proxy类：核心对象，创建代理对象。使用Proxy类的方法，代替new的使用

      1. 方法：静态方法 newProxyInstance()；用于创建代理对象，等同于静态代理中的new TaoBao()
      2. 方法原型

      ```java
      //ClassLoader类加载器，负责向内存中加载对象的。使用反射获取对象ClassLoader obj.getClass().getClassLoader() 目标对象的类加载器
      //interfaces 目标对象所实现的接口，反射获取
      //InvocationHandler 我们自己写的，代理类需要完成的功能
      //返回值是一个代理对象（TaoBao）
      public static Object newProxyInstance(ClassLoader loader,Class<?>[] interfaces,InvocationHandler h)
      ```

> 实现动态代理步骤

1. 创建接口，定义目标类要完成的功能

2. 创建目标类实现接口

3. 创建InvocationHandler接口实现类，在invoke方法中完成代理类的功能（调用目标方法、增强功能）

4. 使用Proxy类的静态方法，创建代理对象，并发返回值转为接口类型

   ```java
   //接口
   public interface UsbSell {
       /**
        * 购买u盘
        * @param amount 购买数量
        * @return 返回价格
        */
       float sell(int amount);
   }
   
   //目标类，实现接口
   public class UsbKingFactory implements UsbSell {
       @Override
       public float sell(int amount) {
           float price=amount*2;
           System.out.println("厂家");
           return price;
       }
   }
   
   //InvocationHandler实现类
   public class UsbHandler implements InvocationHandler {
       private Object obj;
   
       public UsbHandler(Object obj) {
           this.obj = obj;
       }
   
       @Override
       public Object invoke(Object proxy, Method method, Object[] args) throws Throwable {
           Object res=null;
           //执行目标方法，需要目标对象
           res=method.invoke(obj,args);
           if (res!=null){
               Float price=(Float)res+25;
               res=price;
           }
           return res;
       }
   }
   
   //用户类 调用
   public class Test02 {
       public static void main(String[] args) {
           //创建目标对象
           UsbKingFactory factory=new UsbKingFactory();
           //创建UsbHandler对象，并传入目标对象
           InvocationHandler handler=new UsbHandler(factory);
           //通过反射机制创建代理对象
           UsbSell sell=(UsbSell)Proxy.newProxyInstance(factory.getClass().getClassLoader(),
                   factory.getClass().getInterfaces(),
                   handler);
           //通过动态代理对象调用方法
           Float price=sell.sell(6);
           System.out.println(price);
       }
   }
   
   //proxy动态代理对象执行方法-->调用InvocationHandler对象中的invoke()方法-->返回给调用者
   ```

> 意义

1. 可以在不改变原来目标方法功能的前提下，可以在代理中增强自己的功能代码，在InvocationHandler 实现类的invoke()中书写

### Mybatis的动态代理工具类

```java
public class TransactionInvocationHandler implements InvocationHandler {
    private Object target;

    public TransactionInvocationHandler(Object target) {
        this.target = target;
    }

    @Override
    public Object invoke(Object proxy, Method method, Object[] args) throws Throwable {
        SqlSession sqlSession=null;
        Object obj=null;
        try{
            sqlSession=SqlSessionUtil.getSqlSession();
            //处理业务逻辑
            obj=method.invoke(target,args);
            //业务逻辑完毕后，提交事务
            sqlSession.commit();
        }catch (Exception e){
            //出错回滚
            sqlSession.rollback();
            e.printStackTrace();
        }finally {
            SqlSessionUtil.closeSqlSession(sqlSession);
        }
        return obj;
    }

    /**
     * 取得代理对象
     * @return 代理对象
     */
    public Object getProxy(){
        return Proxy.newProxyInstance(target.getClass().getClassLoader(),
                target.getClass().getInterfaces(),
                this);
    }
}

```

### 实例

> dao层

1. 接口，在业务层通过mybatis自带的动态代理，获取代理对象

   ```java
   public interface StudentDao {
       public Student getById(String id);
       public void save(Student s);
   }
   ```

> 业务层

1. 接口

   ```java
   public interface StudentService {
       public Student getById(String id);
       public void save(Student s);
   }
   ```

   

2. 接口实现

   ```java
   public class StudentServiceImpl implements StudentService {
       //通过mybatis反射机制，取得dao层对象
       private StudentDao studentDao=
               SqlSessionUtil.getSqlSession().getMapper(StudentDao.class);
       @Override
       public Student getById(String id) {
           Student stud=null;
           stud=studentDao.getById(id);
           return stud;
       }
   
       @Override
       public Integer save(Student s) {
           return studentDao.save(s);
       }
   
       @Override
       public List<Student> getAll() {
           List<Student> students=null;
           students=studentDao.getAll();
           return students;
       }
   }
   ```

> 工具类

1. SqlSession工具类

   ```java
   public class SqlSessionUtil {    private static SqlSessionFactory sessionFactory;    //静态代码块，只执行一次，类被加载时    static {        try {            InputStream inputStream= Resources.getResourceAsStream("mybatis-config.xml");            sessionFactory=new SqlSessionFactoryBuilder().build(inputStream);        } catch (IOException e) {            e.printStackTrace();        }    }    //私有化构造方法    private SqlSessionUtil(){}    //线程变量,意思是ThreadLocal中填充的变量属于当前线程，该变量对其他线程而言是隔离的；保证同一个SqlSession对象    private static ThreadLocal<SqlSession> t=new ThreadLocal<>();    //取得SqlSession对象    public static SqlSession getSqlSession(){        SqlSession sqlSession=t.get();        if (sqlSession==null){            sqlSession=sessionFactory.openSession();            t.set(sqlSession);        }        return sqlSession;    }    //关闭SqlSession对象    public static void closeSqlSession(SqlSession sqlSession){        if (sqlSession!=null){            sqlSession.close();        //用户发送请求，服务器分配一条线程，执行结束后，线程回到线程池中，并没有被销毁；所以需要移除，保证线程的干净            t.remove();        }    }}
   ```

2. 动态代理对象工具类

   ```java
   public class TransactionInvocationHandler implements InvocationHandler {    private Object target;    public TransactionInvocationHandler(Object target) {        this.target = target;    }    @Override    public Object invoke(Object proxy, Method method, Object[] args) throws Throwable {        SqlSession sqlSession=null;        Object obj=null;        try{            sqlSession=SqlSessionUtil.getSqlSession();            //处理业务逻辑            obj=method.invoke(target,args);            //业务逻辑完毕后，提交事务            sqlSession.commit();        }catch (Exception e){            //出错回滚            sqlSession.rollback();            e.printStackTrace();        }finally {            SqlSessionUtil.closeSqlSession(sqlSession);        }        return obj;    }    /**     * 取得代理对象     * @return 代理对象     */    public Object getProxy(){        return Proxy.newProxyInstance(target.getClass().getClassLoader(),                target.getClass().getInterfaces(),                this);    }
   ```

3. 生成代理对象工具类

   ```java
   public class ServiceFactory {    private ServiceFactory(){};    public static Object getService(Object obj){        return new TransactionInvocationHandler(obj).getProxy();    }}
   ```

> 调用

```java
public class Test01 {    public static void main(String[] args) {        StudentService studentService=new StudentServiceImpl();        TransactionInvocationHandler handler=new TransactionInvocationHandler(studentService);        StudentService stud=(StudentService) handler.getProxy();        stud.getById("A0001");    }}
```

## 注解

### 简介

1. Annotation注解（注释）是一种引用数据类型，编译后生成的也是class文件
2. 注解相当于标记，如果元素有这个注解怎么做，没有这个注解怎么做
3. 语法格式：[修饰符列表] @interface 注解类名{...}
4. 使用：@注解类名
5. 默认情况下注解可以出现在类上，属性上，方法上，注解上....等·任意位置
6. JDK内置注解Java.lang下
   1. Deprecated用@Deprecated注释程序元素，意思是不推荐使用，危险或有更好的选择，标注的元素代表已过时的意思
   2. Override用@Override注解程序元素，用在方法上且此方法必须是重写的父类方法，给编译器做参考，只是在编译阶段作用，与运行期无关。编译器看到这个注解（标志）会检查方法是否为重写父类方法
7. Class.isAnnotationPresent(MyAnnotation.class)：判断Class类是否有MyAnnotation注解
8. 通过反射机制获取属性值；获取类->获取方法->判断该方法是否有注解->获取注解(Method.getAnnotation(MyAnnotation.class))

### 元注解

1. 元注解用来标注”注解类型“的注解，称为元注解
2. @Target，这是一个元注解，用来指定被标注的注解可以出现在哪些位置
   @Target(ElementType.METHOD)：表示该注解只能修饰方法
3. @Retention，这是一个元注解，用来标注注解最终会保存在哪
   @Retention(RetentionPolicy.SOURCE)：表示该注解只保留在Java源文件中
   @Retention(RetentionPolicy.CLASS)：表示该注解被保存在class文件中
   @Retention(RetentionPolicy.RUNTIME)：表示该注解被保存在class文件中，且可以被反射机制所读取

### 注解中属性

1. 通常可以在注解当中定义属性；String name()以上代码代表了注解的name属性；String name() default " "，代表给属性默认值
2. 如果一个注解中有属性，使用时必须给属性名赋值，@Annotation(属性名=值)；除非该属性有默认值；注解的属性名是value()时，给属性名赋值时可以省略value，直接给值
3. 注解属性前的类型可以是：基础数据类型及数组，Class，枚举类型

### 代码示例

1.

```java
    public static void main(String[] args) throws Exception{
        Class c=Class.forName("io.leiking.Javasestud.test08.AnnotationTest01");//获取类
        Method m=c.getMethod("doSome");//获取方法
        if (m.isAnnotationPresent(MyAnnotation.class)){//判断是否存在注解MyAntation
            MyAnnotation m1=m.getAnnotation(MyAnnotation.class); //获取注解
            System.out.println(m1.name());//获取注解属性值
            System.out.println(m1.no());//获取注解属性值
        }
    }
    @MyAnnotation(name = "tang",no = 24)
    public static void doSome(){
    }

	@Deprecated //该注解表示下面的方法已经过时
    public static void doOther(){
    }
```

```java
//元注解，表示该注解可以出现在哪些位置
@Target({ElementType.FIELD,ElementType.METHOD})

//元注解，表示该注解保存在class文件中，且能被反射机制读取
@Retention(RetentionPolicy.RUNTIME)
public @interface MyAnnotation {
    //String value();//该属性名单独出现。可以在使用时省略属性名，直接指定值
    String name();//注解的属性，在使用该注解必须给指定值
    int no() default 1;//注解属性，给定默认值1，可以在使用时不指定值
}
```

2.

```java
    public static void main(String[] args) {
        try {
            doSome();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
    public static void doSome() throws Exception{
        boolean a=false;
        Class uClass=Class.forName("io.leiking.Javasestud.test08.zongjie.User");
        if (uClass.isAnnotationPresent(MyAnnotation.class)){
            for (Field field:uClass.getDeclaredFields()){
                if ("id".equals(field.getName())&&"int".equals(field.getType().getSimpleName())){
                    a=true;
                }
            }
        }
        if (a==false){
            throw new Exception("@MyAnnitation注解修饰类必须有int id属性");
        }
    }

@Target(ElementType.TYPE) //表示只能修饰类
public @interface MyAnnotation {//注解
    MyEnum name();
}

@MyAnnotation(name = MyEnum.A)
public class User {
    private int name;
}
```











