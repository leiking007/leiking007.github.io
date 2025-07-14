---
title: "Java参数校验"
date: 2022-09-19
lastmod: 2022-09-19
draft: false
tags: ['JavaEE']
categories: ["笔记"]
author: "lei"
---

Java参数校验

## JSR 380

JSR 380规范是bean验证的Java api规范，JavaEE和JavaSE的一部分，使用注解如@NotNull, @Min, and @Max，确保bean属性符合一定条件

jsr380需要Java8或以上版本,利用Java8中新增的特性，如注解类型，支持新的类如：Optional 和 LocalDate

Hibernate Validator是验证规范的参考实现，使用时需要导入该依赖

## @Validation与@Valid区别

**来源**

- `@Validated`：是Spring 做得一个自定义注解，做了增强功能

- `@Valid`：是JSR-303规范标准注解支持，是一个标记注解

**注解位置**

- `@Validated`：用在类型、方法和方法参数上。但不能用于成员属性（field）

- `@Valid`：可以用在方法、构造函数、方法参数和成员属性（field）上

**分组校验**

- `@Validated`：提供分组功能，可以在参数验证时，根据不同的分组采用不同的验证机制
- `@Valid`：没有分组功能

**嵌套校验**

- `@Validated`：不支持嵌套校验
- `@Valid`：支持

**总结**

| 区别         | @Valid                                          | @Validated              |
| :----------- | :---------------------------------------------- | ----------------------- |
| 提供者       | JSR-303规范                                     | Spring                  |
| 是否支持分组 | 不支持                                          | 支持                    |
| 标注位置     | METHOD, FIELD, CONSTRUCTOR, PARAMETER, TYPE_USE | TYPE, METHOD, PARAMETER |
| 嵌套校验     | 支持                                            | 不支持                  |

## 快速失败

默认会校验完所有字段，然后才抛出异常。可以通过一些简单的配置，开启Fali Fast模式，一旦校验失败就立即返回

```java
@Bean
public Validator validator() {
    return Validation.byProvider(HibernateValidator.class)
        .configure()
        .failFast(true) //关闭快速失败
        .buildValidatorFactory().getValidator();
}
```

## 统一异常处理

```java
@RestControllerAdvice
public class CommonExceptionHandler {

    @ExceptionHandler({MethodArgumentNotValidException.class})
    @ResponseStatus(HttpStatus.OK)
    @ResponseBody
    public Object handleMethodArgumentNotValidException(MethodArgumentNotValidException ex) {
        BindingResult bindingResult = ex.getBindingResult();
        StringBuilder sb = new StringBuilder("校验失败:");
        for (FieldError fieldError : bindingResult.getFieldErrors()) {
            sb.append(fieldError.getField()).append("：").append(fieldError.getDefaultMessage()).append(", ");
        }
        String msg = sb.toString();
        return msg;
    }

    @ExceptionHandler({ConstraintViolationException.class})
    @ResponseStatus(HttpStatus.OK)
    @ResponseBody
    public Object handleConstraintViolationException(ConstraintViolationException ex) {
        return ex.getMessage();
    }
}
```



## 使用案例

**导入依赖**

```xml
<!--数据校验api接口-->
<dependency>
    <groupId>Javax.validation</groupId>
    <artifactId>validation-api</artifactId>
</dependency>
<!--数据校验api实现 hibernate-validator只不过是一堆数据校验接口的实现类，和数据库没有半点关系-->
<dependency>
    <groupId>org.hibernate.validator</groupId>
    <artifactId>hibernate-validator</artifactId>
</dependency>
```

### 基础校验

**实体类**

```java
@Data
public class User {
    @NotBlank(message = "不能为空或空串")
    private String name;

    @Max(value = 60,message = "年龄不能大于60")
    @NotNull(message = "不能为null")
    private Integer age;
}
```

**controller**

```java
@RequestMapping("/validatedTest_One")
public void validatedTest_One(@Validated User user) {
    System.out.println("---------");
}
```

