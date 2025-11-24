---
title: "javaEE"
date: 2020-12-12
lastmod: 2020-12-12
draft: false
tags: ['JavaEE']
categories: ["☕️Java编程"]
author: "lei"
---

# JavaEE

## 简介

### 互联网通信流程

1. 设计技术：

   1. 控制浏览器行为技术：HTML,CSS,JavaScript
   2. 控制硬盘上数据库行为技术：Mysql，JDBC规范
   3. 控制服务端java行为技术：http服务器，servlet，JSP
   4. 互联网通信流程开发规则：MVC

2. 什么是互联网通信：两台计算机通过网络实现文件共享的行为

3. 互联网通信过程中涉及角色：

   1. 客户端计算机：用于发送请求，来索要资源文件
   2. 服务端计算机：用于接收请求，并提供对应的资源响应

4. 互联网通信模型

   1. c/s通信模型
      客户端软件安装在客户端计算机上；可以解析服务端返回的二进制信息
      服务器软件安装在服务端计算机上；服务器用于接收特定的客户端软件发送的请求；收到请求会自动定位请求所要访问的资源文件；将定位的资源文件解析为二进制发送到客户端
      适用场景：c/s通信模型普遍的用于个人娱乐市场（qq,视频,频，大型网络游戏...）
      优缺点：安全性高、有效降低服务端计算机工作压力；增加客户获得服务的成本、更新较为繁琐

   2. b/s通信模型
      浏览器安装在客户端计算机软件；可以向任意服务器发送请求，索要资源文件；可以将服务器返回的二进制数据解析出来
      服务器软件安装在服务端计算机上；服务器用于接收浏览器发送的请求；并定位资源文件，解析为二进制返回浏览器

      适用场景：个人娱乐场所、企业日常活动

      优缺点：不会增加用户获得服务成本、几乎不需要更新浏览器；几乎无法有效的对服务端计算机资源文件进行保护、服务端计算机工作压力极大【b/s高并发解决方案】

5. 共享资源文件

   1. 可以通过网络进行传输的文件，都叫做共享资源文件（所有文件）

   2. http服务器对共享资源文件分类

      1. 静态资源文件
      2. 动态资源文件

   3. 静态资源文件
      文件内容固定（文档、图片、视频）

      文件存放的是命令，只能在浏览器编译运行（html、js、css）

   4. 动态资源文件
      文件存放是命令。并且命令只能在服务端计算机编译执行（.class）

   5. 静态资源文件与动态资源文件调用区别
      静态资源文件：http服务器直接通过**输出流**将文件内容以*二进制* 形式推送给浏览器
      动态资源文件：http服务器需要创建当前class文件的实例对象，通过实例对象调用对应的方法处理用户请求，通过**输出流**将运行结果以*二进制* 形式推送到发起请求的浏览器

### http网络协议包

1. 网络协议包
   1. 在网络中所传递信息都是以二进制数据方式传送
   2. 接收方接收到数据第一件事就是解析二进制数据为文字图片等
   3. 传递信息往往巨大，导致接收方很难在一组二进制得到对应的数据
   4. 网络协议包是一组有规律的二进制数据，在这组数据中有固定空间，每个空间存放特定信息；接收方在接收到网络协议包时可以到固定空间得到对应的数据，极大降低了接收方接受二进制编译难度
2. 常见网络协议
   1. FTP网络协议包
   2. Http网络协议包
3. Http网络协议包
   1. 基于b/s通信模型，传递的数据都是保存在网络协议包中
   2. 分类
      1. Http请求协议包
      2. Http响应协议包
4. http请求协议包与响应协议包介绍
   1. http请求协议包：浏览器发送请求时，先创建http请求协议包，浏览器将请求信息以二进制形式保存在http协议包的各个空间，然后由浏览器发送
   2. http响应协议包：http服务器定位到被访问的资源时，会创建一个http响应协议包，将资源以二进制方式写入http协议包的各个空间，然后http服务器推送到浏览器
5. http请求协议包内部空间（从上往下划分）
   1. 请求行：[url:请求地址  method：请求方法]
   2. 请求头：[请求参数信息(get)]
   3. 空白行：[没有任何内容，隔离作用]
   4. 请求体：[请求参数信息(post)]
6. http响应协议包内部结构
   1. 状态行：[http状态码]
   2. 响应头：[content-type:指定浏览器以对应的编译器去编译的响应二进制数据]
   3. 空白行：[没有任何内容，隔离作用]
   4. 响应体：[可能被访问静态资源文件内容  可能被访问的静态资源文件命令  可能被访问的动态资源文件运行结果]

### javaee

1. 是一种企业级java规范

2. 规范了web项目必须有以下目录结构

   src:存放动态资源java文件
   web：存放静态资源文件
   		WEB-INF：依赖的jar[mysql驱动]/核心配置文件
   				classes:存放字节码文件
   				lib:存放开发过程需要使用的jar包
   				web.xml:存放网页的配置文件(可配置默认文档)

