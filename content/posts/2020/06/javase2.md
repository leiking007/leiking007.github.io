---
title: "JavaSE2"
date: 2020-06-09
lastmod: 2020-06-09
draft: false
tags: ['JavaSE']
categories: ["后端"]
author: "lei"
---

# JavaSE2

## 序言.IDEA使用

使用：安装--激活--启动--新建空工程--新建module(相当于eclipse中的包)

快速生成main()方法，**psvm**

快速生成System.out.println()，**sout**

删除一行，**ctrl+y**

IDEA退出任何窗口，**esc**

任何新建/新增，**alt+insert**
可新建类，创建构造方法，创建get、set，重写等

切换Java程序，**alt+左箭头/右箭头**

窗口变大变小，**ctrl+shift+f12**

打开某些窗口，**alt+1/2/3..**

查看方法或实例对象可以传送哪些参数，**ctrl+p**

运行当前程序，**alt+shift+f10**

Debug当前程序，**alt+shift+f9**

IDEA自动保存，不需要ctrl+s

运行，代码右键run、或者点击左侧箭头

## 面向对象

### final

1. final是Java中的关键字
2. final仅仅表示最终的 、不可变的
3. final可以修饰变量、方法、类等
4. final修饰的类，不能被继承
5. final修饰的方法，不能被重写
6. final修饰的变量，一旦赋值不能被更改；
   final修饰的实例变量，在构造方法中不再默认赋值，一般使用static修饰（final修饰不可改变，与对象无关），因此改为静态变量
   需要在声明时赋值或者在构造方法中赋值（赶在系统赋默认值之前）
7. final修饰的引用可以转型，可以修改指向内存对象的属性，但不能重新赋值
8. static  final修饰称为常量，建议全部大写，存储在方法区，类加载时初始化

代码实例：

```java
public class Hellow extends Person{
    int age;
    public Hellow(int age) {
        this.age=age;
    }
    public void speak(){
        System.out.println("i am "+this.age);
    }

    public void name() {
        System.out.println("我是儿子，我也没名字");
    }

    public static void main(String[] args) {
        final Person obj1=new Hellow(15);   //final修饰的引用
        obj1.name();
        Hellow obj2=(Hellow)obj1;   //final修饰的引用可以向下转型
        obj2.speak();
        System.out.println(obj2.number);    //输出12
    }
}

public class Person {
    int age;
    final int number;   //final修饰的实例变量，需要在构造方法中赋值，或者声明时赋值
    /*
    static final int number;//常量；类加载时，存储方法区
    static{	//类加载时，方法区
        number=16;
    }
    */
    public void name(){
        System.out.println("我没有名字");
    }
    public Person(){
        this.number=12;
    }
    public Person(int age) {
        this.number=12;
        this.age = age;
    }
} 
```

### 抽象类

定义：

1. 类与类之间有共同特征，将这些特征抽象出来，就是抽象类
2. 类本身不存在，所以抽象类不能实例化（无法创建对象），用于被子类继承使用；
3. 抽象类子类也可以是抽象类；抽象类有构造方法，供子类使用
4. 抽象方法，表示没有实现的方法，没有方法体，修饰符中有abstract修饰，例如：**public abstract void 名();**  抽象类中可以没有抽象方法，但抽象方法必须在抽象类中
5. 非抽象类继承抽象类，必须实现（重写）父类的抽象方法（抽象方法必须在抽象类中）

