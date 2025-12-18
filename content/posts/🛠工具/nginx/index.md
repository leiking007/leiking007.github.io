---
title: "nginx"
date: 2021-05-14
lastmod: 2021-05-24 12:12:12
draft: false
tags: ['服务器']
categories: ["🛠工具"]
author: "lei"
---

# nginx

## 简介

基于`C语言`开发`开源`、`高性能`web服务器和反向代理服务器

反向代理：接受客户端请求，转发请求到真实服务器处理，将处理结果返回客户端

![image-20210807162815778](index.assets/image-20210807162815778.png ':size=600x300')

正向代理：访问外部资源时，通过代理服务器去访问

`反向代理服务的时服务器，正向代理服务的是客户端`

## 安装及基础命令

> 安装

```bash
tar -zxvf nginx-1.20.1.tar.gz
cd nginx-1.20.1/

# configure 报错时一般缺少一些库，根据提示安装即可
# ubuntu ： apt-get install libpcre3 libpcre3-dev zlib1g zlib1g-dev openssl libssl-dev make
./configure --prefix=/usr/local/nginx --with-http_ssl_module

# 编译，编译后的nginx文件在objs里
make

# 安装，将编译后的文件安装到系统（创建相关目录等）
make install

# 重新编译时用得上
make clean #清除上一次make命令生成的文件
```

> 启动

```bash
/usr/local/nginx/sbin/nginx		#普通启动
 /usr/local/nginx/sbin/nginx -c /usr/local/nginx/conf/nginx.conf	#通过配置文件启动
ps -ef | grep nginx		#查看nginx进程，master和worker两个进程（主进程/工作进程）
```

> 关闭

```bash
kill -QUIT 进程id	 #优雅关闭，等待所有请求处理后关闭
kill -TERM 进程id	 #快速关闭，直接杀死
```

> 重启

```bash
/usr/local/nginx/sbin/nginx -s reload	#杀死进程，然后重新启动
```

> 其他命令

```bash
/usr/local/nginx/sbin/nginx -c /usr/local/nginx/conf/nginx.conf -t	#-t参数，启动时检查配置文件
/usr/local/nginx/sbin/nginx -V	#查看nginx版本号、编译器版本、参数配置
```

> 默认目录

- /etc/nginx：nginx配置文件目录, 所有的nginx配置文件都在这里
- /etc/nginx/nginx.conf：nginx的主配置文件, 可以修改它来改变nginx的全局配置.
- /etc/nginx/sites-available：这个目录存储每一个网站的"server blocks", nginx通常不会使用这些配置, 除非它们被链接到sites-enabled目录. 一般所有的server block配置都在这个目录中设置, 然后软链接到别的目录
- /etc/nginx/sites-enabled：这个目录存储生效的"server blocks"配置. 通常, 这个配置都是链接到sites-available目录中的配置文件.
- /etc/nginx/snippets：这个目录主要可以包含在其它nginx配置文件中的配置片段, 重复的配置都可以重构为配置片段.
-  /var/log/nginx/access.log：每一个访问请求都会默认记录在这个文件中, 除非你做了其它设置.
- /var/log/nginx/error.log：任何nginx的错误信息都会记录到这个文件中.

## nginx配置文件

### 基础配置

```ini
#worker进程运行用户
#user  nobody;

#work进程默认条数，通常为CPU数量两倍或等于CPU数量
worker_processes  1;	

#配置全局错误日志及类型 [debug|info|notice|warn|error|crit]，默认为 error
#error_log  logs/error.log  error;

#配置进程PID文件，存放进程
#pid        logs/nginx.pid;


```



### events配置

```ini
#配置工作模式和连接数
events {
	#一个work进程连接上限，nginx并发连接上线为worker_processes*worker_connections，上限为65535
    worker_connections  1024;
}
```

### http配置

