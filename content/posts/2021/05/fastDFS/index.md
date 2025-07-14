---
title: "FastDFS"
date: 2021-05-14
lastmod: 2021-05-24
draft: false
tags: ['服务器']
categories: ["其他"]
author: "lei"
---

# FastDFS


## FastDFS入门

FastDFS 是一个`开源的轻量级分布式文件系统`

FastDFS服务端由两个部分组成：跟踪器（tracker）、存储节点（storage）

- 跟踪器：主要是调度工作，在内存中记录存储节点(storage)的状态信息，是前端 Client 和后端存储节点 storage 的枢纽。Tracker server的性能非常高，一个大的集群（上百个group）中有3台就足够了
- 存储节点：用于存储文件，包括文件和文件属性(meta data) 都保存到存储服务器磁盘上，完成文件管理的所有功能：文件存储、文件同步和提供文件访问

> 安装

1. 检查机器是否包含如下依赖：gcc、libevent、libevent-devel

   ```bash
   #安装 gcc、libevent、libevent-devel
   yum install gcc libevent libevent-devel -y
   ```

2. github地址：`https://github.com/happyfish100`，下载安装：`libfastcommon库`、`FastDFS-master`

   ```bash
   #解压libfastcommon库、FastDFS-master
   unzip libfastcommon-master.zip
   unzip FastDFS-master.zip
   
   #进入相应的目录编译安装
   ./make.sh
   ./make.sh install
   ```

3. 查看安装文件

   ```bash
   #进入 /usr/bin，查看fdfs相关命令
   ll | grep fdfs
   
   #进入 /etc/fdfs，查看fdfs相关配置文件
   ll
   -rw-r--r-- 1 root root  1909 Aug 15 19:52 client.conf   #客户端配置
   -rw-r--r-- 1 root root 10246 Aug 15 19:52 storage.conf   #存储节点配置
   -rw-r--r-- 1 root root   620 Aug 15 19:52 storage_ids.conf   #存储节点id
   -rw-r--r-- 1 root root  9138 Aug 15 19:52 tracker.conf   #跟踪器配置
   ```

4. 拷贝`FastDFS-master/conf`目录下的`http.conf`、 `mime.types`到配置目录 `/etc/fdfs`

   ```bash
   cp http.conf /etc/fdfs/
   cp mime.types /etc/fdfs/
   ```

> 启动

1. 修改必要配置：日志、文件存放位置，并手动创建相应的存放目录

   ```bash
   #备份配置文件
   cp tracker.conf tracker.conf.bak
   cp storage.conf storage.conf.bak
   
   #修改tracker.conf配置文件中，store和log存放位置
   # the base path to store data and log files
   base_path = /opt/FastDFS/tracker
   
   #修改storage.conf配置文件中，sotre和log存放位置、file存放位置、tracerIp
   # the base path to store data and log files
   base_path = /opt/FastDFS/storeage
   # store_path#, based on 0, to configure the store paths to store files
   store_path0 = /opt/FastDFS/storeage/files
   # tracker_server can ocur more than once for multi tracker servers.
   tracker_server = 127.0.0.1:22122
   ```

2. 使用命令启动`跟踪器`、`存储节点`

   ```bash
   #启动 跟踪器
   fdfs_trackerd /etc/fdfs/tracker.conf start
   
   #启动 存储节点
   fdfs_storaged /etc/fdfs/storage.conf start
   
   #查看启动
   ps -ef | grep fdfs
   root        10     1  0 21:19 ?        00:00:00 fdfs_trackerd tracker.conf start
   
   #发现存储节点启动没成功，查看logs
   $cat opt/fdfs/storage/logs/storaged.log
   [2021-08-15 21:26:04] ERROR - file: fdfs_shared_func.c, line: 474, host "127.0.0.1" is invalid, error in              fo: Unknown host
   [2021-08-15 21:26:04] CRIT - exit abnormally!
   
   #发现tracerIp配置错误，修改后重新启动，并查看启动情况
   $ps -ef | grep fdfs
   root        10     1  0 21:19 ?        00:00:00 fdfs_trackerd /etc/fdfs/tracker.conf start
   root      5122     1 30 21:32 ?        00:00:13 fdfs_storaged /etc/fdfs/storage.conf start
   ```

   

3. 服务关闭

   ```bash
   #关闭跟踪器
   fdfs_trackerd /etc/fdfs/tracker.conf stop
   
   #关闭存储节点
   fdfs_storaged /etc/fdfs/storage.conf stop
   ```

