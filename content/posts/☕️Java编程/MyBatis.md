---
title: "MyBatis"
date: 2020-03-23
lastmod: 2020-03-23
draft: false
tags: ["数据库"]
categories: ["☕️Java编程"]
author: "lei"
---

# MyBatis

## 概述

### 三层架构

1. 界面层（springmvc）：和用户打交道，接受用户请求参数，显示处理结果（jsp，html，servlet）
2. 业务逻辑层（spring）：接受界面层传递数据，计算逻辑，调用数据库，获取数据
3. 数据访问层（持久层，MyBatis）：访问数据库，对数据进行查询、删除、修改

用户使用界面层--->业务逻辑层--->数据访问层（持久层）--->数据库

### 框架(Framework)

1. 框架是一个模板、软件；定义好了一些可重复使用的基础功能
2. 规定好了一些条款和内容；可以加入自己的东西
3. 特点
   1. 框架一般不是全能的
   2. 框架是针对某一个领域有效
   3. 框架是一个软件

### JDBC缺陷

1. 代码量很多，大量的代码重复，效率较低，业务代码和数据库操作混在一起

### MyBatis简述

1. MyBatis是apache的一个开源项目，是一个开源的持久层框架，用户数据库操作
2. MyBatis是一个sql映射框架，数据访问（DAOs）；可以将数据库一行数据映射为一个java对象
3. 功能：
   1. 提供了创建Connection、Statement、ResultSet的能力，不需要开发人员创建这些对象
   2. 提供了执行sql语句的能力
   3. 提供了循环sql，吧sql的结果转化为java对象，List集合的能力
   4. 提供了关闭资源的能力，不需要你关闭Connection、Statement、ResultSet

## MyBatis框架快速入门

### 下载

1. 在github上面可以直接下载，然后导入项目即可

### 实现步骤

1. 新建student表

2. 导入MyBatis包和mysql包

3. 新建实体类Student，对应表中一行数据

4. 创建持久层dao接口，定义操作数据库的方法

5. 创建一个MyBatis使用的配置文件
   叫做sql映射文件，一般一个表对应一个映射文件
   这个文件是xml文件

   ```xml
   <?xml version="1.0" encoding="UTF-8" ?>
   <!DOCTYPE mapper
           PUBLIC "-//MyBatis.org//DTD Mapper 3.0//EN"
           "http://MyBatis.org/dtd/MyBatis-3-mapper.dtd">
   <mapper namespace="com.lei.dao.StudentDao">
       <!--
           id：是你要执行sql语句的唯一标识，MyBatis会根据你这个id值来找到你需要执行的sql语句，
           你可以自定义，但要求使用接口中的方法名
           resultType：表示sql语句执行后，返回什么类型，值写的是类型的全限定名称
           -->
       <select id="selectStuds" resultType="com.lei.domain.Student">
           select * from t_student order by id
       </select>
   </mapper>
   <!--
   1.指定约束文件为MyBatis-3-mapper.dtd
       <!DOCTYPE mapper
           PUBLIC "-//MyBatis.org//DTD Mapper 3.0//EN"
           "http://MyBatis.org/dtd/MyBatis-3-mapper.dtd">
   2.mapper当前文件根标签
       <mapper namespace="test"></mapper>
       namespace叫做命名空间，唯一值的，要求使用dao接口的全限定名称
   3.在当前文件使用特定标签，表述数据库的特定操作
       <select id="selectBlog" resultType="Blog">
           select * from Blog where id = #{id}
       </select>
   
       <select>：表示查询，select语句
       <update>：表示数据库更新操作
       <inster>：表示插入，放的是insert语句
       <delete>：表示删除，放的是delete语句
   -->
   ```

6. 创建MyBatis主配置文件：
   一个项目就一个主配置文件
   主配置文件提供了数据库连接信息和sql文件映射的位置信息

   ```xml
   <?xml version="1.0" encoding="UTF-8" ?>
   <!DOCTYPE configuration
           PUBLIC "-//MyBatis.org//DTD Config 3.0//EN"
           "http://MyBatis.org/dtd/MyBatis-3-config.dtd">
   <configuration>
       <!--MyBatis设置，控制其全局行为-->
       <settings>
   		<!--设置MyBatis输出日志-->
           <setting name="logImpl" value="STDOUT_LOGGING"/>
       </settings>
       <!-- 和spring整合后 environments配置将废除-->
       <environments default="development">
           <environment id="development">
               <!-- type="JDBC" 代表使用JDBC的提交和回滚来管理事务 -->
               <transactionManager type="JDBC" />
               <!-- MyBatis提供了3种数据源类型，分别是：POOLED,UNPOOLED,JNDI -->
               <!-- POOLED 表示支持JDBC数据源连接池 -->
               <!-- UNPOOLED 表示不支持数据源连接池 -->
               <!-- JNDI 表示支持外部数据源连接池 -->
               <dataSource type="POOLED">
                   <property name="driver" value="com.mysql.jdbc.Driver"/>
                   <property name="url" value="jdbc:mysql://localhost:3306/mydatabase"/>
                   <property name="username" value="root"/>
                   <property name="password" value="123456"/>
               </dataSource>
   
           </environment>
       </environments>
       <mappers>
           <mapper resource="com\lei\dao\StudentDao.xml"/>
       </mappers>
   </configuration>
   <!--
       MyBatis的主配置文件，定义了数据库配置以及sql映射文件配置
       <configuration>
             <environment>
                   环境配置
             </environment>
             <mappers>
                   一个mapper标签指定一个文件的位置
                   从类路径开始的路径信息
             </mappers>
       </configuration>
   -->
   ```

