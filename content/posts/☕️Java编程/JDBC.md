---
title: "JDBC"
date: 2020-06-09
lastmod: 2020-06-09
draft: false
tags: ['JavaEE','数据库']
categories: ["☕️Java编程"]
author: "lei"
---

# JDBC

## 简介

1. JDBC： Java Database Connectivity（Java语言连接数据库）
2. JDBC是sun公司定制的一套接口（Java.sql.*）
   接口都有调用者和实现者
   面向接口调用、面向接口写实现类都是面向接口编程
   面向接口：解耦合，降低偶尔度，提高程序扩展力；多态是典型的面向接口编程
3. 数据库厂家实现接口（驱动），Java程序员调用接口
4. 首先官网下载对应的Java驱动包，然后将其配置到环境变量classpath中，使用IDEA不需要配置以上环境变量
5. JDBC变成六步
   1. 注册驱动：告诉Java程序，即将链接哪个品牌数据库
   2. 获取链接：表示JVM进程与数据库进程之间的通道打开了，这属于进程间通信，重量级的，使用完后需要释放
   3. 获取数据库操作对象：专门执行sql语句的对象
   4. 执行sql语句：DQL,DML
   5. 执行查询结果集：只有当第四步执行的是select语句时，才有这一步
   6. 释放资源：释放资源，Java与mysql之间属于进程间通信

## 编程六步

2. 结果集有next()方法（有点像是迭代器），有数据返回true，没有数据返回false；
   getString()方法，不管数据库字段类型是什么，取出都是String类型；
   还可以使用int取出，getInt();
   可以使用下标取出，也可以使用字段名取出（查询的字段名）
   JDBC中下标从1开始

```java
import Java.sql.*;
import Java.util.*;
public class  JdbcTest01
{
	public static void main (String[] args) throws Exception
	{
		//使用资源绑定器
		ResourceBundle bundle=ResourceBundle.getBundle("jdbc");

		Connection conn=null;
		Statement stmt=null;
		ResultSet rs=null;
		try{
			//1.注册驱动
			//DriverManager.registerDriver(new com.mysql.jdbc.Driver());
			//注册驱动另一种方式,在静态代码块中，使用反射机制加载类，参数是字符串，
			//可以写到properties文件中
			Class.forName(bundle.getString("driver"));

			//2.获取连接
			/*
				url包括协议、IP、port、资源名
			*/
			String url=bundle.getString("url");
			String user=bundle.getString("user");
			String password=bundle.getString("password");
			conn=DriverManager.getConnection(url,user,password);
			System.out.println(conn);

			//3.获取数据库操作对象(专门执行sql语句的)
			stmt=conn.createStatement();

			//4.执行sql语句
			String sql="insert into t_user(name) values ('北京')";
			//专门执行DML语句(insert delete update)；返回值int为影响记录条数
			int count=stmt.executeUpdate(sql);	
			System.out.println(count==1?"插入成功":"插入失败");
			sql="select * from emp;";
			//专门执行DQL语句，ResultSet executeQuery(select)
			rs=stmt.executeQuery(sql);

			//5.查询结果集
			while(rs.next()){//看是否还有数据
				System.out.print(rs.getString("ename")+"."); //查询出结果的字段名
				System.out.print(rs.getString("sal")+".");
				System.out.print(rs.getString("deptno")+".");
				System.out.print(rs.getString("job")+".");
				System.out.println();
				
			}
		}catch(Exception e){
			e.printStackTrace();
		}finally{
			//6.释放资源,遵循从小到大依次关闭
			try{
				if(rs!=null){
					rs.close();
				}
			}catch(SQLException e){
				e.printStackTrace();
			}
			try{
				if(stmt!=null){
					stmt.close();
				}
			}catch(SQLException e){
				e.printStackTrace();
			}
			try{
				if(conn!=null){
					conn.close();
				}
			}catch(SQLException e){
				e.printStackTrace();
			}
		}
		
	}
}
```

## 资源绑定器

jdbc.properties

