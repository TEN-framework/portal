---
title: 必需字段
---

在 TEN 框架中，只有消息模式允许拥有 `required` 字段，而扩展的属性目前不允许包含 `required` 字段。

这意味着 `cmd_in`、`cmd_out`、`data_in`、`data_out`、`audio_frame_in`、`audio_frame_out`、`video_frame_in` 和 `video_frame_out` 的模式允许拥有 `required` 字段。

对于消息模式，`required` 字段只能出现在三个特定的位置：

- 与 `<foo>_in` / `<foo>_out` 中的 `property` 同级。
- 在 `<foo>_in` / `<foo>_out` 中 `result` 的 `property` 内部。
- 在类型为 `object` 的 `property` 内部（即嵌套情况下）。

以下显示了这三种情况的示例：

```json
{
  "api": {
    "cmd_in": [
      {
        "name": "foo",
        "property": {
          "a": {
            "type": "int8"
          },
          "b": {
            "type": "uint8"
          },
          "c": {
            "type": "array",
            "items": {
              "type": "string"
            }
          },
          "d": {
            "type": "object",
            "properties": {
              "e": {
                "type": "float32"
              }
            }
          },
          "exampleObject": {
            "type": "object",
            "properties": {
              "foo": {
                "type": "int32"
              },
              "bar": {
                "type": "string"
              }
            },
            "required": ["foo"] // 3.
          }
        },
        "required": ["a", "b"], // 1.
        "result": {
          "property": {
            "ccc": {
              "type": "buf"
            },
            "detail": {
              "type": "buf"
            }
          },
          "required": ["ccc"] // 2.
        }
      }
    ]
  }
}
```

## `required` 的使用

### 当消息从扩展发送时

当扩展调用 `send_<foo>(msg_X)` 或 `return_result(result_Y)` 时，框架会根据扩展中各自的模式检查 `msg_X` 或 `result_Y`。如果 `msg_X` 或 `result_Y` 缺少模式中标记为 `required` 的任何字段，则模式检查将失败，表明存在错误。

这三种情况的处理方式相同，尽管它们是分开讨论的：

1. 如果 `send_<foo>` 发送的是 TEN 命令且模式检查失败：

   `send_<foo>` 将立即返回 false，并且如果提供了错误参数，它将包含模式检查失败的错误消息。

2. 如果 `return_result` 未通过模式检查：

   `return_result` 将返回 false，并且如果提供了错误参数，则可以包含模式检查失败的错误消息。

3. 如果 `send_<foo>` 发送的是类似于普通数据的 TEN 消息（例如，数据、音频帧或视频帧）：

   `send_<foo>` 将返回 false，并且如果提供了错误参数，则可以包含模式检查失败的错误消息。

### 当扩展接收到消息时

在 TEN 运行平台将 `msg_X` 或 `result_Y` 传递给扩展的 `on_<foo>()` 或结果处理程序之前，它会检查 `msg_X` 或 `result_Y` 的模式中定义的所有 `required` 字段是否都存在。如果缺少任何 `required` 字段，则模式检查将失败。

1. 如果传入的消息是 TEN 命令：

   TEN 运行平台会将错误 `status_code` 结果返回给上一个扩展。

2. 如果传入的消息是 TEN 命令结果：

   TEN 运行平台会将结果的 `status_code` 更改为错误，添加缺少的 `required` 字段，并根据其类型将这些字段的值设置为默认值。

3. 如果传入的消息是 TEN 类似于数据的消息：

   TEN 运行平台将直接丢弃类似于数据的消息。

## 图检查的行为

TEN 管理器有一个名为 “图检查” (Graph Check) 的功能，用于验证图的语义正确性。与 required 字段相关的检查如下：

1. 对于一个通信链路，源的 `required` 字段必须是目标 `required` 字段的超集。
2. 如果源和目标的 `required` 字段中都出现相同的字段名称，则它们的类型必须兼容。
