---
title: API
---

在 TEN framework 中, 一个 extension 的 API 定义, 包含在 manifest.json 文件中. TEN framework 定义 API 的时候, 不使用 json schema, 而是使用一种类似 JSON 的语法来定义 API schema.

## 不使用 json schema 的理由

- TEN framework 的类型系统天生不是 json schema 的类型系统, 包含了很多 json schema 没有的类型. 例如 int8, int16, int32, int64, uint8, uint16, uint32, uint64, float32, float64, buf, ptr.
- 在 TEN framework 的 API 定义中, 不少地方并不需要具有弹性的设定, 例如 message 的 schema 一定是 object 类型, 不能是其他类型, 这时候如果需要开发者明确写 `"type": "object"` 反而显得多余, 且会 confuse. 例如 message 的 property 字段, 一定是 object 类型, 不能是其他类型.

基于以上几个理由, TEN framework 的 API schema 如果采用 JSON schema 的定义方式, 会显得非常不自然, 且容易引起误解. 因此, TEN framework 的 API schema 采用了一种更自然的定义方式, 即使用一种类似 JSON 的语法来定义 API schema.

## API 顶层定义

API schema 的定义放在 manifest.json 文件中的一个名叫 `api` 的字段中, 如下:

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

## API schema 的定义 pattern

### 怎么表达一个 object 类型的字段

使用一个 `properties` 字段, 用来描述这个 object 类型的字段内的每个 property 的类型. 例如:

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

### 怎么表达一个 object 类型的字段内的必须跟可选字段

跟那个 object 类型的字段同级的一个 `required` 字段, 用来描述这个 object 类型的字段内的必须跟可选字段.

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

### 怎么表达一个 array 类型的字段

使用一个 `items` 字段, 用来描述这个 array 类型的字段内的每个 item 的类型. 例如:

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

### 如果一个字段一定只能是某个 type, 就不需要明确写 type 字段, 反之则需要明确写 type 字段

也就是说这是 TEN framework 本身的约束, 而不是用户定义的 API 的约束, 所以不需要明确写 type 字段, 如果有了这个字段, 反而会 confuse. 如果需要明确写 type 字段, 则表示这个字段可以是多种 type.

例如底下的 some_concept 字段如果一定只能是 object 类型, 就不须要明确写 type 字段. 儿里面的 foo 字段, 可以是多种 type, 则就需要明确写 `type` 字段.

```json
{
  "some_concept": {
    // 这边不需要一个多余的 type 字段用来指定 some_concept 一定是 object 类型
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

## 怎么表达一个 enum 类型的字段

使用一个 `enum` 字段, 用来描述这个 enum 类型的字段内的每个 value 的类型. 例如:

```json
{
  "api": {
    "property": {
      "properties": {
        "foo": {
          "type": "string",
          "enum": [ "CREATING", "ACTIVE", "DELETING", "FAILED" ]
        }
      }
    }
  }
}
```

## 怎么表达 extension property 的 schema

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

## 怎么表达 command-like message 的 schema

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

## 怎么表达 data-like message 的 schema

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

**错误**：属性名包含连字符或以数字开头

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

**正确**：

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

**错误**：

```json
{
  "my_array": {
    "type": "array"
    // 缺少 items 定义
  }
}
```

**正确**：

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

**错误**：

```json
{
  "my_object": {
    "type": "object"
    // 缺少 properties 定义
  }
}
```

**正确**：

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

## 结论

TEN framework 的 schema 系统提供了一个强大且结构化的方式来定义和验证数据结构，确保组件之间的一致性和类型安全。通过遵循设计原则和最佳实践，开发者可以创建健壮、可维护的 TEN 应用程序和扩展。

该系统支持丰富的类型定义、复杂的 API 描述、以及灵活的消息转换功能，为构建大规模的实时多模态应用提供了坚实的基础。
