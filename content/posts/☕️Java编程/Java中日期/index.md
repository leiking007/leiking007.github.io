---
title: "Java中日期"
date: 2021-11-01
lastmod: 2021-11-11
draft: false
tags: ['JavaSE','spring']
categories: ["☕️Java编程"]
author: "lei"
---

# Java中日期

## Java中日期

### 概念

**本地时间**

不同的时区，在同一时刻，本地时间是不同的。全球一共分为24个时区，伦敦所在的时区称为标准时区，其他时区按东／西偏移的小时区分，北京所在的时区是东八区。

**时区**

通过本地时间无法确定一个准确的时刻，所以需要添加时区

时区表示方式：

1. `GMT`或者`UTC`加时区偏移表示，基本等价，`UTC`使用了更加精确的原子钟计时；例：`GMT+08:00`或者`UTC+08:00`表示东八区
2. 缩写，缩写容易产生混淆，一般不使用；例如：`CST`表示中国标准时间`China Standard Time`，也可以表示美国中部时间`Central Standard Time USA`
3. 洲/城市；例如：`Asia/Shanghai`表示上海所在地的时区。特别注意城市名称不是任意的城市，而是由国际标准组织规定的城市

**夏令时**

夏令时，就是夏天开始的时候，把时间往后拨1小时，夏天结束的时候，再把时间往前拨1小时

涉及到夏令时，相同的时区如果表达方式不同，转换出来的时间是不同的，例如：

对于2019-11-20和2019-6-20两个日期来说，假设北京人在纽约：

- 如果以`GMT`或者`UTC`作为时区，无论日期是多少，时间都是`19:00`；
- 如果以国家／城市表示，例如`America／NewYork`，虽然纽约也在西五区，但是，因为夏令时的存在，在不同的日期，`GMT`时间和纽约时间可能是不一样的

![image-20211015105637649](images.assets/image-20211015105637649.png)

在程序中应`统一配置`：数据库服务器，JVM，JSON转化工具的时区为`GMT+8`，忽略夏令时的使用

注意：JSON转化工具和链接数据库设置的时区**一定需要一致**，否则可能出现多一个小时或者少一个小时的奇怪问题

**本地化**

计算机通过`Locale`来针对当地用户习惯格式化日期、时间、数字、货币等

Java.lang.Locale代表特定的地理、政治和文化。需要Locale来执行其任务的操作叫语言环境敏感的操作

构造一个系统默认的Locale：Locale defaultLocale = Locale.getDefault();

### GMT+8 和 Asia/Shanghai 的区别

```java
public static void main(String[] args) throws ParseException {
    String strDate="1986-05-04 02:00:00";   //夏令营时段
    SimpleDateFormat sdf=new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
    Date date = sdf.parse(strDate);  //Sun May 04 03:00:00 CDT 1986

    SimpleDateFormat sdf1=new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
    sdf1.setTimeZone(TimeZone.getTimeZone("GMT+8"));
    String format1 = sdf1.format(date);    //1986-05-04 02:00:00

    SimpleDateFormat sdf2=new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
    sdf2.setTimeZone(TimeZone.getTimeZone("Asia/Shanghai"));
    String format2 = sdf2.format(date);    //1986-05-04 03:00:00
}
```

`夏令时`（Daylight Saving Time: DST），也叫 `夏时制`，是指为了节约能源，在天亮的早的夏季，人为将时间调快一小时，以充分利用光照资源，节约照明用电；在冬季光照时间变短后，将时间再拨回一小时的标准时间，也称为冬令时

-  `GMT+8` 因为没有位置信息，所以无法使用夏令时
-  `Asia/Shanghai` 使用夏令时

**时间戳字符串中不包含时区信息时，解析到的具体时区如果是使用夏令时的，就会跟不使用夏令时的时区，时间不一致。**

### Date和Calendar

Java.util.Date：日期类

Java.text.SimpleDateFormat：专门格式化日期的类

Java.util.Calendar：日历

1. 生成时间 new Date ()；格式化时间 (new SimpleDateFoamat).format (new Date ())；
2. 获取当前时间戳，System.currentTimeMillis ()
3. Date-->String，日期格式化，SimpleDateFormat.format (日期对象)；String-->Date，SimpleDateFormat.parse ("日期字符串")

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

## JDK1.8之前

**Date类** 