## FastDFS测试

1. 测试时需要配置`client.conf`文件中的 `traverIp`和`base_path`

   ```ini
   # the base path to store log files
   base_path = /opt/FastDFS/client
   
   # tracker_server can ocur more than once for multi tracker servers.
   tracker_server = 192.168.45.12:22122
   ```

2. 测试上传

   ```bash
   #上传
   fdfs_test /etc/fdfs/client.conf upload 1.txt
   #group_name 组名   remote_filename M00/:配置的path，00/00/：磁盘路径，wKgtDGE...：文件名
   group_name=group1, remote_filename=M00/00/00/wKgtDGEZI7uAMqbkAAAACpEbkw40686912
   
   #查看上传文件
   ll /opt/FastDFS/storeage/files/data/00/00/
   wKgtDGEZI7uAMqbkAAAACpEbkw406869121.txt		#上传的文件
   wKgtDGEZI7uAMqbkAAAACpEbkw406869121.txt-m	#上传的文件属性
   wKgtDGEZI7uAMqbkAAAACpEbkw40686912_big1.txt	#上传的文件备份
   wKgtDGEZI7uAMqbkAAAACpEbkw40686912_big1.txt-m
   ```

3. 测试下载

   ```bash
   fdfs_test /etc/fdfs/client.conf download group1 M00/00/00/wKgtDGEZI7uAMqbkAAAACpEbkw40686912.txt
   ```

4. 测试删除

   ```bash
   fdfs_test /etc/fdfs/client.conf delete group1 M00/00/00/wKgtDGEZI7uAMqbkAAAACpEbkw40686912.txt_big
   ```

## 分布式文件系统http访问

nginx的FastDFS扩展模块整合

1. FastDFS github下载`FastDFS-nginx-module-master`，并解压

   ```bash
   unzip FastDFS-nginx-module-master.zip
   ```

2. 安装nginx，添加 `FastDFS` 模块

   ```bash
   tar -zxvf nginx-1.20.1.tar.gz
   
   cd nginx-1.20.1/
   
   #debain系列下可能需要安装先运行如下命令安装依赖
   apt-get install libpcre3 libpcre3-dev 
   
   ./configure --prefix=/etc/nginx-fdfs --sbin-path=/usr/bin/nginx-fdfs --add-module=/root/FastDFS-nginx-module-master/src/
   
   make
   
   make install
   ```

3. 配置模块

   ```ini
   #将模块配置文件拷贝到 fdfs 配置目录下
   cp FastDFS-nginx-module-master/src/mod_FastDFS.conf /etc/fdfs/
   
   #修改配置文件，基础目录（该目录必须已存在）、url带组名访问、跟踪器
   # the base path to store log files
   base_path=/opt/FastDFS/FastDFS_mod
   # if the url / uri including the group name
   url_have_group_name = true
   # FastDFS tracker_server can ocur more than once, and tracker_server
   tracker_server=192.168.45.12:22122
   # store_path must same as storage.conf
   store_path0=/opt/FastDFS/storeage/files
   ```

4. 配置nginx

   ```ini
   #拦截请求文件的路径，并使用FastDFS的nginx模块进行转发
   location ~/group[1-9]/M0[0-9]{
   	ngx_FastDFS_module;
   }
   ```

5. 启动nginx

   ```bash
   #检测配置文件是否正确
   nginx-fdfs -c /etc/nginx-fdfs/conf/nginx.conf -t
   
   #指定配置文件启动
   nginx-fdfs -c /etc/nginx-fdfs/conf/nginx.conf
   
   #查看启动状态
   ps -ef | grep nginx
   ```

6. 浏览器访问：`http://127.0.0.1/group1/M00/00/00/wKgtDGEZI7uAMqbkAAAACpEbkw40686912`

> 扩展模块执行流程

![image-20210815225946104](index.assets/image-20210815225946104.png ':size=600*300')



## FastDFS在java中使用

1. 下载`happyfish100/FastDFS-client-java` java 操作 FastDFS 源代码

2. `FastDFS-client-java`是一个普通的maven项目，使用 `maven install` 安装到本地仓库

3. 创建普通的 maven 项目，添加依赖

   ```xml
   <!-- 该依赖为刚刚maven安装的 -->
   <dependency>
       <groupId>org.csource</groupId>
       <artifactId>FastDFS-client-java</artifactId>
       <version>1.29-SNAPSHOT</version>
   </dependency>
   ```

