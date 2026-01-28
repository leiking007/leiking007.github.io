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

## oracle

### 数据库

#### 锁表

```sql
-- 锁表
SELECT * FROM COSTINFO c FOR UPDATE;

-- 查询锁表信息
SELECT t2.username, t2.sid,t2.serial#,t3.object_name,t2.OSUSER,t2.MACHINE,t2.PROGRAM,t2.LOGON_TIME,t2.COMMAND,t2.LOCKWAIT,t2.SADDR,t2.PADDR,t2.TADDR,t2.SQL_ADDRESS,t1.LOCKED_MODE
FROM v$locked_object t1, v$session t2, dba_objects t3
WHERE t1.session_id = t2.sid AND t1.object_id = t3.object_id
ORDER BY t2.logon_time;

-- 查询session
SELECT a.OS_USER_NAME,c.owner,c.object_name,b.sid,b.serial#,logon_time
FROM v$locked_object a, v$session b, dba_objects c
WHERE a.session_id = b.sid AND a.object_id = c.object_id
ORDER BY b.logon_time;

-- 杀掉session 'sid,serial#'
ALTER system kill SESSION '2844,28686' IMMEDIATE;

```

#### 新建用户/授权

```sql
-- 其中username是你要创建的用户名，password是该用户的密码
CREATE USER username IDENTIFIED BY password;

-- 分配默认表空间和临时表空间
ALTER USER username DEFAULT TABLESPACE tablespace_name
    TEMPORARY TABLESPACE temp_tablespace;
```

```sql
-- 授权创建session权限
grant create session,resource TO username;

-- 设置为管理员用户（拥有大多权限）
GRANT DBA TO username;

-- 查看用户拥有权限
SELECT * FROM USER_SYS_PRIVS;
-- 查看用户拥有的角色
SELECT * FROM USER_ROLE_PRIVS;
-- 查看用户拥有的对象权限
SELECT * FROM USER_TAB_PRIVS;
-- 查看用户拥有的系统权限和角色（查询结合了系统权限和角色，提供了一个更全面的视图）
SELECT * FROM SESSION_PRIVS;
```

#### exp/imp

> 保持表空间一致

导出exp

```sql
-- 导出完整数据库：用户名/密码@数据库名，file=d:/daochu1.dmp 是导出的文件路径，full=y 表示导出整个数据库。
exp username/passwd@ip:port/db file=d:/daochu1.dmp full=y

-- 导出某个用户表空间： 在这里，owner=user 指定了要导出的数据库用户
exp username/passwd@ip:port/db file=d:/daochu1.dmp owner=username

-- 导出某个用户的某个表： tables=table1 是要导出的表名，如果需要导出多个表，则使用(table1,table2)的形式。
exp username/passwd@ip:port/db file=d:/daochu1.dmp tables=(table1,...)

-- 示例
exp MOHRSS_AIO_TA404/MOHRSS_AIO_TA404@10.161.18.39:1521/orclpdb file=e:/MOHRSS_AIO_TA404.dmp owner=MOHRSS_AIO_TA404 buffer=8192 
```

导入imp

```sql
-- 查看版本号
select * from v$version;

-- cmd 命令行执行导入
imp username/passwd@ip:port/db file=d:/daochu1.dmp full=y ignore=y

-- 示例
imp MOHRSS_AIO_TA404_2025/MOHRSS_AIO_TA404_2025@10.161.18.39:1521/orclpdb file=e:/MOHRSS_AIO_TA404.dmp buffer=8192 ignore=y full=y
```

导出后导入中文乱码处理

```sql
-- 查询库的字符集 ；SIMPLIFIED CHINESE_CHINA.AL32UTF8;
select userenv('language') from dual;

-- 设置临时环境变量
set NLS_LANG=SIMPLIFIED CHINESE_CHINA.AL32UTF8

-- 切换当前cmd使用 utf-8 编码
chcp 65001

-- 执行导出导入命令
```

其他相关sql

```sql
-- 查看所有表（'table1','table2',...）
SELECT LISTAGG(''''||table_name||'''' ,',') WITHIN GROUP (ORDER BY table_name) AS names
FROM all_tables
WHERE owner = 'MOHRSS_AIO_TA404' AND table_name!='ET_ATTACHMENT';
```

#### DBLINK