7. 创建使用的MyBatis类
   通过MyBatis访问数据库

   ```java
   public static void main(String[] args) throws IOException {
       String resource = "MyBatis-config.xml";
       // 通过流将核心配置文件读取进来
       InputStream inputStream = null;
       inputStream = Resources.getResourceAsStream(resource);
       // 通过核心配置文件创建会话工厂
       SqlSessionFactoryBuilder builder = new SqlSessionFactoryBuilder();
       SqlSessionFactory factory=builder.build(inputStream);
       // 通过会话工厂创建会话
       SqlSession session = factory.openSession();
       //找到对应的sql语句，并执行
       String sqlId="com.lei.dao.StudentDao"+"."+"selectStuds";
       List<Student> studs=session.selectList(sqlId);
       for(Student s:studs){
          System.out.println(s);
       }
       session.close();
   }
   ```

### 插入操作

StudentDao.xml

```xml
<insert id="insertStud">
    insert into t_student values(#{id},#{name},#{age})
</insert>
```

调用

```java
try {
    SqlSessionFactory factory=Mybatis.getSqlSessionFactory();
    session=factory.openSession();
    res=session.insert("com.lei.dao.StudentDao.insertStud",stud);
} catch (IOException e) {
    e.printStackTrace();
}finally {
    if (session!=null){
        session.commit();//MyBatis默认不自动提交事务
        session.close();
    }
}
```

## 使用 SqlSession

在 MyBatis 中，你可以使用 `SqlSessionFactory` 来创建 `SqlSession`。 一旦你获得一个 session 之后，你可以使用它来执行映射了的语句，提交或回滚连接，最后，当不再需要它的时候，你可以关闭 session。 使用 MyBatis-Spring 之后，你不再需要直接使用 `SqlSessionFactory` 了，因为你的 bean 可以被注入一个线程安全的 `SqlSession`，它能基于 Spring 的事务配置来自动提交、回滚、关闭 session

### SqlSessionTemplate

当调用 SQL 方法时（包括由 `getMapper()` 方法返回的映射器中的方法），`SqlSessionTemplate` 将会保证使用的 `SqlSession` 与当前 Spring 的事务相关

## MyBatis框架Dao代理

### 主要类的介绍

1. **Resources**：MyBatis中的一个类，负责读取配置文件

   InputStream in=Resources.getResourceAsStream("MyBatis.xml")

   

2. **SqlSessionFactoryBuilder**：负责创建SqlSessionFactoryBuilder对象

   SqlSessionFactoryBuilder builder=new SqlSessionFactoryBuilder()

   SqlSessionFactory factory=builder.build(in)

   

3. **SqlSessionFactory** 重量级对象，创建时间长，消耗资源多；整个程序有一个就够了

   SqlSessionFactory：接口；DefaultSqlSessionFactory：SqlSessionFactory 接口实现类

   SqlSessionFactory 作用：获取SqlSession对象；SqlSession sqlsession=factory.openSession()；openSession()无参，获取非自动提交事务的SqlSession对象；openSession(true)，获取事务自动提交的SqlSession对象

   

4. **SqlSession**接口：定义了操作数据的方法；例如：selectOne()、selectList()、insert()、commit()、rollback()等

   SqlSession接口实现类：DefaultSqlSession

   使用要求：SqlSession对象不是线程安全的，需要在方法内部使用，在执行sql语句之前，先获取SqlSession对象，执行完后关闭SqlSession它，这样可以保证线程安全

### MyBatis工具类的创建

```java
public class MybatisUtil {
    private static SqlSessionFactory factory=null;
    static {
        String resource = "MyBatis-config.xml";
        // 通过流将核心配置文件读取进来
        InputStream inputStream = null;
        try {
            inputStream = Resources.getResourceAsStream(resource);
        } catch (IOException e) {
            e.printStackTrace();
        }
        SqlSessionFactoryBuilder builder = new SqlSessionFactoryBuilder();
        factory=builder.build(inputStream);
    }

    /**
     * 非自动提交事务的sqlsession对象
     * @return sqlsession对象
     */
    public static SqlSession getSqlSession()  {
        SqlSession sqlSession=null;
        if (factory!=null){
            // 通过核心配置文件创建会话工厂
            sqlSession=factory.openSession();
        }
        return sqlSession;
    }
    /**
     * 自动提交事务的sqlseesion对象
     * @return sqlsession对象
     */
    public static SqlSession getSqlSession(boolean flag)  {
        SqlSession sqlSession=null;
        if (factory!=null){
            // 通过核心配置文件创建会话工厂
            sqlSession=factory.openSession(flag);
        }
        return sqlSession;
    }
}
```