4. 创建配置文件，FastDFS.properties

   ```properties
   FastDFS.tracker_servers = 192.168.45.185:22122,192.168.10.130:22122
   FastDFS.connection_pool.enabled = true
   FastDFS.connection_pool.max_count_per_entry = 500
   FastDFS.connection_pool.max_idle_time = 3600
   FastDFS.connection_pool.max_wait_time_in_ms = 1000
   ```

5. 创建 `FastDFSUtil` 工具类

   ```java
   public class FastDFSUtil {
       private static TrackerServer trackerServer=null;  //tracker 服务器对象
       private static StorageServer storageServer=null;  //storage 服务器对象
       private static TrackerClient trackerClient=null;  //tracker 客户端对象
       private static StorageClient storageClient=null;  //storage 客户端对象
       private FastDFSUtil(){};
       static {
           try {
               // 加载Properties配置文件
               ClientGlobal.initByProperties("FastDFS.properties"); 
               trackerClient=new TrackerClient();
               trackerServer=trackerClient.getTrackerServer();
               storageServer=trackerClient.getStoreStorage(trackerServer);
               storageClient=new StorageClient(trackerServer,storageServer);
           } catch (IOException e) {
               e.printStackTrace();
           } catch (MyException e) {
               e.printStackTrace();
           }
       }
   
       /**
        * 适合上传本地图片，web上传，可以使用 uploadFile 重载方法，上传byte数组
        * @param localFilename 本地文件名
        * @param extName 文件扩展名
        * @param metas 文件属性
        * @return {@link String[]}  返回文件存储在 FastDFS 中信息，很重要
        */
       public static String[] uploadFile(String localFilename, String extName, NameValuePair[] metas) throws Exception {
           return storageClient.upload_file(localFilename,extName,metas);
       }
   
       /**
        * 直接下载文件到本地，web程序可以使用download_file的重载方法，可以返回byte数组
        * @param groupName  在fdfs服务器中存储的组，文件上传时会返回
        * @param remoteName 在fdfs服务器中存储的具体位置，文件上传时会返回
        * @param localName  下载到本地存储的名称
        * @return int 返回0，代表下载成功
        */
       public static int downloadFile(String groupName,String remoteName,String localName) throws Exception {
           return storageClient.download_file(groupName,remoteName,localName);
       }
   
       /**
        * 文件删除
        * @param groupName 在fdfs服务器中存储的组，文件上传时会返回
        * @param remoteName 在fdfs服务器中存储的具体位置，文件上传时会返回
        * @return int 返回0代表删除成功
        * @throws Exception
        */
       public static int delFile(String groupName,String remoteName) throws Exception {
           return storageClient.delete_file(groupName,remoteName);
       }
   }
   ```

6. 创建测试Demo

   ```java
   public static void main(String[] args) throws Exception{
           //上传
       String[] result=FastDFSUtil.uploadFile("E:\\123.jpg","jpg",null);
       Arrays.stream(result).forEach(System.out::println);
       // result值为：["group1","M00/00/00/wKgtuWEhM7WAG15kAAYIjBrlJRI160.jpg"]
   
       String group="group1";
       String remote="M00/00/00/wKgtuWEhM7WAG15kAAYIjBrlJRI160.jpg";
   
       //下载
       FastDFSUtil.downloadFile(group, remote, "e:\\1.jpg");
   
       //删除
       FastDFSUtil.delFile(group,remote);
   }
   ```

> 注意：
>
> 需要将文件上传后返回的 String 数组保存好（一般存在数据库），它包含了上传文件在 FastDFS 服务器中存储的相关信息

## FastDFS在web中使用

1. 添加依赖，`fileupload`和`FastDFS`

   ```xml
   <dependency>
       <groupId>commons-fileupload</groupId>
       <artifactId>commons-fileupload</artifactId>
       <version>1.3.3</version>
   </dependency>
   <dependency>
       <groupId>org.csource</groupId>
       <artifactId>FastDFS-client-java</artifactId>
       <version>1.29-SNAPSHOT</version>
   </dependency>
   ```

2. 注册 `StorageClient` bean

   ```java
   @Bean
   public StorageClient storageClient() throws MyException, IOException {
       ClientGlobal.initByProperties("FastDFS.properties");
       TrackerClient trackerClient=new TrackerClient();
       TrackerServer trackerServer=trackerClient.getTrackerServer();
       StorageServer storageServer=trackerClient.getStoreStorage(trackerServer);
       StorageClient storageClient=new StorageClient(trackerServer,storageServer);
       return storageClient;
   }
   ```

