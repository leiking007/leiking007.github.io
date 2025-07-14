---
title: "PostgreSQL"
date: 2022-10-09
lastmod: 2022-10-09
draft: false
tags: ['数据库']
categories: ["后端"]
author: "lei"
---

# PostgreSQL

## 起步

### 简介

开源：可以基于任何目的使用、修改甚至发布

先进：高度兼容SQL标准，支持事务的ACID原则

功能丰富：基本数据类型、数组、范围类型、JSON、XML、几何类型；完整性约束；索引；复杂查询；先进的查询优化器；分区表；异步、同步、逻辑复制；安全认证；全文检索

可扩展性：存储过程（C、PL/pgSQL、Perl、Python、Java等）；FDW；自定义类型和索引；存储引擎

### 安装

1. 下载源码`https://www.postgresql.org/download/`，postgresql-14.5.tar.gz

2. 上传至Linux服务器

3. 解压源码并编译安装

   ```bash
   tar -zxvf postgresql-14.5.tar.gz			#解压
   yum install readline-devel			#如果执行config脚本报readline错，安装readline依赖包
   ./configure			#依赖树构建，默认设置
   make		#编译
   make install    #安装，默认安装在 /usr/local/pgsql
   ```

4. 安装后的设置

   ```bash
   #共享库 设置
   LD_LIBRARY_PATH=/usr/local/pgsql/lib
   export LD_LIBRARY_PATH
   
   #环境变量，在/etc/profile文件或者~/.bash_profile文件末尾添加
   PATH=/usr/local/pgsql/bin:$PATH
   export PATH
   ```

5. 启动数据库

   ```bash
   #创建用户postgres，并给定权限
   adduser postgres   		#创建用户 postgres
   passwd postgres		#设置用户密码
   usermod -aG wheel postgres		#添加用户到组，使其拥有管理员权限
   
   chown postgres /usr/local/pgsql		#将文件拥有者改为创建的用户
   
   su postgres    #切换用户
   
   #创建一个数据库集簇,初始化一个数据库存储区域
   initdb -D /usr/local/pgsql/data
   
   #启动postgresql
   postgres -D /usr/local/pgsql/data >logfile 2>&1 &
   
   #关闭服务器 SIGTERM：智能关闭模式；SIGINT：快速关闭模式；SIGQUIT：立即关闭模式
   kill -INT `head -1 /usr/local/pgsql/data/postmaster.pid`
   ```

### 认证设置

打开数据集簇中`postgresql.conf`配置文件

```java
listen_addresses = '*'
```

打开数据集簇中`pg_hba.conf`客户端认证配置文件

```bash
## 0.0.0.0/0 可以表示所有ipv4地址，::0/0表示所有 IPv6 地址
local   all             all                                     trust
host    all             all             0.0.0.0/0            	password
host    all             all             ::1/128                 password
local   all     		all                                     trust
host    all    			all             0.0.0.0/0            	password
host    all     		all             ::1/128                 password
```

配置角色等信息

```bash
psql   #本地连接pg数据库

#角色相关命令
postgres=## CREATE ROLE admin LOGIN PASSWORD '123456'		
postgres=## CREATE USER admin PASSWORD '123456'
postgres=## DROP ROLE admin;
postgres=## ALTER ROLE admin WITH PASSWORD '123456';
postgres=## SELECT rolname FROM pg_roles;
```

### 创建数据库

```bash
#创建数据库
createdb mydb
dropdb mydb

#可以直接使用交互式终端程序访问
pgsql mydb

```

### 连接

通过客户端连接，默认用户名密码都为`postgres`

## SQL语言

单引号：表示值

双引号：表示表名、列名等数据库存在关键字；且postgresql会发生去除双引号或字段转小写的操作，因此字段名大写时，需要加双引号进行查询

空值：null是一个特殊值（缺失值），不能使用 `=` 判断；使用`distinct`可以对null值进行去重；排序时`order`会认为null值最大；

### DDL

新建和删除表

```sql
CREATE TABLE weather (
    city            varchar(80),
    temp_lo         int,           -- 最低温度
    temp_hi         int,           -- 最高温度
    prcp            real          -- 湿度
);
COMMENT ON TABLE public.weather IS '天气表';
COMMENT ON COLUMN public.weather.city IS '最低温度';
COMMENT ON COLUMN public.weather.temp_lo IS '最高温度';
COMMENT ON COLUMN public.weather.temp_hi IS '湿度';
DROP TABLE weather;


-- 根据已存在表结果建新表
create table employees_his as (select * from employees where 1=0);
```

### DML

**新增**

```sql
INSERT INTO weather VALUES ('San Francisco', 46, 50, 0.25, '1994-11-27');

-- 返回新增数据
insert into dept (dept_id, dept_name)
values ('000001', 'DeptOne') 
returning dept_id;   -- 返回新增数据的dept_id字段

-- 通过通用表表达式，将新增数据数据插入备份表
with inserts as (
 insert into employees values (206,'William','Gietz','WGIETZ','515.123.8181','2002-06-07','AC_ACCOUNT',8800.00,NULL,205,110)
 returning *
)
insert into employees_his select * from inserts;  -- 过查询插入数据
```

**更新**

```sql
UPDATE weather
    SET temp_hi = temp_hi - 2,  temp_lo = temp_lo - 2
    WHERE date > '1994-11-28';
    
    
-- 将更新之前的数据插入备份表
-- 因为在一个语句中，所有的操作都在一个事务中，所以主查询中的 employees 是修改之前的状态  
with updates as (
 update employees set salary = salary + 500 where employee_id = 206
 RETURNING *  -- 这里返回的是更新后的数据
)
insert into employees_his select * from employees where employee_id = 206;


-- 将更新后的数据插入备份表
with updates as (
 update employees set salary = salary + 500 where employee_id = 206
 RETURNING *  -- 这里返回的是更新后的数据
)
insert into employees_his select * from updates;
```

**删除**