3. 浏览器-->http<--服务器-->servlet<--服务端程序-->JDBC<--数据库

### tomcat服务器

1. 必须配置JAVA_HOME环境变量

2. 目录结构

   1. bin：启动脚本等
   2. conf：配置文件，主要看server.xml文件
   3. lib：tomcat开发使用的包
   4. webapps：网站app目录，可以在server.xml配置文件中修改
   5. work：jsp转换为class文件的工作目录

3. web项目打包war

   1. jar -cvf nameweb.war . ：打包到什么位置，打包哪儿
   2. war包放在webapps目录下，tomcat会自动解压部署

4. web所有项目管理
   1.进入Tomcat首页，点击manager，配置用户名密码后登录

5. 虚拟目录配置

   1. 在server.xml里面的<host ...> 标签下配置，需要重启
      \<Context path="/test" docBase="F:\virtualDIR" debug="0" reloadble="true"/\>
   2. 在引擎目录下的虚拟主机目录下新建xml文件配置内容如下，不需要重启
      \<Context path="/test" docBase="F:\virtualDIR" debug="0" reloadble="true"/\>

6. 虚拟主机配置
   在server.xml目录下配置

   ```xml
     <Host name="localhost"  appBase="webapps"
           unpackWARs="true" autoDeploy="true">
   		<!--自动解包war      自动发布-->
     </Host>
   ```

### idea配置tomcat

1. 找到：file->setting->Build,Execution,Deployment->Application Servers
   1. 右侧窗口点击 + 号，添加tomcat服务器，找到tomcat安装地址，点击确定
2. 找到：run->run/debug configurations（启动tomcat开关）
   1. 找到 + 号，添加tomcat启动开关
      1. Deployment：将网站交给tomcat发布，配置网站以及应用名

## servlet规范

### 简介

1. servlet规范来自于javaee规范中的一种
2. 作用：
   1. 在servlet规范中，指定了动态资源文件开发步骤
   2. 在servlet规范中，指定了http服务器调用动态资源规则
   3. 在servlet规范中，指定了http服务器管理动态资源文件实例对象的规则
3. servlet接口实现类
   1. servlet接口来自于servlet规范下的一个接口，这个接口存在于http服务器
   2. tomcat下lib文件夹有一个servlet-api.jar存放servlet接口(javax.servlet.Servlet接口)
   3. servlet规范中，http服务器能够调用的动态资源文件**必须是Servlet接口**的实现类

### Servlet接口实现类开发步骤

1. 创建一个java类，继承HttpServlet这个父类，使之实现Servlet接口
   OneServlet--->(abstract)HttpServlet--->(abstract)GenericServlet--->Servlet(接口)
   GenericServlet抽象类实现了:init() destory()  getServletInfo()  getServletConfig()；后面继承它的类，不需要实现这些；HttpServlet抽象类实现了service方法，所以其子类只需要重写doGet与doPost方法
2. 重写HttpServlet父类的两个方法：**doGet**或者**doPost**；通过父类调用子类中的方法，被称为模板设计模式
   tomcat实例化：Servlet a=new OneServlet()
   tomcat调用service方法：a.service()
   父类service方法中调用：doGet或者doPost
3. 将Servlet接口实现类信息**注册**到tomcat服务器
   在web.xml中写入当前servlet信息

```xml
<!--将Servlet实现类的路径地址交给tomcat-->
<Servlet>
    <!--声明一个变量存储servlet接口实现类类路径-->
	<servlet-name>mm</servlet-name>
    <!--sservlet接口实现类类路径-->
    <servlet-class>com.lei.con.Test1</servlet-class>
    <!--此时tomcat：String 变量="servlet接口实现类类路径"-->
</Servlet>
<!--简化用户访问servlet接口实现类难度，设置请求别名-->
<servlet-mapping>
    <!--上面设置的变量名-->
    <servlet-name>mm</servlet-name>
    <!--设置简短别名，'/开头'-->
    <url-pattern>/test01</url-pattern>
</servlet-mapping>
<!--http://localhost:8080/test01-->
```



### Servlet对象生命周期

1. 网站中所有Servlet实现类，只能由http服务器负责创建
2. 默认情况下，http服务器收到当前Servlet接口实现类第一次请求时自动创建该Servlet接口实现类的实例对象
   可以手动指定http启动时创建，在web.xml的servlet下配置
   \<load-on-startup\>30\<load-on-startup\>
3. http服务器运行期间，一个Servlet接口实现类只能被创建出一个实例对象
4. http服务器关闭时，会自动销毁实例对象

### HttpServletResponse接口

1. HttpServletResponse接口来自于Servlet规范中，在tomcat中存放在servlet.jar

2. HttpServletResponse接口实现类由http服务器负责提供

3. HttpServletResponse接口负责将doGet/doPost方法执行结果写入**响应体**交给浏览器

