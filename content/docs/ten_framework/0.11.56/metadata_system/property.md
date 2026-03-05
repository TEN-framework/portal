---
title: Property
---

## Property File Overview

The Property file is a configuration file in the TEN Framework used to store attribute values for extensions. It defines runtime parameters and configuration options for extensions, serving as an essential component for their proper operation.

## Property File Format

Property files use JSON format and contain various configuration parameters required for extension operation, such as API keys, model configurations, runtime parameters, etc.

### Basic Property Example

Here's a simple Property file example:

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

### AI Model Configuration Example

Property file configuration example for AI model extensions:

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

## Graph Configuration

Property files can also contain Graph Configuration, which defines connection relationships and data flow between extensions.

### Predefined Graph Configuration Example

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

## Usage Guidelines

- Property files must be in valid JSON format
- Property values are loaded when the extension starts
- Extension behavior can be adjusted by modifying the Property file
- The graph configuration section defines connections and data flow between extensions
