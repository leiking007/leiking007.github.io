---
title: "分布式ID"
date: 2023-05-09
lastmod: 2023-05-09
draft: false
tags: ['JavaSE']
categories: ["笔记"]
author: "lei"
---

# 分布式ID

## 雪花算法

### 介绍

Snowflake 是 Twitter 开源的分布式 ID 生成算法。Snowflake 由 64 bit 的二进制数字组成，这 64bit 的二进制被分成了几部分，每一部分存储的数据都有特定的含义：

- **第 0 位**：符号位（标识正负），始终为 0，没有用，不用管。
- **第 1~41 位**：一共 41 位，用来表示时间戳，单位是毫秒，可以支撑 2 ^41 毫秒（约 69 年）
- **第 42~52 位**：一共 10 位，一般来说，前 5 位表示机房 ID，后 5 位表示机器 ID（实际项目中可以根据实际情况调整）。这样就可以区分不同集群/机房的节点。
- **第 53~64 位**：一共 12 位，用来表示序列号。 序列号为自增值，代表单台机器每毫秒能够产生的最大 ID 数(2^12 = 4096),也就是说单台机器每毫秒最多可以生成 4096 个 唯一 ID

**优点**：生成速度比较快、生成的 ID 有序递增、比较灵活（可以对 Snowflake 算法进行简单的改造比如加入业务 ID）

**缺点**：需要解决重复 ID 问题（依赖时间，当机器时间不对的情况下，可能导致会产生重复 ID）

### Java实现

```java
/**
 * twitter的snowflake算法 -- java实现
 * 下面代码每秒理论上可生成id数为：2048000
 *
 * @author 总共 64bit位 最大为 9,223,372,036,854,775,807（2^63 -1）
 */
public class SnowFlake {

    /**
     * 起始的时间戳 2020-01-01 00:00:00
     */
    private static final long START_TIMESTAMP = 1577808000000L;

    // 预留1 bit 符号位（默认为0）

    /**
     * 序列号占用的位数 每毫秒可生成2048个序列号
     */
    private static final long SEQUENCE_BIT = 11;
    /**
     * 机器标识占用的位数 最大32
     */
    private static final long MACHINE_BIT = 5;
    /**
     * 数据中心占用的位数 最大32
     */
    private static final long DATACENTER_BIT = 5;
    /**
     * 时间戳占用的位数 139年左右
     */
    private static final long TIMESTAMP_BIT = 42;

    /**
     * 机器id最大为31
     */
    private static final long MAX_MACHINE = ~(-1L << MACHINE_BIT);

    /**
     * 数据中心id最大为31
     */
    private static final long MAX_DATACENTER = ~(-1L << DATACENTER_BIT);

    /**
     * 序列最大大小
     */
    private static final long MAX_SEQUENCE = ~(-1L << SEQUENCE_BIT);

    /**
     * 每一部分向左的位移
     */
    private static final long MACHINE_LEFT = SEQUENCE_BIT;
    private static final long DATACENTER_LEFT = MACHINE_LEFT + MACHINE_BIT;
    private static final long TIMESTAMP_LEFT = DATACENTER_LEFT + DATACENTER_BIT;

    /**
     * 序列号
     */
    private long sequence = 1L;

    /**
     * 上一次时间戳
     */
    private long lastTimestamp = -1L;

    /**
     * 机器id
     */
    private long machineId = 1L;

    /**
     * 数据中心id
     */
    private long datacenterId = 1L;


    public SnowFlake(long machineId, long datacenterId) {
        if (machineId > MAX_MACHINE) {
            throw new AppException("机器id最大为31");
        }
        if (datacenterId > MAX_DATACENTER) {
            throw new AppException("数据中心id最大为31");
        }
        this.machineId = machineId;
        this.datacenterId = datacenterId;
    }

    /**
     * 产生一下个id
     *
     * @return long
     */
    public synchronized long nextId() {
        long currTimestamp = getNewTimestamp();
        if (currTimestamp < lastTimestamp) {
            throw new AppException("Clock moved backwards.  Refusing to generate id");
        }
        // 相同毫秒内，序列号自增
        if (currTimestamp == lastTimestamp) {
            sequence = (sequence + 1) & MAX_SEQUENCE;
            // 同一毫秒的序列数已经达到最大，等待到下一毫秒
            if (sequence == 0L) {
                currTimestamp = getNextMill();
            }
        } else {
            // 不同毫秒 序列置为 0
            sequence = 1L;
        }
        lastTimestamp = currTimestamp;
        // 这里隐藏了首位 0L
        return (currTimestamp - START_TIMESTAMP) << TIMESTAMP_LEFT //时间戳部分
                | datacenterId << DATACENTER_LEFT       //数据中心部分
                | machineId << MACHINE_LEFT             //机器标识部分
                | sequence; //序列号部分
    }

    private long getNextMill() {
        long mill = getNewTimestamp();
        while (mill <= lastTimestamp) {
            mill = getNewTimestamp();
        }
        return mill;
    }

    private long getNewTimestamp() {
        return System.currentTimeMillis();
    }


    public static final SnowFlake SNOW_FLAKE = new SnowFlake(1L, 1L);

    public static long getSeq() {
        return SNOW_FLAKE.nextId();
    }

    public static void main(String[] args) {
        long start = System.currentTimeMillis();
        List<Long> arr = Collections.synchronizedList(new ArrayList<>(100000));
        new Thread(() -> {
            while (System.currentTimeMillis() - start < 1000) {
                arr.add(getSeq());
            }
        }).start();
        new Thread(() -> {
            while (System.currentTimeMillis() - start < 1000) {
                arr.add(getSeq());
            }
        }).start();
        try {
            TimeUnit.SECONDS.sleep(1);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        System.out.println(String.format("耗时：%sms,生成id数量：%s", System.currentTimeMillis() - start, arr.size()));


    }
}
```

## UUID

### 介绍

UUID 是 Universally Unique Identifier（通用唯一标识符） 的缩写。UUID 包含 32 个 16 进制数字（8-4-4-4-12）

**优点**：生成速度比较快、简单易用

**缺点**：存储消耗空间大（32 个字符串，128 位）、 不安全（基于 MAC 地址生成 UUID 的算法会造成 MAC 地址泄露)、无序（非自增）、没有具体业务含义、需要解决重复 ID 问题（当机器时间不对的情况下，可能导致会产生重复 ID）

### Java代码

```java
public class UUIDUtil {
    public static void main(String[] args) {
        UUID randomUUID = UUID.randomUUID();
        // 示例：c1c74128-0fc4-454b-b4bc-248d945d25a9
        String toString = randomUUID.toString();
    }
}
```