表示特定的瞬间，精确到毫秒。在 JDK 1.1 之前，类 Date 有两个其他的函数。它允许把日期解释为年、月、日、小时、分钟和秒值。它也允许格式化和解析日期字符串。不过，这些函数的 API 不易于实现国际化。从 JDK 1.1 开始，应该使用 Calendar 类实现日期和时间字段之间转换，使用 DateFormat 类来格式化和解析日期字符串。Date 中的相应方法已废弃（查阅自API文档）
**Calendar类**
Calendar 类是一个抽象类，它为特定瞬间与一组诸如 YEAR、MONTH、DAY_OF_MONTH、HOUR 等 日历字段之间的转换提供了一些方法，并为操作日历字段（例如获得下星期的日期）提供了一些方法。瞬间可用毫秒值来表示，它是距历元（即格林威治标准时间 1970 年 1 月 1 日的 00:00:00.000，格里高利历）的偏移量。
该类还为实现包范围外的具体日历系统提供了其他字段和方法。这些字段和方法被定义为 protected。
与其他语言环境敏感类一样，Calendar 提供了一个类方法 getInstance，以获得此类型的一个通用的对象。Calendar 的 getInstance 方法返回一个 Calendar 对象，其日历字段已由当前日期和时间初始化

### Date(时间)

**构造方法**

- 无参构造：获取当前时间
- 有参构造：传入时间戳(毫秒)，获取时间戳的时间
- 其余构造方法已经弃用

**常用方法**

```java
leftdate.before(rightdate);		//leftdate小于rightdate时返回true

leftdate.after(rightdate);		//leftdate大于rightdate时返回true

date1.getTime();	//获取时间戳(毫秒)

date.setTime(1649927726538L);	//根据时间戳设置时间

leftdate.compareTo(rightdate);	//leftdate < rightdate 返回 -1; leftdate = rightdate 返回 0; leftdate > rightdate 返回 1
```

### Calendar(日历)

**创建对象**

```java
Calendar calendar=Calendar.getInstance();	//获取当前时间的日历对象，默认时区和语言环境

Calendar calendar2 = Calendar.getInstance(Locale.ENGLISH);	//获取当前时间的日历对象，默认时区和指定的语言环境

Calendar calendar3=Calendar.getInstance(TimeZone.getTimeZone(ZoneId.of("GMT-8")));
Calendar calendar3=Calendar.getInstance(TimeZone.getTimeZone("UTC"));	//获取当前时间的日历对象，指定时区和默认语言环境
```

`TimeZone.getAvailableIDs()`可以列出所有有效时区

**常用方法**

```java
calendar1.getTimeZone();	//获取时区

calendar1.getWeekYear();	//获取年

calendar3.yearLength();		//以天为单位，返回一年长度

calendar1.monthLength(1);	//以天为单位，返回某月长度，参数为月数-1

calendar1.add(Calendar.YEAR,5);		//日历年份 +5

calendar1.add(Calendar.DAY_OF_MONTH,-1);	//日历月数 -1

calendar1.add(Calendar.DAY_OF_MONTH,29);	//日历天数 +29

calendar1.add(Calendar.HOUR,12);	//日历时间 +12小时
```



### 时间工具类

