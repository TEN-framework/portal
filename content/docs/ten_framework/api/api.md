---
title: API
---

In the TEN Framework, the API definition of an extension is contained in the `manifest.json` file. When defining APIs, the TEN Framework does not use JSON Schema, but instead uses a JSON-like syntax to define API Schema.

## Why Not Use JSON Schema

The TEN Framework chooses not to use standard JSON Schema for the following reasons:

- **Type System Differences**: The TEN Framework's type system includes many types that JSON Schema does not have, such as `int8`, `int16`, `int32`, `int64`, `uint8`, `uint16`, `uint32`, `uint64`, `float32`, `float64`, `buf`, `ptr`, etc.

- **Reduce Redundancy**: In the TEN Framework's API definitions, many places do not need flexible settings. For example, a message's schema must be an object type and cannot be other types. Requiring developers to explicitly write `"type": "object"` would be redundant and confusing.

Based on these reasons, the TEN Framework adopts a more natural definition approach, using JSON-like syntax to define API Schema.

## Top-level API Definition

The API Schema definition is placed in the `api` field of the `manifest.json` file:

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

## API Schema Definition Patterns

### Expressing Object Type Fields

Use the `properties` field to describe the type of each property within an object type field:

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

### Expressing Required and Optional Fields

Use a `required` field at the same level as the object type field to describe required and optional fields:

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

### Expressing Array Type Fields

Use the `items` field to describe the type of each element within an array type field:

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

### Usage Principles for type Field

If a field can only be a specific type (constrained by the TEN Framework itself), there is no need to explicitly write the `type` field. If a field can be multiple types, then the `type` field needs to be explicitly written.

For example, if the `some_concept` field below can only be an object type, there is no need to explicitly write the `type` field. However, the `foo` field within it can be multiple types, so the `type` field needs to be explicitly written:

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

Use the `required` field appropriately to ensure the existence of critical data:

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

## Expressing Enum Type Fields

Use the `enum` field to describe all possible values of an enumeration type:

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

Complete example of defining extension properties:

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

Commands support input (`cmd_in`) and output (`cmd_out`):

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

Schema definitions for data-type messages:

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

## Common Errors and Solutions

### 1. Property Names Not Following Conventions

**Error Example**: Property names containing hyphens or starting with numbers

```json
{
  "api-key": {  // Error: contains hyphens
    "type": "string"
  },
  "2nd_param": {  // Error: starts with a number
    "type": "int32"
  }
}
```

**Correct Example**:

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

### 2. Array Type Missing items Definition

**Error Example**:

```json
{
  "my_array": {
    "type": "array"
    // Missing items definition
  }
}
```

**Correct Example**:

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

### 3. Object Type Missing properties Definition

**Error Example**:

```json
{
  "my_object": {
    "type": "object"
    // Missing properties definition
  }
}
```

**Correct Example**:

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

## Summary

The TEN Framework's Schema system provides a powerful and structured way to define and validate data structures, ensuring consistency and type safety between components. By following design principles and best practices, developers can create robust and maintainable TEN applications and extensions.

The system supports rich type definitions, complex API descriptions, and flexible message transformation capabilities, providing a solid foundation for building large-scale real-time multimodal applications.
