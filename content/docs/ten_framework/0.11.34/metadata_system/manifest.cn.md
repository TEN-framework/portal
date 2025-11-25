---
title: Manifest
---

## 什么是 Manifest 文件

Manifest 文件是 TEN Framework 中用于存储软件包元数据的重要配置文件。它定义了扩展（Extension）或应用（App）的基本信息、依赖关系、API 接口、脚本配置等关键信息。

## Manifest 文件的作用

- **包标识**：定义包的类型、名称和版本信息
- **依赖管理**：声明包所需的依赖项及其版本要求
- **API 定义**：描述包对外提供的数据接口和命令接口
- **打包配置**：指定需要包含在发布版本中的文件
- **脚本管理**：定义构建、测试等自动化脚本

## Extension Manifest 示例

以下是一个 AI 聊天扩展的完整 Manifest 示例：

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
      "properties": {
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
      }
    },
    "data_in": [
      {
        "name": "text_data",
        "property": {
          "properties": {
            "text": {
              "type": "string"
            }
          }
        }
      }
    ],
    "data_out": [
      {
        "name": "text_data",
        "property": {
          "properties": {
            "text": {
              "type": "string"
            }
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
          "properties": {
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
          }
        },
        "result": {
          "property": {
            "properties": {
              "response": {
                "type": "string"
              }
            }
          }
        }
      }
    ],
    "cmd_out": [
      {
        "name": "tool_call",
        "property": {
          "properties": {
            "name": {
              "type": "string"
            },
            "args": {
              "type": "string"
            }
          },
          "required": ["name"]
        }
      }
    ]
  },
  "scripts": {
    "test": "python -m pytest tests/",
    "build": "python setup.py build"
  }
}
```

## App Manifest 示例

以下是一个语音助手应用的 Manifest 示例：

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
      "properties": {
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
}
```

## 主要字段说明

### 基本信息

- **type**：包的类型，可以是 `extension` 或 `app`
- **name**：包的唯一标识名称
- **version**：遵循语义化版本规范的版本号
- **tags**：用于分类和搜索的标签数组

### 依赖配置

- **dependencies**：依赖项列表，每个依赖包含类型、名称和版本要求

### 打包配置

- **package.include**：指定打包时需要包含的文件和目录

### API 配置

- **api.property**：定义扩展的配置属性
- **api.data_in/data_out**：定义数据输入和输出接口
- **api.cmd_in/cmd_out**：定义命令输入和输出接口

### 脚本配置

- **scripts**：定义各种自动化脚本，如测试、构建等

## 最佳实践

1. **版本管理**：使用语义化版本控制，确保版本号的一致性
2. **依赖声明**：明确声明所有必需的依赖项及其版本范围
3. **API 设计**：清晰定义输入输出接口，便于其他组件集成
4. **文档完整**：确保 Manifest 中的配置与实际实现保持一致