```java
public class OldDateUtil {
    private OldDateUtil(){}
    /**
     * 获得当前日期
     */
    public static String getCurrentDate(String format) {
        SimpleDateFormat f = new SimpleDateFormat(format);
        Date date = new Date();
        return f.format(date);
    }

    /**
     * 时间转换为字符串，如果转换格式为空使用默认格式
     */
    public static String dateToStr(Date date, String format) {
        if (format==null||format.length()==0){
            format=TimeFormat.DEFAULT_FORMAT.format;
        }
        SimpleDateFormat f = new SimpleDateFormat(format);
        return f.format(date);
    }

    /**
     * 字符串转换为时间，如果转换格式为空使用默认格式
     */
    public static Date strToDate(String dateTime, String format) throws Exception {
        if (format==null||format.length()==0){
            format=TimeFormat.DEFAULT_FORMAT.format;
        }
        SimpleDateFormat f = new SimpleDateFormat(format);
        return f.parse(dateTime);
    }

    /**
     * 时间包括在某个时间段内
     */
    public static Boolean timeInclude(Date checkTime, Date begntime, Date endtime) {
        if(begntime!=null&&endtime!=null){
            return checkTime.after(begntime)&&checkTime.before(endtime);
        }
        return false;
    }

    /**
     * 时间大小比较
     * 大于返回 1、小于返回 -1、等于返回 0
     */
    public static int checkTime(Date left, Date right) {
        return left.compareTo(right);
    }

    /**
     * 将月数转换成年数
     */
    public static double monthToYear(int month) {
        return month / 12D;
    }

    /**
     * 时间戳转换为字符串
     */
    public static String timestamp2Str(Timestamp time) {
        Date date = null;
        if (null != time) {
            date = new Date(time.getTime());
        }
        return dateToStr(date, TimeFormat.DEFAULT_FORMAT.format);
    }

    /**
     * 字符串转化为时间戳
     */
    public static Timestamp str2Timestamp(String str) throws Exception {
        Date date = strToDate(str, TimeFormat.DEFAULT_FORMAT.format);
        return new Timestamp(date.getTime());
    }

    /**
     * 计算日期之间相差天数
     */
    public static int getBetweenDays(Date date1, Date date2) {
        long betweenDays = date1.getTime() - date2.getTime();
        betweenDays = betweenDays / 1000 / 60 / 60 / 24;
        return Math.abs((int) betweenDays);
    }

    /**
     * 时间转换为整数
     */
    public static Integer date2Integer(Date date, String format) {
        String str = dateToStr(date, format);
        return Integer.valueOf(str);
    }

    /**
     * date增减分钟
     */
    public static Date addMinute(Date date, int minute) {
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(date);
        calendar.add(Calendar.MINUTE, minute);
        return calendar.getTime();
    }

    /**
     * date增减天数
     */
    public static Date addDay(Date date, int day) {
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(date);
        calendar.add(Calendar.DAY_OF_MONTH, day);
        return calendar.getTime();
    }

    /**
     * date增减月数
     */
    public static Date addMonth(Date date, int month) {
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(date);
        calendar.add(Calendar.MONTH, month);
        return calendar.getTime();
    }

    /**
     * 计算到指定时间的年龄
     */
    public static int getAge(Date birthDay, Date endDate) {
        int age = 0;
        SimpleDateFormat format_y = new SimpleDateFormat("yyyy");
        SimpleDateFormat format_M = new SimpleDateFormat("MM");

        String birth_year = format_y.format(birthDay);
        String this_year = format_y.format(endDate);

        String birth_month = format_M.format(birthDay);
        String this_month = format_M.format(endDate);

        // 初步，估算
        age = Integer.parseInt(this_year) - Integer.parseInt(birth_year);

        // 如果未到出生月份，则age - 1
        if (this_month.compareTo(birth_month) < 0) {
            age -= 1;
        }
        if (age < 0) { // age小于0，未满一岁
            age = 0;
        }
        return age;
    }

    /**
     * 验证字符串日期格式
     */
    public static boolean ValidateDate(String str,OldDateUtil.TimeFormat timeFormat){
        return str.matches(timeFormat.regExp);
    }

    enum TimeFormat{
        HH_MM_SS_COLON ("HH:mm:ss","^([01][0-9]|2[0-3]):[0-5][0-9]:([0-5][0-9]|60)$") ,
        HH_MM_SS_MILSEC_COLON("HH:mm:ss.SSS","^([01][0-9]|2[0-3]):[0-5][0-9]:([0-5][0-9]|60).\\d{1,3}$"),
        HH_MM_SS_CHINESE ("HH时mm分ss秒","^([01][0-9]|2[0-3])时[0-5][0-9]分([0-5][0-9]|60)秒$"),
        YYYY_MM_DD_CHINESE("yyyy年MM月dd日","^[1-9]\\d{3}年(0[1-9]|1[0-2])月(0[1-9]|[1-2][0-9]|3[0-1])日$"),
        YYYY_MM_DD_LINE("yyyy-MM-dd","^[1-9]\\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])$"),
        YYYY_MM_DD_SLASH("yyyy/MM/dd","^[1-9]\\d{3}/(0[1-9]|1[0-2])/(0[1-9]|[1-2][0-9]|3[0-1])$"),
        YYYY_MM_DD_BACKSLASH("yyyy\\MM\\dd","^[1-9]\\d{3}\\(0[1-9]|1[0-2])\\(0[1-9]|[1-2][0-9]|3[0-1])$"),
        YYYY_MM_DD_NONE("yyyyMMdd","^[1-9]\\d{3}(0[1-9]|1[0-2])(0[1-9]|[1-2][0-9]|3[0-1])$"),
        YYYY_MM("yyyyMM","^[1-9]\\d{3}(0[1-9]|1[0-2])$"),
        YYYY("yyyy","^[1-9]\\d{3}$"),
        YYYY_MM_DD_HH_MM_SS_CHINESE("yyyy年MM月dd日 HH时mm分ss秒","^[1-9]\\d{3}年(0[1-9]|1[0-2])月(0[1-9]|[1-2][0-9]|3[0-1])日 ([01][0-9]|2[0-3])时[0-5][0-9]分([0-5][0-9]|60)秒$"),
        YYYY_MM_DD_HH_MM_SS_LINE("yyyy-MM-dd HH:mm:ss","^[1-9]\\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1]) ([01][0-9]|2[0-3]):[0-5][0-9]:([0-5][0-9]|60)$"),
        YYYY_MM_DD_HH_MM_SS_SLASH("yyyy/MM/dd HH:mm:ss","^[1-9]\\d{3}/(0[1-9]|1[0-2])/(0[1-9]|[1-2][0-9]|3[0-1]) ([01][0-9]|2[0-3]):[0-5][0-9]:([0-5][0-9]|60)$"),
        YYYY_MM_DD_HH_MM_SS_BACKSLASH("yyyy\\MM\\dd HH:mm:ss","^[1-9]\\d{3}\\(0[1-9]|1[0-2])\\(0[1-9]|[1-2][0-9]|3[0-1]) ([01][0-9]|2[0-3]):[0-5][0-9]:([0-5][0-9]|60)$"),
        YYYY_MM_DD_HH_MM_SS_NONE("yyyyMMdd HH:mm:ss","^[1-9]\\d{3}(0[1-9]|1[0-2])(0[1-9]|[1-2][0-9]|3[0-1]) ([01][0-9]|2[0-3]):[0-5][0-9]:([0-5][0-9]|60)$"),
        YYYY_MM_DD_HH_MM_SS_BUS("yyyyMMddHHmmss","^[1-9]\\d{3}(0[1-9]|1[0-2])(0[1-9]|[1-2][0-9]|3[0-1])([01][0-9]|2[0-3])[0-5][0-9]([0-5][0-9]|60)$"),
        YYYY_MM_DD_HH_MM_SS_MILSEC_LINE("yyyy-MM-dd HH:mm:ss.SSS","^[1-9]\\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1]) ([01][0-9]|2[0-3]):[0-5][0-9]:([0-5][0-9]|60).\\d{1,3}$"),
        YYYY_MM_DD_HH_MM_SS_MILSEC_SLASH("yyyy/MM/dd HH:mm:ss.SSS","^[1-9]\\d{3}/(0[1-9]|1[0-2])/(0[1-9]|[1-2][0-9]|3[0-1]) ([01][0-9]|2[0-3]):[0-5][0-9]:([0-5][0-9]|60).\\d{1,3}$"),
        YYYY_MM_DD_HH_MM_SS_MILSEC_BACKSLASH("yyyy\\MM\\dd HH:mm:ss.SSS","^[1-9]\\d{3}\\(0[1-9]|1[0-2])\\(0[1-9]|[1-2][0-9]|3[0-1]) ([01][0-9]|2[0-3]):[0-5][0-9]:([0-5][0-9]|60).\\d{1,3}$"),
        YYYY_MM_DD_HH_MM_SS_MILSEC_NONE("yyyyMMdd HH:mm:ss.SSS","^[1-9]\\d{3}(0[1-9]|1[0-2])(0[1-9]|[1-2][0-9]|3[0-1]) ([01][0-9]|2[0-3]):[0-5][0-9]:([0-5][0-9]|60).\\d{1,3}$"),
        DEFAULT_FORMAT("yyyy-MM-dd HH:mm:ss","^[1-9]\\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1]) ([01][0-9]|2[0-3]):[0-5][0-9]:([0-5][0-9]|60)$");
        TimeFormat(String format, String regExp) {
            this.format = format;
            this.regExp = regExp;
        }
        final String format;
        final String regExp;
    }
}
```