4. 开发人员称HttpServletResponse修饰的对象称为响应对象

5. 主要功能

   1. 将执行结果以二进制通过输出流写入**响应体**
   2. 设置响应头中[content-type]属性值，从而控制浏览器以对应的编译器将响应体中的二进制编译出来,以及使用指定编码
   3. 设置响应头中的[location]属性，将一个请求地址赋给location，从而控制浏览器向指定服务器发送请求(浏览器发现location属性时自动发送请求)

   ```java
   protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
   		String str1="black<br/>yellow<br/>white<br/>";
   		String str2="唐磊<br/>你好世界<br/>";
   		//设置响应头localtion属性，浏览器检测到这个属性会自动请求该地址
   		//response.sendRedirect("http://baidu.com");
   		//在拿到输出流之前设置响应头中content-type属性，规定使用什么编码器以及字符集
   		response.setContentType("text/html;charset=utf-8");
   		//通过响应对象向tomcat拿到输出流
   		PrintWriter out=response.getWriter();
   		out.write(50); //浏览器输出2，write可以写入[字符、字符串、ASCLL码]，所以输出为2
   		out.print(50); //浏览器输出50
   		out.print(str1);
   		out.print(str2);
   	}
   ```

### HttpServletRequest接口

1. HttpServletRequest接口来自于Servlet规范中，在tomcat中存放在servlet.jar
2. HttpServletRequest接口实现类由http服务器负责提供
3. HttpServletRequest接口负责在doGet/doPost方法运行时读取http协议包中信息
4. 开发人员称之为请求对象
5. 作用
   1. 可以读取http请求**协议包**中请求行信息
   2. 可以读取保存在http请求协议包中**请求头**或者**请求体**中请求参数信息
   3. 可以代替浏览器向http服务器申请资源文件调用
6. uri：资源文件精准定位地址，实际上是一个截取字符串“/网站名/资源文件名”
7. 浏览器发送请求
   1. 浏览器以get方式发送请求，请求参数保存在**请求头**中；http协议包到达服务器时，**请求头**中内容由tomcat负责解码，tomcat默认采用utf-8进行解码
   2. 浏览器以post方式发送请求，请求参数保存在**请求体**中；http协议包到达服务器时，**请求体**中内容由当前请求对象(request)负责解码，request默认使用[ISO-8859-1]字符集，此时中文会乱码

```java
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		//获取请求行请求地址
		StringBuffer url=request.getRequestURL();
		//获取请求URI,资源文件精准定位
		String uri=request.getRequestURI();
		//获取请求行请求方法
		String method=request.getMethod();
		System.out.println(url+":"+uri+":"+method);
		//获取请求头请求参数名，返回枚举对象
		Enumeration<String> reqNs=request.getParameterNames();
		while (reqNs.hasMoreElements()) {
			String reqN=reqNs.nextElement();//获取请求参数名
			String reqV=request.getParameter(reqN); //根据参数名获取值
			System.out.println(reqN+":"+reqV);
		}
	}

	@Override
	protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
		//通知请求对象，采用解码方式，而get请求是由tomcat负责解码（默认uft-8）
		req.setCharacterEncoding("utf-8");
        //获取请求体请求参数名，返回枚举对象
		Enumeration<String> reqNs=req.getParameterNames();
		while (reqNs.hasMoreElements()) {
			String reqN=reqNs.nextElement();//获取请求参数名
			String reqV=req.getParameter(reqN); //根据参数名获取值
			System.out.println(reqN+":"+reqV);
		}
	}
```

### 请求对象与响应对象生命周期

1. 在http服务器**接收到**浏览器发送的http协议包，就会立即生成一个请求对象与一个响应对象
2. 在http服务器调用doGet/doPost方法时，负责将**请求对象**与**响应对象**作为实参传入
3. 在http服务器准备**推送http响应协议包**时，负责将本次请求关联的**请求对象**和**响应对象**负责**销毁**

### 欢迎资源文件

1. 网站默认首页

2. tomcat对于当前网站默认定位规则：/conf/web.xml文件里面配置

3. 命令规则

   ```xml
   <welcome-file-list>
      <welcome-file>index.html</welcome-file>
      <welcome-file>index.htm</welcome-file>
      <welcome-file>index.jsp</welcome-file>
   </welcome-file-list>
   ```

4. 设置当前网站的默认首页定位规则，直接在当前网站的/WEB-INF/web.xml配置文件中配置，设置了后，tomcat默认的首页定位规则设置就会失效

### http状态码

1. 介绍

   1. 由三位数字，组成的一个符号
   2. http服务器在推送响应包之前按，根据本次请求处理情况将http状态码写入到相应包中的状态行
   3. http针对本次请求，返回了对应的资源文件，通过http状态码通知浏览器应该如何处理这个结果
      http针对本次请求，不能返回对应的资源文件，通过http状态码告诉浏览器不能提供的原因