### MyBatis动态代理

1. 因为mapper的命名空间与dao接口的全限定名称对应、同时相关sql语句id与dao接口中的方法对应，

   以上两中对应是一种规定，命名时注意；根据返回值类型，调用对应的方法，如果是List，调用sqlSession.selectList()方法；如果返回值是int，则查看mapper文件中的标签，从而执行对应的方法，

2. MyBatis根据dao方法调用，获取执行sql语句信息；MyBatis根据你得dao接口，创建出一个dao接口实现类，并创建这个类的对象；完成SqlSession调用方法去访问数据库

3. 不要使用重载方法，因为sql语句id根据方法名命名

```java
/**
* 通过MyBatis的动态代理，sqlSession.getMapper(StudentDao.class)
* MyBatis能通过上述代码，取得StudentDao接口的实例对象（像创建实现类，再创建接口）
* 执行查询操作，注意mapper中的namespace与sql语句id  对应  Dao接口的全限定名称和方法名
*/
public static void selectStud(){
    SqlSession sqlSession= Mybatis.getSqlSession();
    StudentDao dao=sqlSession.getMapper(StudentDao.class);
    //查询操作
    List<Student> studs=dao.selectStuds();
    for (Student stud:studs){
        System.out.println(stud);
    }
}
public static void insertStud(){
    SqlSession sqlSession= Mybatis.getSqlSession();
    StudentDao dao=sqlSession.getMapper(StudentDao.class);
    //  插入操作
    int res=dao.insertStud(new Student("A0020","刘备",32));
    System.out.println(res);
}
```

### Mybatis传参

1. **parameterType**：写在mapper文件中的一个属性，表示dao接口中方法的参数的数据类型；
   parameterType 是dao接口中方法参数的数据类型，它的值是java数据类型的全限定名称或者MyBatis定义的别名(MyBatis文档可以看到，都是数据类型的小写)；
   这个值可以没有，不是强制的，MyBatis通过反射机制能够发现接口参数的数据类型

2. 简单类型参数：MyBatis把java的基本数据类型和string都看作简单类型
   在mapper中获取一个简单类型参数的值，使用**#{任意字符}**
   MyBatis：创建JDBC连接对象-->PrepareStatement对象(预编译)-->设置sql语句中占位符值，并执行sql-->将查询结果封装返回

3. 多个参数，使用**@Param**命名参数（推荐使用）

   ```java
   //通过注解，定义方法时写上对应参数的名字
   List<Student> selectStuds(@Param("id") String id,@Param("age") Integer age);
   ```

   mapper文件中

   ```xml
   <!--写上方法中对应参数名-->
   <select id="selectStuds" resultType="com.lei.domain.Student">
       select * from t_student where id=#{id} or age=#{age}
   </select>
   ```

4. 多个参数，使用对象方式**#{属性名，javaType=类型名称，jdbcType=数据类型}**

   ​	javaType：指java类型中属性的数据类型

   ​	jdbcType：指在数据库中的数据类型(MyBatis文档可查)

   ​	例如：#{paramName,javaType=java.lang.String,jdbcType=VARCHAR}

   以上时完整的，平常开发使用简化版，#{属性名}，可以通过反射获取javaType，jdbcType的值，不需要指定类型

   ```java
   /*创建java类,通过传递参数到mapper*/
   public class Student {
       private String id;
       private String name;
       private Integer age;
       //。。。。
   }
   ```

   mapper文件中

   ```xml
   <!--写类中对应属性名，作为参数-->
   <select id="selectStuds" resultType="com.lei.domain.Student">
       select * from t_student where id=#{id} or age=#{age}
   </select>
   ```

5. 多个参数，按位置顺序传参（了解）；MyBatis3.4版本后#{arg0},#{arg1}等，获取参数

6. map传参，通过key获取value值（了解）；#{key1},#{key2}

### #和$的区别

   #：可以防止sql注入，占位符，使用预编译对象PrepareStatement执行sql，安全
   $：字符串的连接与替换，直接拼接到sql语句中，使用对象Statement执行sql，可以被sql注入，效率低

### 封装MyBatis输出结果

1. MyBatis执行sql语句，得到java对象

2. resultType结果类型，指sql语句执行结束后，数据转化为java对象，这个java类型是任意的

   1. MyBatis执行sql语句，然后MyBatis调用类的无参构造，创建对象
   2. MyBatis把resultSet指定列的值赋值给对象同名属性
   3. resultType值有两种：MyBatis规定的别名、全限定名称

3. 定义resultType 自定义类型的别名

   1. 在MyBatis的主配置文件中，\<configuration\>标签下定义，使用时直接给resultType值就行

   ```xml
   <!--方式1：type是全限定名称，alias是定义的别名-->
   <configuration>
   	<typeAliases>
       	<typeAlias type="java类型的全限定名称" alias="stu" />
       </typeAliases>
   </configuration>
   <!--方式2；name是包名，然后该包下所有的类名就是别名-->
   <configuration>
   	<typeAliases>
       	<package name="com.lei.domain"/>
       </typeAliases>
   </configuration>
   
   <!--在mapper中使用-->
   <select id="selectId" resultType="stu">
   	select * from t_student where id=#{id}
   </select>
   ```

