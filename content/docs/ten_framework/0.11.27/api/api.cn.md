---
title: API
---

在 TEN Framework 中，extension 的 API 定义包含在 `manifest.json` 文件中。TEN Framework 定义 API 时，不使用 JSON Schema，而是使用一种类似 JSON 的语法来定义 API Schema。

## 为什么不使用 JSON Schema

TEN Framework 选择不使用标准 JSON Schema 的原因如下：

- **类型系统差异**：TEN Framework 的类型系统包含了许多 JSON Schema 没有的类型，例如 `int8`、`int16`、`int32`、`int64`、`uint8`、`uint16`、`uint32`、`uint64`、`float32`、`float64`、`buf`、`ptr` 等。

- **减少冗余**：在 TEN Framework 的 API 定义中，许多地方不需要具有弹性的设定。例如，message 的 schema 一定是 object 类型，不能是其他类型。如果要求开发者明确写 `"type": "object"` 反而显得多余，且容易引起混淆。

基于以上原因，TEN Framework 采用了一种更自然的定义方式，使用类似 JSON 的语法来定义 API Schema。

## API 顶层定义

API Schema 的定义放在 `manifest.json` 文件中的 `api` 字段中：

```json
{
  "api": {
    "property": {
      "properties": {...},
      "required": [...]
    },
    "cmd_in": [{
      "name": "foo",
      "property": {
        "properties": {...},
        "required": [...]
      },
      "result": {
        "property": {
          "properties": {...},
          "required": [...]
        }
      }
    }]
  }
}
```

## API Schema 定义模式

### 表达 object 类型字段

使用 `properties` 字段来描述 object 类型字段内每个属性的类型：

```json
{
  "my_object": {
    "type": "object",
    "properties": {
      "name": {
        "type": "string"
      },
      "age": {
        "type": "int32"
      }
    }
  }
}
```

### 表达必需和可选字段

与 object 类型字段同级的 `required` 字段，用来描述必需和可选字段：

```json
{
  "some_concept": {
    "properties": {
      "foo": {},
      "bar": {}
    },
    "required": ["foo"]
  }
}
```

合理使用 `required` 字段确保关键数据的存在：

```json
{
  "name": "critical_cmd",
  "property": {
    "properties": {
      "essential_param": {
        "type": "string"
      },
      "optional_param": {
        "type": "int32"
      }
    },
    "required": ["essential_param"]
  }
}
```

### 表达 array 类型字段

使用 `items` 字段来描述 array 类型字段内每个元素的类型：

```json
{
  "my_array": {
    "type": "array",
    "items": {
      "type": "string"
    }
  }
}
```

### type 字段的使用原则

如果一个字段只能是特定类型（由 TEN Framework 本身约束），就不需要明确写 `type` 字段。如果字段可以是多种类型，则需要明确写 `type` 字段。

例如，下面的 `some_concept` 字段如果只能是 object 类型，就不需要明确写 `type` 字段。而其中的 `foo` 字段可以是多种类型，则需要明确写 `type` 字段：

```json
{
  "some_concept": {
    "properties": {
      "foo": {
        "type": "string"
      },
      "bar": {
        "type": "object",
        "properties": {
          "baz": {
            "type": "string"
          }
        },
        "required": ["baz"]
      }
    },
    "required": ["foo"]
  }
}
```

## 表达 enum 类型字段

使用 `enum` 字段来描述枚举类型的所有可能值：

```json
{
  "api": {
    "property": {
      "properties": {
        "status": {
          "type": "string",
          "enum": ["CREATING", "ACTIVE", "DELETING", "FAILED"]
        }
      }
    }
  }
}
```

## Extension Property Schema

定义 extension 属性的完整示例：

```json
{
  "api": {
    "property": {
      "properties": {
        "api_key": {
          "type": "string"
        },
        "max_tokens": {
          "type": "int64"
        },
        "temperature": {
          "type": "float64"
        },
        "config": {
          "type": "object",
          "properties": {
            "enabled": {
              "type": "bool"
            },
            "settings": {
              "type": "array",
              "items": {
                "type": "string"
              }
            }
          },
          "required": ["enabled"]
        }
      },
      "required": ["api_key", "max_tokens", "temperature", "config"]
    }
  }
}
```

## Command-like Message Schema

命令支持输入 (`cmd_in`) 和输出 (`cmd_out`)：

```json
{
  "api": {
    "cmd_in": [
      {
        "name": "process_text",
        "property": {
          "properties": {
            "text": {
              "type": "string"
            },
            "options": {
              "type": "object",
              "properties": {
                "language": {
                  "type": "string"
                },
                "max_length": {
                  "type": "int32"
                }
              }
            }
          },
          "required": ["text"]
        },
        "result": {
          "property": {
            "properties": {
              "processed_text": {
                "type": "string"
              },
              "confidence": {
                "type": "float32"
              }
            },
            "required": ["processed_text"]
          }
        }
      }
    ],
    "cmd_out": [
      {
        "name": "notify_completion",
        "property": {
          "properties": {
            "task_id": {
              "type": "string"
            },
            "status": {
              "type": "string"
            }
          },
          "required": ["task_id", "status"]
        }
      }
    ]
  }
}
```

## Data-like Message Schema

数据类型消息的 schema 定义：

```json
{
  "api": {
    "data_in": [
      {
        "name": "input_data",
        "property": {
          "properties": {
            "content": {
              "type": "string"
            },
            "metadata": {
              "type": "object",
              "properties": {
                "timestamp": {
                  "type": "int64"
                }
              }
            }
          },
          "required": ["content"]
        }
      }
    ],
    "data_out": [
      {
        "name": "output_data",
        "property": {
          "properties": {
            "result": {
              "type": "string"
            }
          }
        }
      }
    ],
    "audio_frame_in": [
      {
        "name": "audio_input"
      }
    ],
    "audio_frame_out": [
      {
        "name": "audio_output"
      }
    ],
    "video_frame_in": [
      {
        "name": "video_input"
      }
    ],
    "video_frame_out": [
      {
        "name": "video_output"
      }
    ]
  }
}
```

## 常见错误和解决方案

### 1. 属性名不符合规范

**错误示例**：属性名包含连字符或以数字开头

```json
{
  "api-key": {  // 错误：包含连字符
    "type": "string"
  },
  "2nd_param": {  // 错误：以数字开头
    "type": "int32"
  }
}
```

**正确示例**：

```json
{
  "api_key": {
    "type": "string"
  },
  "second_param": {
    "type": "int32"
  }
}
```

### 2. 数组类型缺少 items 定义

**错误示例**：

```json
{
  "my_array": {
    "type": "array"
    // 缺少 items 定义
  }
}
```

**正确示例**：

```json
{
  "my_array": {
    "type": "array",
    "items": {
      "type": "string"
    }
  }
}
```

### 3. 对象类型缺少 properties 定义

**错误示例**：

```json
{
  "my_object": {
    "type": "object"
    // 缺少 properties 定义
  }
}
```

**正确示例**：

```json
{
  "my_object": {
    "type": "object",
    "properties": {
      "field1": {
        "type": "string"
      }
    }
  }
}
```

## 总结

TEN Framework 的 Schema 系统提供了一个强大且结构化的方式来定义和验证数据结构，确保组件之间的一致性和类型安全。通过遵循设计原则和最佳实践，开发者可以创建健壮、可维护的 TEN 应用程序和扩展。

该系统支持丰富的类型定义、复杂的 API 描述以及灵活的消息转换功能，为构建大规模的实时多模态应用提供了坚实的基础。