## JDK1.8新引入

- 本地日期和时间：`LocalDateTime`，`LocalDate`，`LocalTime`
- 带时区的日期和时间：`ZonedDateTime`
- 时刻：`Instant`
- 时区：`ZoneId`，`ZoneOffset`
- 时间间隔：`Duration`
- 以及一套新的用于取代`SimpleDateFormat`的格式化类型`DateTimeFormatter`



### LocalDate和LocalTime

**基本使用**

```java
LocalDate localDate=LocalDate.now();    //获取当前日期
LocalTime localTime=LocalTime.now();    //获取当前时间
LocalDateTime localDateTime=LocalDateTime.now();    //获取当前时刻

LocalDate localDate1=LocalDate.of(1998,6,27);   //获取指定日期
LocalTime localTime1=LocalTime.of(23,59,59);       //获取指定时间
LocalDateTime localDateTime1=LocalDateTime.of(1998,6,27,23,59,59);     //获取指定时刻

System.out.println(localDate.toString()+" "+localTime.toString());   //2021-10-15 11:15:22.961561300
System.out.println(localDateTime.toString());   //2021-10-15 11:15:22.961561300

System.out.println(localDate1.toString()+" "+localTime1.toString());   //1998-06-27 23:59:59
System.out.println(localDateTime1.toString());      //1998-06-27T23:59:59
```

