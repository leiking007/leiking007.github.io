---
title: "Maven"
description: ""
date: 2020-11-07
lastmod: 2020-11-07
categories: ["其他"]
tags: ["项目管理"]
author: "lei"
draft: false
---

# Maven

## Maven基础

- Maven可以管理jar文件
- 自动下载jar和他的文档，源代码
- 管理jar的直接依赖
- 管理所需要的jar文件版本
- 测试代码是否正确
- 打包文件，形成jar文件，或war文件
- 部署项目

> 构建：项目的构建

1. 清理，把之前项目编译的东西删除掉
2. 编译，把程序源代码编译成可执行代码，批量的
3. 测试，Maven执行多个测试代码，验证程序是否正确，批量的
4. 报告，生成测试结果文件，测试是否通过
5. 打包，将项目所有文件资源打包到一个压缩文件中；对于通常的java程序，文件扩展名为jar；对于web应用，文件扩展名为war
6. 安装，把步骤五打包的文件jar或war安装到本地仓库
7. 部署

> Maven核心概念

1. POM：一个文件，名称是 pom.xml ，pom翻译过来就是项目对象模型；控制Maven构建项目过程，管理jar依赖
2. 约定目录结构：Maven项目目录结构是规定的
3. 坐标：唯一字符串，用于表示资源的
4. 依赖管理：管理项目 jar 文件
5. 仓库管理
6. 生命周期
7. 插件和目标
8. 继承
9. 聚合 

> Maven安装与配置

1. 从 apache 官网下载 Maven 安装包
2. 配置国内仓库，提升 Maven 速度
3. 环境变量配置
4. mvn -v 验证是否配置成功

## Maven 核心

> Maven 约定的目录结构

一个使用Maven管理的普通的Java项目，它的目录结构默认如下：

```ascii
a-Maven-project
├── pom.xml		#Maven的核心文件
├── src
│   ├── main	#主程序
│   │   ├── java
│   │   └── resources	#java中使用的配置文件
│   └── test	#测试代码
│       ├── java
│       └── resources
└── target		#编译生成的class
```

> 项目对象模型 POM

项目描述文件`pom.xml`是`Maven`的灵魂，它的内容长得像下面：

```xml
<project ...>
	<modelVersion>4.0.0</modelVersion>
	<groupId>com.itranswarp.learnjava</groupId>
	<artifactId>hello</artifactId>
	<version>1.0</version>
	<packaging>jar</packaging>	
	<properties>
        ...
	</properties>
	<dependencies>
        <dependency>
            <groupId>commons-logging</groupId>
            <artifactId>commons-logging</artifactId>
            <version>1.2</version>
        </dependency>
	</dependencies>
</project>
```

其中，`groupId`类似于Java的包名，通常是公司或组织名称，`artifactId`类似于Java的类名，通常是项目名称，再加上`version`，一个Maven工程就是由`groupId`，`artifactId`和`version`作为唯一标识。我们在引用其他第三方库的时候，也是通过这3个变量确定。例如，依赖`commons-logging`：

```xml
<dependency>
    <groupId>commons-logging</groupId>
    <artifactId>commons-logging</artifactId>
    <version>1.2</version>
</dependency>
```

使用`<dependency>`声明一个依赖后，Maven就会自动下载这个依赖包并把它放到classpath中。

**以下为 pom 文件中常用的标签：**

|             标签             |                      说明                       |
| :--------------------------: | :---------------------------------------------: |
| groupId、artifactId、version |                唯一标志一个jar包                |
|          packaging           |        打包压缩文件后的扩展名，默认为jar        |
|   dependencies、dependency   |          依赖，说明项目需要使用的 jar           |
|          properties          |           定义属性，例如定义编码方式            |
|            build             | 与构建相关的属性，如指定 Maven 编译时的 jdk版本 |



> 坐标

对于某个依赖，Maven只需要3个变量即可唯一确定某个jar包：

- groupId：属于组织的名称，类似Java的包名；
- artifactId：该jar包自身的名称，类似Java的类名；
- version：该jar包的版本，后面带`-SNAPSHOT`代表项目在开发阶段

> 仓库

- 仓库存放Maven使用的jar（也叫做插件）和我们项目使用的 jar
- 仓库分两种：本地仓库 和 远程仓库（中央仓库，中央仓库镜像，私服）
- 本地仓库---->私服---->镜像---->中央仓库

**小结**