3. 编写`文件上传控制器`

   ```java
   @RestController
   @RequestMapping("/file")
   public class FileController {
   
       @Autowired
       private StorageClient client;
   
       @PostMapping("/upload")
       public Object upload(@RequestParam("files") MultipartFile[] files, ) throws Exception {
           if (files==null||files.length==0){
               return ResponWrapper.setSuccess(false);
           }
           MultipartFile file=files[0];
           String fileName=file.getOriginalFilename();
           int extIndex=fileName.lastIndexOf(".")+1;
           String fileExtName="";
           if (extIndex!=0){
               fileExtName=fileName.substring(extIndex);
           }
           String[] result=client.upload_file(file.getBytes(),fileExtName,null);
           if (result.length!=2){
               return ResponWrapper.setSuccess(false);
           }
           FileDto fileDto=new FileDto();
           fileDto.setGroupName(result[0]);
           fileDto.setRemoteName(result[1]);
           return ResponWrapper.setSuccess(true);
       }
   
       @RequestMapping("/download")
       public void download(String id, HttpServletResponse response) throws Exception {
           FileDto fileDto=fileService.selectById(id);
           byte[] bytes=client.download_file(fileDto.getGroupName(),fileDto.getRemoteName());
           response.reset(); //设置页面不缓存，清空buffer
           response.setCharacterEncoding("UTF-8");  //设置字符编码
           response.setContentType("multipart/form-data"); //设置二进制传输数据
           //  设置响应头
           response.setHeader("Content-Disposition", "attachment;fileName=" + fileDto.getId());
           response.getOutputStream().write(bytes);
           response.getOutputStream().flush();
       }
       @RequestMapping("/delete")
       public ResponWrapper delete(String fid,String uid) throws Exception {
           FileDto fileDto=fileService.selectById(fid);
           int res=client.delete_file(fileDto.getGroupName(),fileDto.getRemoteName());
           fileService.deleteById(uid,fid);
           return ResponWrapper.setSuccess(true);
       }
   }
   ```


## Spring文件上传大小配置

```properties
#springMVC允许上传单个文件最大大小
spring.servlet.multipart.max-file-size=1MB
#spring允许表单上传最大大小
spring.servlet.multipart.max-request-size=10MB
```

## FastDFS集群部署

![image-20211006035144414](index.assets/image-20211006035144414.png ':size=50%')

部署FastDFS集群，架构图如上，需准备7台服务器

其中 group1 有两台主机，group2 有两台主机；两台 tracker主机，需要安装 nginx，方便web访问；一台nginx主机，用作统一入口，并实现负载均衡

1. 安装linux虚拟机（7台）

2. 安装必要软件

   ```bash
   #lrzsz 为linux上传下载文件使用的工具
   #rz 上传
   #sz 下载
   yum install perl gcc libevent libevent-devel unzip lrzsz -y
   ```

3. 安装 tracker

   ```bash
   #安装fdfs公共库
   unzip libfastcommon-master.zip && cd ibfastcommon-master
   ./make.sh
   ./make.sh install
   
   #安装fdfs
   unzip FastDFS-master.zip && cd FastDFS-master
   ./make.sh
   ./make.sh install
   
   #拷贝必要配置文件
   cp FastDFS-master/conf/http.conf /etc/fdfs/
   cp FastDFS-master/conf/mime.types /etc/fdfs/
   
   #修改tracker配置文件
   base_path = /opt/FastDFS/tracker
   
   #启动tracker
   fdfs_trackerd /etc/fdfs/tracker.conf start
   
   #检查是否成功启动
   ps -ef | grep fdfs
   ```

   

4. 安装storage

   ```bash
   #安装fdfs公共库
   unzip libfastcommon-master.zip && cd ibfastcommon-master
   ./make.sh
   ./make.sh install
   
   #安装fdfs
   unzip FastDFS-master.zip && cd FastDFS-master
   ./make.sh
   ./make.sh install
   
   #拷贝必要配置文件
   cp FastDFS-master/conf/http.conf /etc/fdfs/
   cp FastDFS-master/conf/mime.types /etc/fdfs/
   
   #修改storage配置文件
   group_name = group1 / group_name = group2
   base_path = /opt/FastDFS/storeage
   store_path0 = /opt/FastDFS/storeage/files
   tracker_server = 192.168.10.129:22122
   tracker_server = 192.168.10.130:22122
   
   #启动storage
   fdfs_storaged /etc/fdfs/storage.conf start
   
   #检查是否成功启动
   ps -ef | grep fdfs
   ```

   

