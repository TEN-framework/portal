---
title: 消息转换
---

## 消息转换

TEN framework 支持消息转换功能：

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

### 路径表达式

消息转换中的路径支持：

- 对象访问：`user.profile.name`
- 数组访问：`items[0].name`
- 混合访问：`user.tags[1].value`