```sql
-- 创建一个名为 remote_db_link 的数据库链接，连接到远程数据库
CREATE DATABASE LINK remote_db_link
CONNECT TO remote_username IDENTIFIED BY remote_password
USING '(DESCRIPTION =
  (ADDRESS = (PROTOCOL = TCP)(HOST = remote_host)(PORT = remote_port))
  (CONNECT_DATA =
    (SERVICE_NAME = remote_service_name)
  )
)';
-- remote_db_link：数据库链接的名称，可以自定义。
-- remote_username：远程数据库的用户名。
-- remote_password：远程数据库的密码。
-- remote_host：远程数据库服务器的主机名或 IP 地址。
-- remote_port：远程数据库监听的端口号，默认是 1521。
-- remote_service_name：远程数据库的服务名。

-- 或下面写法
CREATE DATABASE LINK myrsjhk_db_link
    CONNECT TO SCCARD IDENTIFIED BY SCCARD
    USING 'ip:port/service';

-- 查询远程数据库中的表数据
SELECT * FROM employees@remote_db_link;

-- 修改远程数据库表数据
UPDATE JXJYLOG@yhwsyw_db_link SET fieldName = 'value';

--  删除 DBLINK
DROP DATABASE LINK remote_db_link;

-- 查询某个用户所有的DBLINK
SELECT * FROM DBA_DB_LINKS WHERE OWNER = 'MY_EXAM_MANAGE';

-- 查询某个DBLINK
SELECT * FROM dba_db_links WHERE db_link = 'MYRSWT_DB_LINK'
```

#### 统计Schema大小

```sql
-- 查询某个模式（Schema）占用的物理空间大小
SELECT
    owner AS "模式名称",
    ROUND(SUM(bytes) / 1024 / 1024, 2) AS "占用空间（MB）"
FROM dba_segments
GROUP BY owner;

-- 查询某个模式（Schema）占用的物理空间大小
SELECT 
    u.username AS "模式名称",
    SUM(s.bytes / 1024 / 1024) AS "占用空间（MB）"
FROM dba_segments s JOIN dba_users u ON s.owner = u.username
GROUP BY 
    u.username
ORDER BY u.username;

-- 查询某个模式（Schema）各个对象占用的物理空间大小
SELECT owner,
       segment_name,
       segment_type,
       ROUND(bytes / 1024 / 1024, 2) AS SIZE_MB
FROM dba_segments
WHERE owner = 'MOHRSS_AIO_TA404'
ORDER BY SIZE_MB DESC;

-- 查询某个模式（Schema）表占用的物理空间大小
SELECT
    t.owner,
    t.table_name,
    ROUND(s.bytes / 1024 / 1024, 2) AS "表占用空间（MB）"
FROM dba_tables t
JOIN dba_segments s ON t.owner = s.owner AND t.table_name = s.segment_name
WHERE t.owner = 'YOUR_SCHEMA_NAME'
ORDER BY "表占用空间（MB）" DESC;
```

#### 查看过期时间

```sql
# 该语句会返回数据库中所有用户的用户名、账户状态以及密码过期日期。如果expiry_date列的值为NULL，表示该用户的密码没有设置过期时间；如果有具体的日期值，则表示该用户的密码将在该日期过期。
SELECT username, account_status, expiry_date FROM dba_users;

# 同样以管理员身份连接到数据库，先查询用户对应的概要文件，一般用户的概要文件为DEFAULT
SELECT username, PROFILE FROM dba_users;
# 然后查询对应概要文件的密码有效期设置,如果返回的LIMIT值为UNLIMITED，表示密码永不过期；如果是一个数字，则表示密码的有效期为该数字指定的天数。
SELECT * FROM dba_profiles WHERE profile='DEFAULT' AND resource_name='PASSWORD_LIFE_TIME';
```



### weblogic

#### 打补丁(12 c)

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

#### 重置密码(12 c)

```bash
# 在 Oracle_Home 目录下

# 执行命令重新生成 DefaultAuthenticatorInit.ldift 文件；账户: weblogic 密码: weblogic2019
java -classpath wlserver\server\lib\weblogic.jar weblogic.security.utils.AdminAccount weblogic weblogic2019 user_projects\domains\base_domain\security

# 删除 user_projects\domains\base_domain\servers\AdminServer\data\ldap 文件夹

# 修改 user_projects\domains\base_domain\servers\AdminServer\security\boot.properties
username=weblogic
password=weblogic2019
```

### Tomcat

#### cmd 窗口

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

## 数据库

### 参数化查询

```sql
-- 清空用户数据
DO $$
DECLARE
    v_user_id TEXT := '78914762532372551';
BEGIN
    -- 可选：记录操作日志或检查是否存在
    RAISE NOTICE 'Deleting user data for user_id: %', v_user_id;

    DELETE FROM health_management_ta404.et_user WHERE user_id = v_user_id;
    DELETE FROM health_management_biz.health_checkin_user WHERE user_id = v_user_id;
    DELETE FROM health_management_biz.reg_infor WHERE user_id = v_user_id;
    DELETE FROM health_management_biz.ship_address WHERE user_id = v_user_id;
    DELETE FROM health_management_biz.user_info_ext WHERE user_id = v_user_id;
    DELETE FROM health_management_biz.user_points_details WHERE user_id = v_user_id;
    DELETE FROM health_management_biz.user_points_summary WHERE user_id = v_user_id;

    RAISE NOTICE 'User data deleted successfully.';
EXCEPTION
    WHEN OTHERS THEN
        RAISE WARNING 'Error deleting user %: %', v_user_id, SQLERRM;
        -- 可选择是否回滚（在 DO 块中自动回滚）
END $$;
```