语法：[修饰符列表]  abstract  class  类名{    //类体；  }

### 接口

定义：

1. 接口完全抽象，抽象类半抽象；接口可以理解为特殊的抽象类
2. 接口支持多继承，一个接口继承多个接口
3. 接口中只有两部分内容：常量、抽象方法（没有方法体）
4. 接口中所有元素都是public修饰，其中抽象方法以及常量定义时可以省略修饰符
5. 类实现接口时，必须将接口中所有抽象方法实现（重写）
6. 一个类可以实现多个接口，弥补了类单继承的缺陷（而且接口引用间转型不需要继承关系）
7. 可以使用多态

语法：[修饰符列表]  **interface**  接口名{  }

​           class  类名  **implements**  接口名{}

代码实例

1.接口语法

```java
public class Hellow{
    public static void main(String[] args) {
        A a=new C();	//多态，向上转型
        B b=new C();	//多态，向上转型
        a.a();
        b.b();
        B b1=(B)a;  //接口转型，为了执行b方法，无需继承关系
        b1.b();
    }
}
interface A {
    void a();
}
interface B{
    void b();
}
class C implements A,B{
    public void a() {
        System.out.println("a方法实现");
    }
    public void b() {
        System.out.println("b方法实现");
    }
}
```

2.接口实现与类继承同时出现

```java
public class Hellow{
    public static void main(String[] args) {
        Animal a=new C();
        Fly a1=(Fly)a;  //转型，从而执行fly方法
        a1.fly();
    }
}
abstract class Animal {
    abstract void a(); 
}
interface Fly{
    abstract void fly();    //抽象方法
}
class C extends Animal implements Fly{ //继承Anmial并实现了Fly接口
    void a() {  //抽象方法重写
    }
    public void fly() { //接口实现
        System.out.println("飞翔");
    }
}
```

接口在开发中作用：

面向抽象编程，可以说成面向接口编程；面向接口编程（多态）可以降低程序耦合度，提高扩展性 ，符合ocp开发原则，理解下面源码

```java
public interface FoodMenu{	//抽象出来的接口
    void shiDan();  //西红柿炒鸡蛋
    void yuRou();   //鱼香肉丝
}

public class Test01 { 
    public static void main(String[] args) {
        FoodMenu chushi1=new Xchushi();//创建一个西餐厨师
        Guke guke1=new Guke(chushi1);//创建一个顾客，并给个西餐菜单
        guke1.order();  //点餐

        FoodMenu chushi2=new Zchushi();//创建一个中餐厨师
        guke1.setFoodMenu(chushi2);//向下转型，并给顾客一个中餐菜单
        guke1.order();  //点餐
    }
}
class Guke implements FoodMenu{
    private FoodMenu foodMenu;
    public void shiDan() {
    }
    public void yuRou() {
    }

    public Guke(FoodMenu foodMenu){
        this.setFoodMenu(foodMenu); //构造方法，传个菜单
    }
    public Guke(){}

    public FoodMenu getFoodMenu() {
        return foodMenu;
    }
    public void setFoodMenu(FoodMenu foodMenu) {
        this.foodMenu = foodMenu;
    }
    public void order(){//点餐动作
        //虽然是FoodMeun引用，但是底层实例是调用者传过来的厨师，因此该方法调用的应该是厨师相关
        this.getFoodMenu().shiDan();
        this.getFoodMenu().yuRou();
    }
}
class Zchushi implements FoodMenu{//中餐厨师,实现接口方法
    public void shiDan() {
        System.out.println("中餐西红柿鸡蛋");
    }
    public void yuRou() {
        System.out.println("中餐鱼香肉丝");
    }
}
class Xchushi implements FoodMenu{//西餐厨师,实现接口方法
    public void shiDan() {
        System.out.println("西餐西红柿鸡蛋");
    }
    public void yuRou() {
        System.out.println("西餐鱼香肉丝");
    }
}
```

分析：任何一个接口都有调用者和实现者；接口可以实现调用者与实现者解耦合；调用者面向接口调用；实现者面向接口编写

### 其他

但凡满足：**has a**都采用属性，例如，鸟有一个眼睛；类似于**is a**都可以使用继承

1. is a：Cat **is a** Animal；表示继承关系；A extends B
2. has a：I **has a** Pen；关联关系，属性方式存在；A{ B }
3. like a：Coker **like a** FoodMenu；表实现关系，类实现接口；A implements B

抽象类：单继承；有构造方法；半抽象

接口：多实现；没有构造方法；完全抽象（使用比较多）

## 包和访问权限

### package

**包（package）介绍：**包机制方便程序的管理；不同功能的类放在不同的包下

**包使用：**package	io.leiking.Javasestud.chapes01；只能出现在源代码第一行

**包命名规范：**公司域名倒序+项目名+模块名+功能名

**运行：**普通编译带有package程序，类名变了，为：io.leiking.Javasestud.chapes01.Hellow；**Javac  -d  .  Hellow.Java**，该命令代表编译指定目录，当前目录，-d带包编译，. 点代表当前目录；运行：Java io.leiking.Javasestud.Test08；

**import：**同一包下使用类，可以省略包名；不在同一包下，包名不能省略；需要使用importj将需要的类导入：import  io.leiking.Javasestud.Test01；import只能在package与class之间；可以采用*****方式引入别的包所有类；Java.lang包开了vip，自动导入（包括String、System等类）

代码实例

```java
package io.leiking.Javasestud;
import Java.util.*;	//导入Java.util包下所有类
/*
	编译：Javac -d . Test08.Java
	运行：Java io.leiking.Javasestud.Test08
*/
public class Test08
{
	public static void main(String[] args) 
	{
		Scanner s=new Scanner(System.in);
		System.out.print(s.next());	//System是Java.lang包下的类
	}
}
```

### 访问控制权限

public：公开（默认）；任何位置都可以访问

protected：受保护的；只能在本类、同包、子类中访问

private：私有的；只能在本类中访问 

默认：只能在本类、同包中访问(不同包继承访问不到)

public > protected > 默认 > private

## 内部类

### 简介

在类的内部又定义了一个新的类，被称为内部类

静态内部类：static修饰；类似于静态变量

实例内部类：没有static修饰；类似于实例变量

局部内部类：写在方法内的类；类似于局部变量

使用内部类编写的代码可读性很差

匿名内部类：该类没有名字；不建议使用匿名内部类，不能重复使用（没有名字），看着混乱

### 代码示例

匿名内部类

```java
public class Tets02 {
    public static void main(String[] args) {
        Composer obj1=new Composer() {  //匿名内部类
            @Override
            public int add(int x, int y) {
                return x+y;
            }
        };
        System.out.println(obj1.add(10,20));
    }
}
interface Composer{
    int add(int x,int y);
}
```

```java
public class Hellow{
    public static void main(String[] args) {
        Hellow.A.a0();//调用静态内部类的静态方法
        Hellow.A a=new Hellow.A();//实例化静态内部类
        a.a1();
    }
    static class A{
        public static void a0(){
            System.out.println("内部类静态");
        }
        public void a1(){
            System.out.println("内部类实例方法");
        }
    }
}
```



## 数组

### 简介

1. Java中数组是一种引用数据类型
2. 数组是一个容器，不属于基本数据类型，父类是Obiect
3. 数组中可以存储可以存储基本数据类型，也可以存储引用数据类型
4. 因为数组是引用数据类型，所以存储在堆中
5. 数组中存储的是Java对象，实际存储的是引用地址
6. 数组长度定义后，不能改变
7. 一维数组、二维数组、三维数组
8. 所有数组对象都有length属性
9. Java中数组要求存储在数组中元素类型必须统一；int型数组只能存储int类型数据
10. 所有数组都是拿第一个小方块（首元素）的内存地址作为整个数组的内存地址（标识）；数组在内存中存储数据时，内存地址是连续的
11. 数组中每个元素都是有下标的，从0开始到（length-1）结束
12. 好处：查找/检索某个下标上元素时，效率最高的一种结构；因为，地址连续，而且存储数据类型一样，只需要简单的运算就能找出，理解：查找下标为100的元素和查找下标为10000的元素效率一样（不是一个一个查找，算出一个内存地址，直接定位）；
13. 坏处：地址连续，所以随机删除或者增加元素，效率低，因为需要依次处理后续元素；不能存储大数据，因为很难找到一块大内存的连续空间
14. 数组扩容，先创建一个大容量数组，然后将需要扩容的数组内容一个一个拷贝到大容量数组中，然后释放原数组内存；Java中数组扩容效率较低

### 语法

定义语法：int[]  array1；double[]  array2；

初始化数组：静态初始化，int[]  array={100,200,300}；动态初始化，int[]  array=new  int[6]，初始化6个长度的int类型数组，每个元素默认值0

Java.lang.ArrayIndexOutOfBoundsException：下标越界异常

创建时确定数组存储数据，可以静态初始化；如果不确定，动态初始化的方式分配内存空间

### 数组工具类

Java.util.Arrays；工具类方法大多是静态的，直接类名调用

Arrays.sort(arr)；冒泡排序，大的在右，小的在左；直接改变数组arr

binarySearch(参数列表)；二分法查找

**冒泡排序**

循环，从第一个数据开始，依次对比，将大的放右边；循环结束后，找出一个最大的数，放到最右边；然后把剩下的数重复上面步骤

**选择排序**

循环一次，选出最小的，和最前面的数据交换位置；；选择排序比冒泡排序效率高，高在交换位置的次数上

**二分法查找**

二分法查找建立在排序的基础上；(0+arr.length-1)/2中间元素下标，和需要查找元素对比；判断出需要查找的元素在中间元素的哪一边；继续重复上述步骤，直到找到。



### 代码示例

**一维引用数组和数组扩容（复制**）

```java
package io.leiking.Javasestud.test02;

public class Test02 {
    public static void main(String[] args) {
        Anmial[] array1={new Dog(),new Cat()}; //引用类型数组
        for(int i=0;i<array1.length;i++){   //遍历数组
            array1[i].move();   //多态的体现
            if(array1[i] instanceof Cat){
                ((Cat)array1[i]).eat();     //如果底层对象是猫，向下转型为猫，并调用eat()方法
            }else if(array1[i] instanceof Dog){
                ((Dog)array1[i]).eat();
            }
        }
        Anmial[] array2=new Anmial[5];  //创建一个长度为5的Anmial数组
        //拷贝array1数组到array2，拷贝的仅仅是数组中存储的内存地址
        System.arraycopy(array1,0,array2,2,array1.length);
        //原数组，拷贝开始下标，新数组，拷贝个数
        for(int i=0;i<array2.length;i++){
            System.out.println(array2[i]);//从数组下标2开始输出两个。其余的为null
        }
    }
}
abstract class Anmial{
    abstract void move();
}
class Cat extends Anmial{
    @Override
    void move() {
        System.out.println("猫在走猫步");
    }
    void eat(){
        System.out.println("猫在吃鱼");
    }
}
class Dog extends Anmial{
    @Override
    void move() {
        System.out.println("狗在奔跑");
    }
    void eat(){
        System.out.println("狗吃骨头");
    }
}
```

**酒店管理系统**

```java
package io.leiking.Javasestud.test02;

import Java.util.Scanner;

public class Tets04 {
    public static void main(String[] args) {
        System.out.println("欢迎使用酒店管理系统！！！");
        Scanner scanner=new Scanner(System.in);
        Jiudian jiudian=new Jiudian();
        while (true){
            System.out.print("请选择菜单：[1]查看所有房间；[2]订房；[3]退房；[0]退出系统");
            int chose=scanner.nextInt();
            switch (chose){
                case 1:
                    jiudian.chakan();
                    break;
                case 2:
                    System.out.print("输入预定房间号：");
                    jiudian.dinFang(scanner.nextInt());
                    break;
                case 3:
                    System.out.print("输入退房房间号：");
                    jiudian.tuiFang(scanner.nextInt());
                    break;
                case 0:
                    System.out.println("欢迎下次使用！！！");
                    return;
            }
        }
    }
}
class Jiudian{ //酒店类
    Room[][] rooms; //五层，每层十个房间
    public Jiudian() { //构造方法，初始化房间
        this.rooms =new Room[5][5];
        for (int i=0;i<rooms.length;i++){
            for (int j=0;j<rooms[i].length;j++){
                if (i==rooms.length-1){
                    rooms[i][j]=new Room((i+1)*100+j+1,"总统房",true);
                }else if(i==rooms.length-2){
                    rooms[i][j]=new Room((i+1)*100+j+1,"双人间",true);
                }else{
                    rooms[i][j]=new Room((i+1)*100+j+1,"单人间",true);
                }
            }
        }
    }

    public void chakan(){ //查看所有房间
        for (int i=0;i<rooms.length;i++){
            for (int j=0;j<rooms[i].length;j++){
                System.out.print(rooms[i][j]);
            }
            System.out.println();
        }
    }
    public void dinFang(int no){ //预定房间
        Room room=rooms[no/100-1][no%100-1]; //获取房间
        if (!room.isKx()){
            System.out.println("房间已被预订！！！");
            return;
        }
        room.setKx(false);
        System.out.println("房间"+no+"预定成功");
    }
    public void tuiFang(int no){ //退房
        Room room=rooms[no/100-1][no%100-1]; //获取房间
        if (room.isKx()){
            System.out.println("房间未预订！！！");
            return;
        }
        room.setKx(true);
        System.out.println("房间"+no+"退房成功");
    }
}
class Room{  //房间类
    private int no; //房间编号
    private String leixing; //房间类型
    private boolean kx;  //是否空闲
    public Room(int no, String leixing, boolean kx) { //构造方法
        this.setNo(no);
        this.setLeixing(leixing);
        this.setKx(kx);
    }
    public Room() {}

    @Override
    public boolean equals(Object obj) {
        if(obj==null||!(obj instanceof Room)) return false;
        return this.no==((Room) obj).getNo();
    }

    @Override
    public String toString() {
        return "【房间:"+this.getNo()+";类型:"+this.getLeixing()+";状态:"+(this.isKx()?"空闲":"已定】");
    }

    public int getNo() {
        return no;
    }

    public void setNo(int no) {
        this.no = no;
    }

    public String getLeixing() {
        return leixing;
    }

    public void setLeixing(String leixing) {
        this.leixing = leixing;
    }

    public boolean isKx() {
        return kx;
    }

    public void setKx(boolean kx) {
        this.kx = kx;
    }
}
```

算法：

```java
    /**
     * 冒泡排序
     * @param arr 排序的目标数组
     * @return 排序完成的数组 
     */
    public static int[] maoPao(int[] arr){ //冒泡算法代码
        for (int i=arr.length-1;i>=0;i--){ //需要比较数字个数
            for (int j=0;j<i;j++){  //每个数字需要比较次数
                if(arr[j]>arr[j+1]){
                    int temp=arr[j+1];
                    arr[j+1]=arr[j];
                    arr[j]=temp;
                }
            }
        }
        return arr;
    }

    /**
     *  选择排序
     * @param arr 需要排序的数组
     * @return  排序好的数组
     */
    public static int[] xuanZe(int[] arr){ //选择排序
        for (int i=0;i<arr.length-1;i++){
            int min=i; //默认开始的最小值下标
            for (int j=i+1;j<arr.length;j++){
                if (arr[j]<arr[min]){
                    min=j; //外层循环一次，这个min应该为最小值下标
                }
            }
            if (i!=min){
                int temp=arr[i];
                arr[i]=arr[min];
                arr[min]=temp;
            }
        }
        return arr;
    }

    /**
     * 二分查找算法
     * @param arr 需要查找的数组（必须已经排序）
     * @param i 目标元素
     * @return -1表示没有；其他的返回为找到元素的下标
     */
    public static int chaZhao(int[] arr, int i) {
        int begin=0;
        int end=arr.length-1;
        while (begin<=end){
            if(arr[(begin+end)/2]==i){
                return (begin+end)/2;
            }else if(arr[(begin+end)/2]<i){
                begin=(begin+end)/2+1;
            }else if(arr[(begin+end)/2]>i){
                end=(begin+end)/2-1;
            }
        }
        return -1;
    }
```

## 常用类

### obiect

根类：

1. protected  object  clone();	//负责对象克隆
2. public int hashCode()；  //获取对象哈希码；带有 native关键字，调用底层c++代码；返回一个内存地址经过哈希算法得出的值，可以看作是对象的内存地址
3. public boolean equals(Object obj)；  //判断两个对象是否相等，子类重写，自带的只是比较引用的内存地址
4. public String toString()；  //将对象转换为字符串形式；所有类重写，简单明了
5. protected  void  finalize()；垃圾回收器负责调用方法；对象的遗言；一个时机，对象销毁时机，如果需要对象销毁时执行代码可以写在这；只需要重写，不要调用；System.gc()，该方法建议启动垃圾回收

Java中基本数据类型采用**“==”**判断是否相等；Java中引用数据类型（对象）采用**equals()**判断是否相等，可查看String类 

代码实例

equals()

```java
public class Test01 {
    public static void main(String[] args) {
        Person p1=new Person(new Address("广元","伏龙",1234),"小明");
        Person p2=new Person(new Address("广元","伏龙",1234),"小明");
        System.out.println(p1.equals(p2));
    }
}
class Person{
    public Address address;	//引用数据类型
    public String name;

    public Person(Address address, String name) {
        this.address = address;
        this.name = name;
    }

    @Override
    public boolean equals(Object obj) {
        if(obj==null||!(obj instanceof Person)) return false;
        
        return this.address.equals(((Person)obj).address)
            &&this.name.equals(((Person) obj).name);
    }
}
class Address{
    public String city;	//引用数据类型
    public String xiaoqu;
    public int youbian;

    public Address(String city, String xiaoqu, int youbian) {
        this.city = city;
        this.xiaoqu = xiaoqu;
        this.youbian = youbian;
    }

    @Override
    public boolean equals(Object obj) {//equals方法重写
        if (obj==null||!(obj instanceof Address)) return false;
        
        return this.city.equals(((Address)obj).city)
         &&this.xiaooqu.equals(((Address)obj).xiaoqu)
         &&this.youbian==((Address) obj).youbian;
    }
}
```

### System

System.out.println();

public static void arraycopy(Object src, int srcPos, Object dest, int destPos, int length)：指定源数组中的数组从指定位置开始复制到目标数组的指定位置；（源起始位置，下标，目标，目标起始位置，需要拷贝的长度）

### String

Java.lang.String

1. String表示字符串类型，属于引用数据类型；
2. 所有使用双引号括起来的都是String；且从创建到销毁都不可变
3. 字符串都存储在方法区常量池中；因为字符串使用频繁，为了提高效率，所以放到常量池中（注意理解new String("abc")；abc字符串存储常量池中，堆中开辟的空间存储常量池“abc”的内存地址）
4. 直接使用String a="abz"赋值的字符串可以用双等号比较，因为引用存储的地址都是字符串存储常量池中的，一样的字符串，地址一样；而new出来的，因为对象的地址不同，需要使用**equals**进行比较（对象中存储内容一样）参考，字符串内存图理解；
5. String a=new String("abc")；String b=new String("abc")；理解以上代码一共三个对象；字符串常量池一个对象，堆中两个对象
6. 字符串长度可用length()方法判断，而数组长度是length属性
7. 构造方法：String s=new String("")；String s=""；String s=new String(char数组)；String s=new String(char数组，起始下标，长度)；还有个byte数组参数
8. 常用方法：char **charAt**(int index)找出某个char元素；
9. int **compareTo**(String anotherString)两个字符串比较，返回int值0（等于），1（前大后小），-1（前小后大）；
10. boolean **contains**(CharSequence s)判断前面字符串是否包含后面字符串；
11. boolean **endWith**(String suffx)判断前面字符串是否以后面字符串结尾；
12. boolean **equals**(Object another)比较字符串是否相等；
13. boolean **equalsIgoreCase**(String anotherString)判断两个字符串是否相等，忽略大小写；
14. byte[] **getBytes**()；将字符串对象转换为字节数组
15. int **indexOf**(String str)判断某个子字符串在当前字符串中第一次出现处的索引
16. boolean **isEmpty**()；判断某个字符串是否为空
17. String **replace**(CharSequence target，CharSequence replacement)；字符串替换；replaceAll方法支持正则表达式
18. String[] **split**(String regex)；字符串拆分，返回字符串数组
19. boolean **startsWith**(String prefix)；判断某个字符串是否以字符串开始
20. String **substring**(int beginIndex，int endindex)；截取字符串，包括begin，不包括end
21. char[] **toCharArray**()；将字符串转换为数组
22. String **toLowerCase**()；将字符串转化为小写
23. String **toUpCase**()；转化为大写
24. String **trim**()；去除字符串前后空白
25. **valueOf**；String只有这个方法是静态的；将非字符串转化为字符串；为引用时，会调用toString方法

### StringBuffer

Java.lang.StringBuffer

Java.lang.StringBuilder

1. Java字符串因为是不可变的，每次拼接都会产生新的字符串频繁拼接会很浪费方法区字符串常量池内存;因此频繁拼接使用StringBuffer

2. new StringBuffer()；创建一个初始容量为16的byte[]数组；；以后字符串拼接调用append（）追加就好；省去了中间字符串在方法区字符串常量池中的内存占用；

3. 优化StringBuffer，给个初始化容量，尽量减少底层数组扩容次数；给个合适的初始化容量

4. **StringBuffer**和**StringBuilder**区别；StringBuffer中方法都有synchronized关键词修饰，代表在多线程环境下是安全的；StringBuilder中所有方法没有synchronized修饰，代表在多线程环境下不安全


### 基础类对应的8个包装类

包装类，将8种基本数据类型包装为对象

| 基本数据类型 |      包装类型       |
| :----------: | :-----------------: |
|     byte     |   Java.lang.Byte    |
|    short     |   Java.lang.Short   |
|     int      |  Java.lang.Integer  |
|     long     |   Java.lang.Long    |
|    float     |   Java.lang.Float   |
|    double    |  Java.lang.Double   |
|   boolean    |  Java.lang.Boolean  |
|     char     | Java.lang.Character |

1. Integer a=new Integer(59)；基本数据类型转换为引用数据类型 （装箱）

2. a.**intValue**()；引用数据类型 转换为基本数据类型（拆箱）；JDK1.5后支持自动拆箱，自动装箱 

3. Integer.**MAX_VALUE**，**MIN_VALUE**；通过常量访问该类型的最大值与最小值

4. **==**不会触发自动拆箱机制；只有+、-、*、/、=非等会触发自动拆箱

5. Java中为了提高效率，将[-128~~127]之间所有数字放在了方法区的“整数常量池中”，所以使用这个区间的数字，不需要new一个对象了；理解：下面代码

   ```java
           Integer a=127;
           Integer b=127;
           System.out.println(a==b); //输出true；因为是127.放在了整数常量池中
           Integer x=128;
           Integer y=128;
           System.out.println(x==y); //输出false，因为超了存储在堆中，两个对象，而==不会触发自动拆箱
   ```

6. Integer常用方法

   ```java
   Integer a=1000;
           //Integer c=new Integer("中文"); //Java.lang.NumberFormatException，数字格式化异常
           //手动拆箱
           int b=a.intValue();
           //static int parseUnsignedInt(String s),将字符串(整数字符串，否则报错)解析为无符号十进制整数
           int d=Integer.parseInt("36");
           //static Integer valueOf(String s)；返回一个Integer类型数据
           int e=Integer.valueOf(56);
           System.out.println(e);
           //-----------------------------------------------------------------
           //Inteage-->int 自动装箱 或者Inteage.valueOf(int i)
           Integer a1=Integer.valueOf(45);
           //int-->Inteage 自动拆箱，或者intValue()
           int a2=a1.intValue();
           //int-->String String.valueOf(int i)或者""+
           String b1=""+123;
           String b2=String.valueOf(123);
           //String-->int Integer.parseInt(String s)将字符串转化为10进制整数
           int b3=Integer.parseInt(b1);
           //String-->Inteage Integer.valueOf(String s)
           Integer c1=Integer.valueOf(b2);
           //Inteage-->String
           String c2=String.valueOf(c1);
   ```

### Java对日期处理

Java.util.Date：日期类

Java.text.SimpleDateFormat：专门格式化日期的类

Java.util.Calendar：日历

1. 生成时间new Date()；格式化时间(new SimpleDateFoamat).format(new Date())；
2. 获取当前时间戳，System.currentTimeMillis()
3. Date-->String，日期格式化，SimpleDateFormat.format(日期对象)；String-->Date，SimpleDateFormat.parse("日期字符串")

示例代码

```java
       Date time=new Date();
        SimpleDateFormat sdf1=new SimpleDateFormat("yyyy/MM/dd HH:mm:ss SSS");

        System.out.println(sdf1.format(time)); //格式化时间，输出：2020/07/02 12:16:39 092
        System.out.println(time);   //输出：Thu Jul 02 12:16:39 CST 2020

        String time3="1998/06/27 24:00:00 000";
        Date time4=sdf1.parse(time3); //将字符串解析为时间，必须是相应格式
        System.out.println(time4); //输出Sun Jun 28 00:00:00 CST 1998

        long currentTime=System.currentTimeMillis();    //获取当前时间戳
        System.out.println(currentTime);    //输出：1593663508687

        Date time5=new Date(System.currentTimeMillis()-1000*60*60*24); //传递时间戳，构造时间 这里获取昨天这个时候时间
        System.out.println(sdf1.format(time5)); //输出：昨天这时的时间
```

### 数字类

Java.text.DecimalFormat；数字格式化

Java.text.BigDecimal；用于财务软件中数据

Java.util.Random；随机数类

1. DecimalFormat：## 代表数字；，代表千分位；. 代表小数点，返回字符串0代表不够时补0；
2. new BigDecimal(100)的对象求和使用add()方法
3. 创建随机数对象；然后调用方法产生随机数；nextInt(100)，表示产生0-100的随机数

```java
        DecimalFormat df=new DecimalFormat("#,###.00");
        System.out.println(df.format(1645.6)); //输出：1,645.60

        BigDecimal bd=new BigDecimal(100); //创建高精度BigDecimal数据对象
        System.out.println(bd.add(new BigDecimal(200))); //使用add方法计算bigdecsmal数据，输出：300（高精度）

        Random rd=new Random(); //创建Random对象
        int b=rd.nextInt(100); //生成0-99的随机数，默认是int范围类的
```

### 枚举

1. 枚举是一个引用数据类型；编译后是class文件

2. 一枚一枚的可以列举出来且超过两种情况，才建议使用枚举

3. 枚举中每一个值可以看作常量

4. 语法

   ```java
   public enmu Season{  //关键词emmu
       RED,BLUE,WHRITE\YELLOW //枚举值
   }
    System.out.println(Color.RED); //使用
   ```

   

### 其他

API（Application Program Interface）：应用程序编程接口；整个JDK的类库就是一个Javase的API；每一个API都会配置一套API帮助文档

## 异常

### 简介

异常，Java语言完善的异常机制，会将程序发生不正常情况在控制台打印；这种机制可以使程序员找到错误并修改，使程序更加健壮

### 异常抛出与捕获处理

1. 每一个异常在Java中都是以类的形式存在，每一个异常类都可以创建异常对象
2. 例：int a=7/0; //在这里会new ArithmeticException(/ by zero)异常对象，并抛出
3. Exception有两个子类，ExceptionSubClass（直接子类）编译时异常，在编写程序阶段预先进行处理，如果不处理，编译器会报错；RuntimeException运行时异常，在编写程序阶段你可以选择不处理
4. Object-->Throwable(可抛出的)；Throwable-->Erroe(不可处理，直接退出JVM)，Throwable-->Exception(可处理的)；Expecption下有两个分支：1.编译时异常（受控），2.运行时异常（非受控）
5. 所有异常都是在程序运行时发生的（new 异常对象），编译时异常一般发生概率比较高（生病异常，打伞预处理异常）；运行时异常（被飞机轮子砸到）
6. 如果所有异常都在编写代码时进行预处理，那么程序绝对安全，但是活得很累
7. Java中对异常处理两种方式：1.在方法声明的位置上，使用**throws**关键字，抛给上一级（谁调用我，就抛给谁）；2.使用**try...catch**语句进行异常处理
8. 如果异常一直上抛，抛给了JVM，JVM就会终止这个程序；不建议在main()方法不建议上抛，否则异常发生，程序直接报错 
9. 只要异常没有捕捉，采用上抛的方式，那么该方法的后续代码不会执行
10. try...catch；catch后面的异常类型可以使用该异常类型的父类型；catch语句可以有多个，且捕捉类型从小到大；JDK8支持在catch后面的异常使用 | 连接多个异常类型，进行处理
11. 异常常用方法：
    1. Throwable msg=e.getMessage()；获取异常简单的描述信息
    2. e.printStackTrace()；打印异常追踪的堆栈信息

```java
public static void main(String[] args){
        //int a=7/0; //在这里会new ArithmeticException(/ by zero)异常对象，并抛出
        /*
        因为doSome()方法声明位置上有：throws ClassNotFoundException
        我们在调用doSome()方法时，必须对这种异常进行预先处理，否则会报错如下：
        Unhandled exception: Java.lang.ClassNotFoundException
        处理异常：
            1.可以在main()处继续上抛（甩锅）
            2.可以使用try...catch进行异常捕获，然后处理（处理，结束异常）
        * */
        try {
            doSome();
        } catch (ClassNotFoundException e) { //e为new出来的异常对象的内存地址
            System.out.println(e.getMessage()); //获取异常简单描述
            e.printStackTrace(); //打印异常追踪的堆栈信息，采用了异步线程的方式处理
        }
    }
    /**
     * doSome()方法运行时可能会抛出ClassNotFoundException异常
     * 这个是类没找到异常，直接父类Exception，属于编译时异常
     * @throws ClassNotFoundException
     */
    public static void doSome() throws ClassNotFoundException{
        throw new ClassNotFoundException();
//        System.out.println("doSome()方法！！！");
    }
```

### finally

1. 在finally子句中的代码是最后执行的，并且是一定会执行的，即使try语块的代码出现了异常；除非退出JVM虚拟机，否则finally语句块中内容一定会执行
2. finally语句必须和try一起出现，不能单独编写
3. finally 存在于异常处理中，最后且一定会执行的代码块；final 修饰，代表不可变的，最终的（存储在常量池）； finalize() 是Object类中一个方法，留遗言时用的，垃圾回收器负责调用

```java
    public static void main(String[] args) {
        FileInputStream fis=null; //外面声明，finally语句块与try语句块才都可以使用
        try {
            fis=new FileInputStream("123");
            String s=null;
            s.toString(); //一定会出现空指针异常，运行时异常
            //fis.close(); //如果在这里关闭流，可能会因为前面出异常而执行不到
            return; //这个return语句会在finally语句块执行后才执行
        } catch (FileNotFoundException e) {
            e.printStackTrace();
        }finally {
            System.out.println("finally语句块执行了！！！");
            if (fis!=null){
                try {
                    fis.close();//这里关闭流，finallly语句块中。因此一定能执行
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        }
    }
```

自定义异常

1. 编写一个类继承Exception（编译时异常）或者RuntimeException（运行时异常）
2. 提供两个构造方法，一个有参，一个无参

```java
public class Test01 {
    public static void main(String[] args) {
        MyException e=new MyException("自定义异常");
        System.out.println(e.getMessage()); //获取异常简要描述
        e.printStackTrace(); //打印异常追踪的堆栈信息
    }
}
class MyException extends Exception{ //自定义异常
    public MyException() { //无参
        super();
    }
    public MyException(String message) { //有参
        super(message);
    }
}
```

### 实际中应用

源代码

```java
class Mystack{
    private int index=-1;    //栈帧
    private Object[] stack=new Object[2];
    public Mystack() {}
    //压栈
    public Object[] push(Object obj) throws MyException {
        if (index==stack.length-1){
            throw  new MyException("栈满了"); //抛出异常
        }
        stack[++index]=obj;
        System.out.println("压栈成功:"+stack[index]);
        return stack;
    }
    //弹栈
    public Object pop() throws MyException {
        if (index==-1){
            throw new MyException("栈空了"); //抛出异常
        }
        Object a=stack[index];
        System.out.println("弹栈成功:"+stack[index]);
        stack[index--]=null;
        return a; //返回弹栈元素
    }
}
```



### 其他

UML：一种统一建模语言；一种图标式语言（画图的）；为面向对象产品进行说明

1. 在UML图中能描述类与类之间的关系，程序执行的流程，对象的状态等
2. 一般是系统分析师、软件架构师或者设计师使用

Java中语法规则，一旦这么说了，就必须这么做

1. 方法体中代码必须是自上而下顺序依次执行

2. return语句一旦执行，整个方法必须结束

3. 理解以下代码(dj decompiler反编译工具)

   ```java
       public static void main(String[] args) {
           int i =m();
       }
   
       private static int m() {
           int i=100;
           try {
               //返回的i的值是100，虽然return在finally代码块后执行，但是遵守Java语法规范
               return i;
           }finally {
               i++;
           }
       }
   //底层编译后的代码
   //反编译出来后可以看到，他将i变量先复制了出来，然后i++，然后返回的是复制出来的值
   ```

## 集合

Java.util.*

### 简介

1. 数组其实就是一个集合，集合实际上是一个容器，可以容纳其他类型的数据
2. 集合不能直接存储基本数据类型，也不能直接存储Java对象，集合中存储的是Java对象的内存地址（引用，集合在任何时候存储的都是引用）
3. Java中，每个不同的集合，底层会对应不同的数据结构。往不同的集合中存储元素，等于放到了不同的数据结构中。数据存储的结构就是数据结构
4. Java中集合分为两类；所有集合继承Iterable（可迭代的），表示所有集合可迭代
   1. 一类是单个方式存储元素（超级夫接口：Java.util.Collection；）
      1. List接口：有序的 collection（也称为序列）
         1. ArrayList：采用了数组这种数据结构；初始化容量为10；存储类型为Object类型数组；ArrayList是非线程安全的
         2. Vector：采用了数组这种数据结构；ArrayList是线程安全的；所有方法都有synchronized修饰，但效率较低
         3. LinkedList：采用了双向链表数据结构
         4. 。。。。
      2. Set接口：一个不包含重复元素的 collection，无序指的是存取顺序与取出顺序不一样（没有下标）
         1. HashSet：new HashSet时，底层实际是new了一个HashMap集合；存储数据实际存储在HashMap的key中了（HashMap是一种哈希表数据结构）
         2. SortedSet接口：无序不可重复，该接口实现了元素自动按照大小排序
            1. TreeSet：new TreeSet实际底层new了一个TreeMap集合；往TreeSet中存储数据实际存储在了TreeMap中了（TreeMap底层采用二叉树数据结构）
   2. 一类是以键值对方式存储元素（超级父接口：Java.util.Map；）
      Map接口：Map集合与Collection集合没有关系；Map集合以key，value这种键值对方式存储元素；key与value存储的都是Java对象的内存地址；Map集合元素key是不可重复的
      1. HashMap：HashMap底层是哈希表数据结构；是非线程安全的
      2. Hashtable：底层也是哈希表数据结构，是线程安全的，现在使用较少
         1. Properties：Properties是线程安全的，因为继承Hashtable；另外Properties存储元素时也采用key与value的形式存储，并且key与value只支持String类型
      3. SortedMap接口：无序不可重复，且实现元素自动排序
         1.TreeMap：TreeMap集合底层的数据结构是二叉树

### Java.util.Collection

1. 没有使用泛型可以存储Object所有子类型；使用泛型后只能存储某个具体类型（集合中只能存储Java对象的内存地址，不能直接存储基本数据类型和对象）
2. boolean add(E e) ；向集合中添加元素 
3. int size()；获取集合中元素的个数
4. void clear()  ；清空集合
5. boolean contains(Object o) ；判断集合中是否包含o元素；底层调用equals()方法进行比较，用同样的参数，new出两个字符串对象时，一个加入，一个不加入，会返回true；存放在集合中的类型，一定要重写equals方法。
6. boolean remove(Object o) ；移除集合中某个元素；底层也是调用的equals方法进行对比删除的
7. boolean isEmpty()  ；判断集合是否为空；空返回（true）
8. Object[] toArray()  ；将集合转换为数组
9. Iterator\<E\> iterator()  ；返回一个Iterator（迭代器）
   Iterator迭代器中有三个方法：boolean hasNext() 如果仍有元素可以迭代，则返回 true； E next() 返回迭代的下一个元素 ；void remove() 删除迭代器当前指向的元素（会自动更新迭代器中的元素）；集合一旦发生改变，迭代器必须重新获取，否则会出现异常（Java.util.ConcurrentModificationException）；所以在迭代过程中不能改变集合结构
10. 代码示例

```java
    public static void main(String[] args) {
        Collection coll=new ArrayList();
        coll.add(123); //自动转换为Inteage，自动装箱
        coll.add("tanglei");//向集合中添加元素
        coll.add('1'); //添加一样的元素，不会报错，但集合中只有一个
        Iterator it=coll.iterator();//获得一个迭代器对象，且集合结构发生变化时必须重新获取
        //boolean a=coll.remove('1');//移除集合中某个元素
        //coll.clear(); //清空集合元素
        System.out.println(coll.isEmpty()); //false
        System.out.println(coll.contains('1')); //true
        System.out.println(coll.size()); //输出3
        while (it.hasNext()){
            System.out.print(it.next()+" "); //123 tanglei 1
        }
    }
```

### Java.util.ArryList

1. 有序可重复；List集合有下标，从0开始，依次递增；可重复；非线程安全；默认容量为10；扩容到为原来的1.5倍；
2. 检索效率高，**随机**增删效率低（因为底层是数组）
3. 对List集合进行排序，放入其中的类型，需要实现Comparable接口
4. void add(int index, E element)  ：向指定位置添加元素，效率较低
5. E get(int index) ：根据下标获取元素；List集合可以使用get()方法实现遍历
6. int indexOf(Object o)  ：返回此列表第一次出现指定元素的索引
7. int lastIndexOf(Object o)  ：返回此列表中最后一次出现指定元素的索引
8. E set(int index, E element)  ：修改指定位置的元素
9. \>\>1二进制右移一位、\>\>2二进制右移两位；\<\<1二进制左移一位、<<2二进制左移两位

### Java.util.LinkedList

1. 底层是一个双向链表；因此具有链表的特性
2. 检索效率较低
3. 随即增删效率较高

### Java.util.Vector

1. 底层是一个数组；默认容量10；扩容之后是原容量的2倍

2. 所有方法都是线程同步的，线程安全的。但是效率较低，用的少

3. 将非线程安全转换为线程安全，使用一个工具类可以实现Java.util.Collections

   ```java
    ArrayList coll=new ArrayList();
    Collections.synchronizedList(coll); //将ArryList转化为线程安全的，之后coll集合就变成线程安全了
   ```

### Java.util.Map

1. Map与Collection没有继承关系；Map以key和value方式存储数据；键值对key和value都是引用数据类型；key和value都是存储对象的内存地址；key起主导地位，value是key的一个附属品

2. void clear()；清除所有的映射关系

3. boolean contionsKey(Object key)；是否包含指定键的映射关系

4. boolean contionsValue(Object value)；是否包含指定值的映射关系

5. V get(Object key)；返回指定键映射的值

6. boolean isEmpty()；是否包含有映射关系

7. Set\<K\> keySet()；返回键的set视图

8. V put(K key,V value)；将指定的值与此映射中指定的键关联，放入一个键值对

9. V remove(Object key)；如果存在一个键的映射，则移除

10. int size()；返回键-值映射关系（键值对）数

11. Collection\<V\> values()；返回值的Collection视图

12. Set\<Map.Entry\<K,V\>\> entrySet()；返回映射关系的set视图

13. Map集合遍历：可以取出Set集合的所有key，然后通过V get(Object key)方法去值；使用foreach方式；

14. 代码示例

    ```java
            Map<Integer,String> map=new HashMap<>();
            map.put(1,"王");
            map.put(2,"李四");
            map.put(3,"王五"); //放入键值对
            map.put(1,"张三");
            System.out.println(map.size()); //键值对个数
            System.out.println(map.get(1)); //获取指定键的值
            System.out.println(map.isEmpty()); //映射关系是否为空
            Set<Integer> set=map.keySet(); //返回一个key的Set集合
            for (Integer data:set){
                System.out.print(data+" ");
                System.out.print(map.get(data)+"-->");//通过key值遍历map集合
            }
            System.out.println();
            Collection<String> collection=map.values();//返回一个value的Collection集合
            for (String data:collection){
                System.out.print(data+" ");
            }
            System.out.println();
            Set<Map.Entry<Integer,String>> entrySet = map.entrySet();//返回key=value的Map.ectry<K,V>(Node对象)的数据的Set集合
            for (Map.Entry<Integer,String> data:entrySet){
                System.out.print(data+" ");
            }
    ```

### Java.util.HashMap

1. HashMap集合底层是哈希表/散列表的数据结构；哈希表是一个数组与单项链表的集合体；哈希表将数组与链表数据结构结合，充分发挥其两者优点；哈希表是一个一维数组（容量达到75%时扩容），数组中每个元素是一个单向链表；HashMap的默认容量必须是2的倍数，为了散列均匀；初始化容量16，默认加载因子0.75

2. hashCode()方法，返回值不能全部一样，也不能全部不一样（变成纯链表或者变成纯数组了）；重写hashCode()方法，需要一定的技巧

3. 放在HashMap集合中key的元素和放在HashSet集合中的元素，都需要重写HashCode()方法以及equals方法

4. 同一个单向链表上，所有结点的hash值相同，因为他们的数组下标相同，但是同一个链表上的k与k的equals肯定返回的是false，都不相等

5. map.put(k,v)；第一步，先将k,v封装到Node对象中；第二步，底层会调用k的hashCode()方法得出hash值，然后通过哈希函数或者哈希算法，将hash值转换成数组的下标，下标位置上如果没有任何元素，就把Node添加到这个位置上，如果说下表对应的位置上有链表，此时会拿着k和链表上每一个节点的k进行equals，如果所有equals都返回false，那么这个新节点将会被添加到链表的末尾。如果其中有一个equals返回了true，那么这个节点的value将会被覆盖

6. map.get(k)；先调用hashCode()方法得出hash值，通过哈希算法转换为数组下标，通过数组下标快速定位到每个位置上，如果这个位置上什么都没有，返回null，如果这个位置上有单向链表，那么会拿着参数k和单向链表上的每个节点中的k进行equals，如果所有的equals方法返回false，那么get()方法返回null，如果其中有一个节点的k和参数k equals返回true，那么此时这个节点的value就是我们要找的value，get方法最终返回这个要找的value

7. JDK8后，如果哈希表单向链表中元素超过8个，则会自动转换为红黑树；在红黑树中节点数量小于6时，又会自动转换为单向链表；原因：提高检索效率

8. 重点：方法HashMap集合中的key元素需要同时重写equals和hashCode方法

9. 代码示例

   ```java
   public class HashMapTest {
       public static void main(String[] args) {
           Student a=new Student("张三");
           Student b=new Student("张三");
           HashSet<Student> hashSet=new HashSet<>();
           hashSet.add(a);
           hashSet.add(b);
           /*
           如果不重写hashCode()方法，这里会输出2；因为底层new了一个HashMap，将元素放入HashMap中key的位置；然而HashMap放元素时，首先执行hashCode方法，
           如果不同才会执行equals方法，因此在没有重写时，hashCode会返回false，然后就会在HashMap集合的数组中新建一个Node节点，然后再进行equals方法的对比，
           因此，会出现输出为2，放入两个相同的元素；
           结论：放入HashMap中元素key位置的，必须同时重写equals与hashCode方法
           * */
           System.out.println(hashSet.size());
       }
   }
   class Student{
       private String name;
       public Student() {
       }
       public Student(String name) {
           this.name = name;
       }
   
       @Override
       public boolean equals(Object o) { //equals方法重写
           if (this == o) return true;
           if (!(o instanceof Student)) return false;
           Student student = (Student) o;
           return Objects.equals(getName(), student.getName());
       }
       @Override
       public int hashCode() { //hashCode方法重写
           return Objects.hash(getName());
       }
   
       public String getName() {
           return name;
       }
   
       public void setName(String name) {
           this.name = name;
       }
   }
   ```

### Java.util.Hashtable

1. HashMap的key与value存储时都可以为null，而Hashtable的key与value不能为null，否则会报空指针异常；
2. Hashtable所有方法带有synchronized修饰，线程安全；
3. 扩容时原容量2倍加1；

### Java.util.Properties

1. Properties是一个Map集合，继承Hashtable；Properties的key和value都是String类型；Properties被称作属性对象；是线程安全的

2. setProperty()；存储数据进去

3. getProperty()；通过key获取value值

4. 代码示例

   ```java
   Properties pro=new Properties();
   pro.setProperty("12","lei");//存储键值对，且为String类型
   pro.setProperty("34","tang");
   System.out.println(pro.size());
   System.out.println(pro.getProperty("34"));//通过key获取键对应的值
   ```

### Java.util.TreeSet

1. TreeSet集合底层实际是一个TreeMap

2. TreeMap集合集合底层是一个二叉树

3. 放到TreeSet集合中的元素，等同于放到TreeMap集合的key部分

4. TreeSet集合中元素：无序不可重复，但是可以按照大小顺序自动排序

5. 如果在TreeSet中放入自定义类型，需继承Comparable接口，并实现其中的compareTo()方法，这个方法中写比较规则；返回值=0表相等，返回值>0表左大于右，往右子树上找，<0左边大于右边，往左子树上找；也可以单独写一个比较器，通过构造方法传进去

6. 如果比较规则不会发生改变时，或者说比较规则只有一个，建议实现Comparable接口；如果比较规则有多个，且比较规则之间频繁切换时，建议实现Compartor接口；Comparator接口遵循OOP原则

7. 代码示例

   ```java
   public class TreesetTest {
       public static void main(String[] args) {
           //TreeSet<Coustr> coustr=new TreeSet<>(); //无参构造,在自定义类中实现比较器
   
           TreeSet<Coustr> coustr=new TreeSet<>(
                   new Comparator<Coustr>() { //匿名内部类方式，传入一个比较器
               @Override
               public int compare(Coustr o1, Coustr o2) {
                   if (o1.getAge()==o2.getAge()){ //年龄一样时，判断名字
                       return o1.getName().compareTo(o2.getName());//直接调用String中重写的compareTo方法
                   }else {
                       return o1.getAge()-o2.getAge(); //根据年龄返回一个正0负数的值
                   }
               }
           });
           Coustr c1=new Coustr(12,"a1");
           Coustr c2=new Coustr(12,"a2");
           Coustr c3=new Coustr(13,"a");
           coustr.add(c1); //将对象放入TreeSet集合中
           coustr.add(c2);
           coustr.add(c3);
           for (Coustr data:coustr){
               System.out.println(data);
           }
       }
   }
   class Coustr implements Comparable<Coustr>{ //Comparable实现时使用泛型，指定类型
       private int age;
       private String name;
   
       public Coustr(int age, String name) {
           this.age = age;
           this.name = name;
       }
   
       @Override
       public int compareTo(Coustr o) {
           if (this.age==o.age){ //年龄一样时，判断名字
               return this.name.compareTo(o.name);//直接调用String中重写的compareTo方法
           }else {
               return this.age-o.age; //根据年龄返回一个正0负数的值
           }
       }
   
       @Override
       public String toString() {
           return "Coustr{" +
                   "age=" + this.age +
                   ", name='" + this.name + '\'' +
                   '}';
       }
   }
   ```

   

### 泛型

1. JDK5后支持泛型机制

2. 用泛型来指定集合中可以存储的数据类型；使用泛型后，集合中元素就更加统一了

3. 泛型只是在编译阶段起作用，给编译器看的

4. 好处：集合中存储元素类型统一；从集合中取出元素是泛型指定的类型

5. 缺点：导致集合中存储元素类型缺乏多样性

6. JDK8之后引入了自动类型推断机制（又称钻石表达式）

7. 自定义泛型；Java源码中常出现：\<E\>:element首字母大写

8. 或者\<T\>:Type首字母大写

9. 代码示例

   ```java
   List<Anmial> a=new ArrayList<>(); //使用泛型，创建的集合中只能存储Anmial类型
   Anmial o1=new Cat();
   Anmial o2=new Dog();
   a.add(o1);
   a.add(o2);
   Iterator<Anmial> it=a.iterator();
   while(it.hasNext()){
       Anmial obj=it.next(); //如果不用泛型，那么这里必定会返回Object类型
       obj.move();
       if (obj instanceof Cat){
           ((Cat)obj).zhuo();
       }
       if (obj instanceof Dog){
           ((Dog)obj).chi();
       }
   }
   ```

### foreach

1. 增强for循环

2. 语法：for(元素类型 变量名：数组或集合)

3. 缺点：没有下标

4. 代码示例

   ```java
           List<String> li=new ArrayList<>();
           li.add("hellow");
           li.add("world");
           li.add("!!!");
           for(String data:li){
               System.out.print(data+" ");
               System.out.print("1"+" ");
           }
   ```

## 数据结构

### 链表

1. 单项链表，每个元素是一个节点Node，每一个Node包括存储数据（data）、下一个节点的内存地址（next ）
2. 优点：随机增删元素效率较高（因为不涉及大量元素的位移）
3. 缺点：查询效率较低，因为每一次查找元素都需要从头节点向下查询 

### 二叉树

1. TreeSet/TreeMap是自平衡二叉树，遵循左小右大的原则存放
2. 二叉树遍历有三种方式：
   前序遍历：根左右
   中序遍历：左根右
   后序遍历：左右根
3. TreeSet/TreeMap集合采用的是：中序遍历；Iterator迭代器采用的是中序遍历方式

