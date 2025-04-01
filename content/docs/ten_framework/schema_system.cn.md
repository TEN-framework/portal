---
title: 模式系统
---

## 概述

TEN 框架使用模式系统在 TEN 运行平台内定义和验证数据结构（称为 TEN 值）。这些模式用于描述扩展的属性，以及它们之间交换的消息。这些模式确保了 TEN 框架不同组件之间的数据一致性、类型安全和正确的数据处理。

### TEN 框架模式示例

```json
{
  "api": {
    "property": {
      "exampleInt8": {
        "type": "int8"
      },
      "exampleString": {
        "type": "string"
      }
    },
    "cmd_in": [
      {
        "name": "cmd_1",
        "property": {
          "foo": {
            "type": "int8"
          },
          "bar": {
            "type": "string"
          }
        },
        "result": {
          "property": {
            "x": {
              "type": "int8"
            },
            "y": {
              "type": "string"
            }
          }
        }
      }
    ],
    "cmd_out": [],
    "data_in": [],
    "data_out": [],
    "video_frame_in": [],
    "video_frame_out": [],
    "audio_frame_in": [],
    "audio_frame_out": []
  }
}
```

## TEN 框架模式系统的设计原则

1. **对象原则**
   TEN 框架中每个字段的模式都必须定义为对象。这确保了所有模式定义中结构化和一致的格式。

   ```json
   {
     "foo": {
       "type": "int8"
     }
   }
   ```

   不正确的格式：

   ```json
   {
     "foo": "int8"
   }
   ```

2. **仅元数据原则**
   模式仅定义元数据，而不定义实际数据值。这种分离确保了模式仍然是用于验证的模板，并且不会与数据内容混合。
3. **冲突预防原则**
   在包含 TEN 模式的任何 JSON 级别中，除了保留字段（如 `_ten`）之外，所有字段都必须是用户定义的。这可以防止用户定义的字段和系统定义的字段之间发生冲突。

   具有用户定义字段的示例：

   ```json
   {
     "foo": "int8",
     "bar": "string"
   }
   ```

   具有保留 `_ten` 字段的示例：

   ```json
   {
     "_ten": {
       "xxx": {}
     },
     "foo": "int8",
     "bar": "string"
   }
   ```

## 在 TEN 模式中定义类型

### 原始类型

TEN 框架支持以下原始类型：

- int8, int16, int32, int64
- uint8, uint16, uint32, uint64
- float32, float64
- string
- bool
- buf
- ptr

类型定义示例：

```json
{
  "foo": {
    "type": "string"
  }
}
```

```json
{
  "foo": {
    "type": "int8"
  }
}
```

### 复杂类型

- **对象 (Object)**

  ```json
  {
    "foo": {
      "type": "object",
      "properties": {
        "foo": {
          "type": "int8"
        },
        "bar": {
          "type": "string"
        }
      }
    }
  }
  ```

- **数组 (Array)**

  ```json
  {
    "foo": {
      "type": "array",
      "items": {
        "type": "string"
      }
    }
  }
  ```

## 定义属性的 TEN 模式

### 属性模式示例

```json
{
  "exampleInt8": 10,
  "exampleString": "This is a test string.",
  "exampleArray": [0, 7],
  "exampleObject": {
    "foo": 100,
    "bar": "fine"
  }
}
```

### 相应的 TEN 模式

```json
{
  "api": {
    "property": {
      "exampleInt8": {
        "type": "int8"
      },
      "exampleString": {
        "type": "string"
      },
      "exampleArray": {
        "type": "array",
        "items": {
          "type": "int64"
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
        }
      }
    }
  }
}
```

## 定义命令的 TEN 模式

### 输入命令示例

```json
{
  "_ten": {
    "name": "cmd_foo",
    "seq_id": "123",
    "dest": [
      {
        "app": "msgpack://127.0.0.1:8001/",
        "graph": "default",
        "extension_group": "group_a",
        "extension": "extension_b"
      }
    ]
  },
  "foo": 3,
  "bar": "hello world"
}
```

### 相应的 TEN 模式

```json
{
  "api": {
    "cmd_in": [
      {
        "name": "cmd_foo",
        "_ten": {
          "name": {
            "type": "string"
          },
          "seq_id": {
            "type": "string"
          },
          "dest": {
            "type": "array",
            "items": {
              "type": "object",
              "properties": {
                "app": {
                  "type": "string"
                },
                "graph": {
                  "type": "string"
                },
                "extension_group": {
                  "type": "string"
                },
                "extension": {
                  "type": "string"
                }
              }
            }
          }
        },
        "property": {
          "foo": {
            "type": "int8"
          },
          "bar": {
            "type": "string"
          }
        }
      }
    ]
  }
}
```

为了避免冗余，TEN 框架允许您从模式定义中排除 `_ten` 字段，因为它是由运行平台保留和定义的。

### 定义命令结果

命令结果的定义类似于命令，但用于描述预期的响应：

```json
{
  "api": {
    "cmd_in": [
      {
        "name": "cmd_foo",
        "property": {
          "foo": {
            "type": "int8"
          },
          "bar": {
            "type": "string"
          }
        },
        "result": {
          "property": {
            "aaa": {
              "type": "int8"
            },
            "bbb": {
              "type": "string"
            }
          }
        }
      }
    ]
  }
}
```

## 定义数据、视频帧和音频帧的 TEN 模式

定义数据、视频帧和音频帧的模式的过程类似于命令，但没有 `result` 字段。

## 清单模式概述

`manifest.json` 文件包含扩展的属性和消息的模式定义。这些模式确保扩展的配置和通信遵循正确的结构和类型要求。

### `manifest.json` 示例

```json
{
  "type": "extension",
  "name": "A",
  "version": "1.0.0",
  "dependencies": [],
  "api": {
    "property": {
      "app_id": {
        "type": "string"
      },
      "channel": {
        "type": "string"
      },
      "log": {
        "type": "object",
        "properties": {
          "level": {
            "type": "uint8"
          },
          "redirect_stdout": {
            "type": "bool"
          },
          "file": {
            "type": "string"
          }
        }
      }
    },
    "cmd_in": [],
    "cmd_out": [],
    "data_in": [],
    "data_out": [],
    "video_frame_in": [],
    "video_frame_out": [],
    "audio_frame_in": [],
    "audio_frame_out": []
  }
}
```

### 结论

TEN 框架模式系统提供了一种健壮且结构化的方式来定义和验证数据结构，确保 TEN 运行平台中扩展及其交互之间的一致性和安全性。通过坚持对象结构、元数据关注和冲突预防的原则，该系统有助于组件之间清晰有效的通信。
