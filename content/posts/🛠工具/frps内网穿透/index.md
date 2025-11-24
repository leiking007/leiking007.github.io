---
title: "frps内网穿透"
date: 2023-07-15
lastmod: 2023-07-15
draft: false
tags: ['服务器']
categories: ["🛠工具"]
author: "lei"
---

# frps内网穿透

## 什么是FRP

Frp (Fast Reverse Proxy) 是比较流行的一款。FRP 是一个免费开源的用于内网穿透的反向代理应用，它支持 TCP、UDP 协议， 也为 http 和 https 协议提供了额外的支持。你可以粗略理解它是一个中转站， 帮你实现 公网 ←→ FRP(服务器) ←→ 内网 的连接，让内网里的设备也可以被公网访问到

而目前 FRP 还推出了“点对点穿透”的试验性功能，连接成功后可以让公网设备直接跟内网设备“点对点”传输，数据流不再经过 VPS 中转， 这样可以不受服务器带宽的限制，传输大文件会更快更稳定。当然，此功能并不能保证在你的网络环境 100% 可用，而且还要求访问端也得运行 FRP 客户端 (因此目前手机是无法实现的，只有电脑可以)。由于实现条件较多，所以有文件传输需求的朋友还是建议买带宽稍大一点的 VPS 会比较省心。

## 下载FRP

github 上下载 [/frp](https://github.com/fatedier/frp/releases)

服务端关注`frps`相关文件，客户端关注`frpc`相关文件

- frp_0.51.0_linux_amd64.tar


- frp_0.51.0_linux_arm64.tar


## 安装

**服务端安装**

- 解压下载后的文件 tar -zxvf frp_0.34.3_linux_amd64.tar.gz

- 进入目录，修改服务端配置文件 `frps.ini`

  ```ini
  [common]
  bind_port = 7000
  bind_addr = 0.0.0.0
  # token建议配置，客户端需要正确的token才能链接
  token = tl123456
  
  # 监控仪表盘，可不配置
  dashboard_port = 37500
  dashboard_user = admin
  dashboard_pwd = admin
  ```

- 指定配置文件运行

  ```bash
  [root@VM-0-6-centos frp_0.51.0_linux_amd64]# ./frps -c frps.ini
  2023/07/16 00:04:11 [I] [root.go:204] frps uses config file: frps.ini
  2023/07/16 00:04:11 [I] [service.go:206] frps tcp listen on 0.0.0.0:7000
  2023/07/16 00:04:11 [I] [service.go:318] Dashboard listen on 0.0.0.0:37500
  2023/07/16 00:04:11 [I] [root.go:213] frps started successfully
  ```

**客户端安装**

- 修改配置文件 `frpc.ini`

  ```ini
  [common]
  # 服务端地址
  server_addr = 139.155.239.250
  # 服务端端口
  server_port = 7000
  # 服务端 token
  token = tl123456
  
  # 配置相关端口映射
  [ssh]
  type = tcp
  local_ip = 127.0.0.1
  # 映射到本地的端口
  local_port = 22
  # 远程端口
  remote_port = 40022
  
  [postgresql]
  type = tcp
  local_ip = 127.0.0.1
  local_port = 5432
  remote_port = 45432
  ```

- 运行客户端 `./frpc -c frpc.ini`

  ```bash
  [root@raspi 17:05:39]$ ./frpc -c frpc.ini
  2023/07/15 17:07:06 [I] [root.go:220] start frpc service for config file [frpc.ini]
  2023/07/15 17:07:07 [I] [service.go:301] [c223d287b15cb81f] login to server success, get run id [c223d287b15cb81f]
  2023/07/15 17:07:07 [I] [proxy_manager.go:150] [c223d287b15cb81f] proxy added: [postgresql ssh]
  2023/07/15 17:07:07 [I] [control.go:172] [c223d287b15cb81f] [postgresql] start proxy success
  2023/07/15 17:07:07 [I] [control.go:172] [c223d287b15cb81f] [ssh] start proxy success
  ```

通过上述步骤，就已经实现了内网穿透
