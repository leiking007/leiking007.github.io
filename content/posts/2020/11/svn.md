---
title: "SVN"
description: ""
date: 2020-11-07
lastmod: 2020-11-07 12:12:12
categories: ["其他"]
tags: ["版本控制"]
author: "lei"
draft: false
---

# SVN

## 简介

1. SVN是Apache下的版本控制系统，可以回滚之前记录，共享文件等
2. SVN系统有一个SVN服务器，里面有SVN仓库

**体系结构**

1. 客户层；图形界面操作，命令行操作
2. 服务层；提供访问SVN仓库的三种方式：通过http与appache，通过SVN与SVNserve，通过file访问
3. 仓库层；FSFS文件方式存储文件（默认），Berkley DB方式存储文件

## 常用命令

> SVN管理员命令

```bash
SVNadmin help  		#查看SVN管理员命令列表
SVNadmin help create 	#查看创建SVN仓库命令
SVNadmin --version		#查看版本号
SVNadmin create		#创建SVN版本仓库，根仓库

```

> 服务端命令

```bash
SVNserve help		#查看服务端命令列表
SVNserve -d		#开启DOS系统下的SVN服务（一个守护线程，监听3690端口）
SVNserve -d --listen-port=8888		#指定SVN服务监听的端口
SVNserve -d --listen-port=8888 -r d:/SVN/repository	#指定默认的SVN顶层仓库路径，此时客户端直接访问时，直接给出根仓库名就可

```

>SVN客户端命令

```bash
SVN://localhost:8888/d:/SVN/repository/sms		#访问SVN仓库（SVN服务端未指定顶层仓库时，不安全）
SVN checkout SVN://localhost F:/SVN/group/aa		#检出,指定目录官方称为：working copy
SVN add readme.txt		#添加readme.tx到SVN管理,readme.txt必须在working copy目录
SVN commit -m "日志"		#working copy中所有对文件的操作提交到SVN服务器
SVN update readme.txt		#更新，working copy中readme.txt和服务端保持一致
SVN delete readme.txt		#删除readme.txt，提交后删除服务端
SVN revert readme.txt		#恢复执行了delete但未提交commit的readme.txt
SVN list		#列出当前working copy所包含的所有文件或目录
SVN info		#列出SVN客户端与SVN服务端的相关信息
SVN help		#获取SVN命令帮助信息，可以查看SVN所有命令
```

## tortoiseSVN

> 下载安装：
>
> 1. apache官网下载，tortoiseSVN客户端，语言包

>客户端相关操作
>
>1. 客户端检出：在文件夹上单击右键，有checkout检出选项
>2. 客户端更新：在working copy空白处，单击右键，更新
>3. 客户端导入：在文件夹单击右键，选择tortoiseSVN-->导入，即可将文**件夹中内容**导入到SVN服务器
>4. 客户端导出：注意，与导入类似，在哪个目录导入，只会导出该目录中内容，而目录本身不会导出，一般是项目完成后
>5. 客户端添加：在需要添加的文件或文件夹单击右键，tortoiseSVN-->添加
>6. 客户端删除：delete
>7. 客户端恢复：revert
>8. 返回到指定版本：update revert
>9. .......等，一系列操作都是单击右键

## SVN冲突

> 冲突问题

1. 同行冲突，需要手动处理冲突；先更新，然后进行处理，标记冲突处理完成(mark as merged)，提交
2. 异行冲突，直接合并；先更新

> 异行修改冲突

1. 两个客户端对同一版本同一个文件进行修改（添加，修改，删除），只要修改的不是同一行数据内容，称为异行修改冲突
2. 由于不同客户端修改的行是不相同，SVN给出了比较简单的处理方式，将修改进行合并，大家修改都起作用
3. 内容会自动合并，不需要手动

> 同行修改冲突

1. 两个客户端对同一版本同一个文件进行修改，且修改的数据是同一行
2. SVN此时无法取舍，只能人工进行冲突内容的选择，即人工完成取舍
3. 在冲突的文件上单击右键，选择 edit conficts进行冲突管理（白颜色，无冲突内容）

> 文件锁,可以解决冲突

1. 加锁：客户端用户，单击右键加锁；tortoiseSVN--->属性
2. 获取锁：另一个用户可以获取文件，但是如果要修改提交，必须拿到锁
3. 删除锁

## 为用户添加权限

1. SVN服务端具体根仓库conf文件夹里面进行配置

   1. 给匿名用户取消权限，认证用户设置权限
   2. paawd密码文件注册
   3. 权限文件注册
   4. 指定要应用的根仓库：realm=仓库名

2. passwd密码文件

   ```properties
   #添加三个用户，并设置密码
   aa=123456
   bb=123456
   cc=123456
   ```

3. 权限注册文件

   ```properties
   #组
   leaders=aa
   man=bb,cc
   #权限取值只有rw空；且后配置的权限优先级高于前面配置权限
   [/]
   aa=rw #允许独写
   bb=rw #允许独写
   cc=rw #允许独写
   *=    #其他用户全部禁止
   [/com]
   @leaders=rw
   @man=rw
   ```
