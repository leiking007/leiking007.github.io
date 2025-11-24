---
title: "Python离线部署"
date: 2025-04-25
lastmod: 2025-04-25
draft: false
tags: ['Python']
categories: ["🐧服务器运维"]
author: "lei"
summary: "介绍 Python 项目两种离线部署方式：基于 Docker 构建镜像（含依赖）并导出导入，以及通过虚拟环境和离线包安装依赖，适用于无网络环境。"
---

# Python离线部署


> 前提：服务已经在可以linux上正常运行

## 方式一：docker

> 注意：因为代码里面包含模型文件等，非常的大，因此这里docker构建仅仅构建了代码运行所需要的python环境和依赖包；然后通过docker的数据卷方式将代码挂载到容器内。
>
> 可以根据需要稍微更改下dockerfile，将代码也打包到容器中

1. 项目根目录运行

   ```bash
   pip freeze > requirements.txt   # 导出当前项目所有依赖文件
   ```

2. 下载离线包（**可选**），注意如果使用离线pip依赖包构建，需要保证当前linux系统和构建的基础镜像一致

   ```bash
   # 根据`requirements.txt`下载离线依赖包到项目根目录package文件夹下
   pip download -r requirements.txt -d ./packages
   ```

   更改Dockerfile，注释掉 在线安装所有依赖，取消注释 离线安装所有依赖

   ```dockerfile
   # 离线安装所有依赖
   RUN pip3 install --no-index --find-links=/app/packages -r requirements.txt
   
   # 在线安装所有依赖
   # RUN pip3 install -i https://mirrors.ustc.edu.cn/pypi/simple -r requirements.txt
   ```

3. 构建

   ```bash
   # 运行命令构建镜像
   # --progress=plain 是打印详细信息
   docker build --progress=plain -t yh-facenet:1.0 .
   ```

4. 使用docker命令启动测试

   ```bash
   # 启动
   # 注意：必须挂在数据卷，且数据卷中放 python 代码
   # -p 宿主机端口:容器暴露端口
   # -v 宿主机卷:容器卷
   docker run -p 8000:8000 -v /data/soft/minepy/yh-facenet:/app yh-facenet:1.0
   ```

5. 导出镜像，导入镜像

   ```bash
   # 导出docker镜像
   docker save -o yh-facenet.tar yh-facenet:1.0
   
   # 导入docker镜像
   docker load -i yh-facenet.tar
   
   # 启动镜像
   docker run --name -d -p 主机:容器 -v 主机:容器 --restart=always  yh-facenet:1.0
   ```

**Dockerfile**

```dockerfile
# 构建阶段
FROM python:3.10.17-bookworm AS builder

# 更换源
RUN sed -i 's/deb.debian.org/mirrors.ustc.edu.cn/g' /etc/apt/sources.list.d/debian.sources

# 更新包列表并安装构建依赖
RUN apt-get update \
    && apt-get install -y --no-install-recommends gcc g++ libc-dev libffi-dev libgmp-dev libmpfr-dev libmpc-dev \
    && rm -rf /var/lib/apt/lists/*

# 设置工作目录
WORKDIR /app

# 复制requirements
COPY requirements.txt .

# 复制离线依赖包
COPY packages ./packages

# 升级 pip
RUN pip install -i https://mirrors.ustc.edu.cn/pypi/simple --upgrade pip

# 离线安装所有依赖
RUN pip3 install --no-index --find-links=/app/packages -r requirements.txt

# 在线安装所有依赖
# RUN pip3 install -i https://mirrors.ustc.edu.cn/pypi/simple -r requirements.txt

# 运行阶段
FROM python:3.10.17-slim-bookworm

LABEL maintainer="tanglei <tanglei@qq.com>"

# 更换源
RUN sed -i 's/deb.debian.org/mirrors.ustc.edu.cn/g' /etc/apt/sources.list.d/debian.sources

# 安装运行时依赖
RUN apt-get update \
    && apt-get install -y --no-install-recommends libgl1 libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

# 设置工作目录
WORKDIR /app

# 从构建阶段复制依赖和应用代码
COPY --from=builder /usr/local/lib/python3.10/site-packages /usr/local/lib/python3.10/site-packages

# 指定启动命令
CMD ["python", "main.py"]

# 暴露端口
EXPOSE 8000
```

## 方式二：虚拟环境

1. 项目根目录运行

   ```bash
   pip freeze > requirements.txt   # 导出当前项目所有依赖文件
   ```

2. 根据`requirements.txt`下载离线依赖包到项目根目录package文件夹下

   ```bash
   pip download -r requirements.txt -d ./packages
   ```

3. 使用压缩包打包项目文件

   ```bash
   tar -zcvf yh-facenet.tar.gz yh-facenet/
   ```

4. 将`yh-facenet.tar.gz`文件传到服务器上

5. 解压

   ```bash
   tar -zxvf yh-facenet.tar.gz
   ```

6. 创建虚拟环境，并安装依赖

   ```bash
   # 创建虚拟环境，conda或venv都行
   python -m venv .venv
   
   # 根据requirements.txt离线安装依赖
   pip install --no-index --find-links=./packages -r requirements.txt
   ```

> 注意：
>
> 1. 打包 linux 系统和服务器linux系统尽量保持一致
> 2. python需要保持一致