2. 分类

   1. 组成 100---599；分为5个大类

   2. 1xx：
      最具特征 100；通知浏览器本次返回的资源文件并不是一个完整资源文件，需要浏览器在接收响应包后，继续向http服务器索要依赖的其他资源文件

   3. 2xx：
      最有特征  200；通知浏览器本次返回的资源文件是一个独立完整的资源文件，浏览器接收到后**不需要**继续发送请求

   4. 3xx：
      最具特征  302，通知浏览器本次返回不是资源文件，而是某个资源文件的地址，浏览器接收到后应该立即根据资源文件地址再次发送请求

   5. 4xx：
      404：通知浏览器，由于服务端定位不到被访问的资源文件，因此无法提供服务

      405：通知浏览器，服务端定位到资源文件(Servlet)，但是方法不支持（访问方法不支持）

   6. 5xx：
      500：通知浏览器，服务端定位到资源文件(Servlet)，并且可以处理浏览器的请求方式，但是由于java异常导致处理失败

### 多个servlet调用规则

1. 前提条件：某些浏览器发送请求，往往需要服务端都奥格servlet协同处理，但是浏览器一次只能访问一个servlet，需要浏览器多次发送请求

2. 提高用户感受，浏览器只发送一个请求，servlet之间调用

3. 多个servlet之间调用规则

   1. 重定向解决方案
   2. 请求转发方案

4. 重定向解决方案

   1. 原理： 用户第一次请求时，OneServlet处理完成，将响应头localtion中写入TwoServlet请求地址，返回状态码302
      浏览器发现localtion属性后，自动发送第二次请求
   2. 命令：response.sendRedirect("/myweb/towservlet")
   3. 特征
      1. 请求地址：可以是当前网站内部资源文件地址，也可以是其他网站外部资源文件地址
      2. 请求次数：重定向解决方案中，浏览器至少发送两次请求，浏览器只手动放松一次请求
      3. 请求方式：get
   4. 缺点：重定向解决方案，需要浏览器与服务器之间多次往返，浪费时间

5. 请求转发方案

   1. 原理： 用户第一次请求时，OneServlet处理完成，通过当前请求对象代替浏览器向http服务器发送请求twoservlet，然后由twoservlet将执行结果返回给浏览器
   2. 命令：请求对象代替浏览器向http服务器发送请求
      1. 通过当前请求对象生成资源文件申请报告对象
         RequestDispatcher report=request.getRequestDispatcher("/资源文件名") 以/ 开头
      2. 将报告对象发送给tomcat
         report.forward(当前请求对象，当前响应对象)
   3. 优点
      1. 无论业务涉及多少servlet，浏览器只用发送一次请求
      2. servlet之间调用在服务器之间进行，节省了浏览器与服务器往返次数，节约了时间
   4. 特征
      1. 请求次数：浏览器只发送一次请求
      2. 请求地址：只能向tomcat服务器申请调用当前资源文件地址
      3. 请求方式：在请求转发过程中，浏览器只发送一个请 求协议包，参与本次请求的所有servlet共享一个请求协议包，因此这些servlet接收的请求方式与浏览器发送请求方式保持一致

### 多个servlet之间数据共享实现方案

1. 数据共享，一个servlet工作完后，将产生的数据交给另一个servlet来使用
2. servlet规范中提供了四种数据共享方案
   1. ServletContext接口
   2. Cookie类
   3. HttpSession接口
   4. HttpServletRequest接口

### ServletContext接口

1. 介绍

   1. 来自于Servlet规范中的一个接口，在tomcat存在servlet-api.jar；在tomcat中负责提供这个接口实现类
   2. 如果两个Serclet来自于同一个网站，彼此之间通过网站的ServletContext实例对象实现数据共享
   3. 开发人员称ServletContext对象为**全局作用域对象**

2. 工作原理
   每一个网站都存在一个全局作用于对象，这个全局作用域对象**相当于**一个map，在这个网站中，一个servlet可以将数据以键值对方式放入这个全局作用域对象，此时其他servlet都可以从这个全局作用域对象得到这个数据进行使用

3. 全局作用域对象生命周期

   1. 在http服务器启动过程中，会自动被当前网站在内存中创建这个全局作用域对象
   2. 在http服务器运行期间，一个网站只有一个全局作用域对象
   3. 在http服务器运行期间，全局作用域对象一直处于存活状态
   4. 在http服务器关闭时，负责将当前网站中全局作用域对象进行销毁
   5. 全局作用域对象生命周期贯穿于整个网站运行期间

4. 命令实现：**同一个网站**OneServlet将数据共享给TwoServletlet

   ```java
   OneServlet{
       public void doGet(HttpServletRequest req,HttpServletResponse res){
       //通过请求对象向tomcat索要全局作用于对象
       ServletContext application=request.getServletContext()
       //将数据添加到全局作用域对象
       application.setAttribute("key1",数据)
       }
   }
   TwoServlet{
       public void doGet(HttpServletRequest req,HttpServletResponse res){
         //TwoServlet读取数据，同样先通过请求对象索要全局作用域对象
        ServletContext application=request.getServletContext()
        //TwoServlet读取数据
        Object data=application.getAttribute("key1")
       }
   }
   ```

