---
title: "常用软件配置"
date: 2021-11-01
lastmod: 2021-11-11 12:12:12
draft: false
tags: ['配置']
categories: ["💡随笔与思考"]
author: "lei"
---

# 常用软件配置

## Node

### nvm安装

nvm是一个node版本管理工具

1. https://github.com/coreybutler/nvm-windows  下载nvm，这里下载的是非安装版（nvm-noinstall.zip）

2. 解压到指定目录

3. 新建环境变量 NVM_HOME、NVM_SYMLINK

   ```bash
   NVM_HOME
   F:\study\environment\node\nvm1.1.11 (nvm安装目录)
   
   NVM_SYMLINK
   F:\study\environment\node\nodejs (nodejs使用目录，链接)
   ```

4. 将环境变量 NVM_HOME、NVM_SYMLINK 加入到`PATH`

   ```bash
   PATH
       %NVM_SYMLINK%
       %NVM_HOME%
   ```

5. 配置 nvm 安装目录下的`settings.txt`文件

   ```properties
   root: F:\study\environment\node\nvm1.1.11
   path: F:\study\environment\node\nodejs
   node_mirror: https://npm.taobao.org/mirrors/node/
   npm_mirror: https://npm.taobao.org/mirrors/npm/
   ```

6. 命令行测试

   ```bash
   nvm version   ## 查看nvm版本
   
   nvm list available   ## 查看可安装的 node 版本
   
   nvm list  ## 查看已经安装的node版本
   
   nvm install 18.16.0  ## 安装指定版本的node
   
   nvm use 18.16.0  ## 切换/使用指定版本的node
   ```


### npm配置

```bash
#配置仓库
npm config set registry https://repo.huaweicloud.com/repository/npm/
npm cache clean -f

#配置npm安装脚本位置
npm config set prefix "D:\nodejs\node_global"
npm config set cache "D:\nodejs\node_cache"

#查看npm全局安装目录、仓库地址
npm config ls
npm config ls -l

#配置修改后，将node_global目录加入path环境变量
```

## Python

### pip换源

```cmd
pip config set global.index-url https://mirrors.huaweicloud.com/repository/pypi/simple
pip config set global.trusted-host mirrors.huaweicloud.com
pip config set global.timeout 120
```

