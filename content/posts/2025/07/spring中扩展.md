---
title: "spring中扩展"
date: 2025-07-10
lastmod: 2025-07-10
draft: false
tags: ['spring']
categories: ["框架"]
author: "lei"
---

# Spring中扩展

## AutowireCapableBeanFactory

在Spring中，`AutowireCapableBeanFactory` 是一个非常强大的工具类，它允许在Spring容器之外手动创建对象并为其注入依赖。这对于处理第三方类或动态创建的对象非常有用。

**使用场景**

1. **动态创建对象**：在运行时动态创建对象，并为其注入Spring管理的Bean。
2. **非托管对象的依赖注入**：对于不在Spring生命周期管理中的对象，可以手动注入依赖。
3. **后期依赖注入**：在对象创建后，根据运行时确定的依赖关系注入依赖。

**使用方法**

1. 获取 `AutowireCapableBeanFactory` 实例；通过Spring的 `ApplicationContext` 获取 `AutowireCapableBeanFactory`：

   ```java
   @Autowired
   private ApplicationContext context;
   
   AutowireCapableBeanFactory beanFactory = context.getAutowireCapableBeanFactory();
   ```

2. 手动创建对象并注入依赖；假设有一个第三方类 `ThirdPartyClass`，它需要注入一个Spring管理的Bean `MyDependency`：

   ```java
   public class ThirdPartyClass {
       private MyDependency myDependency;
   
       public void setMyDependency(MyDependency myDependency) {
           this.myDependency = myDependency;
       }
   
       public void doSomething() {
           myDependency.doSomething();
       }
   }
   ```

   ```java
   // 手动注入依赖
   ThirdPartyClass thirdPartyClass = new ThirdPartyClass();
   beanFactory.autowireBean(thirdPartyClass); // 自动注入依赖
   thirdPartyClass.doSomething(); // 调用方法验证依赖是否注入成功
   ```

**关键方法**

1. **`autowireBean(Object existingBean)`**：
   - 自动装配给定的现有Bean。此方法会尝试对整个Bean进行自动装配，包括调用`@PostConstruct`注解的方法。
   - 适用于需要完整初始化流程的场景。
2. **`autowireBeanProperties(Object existingBean, int autowireMode, boolean dependent)`**：
   - 自动装配给定Bean的属性，支持指定自动装配模式（如`AUTOWIRE_BY_NAME`或`AUTOWIRE_BY_TYPE`）。
   - 适用于只需要部分属性注入的场景。
3. **`initializeBean(Object existingBean, String beanName)`**：
   - 初始化给定的Bean，包括调用`Aware`接口和`@PostConstruct`注解的方法。

**注意事项**

- **线程安全**：`AutowireCapableBeanFactory` 的使用需要考虑线程安全问题。
- **性能开销**：手动注入依赖会比Spring自动管理的Bean有额外的性能开销，但通常可以忽略。
- **适用场景**：尽量只在必要时使用，例如处理第三方类或动态创建的对象。

通过 `AutowireCapableBeanFactory`，可以灵活地为第三方类或动态创建的对象注入Spring管理的Bean，而不必将其纳入Spring容器的管理范围。

## SessionFixationProtectionStrategy

`SessionFixationProtectionStrategy`是 Spring Security 框架里用于防止会话固定攻击的重要组件。

此策略主要运用`HttpServletRequest.invalidate()`方法来防范会话固定攻击。当用户成功认证后，系统会创建一个新的会话，以此避免攻击者利用旧会话 ID 进行非法操作。

**工作流程**

1. `会话无效化处理`：当用户认证成功时，原本的会话会被系统无效化。
2. `新会话创建操作`：系统会生成一个全新的会话，从而分配新的会话 ID。
3. `属性迁移机制`：能够把旧会话中的属性迁移到新会话中，不过像 Spring Security 相关的内部属性，无论怎样都会被迁移。
4. `会话超时时间设置`：新会话会沿用旧会话的超时时间配置。