```ini
#配置http服务器，利用它的反向代理实现负载均衡
http {
	#配置nginx支持可以支持的多媒体类型，/conf/mine.types下可以看见支持的文件
    include       mime.types;
    
    #默认以流形式打开，未识别时
    default_type  application/octet-stream;
	
	#配置asses.log日志格式及存放路径，main是变量名
    #log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
    #                  '$status $body_bytes_sent "$http_referer" '
    #                  '"$http_user_agent" "$http_x_forwarded_for"';
	
	#配置asses.log日志存放路径
    #access_log  logs/access.log  main;

	#开启高效文件传输模式
    sendfile        on;
    #防止网络阻塞
    #tcp_nopush     on;
	
	#长连接超时时间
    keepalive_timeout  65;
	
	#开启gzip压缩输出
    #gzip  on;

	#虚拟主机，一个http配置可以有多个server，端口号和域名不能完全一致
    server {
    	#端口号
        listen       80;
        #域名
        server_name  localhost;

		#编码格式，默认为utf-8
        #charset koi8-r;
		
		#访问日志，访问这个server主机时输出日志
        #access_log  logs/host.access.log  main;
		
		#默认的匹配 / 处理，当访问中有 / 时（/ 根路径），匹配到该location处理
        location / {
        	#本地磁盘的根路径
            root   html;
            #默认欢迎页
            index  index.html index.htm;
        }
		
		#配置错误页
        #error_page  404              /404.html;
        # redirect server error pages to the static page /50x.html
        #配置50x错误页面
        error_page   500 502 503 504  /50x.html;
        
        #精准匹配，
        location = /50x.html {
            root   html;
        }

        # deny access to .htaccess files, if Apache's document root
        # concurs with nginx's one
        #
        #location ~ /\.ht {
        #    deny  all;
        #}
    }
	#这里可以继续配置其他server虚拟主机
}
```

### Location 详解

**基本语法**

```ini
location [修饰符] /匹配路径 {
    # 处理规则（如 proxy_pass、root、rewrite 等）
}
```

- **修饰符**：决定匹配方式（可选，无修饰符为默认匹配）；
- **匹配路径**：要匹配的 URI 路径（支持字符串、正则表达式）；
- **块内指令**：匹配成功后执行的操作（如 `root`、`proxy_pass`、`return` 等）。

`location` 的匹配优先级由修饰符决定，**优先级从高到低** 如下：

| 修饰符   | 匹配类型                 | 说明                                                        |
| -------- | ------------------------ | ----------------------------------------------------------- |
| =        | 精确匹配                 | 严格匹配 URI 全路径，匹配成功立即终止后续匹配               |
| ^~       | 前缀匹配（非正则）       | 匹配 URI 前缀，优先级高于正则匹配，匹配成功终止后续正则匹配 |
| ~        | 正则匹配（区分大小写）   | 按配置顺序匹配正则表达式，第一个匹配成功即生效              |
| ~*       | 正则匹配（不区分大小写） | 与 `~` 类似，但忽略大小写                                   |
| 无修饰符 | 普通前缀匹配             | 匹配 URI 前缀，优先级最低，最终会选择**最长匹配**的路径     |

**关键注意事项**

1. `proxy_pass` 末尾斜杠的坑；`proxy_pass` 末尾是否加 `/`，会影响 URI 的拼接规则

   ```ini
   # 场景1：location 路径以 / 结尾，proxy_pass 不加 /
   location /api/ {
       proxy_pass http://127.0.0.1:8080;
       # 请求 /api/user → 转发到 http://127.0.0.1:8080/api/user
   }
   
   # 场景2：location 路径以 / 结尾，proxy_pass 加 /
   location /api/ {
       proxy_pass http://127.0.0.1:8080/;
       # 请求 /api/user → 转发到 http://127.0.0.1:8080/user（去掉 /api/ 前缀）
   }
   ```

2. 正则匹配的顺序；`~`/`~*` 按配置文件中出现的**顺序匹配**，第一个匹配成功即生效，因此需将更具体的正则写在前面

   ```ini
   # 错误：先匹配通用正则，导致 /api/v2/ 永远匹配不到
   location ~ /api/ { ... }
   location ~ /api/v2/ { ... }
   
   # 正确：先匹配具体正则
   location ~ /api/v2/ { ... }
   location ~ /api/ { ... }
   ```

3. 大小写敏感

   - 系统层面：Linux 文件系统区分大小写（如 `index.HTML` 和 `index.html` 是不同文件）；
   - Nginx 层面：`~` 区分大小写，`~*` 不区分，无修饰符的前缀匹配区分大小写。

## 静态网站部署

1. 修改配置文件，添加一个匹配，绑定根目录到自己的目录

   ```ini
   location / {
       root   /usr/share/nginx/html;
       index  index.html index.htm;
   }
   location /myweb {
       root  /home/html;
       index index.html index.htm;
   }
   ```

2. `root`指定的时 `/` 路径，所以需要在`/home/html`下创建myweb目录