```sql
DELETE FROM weather WHERE city = 'Hayward';

-- 连表删除，删除emp1中 emp存在的数据
delete from emp1
using emp WHERE emp1.employee_id = emp.employee_id;

-- 利用通用表表达式备份删除的数据
with deles as (
	delete from employees where employee_id='206'
	returning *   -- 返回被删除的所有数据
)
insert into employees_his select * from deles;  -- 过查询插入数据
```

**查询**

```sql
-- 查询pgsql版本
select version() as "数据库版本"


-- 基本查询 =  !=  <>  <  >  in  not-in  between
select first_name,last_name from employees where employee_id = 100;


-- 模糊查询 %任意多个字符  _任意一个字符
select first_name,last_name from employees where first_name like 'Sa' || '%';


-- 模糊查询 正则 ~ 大小写相关   ~* 大小写无关
select first_name,last_name from employees where first_name ~ '^S.*n$';


-- 多个查询条件  and  or  not   优先级:not>and>or
select first_name,last_name from employees where employee_id >100 and first_name='Neena';


-- 排序，默认为acs; asc 升序   desc 降序
select first_name,last_name from employees order by first_name asc,last_name asc;


-- 限制limit  
-- 查询前5条记录
select first_name,last_name from employees order by first_name limit 5;
select first_name,last_name from employees order by first_name fetch first 5 rows only;
-- 查询第11到15的记录
select first_name,last_name from employees order by first_name limit 5 offset 10;
select first_name,last_name from employees order by first_name offset 10 rows  fetch first 5 rows only;

-- 分组聚合  count()  avg() sum() string_agg(field,'',order by)等
select manager_id,avg(salary)  from employees group by manager_id having avg(salary)>9000;
-- 分组多个字段时，汇总；  小计、合计、总计
-- cube = grouping sets ((job_id,"year"),"year",job_id)
-- rollup = grouping sets ((job_id,"year"),"year")
-- grouping(job_id) 可以查看哪些数据是基于job_id汇总的
-- grouping sets 自定义分组集
select job_id ,extract(year from hire_date) as "year",count(1),grouping(job_id) from employees group by grouping sets ((job_id,"year"),"year",job_id);


-- 内连接
select e.first_name ,d.department_name  from employees e join departments d ON e.department_id=d.department_id;


-- 外连接 left join 、  right join 、  full join
select e.first_name ,d.department_name  from employees e left join departments d ON e.department_id=d.department_id;


-- 交叉连接 会构造一张很大的表  cross join
select concat(t1,'*',t2)  from generate_series(1,9) t1 ,generate_series(1,9) t2;


-- exists/not exists 将每行数据带入exists 后查询中匹配，能查到数据则返回
select * from employees e where exists (select 1 from departments where department_id=e.employee_id)


-- 当两个结果集很大时，all效率总是高于distinct
-- 并集  union all 不去重、union distinct 去重，默认
select * from (values (1),(2),(3)) as t1 union select * from (values (1)) t2;

-- 交集  intersect all 不去重、intersect distinct 去重
select * from (values (1),(2),(3)) as t1 intersect select * from (values (1)) t2;

-- 差集  except all 不去重 、 except distinct 去重
select * from (values (1),(2),(3)) as t1 except select * from (values (1)) t2;


-- 通用表表达式 with temp as ( select ...)   select * from temp 
with temp as (select 1) select * from temp;

-- 递归通用表表达式 需要关键词recursive；组织架构图展示
with recursive tb as (
	select employee_id  as empid,concat(first_name,last_name) as name,concat(first_name,last_name) as path from employees where manager_id is null    -- 初始条件
	union all
	select employee_id  as empid,concat(first_name,last_name) as name,concat(tb.path,'/',first_name,last_name) from employees join tb on manager_id=tb.empid    -- 递归条件
) select * from tb
```

### 常用函数

**条件表达式**

```sql
-- case 等值条件 如果不写else，未匹配到case的会返回null值
select
	first_name,last_name ,
	case
		department_id 
	when 90 then '管理'
		when 60 then '开发'
		else '其他'
	end as "部门"
from
	employees e

-- case 逻辑条件
select
	first_name,
	case 
		when salary < 5000 then '低收入'
		when salary between 5000 and 10000 then '中收入'
		else '高收入'
	end
	
from
	employees e
	
-- case 行转列；count会忽略null值，利用case进行转列
select
	count(case department_id when 10 then 1 end) dept10_count,
	count(case department_id when 20 then 1 end) dept10_count,
	count(case department_id when 30 then 1 end) dept10_count
from
	employees e
	
	
-- nullif(a,b)  如果a=b,返回null，1/null 值就为null
select 1/nullif(0,0)

-- coalesce(a,b,..)  返回第一个不为空的值
select coalesce(null,'as')
```

**数学函数**

| 操作符 | 描述                   | 例子        | 结果  |
| ------ | ---------------------- | ----------- | ----- |
| `+`    | 加                     | `2 + 3`     | `5`   |
| `-`    | 减                     | `2 - 3`     | `-1`  |
| `*`    | 乘                     | `2 * 3`     | `6`   |
| `/`    | 除(整数除法将截断结果) | `4 / 2`     | `2`   |
| `%`    | 模(求余)               | `5 % 4`     | `1`   |
| `^`    | 幂(指数运算)           | `2.0 ^ 3.0` | `8`   |
| `|/`   | 平方根                 | `|/ 25.0`   | `5`   |
| `||/`  | 立方根                 | `||/ 27.0`  | `3`   |
| `!`    | 阶乘                   | `5 !`       | `120` |
| `!!`   | 阶乘(前缀操作符)       | `!! 5`      | `120` |
| `@`    | 绝对值                 | `@ -5.0`    | `5`   |
| `&`    | 二进制 AND             | `91 & 15`   | `11`  |
| `|`    | 二进制 OR              | `32 | 3`    | `35`  |
| `#`    | 二进制 XOR             | `17 ## 5`    | `20`  |
| `~`    | 二进制 NOT             | `~1`        | `-2`  |
| `<<`   | 二进制左移             | `1 << 4`    | `16`  |
| `>>`   | 二进制右移             | `8 >> 2`    | `2`   |