- Maven使用 pom.xml 定义项目内容，并使用预定义目录结构
- 在 pom.xml 可以声明依赖，Maven会自动下载，并放入 classpath
- Maven使用 groupId，artifactId 和 version 唯一定位一个依赖

## 依赖管理

> 依赖关系

Maven定义了几种依赖关系，分别是`compile`、`test`、`runtime`和`provided`

| scope    | 说明                                          | 示例            |
| :------- | :-------------------------------------------- | :-------------- |
| compile  | 编译时需要用到该jar包（默认）                 | commons-logging |
| test     | 编译Test时需要用到该jar包                     | junit           |
| runtime  | 编译时不需要，但运行时需要用到                | mysql           |
| provided | 编译时需要用到，但运行时由JDK或某个服务器提供 | servlet-api     |

`test`依赖表示仅在测试时使用，正常运行时并不需要。最常用的`test`依赖就是JUnit：

```xml
<dependency>
    <groupId>org.junit.jupiter</groupId>
    <artifactId>junit-jupiter-api</artifactId>
    <version>5.3.2</version>
    <scope>test</scope>
</dependency>
```

> 搜索第三方组件

如果要引用一个第三方组件，比如`okhttp`，如何确切地获得它的`groupId`、`artifactId`和`version`？方法是通过[search.Maven.org](https://search.Maven.org/)搜索关键字，找到对应的组件后，直接复制

**小结**

- Maven通过解析依赖关系确定项目所需的jar包，常用的4种`scope`有：`compile`（默认），`test`，`runtime`和`provided`
- Maven从中央仓库下载所需的jar包并缓存在本地
- 可以通过镜像仓库加速下载

## 构建流程（生命周期）

> 构建流程

Maven 不但有标准化的项目结构，而且还有一套标准化的构建流程，可以自动化实现编译、打包、发布等等

> Lifecycle 和 Phase

Maven的生命周期由一系列阶段（phase）构成

使用`mvn`这个命令时，后面的参数是phase，Maven自动根据生命周期运行到指定的phase

实际开发过程中，经常使用的命令有：

- `mvn clean`：清理所有生成的class和jar
- `mvn clean compile`：先清理，再执行到`compile`
- `mvn clean test`：先清理，再执行到`test`，因为执行`test`前必须执行`compile`，所以这里不必指定`compile`
- `mvn clean package`：先清理，再执行到`package`

大多数phase在执行过程中，因为我们通常没有在`pom.xml`中配置相关的设置，所以这些phase什么事情都不做

经常用到的phase其实只有几个：

- clean：清理
- compile：编译
- test：运行测试
- package：打包

> Goal

执行一个phase又会触发一个或多个goal：

| 执行的Phase | 对应执行的Goal                     |
| :---------- | :--------------------------------- |
| compile     | compiler:compile                   |
| test        | compiler:testCompile surefire:test |

goal的命名总是`abc:xyz`这种形式

类比一下：

- lifecycle相当于Java的package，它包含一个或多个phase；
- phase相当于Java的class，它包含一个或多个goal；
- goal相当于class的method，它其实才是真正干活的

**小结**

Maven通过lifecycle、phase和goal来提供标准的构建流程。

最常用的构建命令是指定phase，然后让Maven执行到指定的phase：

- mvn clean
- mvn clean compile
- mvn clean test
- mvn clean package

通常情况，我们总是执行phase默认绑定的goal，因此不必指定goal。

## 插件使用

Maven的 lifecycle，phase和goal：使用 Maven构建项目就是执行 lifecycle，执行到指定的push为止，每个push会执行自己默认的一个或多个 goal。goal是最小任务单元。

> 例如执行以下命令

```shell
mvn compile
```

Maven 将执行 `compile` 这个 phase，这个 phase 会调用 `compiler` 插件执行关联的 `compiler:compile` 这个goal

实际上，执行每个phase，都是通过某个插件（plugin）来执行的，Maven本身其实并不知道如何执行`compile`，它只是负责找到对应的`compiler`插件，然后执行默认的`compiler:compile`这个goal来完成编译。

> 分析

所以，使用Maven，实际上就是配置好需要使用的插件，然后通过phase调用它们。

Maven已经内置了一些常用的标准插件：

| 插件名称 | 对应执行的phase |
| :------- | :-------------- |
| clean    | clean           |
| compiler | compile         |
| surefire | test            |
| jar      | package         |

如果标准插件无法满足需求，我们还可以使用自定义插件。使用自定义插件的时候，需要声明。例如，使用`Maven-shade-plugin`可以创建一个可执行的jar，要使用这个插件，需要在`pom.xml`中声明它：

```xml
<project>
    ...
	<build>
		<plugins>
			<plugin>
				<groupId>org.apache.Maven.plugins</groupId>
				<artifactId>Maven-shade-plugin</artifactId>
                <version>3.2.1</version>
				<executions>
					<execution>
						<phase>package</phase>
						<goals>
							<goal>shade</goal>
						</goals>
						<configuration>
                            ...
						</configuration>
					</execution>
				</executions>
			</plugin>
		</plugins>
	</build>
</project>
```

自定义插件往往需要一些配置，例如，`Maven-shade-plugin`需要指定Java程序的入口，它的配置是：

```xml
<configuration>
    <transformers>
        <transformer implementation="org.apache.Maven.plugins.shade.resource.ManifestResourceTransformer">
            <mainClass>com.itranswarp.learnjava.Main</mainClass>
        </transformer>
    </transformers>
</configuration>
```

注意，Maven自带的标准插件例如`compiler`是无需声明的，只有引入其它的插件才需要声明。

下面列举了一些常用的插件：

- Maven-shade-plugin：打包所有依赖包并生成可执行jar；
- cobertura-Maven-plugin：生成单元测试覆盖率报告；
- findbugs-Maven-plugin：对Java源码进行静态分析以找出潜在问题。

**小结**

Maven通过自定义插件可以执行项目构建时需要的额外功能，使用自定义插件必须在pom.xml中声明插件及配置；

插件会在某个phase被执行时执行；

插件的配置和用法需参考插件的官方文档。

## IDEA配置Maven

- 配置当前工程
- 配置新建工程

都需要配置 Maven、配置文件、仓库

注意在VM Options中配置： `-DarchetypeCatalog=internal`  可以提升创建Maven项目的速度

## 单元测试

用 `junit` ，一个专门测试的框架（工具）；测试的基本单元是方法

1. 在 pom.xml 中加入依赖项

   ```xml
           <dependency>
               <groupId>junit</groupId>
               <artifactId>junit</artifactId>
               <version>4.12</version>
               <scope>test</scope>
           </dependency>
   ```

2. 在 Maven 项目下的 src/test/java 目录下，创建测试程序

   - 测试类的名称 是 Test + 需要测试的类名
   - 测试方法的名称是 Test + 方法名

   ```java
   //例如测试 Hello 中 add方法
   /*
   * 方法必须是public的
   * 方法必须没有返回值
   * 方法名称可以自定义
   * 方法上面添加注解 @Test
   */
   class TestHello
       @Test
       public void testAdd(){
   		Hello hello=new Hello();
       	int res=hello.add(10,20);
       	//该方法是 junit 提供的
       	// asserEquals(期望值，实际值)，如果不等则抛出异常
       	Assert.assertEquals(30,res);
   	}
   }
   ```

## 多模块管理

**意义**

可以对子模块版本进行统一

> Maven多模块管理，其实就是让它的子模块的pom文件继承父工程的pom文件

Maven父工程遵循以下要求

- packaging标签的文本内容必须设置为pom
- 把src目录删除掉
- 只是简单额留下一个pom.xml文件

**父工程pom文件**

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://Maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://Maven.apache.org/POM/4.0.0 http://Maven.apache.org/xsd/Maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <groupId>org.lei</groupId>
    <artifactId>springboot</artifactId>
    <version>1.0-SNAPSHOT</version>
    <modules>
        <!-- 子模块 -->
    </modules>
    <!-- 声明为pom -->
    <packaging>pom</packaging>

    <properties>
        <!-- 定义变量 -->
        <Maven.compiler.source>11</Maven.compiler.source>
        <Maven.compiler.target>11</Maven.compiler.target>
        <spring-boot.version>2.7.5</spring-boot.version>
        <hutool.version>5.8.9</hutool.version>
    </properties>

    <!-- 子模块通用的的依赖，子模块无需单独导入，版本号在dependencyManagement中声明过 -->
    <dependencies>
        <dependency>
            <groupId>cn.hutool</groupId>
            <artifactId>hutool-all</artifactId>
        </dependency>
        <dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
        </dependency>
    </dependencies>

    <!-- 依赖管理，子模块需要某个依赖时直接声明坐标，无需版本号 -->
    <dependencyManagement>
        <dependencies>
            <!-- 导入springboot 依赖管理，其中定义了常用依赖版本 -->
            <dependency>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-dependencies</artifactId>
                <version>${spring-boot.version}</version>
                <type>pom</type>
                <scope>import</scope>
            </dependency>
            <dependency>
                <groupId>cn.hutool</groupId>
                <artifactId>hutool-all</artifactId>
                <version>${hutool.version}</version>
            </dependency>
        </dependencies>
    </dependencyManagement>

</project>
```

**子模块pom文件**

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://Maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://Maven.apache.org/POM/4.0.0 http://Maven.apache.org/xsd/Maven-4.0.0.xsd">
    
    <!-- 声明父工程 -->
    <parent>
        <artifactId>springboot</artifactId>
        <groupId>org.lei</groupId>
        <version>1.0-SNAPSHOT</version>
    </parent>
    
    <modelVersion>4.0.0</modelVersion>

    <!-- 模块名 -->
    <artifactId>springdemo</artifactId>

    <!-- 依赖，不需要声明版本，版本由父工程管理 -->
    <dependencies>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework</groupId>
            <artifactId>spring-aspects</artifactId>
        </dependency>
    </dependencies>

</project>
```



## pom 文件

```xml
<?xml version="1.0" encoding="UTF-8"?>

<project xmlns="http://Maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://Maven.apache.org/POM/4.0.0 http://Maven.apache.org/xsd/Maven-4.0.0.xsd">
  <modelVersion>4.0.0</modelVersion>

<!--  通过 groupId、artifactId、version 唯一确定该项目-->
  <groupId>org.lei</groupId>
  <artifactId>ch02-Maven-web</artifactId>
<!--  版本后面加 -SNAPSHOT代表还在开发阶段-->
  <version>1.0-SNAPSHOT</version>

<!--  打包成归档文件的类型 se项目jar、web项目war-->
  <packaging>war</packaging>

<!-- Maven属性配置-->
  <properties>
<!--    编码格式-->
    <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
<!--    编译使用 jdk 版本-->
    <Maven.compiler.source>1.8</Maven.compiler.source>
<!--    运行使用 jdk版本-->
    <Maven.compiler.target>1.8</Maven.compiler.target>
<!--    自定义属性变量，标签就是变量名，可以通过 ${变量名} 来使用-->
    <juint-version>4.11</juint-version>
  </properties>

<!--  依赖管理-->
  <dependencies>
<!--    通过 groupId、artifactId、version 唯一确定一个jar-->
    <dependency>
      <groupId>javax.servlet</groupId>
      <artifactId>javax.servlet-api</artifactId>
      <version>4.0.1</version>
    </dependency>
    <dependency>
      <groupId>junit</groupId>
      <artifactId>junit</artifactId>
<!--        通过 ${juint-version} 使用在属性配置中自定义的变量-->
      <version>${juint-version}</version>
<!--      依赖范围：compile、test、provided ，默认是compile-->
      <scope>test</scope>
    </dependency>
  </dependencies>

  <build>
<!--    指定资源文件，默认Maven 只会将资源目录下文件拷贝过去-->
    <resources>
      <resource>
        <directory>src/main/java</directory>
        <includes>
          <include>**/*.xml</include>
        </includes>
      </resource>
    </resources>
  </build>
</project>

```

## Maven settings.xml详解

```xml
<?xml version="1.0" encoding="UTF-8"?>

<settings xmlns="http://maven.apache.org/SETTINGS/1.2.0"
          xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
          xsi:schemaLocation="http://maven.apache.org/SETTINGS/1.2.0 https://maven.apache.org/xsd/settings-1.2.0.xsd">

    <!--  本地仓库地址  -->
    <localRepository>F:/study/soft/mavenRepository</localRepository>

    <!-- 是否提示输入,false时在需要输入时maven会自动
    | Default: true
    -->
    <interactiveMode>true</interactiveMode>

    <!-- maven在执行生成时是否应尝试连接到网络
     | Default: false
     -->
    <offline>false</offline>

    <!-- pluginGroups
     | This is a list of additional group identifiers that will be searched when resolving plugins by their prefix, i.e.
     | when invoking a command line like "mvn prefix:goal". Maven will automatically add the group identifiers
     | "org.apache.maven.plugins" and "org.codehaus.mojo" if these are not already contained in the list.
     |-->
    <pluginGroups>
        <!-- pluginGroup
         | Specifies a further group identifier to use for plugin lookup.
        <pluginGroup>com.your.plugins</pluginGroup>
        -->
    </pluginGroups>

    <!-- 代理配置 -->
    <proxies>
        <!-- proxy
         | Specification for one proxy, to be used in connecting to the network.
         |
        <proxy>
          <id>optional</id>
          <active>true</active>
          <protocol>http</protocol>
          <username>proxyuser</username>
          <password>proxypass</password>
          <host>proxy.host.net</host>
          <port>80</port>
          <nonProxyHosts>local.net|some.host.com</nonProxyHosts>
        </proxy>
        -->
    </proxies>

    <!-- 服务器认证配置 -->
    <servers>
        <!-- server
        <server>
          <id>deploymentRepo</id>
          <username>repouser</username>
          <password>repopwd</password>
        </server>
        -->

        <!-- Another sample, using keys to authenticate.
        <server>
          <id>siteServer</id>
          <privateKey>/path/to/private/key</privateKey>
          <passphrase>optional; leave empty if not used.</passphrase>
        </server>
        -->
    </servers>

    <!-- mirrors 镜像仓库,
    | mirrorOf 设置为 central 表示去中央仓库下载时通过下面这个地址
    | profile 默认包含了一个 central 配置
    | 仓库查找顺序 按照 profile 中配置仓库依次查找,如果都没有就走 central
    -->
    <mirrors>
        <mirror>
            <id>aliyunmaven</id>
            <mirrorOf>central</mirrorOf>
            <name>阿里云公共仓库</name>
            <url>https://maven.aliyun.com/repository/public</url>
        </mirror>
    </mirrors>

    <profiles>
        <!-- profile
         | Specifies a set of introductions to the build process, to be activated using one or more of the
         | mechanisms described above. For inheritance purposes, and to activate profiles via <activatedProfiles/>
         | or the command line, profiles have to have an ID that is unique.
         |
         | An encouraged best practice for profile identification is to use a consistent naming convention
         | for profiles, such as 'env-dev', 'env-test', 'env-production', 'user-jdcasey', 'user-brett', etc.
         | This will make it more intuitive to understand what the set of introduced profiles is attempting
         | to accomplish, particularly when you only have a list of profile id's for debug.
         |
         | This profile example uses the JDK version to trigger activation, and provides a JDK-specific repo.
        <profile>
          <id>jdk-1.4</id>

          <activation>
            <jdk>1.4</jdk>
          </activation>

          <repositories>
            <repository>
              <id>jdk14</id>
              <name>Repository for JDK 1.4 builds</name>
              <url>http://www.myhost.com/maven/jdk14</url>
              <layout>default</layout>
              <snapshotPolicy>always</snapshotPolicy>
            </repository>
          </repositories>
        </profile>
        -->

        <profile>
            <id>tencentyunmaven</id>
            <repositories>
                <repository>
                    <id>nexus-tencentyun</id>
                    <name>Nexus tencentyun</name>
                    <url>https://mirrors.cloud.tencent.com/nexus/repository/maven-public/</url>
                    <layout>default</layout>
                    <releases>
                        <enabled>true</enabled>
                    </releases>
                    <snapshots>
                        <enabled>true</enabled>
                    </snapshots>
                </repository>
            </repositories>
            <pluginRepositories>
                <pluginRepository>
                    <id>nexus-tencentyun</id>
                    <name>Nexus tencentyun</name>
                    <url>https://mirrors.cloud.tencent.com/nexus/repository/maven-public/</url>
                    <releases>
                        <enabled>true</enabled>
                    </releases>
                    <snapshots>
                        <enabled>true</enabled>
                    </snapshots>
                </pluginRepository>
            </pluginRepositories>
        </profile>
        <profile>
            <id>aliyunmaven</id>
            <!--     默认激活该配置,  如果存在其他任意激活配置, 该配置失效    -->
            <activation>
                <activeByDefault>true</activeByDefault>
            </activation>
            <repositories>
                <repository>
                    <id>aliyunmaven</id>
                    <name>阿里云公共仓库</name>
                    <url>https://maven.aliyun.com/repository/public/</url>
                    <releases>
                        <enabled>true</enabled>
                    </releases>
                    <snapshots>
                        <enabled>true</enabled>
                    </snapshots>
                </repository>
            </repositories>
            <pluginRepositories>
                <pluginRepository>
                    <id>aliyunmaven</id>
                    <name>阿里云公共仓库</name>
                    <url>https://maven.aliyun.com/repository/public/</url>
                    <releases>
                        <enabled>true</enabled>
                    </releases>
                    <snapshots>
                        <enabled>true</enabled>
                    </snapshots>
                </pluginRepository>
            </pluginRepositories>
        </profile>
    </profiles>

    <!-- 激活的 Profile -->
    <activeProfiles>
        <activeProfile>tencentyunmaven</activeProfile>
    </activeProfiles>

</settings>
```

## war 包名带时间戳

**方式一**

在 Maven 中，要让打包后的 WAR 文件名自动带上“日期”，可以通过配置 `maven-war-plugin` 的 `<finalName>` 来实现，结合 Maven 的 `maven.build.timestamp` 属性即可

在 `pom.xml` 中添加或修改如下配置

```xml
<properties>
    <!-- 定义时间格式 -->
    <maven.build.timestamp.format>yyyyMMdd</maven.build.timestamp.format>
    <!-- 如果你想带 时间戳（小时分钟），把时间格式改为 yyyyMMdd_HHmm -->
    <!-- 强制使用东八区，Maven 版本 ≥ 3.9 -->
    <maven.build.timestamp.timezone>Asia/Shanghai</maven.build.timestamp.timezone>
</properties>

<build>
    <finalName>${project.artifactId}-${project.version}-${maven.build.timestamp}</finalName>
    <plugins>
        <plugin>
            <groupId>org.apache.maven.plugins</groupId>
            <artifactId>maven-war-plugin</artifactId>
            <version>3.3.2</version> <!-- 用最新版 -->
            <configuration>
                <!-- 确保使用上面定义的 finalName -->
                <warName>${project.artifactId}-${project.version}-${maven.build.timestamp}</warName>
            </configuration>
        </plugin>
    </plugins>
</build>
```

> 注意事项：
>
> - `maven.build.timestamp` 是 Maven 内置变量，**只在构建时有效**，不会影响源码中任何地方
>
> - 生成的时间默认为UTC时区的，会相差8小时，maven3.9以上版本可以通过配置强制使用东八区
>
> - 如果你使用的是 Spring Boot 的 `spring-boot-maven-plugin`，它默认会忽略 `finalName`，需要额外配置
>
>   ```xml
>   <plugin>
>       <groupId>org.springframework.boot</groupId>
>       <artifactId>spring-boot-maven-plugin</artifactId>
>       <configuration>
>           <finalName>${project.artifactId}-${project.version}-${maven.build.timestamp}</finalName>
>       </configuration>
>   </plugin>
>   ```

**方式二**

用插件动态生成时间（兼容所有 Maven 版本），引入 `build-helper-maven-plugin`，在打包前把东八区时间写入属性，再供 `finalName` 使用。

| 配置项                               | 含义                                               |
| ------------------------------------ | -------------------------------------------------- |
| `groupId` / `artifactId` / `version` | 插件坐标，确保使用的是 `3.4.0` 版本                |
| `execution.id`                       | 命名为 `timestamp-property`，可自定义              |
| `phase`                              | 绑定到 `validate` 阶段，即构建一开始就会执行       |
| `goal`                               | 使用 `timestamp-property` 目标来生成时间戳属性     |
| `configuration.name`                 | 生成的 Maven 属性名，这里是 `build.time`           |
| `configuration.pattern`              | 时间格式，`yyyyMMdd_HHmm` 会生成如 `20250812_1432` |
| `configuration.timeZone`             | 指定时区为 `Asia/Shanghai`，即中国标准时间         |

```xml
<build>
    <finalName>${project.artifactId}-${project.version}-${build.time}</finalName>
    <plugins>
        <!-- 1. 生成东八区时间 -->
        <plugin>
            <groupId>org.codehaus.mojo</groupId>
            <artifactId>build-helper-maven-plugin</artifactId>
            <version>3.4.0</version>
            <executions>
                <execution>
                    <id>timestamp-property</id>
                    <phase>validate</phase>
                    <goals><goal>timestamp-property</goal></goals>
                    <configuration>
                        <name>build.time</name>
                        <pattern>yyyyMMdd_HHmm</pattern>
                        <timezone>Asia/Shanghai</timezone>
                    </configuration>
                </execution>
            </executions>
        </plugin>

        <!-- 2. 打 war 包时使用上面的时间 -->
        <plugin>
            <groupId>org.apache.maven.plugins</groupId>
            <artifactId>maven-war-plugin</artifactId>
            <version>3.3.2</version>
            <configuration>
                <warName>${project.artifactId}-${project.version}-${build.time}</warName>
            </configuration>
        </plugin>
    </plugins>
</build>
```