4. resultType 返回map

   1. 列值是map的value
   2. 且只能查询一条记录返回，多行记录返回会报错

5. resultMap：结果映射，指定列名和java对象属性对应关系

   1. 自定义列值赋值给对象的哪个属性
   2. reslutMap与resultType不能一起使用
   3. 当你对象属性名与列名不一样时，一定使用resultMap
6. 先定义resultMap；然后再mapper标签中引用定义resultMap的id就可

   ```xml
   <!--mapper文件-->
   <!--定义resultMap-->
   <resultMap id="map1" type="java类型的全限定名称">
       <!--主键列-->
       <id colum="列名" property="属性名"/>
        <!--非主键列-->
       <result colum="列名" property="属性名"/>
   </resultMap>
   
   <!--引用resultMap,此时MyBatis根据mapper对应映射关系-->
   <select id="selectId" restypeMap="map1">
   	select * from t_student
   </select>
   ```
   
6. 列名与属性名不一致的第二种解决办法（第一种是定义resultMap）

   1. resultType默认原则，同名的列值赋给同名的属性
   2. 可以使用别名方式查询，别名应该是java类型的属性名

### like模糊查询

1. 方式一：在java代码中指定like的内容，推荐

   ```java
   //java代码中准备好like模糊查询的的内容
   //name应该为拼接好的like值,例如：%李%
   List<Student> selectLike(String name);
   
   //mapper中内容应该为
   <select id="selectAll" resultMap="studentMap">
       select * from t_student like #{name}
   </select>
   ```

2. 方式二：在mapper文件中来拼接like内容

   ```xml
   <!--此时name传入的值应该为: 李  然后再mapper中拼接-->
   <select id="selectAll" resultMap="studentMap">
       select * from t_student like "%" #{name} "%"
   </select>
   ```

### 多表联查

domain不能代表返回值，解决方案：map 或者 vo

1. 可以使用map返回值类型，sql语句中可以取别名
2. 可以使用vo，作为多表联查返回值类型；需要创建出一个类，类中属性由我们自己定义，属性会包含所需要展示的信息

## MyBatis框架动态SQL

### 简介

1. 动态sql，指的是sql语句是变化的，可以根据条件获取不同的sql语句
2. 动态sql语句的实现，使用的是MyBatis提供的标签 \<if\>,\<where\>,\<foreach\>
3. 动态sql必须使用java对象作为参数

### \<if\>标签

1. \<if\>是判断条件的，语法如下

   ```xml
   <!--test中语法：属性=xxx值 -->
   <if test="判断java对象的属性值">
   	部分sql语句
   </if>
   
   <!--mapper文件中实例
   	where 后代码：where 1=1  防止sql语法错误
   -->
   <select id="selectAll" resultType="com.lei.domain.Student">
       select * from t_student where 1=1
       <if test="name !=null and name!=' ' ">
           name=#{name} 
       </if>
       <if test=" age>0 ">
          and age>#{age}
       </if>
   </select>
   ```

### \<where\>标签

1. \<where\>用来包含多个\<if\>的，当多个if有一个成立，\<where\>标签会自动增加一个where关键字，并去掉最后sql中多余的or，and 防止语法错误

   ```xml
   <!--mapper文件中实例
   	where 后代码：where 1=1  防止sql语法错误
   -->
   <select id="selectAll" resultType="com.lei.domain.Student">
       select * from t_student 
       <where>
           <if test="name !=null and name!=' ' ">
               name=#{name} 
           </if>
           <if test=" age>0 ">
              and age>#{age}
           </if>
       </where>
   </select>
   ```



### \<foreach\>标签

1. 循环标签，用户循环java中数组、List集合的。主要用于sql的in语句中

2. 参数意义

   1. collection：表示接口中的方法参数类型，如果是数组使用array，如果是list集合使用list
   2. item：自定义的，表示数组和集合成员的变量
   3. open：循环开始时的字符
   4. close：循环结束时的字符
   5. separator：集合成员之间的分隔符

   ```xml
   <!--
   	学生id是：1001，1002，1003的三个学生
   	select * from student where id in (1001,1002,1003)
   
   	public List<Student> selectFor(List<Integer> idList);
   
   	List<Integer> idList=new ...;
   	idList.add(1001);
   	idList.add(1002);
   	idList.add(1003);
   	dao.selectFor(idList);
   
   	<foreach>可以将list集合中内容循环遍历，并拼接为sql语句
   -->
   
   <!--foreach使用1，List<Integer> -->
   <select id="selectAll" resultType="com.lei.domain.Student">
       select * from t_student where id in
       <foreach collection="list" item="myid" open="("  separator="," close=")" > #{myid} </foreach>
   </select>
   
   <!--foreach使用2,List<Object>，拿到属性名-->
   <select id="selectAll" resultType="com.lei.domain.Student">
       select * from t_student where id in
       <foreach collection="list" item="obj" open="("  separator="," close=")" > #{obj.id} </foreach>
   </select>
   ```