```properties
driver=com.mysql.jdbc.Driver
url=jdbc:mysql://localhost:3306/mydata?useSSL=false
user=root
password=123456
```

```java
//使用资源绑定器
ResourceBundle bundle=ResourceBundle.getBundle("jdbc");
String url=bundle.getString("url");
String user=bundle.getString("user");
String password=bundle.getString("password");
```

## sql注入

1. 原因：用户输入的信息中含有sql语句关键字，并且这些关键字参与sql语句的编译过程，导致sql语句的原意被扭曲

2. 解决

   1. 用户输入信息不参与sql语句编译过程，预编译，占位符?
   2. sql语句如果完全不变，那么第二次执行时不会重新编译；所以有PreparedStatement预编译，且它执行效率高于Statement；PreparedStatement会在编译阶段做类型的安全检查
   3. Statement（数据库操作接口）更换为PreparedStatement（预编译数据库操作接口，继承Statement）；PreparedStatement预先对sql语句进行编译
   4. ps=conn.prepareStatement(sql)；获取预编译操作对象；这里会发送sql语句框架发送到DBMS，然后DBMS进行预编译；？占位符
   5. 给？占位符传值，第一个是问号下标是1，第二个问号下标是2，JDBC中所有下标从1开始；ps.setString(1,username)；ps.setString(2,password)；这里会根据传值类型自动书写sql语句
   6. res=ps.executeQuery()；//执行sql

   ```java
   Connection conn=null;
   PreparedStatement ps=null;//预编译数据库操作对象
   ResultSet res=null;
   try {
        Class.forName("com.mysql.jdbc.Driver");
       	conn=DriverManager.getConnection("jdbc:mysql://localhost:3306/mydata?useSSL=false","root","123456");
   //获取预编译操作对象；此时会先编译；？占位符
   	String sql="select * from t_user where loginName=? and loginPwd=?;";
   	ps=conn.prepareStatement(sql);
   //给占位符传值
   	ps.setString(1,userInfo.get("username"));
   	ps.setString(2,userInfo.get("password"));
   //执行sql语句，因为语句不变，不会重新编译
   	res=ps.executeQuery();
   	if (res.next()){
   		loginSuccess=true;
   	}
   }catch(Exception e){}finally{}
   ```

3. 当业务方面要求必须使用sql注入时，必须使用Statement；比如升序降序，如果用PreparedStatement会将desc或esc加上引号，不符合逻辑

4. PreparedStatement增删改代码

   ```java
   
   ```

   

```sql
package com.leiking.userlogin;

import Javax.swing.plaf.nimbus.State;
import Java.sql.*;
import Java.util.HashMap;
import Java.util.Map;
import Java.util.Scanner;

public class LoginMain {
    public static void main(String[] args) {
        //初始化界面
        Map<String,String> userInfo=initUI();
        //验证用户名和密码
        boolean bol=login(userInfo);
        //输出结果
        System.out.println(bol==true?"登陆成功":"登陆失败");
    }

    private static boolean login(Map<String, String> userInfo) {
        boolean loginSuccess=false;
        Connection conn=null;
        Statement stat=null;
        ResultSet res=null;
        try {
            Class.forName("com.mysql.jdbc.Driver");
            conn= DriverManager.getConnection("jdbc:mysql://localhost:3306/mydata?useSSL=false");
            stat=conn.createStatement();
            String sql="select * from t_user where " +
                    "loginName='"+userInfo.get("username")+
                    "' and loginPwd='"+userInfo.get("password")+"';";
            res=stat.executeQuery(sql);
            if (res.next()){
                loginSuccess=true;
            }
            return loginSuccess;
        } catch (ClassNotFoundException e) {
            e.printStackTrace();
        } catch (SQLException throwables) {
            throwables.printStackTrace();
        }finally {
            if (res!=null){
                try {
                    res.close();
                } catch (SQLException throwables) {
                    throwables.printStackTrace();
                }
            }
            if (stat!=null){
                try {
                    stat.close();
                } catch (SQLException throwables) {
                    throwables.printStackTrace();
                }
            }
            if (conn!=null){
                try {
                    conn.close();
                } catch (SQLException throwables) {
                    throwables.printStackTrace();
                }
            }
        }
        return true;
    }

    /**
     * 初始化用户界面
     * @return 用户输入的用户名与信息
     */
    private static Map<String, String> initUI() {
        Scanner s=new Scanner(System.in);
        System.out.print("输入用户名:");
        String username=s.nextLine();
        System.out.println();
        System.out.print("输入密码:");
        String password=s.nextLine();
        System.out.println();
        Map<String,String> userInfo=new HashMap<>();
        userInfo.put("username",username);
        userInfo.put("password",password);
        return userInfo;
    }
}
//sql注入现象
//输入：用户名：fdss；密码：125' or '1'='1
select * from t_user where loginName='fdss' and loginPwd='125' or 1 = '1
```

