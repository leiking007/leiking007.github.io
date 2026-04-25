---
title: "工作杂项记录"
date: 2024-09-03
lastmod: 2024-09-03 12:12:12
draft: false
tags: ['杂记']
categories: ["💡随笔与思考"]
author: "lei"
summary: oracle锁表、oracle导入导出、weblogic打补丁、Linux扩容swap分区、修改系统时间
---

# 杂记

## weblogic

### 打补丁(12 c)

```cmd
# weblogic 版本在后台登录页左下角可以看到，命令行需要管理员打开

# 查看 opatch 版本（补丁会有opatch版本要求）
%ORACLE_HOME%\OPatch\opatch.bat version

# 查看已安装补丁
%ORACLE_HOME%\OPatch\opatch.bat  lspatches

# 验证什么补丁应用到了 oracle_home
%ORACLE_HOME%\OPatch\opatch.bat lsinventory

# 解压补丁包
jar -xvf xxxx_Generic.zip

# 进入解压目录下的 tools\spbat 目录

# windows需要将 spbat.bat 脚本处理下（去掉日期的星期几，不然中文会报错）
    for /F "tokens=1-3 delims=/:" %%i in ('date /t') do set curdate=%%i-%%j-%%k
    For /f "tokens=1-4 delims=/:.," %%a in ("%TIME%") do set curtime=%%a-%%b-%%c-%%d
    set curdate=%curdate: =%
    set curtime=%curtime: =%
    改为
    for /F "tokens=1-3 delims=/: " %%i in ('date /t') do set curdate=%%i-%%j-%%k
    For /f "tokens=1-4 delims=/:.," %%a in ("%TIME%") do set curtime=%%a-%%b-%%c
    set curdate=%curdate: =%
    set curtime=%curtime: =%

# 这个命令 验证补丁包
spbat.bat -phase precheck -oracle_home D:\Oracle\Middleware\Oracle_Home

# 进行补丁包安装，opatch版本会自动更新 （当opatch版本不符合要求时直接执行）
spbat.bat -phase apply -oracle_home D:\Oracle\Middleware\Oracle_Home


#------------- 其他命令 ----------
# 安装补丁（单个和多个）
# 单个需要进补丁解压目录
%ORACLE_HOME%\OPatch\opatch.bat apply
# 多个需要指定id
%ORACLE_HOME%\OPatch\opatch.bat napply -id 29633448, 28298916

#补丁回滚（单个和多个）
%ORACLE_HOME%\OPatch\opatch.bat rollback -id 26519417
%ORACLE_HOME%\OPatch\opatch.bat nrollback -id 15941858,15955138
```

### 重置密码(12 c)

```bash
# 在 Oracle_Home 目录下

# 执行命令重新生成 DefaultAuthenticatorInit.ldift 文件；账户: weblogic 密码: weblogic2019
java -classpath wlserver\server\lib\weblogic.jar weblogic.security.utils.AdminAccount weblogic weblogic2019 user_projects\domains\base_domain\security

# 删除 user_projects\domains\base_domain\servers\AdminServer\data\ldap 文件夹

# 修改 user_projects\domains\base_domain\servers\AdminServer\security\boot.properties
username=weblogic
password=weblogic2019
```

## Tomcat

### cmd 窗口

```bash
# 设置当前cmd界面编码为 UTF-8
chcp 65001

# 设置环境变量 JAVA_HOME、CATALINA_HOME
set JAVA_HOME=F:\study\environment\javaDevelopmentKit\jdk1.7
set CATALINA_HOME=F:\study\soft\apache\apache-tomcat-8.5.99

# 设置 PATH
set PATH=%JAVA_HOME%\bin;%PATH%

# 设置 JVM 参数
set JAVA_OPTS=-Xms512m -Xmx1024m -XX:PermSize=128m -XX:MaxPermSize=256m -Dfile.encoding=UTF-8

# 在当前窗口启动 Tomcat
%CATALINA_HOME%\bin\catalina.bat run
```

## Linux

### 扩容swap分区

```bash
# 查看当前 swap 大小
free -m

# 创建 swap 文件存储位置，并进入
mkdir /swap

# 创建分区文件 16g 16348M
# if=/dev/zero 填充0；of=/swap/swapfile 分区文件位置；bs=1M 块大小；count=16348 分区大小
dd if=/dev/zero of=/swap/swapfile bs=1M count=16348

# 查看创建文件
du -h /swap/swapfile

# 创建 swap 分区文件系统
# 注意：这里会生成 uuid，需要记录，后面设置开机启动时需要用上
mkswap /swap/swapfile

# 启用交换分区文件
swapon /swap/swapfile

# 查看 swap 分区
swapon --show

# 设置开机启动 swap 分区，编辑/etc/fstab，新增一行；
# 也可以使用创建 swap 分区时返回的 uuid；通过 file 命令也可以查看，file /swap/swapfile
/swap/swapfile swap swap defaults 0 0
```

### 修改系统时间

```bash
# 查看当前时间
date

# 设置系统时间（临时），重启后会变回硬件时间
date -s "YYYY-MM-DD hh:mm:ss"

# 将系统时间同步到硬件
hwclock --systohc

# 将硬件时间同步到系统
hwclock --hctosys
```

### 欧拉系统安装后初始化

```bash
# 卸载/home分区（前提：/home分区未被占用，否则会卸载失败）
umount /home/

# 删除/home对应的逻辑卷（彻底释放/home卷的空间）
lvremove /dev/mapper/openeuler-home 

# 查看卷组信息（确认/home卷删除后释放的空闲空间）
vgs

# 将卷组中所有空闲空间扩展给根分区逻辑卷
lvextend -l +100%FREE /dev/mapper/openeuler-root 

# 查看逻辑卷信息（验证根分区逻辑卷已扩容）
lvs

# 查看文件系统类型和磁盘使用情况（此时根分区逻辑卷扩容，但文件系统还未同步）
df -hT

# 调整根分区的文件系统大小，使其匹配扩容后的逻辑卷（ext系列文件系统用resize2fs）
resize2fs /dev/mapper/openeuler-root 

# 再次查看磁盘使用情况（验证根分区实际可用空间已增加）
df -h

# 查看块设备信息（确认磁盘/分区/逻辑卷的整体结构）
lsblk

# 再次查看卷组信息（确认空闲空间已被根分区占用）
vgs
```

## 运维

### jar 更改 war/jar 包中配置文件

```bash
# 查看
jar -tvf app.war | grep -i application.yml   

# 提取war包中某个文件
jar -xvf app.war WEB-INF/classes/application.yml   

# 更新，常用于只替换包中某个配置文件，而不需要解压整个包
jar -uvf app.war WEB-INF/classes/application.yml   

# =============================================
# 查看多个文件
jar -tvf xxx.jar | grep -E 'application-datasource-zs.yml|application.yml|logback.xml'

# 提取多个文件
jar -xvf xxx.jar \
    WEB-INF/classes/application-datasource-zs.yml \
    WEB-INF/classes/application.yml \
    WEB-INF/classes/logback.xml

# 更新war中的多个文件
jar -uvf xxx.jar \
    WEB-INF/classes/application-datasource-zs.yml \
    WEB-INF/classes/application.yml \
    WEB-INF/classes/logback.xml
```