此时使用 `@Validated` 或者 `@Valid` 注解都可

### 分组校验

**实体类**

```java
@Data
public class User {
    @NotBlank(message = "不能为空或空串",groups = GroupOne.class)
    private String name;

    @Min(value = 10,message = "年龄不能小于10")
    @NotNull(message = "不能为null")
    private Integer age;

    public interface GroupOne {

    }

    public interface GroupTwo{

    }
}
```

**controller**

```java
@RequestMapping("/validatedTest_One")
public void validatedTest_One(@Validated({User.GroupOne.class}) User user) {
    System.out.println("---------");
}
```

@Valid不支持分组校验，@Validated支持分组校验；未指定分组接口的字段，默认为Default分组；分组接口可以实现Default接口，这时使用@Validated指定实现了Default分组的接口时，会校验Default分组的字段

### 嵌套校验

**实体类**

```java
@Data
public class User {
    @NotBlank(message = "不能为空或空串",groups = GroupOne.class)
    private String name;

    @Min(value = 10,message = "年龄不能小于10")
    @NotNull(message = "不能为null")
    private Integer age;

    @Valid
    @NotNull()
    private A a;

    @Data
    public class A{
        @NotBlank(message = "不能为空")
        private String field1;
        private String field2;
    }

    public interface GroupOne {}

    public interface GroupTwo{}
}
```

**controller**

```java
@RequestMapping("/validatedTest_Two")
public void validatedTest_Two(@RequestBody @Valid User user) {
    System.out.println("---------");
}
```

嵌套校验，需要校验的实体类字段必须使用@Valid注解，controller层可以使用`@Valid`或者 `@Valid`；当实体类的字段的对象为null时，默认会校验通过

### 集合校验

如果请求体直接传递了json数组给后台，并希望对数组中的每一项都进行参数校验。此时，如果直接使用Java.util.Collection下的list或者set来接收数据，参数校验并不会生效！可以使用自定义list集合来接收参数



### 编程式校验

除了通过controller接收参数时，使用注解校验，还可以通过编程式手动触发校验

需要注入一个Javax.validation.Validator的实现

```java
@Resource
private Validator validator;

@RequestMapping("/validatedTest_Three")
public void validatedTest_Three(@RequestBody User user) {
    //validate 为校验结果，如果无校验失败信息为空
    Set<ConstraintViolation<User>> validate = validator.validate(user);
}
```

### 检验普通参数

在类名上是使用`@Validated`注解，此时方法入参可以使用注解校验简单入参

```java
@RestController
@RequestMapping("/test")
@Validated
public class TestController {
    @RequestMapping("/validatedTest_Four")
    public void validatedTest_Four(@NotBlank String id) {
        System.out.println(id);
    }
}
```



### 普通项目中使用验证

**实体类**

```java
@Data
@Accessors(chain = true)
public class UserDto {

    @NotBlank(message = "必填项")
    private String id;

    private String name;

    @NotNull
    @Max(value = 20,message = "最大为20岁")
    private Integer age;
}
```

**Demo**

```java
public class Demo {
    public static Validator validator= null;

    static {
        validator= Validation.byProvider(HibernateValidator.class)
                .configure()
                .failFast(false) //关闭快速失败
                .messageInterpolator(new ParameterMessageInterpolator())
                .buildValidatorFactory().getValidator();
    }

    public static void main(String[] args) {
        UserDto userDto=new UserDto();
        userDto.setId(null)
                .setName("lei")
                .setAge(22);
        Set<ConstraintViolation<UserDto>> violations = validator.validate(userDto);
        if (!violations.isEmpty()) {
            StringBuilder stringBuilder=new StringBuilder();
            violations.forEach(e->stringBuilder.append(e.getPropertyPath().toString()+e.getMessage()));
            throw new RuntimeException(stringBuilder.toString());
        }
    }
}
```