### Cookie类

1. 介绍

   1. Cookie来自于Servlet规范中的一个工具类，存在于tomcat提供的servlet-api.jar中
   2. 如果两个Servlet来自于同一个网站，并且为同一个浏览器/用户提供服务，借助Cookie对象进行数据共享
   3. Cookie存放当前用户的私人数据，在共享工程中提高服务质量

2. 原理
   用户第一个向网站发送请求申请OneServlet，OneServlet运行时创建一个Cookie存储用户相关信息，在运行结束时**将cookie写入到响应头中**推送给浏览器
   浏览器收到Cookie时，存储到浏览器缓存，用户第二次发送请求TwoServlet时，必须将上次获得Cookie信息写入请求头中发送请求
   TwoServlet可以从请求头中得到浏览器推送过来的Cookie信息，实现了数据共享

3. 实现命令：**同一个网站**OneServlet将数据共享给TwoServletlet

   ```java
   OneServlet{
       public void doGet(HttpServletRequest req,HttpServletResponse res){
           //创建cookie对象
           Cookie card=new Cookie("key1","abc");
           //一个cookie相当于一个map，只能存放键值对，且key与value只能时String类型，key不能为中文
           //将cookie写入响应头
           res.addCookie(card)
       }
   }
   TwoServlet{
       public void doGet(HttpServletRequest req,HttpServletResponse res){
           //调用请求对象，从请求头中得到浏览器发送过来的Cookie
           Cookie cards[]=req.getCookies();
           //循环遍历数据的到每一个key与value
           for(Cookie card:cards){
               String key=card.getName();
               String value=card.getValue();
           }
       }
   }
   ```

4. Cookie生命周期

   1. 默认情况下，cookie存放浏览器缓存中，当浏览器关闭时，cookie销毁
   2. 手动设置情况下，可以要求浏览器将收到的cookie存放在客户机硬盘上，同时要求cookie在硬盘上存活时间，此时cookie不会消失，直到存活时间到达才会被销魂
      cookie.setMaxAge(60);//cookie在硬盘上存活60秒

### HttpSession接口

1. 介绍

   1. HttpSession接口来自一servlet规范下一个接口，存在于tomcat中servlet-api.jar；其实现类由http服务器提供，tomcat提供的实现类存在于servlet-api.jar下
   2. 如果两个Servlet来自于同一个网站，并且为同一个浏览器/用户提供服务，借助HttpSession对象进行数据共享
   3. 开发人员称HttpSession修饰对象为会话作用域对象

2. HttpSession与cookie区别

   1. 存储位置
      Cookie对象存储在客户端浏览器上；HttpSession对象存储在服务器计算机内存

   2. 数据类型
      Cookie对象存储共享数据只能时String；HttpSession对象可以存储任意类型共享数据

   3. 数据数量
      一个Cookie对象只能存储一个共享数据；HttpSession使用map集合存储共享数据，所以可以存储任意数量的共享数据

   4. 参照物
      Cookie相当于客户端在服务端的【会员卡】

      HttpSession相当于客户端在服务端的【私人保险柜】

3. 命令实现：**同一个网站**OneServlet将数据共享给TwoServletlet

   ```java
   OneServlet{
       public void doGet(HttpServletRequest req,HttpServletResponse res){
       //调用请求对象，向tomcat索要当前用户的私人储物柜
       HttpSession session=request.getSession();
       //将数据添加到用户私人储物柜
       session.setAttrbute("key1",共享数据)
       }
   }
   //浏览器访问TwoServlet
   TwoServlet{
       public void doGet(HttpServletRequest req,HttpServletResponse res){
      //通过请求对象，获取当前用户的私人储物柜
      HttpSession session=request.getSession();
      //从会话作用域中得到OneServlet提供的共享数据
      Object data=session.getAttribute("key1");
       }
   }
   ```

4. Http服务器通过cookie将用户与HttpSession关联起来

5. getSession()与getSession(false)

   1. getSession()：如果当前用户已经拥有自己的私人储物柜，要求tomcat返回这个私人储物柜；如果当前用户没有自己的私人储物柜，则新建一个私人储物柜，然后返回
   2. getSession(false)：如果当前用户已经拥有自己的私人储物柜，要求tomcat返回这个私人储物柜；如果当前用户没有自己的私人储物柜，则tomcat返回null

6. HttpSession销毁时机

   1. 用户与HttpSession关联时使用的Cookie只能存放在浏览器缓存
   2. 在浏览器关闭时，意味着用户与它的HttpSession关系被切断
   3. 由于tomcat无法检测浏览器是否关闭，导致浏览器关闭而HttpSession对象没有被销毁
   4. 为了解决，为每个HttpSession对象，设置空闲时间，默认30分钟；如果当前HttpSession对象空闲超过三十分钟，则销毁HttpSession对象