**关键属性**

- `migrateSessionAttributes`：这是一个布尔类型的属性，默认值为`true`。它主要用于控制是否将旧会话中的属性迁移到新会话。

**核心方法解析**

1. extractAttributes(HttpSession session)
   - 该方法的作用是从即将无效化的旧会话中提取需要迁移的属性。
   - 当`migrateSessionAttributes`被设置为`false`时，除了 Spring Security 相关属性外，其他应用属性都会被丢弃。
   - 若有特殊的属性迁移需求，可以通过重写此方法来实现自定义的迁移逻辑。
2. applySessionFixation(HttpServletRequest request)
   - 这是处理会话固定攻击的核心方法，它会先无效化旧会话，然后创建新会话。
   - 其执行步骤为：获取当前会话并记录原始会话 ID，提取需要迁移的属性，无效化旧会话，创建新会话，将提取的属性迁移到新会话，最后设置新会话的超时时间。
3. transferAttributes(Map**<**String, Object> attributes, HttpSession newSession)
   - 此方法负责将提取的属性添加到新创建的会话中。
4. createMigratedAttributeMap(HttpSession session)
   - 这是一个辅助方法，用于创建需要迁移的属性映射。
   - 它会遍历旧会话中的所有属性，根据`migrateSessionAttributes`的值来决定是否保留某个属性。

**自定义需要迁移的属性**

继承`SessionFixationProtectionStrategy`类并重写`extractAttributes`方法

```java
public class CustomSessionFixationProtectionStrategy extends SessionFixationProtectionStrategy {

    // 定义需要保留的应用属性白名单
    private final String[] retainedAttributes;

    public CustomSessionFixationProtectionStrategy(String[] retainedAttributes) {
        this.retainedAttributes = retainedAttributes;
        // 禁用默认的属性迁移，完全由自定义逻辑控制
        super.setMigrateSessionAttributes(false);
    }

    @Override
    protected Map<String, Object> extractAttributes(HttpSession session) {
        Map<String, Object> attributesToMigrate = new HashMap<>();
        
        // 1. 始终保留Spring Security相关属性
        Enumeration<String> attributeNames = session.getAttributeNames();
        while (attributeNames.hasMoreElements()) {
            String key = attributeNames.nextElement();
            if (key.startsWith("SPRING_SECURITY_")) {
                attributesToMigrate.put(key, session.getAttribute(key));
            }
        }
        
        // 2. 添加应用特定的保留属性
        if (retainedAttributes != null) {
            for (String attribute : retainedAttributes) {
                Object value = session.getAttribute(attribute);
                if (value != null) {
                    attributesToMigrate.put(attribute, value);
                }
            }
        }
        
        return attributesToMigrate;
    }
}
```

Java 配置类中使用自定义策略

```java
@Configuration
@EnableWebSecurity
public class SecurityConfig extends WebSecurityConfigurerAdapter {
    @Override
    protected void configure(HttpSecurity http) throws Exception {
        // 定义需要保留的应用属性
        String[] retainedAttributes = {"userLocale", "themePreference"};
        
        http
            .sessionManagement()
                .sessionFixation()
                    .sessionAuthenticationStrategy(new CustomSessionFixationProtectionStrategy(retainedAttributes));
                // 其他会话管理配置
    }
}
```

## 路径匹配

### PathMatcher

`PathMatcher`是个很实用的接口，它主要用于对字符串路径和路径模式进行匹配操作；借助这个接口，能够判断某个路径是否与特定的模式相契合，这在路由匹配、资源处理等场景中经常会用到。

**核心接口与实现类**

Spring Boot 提供了多种`PathMatcher`的实现，其中`AntPathMatcher`是最常用的一个，它支持 Ant 风格的路径模式。Spring Boot 中默认会有一个 AntPathMatcher 实例 Bean。

**Ant 风格路径模式的规则**

