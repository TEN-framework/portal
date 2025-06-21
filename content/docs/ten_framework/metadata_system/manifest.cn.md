---
title: Manifest
---

## Manifest 文件

Manifest 文件是用来存储 extension 的元数据的文件。

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