**相关转换**

```java
LocalDateTime localDateTime=LocalDateTime.now();
LocalDate localDate=localDateTime.toLocalDate();    //获取日期
LocalTime localTime=localDateTime.toLocalTime();    //获取时间
DateTimeFormatter dtf=DateTimeFormatter.ofPattern("yyyy-MMMM-dd HH:mm:ss");    //传入字符串
System.out.println(localDateTime.format(dtf));
```

### ZonedDateTime

`LocalDateTime`总是表示本地日期和时间，要表示一个带时区的日期和时间，就需要`ZonedDateTime`。

可以简单地把`ZonedDateTime`理解成`LocalDateTime`加`ZoneId`。`ZoneId`是`Java.time`引入的新的时区类，注意和旧的`Java.util.TimeZone`区别。

**基本使用**

```java
ZonedDateTime zdt1 = ZonedDateTime.now(); // 默认时区
ZonedDateTime zdt2 = ZonedDateTime.now(ZoneId.of("America/New_York")); // 用指定时区获取当前时间
System.out.println(zdt1);	//2021-10-15T11:37:05.565490300+08:00[Asia/Shanghai]
System.out.println(zdt2);	//2021-10-14T23:37:05.565490300-04:00[America/New_York]
```

打印的时间不同，但是属于同一时刻

**转换**

```java
// 以中国时区获取当前时间:
ZonedDateTime zbj = ZonedDateTime.now(ZoneId.of("Asia/Shanghai"));
// 转换为纽约时间:
ZonedDateTime zny = zbj.withZoneSameInstant(ZoneId.of("America/New_York"));
System.out.println(zbj);
System.out.println(zny);
```

### 时间工具类

