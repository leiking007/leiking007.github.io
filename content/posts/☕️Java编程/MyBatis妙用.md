---
title: "MyBatis妙用"
date: 2023-01-17
lastmod: 2023-01-17
draft: false
tags: ['数据库']
categories: ["☕️Java编程"]
author: "lei"
---

# MyBatis妙用

## ResultHandler

sql如下，需要返回map；map key为 查询结果id，map value为查询结果的 name；此时可以用 ResultHandler 对查询结果集处理，返回需要的 map

```sql
select id,name from t_user;
```

1. 编写MapResultHandler 实现 ResultHandler 接口

   ```java
   @SuppressWarnings("all")
   public class MapResultHandler<K,V> implements ResultHandler<Map<K,V>> {
       private final Map<K,V> mappedResults = new HashMap<>();
   
       @Override
       public void handleResult(ResultContext context) {
           Map map = (Map) context.getResultObject();
           mappedResults.put((K)map.get("key"), (V)map.get("value"));
       }
   
       public Map<K,V> getMappedResults() {
           return mappedResults;
       }
   }
   ```

2. 编写接口方法和mapper文件，`注意接口方法没有任何返回值`

   接口：

   ```java
   void getNameMapResult(MapResultHandler<String,Long> resultHandler,@Param("param") String param);
   ```

   mapper文件：

   ```xml
   <!-- 这里的key和value为标识，方便ResultHandler循环处理结果时取值 -->
   <resultMap id="resMap" type="java.util.HashMap">
       <result property="key" column="id" javaType="java.lang.String"/>
       <result property="value" column="name" javaType="java.lang.Long"/>
   </resultMap>
   <select id="getUserResult" resultMap="resMap">
   	select id as id ,name as name from t_user;
   </select>
   ```

3. 调用

   ```java
   //  MapResultHandler 实例
   MapResultHandler<String,String> resultHandler = new MapResultHandler<>();
   // 调用方法，传入 MapResultHandler 实例 和需要的参数
   queryMapper.getUserResult(resultHandler,"1527147");
   // 通过 MapResultHandler 实例获取需要的结果
   Map<String, String> results = resultHandler.getMappedResults();
   ```

## @MapKey注解

MapKey 注解标注在mapper接口方法上

作用：结果返回为 map 对象，map key为 @MapKey 标识的字段，value 为查询的结果集

示例：

mapper 接口

```java
@MapKey("id")
Map<String,User> getUserMap();
```

mapper 文件

```xml
<select id="getUserResult" resultMap="org.lei.entity.User">
	select id "id" ,name name from t_user;
</select>
```

返回结果map结构如下

```json
{
	id1: {
		userId: id1,
        userName: name1
	},
    id2: {
        userId: id2,
        userName: name2
    }
	...
}
```

