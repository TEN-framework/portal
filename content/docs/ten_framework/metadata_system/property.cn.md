---
title: Property
---

## Property 文件

Property 文件是用来存储 extension 的属性值的文件。

### Property 文件示例

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

### 图配置

Property 文件可以包含图配置，例如：

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