3. 重启nginx：`nginx -s reload`

## 负载均衡

原理图`统一入口nginx`

![image-20210807231614382](index.assets/image-20210807231614382.png ':size=600*300')

> 基本配置

location拦截 /myweb 请求，proxy_pass 然后转发到 upstream 中处理

```ini
upstream myweb {
	server 192.168.115.128:8081;
	server 192.168.115.128:8082;
}
server{
	location /myweb {
		proxy_pass http://myweb;
    }
}
```

> 负载均衡策略

1. 轮询（默认）

   ```ini
   #轮流发给每个服务器
   upstream myweb {
   	server 192.168.115.128:8081;
   	server 192.168.115.128:8082;
   }
   ```

2. 权重策略

   ```ini
   #按照权重，如下：3个请求，一个服务器处理2个，另个服务器处理1个
   upstream myweb {
   	server 192.168.115.128:8081	weight=2;
   	server 192.168.115.128:8082	weight=1;
   }
   ```

3. ip hash

   ```ini
   #根据ip值hash，相同的ip总是访问同一个服务器，不会丢失session，但是不建议使用，可能存在所有请求在一个服务器
   upstream myweb {
   	ip_hash;
   	server 192.168.115.128:8081;
   	server 192.168.115.128:8082;
   }
   ```

4. 最少连接数

   ```ini
   #转发请求到处理请求最少的服务器
   upstream myweb {
   	least conn;
   	server 192.168.115.128:8081;
   	server 192.168.115.128:8082;
   }
   ```

> 其他配置

1. 备份

   ```ini
   #在非backup服务器全部宕机时，请求转发到backup服务器，版本更新时可用
   upstream myweb {
   	server 192.168.115.128:8081;
   	server 192.168.115.128:8082 backup;
   }
   ```

2. down

   ```ini
   #标记down的服务器不参与负载均衡
   upstream myweb {
   	server 192.168.115.128:8081;
   	server 192.168.115.128:8082 down;
   }
   ```

## 静态代理

静态资源由nginx处理，通过拦截静态资源的请求，进行相应的处理

> 实现方式一，在 location 中配置静态资源的后缀，拦截请求后缀名

```ini
location ~.*\.(js|css|htm|html|gif|jpg|jpeg|png|bmp|swf|ioc|rar|zip|txt|f;v|mid|doc|ppt|pdf|xlx|mp3|wma)$ {
	   root /opt/static;
}
```

> 实现方式二，在 location 中配置静态资源所在目录实现，拦截请求路径

```ini
location ~.*/(css|js|img|images) {
	root /opt/static;
}
```

## 动静分离

> 整体架构图架构图

![image-20210808121655129](index.assets/image-20210808121655129.png ':size=600*300')

> 实现

- nginx负载均衡服务器

  ```ini
  upstream myweb {
  	ip_hash;
  	server 192.168.115.128:8081;
  	server 192.168.115.128:8082;
  }
  upstream static {
  	server 192.168.115.128:81;
  	server 192.168.115.128:82;
  }
  server{
  	location /myweb {
  		proxy_pass http://myweb;
      }
      location ~.*/(css|js|img|images) {
  		proxy_pass http://static;
  	}
  }
  ```

- 配置存放静态资源的nginx服务器

  ```ini
  location ~.*/(css|js|img|images) {
  	root /opt/static;
  }
  ```

## 虚拟主机

> 基于端口（不重要）

```ini
server {
    #端口号
    listen       80;
    #域名
    server_name  localhost;
    location / {
    root   html;
    index  index.html index.htm;
    }
    error_page   500 502 503 504  /50x.html;
    location = /50x.html {
    root   html;
    }
}
server {
    #端口号
    listen       81;
    #域名
    server_name  localhost;
    location / {
    root   html;
    index  index.html index.htm;
    }
    error_page   500 502 503 504  /50x.html;
    location = /50x.html {
    root   html;
    }
}
```



> 基于域名（重要）

```ini
server {
    #端口号
    listen       80;
    #域名
    server_name  www.myweb1.com;
    location / {
    root   html;
    index  index.html index.htm;
    }
    error_page   500 502 503 504  /50x.html;
    location = /50x.html {
    root   html;
    }
}
server {
    #端口号
    listen       80;
    #域名
    server_name  www.myweb2.com;
    location / {
    root   html;
    index  index.html index.htm;
    }
    error_page   500 502 503 504  /50x.html;
    location = /50x.html {
    root   html;
    }
}
```