```java
public class NewDateUtil {
    private NewDateUtil(){}
    /**
     * 获得当前时刻
     */
    public static String getCurrentDateTime(String format) {
        if (Objects.isNull(format)||format.length()==0){
            format=TimeFormat.DEFAULT_FORMAT.format;
        }
        DateTimeFormatter f = DateTimeFormatter.ofPattern(format);
        return LocalDateTime.now().format(f);
    }

    /**
     * 时间转换为字符串，如果转换格式为空使用默认格式
     */
    public static String dateToStr(LocalDateTime date, String format) {
        if (format==null||format.length()==0){
            format= TimeFormat.DEFAULT_FORMAT.format;
        }
        DateTimeFormatter f = DateTimeFormatter.ofPattern(format);
        return f.format(date);
    }

    /**
     * 时间转换为字符串，如果转换格式为空使用默认格式
     */
    public static String dateToStr(LocalDate date, String format) {
        if (format==null||format.length()==0){
            format= TimeFormat.DEFAULT_FORMAT.format;
        }
        DateTimeFormatter f = DateTimeFormatter.ofPattern(format);
        return f.format(date);
    }

    /**
     * 时间转换为字符串，如果转换格式为空使用默认格式
     */
    public static String dateToStr(LocalTime date, String format) {
        if (format==null||format.length()==0){
            format= TimeFormat.DEFAULT_FORMAT.format;
        }
        DateTimeFormatter f = DateTimeFormatter.ofPattern(format);
        return f.format(date);
    }

    /**
     * 字符串转换为时间，如果转换格式为空使用默认格式
     */
    public static LocalDateTime strToDateTime(String dateTime, String format) throws Exception {
        if (format==null||format.length()==0){
            format= TimeFormat.DEFAULT_FORMAT.format;
        }
        DateTimeFormatter f = DateTimeFormatter.ofPattern(format);;
        return LocalDateTime.parse(dateTime,f);
    }

    /**
     * 字符串转换为日期，如果转换格式为空使用默认格式
     */
    public static LocalDate strToDate(String dateTime, String format) throws Exception {
        if (format==null||format.length()==0){
            format= TimeFormat.YYYY_MM_DD_LINE.format;
        }
        DateTimeFormatter f = DateTimeFormatter.ofPattern(format);;
        return LocalDate.parse(dateTime,f);
    }

    /**
     * 字符串转换为日期，如果转换格式为空使用默认格式
     */
    public static LocalTime strToTime(String dateTime, String format) throws Exception {
        if (format==null||format.length()==0){
            format= TimeFormat.HH_MM_SS_COLON.format;
        }
        DateTimeFormatter f = DateTimeFormatter.ofPattern(format);;
        return LocalTime.parse(dateTime,f);
    }

    /**
     * 时间包括在某个时间段内
     */
    public static Boolean timeInclude(LocalDateTime checkTime, LocalDateTime begntime, LocalDateTime endtime) {
        if(begntime!=null&&endtime!=null){
            return checkTime.isAfter(begntime)&&checkTime.isBefore(endtime);
        }
        return false;
    }

    /**
     * 时间包括在某个时间段内
     */
    public static Boolean timeInclude(LocalDate checkTime, LocalDate begntime, LocalDate endtime) {
        if(begntime!=null&&endtime!=null){
            return checkTime.isAfter(begntime)&&checkTime.isBefore(endtime);
        }
        return false;
    }

    /**
     * 时间包括在某个时间段内
     */
    public static Boolean timeInclude(LocalTime checkTime, LocalTime begntime, LocalTime endtime) {
        if(begntime!=null&&endtime!=null){
            return checkTime.isAfter(begntime)&&checkTime.isBefore(endtime);
        }
        return false;
    }

    /**
     * 时间大小比较
     * 大于返回 1、小于返回 -1、等于返回 0
     */
    public static int checkTime(LocalDateTime left, LocalDateTime right) {
        return left.compareTo(right);
    }

    /**
     * 时间大小比较
     * 大于返回 1、小于返回 -1、等于返回 0
     */
    public static int checkTime(LocalDate left, LocalDate right) {
        return left.compareTo(right);
    }

    /**
     * 时间大小比较
     * 大于返回 1、小于返回 -1、等于返回 0
     */
    public static int checkTime(LocalTime left, LocalTime right) {
        return left.compareTo(right);
    }

    /**
     * 将月数转换成年数
     */
    public static double monthToYear(int month) {
        return month / 12D;
    }

    /**
     * 时间戳转换为字符串
     */
    public static String timestamp2Str(Long time) {
        LocalDateTime date = null;
        if (null != time) {
            date = LocalDateTime.ofEpochSecond(time/1000, 0, ZoneOffset.ofHours(8));
        }
        return dateToStr(date, TimeFormat.DEFAULT_FORMAT.format);
    }

    /**
     * 字符串转化为时间戳(毫秒)
     */
    public static Long str2Timestamp(String str) throws Exception {
        LocalDateTime date = strToDateTime(str, TimeFormat.DEFAULT_FORMAT.format);
        return date.toInstant(OffsetDateTime.now().getOffset()).getEpochSecond();
//        return date.toInstant(ZoneOffset.ofHours(8)).toEpochMilli();
    }

    /**
     * 计算日期之间相差天数
     */
    public static long getBetweenDays(LocalDateTime date1, LocalDateTime date2) {
        return Math.abs(date1.toLocalDate().toEpochDay()-date2.toLocalDate().toEpochDay());
    }

    /**
     * 时间转换为整数
     */
    public static Integer date2Integer(LocalDateTime date, String format) {
        String str = dateToStr(date, format);
        return Integer.valueOf(str);
    }

    /**
     * 计算到指定时间的年龄
     */
    public static int getAge(LocalDateTime birthDay, LocalDateTime endDate) {
        int age = 0;
        if (birthDay.isAfter(endDate)){
            return -1;
        }
        // 初步，估算
        age = endDate.getYear() - birthDay.getYear();

        // 如果未到出生月份，则age - 1
        if (endDate.getMonth().compareTo(birthDay.getMonth()) < 0) {
            age -= 1;
        }
        if (age < 0) { // age小于0，未满一岁
            age = 0;
        }
        return age;
    }

    /**
     * 验证字符串日期格式
     */
    public static boolean ValidateDate(String str, NewDateUtil.TimeFormat timeFormat){
        //日期的正则表达式
        return str.matches(timeFormat.regExp);
    }

    enum TimeFormat{
        HH_MM_SS_COLON ("HH:mm:ss","^([01][0-9]|2[0-3]):[0-5][0-9]:([0-5][0-9]|60)$") ,
        HH_MM_SS_MILSEC_COLON("HH:mm:ss.SSS","^([01][0-9]|2[0-3]):[0-5][0-9]:([0-5][0-9]|60).\\d{1,3}$"),
        HH_MM_SS_CHINESE ("HH时mm分ss秒","^([01][0-9]|2[0-3])时[0-5][0-9]分([0-5][0-9]|60)秒$"),
        YYYY_MM_DD_CHINESE("yyyy年MM月dd日","^[1-9]\\d{3}年(0[1-9]|1[0-2])月(0[1-9]|[1-2][0-9]|3[0-1])日$"),
        YYYY_MM_DD_LINE("yyyy-MM-dd","^[1-9]\\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])$"),
        YYYY_MM_DD_SLASH("yyyy/MM/dd","^[1-9]\\d{3}/(0[1-9]|1[0-2])/(0[1-9]|[1-2][0-9]|3[0-1])$"),
        YYYY_MM_DD_BACKSLASH("yyyy\\MM\\dd","^[1-9]\\d{3}\\(0[1-9]|1[0-2])\\(0[1-9]|[1-2][0-9]|3[0-1])$"),
        YYYY_MM_DD_NONE("yyyyMMdd","^[1-9]\\d{3}(0[1-9]|1[0-2])(0[1-9]|[1-2][0-9]|3[0-1])$"),
        YYYY_MM("yyyyMM","^[1-9]\\d{3}(0[1-9]|1[0-2])$"),
        YYYY("yyyy","^[1-9]\\d{3}$"),
        YYYY_MM_DD_HH_MM_SS_CHINESE("yyyy年MM月dd日 HH时mm分ss秒","^[1-9]\\d{3}年(0[1-9]|1[0-2])月(0[1-9]|[1-2][0-9]|3[0-1])日 ([01][0-9]|2[0-3])时[0-5][0-9]分([0-5][0-9]|60)秒$"),
        YYYY_MM_DD_HH_MM_SS_LINE("yyyy-MM-dd HH:mm:ss","^[1-9]\\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1]) ([01][0-9]|2[0-3]):[0-5][0-9]:([0-5][0-9]|60)$"),
        YYYY_MM_DD_HH_MM_SS_SLASH("yyyy/MM/dd HH:mm:ss","^[1-9]\\d{3}/(0[1-9]|1[0-2])/(0[1-9]|[1-2][0-9]|3[0-1]) ([01][0-9]|2[0-3]):[0-5][0-9]:([0-5][0-9]|60)$"),
        YYYY_MM_DD_HH_MM_SS_BACKSLASH("yyyy\\MM\\dd HH:mm:ss","^[1-9]\\d{3}\\(0[1-9]|1[0-2])\\(0[1-9]|[1-2][0-9]|3[0-1]) ([01][0-9]|2[0-3]):[0-5][0-9]:([0-5][0-9]|60)$"),
        YYYY_MM_DD_HH_MM_SS_NONE("yyyyMMdd HH:mm:ss","^[1-9]\\d{3}(0[1-9]|1[0-2])(0[1-9]|[1-2][0-9]|3[0-1]) ([01][0-9]|2[0-3]):[0-5][0-9]:([0-5][0-9]|60)$"),
        YYYY_MM_DD_HH_MM_SS_BUS("yyyyMMddHHmmss","^[1-9]\\d{3}(0[1-9]|1[0-2])(0[1-9]|[1-2][0-9]|3[0-1])([01][0-9]|2[0-3])[0-5][0-9]([0-5][0-9]|60)$"),
        YYYY_MM_DD_HH_MM_SS_MILSEC_LINE("yyyy-MM-dd HH:mm:ss.SSS","^[1-9]\\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1]) ([01][0-9]|2[0-3]):[0-5][0-9]:([0-5][0-9]|60).\\d{1,3}$"),
        YYYY_MM_DD_HH_MM_SS_MILSEC_SLASH("yyyy/MM/dd HH:mm:ss.SSS","^[1-9]\\d{3}/(0[1-9]|1[0-2])/(0[1-9]|[1-2][0-9]|3[0-1]) ([01][0-9]|2[0-3]):[0-5][0-9]:([0-5][0-9]|60).\\d{1,3}$"),
        YYYY_MM_DD_HH_MM_SS_MILSEC_BACKSLASH("yyyy\\MM\\dd HH:mm:ss.SSS","^[1-9]\\d{3}\\(0[1-9]|1[0-2])\\(0[1-9]|[1-2][0-9]|3[0-1]) ([01][0-9]|2[0-3]):[0-5][0-9]:([0-5][0-9]|60).\\d{1,3}$"),
        YYYY_MM_DD_HH_MM_SS_MILSEC_NONE("yyyyMMdd HH:mm:ss.SSS","^[1-9]\\d{3}(0[1-9]|1[0-2])(0[1-9]|[1-2][0-9]|3[0-1]) ([01][0-9]|2[0-3]):[0-5][0-9]:([0-5][0-9]|60).\\d{1,3}$"),
        DEFAULT_FORMAT("yyyy-MM-dd HH:mm:ss","^[1-9]\\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1]) ([01][0-9]|2[0-3]):[0-5][0-9]:([0-5][0-9]|60)$");
        TimeFormat(String format, String regExp) {
            this.format = format;
            this.regExp = regExp;
        }
        final String format;
        final String regExp;
    }
}
```