```sql
-- 绝对值
select abs(-100);

-- 取整 ceil向上找最近的整数、floor向下找最近的整数、round向零找最近的整数
select ceil(2.3);

-- 乘方和开方 power(a,b)a的b次方、sqrt(a)a的平方根、cbrt(a)a的立方根
select sqrt(4);

-- 返回参数正负数，可能返回值1、0、-1
select sign(-5) 

-- 随机数 返回一个0-1之间的双精度随机数
select random();
```

**字符函数**

```sql
-- 字符串拼接
select 'a' || 'b' || 'c';
select concat('a','b','c');
select concat_ws('_','a','b','c');  -- 指定 _ 分隔符连接

-- 获取字符串长度  length 按字符计算、bit_length 按比特计算、octet_length 按字节数计算
select length('abc');

-- 大小写转换 upper 转换大写、lower 转换小写、initcap 首字母大写
select upper('abc');

-- 字串查找与替换
select substring('abcd',1,2); -- 从位置1开始，查找2个 ab
select left('abcd',2);  -- 从左边开始查找2个   ab
select right('abcd',2);  -- 从右边开始第2个到最后2个  cd
select replace('abcd','a','d');  -- 替换，dbcd
select translate('abcd','ac','1');  -- 对应替换  a替换为1，c直接删除  1bd

-- 截断
select trim(' abcd ');  -- 去除前后空串
select trim(both 'as' from 'abcdas' );  -- 两端截断包含 'a'或's'  bcd

-- 字符串格式化
select format('hello %s','world');  -- %s占位符  hello world

-- 返回md5值
select md5('asd');

-- 反转字符串
select reverse('abcd');   -- dcba
```

**日期函数**

```sql
-- 获取当前日期、时间、时间戳
select current_date,current_time,current_timestamp;

-- 当前时间加上一年 interval为时间段修饰词
select current_date + interval '1 year';

-- 获取时间戳的年份
select date_part('year',current_timestamp);
```

**转换函数**

```sql
-- 将'123' 转换为整型 123
select cast('123' as integer);

-- 将 '2022-06-12' 转换为日期
select cast('2022-06-12' as date);

-- 转换为日期
select to_date('2022/06/25','YYYY/MM/DD');

-- 转化为时间
select to_timestamp('2022/06/25','YYYY/MM/DD');

-- 转化为字符串
select to_char(current_date,'YYYY-MM-DD');
```



## 高级特性

### 视图

视图（View）本质上是一个存储在数据库中的查询语句。视图本身不包含数据，也被称为
虚拟表

视图的好处

- 替代复杂查询，减少复杂性。将复杂的查询语句定义为视图，然后使用视图进行查询，可以隐藏具体的实现
- 提供一致性接口，实现业务规则。在视图的定义中增加业务逻辑，对外提供统一的接口；当底层表结构发生变化时，只需要修改视图接口，而不需要修改外部应用，可以简化代码的维护并减少错误
- 控制对于表的访问，提高安全性。通过视图为用户提供数据访问，而不是直接访问表；同时可以限制允许访问某些敏感信息

**创建视图**

```sql
create view view_name as query;

#实例
create view myview as
    select city, temp_lo, temp_hi, prcp
        from weather
        where date>'2022-01-12';
```

**修改视图**

```sql
#修改视图定义中的查询
#PostgreSQL只支持追加视图定义中的字段，不支持减少字段或者修改字段的名称或顺序
create or replace view view_name  as  query;

#PostgreSQL 提供了 ALTER VIEW 语句修改视图的属性
#修改视图名称
alter view empdetailsview rename to empinfovie;
```

**删除视图**

```sql
#删除视图
#if exists可以避免删除一个不存在的视图时产生错误
#cascade 表示级联删除依赖于该视图的对象
#restrict 表示如果存在依赖对象则提示错误信息，这是默认值
drop view [ if exists ] name [ cascade | restrict ];

#实例
drop view myview;
```

**可更新视图**

如果一个视图满足以下条件：

- 视图定义的 FROM 子句中只包含一个表或者可更新视图
- 视图定义的最顶层查询语句中不包含以下子句：GROUP BY、HAVING、LIMIT、OFFSET、DISTINCT、WITH、UNION、INTERSECT 以及 EXCEPT
- SELECT 列表中不包含窗口函数、集合函数或者聚合函数

那么该视图被称为可更新视图（updatable view），意味着我们可以对其执行 INSERT、
UPDATE 以及 DELETE 语句，PostgreSQL 会将这些操作转换为对底层表的操作

### 外键

```sql
CREATE TABLE cities (
        city     varchar(80) primary key,
        location point
);

CREATE TABLE weather (
        city      varchar(80) references cities(city),
        temp_lo   int,
        temp_hi   int,
        prcp      real,
        date      date
);
```

### 事务

数据库中的事务具有原子性（Atomicity）、一致性（Consistency）、隔离性（Isolation）以及持久性（Durability），也就是 ACID 属性

- 原子性：保证事务中的操作要么全部成功，要么全部失败，不会只成功一部分
- 一致性：确保了数据修改的有效性，并且遵循一定的业务规则；数据库还必须保证满足完整性约束
-  隔离性：决定了并发事务之间的可见性和相互影响程度
- 持久性：确保已经提交的事务必须永久生效，即使发生断电、系统崩溃等故障，数据库都不会丢失数据。对于 PostgreSQL 而言，使用的是预写式日志（WAL）的机制实现事务的持久性

**事务语句**

```sql
begin;
update cities set location = '(24,24)';
savepoint my_savepoint;    -- 回滚结点
update cities set location = '(48,48)';
rollback to my_savepoint;  -- 会使回滚结点之后的操作回滚
update weather set prcp = 14;
commit;
```