## 单机事务

1. JDBC中事务是自动提交的，执行任意一条DML语句，则会提交依次，这是JDBC默认事务行为
2. conn.setAutoCommit(false)：关闭事务自动提交
3. conn.commit()：手动提交事务
4. conn.rollback()：手动回滚事务；当sql语句出错时执行回滚，保证数据安全

```java
Connection conn=null;
        PreparedStatement ps=null;
        try {
            //1.注册驱动
            Class.forName("com.mysql.jdbc.Driver");
            //2.连接数据库
            conn= DriverManager.getConnection("jdbc:mysql://localhost:3306/mydata","root","123456");
            //3.获取数据库预编译操作对象
            conn.setAutoCommit(false);//关闭事务自动提交
            String sql="update t_act set money=? where nameno=?";
            ps=conn.prepareStatement(sql);
            //2001账户减钱
            ps.setDouble(1,10000);
            ps.setInt(2,2001);
            ps.executeUpdate();
            //2002账户加钱
            ps.setDouble(1,10000);
            ps.setInt(2,2002);
            ps.executeUpdate();
            conn.commit();//提交事务
        } catch (Exception e) {
            if(conn!=null){
                try {
                    conn.rollback();//出错时回滚事务
                } catch (SQLException throwables) {
                    throwables.printStackTrace();
                }
            }
            e.printStackTrace();
        }finally {//关闭连接}
```

## JDBC工具类封装

1. 工具类构造方法一般为私有的，因为工具类一般调用都是静态方法

```java
public class JdbcUtil {
    //工具类构造方法一般都是私有的
    private JdbcUtil() {}
    static {
        try {
            //静态代码块中，只要调用该类，则执行注册驱动
            Class.forName("com.mysql.jdbc.Driver");
        } catch (ClassNotFoundException e) {
            e.printStackTrace();
        }
    }

    /**
     * 获取数据库连接对象
     * @return 连接对象
     */
    public static Connection getConnection() throws Exception{
        return DriverManager.getConnection("jdbc:mysql://localhost:3306/mydata?useSSL=false&characterEncoding=utf-8", "root", "123456");
    }

    /**
     * 关闭资源
     * @param conn 连接对象
     * @param stat 数据库操作对象
     * @param res 结果集
     */
    public static void close(Connection conn, Statement stat, ResultSet res){
        if (res!=null){
            try {
                res.close();
            } catch (SQLException throwables) {
                throwables.printStackTrace();
            }
        }
        if (stat!=null){
            try {
                stat.close();
            } catch (SQLException throwables) {
                throwables.printStackTrace();
            }
        }
        if (conn!=null){
            try {
                conn.close();
            } catch (SQLException throwables) {
                throwables.printStackTrace();
            }
        }
    }
    public static void close(Connection conn, Statement stat){
        if (stat!=null){
            try {
                stat.close();
            } catch (SQLException throwables) {
                throwables.printStackTrace();
            }
        }
        if (conn!=null){
            try {
                conn.close();
            } catch (SQLException throwables) {
                throwables.printStackTrace();
            }
        }
    }
}
```

