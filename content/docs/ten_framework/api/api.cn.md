---
title: API
---

## 不使用 json schema 的理由

- api 定义在 manifest.json 内, 而不是一个独立的 schema 文件中.
- TEN framework 的 type system 天生不是 json schema 的类型系统. 它包含了很多 json schema 没有的类型. 例如 int8, int16, int32, int64, uint8, uint16, uint32, uint64, float32, float64, buf, ptr.
- 在 TEN framework 的 API 定义中, 不少地方并不需要具有弹性的设定, 例如 msg schema 一定是 object 类型, 不能是其他类型, 这时候如果需要开发者明确写 "type": "object" 反而显得多余, 且会 confuse. 例如 msg schema 的 property 字段, 一定是 object 类型, 不能是其他类型.

基于以上几个理由, TEN framework 的 API schema 如果采用 JSON schema 的定义方式, 会显得非常不自然, 且容易引起误解. 因此, TEN framework 的 API schema 采用了一种更自然的定义方式, 即使用一种类似 JSON 的语法来定义 API schema.

## API schema 的定义 pattern/原则

### 怎么引用其他 json

在各个地方如果要引用其他 json file, 统一使用 `import_uri` 字段来引用其他 json 文件. 例如:

```json
{
  "import_uri": "./description.json"
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

- **数组 (Array)**

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

- **对象 (Object)**

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
      },
      "required": ["name"]
    }
  }
  ```

### 如果一个字段一定只能是某个 type, 就不需要明确写 type 字段, 反之则需要明确写 type 字段

例如底下的 some_concept 字段一定只能是 object 类型, 就不须要明确写 type 字段. 儿里面的 foo 字段, 可以是多种 type, 则就需要明确写 `type` 字段.

