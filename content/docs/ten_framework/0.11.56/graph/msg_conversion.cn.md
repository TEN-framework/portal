---
title: 消息转换
---

## 消息转换

TEN Framework 提供了强大的消息转换功能，允许您在消息传递过程中对消息内容进行转换和修改。通过配置转换规则，您可以实现消息字段的重命名、值的替换、以及复杂的数据结构转换。

### 基本配置

消息转换通过 `msg_conversion` 配置项进行设置：

```json
{
  "msg_conversion": {
    "type": "per_property",
    "keep_original": false,
    "rules": [
      {
        "path": "user.name",
        "conversion_mode": "fixed_value",
        "value": "default_user"
      },
      {
        "path": "data.items[0].id",
        "conversion_mode": "from_original",
        "original_path": "original_id"
      }
    ]
  }
}
```

### 配置参数说明

- **type**: 转换类型，目前支持 `per_property`（按属性转换）
- **keep_original**: 是否保留原始消息内容，设为 `false` 时只保留转换后的字段
- **rules**: 转换规则数组，定义具体的转换逻辑

### 转换规则

每个转换规则包含以下字段：

- **path**: 目标字段路径，指定要设置的消息字段位置
- **conversion_mode**: 转换模式
  - `fixed_value`: 设置固定值
  - `from_original`: 从原始消息的指定路径复制值
- **value**: 当转换模式为 `fixed_value` 时使用的固定值
- **original_path**: 当转换模式为 `from_original` 时，指定原始消息中的源字段路径

### 路径表达式

消息转换中的路径表达式支持多种访问方式：

- **对象属性访问**: `user.profile.name` - 访问嵌套对象的属性
- **数组索引访问**: `items[0].name` - 访问数组指定索引的元素
- **混合路径访问**: `user.tags[1].value` - 结合对象和数组访问

### 使用场景

消息转换功能适用于以下场景：

- **字段重命名**: 将消息中的字段名称转换为目标系统要求的格式
- **数据格式转换**: 调整消息的数据结构以适配不同的处理模块
- **默认值设置**: 为缺失的字段提供默认值
- **数据清洗**: 过滤或转换不符合要求的数据内容