- `?`：用于匹配单个字符。
- `*`：能够匹配任意数量的任意字符，但不包括路径分隔符`/`。
- `**`：可以递归地匹配任意数量的任意字符，包括路径分隔符`/`。

**示例**

```java
PathMatcher matcher = new AntPathMatcher();

// pathMatcher.setCaseSensitive(false); // 设置路径匹配不区分大小写
// pathMatcher.setPathSeparator("|"); // 设置路径分隔符为|

// 精确匹配
matcher.match("/users/{id}", "/users/123"); // 返回true
matcher.match("/users/{id}", "/users/123/profile"); // 返回false

// 使用*匹配
matcher.match("/static/*.js", "/static/main.js"); // 返回true
matcher.match("/static/*.js", "/static/css/style.css"); // 返回false

// 使用**递归匹配
matcher.match("/static/**/*.js", "/static/js/main.js"); // 返回true
matcher.match("/static/**/*.js", "/static/css/style.css"); // 返回false
```



### PathPatternParser

在 Spring Framework 5.3 及之后的版本中，`PathPatternParser` 作为新的路径匹配器被引入，它逐渐替代了旧的 `AntPathMatcher`。`PathPatternParser` 提供了更高效、更安全的路径匹配功能，尤其在 WebFlux 和 Spring MVC 中得到了广泛应用。

**核心概念与优势**

- **基于路径模式的匹配**：`PathPatternParser` 将路径模式编译为 `PathPattern` 对象，这种编译后的模式在匹配时效率更高。
- **线程安全**：编译后的 `PathPattern` 对象是线程安全的，可以被多个线程共享使用。
- **更好的性能**：相较于 `AntPathMatcher`，`PathPatternParser` 在频繁匹配相同模式的场景下，性能有显著提升。
- **标准化的路径处理**：它会自动处理路径中的斜杠、解码等问题，避免了一些潜在的安全风险。

**路径模式语法**

`PathPatternParser` 支持的路径模式语法与 `AntPathMatcher` 类似，但也有一些细微的差别：

- `{variable}`：用于匹配并捕获路径中的变量部分。例如，`/users/{id}` 可以匹配 `/users/123`，并将 `123` 捕获为变量 `id`。
- `{variable:regex}`：可以使用正则表达式来限制变量的匹配范围。比如，`/users/{id:\\d+}` 要求 `id` 必须是数字。
- `**`：用于递归匹配任意路径片段。例如，`/static/**/*.js` 可以匹配 `/static/js/main.js` 等路径。
- `?`：匹配单个字符。
- `*`：匹配零个或多个字符，但不包括路径分隔符 `/`。

**示例**

```java
// 创建PathPatternParser实例
PathPatternParser parser = new PathPatternParser();
// parser.setCaseSensitive(false);  // 设置路径匹配不区分大小写
// parser.setMatchOptionalTrailingSeparator(false);  // 严格模式，尾部斜杠也必须匹配
//        parser.setPathOptions(PathContainer.Options.create(
//                '/',   // 分隔符
//                true  // true 完整解码路径段并解析路径参数；false 仅解码分隔符的转义序列（例如：将 %2F 解码为 /，但不解码其他 URL 编码字符）
//        ));


// 编译路径模式
PathPattern pattern1 = parser.parse("/users/{id}/profile");
pattern1.matches(PathContainer.parsePath("/users/12321/profile")); // true
pattern1.matchAndExtract(PathContainer.parsePath("/users/12321/profile"));  //  {id=12321}

PathPattern pattern2 = parser.parse("/users/*");
pattern2.matches(PathContainer.parsePath("/users/add"));  // true
pattern2.matchAndExtract(PathContainer.parsePath("/users/add/12"));  // false

PathPattern pattern3 = parser.parse("/users/**");
pattern2.matches(PathContainer.parsePath("/users/add"));  // true
pattern2.matchAndExtract(PathContainer.parsePath("/users/add/12"));  // true
```

## 类型转换ConversionService
