---
title: required
---

## `required` 的原则

TEN 管理器有一个名为 "图检查" (Graph Check) 的功能，用于验证图的语义正确性。与 required 字段相关的检查如下：

1. **对于一个通信链路，源的 `required` 字段必须是目标 `required` 字段的超集。**

   这意味着如果目标 extension 要求某个字段为必需，那么源 extension 也必须将该字段标记为必需。这确保了消息在传递过程中不会缺少必要的字段。

2. **如果源和目标的 `required` 字段中都出现相同的字段名称，则它们的类型必须兼容。**

   框架会验证字段类型的兼容性，确保数据可以正确传递和解析。类型兼容性检查包括基本类型匹配、数组项类型匹配以及对象属性类型匹配。

3. **图检查会验证整个消息传递链路的完整性：**

   - 检查源 extension 的输出消息 schema 与目标 extension 的输入消息 schema 是否兼容
   - 验证 `required` 字段在整个传递路径中的一致性
   - 确保消息转换规则（如果存在）正确处理了所有必需字段

图检查在部署前进行，帮助开发者及早发现潜在的消息传递问题，避免运行时错误。

## `required` 的使用

### 当消息从 extension 发送时

当 extension 调用 `send_<foo>(msg_X)` 或 `return_result(result_Y)` 时，框架会根据 extension 中各自的 schema 检查 `msg_X` 或 `result_Y`。如果 `msg_X` 或 `result_Y` 缺少 schema 中标记为 `required` 的任何字段，则 schema 检查将失败，表明存在错误。

这三种情况的处理方式相同，尽管它们是分开讨论的：

1. **如果 `send_<foo>` 发送的是 TEN 命令且 schema 检查失败：**

   `send_<foo>` 将立即返回 `false`，并且如果提供了错误参数，它将包含 schema 检查失败的错误消息。命令对象在发送失败后仍然有效，可以修正属性后重新发送。

2. **如果 `return_result` 未通过 schema 检查：**

   `return_result` 将返回 `false`，并且如果提供了错误参数，则可以包含 schema 检查失败的错误消息，通常会显示缺少的必需字段，例如："the required properties are absent: 'foo'"。

3. **如果 `send_<foo>` 发送的是类似于普通数据的 TEN 消息（例如，数据、音频帧或视频帧）：**

   `send_<foo>` 将返回 `false`，并且如果提供了错误参数，则可以包含 schema 检查失败的错误消息。

**注意：** 框架的 schema 系统仅在字段存在时生效。如果某个字段在 schema 中定义但在消息中不存在，且该字段未在 `required` 中列出，则不会进行类型检查。只有当字段同时存在于消息中和 schema 定义中时，才会进行类型验证。

### 当 extension 接收到消息时

在 TEN runtime 将 `msg_X` 或 `result_Y` 传递给 extension 的 `on_<foo>()` 或结果处理程序之前，它会检查 `msg_X` 或 `result_Y` 的 schema 中定义的所有 `required` 字段是否都存在。如果缺少任何 `required` 字段，则 schema 检查将失败。

1. **如果传入的消息是 TEN 命令：**

   TEN runtime 会将错误 `status_code` 结果返回给上一个 extension ，错误消息会指明缺少的必需字段。

2. **如果传入的消息是 TEN 命令结果：**

   TEN runtime 会将结果的 `status_code` 更改为错误，添加缺少的 `required` 字段，并根据其类型将这些字段的值设置为默认值。

3. **如果传入的消息是 TEN 类似于数据的消息：**

   TEN runtime 将直接丢弃类似于数据的消息。

### 错误消息格式

当 `required` 字段验证失败时，框架会提供详细的错误信息：

- 对于单个缺失字段：`"the required properties are absent: 'field_name'"`
- 对于多个缺失字段：`"the required properties are absent: 'field1', 'field2'"`
- 对于嵌套对象中的缺失字段：`".nested_object: the required properties are absent: 'field_name'"`
