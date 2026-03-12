---
title: required
---

## `required` 字段的原则

1. **通信链路中，源的 `required` 字段必须是目标 `required` 字段的超集**

   这意味着如果目标 extension 要求某个字段为必需，那么源 extension 也必须将该字段标记为必需。这确保了消息在传递过程中不会缺少必要的字段。

2. **源和目标 `required` 字段中的相同字段名称必须具有兼容的类型**

   框架会验证字段类型的兼容性，确保数据可以正确传递和解析。类型兼容性检查包括基本类型匹配、数组项类型匹配以及对象属性类型匹配。

## `required` 字段的使用

### Extension 发送消息时

当 extension 调用 `send_<foo>(msg_X)` 或 `return_result(result_Y)` 时，框架会根据 extension 中的相应 schema 检查 `msg_X` 或 `result_Y`。如果 `msg_X` 或 `result_Y` 缺少 schema 中标记为 `required` 的任何字段，则 schema 检查将失败。

以下三种情况的处理方式相同：

1. **发送 command 且 schema 检查失败时**

   `send_<foo>` 将立即返回 `false`，错误讯息将包含 schema 检查失败的错误消息。

2. **`return_result` 未通过 schema 检查时**

   `return_result` 将返回 `false`，错误讯息将包含 schema 检查失败的错误消息，通常会显示缺少的必需字段，例如："the required properties are absent: 'foo'"。

3. **发送 data-like message（如数据、音频帧或视频帧）时**

   `send_<foo>` 将返回 `false`，错误讯息将包含 schema 检查失败的错误消息。

**注意：** 框架的 schema 系统仅在字段存在时生效。如果某个字段在 schema 中定义但在消息中不存在，且该字段未在 `required` 中列出，则不会进行类型检查。只有当字段同时存在于消息中和 schema 定义中时，才会进行类型验证。

### Extension 接收消息时

在 TEN runtime 将 `msg_X` 或 `result_Y` 传递给 extension 的 `on_<foo>()` 或结果处理程序之前，它会检查 `msg_X` 或 `result_Y` 的 schema 中定义的所有 `required` 字段是否都存在。如果缺少任何 `required` 字段，则 schema 检查将失败。

1. **传入消息是 command 时**

   TEN runtime 会将错误返回给上一个 extension，错误消息会指明缺少的必需字段。

2. **传入消息是 TEN 命令结果时**

   TEN runtime 会将结果的 `status_code` 更改为错误，添加缺少的 `required` 字段，并根据其类型将这些字段的值设置为默认值。

3. **传入消息是数据类 TEN 消息时**

   TEN runtime 将直接丢弃该数据类消息。

### 错误消息格式

当 `required` 字段验证失败时，框架会提供详细的错误信息：

- 单个缺失字段：`"the required properties are absent: 'field_name'"`
- 多个缺失字段：`"the required properties are absent: 'field1', 'field2'"`
- 嵌套对象中的缺失字段：`".nested_object: the required properties are absent: 'field_name'"`