**事务隔离级别**

数据库如果不进行隔离控制可能出现以下情况

- 脏读（dirty read）：事务A读取了事务B未提交的修改
- 不可重复读（nonrepeatable read）：事务A多次读取同一条数据，可能不一致（被其他事务修改了）
- 幻读（phantom read）：事务A按某个条件查询数据，再次查询时数据数量发生了变化（被其他事务修改了）
- 更新丢失（lost update）：第一类：当两个事务更新相同的数据时，事务A被提交，事务B被撤销，那么第一个事务的更新也会被撤销；第二类：当两个事务同时读取某一记录，然后分别进行修改提交；就会造成先提交的事务的修改丢失

为了控制上述情况，SQL标准定义了 4 种不同的事务隔离级别

- Read Uncommitted（读未提交）：最低的隔离级别，实际上就是不隔离，任何事务都可
  以看到其他事务未提交的修改
- Read Committed（读已提交）：一个事务只能看到其他事务已经提交的数据，解决了脏
  读问题，但是存在不可重复读、幻读和第二类更新丢失问题
- Repeated Read（可重复读）：一个事务对于某个数据的读取结果不变，即使其他事务
  对该数据进行了修改并提交
- Serializable（可串行化）：最高的隔离级别，事务串行化执行，没有并发

```sql
-- 查看pgsql默认事务隔离级别
show transaction_isolation   


-- 更改事务隔离级别
begin;
SET TRANSACTION ISOLATION LEVEL { SERIALIZABLE | REPEATABLE READ | READ 
COMMITTED | READ UNCOMMITTED };
```

### 窗口函数

窗口函数不是将一组数据汇总为单个结果，而是针对每一行数据，基于和它相关的一组数 据计算出一个结果；聚合函数通常也可以作为窗口函数，区别在于后者包含了 OVER 关键字

`窗口函数定义`

```sql
window_function ( expression, ... ) OVER (
 PARTITION BY ...
 ORDER BY ...
 frame_clause
)
-- window_function 是窗口函数的名称
-- expression 是函数参数，有些函数不需要参数
-- OVER 子句包含三个选项：分区(PARTITION BY)、排序(ORDER BY)以及窗口大小(frame_clause)
```

**分区选项（PARTITION BY）**

PARTITION BY 选项用于定义分区，作用类似于 GROUP BY 的分组。如果指定了分区选项， 窗口函数将会分别针对每个分区单独进行分析

**排序选项（ORDER BY）**

ORDER BY 选项用于指定分区内的排序方式，通常用于数据的排名分析

**窗口选项（frame_clause）**

frame_clause 选项用于在当前分区内指定一个计算窗口。指定了窗口之后，分析函数不再基 于分区进行计算，而是基于窗口内的数据进行计算

窗口大小的常用选项如下： 

```sql
{ ROWS | RANGE } frame_start
{ ROWS | RANGE } BETWEEN frame_start AND frame_end
```
frame_start 用于定义窗口的起始位置，可以指定以下内容之一

- unbounded preceding，窗口从分区的第一行开始，默认值
- N preceding，窗口从当前行之前的第 N 行或者数值开始
- current row，窗口从当前行开始

 frame_end 用于定义窗口的结束位置，可以指定以下内容之一

- current row，窗口到当前行结束，默认值
-  N following，窗口到当前行之后的第 N 行或者数值结束
-  unbounded following，窗口到分区的最后一行结束

```sql
-- 查询每个工作每年总共人数
select
	job_id,
	extract(year from hire_date),
	count(1) over (
	 partition by job_id  -- 根据工作分组
	 order by extract(year from hire_date)  -- 根据年份排序
	 rows between unbounded preceding and current row   -- 定义计算窗口，第一行到当前行
	)
from
	employees
	
	
-- 排名窗口函数  查询员工在各自部门薪资排行
select department_id,concat(first_name,last_name) as name,
	row_number() over w1  as "row_number",  -- 1-10  每行分配序号，连续
	rank() over w1 as "rank",  -- 1-8 8 10	相同的会跳跃
	dense_rank() over w1 as "dense_rank",  -- 1-8 8 9 10  相同的数据，后续依旧连续
	percent_rank() over w1 as "percent_rank"  -- 以百分比的形式显示每行数据在其分区中的名次
from employees
window w1 as (partition by department_id order by salary desc);


-- 取值窗口函数
select department_id,concat(first_name,last_name) as name,
	first_value(salary) over w1 "first_value",   -- 返回窗口内第一行的数据
	last_value(salary) over w1 as "last_value",  -- 返回窗口内最后一行的数据
	nth_value(salary,2) over w1 as "nth_value",  -- 返回窗口内第 N 行的数据
	lag(salary) over w1 as "lag",  -- 返回分区中当前行之前的第 N 行的数据
	lead(salary) over w1 as "lead"  -- 返回分区中当前行之后第 N 行的数据
from employees
window w1 as (partition by department_id order by salary desc); -- 这里定义的窗口可以在前面语句中直接使用 

-- 使用lag函数实现环比分析，各个部门根据年排序，取得本期汇总薪水和上期汇总薪水
select
	department_id,
	"year" ,
	salary,
	lag(salary, 1) over (partition by department_id order by "year") as "presal"
from
	(selectdepartment_id,extract(year from hire_date) as "year",sum(salary) as "salary" 
	    from employees group by 1, 2) as t
```

### 索引与优化

索引（Index）可以用于提高数据库的查询性能；但是索引也需要进行读写，同时还会占用
更多的存储空间

postgresql默认使用`B-树`索引，B-树是一个自平衡树（self-balancing tree），按照顺序存储数据，支持对数时间复杂度（O(logN) 的搜索、插入、删除和顺序访问

**实例**

