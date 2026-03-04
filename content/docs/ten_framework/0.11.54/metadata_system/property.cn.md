---
title: Property
---

## Property 文件概述

Property 文件是 TEN Framework 中用来存储扩展（extension）属性值的配置文件。它定义了扩展的运行时参数和配置选项，是扩展正常运行的重要组成部分。

## Property 文件格式

Property 文件采用 JSON 格式，包含扩展运行所需的各种配置参数，如 API 密钥、模型配置、运行参数等。

### 基础属性示例

以下是一个简单的 Property 文件示例：

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

### AI 模型配置示例

针对 AI 模型扩展的 Property 文件配置示例：

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

## 图配置

Property 文件还可以包含图配置（Graph Configuration），定义扩展之间的连接关系和数据流。

### 预定义图配置示例

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

## 使用说明

- Property 文件必须是有效的 JSON 格式
- 文件中的属性值会在扩展启动时被加载
- 可以通过修改 Property 文件来调整扩展的运行行为
- 图配置部分定义了扩展间的连接和数据流向
