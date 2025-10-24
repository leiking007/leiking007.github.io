---
title: "python 开发时一些问题"
date: 2025-10-10
lastmod: 2025-10-10
draft: false
tags: ['python']
categories: ["笔记"]
author: "lei"
summary: "python开发时，遇到的一些问题在此记录！！！"
---

# python 开发时一些问题

## 一些特性记录

### fastapi中间件

中间件  执行顺序类似于洋葱，最后添加的中间件在最外层

**middleware.py**

```python
import time

from fastapi import Request
from fastapi.encoders import jsonable_encoder
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.responses import JSONResponse as StarletteJSONResponse

import app.common.log_factory as log_factory
from app.common.exception import AppException
from app.common.utils.response_util import WrapperResponse

log = log_factory.get_logger(__name__)


# 全局异常处理中间件
class HandleExceptionMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        try:
            response = await call_next(request)
            # 检查非200状态码
            if response.status_code != 200:
                content_str = ""
                # 处理不同类型的响应
                if hasattr(response, "body"):
                    try:
                        content = await response.body()
                        content_str = content.decode(errors='replace')[:500]
                    except Exception as e:
                        content_str = f"[读取body失败: {str(e)}]"
                elif hasattr(response, "body_iterator"):
                    content_str = "[流式响应内容，无法直接读取]"
                else:
                    content_str = f"[未知响应类型: {type(response)}]"

                log.warning(
                    f"非200响应 - 路径: {request.url.path}, "
                    f"状态码: {response.status_code}, "
                    f"内容: {content_str}"
                )
        except AppException as e:
            log.error('%s', e)
            response = StarletteJSONResponse(
                jsonable_encoder(WrapperResponse.error(msg=e.msg)),
                status_code=e.code if isinstance(e.code, int) else 500
            )
        except Exception as e:
            log.error('%s', e)
            response = StarletteJSONResponse(
                jsonable_encoder(WrapperResponse.error(msg="服务器内部异常")),
                status_code=500
            )
        return response


class RateLimiterMiddleware(BaseHTTPMiddleware):
    def __init__(
            self,
            app,
            limit: int = 60,  # 单位时间内允许的最大请求数
            window: int = 60  # 时间窗口，单位为秒
    ):
        super().__init__(app)
        self.limit = limit
        self.window = window
        self.client_requests = {}

    async def dispatch(self, request: Request, call_next):
        log.info(f"请求进入:{request.url.path}")
        try:
            client_ip = request.client.host
            current_time = time.time()

            # 如果客户端 IP 不在记录中，初始化记录
            if client_ip not in self.client_requests:
                self.client_requests[client_ip] = {
                    "count": 1,
                    "start_time": current_time
                }
            else:
                client_info = self.client_requests[client_ip]
                elapsed_time = current_time - client_info["start_time"]

                # 如果时间窗口已过，重置计数和开始时间
                if elapsed_time > self.window:
                    client_info["count"] = 1
                    client_info["start_time"] = current_time
                else:
                    # 如果未超过时间窗口，增加计数
                    client_info["count"] += 1

                    # 检查是否超过请求限制
                    if client_info["count"] > self.limit:
                        raise AppException(msg="请求频率过高，请稍后再试", code=429)

            response = await call_next(request)
        finally:
            log.info(f"请求结束:{request.url.path}")
        return response
```



## 一些错误记录

### pyCharm Dubeg启动报错

```
2025-10-24 10:34:17 - asyncio - ERROR - Exception in callback <Task pending name='Task-1' coro=<Server.serve() running at C:\Users\lei\Desktop\fastapi-demo\.venv\lib\site-packages\uvicorn\server.py:69> cb=[_run_until_complete_cb() at C:\Users\lei\AppData\Roaming\uv\python\cpython-3.10.18-windows-x86_64-none\lib\asyncio\base_events.py:184]>()
handle: <Handle <Task pending name='Task-1' coro=<Server.serve() running at C:\Users\lei\Desktop\fastapi-demo\.venv\lib\site-packages\uvicorn\server.py:69> cb=[_run_until_complete_cb() at C:\Users\lei\AppData\Roaming\uv\python\cpython-3.10.18-windows-x86_64-none\lib\asyncio\base_events.py:184]>()>
Traceback (most recent call last):
  File "C:\Users\lei\AppData\Roaming\uv\python\cpython-3.10.18-windows-x86_64-none\lib\asyncio\events.py", line 80, in _run
    self._context.run(self._callback, *self._args)
TypeError: 'Task' object is not callable
```

解决办法：禁用异步调试模式

进入 `Help -> Find Action`，搜索 **Registry**，找到并取消勾选 `python.debug.asyncio.repl` 选项。此操作可禁用PyCharm对异步代码的特殊处理，避免事件循环冲突