```sql
-- 创建test表
CREATE TABLE test ( id integer, name text);
-- 模拟生成10000000条数据
INSERT INTO test SELECT v,'val:'||v FROM generate_series(1, 10000000)  v;

-- 查看执行计划，需要花费5秒
explain analyze SELECT name FROM test WHERE id = 10000;
/*
 * Gather (cost=1000 rows=1 width=11) (actual time=5410 rows=1 loops=1)
 * ....
 * Execution Time: 1981.174 ms
 */

-- 在id字段上创建索引
create index test_id_index on test (id);

-- 再次查看执行计划，走了索引且执行之间仅为 1.4 ms
explain analyze SELECT name FROM test WHERE id = 10000;
/*
 * Index Scan using test_id_index on test (cost=0.56 rows=1 width=12) (actual time=1.0 rows=1 loops=1)
 * Execution Time: 1.405 ms
 */
```

**创建索引**

- 唯一索引，唯一索引可以用于实现唯一约束，PostgreSQL 目前只支持 B-树类型的唯一索引

  ```sql
  create unique index index_name on table_name (column_name [asc | desc] [nulls first | nulls last]);
  
  -- 实例
  create unique index test_index on test (id desc);
  ```

- 多列索引，对于多列索引，应该将最常作为查询条件使用的字段放在左边

  ```sql
  -- 对于多列索引，需要注意 如果第一列没在查询条件中 不会走索引
  create [unique] index index_name on table_name [using method] (column1 [asc | desc] [nulls first | nulls last], ...);
  
  -- 实例
  create unique index test_index on test (id desc,name);
  ```

- 函数索引，函数索引，也叫表达式索引，是指基于某个函数或者表达式的值创建的索引

  ```sql
  create [unique] index index_name on table_name (expression);
  
  -- 实例，查询时条件为 upper(name)='ASD' 会走索引
  create unique index test_index on test (upper(name));
  ```

- 部分索引，只针对表中部分数据行创建的索引，通过一个 WHERE 子句指定需要索引的行

  ```sql
  create index index_name on table_name (column_name) where expression;
  
  -- 实例，对于finished字段不为true的数据，在order_id上创建索引
  create index orders_unfinished_index on orders (order_id) where finished is not true;
  ```

- 覆盖索引，pgsql默认创建索引，索引和表存储在两个地方，覆盖索引可以将数据和索引放在一起

  ```sql
  -- 实例，使用btree索引创建a，b列索引，并将c列数据包括进来，
  create unique index idx_t_ab on t using btree (a, b) include (c);
  ```

**查看索引**

PostgreSQL 提供了一个关于索引的视图 pg_indexes，可以用于查看索引的信息

```sql
select * from pg_indexes where tablename = 'test';
```

**维护索引**

索引重建的情况

- 索引已损坏，并且不再包含有效数据
- 索引已变得“膨胀”，即它包含许多空页面或近空页面
- 更改了索引的存储参数(例如 fillfactor)，并希望确保所做的更改已完全生效
- 使用`CONCURRENTLY`选项构建索引失败，留下“无效”索引

```sql
-- 重命名索引
alter index index_name rename to new_name;

-- 移动索引到其他表空间
alter index index_name set tablespace tablespace_name;

-- 重建索引数据，支持不同级别的索引重建
reindex [ ( verbose ) ] { index | table | schema | database | system } index_name;

-- 实例 重建id_unique索引
reindex index id_unique
```

**删除索引**

```sql
-- CASCADE 表示级联删除其他依赖该索引的对象
-- RESTRICT 表示如果存在依赖于该索引的对象，将会拒绝删除操作。默认为 RESTRICT
drop index index_name [ cascade | restrict ];

-- 实例
drop index test_id_index;
```





## 存储过程

### 概述

除了标准 SQL 语句之外，PostgreSQL 还支持使用各种过程语言（例如 PL/pgSQL、C、PL/Tcl、PL/Python、PL/Perl、PL/Java 等 ）创建复杂的过程和函数，称为存储过程（Stored Procedure）和自定义函数（User-Defined Function）。存储过程支持许多过程元素，例如控制结构、循环和复杂的计算

**存储过程的好处：**

- 减少应用和数据库之间的网络传输
- 提高应用的性能。因为自定义函数和存储过程进行了预编译并存储在数据库服务器中
- 可重用性。存储过程和函数的功能可以被多个应用同时使用

**存储过程的缺点：**

- 导致软件开发缓慢，因为存储过程需要单独学习
- 不易进行版本管理和代码调试
- 不同数据库管理系统之间无法移植，语法存在较大的差异

PostgreSQL 默认支持的存储过程为PL/pgSQL

### PL/pgSQL结构

PL/pgSQL 是一种块状语言，因此存储过程和函数以代码块的形式进行组织；定义如下

```plsql
-- 所有的语句都使用分号（;）结束，END 之后的分号表示代码块结束

[ <<label>> ]   -- 可选的代码块标签，可用于退出语句或限定变量名称
[ DECLARE  -- 可选的声明部分，用于定义变量
    declarations ]
BEGIN	-- BEGIN 和 END 之间是代码主体，也就是主要的功能代码
    statements
END [ label ];
```

**简单示例**

```plsql
do $$      -- $$ 替换'
declare
 name text;  -- 定义了变量name，类型为text
begin 
 name := 'pl/pgsql';   -- 给变量赋值
 raise notice 'hello %!', name;   -- 输出通知信息
end $$;
```

以上为匿名代码块，使用do可以直接执行；

`raise notice`用于输出通知消息

`$$` 可以用于替换`'`，这样避免了代码块中使用引号需要转义

**嵌套子块**

PL/pgSQL 支持代码块的嵌套，被嵌套的代码块被称为子块（subblock），包含子块的代码块被称为外部块（subblock）；子块中可以定义与外部块重名的变量，而且在子块内拥有更高的优先级；示例如下：

```plsql
do $$
<< outerblock >>
declare
    quantity integer := 30;
begin
    raise notice 'quantity here is %', quantity;  -- prints 30
    quantity := 50;
    --
    -- 创建一个子块
    --
    declare
        quantity integer := 80;
    begin
        raise notice 'quantity here is %', quantity;  -- prints 80
        raise notice 'outer quantity here is %', outerblock.quantity;  -- prints 50
    end;

    raise notice 'quantity here is %', quantity;  -- prints 50
end;
$$;
```