## 配置示例

```nginx
server {
    listen 80;
    server_name shop.example.com;
    root /var/www/shop;

    # ==========================================
    # 1. 精确匹配 (=) - 最高优先级
    # ==========================================

    # 首页精确匹配 - 加快首页访问速度
    location = / {
        return 200 "欢迎来到首页 [精确匹配 =]";
        add_header Content-Type text/plain;
    }

    # robots.txt 精确匹配
    location = /robots.txt {
        return 200 "User-agent: *\nDisallow: /admin/";
        add_header Content-Type text/plain;
    }

    # favicon.ico 精确匹配
    location = /favicon.ico {
        log_not_found off;
        access_log off;
        expires 30d;
    }


    # ==========================================
    # 2. 前缀优先匹配 (^~) - 阻止正则匹配
    # ==========================================

    # 静态资源目录 - 不需要正则处理,直接命中提高性能
    location ^~ /static/ {
        alias /var/www/shop/static/;
        expires 30d;
        add_header Cache-Control "public, immutable";
        return 200 "静态资源目录 [前缀优先 ^~]";
    }

    # 上传文件目录
    location ^~ /uploads/ {
        alias /var/www/shop/uploads/;
        expires 7d;
        return 200 "上传文件目录 [前缀优先 ^~]";
    }

    # 阻止访问隐藏文件
    location ^~ /. {
        deny all;
        return 403 "禁止访问隐藏文件 [前缀优先 ^~]";
    }


    # ==========================================
    # 3. 正则匹配 (~ ~*) - 按顺序匹配
    # ==========================================

    # 图片文件处理 (区分大小写)
    location ~ \.(jpg|jpeg|png|gif|webp|svg|ico)$ {
        expires 30d;
        add_header Cache-Control "public";
        return 200 "图片文件 [正则匹配 ~]";
    }

    # CSS/JS 文件处理 (不区分大小写)
    location ~* \.(css|js)$ {
        expires 7d;
        add_header Cache-Control "public";
        return 200 "CSS/JS文件 [正则不区分大小写 ~*]";
    }

    # 字体文件处理
    location ~* \.(ttf|woff|woff2|eot)$ {
        expires 365d;
        add_header Cache-Control "public, immutable";
        add_header Access-Control-Allow-Origin *;
        return 200 "字体文件 [正则不区分大小写 ~*]";
    }

    # 视频文件处理
    location ~* \.(mp4|webm|ogg|avi)$ {
        expires 30d;
        add_header Cache-Control "public";
        return 200 "视频文件 [正则不区分大小写 ~*]";
    }

    # PHP 文件处理 (演示正则顺序重要性)
    location ~ \.php$ {
        # fastcgi_pass unix:/var/run/php-fpm.sock;
        # fastcgi_index index.php;
        return 200 "PHP文件处理 [正则匹配 ~]";
    }

    # 禁止访问备份文件
    location ~ \.(bak|backup|old|tmp)$ {
        deny all;
        return 403 "禁止访问备份文件 [正则匹配 ~]";
    }


    # ==========================================
    # 4. 普通前缀匹配 - 最长匹配原则
    # ==========================================

    # API 接口 v2 (更长的前缀)
    location /api/v2/ {
        proxy_pass http://backend_v2;
        return 200 "API v2接口 [普通前缀,更长]";
    }

    # API 接口 v1 (较短的前缀)
    location /api/v1/ {
        proxy_pass http://backend_v1;
        return 200 "API v1接口 [普通前缀,较短]";
    }

    # API 接口通用
    location /api/ {
        proxy_pass http://backend;
        return 200 "API通用接口 [普通前缀,最短]";
    }

    # 商品详情页
    location /product/ {
        try_files $uri$uri/ /product/index.html;
        return 200 "商品详情页 [普通前缀]";
    }

    # 用户中心
    location /user/ {
        try_files $uri$uri/ /user/index.html;
        return 200 "用户中心 [普通前缀]";
    }

    # 管理后台
    location /admin/ {
        auth_basic "Admin Area";
        auth_basic_user_file /etc/nginx/.htpasswd;
        return 200 "管理后台 [普通前缀]";
    }


    # ==========================================
    # 5. 通用匹配 - 兜底规则
    # ==========================================

    # 所有其他请求
    location / {
        try_files $uri$uri/ /index.html;
        return 200 "通用匹配 [兜底规则]";
    }
}
```

