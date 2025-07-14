---
title: "常用SQL"
date: 2022-03-17
lastmod: 2022-04-10 12:12:12
draft: false
tags: ['数据库']
categories: ["笔记"]
author: "lei"
---

# 常用SQL

## 查询

### 拼接SQL

```sql
SELECT CONCAT('update tb_2 set col1=',tb1.col1,' where col2=',tb1.col2,';') from tb_1 tb1 where ....
```

### 查询字符串出现次数

```sql
select id,LENGTH(string) - LENGTH(REPLACE(string, ",", "")) AS cnt from strings;
```

### 按名字最后两个单词排序

```sql
select first_name from employees  order by substring(first_name,-2)
```

### 分组并连接字段

```sql
SELECT
  dept_no, group_concat(distinct emp_no order by emp_no asc) employees
FROM dept_emp GROUP BY dept_no
```

### 查询除了最大最小值后的均值

```sql
select avg(salary) as avgt from salaries
where
  to_date = '9999-01-01' and salary not in 
  (select  max(salary) from
       
    where
      to_date = '9999-01-01'
  )
  and salary not in (
    select min(sala  where to_date = '9999-01-01'
  )
```



### 使用强制索引查询

```sql
select * from salaries
force index (idx_emp_no)
where emp_no=10005
```

### 使用with子句查询

```sql
#with tb as (select ....) select  

WITH TB_TEMP AS ( SELECT role_id FROM sys_user_role WHERE user_id = '1533428933922820096' ) SELECT sr.role_name 
FROM
	sys_role sr 
WHERE
	EXISTS ( SELECT 1 FROM TB_TEMP te WHERE te.role_id = sr.id )
```



## 创建

### 根据别的表数据新建表

```sql
#根据别的表的数据新建表，方法1，MySQL适用
create table if not exists actor_name as (
  select
    first_name,
    last_name
  from
    actor
)

#方法2
create table if not exists actor_name(
first_name  varchar(45)  not null,
last_name   varchar(45)  not null); -- 创建表
insert into actor_name select     first_name,last_name from actor; -- 插入查询结果
```

### 根据表创建视图

```sql
-- 创建视图，使用小括号创建视图中的字段名
create view actor_name_view (first_name_v, last_name_v) 
	as select first_name,last_name from actor;
	
-- 创建视图，在select后面对查询的列重命名作为视图字段名
create view actor_name_view 
	as select first_name as first_name_v,last_name as last_name_v from actor
```

### 构造触发器

```sql
-- mysql中触发器如下：
	-- trigger_name：标识触发器名称，用户自行指定
	-- trigger_time：标识触发时机，取值为 BEFORE 或 AFTER
	-- trigger_event：标识触发事件，取值为 INSERT、UPDATE 或 DELETE
	-- tbl_name：标识建立触发器的表名，即在哪张表上建立触发器
	-- trigger_stmt：触发器程序体，可以是一句SQL语句，或者用 BEGIN 和 END 包含的多条语句，每条语句结束要分号结尾
CREATE TRIGGER trigger_name
	trigger_time trigger_event ON tbl_name
	FOR EACH ROW trigger_stmt

-- 具体创建触发器语句；其中 new表示触发器的所在表新数据，old表示触发器的所在表老数据
create trigger audit_log 
after insert on employees_test
for each row
begin 
    insert into audit values(new.id,new.name);
end
```



## 修改

### 修改表名

```sql
-- 修改表名；ALTER TABLE 表名 RENAME TO/AS 新表名

ALTER TABLE titles_test RENAME TO titles_2017;
```

### 更新记录

```sql
-- 直接更新
update titles_test set to_date=null,from_date='2001-01-01'

-- 替换
UPDATE titles_test SET emp_no = REPLACE(emp_no, 10001, 10005) WHERE id = 5
```



### 创建索引

```sql
-- 主键；该语句添加一个主键，这意味着索引值必须是唯一的，且不能为NULL
ALTER TABLE tbl_name ADD PRIMARY KEY (col_list);

-- 唯一索引；这条语句创建索引的值必须是唯一的
ALTER TABLE tbl_name ADD UNIQUE index_name (col_list);

-- 普通索引；添加普通索引，索引值可出现多次
ALTER TABLE tbl_name ADD INDEX index_name (col_list);

-- 全文索引；该语句指定了索引为 FULLTEXT ，用于全文索引
ALTER TABLE tbl_name ADD FULLTEXT index_name (col_list);
```

### 创建外键约束

```sql
-- ALTER TABLE <表名> ADD CONSTRAINT FOREIGN KEY (<列名>) REFERENCES <关联表>(关联列)

ALTER TABLE
  audit
ADD
  CONSTRAINT FOREIGN KEY (emp_no) REFERENCES employees_test(id);
```



### 新增列

```sql
-- ALTER TABLE <表名> ADD COLUMN <新字段名> <数据类型> [约束条件] [FIRST|AFTER 已存在的字段名];
alter table actor
	add column create_date datetime not null default '2020-10-01 00:00:00' 		after last_update;
```

### 删除重复记录

```sql
-- 需要把记录先展示出来并重命名，然后删除
DELETE FROM titles_test WHERE
  id NOT IN ( SELECT * FROM
		(SELECT MIN(id) FROM titles_test GROUP BY emp_no) a -- 分组查询出id最小的
  );
```