### 变量与赋值

PL/pgSQL 支持定义变量和常量

**基本变量**

变量总是属于某个数据类型，变量的值可以在运行时被修改

变量声明：

```plsql
-- variable_name 是变量的名称
-- data_type 是变量的类型，可以是任何 SQL 数据类型
-- 指定了 NOT NULL，必须使用后面的表达式为变量指定初始值
-- DEFAULT 指定变量初始值
variable_name data_type [ NOT NULL ] [ { DEFAULT | := | = } expression ];
```

变量定义示例如下：

```plsql
user_id integer;
quantity numeric(5) DEFAULT 0;
url varchar := 'http://mysite.com';
```

**行变量**

基本的 SQL 数据类型之外，PL/pgSQL 还支持基于表的字段或行或者其他变量定义变量：

```plsql
-- myrow 是一个行类型的变量，可以存储查询语句返回的数据行（数据行的结构要和 tablename相同）
-- myfield 的数据类型取决于 tablename.columnname 字段的定义
-- amount 和 quantity 的类型一致

myrow tablename%ROWTYPE;
myfield tablename.columnname%TYPE;
amount quantity%TYPE;
```

**记录类型变量**

记录类型的变量没有预定义的结构，只有当变量被赋值时才确定，而且可以在运行时被改变；记录类型的变量可以用于任意查询语句或者 FOR 循环变量

```plsql
arow RECORD;
```

**变量别名**

```plsql
-- newname 和 oldname 代表了相同的对象
newname ALIAS FOR oldname;
```

**常量**

在定义变量时指定了 CONSTANT 关键字，意味着定义的是常量。常量的值需要在声明时初始化，并且不能修改

示例：

```plsql
-- 定义常量PI
do $$ 
declare
 PI constant numeric := 3.14159265;
 radius numeric;
begin 
 radius := 1.0;
 raise notice 'the area is %', PI * radius * radius;
end $$;
```

### 控制结构

**IF语句**

PL/pgSQL 提供了三种形式的 IF 语句

- IF … THEN … END IF
- IF … THEN … ELSE … END IF
- IF … THEN … ELSIF … THEN … ELSE … END IF

IF 语句定义：

```plsql
-- boolean-expression为真，执行Then后语句
IF boolean-expression THEN
 statements
END IF;
```

示例

```plsql
do $$ 
declare 
	a integer default 65;
begin
	if a>80 then
		raise notice '优秀';
	elsif a>60 then 
		raise notice '良好';
	else 
		raise notice '不及格';
	end if;
end; $$
-- 输出：良好
```

 **CASE 语句**

除了 IF 语句之外，PostgreSQL 还提供了 CASE 语句，同样可以根据不同的条件执行不同的分支语句。CASE 语句分为两种：简单 CASE 语句和搜索 CASE 语句。

简单 CASE 语句的结构如下：

```plsql
case search-expression
 when expression [, expression [ ... ]] then
 statements
 [ when expression [, expression [ ... ]] then
 statements  ... ]
 [ else statements ]
end case;
```

执行流程：首先，计算 search-expression 的值；然后依次和 WHEN 中的表达式进行等值比较；如果找到了相等的值，执行相应的 statements；后续的分支不再进行判断；如果没有匹配的值，执行 ELSE语句；如果此时没有 ELSE，将会抛出 CASE_NOT_FOUND 异常

示例：

```plsql
do $$ 
declare
	sorce integer := 65;
begin
	case
	when sorce >= 80 then
		raise notice '优秀';
	when (sorce >=60 and sorce < 80) then 
		raise notice '良好';
	else 
		raise notice '不及格';
	end case;
end; $$
```

**循环语句**

PostgreSQL 提供 4 种循环执行命令的语句：LOOP、WHILE、FOR 和 FOREACH 循环，以
及循环控制的 EXIT 和 CONTINUE 语句

exit 用于退出循环

```plsql
exit [ label ] [ when boolean-expression ];
```

continue 用于跳入下次循环

```plsql
continue [ label ] [ when boolean-expression ];
```



LOOP 用于定义一个无限循环语句：

```plsql
-- 一般需要使用 EXIT 或者 RETURN 语句退出循环
-- label 可以用于 EXIT 或者 CONTINUE 语句退出或者跳到执行的嵌套循环中
[ <<label>> ]
loop
 statements
end loop [ label ];
```

示例：

```plsql
do $$ 
declare 
	i integer:=0;
begin
	loop
		raise notice 'Loop: %', i;
		exit when i = 5;   -- 当 i=5 时退出循环
		i := i + 1;
	end loop;
end; $$
```



WHILE 循环的语法：

```plsql
[ <<label>> ]
WHILE boolean-expression LOOP
 statements
END LOOP [ label ];
```

示例：

```plsql
do $$ 
declare 
	i integer:=0;
begin
	while i <= 5 loop
		raise notice 'Loop: %', i;
		i := i + 1;
	end loop;
end; $$
```



FOR 循环可以用于遍历一个整数范围或者查询结果集，遍历整数范围的语法如下：

```plsql
[ <<label>> ]
for name in [ reverse ] expression .. expression [ by expression ] loop
 statements
end loop [ label ];
```

示例：

```plsql
-- 变量 i 不需要提前定义
-- 输出结果为 0 2 4
do $$ 
begin
	for i in 0..5 by 2 loop   -- 步长为2
		raise notice 'Loop: %', i;
	end loop;
end; $$
```

遍历查询结果集的 FOR 循环如下：

```plsql
[ <<label>> ]
for target in query loop
 statements
end loop [ label ];
```

示例：