7. HttpSession空闲时间手动设置，在/WEB-INF/web.xml下

   ```xml
   <session-config>
       <!--设置当前网站每一个HttpSession对象过期时间为5分钟-->
   	<session-timeout>5</session-timeout>
   </session-config>
   ```

### HttpServletRequest接口实现数据共享

1. 介绍

   1. 在同一个网站中，两个Servlet之间通过**请求转发**方式进行调用，彼此共享同一个请求协议包；而一个请求协议包只有一个请求对象，因此Servlet之间共享一个请求对象；此时可以利用这个请求对象在两个Servlet之间实现数据共享
   2. 通过请求对象实现两个Servlet之间数据共享时，开发人员称为**请求作用域对象**

2. 命令实现：OneServlet通过请求转发申请调用TwoServlet时，需要给TwoServlet提供数据共享时

   ```java
   OneServlet{
       public void doGet(HttpServletRequest req,HttpServletResponse res){
       //将数据添加到请求作用域对象，attribute属性
       //数据类型可以是任意类型Object
       req.setAttribute("key1",数据);
       //向tomcat申请调用TwoServlet
       req.getRequestDispatcher("/two").forward(req,res);
       }
   }
   TwoServlet{
       public void doGet(HttpServletRequest req,HttpServletResponse res){
      //从当前请求对象得到OneServlet写入的共享数据
      Object 数据=req.getAttribute("key1");
       }
   }
   ```

### servlet规范扩展监听器接口

1. 介绍：

   1. 一组来自于Servlet规范下的接口，共8个，存在于tomcat中servlet-api.jar
   2. 监听器接口需要有开发人员亲自实现，http服务器提供的jar包并没有具体实现类
   3. 监听器接口用于监控**作用域对象生命周期变化时刻**可以及**作用域共享数据变化时刻**

2. 作用域对象

   1. 在Servlet规范中，认为在服务端内存中，可以在某些条件下为两个Servlet数据共享方案的对象，被称为**作用域对象**

   2. Servlet规范下的作用域对象

      1. ServletContext：全局作用域对象
      2. HttpSession：会话作用域对象
      3. HttpServletRequest：请求作用域对象

   3. 监听器接口实现类开发规范：三步

      1. 根据要监听的实际情况，选择对应监听器接口进行实现
      2. 重写监听器接口声明的**监听时间处理方法**
      3. 在web.xml文件将监听器接口实现类注册到http服务器

   4. ServletContextListener接口

      1. 作用：通过这个接口合法的检测全局作用域对象被初始化时刻以及被销毁时刻
      2. 监听事件处理方法

      ```java
      public void contextInitlized();//全局作用域对象被创建时，自动执行
      public void contextDestory();//全局作用域对象被销毁时，自动执行
      ```

   5. ServletContextAttributeListener接口

      1. 作用：通过这个接口合法的检测全局作用域对象共享数据变化时刻
      2. 监听事件处理方法

      ```java
      public void contextAdd();//全局作用域添加共享数据时触发
      public void contextReplaced();//全局作用域更新共享数据时触发
      public void contextRemove();//全局作用域删除共享数据时触发
      
      //获取全局作用域对象
      ServletContext app=res.getServletContext();
      //新增共享数据
      app.setAttribute("key1","data1");
      //更新共享数据
      app.setAttribute("key1","data2");
      //删除共享数据
      app.removeAttribute("key1");
      ```

### 通过监听接口提高程序运行

程序运行期间，耗时主要是获取数据库连接对象与关闭数据库连接对象；可以在全局作用域对象创建时，也就是tomcat启动时，直接创建20个连接对象；在需要数据库连接对象时，可以直接从全局作用域对象中获取；在全局作用域对象销毁时，也就是tomcat关闭时，进行数据库链接对象的销毁

部分代码如下