### 动态sql的代码片段

1. 复用sql语句
2. 首先使用\<sql id="唯一id"\>标签定义一个代码片段
3. 然后使用\<include refid="自定义片段的id " \>标签引用代码片段

## 配置文件介绍

### 属性配置文件

1. 在根目录下定义一个属性配置文件，xxx.properties，例如：jdbc.properties

   ```properties
   jdbc.driver=com.mysql.jdbc.Driver
   jdbc.url=jdbc:mysql://192.168.220.130:3306/mytest?characterEncoding=utf-8
   jdbc.user=root
   jdbc.password=123456
   ```

2. 在mybaties主配置文件中，使用\<properties\>标签指定文件位置；然后在需要使用值的地方：${key}

### 引入mapper文件

1. 方式一：mapper

   ```xml
    <mappers>
       <mapper resource="com\lei\dao\StudentDao.xml"/>
       <mapper resource="com\lei\dao\OderDao.xml"/>
   </mappers>
   ```

2. 方式二：package（mapper与dao文件同一目录且文件名相同）

   ```xml
    <mappers>
        <!--
   	这个包中所有xml文件可以一次加载给MyBatis
   	要求：dao接口与mapper文件名一样且在同一目录
   	-->
        <package resource="包名"/>
   </mappers>
   ```

### 主配置文件

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE configuration
        PUBLIC "-//MyBatis.org//DTD Config 3.0//EN"
        "http://MyBatis.org/dtd/MyBatis-3-config.dtd">
<configuration>
    <!--    属性配置文件位置-->
    <properties resource="jdbc.properties"></properties>

    <!--    
		MyBatis设置，控制其全局行为，与数据库交互环境（二级缓存，加载策略...）
		对于海量级别数据，如何提高查询效率
		基础操作：
			对于常用查询字段，设置索引（加目录）
		高级操作
 			使用nosql数据库，redis
		专业操作
			针对于电商行业，搜索引擎（Elasticsearch和Solr）
	-->
    <settings>
        <!--        设置MyBatis输出日志-->
        <setting name="logImpl" value="STDOUT_LOGGING"/>
    </settings>
	
    <!-- 为mapper映射文件的domain起别名 -->
    <typeAliases>
    	<!--
			方式1：为指定的类分别起别名，别名的命名有我们自己决定
				<typeAlias type="com.lei.domain.Student" alias="Student"/>
				type：指定为那个domain起别名
				alias：别名名字
			方式2：使用package标签，批量起别名，别名是MyBatis默认取好的，命名不由我们自己决定
				<package name="com,lei,domain" />
				name：表示在该包下，所有domain自动起好了别名，别名就是类名
		-->
    </typeAliases>
    
    <!--    插件配置-->
    <plugins>
        <plugin interceptor="com.github.pagehelper.PageInterceptor" />
    </plugins>

    <!-- 和spring整合后 environments配置将废除-->
    <environments default="development">
        <environment id="development">
            <!-- type="JDBC" 代表使用JDBC的提交和回滚来管理事务 -->
            <transactionManager type="JDBC" />
            <!--
				dataSource：表示数据源，在java体系中，规定实现javax.sql.DataSource接口的都是数据源
				MyBatis提供了3种数据源类型，分别是：POOLED,UNPOOLED,JNDI
            		POOLED 表示支持JDBC数据源连接池
          			UNPOOLED 表示不支持数据源连接池；每次执行sql，都会先创建链接，执行sql，关闭连接
           			JNDI 表示支持外部数据源连接池，java命名和目录（类似windows注册表）
 			-->
            <dataSource type="POOLED">
                <property name="driver" value="${jdbc.driver}" />
                <property name="url" value="${jdbc.url}"/>
                <property name="username" value="${jdbc.user}"/>
                <property name="password" value="${jdbc.password}"/>
            </dataSource>

        </environment>
    </environments>
    <!--指定mapper映射文件-->
    <mappers>
        <mapper resource="com\lei\dao\StudentDao.xml"/>
        <!--
			方式1：使用resource属性，指定mapper映射文件
				<mapper resource="com\lei\dao\StudentDao.xml"/>
			方式2：使用class属性，找到dao层接口的全路径
				<mapper class="com.lei.dao.StudentDao"/>
			方式3：使用package 批量注册
				<package name="" />
				name：指向dao层包，表示该包下所有mapper映射文件加载
-->
    </mappers>
</configuration>
        <!--
            MyBatis的主配置文件，定义了数据库配置以及sql映射文件配置
            <configuration>
                  <environment>
                        环境配置
                  </environment>
                  <mappers>
                        一个mapper标签指定一个文件的位置
                        从类路径开始的路径信息
                  </mappers>
            </configuration>
        -->

