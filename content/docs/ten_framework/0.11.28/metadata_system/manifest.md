---
title: Manifest
---

## What is a Manifest File

A Manifest file is a crucial configuration file in the TEN Framework used to store metadata for software packages. It defines essential information about Extensions or Apps, including basic information, dependencies, API interfaces, script configurations, and other key details.

## Purpose of Manifest Files

- **Package Identification**: Define the package type, name, and version information
- **Dependency Management**: Declare required dependencies and their version requirements
- **API Definition**: Describe data interfaces and command interfaces provided by the package
- **Package Configuration**: Specify files to be included in the release version
- **Script Management**: Define automation scripts for building, testing, and other tasks

## Extension Manifest Example

Here's a complete Manifest example for an AI chat extension:

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

## App Manifest Example

Here's a Manifest example for a voice assistant application:

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

## Key Field Descriptions

### Basic Information

- **type**: Package type, can be `extension` or `app`
- **name**: Unique identifier name for the package
- **version**: Version number following semantic versioning standards
- **tags**: Array of tags for categorization and search

### Dependency Configuration

- **dependencies**: List of dependencies, each containing type, name, and version requirements

### Package Configuration

- **package.include**: Specifies files and directories to include during packaging

### API Configuration

- **api.property**: Defines configuration properties for the extension
- **api.data_in/data_out**: Defines data input and output interfaces
- **api.cmd_in/cmd_out**: Defines command input and output interfaces

### Script Configuration

- **scripts**: Defines various automation scripts such as testing, building, etc.

## Best Practices

1. **Version Management**: Use semantic versioning to ensure version consistency
2. **Dependency Declaration**: Clearly declare all required dependencies and their version ranges
3. **API Design**: Clearly define input and output interfaces for easy integration with other components
4. **Complete Documentation**: Ensure that configurations in the Manifest are consistent with actual implementation