```java
//OneListenner类
    @Override
    public void contextInitialized(ServletContextEvent sce) {
        //全局对象创建时机,创建20个数据库连接对象
        Map<Connection,Boolean> conns=new HashMap();
        for (int i=0;i<10;i++){
            try {
                Connection con= JdbcUtil.getConnection();
                System.out.println(con+"我诞生了");
                conns.put(con,true);
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
        //获取全局作用域对象
        ServletContext app=sce.getServletContext();
        app.setAttribute("conns",conns);
    }

    @Override
    public void contextDestroyed(ServletContextEvent sce) {
        //全局对象销毁时机，将20个数据库连接对象销毁
        //获取全局作用域对象
        ServletContext app=sce.getServletContext();
        //从全局变量获取所有连接对象的一个Map
        Map<Connection,Boolean> conns= (Map<Connection, Boolean>) app.getAttribute("conns");
        //获得迭代器
        Iterator<Connection> iterator=conns.keySet().iterator();
        while (iterator.hasNext()){
            Connection con=iterator.next();
            JdbcUtil.close(con);
            System.out.println("再见了，兄弟们，我"+con+"先走一步，你们跟上");
        }
    }

//JdbcUtil类
	public static void close(Connection conn,HttpServletRequest req){
        ServletContext app=req.getServletContext();
        Map<Connection,Boolean> connChi=(Map<Connection, Boolean>) app.getAttribute("conns");
        connChi.replace(conn,true);
    }
    public static void close(Connection conn){
        if (conn!=null){
            try {
                conn.close();
            } catch (SQLException throwables) {
                throwables.printStackTrace();
            }
        }
    }

//UserDao类
	public int add(Users userInfo,HttpServletRequest req){
        int res=0; //返回值
        String sql="insert into users (userName,password,sex,email) values (?,?,?,?)";
        Connection conn=null;
        PreparedStatement statement=null;
        try {
            //获取数据库连接对象
            conn= JdbcUtil.getConnection(req);
            //获取数据库操作对象
            statement=conn.prepareStatement(sql);
            statement.setString(1,userInfo.getUserName());
            statement.setString(2,userInfo.getPassword());
            statement.setString(3,userInfo.getSex());
            statement.setString(4,userInfo.getEmail());
            res=statement.executeUpdate();
        } catch (Exception e) {
            e.printStackTrace();
        }finally {
            JdbcUtil.close(conn,req);
        }
        return res;
    }

//Servlet调用时
	UserDao userDao=new UserDao();
    int res=userDao.add(userInfo,request);
```

### servlet规范扩展Filter(过滤接口)

1. 介绍

   1. 来自于Servlet规范下的接口，存在于tomcat中servlet-api.jar
   2. Filter接口需要有开发人员亲自实现，http服务器提供的jar包并没有具体实现类
   3. Filter接口会在http服务器调用资源文件之间，对http服务器进行拦截

2. 作用

   1. 拦截http服务器，帮助http服务器检测当前请求合法性
   2. 拦截http服务器，对当前请求进行增强操作

3. Filter接口实现类开发步骤：三步

   1. 创建一个Java类实现Filter接口
   2. 重写Filter接口中的doFilter方法
   3. 将Filter实现类通过web.xml注册到tomcat服务器

4. Filter拦截地址格式

   ```xml
   <filter-mapping>
   	<filter-name>OneFilter</filter-name>
       <url-pattern>拦截地址</url-pattern>
   </filter-mapping>
   
   <!--1.要求tomcat在调用具体文件时，进行过滤器拦截时-->
   <url-pattern\>/img/mm.jpg</url-pattern>
   <!--2.要求tomcat在调用某一文件夹下所有文件时，进行过滤器拦截时-->
   <url-pattern\>/img/*</url-pattern>
   <!--3. 要求tomcat在调用任意文件夹下某种类型文件时，进行过滤器拦截时-->
   <url-pattern\>*.jpg</url-pattern>
   <!--4. 要求tomcat在调用任意文件时，进行过滤器拦截时-->
   <url-pattern\>/*</url-pattern>
   ```

   命令作用：通知tomcat在调用何种资源文件之前需要调用OneFilter过滤器进行过滤

5. 代码示例

   ```java
       @Override
       public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse, FilterChain filterChain) throws IOException, ServletException {
           //参数列表分别是：请求对象，响应对象，后续操作对象
           servletRequest.setCharacterEncoding("utf-8");//增强操作，注册时所有Servlet文件访问都先进行处理
           filterChain.doFilter(servletRequest,servletResponse);//放行操作
       }
   ```


## jsp规范

### 简介

1. jsp可以方便将响应内容写入响应体，而不需要使用大量的out.print()语句
2. jsp命令书写规则

```jsp
<%
	int i=10;
	int j=20;
%>
<table>
<%
	for(i;i<j;i++){
%>
	<tr>
    	<td><%=i%></td>
    	<td><%=j%></td>
    </tr>	
<%
	}
%>
 </table>
//整个jsp网页，会将命令标识符中内容整合到一块，上面书写合法
```

### jsp内置对象

1. request：请求对象HttpServletRequest
2. session：会话作用域对象HttpSession
3. appliation：全局作用域对象ServletContext

### Servlet与jsp分工

1. 分工
   1. Servlet：处理业务得到处理结果
   2. jsp：不负责业务处理，主要将Servlet中处理结果写入响应体
2. Servlet与jsp调用关系，一般通过请求转发方式向tomcat申请调用jsp
3. Servlet与jsp数据共享
   1. Servlet将处理结果添加到请求作用域
   2. jsp通过请求对象，来调用共享数据

### jsp文件运行原理

#### http服务器调用jsp文件步骤

1. http服务器将jsp文件内容**编辑**为一个Servlet接口实现类(.java)
2. http服务器将Servlet接口实现类**编译**为class文件(.class)
3. http服务器负责创建这个class的实例对象，这个实例对象就是Servlet实例对象
4. http通过Servlet实例对象调用jsp_service方法，将jsp文件内容写入响应体中