```

### mapper映射文件

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE mapper
        PUBLIC "-//MyBatis.org//DTD Mapper 3.0//EN"
        "http://MyBatis.org/dtd/MyBatis-3-mapper.dtd">
<mapper namespace="com.lei.dao.OrderDao">
    <!--
    paramterType
        使用简单类型的参数，在 #{} 中的名字可以随便写
        传递多个参数
            1.使用在方法处使用：@Param命名参数
                List<Student> selectStuds(@Param("id") String id,@Param("age") Integer age);
            2.传递对象
                #{} 中必须为对象的属性
            3.传递map
                #{} 中必须为map的key
        parameterType 一般不写，MyBatis会自动识别
    -->
    <!--
        #{}：占位符，可以防止sql注入
        ${}：字符串拼接
    -->
    <!--
    模糊查询
        方式1：使用 ${} ，拼接sql（了解，不常用）
            select * from t_student where name like '%${value}%'
        方式2：使用 #{} ,占位符，直接传入拼接好的条件字符串
            String value="%z%";
            select * from t_student where name like #{value}
        方式3：使用 #{} ,占位符，传入条件字符串，在sql中拼接，sql中空格相当于拼接
            select * from t_student where name like % #{value} %
    -->
    <!--
    resultType与resultMap
    resultType 可以为domain类型（常用），也可以是map；
        在domain类型封装不了结果类型时，使用map
        例如：根据姓名分组，并返回每一个姓名对应的数量，使用map进行封装；查询字段与doamin属性不一致时 都使用map
    resultMap domain中类型属性名与数据库表字段名一一对应
        <resultMap id="唯一名称" type="domain类型">
            <id property="domain中属性名" column="主键字段" />
            <result property="domain中属性名" column="非主键字段" />
        </resultMap>
        <select id="" resultMap="resultMap的唯一id" />
    -->
    <!--
     动态sql：有什么查询条件，在sql语句where后添加什么条件
        <where>标签里面必有<if>标签，如果有条件，则展现where关键字，如果没有条件则不展现where关键字
            并且<where>标签会自动屏蔽掉第一个连接符 and/or
        <if test=" 属性名1!=null and 属性名1!='' " > </if>
        <foreach>标签用来遍历传过来的数组，常用在sql语句的in关键字后

        <where>
            <if test="条件"> name like '%'#{name}'%' </if>
        </where>
        <foreach collection="array/list" item="" open="循环开始符号" close="循环结束符号" separator="元素之间分隔符" />
    -->
    <!--
    sql片段：常用在重复率高且复杂的子查询，大量的sql片段会降低代码的可读性
        定义：<sql id="sql片段的唯一标识">重复的sql代码</sql>
        引用：<include refid="sql片段id" />
    -->

    <select id="select1" parameterType="java.lang.String" resultType="Order">
        select * from tb_student where id=#{id}
    </select>
</mapper>
```



## 插件

MyBatis允许用户在已映射语句执行过程中的某一点进行拦截调用。MyBatis使用插件来拦截的方法调用，故此MyBatis插件通常称为：Mybatis拦截器。默认情况下，MyBatis允许使用插件来拦截的对象包括下面的四个：

```tex
Executor：拦截执行器的方法。
ParameterHandler：拦截参数的处理。
ResultHandler：拦截结果集的处理。
StatementHandler：拦截Sql语法构建的处理。
```

- @Intercepts：标识该类是一个拦截器

- @Signature：指明自定义拦截器需要拦截哪一个类型，哪一个方法
  - type：上述四种类型中的一种；
  - method：对应接口中的哪类方法（因为可能存在重载方法）
  -  args：对应哪一个方法的入参

### 相关注解介绍

1. 类上使用注解`@Intercepts`，定义拦截信息，只有符合条件的才会进入拦截，参数为拦截点

   ```java
   @Documented
   @Retention(RetentionPolicy.RUNTIME)
   @Target(ElementType.TYPE)
   public @interface Intercepts {
       /**
        * 定义拦截点
        * 只有符合拦截点的条件才会进入到拦截器
        */
       Signature[] value();
   }
   ```

2. 使用`@Signature`注解定义拦截点，指定需要拦截哪个类对象的哪个方法

   ```java
   @Documented
   @Retention(RetentionPolicy.RUNTIME)
   @Target({})
   public @interface Signature {
     /**
      * 定义拦截的类 Executor、ParameterHandler、StatementHandler、ResultSetHandler当中的一个
      */
     Class<?> type();
   
     /**
      * 在定义拦截类的基础之上，在定义拦截的方法
      */
     String method();
   
     /**
      * 在定义拦截方法的基础之上在定义拦截的方法对应的参数，
      * JAVA里面方法可能重载，故注意参数的类型和顺序
      */
     Class<?>[] args();
   }
   ```

**@Intercepts**注解的使用规则

```java
@Intercepts({//这里可以定义多个@Signature对多个地方拦截，都用这个拦截器
        @Signature(
                type = ResultSetHandler.class,
                method = "handleResultSets", 
                args = {Statement.class}),
        @Signature(type = Executor.class,
                method = "query",
                args = {MappedStatement.class, Object.class, RowBounds.class, ResultHandler.class})
})
```

### 拦截器实例

> 编写拦截器实现sql语句打印，以及执行时间打印

