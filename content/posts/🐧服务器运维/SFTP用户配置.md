---
title: "SFTP用户配置"
date: 2026-06-29
lastmod: 2026-06-29
draft: false
tags: ['服务器']
categories: ["🐧服务器运维"]
author: "lei"
---

# SFTP用户配置

## 简介

SFTP（SSH File Transfer Protocol，安全文件传输协议）是一种基于 SSH（Secure Shell）协议的安全文件传输协议，主要用于在客户端与服务器之间提供加密的文件传输服务。它并非传统 FTP 协议的简单加密扩展，而是 SSH 软件包中的一个独立子系统。

## 注意事项

1. 如果有多个用户，可以用用户组进行统一管理；如果是每个用户单独管理，可不设置用户组
2. 新建用户时可以不设定家目录，后续ssh配置时直接设定指定目录
3. Chroot配置：开启后，可以将用户限制在某个目录；不配置：用户可以查看服务器上所有文件
4. Chroot权限强制规则：chroot 目录本身`属主：root，属组：root`；用户要上传 / 写入：**必须在 chroot 里面再建子目录**，把子目录给用户

## 用户配置

1. 新建用户组

   ```bash
   groupadd sftpgroup
   ```

2. 新建用户并设置密码

   ```bash
   # 新建用户，-M不设家目录
   useradd -M -G sftpgroup -s /usr/sbin/nologin BK102
   
   # 设置密码
   passwd BK102
   ```

3. 创建chroot目录，以及用户可操作的上传目录

   ```bash
   # 创建chroot目录，并设置属主属组（chroot目录权限校验如此）
   mkdir -p /srv/sftpDir
   chown root:root /srv/sftpDir
   chmod 755 /srv/sftpDir
   
   # 创建用户上传目录
   mkdir -p /srv/sftpDir/BK102
   chown BK102:BK102 /srv/sftpDir/BK102
   chmod 700 /srv/sftpDir/BK102
   ```

## ssh配置

可以配置组或者用户，根据情况选择

- 配置组

  ```ini
  Match Group sftpgroup
  	# 禁止 X11 转发
  	X11Forwarding no
  	# 禁止 TCP 转发
  	AllowTcpForwarding no
  	# 禁止分配 TTY
  	PermitTTY no
  	# 强制使用内部 SFTP 服务
  	ForceCommand internal-sftp
  	# 将用户锁定在其家目录中（可以直接指定目录）
  	ChrootDirectory /srv/sftpDir
  ```

- 配置用户

  ```ini
  Match user BK102
  	# 禁止 X11 转发
  	X11Forwarding no
  	# 禁止 TCP 转发
  	AllowTcpForwarding no
  	# 禁止分配 TTY
  	PermitTTY no
  	# 强制使用内部 SFTP 服务
  	ForceCommand internal-sftp
  	# 将用户锁定在其家目录中（可以直接指定目录）
  	ChrootDirectory /srv/sftpDir
  ```