```json
{
  "some_concept": {
    // 这边不需要一个多余的 type 字段用来指定 some_concept 一定是 object 类型, 因为这是 type system 的约束, 而不是 API 的约束. 如果需要明确写 type 字段, 则表示这个字段可以是多种 type.
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

## 顶层

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

## enum

```json
{
  "api": {
    "components": {
      "enums": { // <== 方法 1: 使用 enums 字段来定义 enum 类型
        "StatusEnum": {
          "type": "string", // enum 的基礎類型
          "values": ["CREATING", "ACTIVE", "DELETING", "FAILED"]
        },
        "LevelEnum": {
          "type": "int32",
          "values": [0, 1, 2, 3]
        }
      }
    },
    "property": {
      "properties": {
        "aaa": { "type": "StatusEnum" }, // 方法 1
        "bbb": {
          "type": "string",
          "enum": ["CREATING", "ACTIVE", "DELETING", "FAILED" ] // <== 方法 2: 提示工具可以显示或使用这些选项, 可能對 UI 的互動思維也比較 match
        }
      },
      "required": ["aaa"]
    }
  }
}
```

## 改动

```json
{
  "api": {
    "property": {
      "properties": {
        "aaa": { "type": "string" },
        "bbb": {
          "type": "string",
          "enum": ["CREATING", "ACTIVE", "DELETING", "FAILED" ]
        }
      },
      "required": ["aaa"]
    },
    "cmd_in": [
      {
        "name": "foo",
        "property": {
          "properties": {
            "foo": {
              "type": "array",
              "items": {
                "type": "object",
                "properties": {
                  "content": {
                    "type": "object",
                    "properties": {
                      "content": {
                        "type": "string"
                      }
                    },
                    "required": ["content"]
                  }
                }
              }
            }
          },
          "required": ["foo"]
        },
        "result": {
          "properties": {
            "response": {
              "type": "int32"
            }
          },
          "required": ["response"]
        }
      }
    ]
  }
}
```

## description

```json
{
  "type": "extension",
  "name": "aliyun_analyticdb_vector_storage",
  "version": "0.1.0",
  "description": {
    "en_US": "This is a description of the extension",
    "zh_TW": "這是一個擴展的描述",
    "zh_CN": "这是一个扩展的描述",
    "ja_JP": "これは拡張の説明です",
    // 或
    "import_uri": "./description.json"
  },
  "dependencies": [
    {
      "type": "system",
      "name": "ten_runtime_python",
      "version": "0.8"
    }
  ],
  "api": {
  }
}
```

## API Schema 定义

### 属性定义 (Property)

```json
{
  "api": {
    "property": {
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
    }
  }
}
```

### 命令定义 (Commands)

命令支持输入 (`cmd_in`) 和输出 (`cmd_out`)：

```json
{
  "api": {
    "cmd_in": [
      {
        "name": "process_text",
        "property": {
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
        "required": ["text"],
        "result": {
          "property": {
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
    ],
    "cmd_out": [
      {
        "name": "notify_completion",
        "property": {
          "task_id": {
            "type": "string"
          },
          "status": {
            "type": "string"
          }
        },
        "required": ["task_id", "status"]
      }
    ]
  }
}
```

### 数据流定义 (Data Flows)

支持多种数据流类型：

```json
{
  "api": {
    "data_in": [
      {
        "name": "input_data",
        "property": {
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
        }
      }
    ],
    "data_out": [
      {
        "name": "output_data",
        "property": {
          "result": {
            "type": "string"
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

## Property Schema 详解

### 基本 Property 文件

```json
{
  "api_key": "your-api-key-here",
  "max_tokens": 1000,
  "temperature": 0.7,
  "model_config": {
    "name": "gpt-4",
    "version": "2024-01-01"
  },
  "allowed_languages": ["en", "zh", "es"]
}
```

### 图配置 (Graph Configuration)

Property 文件还可以包含图配置：

```json
{
  "ten": {
    "predefined_graphs": [
      {
        "name": "default",
        "nodes": [
          {
            "type": "extension",
            "name": "my_extension",
            "addon": "my_extension_addon",
            "extension_group": "default_group",
            "property": {
              "setting1": "value1",
              "setting2": 42
            }
          }
        ],
        "connections": [
          {
            "extension": "source_extension",
            "cmd": [
              {
                "name": "process_cmd",
                "dest": [
                  {
                    "extension": "target_extension"
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  }
}
```

## 消息转换 (Message Conversion)

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

## 完整示例

### Extension Manifest 示例

```json
{
  "type": "extension",
  "name": "openai_chatgpt_python",
  "version": "0.1.0",
  "tags": ["ai", "llm", "python"],
  "dependencies": [
    {
      "type": "system",
      "name": "ten_runtime_python",
      "version": "^0.8.0"
    }
  ],
  "package": {
    "include": [
      "manifest.json",
      "property.json",
      "*.py",
      "README.md"
    ]
  },
  "api": {
    "property": {
      "api_key": {
        "type": "string"
      },
      "model": {
        "type": "string"
      },
      "max_tokens": {
        "type": "int64"
      },
      "temperature": {
        "type": "float64"
      }
    },
    "data_in": [
      {
        "name": "text_data",
        "property": {
          "text": {
            "type": "string"
          }
        }
      }
    ],
    "data_out": [
      {
        "name": "text_data",
        "property": {
          "text": {
            "type": "string"
          }
        }
      }
    ],
    "cmd_in": [
      {
        "name": "flush"
      },
      {
        "name": "tool_register",
        "property": {
          "tool": {
            "type": "object",
            "properties": {
              "name": {
                "type": "string"
              },
              "description": {
                "type": "string"
              },
              "parameters": {
                "type": "array",
                "items": {
                  "type": "object"
                }
              }
            },
            "required": ["name", "description", "parameters"]
          }
        },
        "result": {
          "property": {
            "response": {
              "type": "string"
            }
          }
        }
      }
    ],
    "cmd_out": [
      {
        "name": "tool_call",
        "property": {
          "name": {
            "type": "string"
          },
          "args": {
            "type": "string"
          }
        },
        "required": ["name"]
      }
    ]
  },
  "scripts": {
    "test": "python -m pytest tests/",
    "build": "python setup.py build"
  }
}
```

### App Manifest 示例

```json
{
  "type": "app",
  "name": "voice_assistant_app",
  "version": "1.0.0",
  "dependencies": [
    {
      "type": "system",
      "name": "ten_runtime_go",
      "version": "^0.8.0"
    }
  ],
  "api": {
    "property": {
      "app_id": {
        "type": "string"
      },
      "log_level": {
        "type": "uint8"
      },
      "server_config": {
        "type": "object",
        "properties": {
          "host": {
            "type": "string"
          },
          "port": {
            "type": "int32"
          },
          "ssl_enabled": {
            "type": "bool"
          }
        },
        "required": ["host", "port"]
      }
    }
  }
}
```

### Property 文件示例

```json
{
  "api_key": "sk-xxxxxxxxxxxxxxxxxxxxxxxx",
  "model": "gpt-4",
  "max_tokens": 4096,
  "temperature": 0.7,
  "top_p": 1.0,
  "frequency_penalty": 0.0,
  "presence_penalty": 0.0,
  "prompt": "You are a helpful AI assistant.",
  "greeting": "Hello! How can I help you today?",
  "max_memory_length": 10,
  "vendor": "openai"
}
```

## Schema 验证最佳实践

### 1. 在开发时验证

使用 `tman` 工具验证 manifest.json：

```bash
tman check manifest.json
```

使用 `tman` 工具验证 property.json：

```bash
tman check property.json
```

### 2. 必需字段的使用

合理使用 `required` 字段确保关键数据的存在：

```json
{
  "name": "critical_cmd",
  "property": {
    "essential_param": {
      "type": "string"
    },
    "optional_param": {
      "type": "int32"
    }
  },
  "required": ["essential_param"]
}
```

### 3. 嵌套对象的验证

对于复杂的嵌套对象，确保每层都有适当的验证：

```json
{
  "config": {
    "type": "object",
    "properties": {
      "database": {
        "type": "object",
        "properties": {
          "host": {
            "type": "string"
          },
          "port": {
            "type": "int32"
          },
          "credentials": {
            "type": "object",
            "properties": {
              "username": {
                "type": "string"
              },
              "password": {
                "type": "string"
              }
            },
            "required": ["username", "password"]
          }
        },
        "required": ["host", "port", "credentials"]
      }
    },
    "required": ["database"]
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

对于消息 schema ，`required` 字段只能出现在三个特定的位置：

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
            "required": ["foo"] // 3. 嵌套对象内的 required
          }
        },
        "required": ["a", "b"], // 1. 与 property 同级的 required
        "result": {
          "property": {
            "ccc": {
              "type": "buf"
            },
            "detail": {
              "type": "buf"
            }
          },
          "required": ["ccc"] // 2. result 内部的 required
        }
      }
    ],
    "data_out": [
      {
        "name": "data_has_required",
        "property": {
          "foo": {
            "type": "int8"
          },
          "nested": {
            "type": "object",
            "properties": {
              "c": {
                "type": "int8"
              },
              "d": {
                "type": "bool"
              }
            },
            "required": ["c", "d"] // 嵌套对象的多个必需字段
          }
        },
        "required": ["foo"] // data 消息的必需字段
      }
    ]
  }
}
```

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

在 TEN 运行平台将 `msg_X` 或 `result_Y` 传递给 extension 的 `on_<foo>()` 或结果处理程序之前，它会检查 `msg_X` 或 `result_Y` 的 schema 中定义的所有 `required` 字段是否都存在。如果缺少任何 `required` 字段，则 schema 检查将失败。

1. **如果传入的消息是 TEN 命令：**

   TEN 运行平台会将错误 `status_code` 结果返回给上一个 extension ，错误消息会指明缺少的必需字段。

2. **如果传入的消息是 TEN 命令结果：**

   TEN 运行平台会将结果的 `status_code` 更改为错误，添加缺少的 `required` 字段，并根据其类型将这些字段的值设置为默认值。

3. **如果传入的消息是 TEN 类似于数据的消息：**

   TEN 运行平台将直接丢弃类似于数据的消息。

### 错误消息格式

当 `required` 字段验证失败时，框架会提供详细的错误信息：

- 对于单个缺失字段：`"the required properties are absent: 'field_name'"`
- 对于多个缺失字段：`"the required properties are absent: 'field1', 'field2'"`
- 对于嵌套对象中的缺失字段：`".nested_object: the required properties are absent: 'field_name'"`

## 图检查的行为

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
