---
title: "WSL子系统"
date: 2025-03-23
lastmod: 2025-03-23
draft: false
tags: ['服务器']
categories: ["🐧服务器运维"]
author: "lei"
---

# WSL子系统



## 常用命令

```cmd
dism.exe /online /enable-feature /featurename:Microsoft-Windows-Subsystem-Linux /all /norestart

dism.exe /online /enable-feature /featurename:VirtualMachinePlatform /all /norestart

wsl -l -v  # 列出所有已安装的 Linux 发行版

wsl  # 启动默认的 Linux 发行版

wsl -d <DistributionName>   # 启动指定的 Linux 发行版

wsl --set-default <DistributionName>  # 设置默认的 Linux 发行版

wsl --set-default-version 2  # 设置默认的 WSL 版本

wsl --update <DistributionName>  # 更新 Linux 发行版到 WSL 2

wsl --unregister <DistributionName>  # 卸载 Linux 发行版

wsl --update-kernel  # 更新 WSL 2 内核

wsl --export Ubuntu-24.04 D:\wsl\ubuntu24.tar  # 导出备份

wsl --import Ubuntu-24.04 D:\wsl\Ubuntu-24.04 D:\wsl\ubuntu24.tar  # 导入备份

wsl --shutdown  # 关闭所有 WSL 实例

wsl --shutdown <DistributionName>  # 关闭特定的 WSL 发行版

# 手动安装 
# 1.下载 https://learn.microsoft.com/zh-cn/windows/wsl/install-manual
# 2. Add-AppxPackage .\Ubuntu.appx
```

## 配置

### 域名

- 方式1：wsl子系统 dns 总是会默认通过请求变成 windows 的 dns ，配置 `/etc/resolv.conf`

  ```conf
  nameserver 223.5.5.5
  nameserver 223.6.6.6
  ```

- 方式2：使用 `.bashrc` , 添加下面命令

  ```shell
  export RESOLV_CONF="/etc/resolv.conf"
  alias set-dns='sudo echo "nameserver 223.5.5.5" > $RESOLV_CONF && sudo echo "nameserver 223.6.6.6" >> $RESOLV_CONF'
  ```

  然后命令行执行

  ```bash
  source ~/.bashrc  # 应用最新配置文件
  set-dns  # 修改/etc/resolv.conf文件，设置域名
  ```

### 系统代理

配置系统代理

```shell
export hostip=$(ip route | grep default | awk '{print $3}')
export hostport=10808
# add for proxy
alias set-proxy='
    export https_proxy="socks5://${hostip}:${hostport}";
    export http_proxy="socks5://${hostip}:${hostport}";
    export all_proxy="socks5://${hostip}:${hostport}";
    echo -e "Acquire::http::Proxy \"http://${hostip}:${hostport}\";" | sudo tee -a /etc/apt/apt.conf.d/proxy.conf > /dev/null;
    echo -e "Acquire::https::Proxy \"http://${hostip}:${hostport}\";" | sudo tee -a /etc/apt/apt.conf.d/proxy.conf > /dev/null;
'
alias un-proxy='
    unset https_proxy;
    unset http_proxy;
    unset all_proxy;
    sudo sed -i -e '/Acquire::http::Proxy/d' /etc/apt/apt.conf.d/proxy.conf;
    sudo sed -i -e '/Acquire::https::Proxy/d' /etc/apt/apt.conf.d/proxy.conf;
'
```

命令行执行

```bash
set-proxy # 开启代理
un-proxy  # 关闭代理
```

### docker代理

- 方式1: 直接新建或修改文件 `/etc/docker/daemon.json`

  ```json
  {
   "registry-mirrors": ["https://l2z6apov.mirror.aliyuncs.com"],   // 这个是阿里镜像
   "proxies": {
      "http-proxy": "socks5://172.17.208.1:10808",
      "https-proxy": "socks5://172.17.208.1:10808"
    }
  }
  ```

  重启服务

  ```bash
  systemctl daemon-reload
  systemctl restart docker
  ```

- 方式2: 使用 `.bashrc`, 添加下面内容

  ```bash
  # 变量hostip、hostport在前面系统代理时已经定义过了
  # export hostip=$(ip route | grep default | awk '{print $3}')
  # export hostport=10808
  alias set-docker-proxy='
          echo -e "{\"proxies\": {\"http-proxy\": \"socks5://${hostip}:${hostport}\", \"https-proxy\": \"socks5://${hostip}:${hostport}\" }}" | tee /etc/docker/daemon.json > /dev/null;
          systemctl daemon-reload;
          systemctl restart docker;
  '
  alias un-docker-proxy='
          echo -e "{}" | tee /etc/docker/daemon.json > /dev/null;
          systemctl daemon-reload;
          systemctl restart docker;
  '
  ```

  运行命令

  ```bash
  source ~/.bashrc  # 应用最新配置文件
  set-docker-proxy  # 设置docker代理，并重启docker
  un-docker-proxy  # 取消设置docker代理，并重启docker
  ```

  

## 压缩 WSL 的虚拟磁盘

1. **运行 `diskpart`**

   在命令提示符中输入以下命令并回车：

   ```bash
   diskpart
   ```

2. **选择虚拟磁盘文件**

   输入以下命令，指定你的 WSL 虚拟磁盘文件路径

   ```bash
   select vdisk file="D:\wsl\Ubuntu-24.04\ext4.vhdx"
   ```

   确保路径和文件名完全正确，否则会报错。

3. **压缩虚拟磁盘**

   输入以下命令以压缩虚拟磁盘：

   ```bash
   compact vdisk
   ```

   这个过程可能需要一些时间，具体取决于磁盘的大小和当前的使用情况。

4. **分离虚拟磁盘**

   输入以下命令将虚拟磁盘从当前会话中分离：

   ```bash
   detach vdisk
   ```

5. **退出 `diskpart`**

   输入以下命令退出 `diskpart`：

   ```bash
   exit
   ```