```plsql
-- 注意这里的dept行变量需要提前定义
do $$ 
declare
	dept record;
begin
	for dept in (select * from sys_dept) loop
		raise notice 'Loop: %,%', dept.dept_id, dept.dept_name;
	end loop;
end; $$
```

### 游标

PL/pgSQL 游标允许封装一个查询，然后每次处理结果集中的一条记录

游标可以将大结果集拆分成许多小的记录，避免内存溢出

可以定义一个返回游标引用的函数，然后调用程序可以基于这个引用处理返回的结果集

**游标使用步骤**

1. 声明游标变量
2. 打开游标
3. 从游标中获取结果
4. 判断是否存在更多结果。如果存在，执行第 3 步；否则，执行第 5 步
5. 关闭游标

声明游标变量，游标变量总是`refcursor`类型

```plsql
-- scroll，那么游标可以反向滚动
-- no scroll，那么反向取的动作会被拒绝
-- 如果二者都没有被指定，那么能否进行反向取就取决于查询
-- 如果指定了arguments， 那么它是一个逗号分隔的name datatype对的列表， 它们定义在给定查询中要被参数值替换的名称
name [ [ no ] scroll ] cursor [ ( arguments ) ] for query;
```



**示例：**

```plsql
do $$ 
declare
	rec_code record;
	cur_code  cursor for select * from sys_code limit 200;
begin
	-- 打开游标
	open cur_code;
	loop
		-- 获取游标中下一行的记录
		fetch cur_code into rec_code;
		-- 没找到记录退出循环
		exit when  not found;
		raise notice 'Loop : % %' ,rec_code.code_label,rec_code.code_value;
	end loop;
	
	-- 关闭游标
	close cur_code;
end;$$
```

### 错误处理

**报告错误和信息**

PL/pgSQL 提供了 RAISE 语句，用于打印消息或者抛出错误：

```plsql
-- 不同的 level 代表了错误的不同严重级别，默认level为exception
--    包括：debug、log、notice、info、warning、exception
-- format 是一个用于提供信息内容的字符串
--    可以使用%占位符，接收参数，%% 表示输出 % 本身
raise level format;
```

示例：

```plsql
do $$ 
begin 
 raise debug 'This is a debug text.';
 raise info 'This is an information.';
 raise log 'This is a log.';
 raise warning 'This is a warning at %', now();
 raise notice 'This is a notice %%';
end $$;
-- 并非所有的消息都会打印到客户端和服务器日志中
-- 可以通过配置参数 client_min_messages 和 log_min_messages 进行设置
```

**捕获异常**

默认情况下，PL/pgSQL 遇到错误时会终止代码执行，同时撤销事务。我们也可以在代码块中使用 exception捕获错误并继续事务

```plsql
[ <<label>> ]
[ declare
 declarations ]
begin
 statements
exception
 when condition [ or condition ... ] then handler_statements
 [ when condition [ or condition ... ] then handler_statements 
  ... ]
end;
```

示例：

```plsql
do $$ 
declare 
 i integer := 1;
begin 
 i := i / 0;
exception
 when division_by_zero then
 raise notice '除零错误！';
 when others then
 raise notice '其他错误！';
end $$;
```

### 自定义函数

使用create function创建自定义函数：

```plsql
-- create 表示创建函数
-- or replace 表示替换函数定义
-- name 是函数名；括号内是参数，多个参数使用逗号分隔
-- argmode 可以是 in（输入）、out（输出）、inout（输入输出）或者 variadic（数量可变），默认为 in
-- argname 是参数名称；argtype 是参数的类型;default_expr是参数的默认值
-- rettype 是返回数据的类型
-- as 后面是函数的定义，和上文中的匿名块相同
-- language 指定函数实现的语言，也可以是其他过程语言

create [ or replace ] function
 name ( [ [ argmode ] [ argname ] argtype [ { default | = } default_expr ] 
[, ...] ] )
 returns rettype
as $$
declare
 declarations
begin
 statements;
 ...
end; $$
language plpgsql;
```

示例：

```plsql
-- 新建函数
create or replace function get_count(creator_id integer)
returns integer 
as $$
declare
 ln_count integer;
begin
 select count(*) into ln_count
 from sys_code
where creator = cast(creator_id as varchar);
 return ln_count;
end; $$
language plpgsql

-- 调用函数
select get_count(1)

-- 删除函数
drop function get_count(integer);
```

PL/pgSQL 函数支持重载（Overloading），也就是相同的函数名具有不同的函数参数

### 存储过程

PostgreSQL 11 增加了存储过程，使用 create procedure语句创建：

```plsql
create [ or replace ] procedure
 name ( [ [ argmode ] [ argname ] argtype [ { default | = } default_expr ] 
[, ...] ] )
as $$
declare
 declarations
begin
 statements;
 ...
end; $$
language plpgsql;
```

存储过程的定义和函数主要的区别在于没有返回值，其他内容都类似；存储过程的调用使用`call语句`

示例：

```plsql
-- 新建存储过程
create or replace procedure update_emp(
 p_empid in integer,
 p_salary in numeric,
 p_phone in varchar)
as $$
begin
 update employees 
 set salary = p_salary,
 phone_number = p_phone
 where employee_id = p_empid;
end; $$
language plpgsql;

-- 调用存储过程
call update_emp(100, 25000, '515.123.4560')

-- 删除存储过程
drop procedure update_emp(integer,numeric,varchar);
```

**事务管理**

在存储过程内部，可以使用 COMMIT 或者 ROLLBACK 语句提交或者回滚事务

```plsql
-- 新建测试表
create table test(a int);

-- 创建存储过程
create procedure transaction_test() as $$
begin
 for i in 0..9 loop
 insert into test (a) values (i);
   if i % 2 = 0 then
     commit;
   else
     rollback;
   end if;
 end loop;
end
$$
language plpgsql;
 
-- 调用存储过程
call transaction_test();

-- 查看结果，只有偶数被存入了表中
select * from test;
 
-- 删除测试表
drop table test
```

## 触发器

### 概述