1. 编写拦截器，实现`Interceptor `接口

   ```java
   @Intercepts(value = {
           @Signature(type = Executor.class, method = "update", args = {MappedStatement.class, Object.class}),
           @Signature(type = Executor.class, method = "query", args = {MappedStatement.class, Object.class, RowBounds.class, ResultHandler.class, CacheKey.class, BoundSql.class}),
           @Signature(type = Executor.class, method = "query", args = {MappedStatement.class, Object.class, RowBounds.class, ResultHandler.class})
   })
   @Slf4j
   public class ExamplePlugin2 implements Interceptor {
   
       //方法拦截
       @Override
       public Object intercept(Invocation invocation) throws Throwable {
           StopWatch stopWatch=new StopWatch();
           try {
               stopWatch.start("sql执行任务");
               return invocation.proceed();//执行sql过程
           }catch (Exception e){
               e.printStackTrace();
               throw e;
           }finally {
               MappedStatement statement= (MappedStatement) invocation.getArgs()[0];
               Object parameter = "";
               if (invocation.getArgs().length>1){
                   parameter = invocation.getArgs()[1];
               }
               BoundSql boundSql = statement.getBoundSql(parameter);// BoundSql就是封装myBatis最终产生的sql类
               Configuration configuration = statement.getConfiguration();// 获取节点的配置
               String sql = getSql(configuration, boundSql);
               log.info(sql);
               stopWatch.stop();
               log.info(stopWatch.getLastTaskName()+":"+stopWatch.getLastTaskTimeMillis()+"ms");
           }
       }
   
       /**
        * 获取带参SQL
        */
       public static String getSql(Configuration configuration, BoundSql boundSql) {
           Object parameterObject = boundSql.getParameterObject();//获取参数
           List<ParameterMapping> parameterMappings = boundSql
                   .getParameterMappings();
           String sql = boundSql.getSql().replaceAll("[\\s]+", " ");//sql语句中多个空格都用一个空格代替
           if (parameterMappings.size() > 0 && parameterObject != null) {
               TypeHandlerRegistry typeHandlerRegistry = configuration.getTypeHandlerRegistry(); //获取类型处理器注册器，类型处理器的功能是进行java类型和数据库类型的转换。如果根据parameterObject.getClass(）可以找到对应的类型，则替换
               if (typeHandlerRegistry.hasTypeHandler(parameterObject.getClass())) {
                   sql = sql.replaceFirst("\\?", Matcher.quoteReplacement(getParameterValue(parameterObject)));
               } else {
                   MetaObject metaObject = configuration.newMetaObject(parameterObject);//MetaObject主要是封装了originalObject对象，提供了get和set的方法用于获取和设置originalObject的属性值,主要支持对JavaBean、Collection、Map三种类型对象的操作
                   for (ParameterMapping parameterMapping : parameterMappings) {
                       String propertyName = parameterMapping.getProperty();
                       sql = formatSql(boundSql, sql, metaObject, propertyName);
                   }
               }
           }
           return sql;
       }
   
       /**
        * 格式化SQL(替换?)
        */
       private static String formatSql(BoundSql boundSql, String sql, MetaObject metaObject, String propertyName) {
           if (metaObject.hasGetter(propertyName)) {
               Object obj = metaObject.getValue(propertyName);
               sql = sql.replaceFirst("\\?", Matcher.quoteReplacement(getParameterValue(obj)));
           } else if (boundSql.hasAdditionalParameter(propertyName)) {
               Object obj = boundSql.getAdditionalParameter(propertyName);//该分支是动态sql
               sql = sql.replaceFirst("\\?", Matcher.quoteReplacement(getParameterValue(obj)));
           } else {
               sql = sql.replaceFirst("\\?", "缺失");//打印出缺失，提醒该参数缺失并防止错位
           }
           return sql;
       }
   
       /**
        * 对SQL进行格式化
        */
       private static String getParameterValue(Object obj) {
           String value = null;
           if (obj instanceof String) {
               value = "'" + obj.toString() + "'";
           } else if (obj instanceof Date) {
               DateFormat formatter = DateFormat.getDateTimeInstance(DateFormat.DEFAULT, DateFormat.DEFAULT, Locale.CHINA);
               value = "'" + formatter.format(obj) + "'";
           } else {
               if (obj != null) {
                   value = obj.toString();
               } else {
                   value = "";
               }
           }
           return value;
       }
   
       //获取到拦截的对象，底层也是通过代理实现的，实际上是拿到一个目标代理对象
       @Override
       public Object plugin(Object target) {
           return Plugin.wrap(target, this);
       }
   
   }
   ```

2. 注册该插件(拦截器)到MyBatis的拦截器链中

   ```java
   @Bean
   public MybatisInterceptor MyBatisInterceptor(SqlSessionFactory sqlSessionFactory) {
       MybatisInterceptor plugin2=new MybatisInterceptor();
       sqlSessionFactory.getConfiguration().addInterceptor(plugin2);
       return plugin2;
   }
   ```
   
   或
   
   ```xml
   
   <!--    插件配置,在<environments> 标签上面-->
   <plugins>
       <plugin interceptor="com.lei.config.ExamplePlugin2" />
   </plugins>
   ```



## 扩展

### PageHelper

1. PageHelper用来做数据分页的