### PGSQL 新建用户

```sql
-- 新建用户
CREATE USER face_user WITH PASSWORD 'LongerPassword123.';

-- 新建数据库
CREATE DATABASE face_lib;

-- 授予连接数据库权限
GRANT CONNECT ON DATABASE face_lib TO face_user;

-- 连接新建库执行以下语句
-- 授予数据库所有权限
GRANT ALL PRIVILEGES ON DATABASE face_lib TO face_user;
-- 授予 public 模式所有权限
GRANT ALL PRIVILEGES ON SCHEMA public TO face_user;
-- 授予现有表所有权限
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO face_user;
-- 授予现有序列所有权限
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO face_user;
-- 授予现有函数所有权限
GRANT ALL PRIVILEGES ON ALL FUNCTIONS IN SCHEMA public TO face_user;
-- 设置未来创建表的默认权限
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL PRIVILEGES ON TABLES TO face_user;
-- 设置未来创建序列的默认权限
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL PRIVILEGES ON SEQUENCES TO face_user;
-- 设置未来创建函数的默认权限
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL PRIVILEGES ON FUNCTIONS TO face_user;
```

### PGSQL排查连接问题

```sql
-- 查询face_db数据库的活跃 / 非内部连接详情
SELECT 
  pid,  -- 连接的唯一进程ID（PostgreSQL内部标识每个连接的进程号）
  datname,  -- 连接的数据库名（这里过滤后只显示face_db）
  usename,  -- 发起连接的数据库用户名（比如fastapi_user）
  client_addr,  -- 客户端IP（能定位到是哪个FastAPI服务实例连过来的）
  application_name,  -- 应用名（如果FastAPI连接时配置了这个参数，能直接识别业务模块）
  state,  -- 连接状态（关键！比如：
          -- active：正在执行SQL；
          -- idle：空闲（没执行SQL）；
          -- idle in transaction：事务中空闲（最危险，占连接且未提交/回滚）；
          -- idle in transaction (aborted)：事务出错但未终止
  state_change,  -- 连接状态最后一次变更的时间（比如idle状态持续了多久）
  backend_start,  -- 连接建立的时间（能看连接是否长期不释放）
  query,  -- 该连接最后/正在执行的SQL（能定位到慢SQL/异常SQL，比如未提交的DELETE）
  now() - backend_start AS connection_age,  -- 连接存活总时长（排查长连接泄漏）
  now() - state_change AS state_age  -- 当前状态持续时长（比如idle状态卡了几小时）
FROM pg_stat_activity 
WHERE datname = 'face_db'  -- 只查face_db数据库的连接
  AND client_addr is not null;  -- 排除数据库内部连接（比如后台进程、本机localhost无IP的连接）
  
SELECT pg_terminate_backend(4750);  -- 终止指定 PID 的数据库连接

SELECT * FROM pg_stat_activity WHERE pid = 4723;  -- 查询指定 PID 连接的完整详情
```

### PGSQL 库迁移

```bash
# PGPASSWORD 是 PostgreSQL 客户端（如 psql、pg_dump 等）用来自动提供密码的环境变量
# cmd:  set PGPASSWORD=your_password
# powershell:  $env:PGPASSWORD = "your_password"

# 导出
pg_dump.exe --verbose \    
  --host=192.168.116.131 --port=5432 \
  --username=postgres \
  --format=t --encoding=UTF-8 \
  --file E:/dump-404 \
  --no-owner --no-privileges \
  -n "health_management_ta404" postgres
  
  
# 导入
pg_restore.exe --verbose \
  --host=20.1.1.5 --port=5433 \
  --username=postgres \
  --dbname=health_db \
  --no-owner --no-privileges \
  E:/dump-404
```

### 达梦新建用户

```bash
CREATE USER "KXCWT_TA404" IDENTIFIED BY "Dameng123" DEFAULT TABLESPACE MAIN;
GRANT CREATE SESSION TO "KXCWT_TA404";  -- 授予连接权限
GRANT RESOURCE TO "KXCWT_TA404";   -- 授予建表等基本资源权限
# GRANT DBA TO "KXCWT_TA404";   -- 或者一次性授予 DBA 权限（谨慎使用）
```

### 达梦库迁移

```bash
# 导出 KXCWT_TA404 模式表到 KXCWT_TA404.dmp
dexp USERID=KXCWT_TA404/Dameng123@127.0.0.1:5236 FILE=KXCWT_TA404.dmp SCHEMAS=KXCWT_TA404

# 导入到 KXCHX_TA404 模式
dimp USERID=KXCHX_TA404/Dameng123@127.0.0.1:5236 FILE=KXCWT_TA404.dmp REMAP_SCHEMA=KXCWT_TA404:KXCHX_TA404
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