#### http服务器编辑与编译jsp

http服务器编辑与编译jsp文件生成相关java与class文件地址
work文件下

### EL工具包

1. java开发的一个jar包，用于jsp文件，存放在tomcat下/lib/er-api.jar

#### jsp文件作用

代替响应对象，将servlet中doGet和doPost方法执行结果写入响应体

#### jsp文件中主要开发步骤

1. 将作用域对象中共享数据读取出来并写入响应体
2. 将数据进行类型强转
3. 将转换后数据写入到响应体

#### EL表达式

1. ${作用域对象别名.共享数据名}
2. 作用
   1. el表达式是EL工具包提供的一种特殊命令格式，称为**表达式命令格式**
   2. EL表达式在JSP文件上使用
   3. 负责将作用域对象共享数据读取出来并输出到响应体中

#### EL表达式-作用域对象别名

1. jsp文件中可以使用的作用域别名

   1. ServletContent  application：全局作用域对象
   2. HttpSession  session：会话作用域对象
   3. HttpServletRequest  request：请求作用域对象
   4. PageContext  pageContext：当前页作用域对象，jsp独有；在当前页作用域对象存放共享数据仅能在当前jsp文件中使用；主要用于JSTL标签与JSP文件之间数据共享
      JSTL--->PageContext---？JSP

2. EL表达式提供作用域对象别名

   |     JSP     |          EL表达式别名          |
   | :---------: | :----------------------------: |
   | application | ${applicationScope.共享数据名} |
   |   session   |   ${sessionScope.共享数据名}   |
   |   request   |   ${requestScope.共享数据名}   |
   | pageContext |    ${pageScope.共享数据名}     |

#### EL将引用对象属性写入响应体中

1. ${requestScope.引用类型共享数据名.属性名}；属性名必须和引用数据类中属性名一致

2. EL表达式没有提供遍历集合的方法，因此无法读取集合中数据

#### EL表达式简化版

1. 命令格式：${共享数据名}
2. 允许开发人员省略共享数据所在的作用域别名
3. 工作原理：
   由于没有作用域别名，所以在执行中，采用**猜**的算法
   首先到**pageContext**中定位共享数据，存在则读取输出并结束执行；然后顺序依次为：pageContext-->request--->session-->application
4. 存在隐患：容易降低程序执行速度；容易导致数据定位错误
5. 应用场景
   目的：简化从当前页pageContext读取共享数据并输出的难度
6. 虽然存在隐患，但实际开发中，一般使用简化版

#### EL表达式--支持运算表达式

1. 前提：jsp文件中，需要将读取到共享数据经过一番计算然后写入响应体中
2. 运算表达式：
   1. 数学运算
   2. 关系运算：>(gt)   >=(ge)   ==(eq)   <(lt)   <=(le)   !=
   3. 逻辑运算： &&    ||     !

#### EL表达式提供内置对象

1. 命令格式：${param.请求参数名}
2. 命令作用：通过请求对象读取当前请求包中请求参数内容
3. 代替：request.getParamter("参数名")



1. 命令格式：${paramValues.请求参数名[下标]}
2. 命令作用：如果浏览器的请求参数是**一个请求参数关联多个值**，可以通过以上命令取出指定下标值
3. 代替：request.getParrmenterValues("参数名")，返回一个数组

## Tomcat

### 内嵌tomcat

通过maven引入依赖

```xml
<properties>
    <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
    <maven.compiler.source>1.8</maven.compiler.sourc
    <maven.compiler.target>1.8</maven.compiler.target>
    <tomcat-version>9.0.26</tomcat-version>
  </properties>
<dependencies>
    <!-- tomcat核心文件 -->
	<dependency>
          <groupId>org.apache.tomcat</groupId>
          <artifactId>tomcat-catalina</artifactId>
          <version>${tomcat-version}</version>
      </dependency>
    <!-- jsp -->
      <dependency>
          <groupId>org.apache.tomcat.embed</groupId>
          <artifactId>tomcat-embed-jasper</artifactId>
          <version>${tomcat-version}</version>
	</dependency>
</dependencies>
```

创建启动方法

```java
public class Main {
    public static void main(String[] args) throws Exception {
        // 启动Tomcat:
        Tomcat tomcat = new Tomcat();
        tomcat.setPort(Integer.getInteger("port", 8080));
        tomcat.getConnector();
        // 创建webapp:
        Context ctx = tomcat.addWebapp("", new File("src/main/webapp").getAbsolutePath());
        WebResourceRoot resources = new StandardRoot(ctx);
        resources.addPreResources(
                new DirResourceSet(resources, "/WEB-INF/classes", new File("target/classes").getAbsolutePath(), "/"));
        ctx.setResources(resources);
        tomcat.start();
        tomcat.getServer().await();
    }
}
```