2. 在 [分页插件的下载地址](https://github.com/pagehelper/Mybatis-PageHelper)

3. 在MyBatis主配置文件中配置插件

   ```xml
       <!--    插件配置,在<environments> 标签上面-->
       <plugins>
           <plugin interceptor="com.github.pagehelper.PageInterceptor" />
       </plugins>
   ```

4. java中使用

   ```java
       public static void selectAll(){
           SqlSession sqlSession= Mybatis.getSqlSession();
           StudentDao dao=sqlSession.getMapper(StudentDao.class);
           //加入pagehelper的方法，分页；参数为 ： 第几页开始，每页多少数据
           PageHelper.startPage(1,3);
           List<Student> stus=dao.selectAll();
           for (Student a:stus){
               System.out.println(a);
           }
       }
   ```


### 工具类

1. MyBatis封装

   ```java
   public class SqlSessionUtil {
       private static SqlSessionFactory sessionFactory;
       //静态代码块，只执行一次，类被加载时
       static {
           try {
               InputStream inputStream= Resources.getResourceAsStream("MyBatis-config.xml");
               sessionFactory=new SqlSessionFactoryBuilder().build(inputStream);
           } catch (IOException e) {
               e.printStackTrace();
           }
       }
   
       //私有化构造方法
       private SqlSessionUtil(){}
   
       //线程变量,意思是ThreadLocal中填充的变量属于当前线程，该变量对其他线程而言是隔离的；保证同一个SqlSession对象
       private static ThreadLocal<SqlSession> t=new ThreadLocal<>();
   
       //取得SqlSession对象
       public static SqlSession getSqlSession(){
           SqlSession sqlSession=t.get();
           if (sqlSession==null){
               sqlSession=sessionFactory.openSession();
               t.set(sqlSession);
           }
           return sqlSession;
       }
   
       //关闭SqlSession对象
       public static void closeSqlSession(SqlSession sqlSession){
           if (sqlSession!=null){
               sqlSession.close();
           //用户发送请求，服务器分配一条线程，执行结束后，线程回到线程池中，并没有被销毁；所以需要移除，保证线程的干净
               t.remove();
           }
       }
   }
   
   ```

   

2. 动态代理封装

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


### manev配置

```xml
<?xml version="1.0" encoding="UTF-8"?>

<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
  <modelVersion>4.0.0</modelVersion>

  <groupId>org.example</groupId>
  <artifactId>ch03</artifactId>
  <version>1.0-SNAPSHOT</version>
  <packaging>war</packaging>

  <name>ch03 Maven Webapp</name>
  <!-- FIXME change it to the project's website -->
  <url>http://www.example.com</url>

  <properties>
    <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
    <maven.compiler.source>1.7</maven.compiler.source>
    <maven.compiler.target>1.7</maven.compiler.target>
  </properties>

  <dependencies>
    <dependency>
      <groupId>junit</groupId>
      <artifactId>junit</artifactId>
      <version>4.11</version>
      <scope>test</scope>
    </dependency>
    <dependency>
      <groupId>javax.servlet</groupId>
      <artifactId>servlet-api</artifactId>
      <version>2.5</version>
    </dependency>
    <dependency>
      <groupId>javax.servlet.jsp</groupId>
      <artifactId>jsp-api</artifactId>
      <version>2.2</version>
    </dependency>
    <dependency>
      <groupId>org.MyBatis</groupId>
      <artifactId>MyBatis</artifactId>
      <version>3.5.5</version>
    </dependency>
    <dependency>
      <groupId>mysql</groupId>
      <artifactId>mysql-connector-Java</artifactId>
      <version>5.1.3</version>
    </dependency>
  </dependencies>

  <build>
    <finalName>ch03</finalName>
    <pluginManagement><!-- lock down plugins versions to avoid using Maven defaults (may be moved to parent pom) -->
      <plugins>
        <plugin>
          <artifactId>maven-clean-plugin</artifactId>
          <version>3.1.0</version>
        </plugin>
        <!-- see http://maven.apache.org/ref/current/maven-core/default-bindings.html#Plugin_bindings_for_war_packaging -->
        <plugin>
          <artifactId>maven-resources-plugin</artifactId>
          <version>3.0.2</version>
        </plugin>
        <plugin>
          <artifactId>maven-compiler-plugin</artifactId>
          <version>3.8.0</version>
        </plugin>
        <plugin>
          <artifactId>maven-surefire-plugin</artifactId>
          <version>2.22.1</version>
        </plugin>
        <plugin>
          <artifactId>maven-war-plugin</artifactId>
          <version>3.2.2</version>
        </plugin>
        <plugin>
          <artifactId>maven-install-plugin</artifactId>
          <version>2.5.2</version>
        </plugin>
        <plugin>
          <artifactId>maven-deploy-plugin</artifactId>
          <version>2.8.2</version>
        </plugin>
      </plugins>
    </pluginManagement>
    <resources>
        <!--指定资源目录，编译xml与propertis文件-->
      <resource>
        <directory>src/main/java</directory>
        <includes>
          <include>**/*.xml</include>
          <include>**/*.properties</include>
        </includes>
        <filtering>false</filtering>
      </resource>
    </resources>
  </build>
</project>

```
