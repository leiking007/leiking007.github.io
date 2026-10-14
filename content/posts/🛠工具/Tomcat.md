---
title: "Tomcat"
date: 2026-06-30
lastmod: 2026-06-30
draft: false
tags: ['服务器']
categories: ["🛠工具"]
author: "lei"
---

# Tomcat

> 下面内容基于 Tomcat9

## 服务器配置

### conf/server.xml 文件

```xml
<?xml version="1.0" encoding="UTF-8"?>
<Server port="8095" shutdown="SHUTDOWN">
  <Listener className="org.apache.catalina.startup.VersionLoggerListener" />
  <!-- Security listener. Documentation at /docs/config/listeners.html
  <Listener className="org.apache.catalina.security.SecurityListener" />
  -->
  <!-- APR connector and OpenSSL support using Tomcat Native -->
  <Listener className="org.apache.catalina.core.AprLifecycleListener" />
  <!-- OpenSSL support using FFM API from Java 22 -->
  <!-- <Listener className="org.apache.catalina.core.OpenSSLLifecycleListener" /> -->
  <!-- Prevent memory leaks due to use of particular java/javax APIs-->
  <Listener className="org.apache.catalina.core.JreMemoryLeakPreventionListener" />
  <Listener className="org.apache.catalina.mbeans.GlobalResourcesLifecycleListener" />
  <Listener className="org.apache.catalina.core.ThreadLocalLeakPreventionListener" />

  <!-- Global JNDI resources
       Documentation at /docs/jndi-resources-howto.html
  -->
  <GlobalNamingResources>
    <!-- Editable user database that can also be used by
         UserDatabaseRealm to authenticate users
    -->
    <Resource name="UserDatabase" auth="Container"
              type="org.apache.catalina.UserDatabase"
              description="User database that can be updated and saved"
              factory="org.apache.catalina.users.MemoryUserDatabaseFactory"
              pathname="conf/tomcat-users.xml" />
  </GlobalNamingResources>

  <!-- A "Service" is a collection of one or more "Connectors" that share
       a single "Container" Note:  A "Service" is not itself a "Container",
       so you may not define subcomponents such as "Valves" at this level.
       Documentation at /docs/config/service.html
   -->
  <Service name="Catalina">

    <!--The connectors can use a shared executor, you can define one or more named thread pools-->
    <!--
    <Executor name="tomcatThreadPool" namePrefix="catalina-exec-"
        maxThreads="150" minSpareThreads="4"/>
    -->

    <!-- 启动端口 -->
    <Connector port="8094" protocol="HTTP/1.1"
               connectionTimeout="20000"
               redirectPort="8443"
               maxParameterCount="1000"
               />

    <Engine name="Catalina" defaultHost="localhost">

     
      <Realm className="org.apache.catalina.realm.LockOutRealm">
       
        <Realm className="org.apache.catalina.realm.UserDatabaseRealm"
               resourceName="UserDatabase"/>
      </Realm>
	<!-- autoDeploy="false" 关闭热部署 -->
      <Host name="localhost"  appBase="webapps"
            unpackWARs="true" autoDeploy="false">
          
        <Valve className="org.apache.catalina.valves.AccessLogValve" directory="logs"
               prefix="localhost_access_log" suffix=".txt"
               pattern="%h %l %u %t &quot;%r&quot; %s %b" />

      </Host>
    </Engine>
  </Service>
</Server>
```

## 服务器调优

### setenv.sh

`setenv.sh` 放在 **Tomcat/bin/** 目录下，启动 `catalina.sh` 会自动加载，用于配置 JVM 参数、环境变量、端口、编码等。

```shell
# 指定 PID 文件路径，确保 shutdown.sh 能够可靠地获取进程号并停止服务
CATALINA_PID="$CATALINA_BASE/bin/tomcat.pid"

# 配置 JVM 内存与核心运行参数
# -Xms 与 -Xmx 设置为相同值，避免 JVM 在运行时频繁调整堆内存大小，提升性能
# -Dfile.encoding=UTF-8 指定全局字符编码，防止中文乱码
# -Djava.awt.headless=true 开启无头模式，避免在无图形界面的 Linux 服务器上因调用 AWT 而报错
# -Djava.security.egd=file:/dev/./urandom 使用非阻塞的随机数生成器，大幅加快 Tomcat 启动速度
JAVA_OPTS="-server -Xmx2048m -Xms1024m -XX:MetaspaceSize=128M -XX:MaxMetaspaceSize=256M -Dfile.encoding=UTF-8 -Djava.awt.headless=true -Djava.security.egd=file:/dev/./urandom"
```

## 其他问题记录

### bin/shutdown.sh 关闭异常

1. setenv.sh 文件中配置 CATALINA_PID变量

   ```shell
   # 指定 PID 文件路径，确保 shutdown.sh 能够可靠地获取进程号并停止服务
   CATALINA_PID="$CATALINA_BASE/bin/tomcat.pid"
   ```

2. shutdown.sh 脚本加上 `-force` 参数，

   如果不加 `-force`，当你执行 `shutdown.sh` 时，如果 Tomcat 内部有线程卡住，它会一直等待而无法真正退出，但 PID 文件依然存在。下次启动时就会再次遇到今天的这个报错。加上 `-force` 后，如果正常关闭超时，脚本会自动读取 `tomcat.pid` 并强制杀掉进程

   ```shell
   exec "$PRGDIR"/"$EXECUTABLE" stop -force "$@"
   ```

   