5. 关闭主机防火墙，修改tracker负载均衡策略，并使用java客户端测试程序

   ```bash
   #关闭防火墙
   systemctl status firewall	#查看防火墙状态
   systemctl stop firewalld	#关闭防火墙
   systemctl start firewalld	#启动防火墙
   systemctl stop firewalld	#重启防火墙
   
   #修改 tracker 配置文件负载策略
   # 0: round robin
   # 1: specify group
   # 2: load balance, select the max free space group to upload file
   store_lookup = 0
   
   #java客户端测试，tracker负载策略改为0时，此时tracker应轮流上传到两个group
   ```

   

6. 配置trcker 主机上的 nginx

   ```bash
   #单纯的为了负载均衡，配置如下
   #安装nginx
   tar -zxvf nginx-1.20.1.tar.gz & cd nginx-1.20.1/
   ./configure --prefix=/usr/local/nginx
   make
   make install
   
   #修改nginx配置文件
   upstream myweb {
       server 192.168.10.131:80;
       server 192.168.10.132:80;
       server 192.168.10.133:80;
       server 192.168.10.134:80;
   }
   location ~/group[1-9]/M0[0-9]{
   	proxy_pass http://myweb;
   }
   
   #启动，加-t参数，校验配置文件
   /usr/local/nginx/sbin/nginx -c /usr/local/nginx/conf/nginx.conf
   
   #检测是否启动成功
   ps -ef | grep nginx
   ```

7. 配置storage nginx

   ```bash
   #安装fdfs_nginx
   unzip FastDFS-nginx-module-master.zip
   tar -zxvf nginx-1.20.1.tar.gz & cd nginx-1.20.1/
   ./configure --prefix=/etc/nginx-fdfs --sbin-path=/usr/bin/nginx-fdfs --add-module=/root/FastDFS-nginx-module-master/src/
   make
   make install
   cp FastDFS-nginx-module-master/src/mod_FastDFS.conf /etc/fdfs/
   
   #配置mod_FastDFS.conf配置文件,group_name针对不同的当前storage所属的group配置
   base_path=/opt/FastDFS/FastDFS_mod
   group_name=group1	/ group_name=group2
   store_path0=/opt/FastDFS/storeage/files
   url_have_group_name = true
   tracker_server=192.168.10.130:22122
   tracker_server=192.168.10.129:22122
   group_count = 2
   [group1]
   group_name=group1
   storage_server_port=23000
   store_path_count=1
   store_path0=/opt/FastDFS/storeage/files
   [group2]
   group_name=group2
   storage_server_port=23000
   store_path_count=1
   store_path0=/opt/FastDFS/storeage/files
   
   #配置nginx配置文件
   location ~/group[1-9]/M0[0-9]{
   	ngx_FastDFS_module;
   }
   
   #启动，加-t参数，校验配置文件
   nginx-fdfs -c /etc/nginx-fdfs/conf/nginx.conf
   
   #检测是否启动成功
   ps -ef | grep nginx
   ```

   

8. 配置nginx负载均衡，统一入口

   ```bash
   #安装nginx
   #配置nginx配置文件
   upstream myweb {
       server 192.168.10.129:80;
       server 192.168.10.130:80;
   }
   location ~/group[1-9]/M0[0-9]{
   	proxy_pass http://myweb;
   }
   
   #启动nginx，并在浏览器访问
   /usr/local/nginx/sbin/nginx -c /usr/local/nginx/conf/nginx.conf
   
   #浏览器访问：http://192.168.10.128/group1/M00/00/00/wKgKhWFcpDSAH-LoAAPNBgx7Frs765.jpg
   #可以看到文件
   ```

9. 分析运行流程

    ```mermaid
    graph TD
    A[nginx] -->|1.携带地址负载访问带扩展模块的nginx|B[nginx_fdfs & storage]
        B --> |2.根据扩展模块携带地址访问Tracker|C[tracker]
        C --> |3.根据地址返回对应的Storage的ip|B
        B --> |4.根据tracker返回的IP地址找到对应的nginx_fdfs|B 
        B --> |5.返回文件流|A
    ```

  