## Spring中日期处理

实体类`Date`类型是属于`util`包下

也可以使用jdk1.8 的 `LocalDateTime`  `LocalDate`类型

### jackson出参格式化(序列化)

出参格式化指的是，往前端传递参数时；spring 使用 json 工具将时间转换为怎么样的 json 串

**格式化配置**

优先级：@JsonFormat > ObjectMapper > properties配置

- 提供一个自定义的ObjectMapper bean，全局生效

  ```java
  @Bean
  ObjectMapper objectMapper() {
      return new Jackson2ObjectMapperBuilder()
          .findModulesViaServiceLoader(true)
          //date 序列化格式
          .dateFormat(new SimpleDateFormat("yyyy-MM-dd HH:mm:ss"))
          .timeZone("GMT+8")
          //配置给定类型 序列化
          .serializerByType(LocalDateTime.class, new LocalDateTimeSerializer(
              DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")))
          //配置给定类型 反序列化
          .deserializerByType(LocalDateTime.class, new LocalDateTimeDeserializer(
              DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")))
          .serializerByType(LocalTime.class, new LocalTimeSerializer(
              DateTimeFormatter.ofPattern("HH:mm:ss")))
          .deserializerByType(LocalTime.class, new LocalTimeDeserializer(
              DateTimeFormatter.ofPattern("HH:mm:ss")))
          .build();
  }
  ```