PostgreSQL 触发器（trigger）是一种特殊的函数，当某个数据变更事件（INSERT、UPDATE、DELETE 或者 TRUNCATE 语句）或者数据库事件（DDL 语句）发生时自动执行，而不是由用户或者应用程序进行调用

触发器分类：

- 数据变更触发器（DML 触发器）：基于某个表或者视图数据变更的触发器；

  支持两种级别的触发方式，`行级（row-level）触发器`和`语句级（statement-level）触发器`，两者的区别在于触发的时机和触发次数

- 事件触发器（DDL 触发器）：基于数据库事件的触发器

触发器可以在事件发生之前（BEFORE）或者之后（AFTER）触发。如果在事件之前触发，它可以跳过针对当前行的修改，甚至修改被更新或插入的数据；如果在事件之后触发，触发器可以获得所有的变更结果



### 管理触发器

**创建**

创建PostgreSQL触发器分为两步

1. 使用 CREATE FUNCTION 语句创建一个触发器函数

   ```plsql
   create [ or replace ] function trigger_function ()
    returns trigger
   as $$
   declare
    declarations
   begin
    statements;
    ...
   end; $$
   language plpgsql;
   ```

   触发器函数与普通函数的区别在于它没有参数，并且返回类型为 trigger

2. 使用 CREATE TRIGGER 语句将该函数与表进行关联

   ```plsql
   -- event 可以是 insert、update、delete 或者 truncate
   -- 触发器可以在事件之前（before）或者之后（after）触发
   -- instead of 只能用于替代视图上的 insert、update 或者 delete 操作
   -- for each row 表示行级触发器
   -- for each statement 表示语句级触发器
   -- when 用于指定一个额外的触发条件，满足条件才会真正支持触发器函数
   create trigger trigger_name 
   {before | after | instead of} {event [or ...]}
    on table_name
    [for [each] {row | statement}]
    [when ( condition ) ]
    execute function trigger_function;
   ```

在触发器函数的内部，系统自动创建了许多特殊的变量：

- NEW ：类型为 RECORD，代表了行级触发器 INSERT、UPDATE 操作之后的新数据行。对于 DELETE 操作或者语句级触发器而言，该变量为 null
- OLD：类型为 RECORD，代表了行级触发器 UPDATE、DELETE 操作之前的旧数据行。对于 INSERT 操作或者语句级触发器而言，该变量为 null
- TG_NAME：触发器的名称
- TG_WHEN：触发的时机，例如 BEFORE、AFTER 或者 INSTEAD OF
- TG_LEVEL：触发器的级别，ROW 或者 STATEMENT
- TG_OP：触发的操作，INSERT、UPDATE、DELETE 或者 TRUNCATE
- TG_RELID：触发器所在表的 oid
- TG_TABLE_NAME：触发器所在表的名称
- TG_TABLE_SCHEMA：触发器所在表的模式
- TG_NARGS：创建触发器时传递给触发器函数的参数个数
- TG_ARGV[]：创建触发器时传递给触发器函数的具体参数，下标从 0 开始。非法的下标（小于 0 或者大于等于 tg_nargs）将会返回空值

**修改**

postgreSQL提供了 alter trigger 语句，用于修改触发器

```plsql
-- 暂时只能修改触发器名称
alter trigger name on table_name rename to new_name;
```

**禁用**

默认创建的触发器处于启用状态；可以使用语句禁用或者启用某个触发器、某个表上的所有触发器或用户触发器（不包括内部生成的约束触发器）

```plsql
alter table table_name {enable | disable} trigger {trigger_name | all | user};
```

**删除**

删除触发器时，先删除触发器再删除触发器函数

```plsql
-- if exists 存在才删除，避免报错
-- cascade 表示级联删除依赖于该触发器的对象
-- restrict 表示如果存在依赖于该触发器的对象返回错误，默认为restrict
drop trigger [if exists] trigger_name on table_name [restrict | cascade];
```

**示例**

```plsql
-- 创建两张 test 表
create table test_a(a varchar(20),b varchar(20));
create table test_b(a varchar(20),b varchar(20));

-- 创建触发器函数，实现插入时将数据同样插入test_b表
create or replace function track_test() 
returns trigger as $$
begin
	if tg_op = 'INSERT'  then 
		insert into test_b values ( new.a,new.b);
	end if;
	return new;
end; $$
language plpgsql;

-- 创建触发器将触发器函数和表相关联，实现触发器函数track_test和表test_a关联，触发时机为增删改之前
create trigger trg_track_test
 before insert or update or delete
 on test_a
 for each row
 execute function track_test();
 
-- 测试，向test_a表插入数据，然后查看test_b表
insert into test_a values ('a','b');
select * from test_a;
select * from test_b;

-- 删除触发器、触发器函数
drop trigger if exists trg_track_test on test_a;
drop function if exists track_test;

-- 删除测试表
drop table test_a;
drop table test_b;
```



## 服务器配置

### 通过配置文件影响参数

设置这些参数最基本的方法是编辑`postgresql.conf`文件， 它通常被保存在数据目录中（当数据库集簇目录被初始化时，一个默认的拷贝将会被安装在那里

除`postgresql.conf`之外，PostgreSQL 数据目录还包含一个文件`postgresql.auto.conf`，它是自动编辑，保存了通过`ALTER SYSTEM`命令提供的设置。 `postgresql.auto.conf`中的设置会覆盖`postgresql.conf`中的设置



### 通过SQL影响参数

`ALTER SYSTEM`命令提供了一种改变全局默认值

`ALTER DATABASE`命令允许针对一个数据库覆盖其全局设置

`ALTER ROLE`命令允许用用户指定的值来覆盖全局设置和数据库设置

`SHOW`命令允许察看所有参数的当前值。对应的函数是 `current_setting(setting_name text)`

`SET`命令允许修改对于一个会话可以本地设置的参数的当前值， 它对其他会话没有影响。对应的函数是 `set_config(setting_name, new_value, is_local)`