- 字段添加注解

  ```java
  @JsonFormat(pattern = "yyyy-MM-dd",timezone = "GMT+8")
  private LocalDateTime createTime;
  @JsonFormat(pattern = "yyyy-MM-dd",timezone = "GMT+8")
  private Date ontDate;
  ```

- 配置文件配置，注意 不会针对`LocalDateTime`不会生效

  ```properties
  spring.jackson.date-format=yyyy-MM-dd HH:mm:ss
  spring.jackson.time-zone=GMT+8
  ```

**Date**

默认格式化为：`yyyy-MM-dd'T'HH:mm:ss.SSSXXX`

**LocalDate系列**

默认格式化：

- LocalDateTime：`yyyy-MM-dd'T'HH:mm:ss.SSSXXX`
- LocalDate：`yyyy-MM-dd`
- LocalTime：`HH:mm:ss.SSSXXX`

### Fastjson出参格式化(序列化)

**格式化配置**

- 全局配置

  ```java
  fastJsonConfig.setDateFormat("yyy-MM-dd HH:ss");
  ```

- 字段添加注解

  ```java
  // 字段注解两个都可以
  @JsonFormat(pattern = "yyyy-MM-dd HH")
  @JSONField(format = "yyyy-MM-dd HH")
  ```

**Date**

默认格式为：`yyyy-MM-dd HH:mm:ss`

**LocalDate系列**

- LocalDateTime：`yyyy-MM-dd HH:mm:ss`
- LocalDate：`yyyy-MM-dd HH:mm:ss ` 时间为00:00:00
- LocalTime：`yyyy-MM-dd HH:mm:ss `年为：1970-01-01

### 入参格式化

> 注意：`param`传递接收时间参数时：使用`@DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")` 匹配前端传参可能匹配更多，但不能匹配更少，否则会报404；
>
> 例：`@DateTimeFormat(pattern = "yyyy-MM-dd")` 前台传参为`2021-12-31 12:21:21`会报错；`@DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")`前台传参为`2021-12-31`不会报错

```java
//form表单方式传值
@DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
private Date create_time;
```

1. 使用`param`传递接收时间参数时，不管什么格式，后台必须使用@DateTimeFormat注解才可以接收
2. 使用`body`传递接收时间参数时，后台默认接收`yyyy-MM-dd HH:mm:ss`格式的参数，并转换为date对象，其他格式时需要使用@JsonFormat注解才可以接收

