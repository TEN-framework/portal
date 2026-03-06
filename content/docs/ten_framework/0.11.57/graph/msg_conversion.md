---
title: Message Conversion
---

## Message Conversion

TEN Framework provides powerful message conversion capabilities that allow you to transform and modify message content during message passing. By configuring conversion rules, you can achieve message field renaming, value replacement, and complex data structure transformations.

### Basic Configuration

Message conversion is configured through the `msg_conversion` configuration item:

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

### Configuration Parameters

- **type**: Conversion type, currently supports `per_property` (per-property conversion)
- **keep_original**: Whether to retain original message content; when set to `false`, only converted fields are preserved
- **rules**: Array of conversion rules that define specific conversion logic

### Conversion Rules

Each conversion rule contains the following fields:

- **path**: Target field path, specifying the message field location to be set
- **conversion_mode**: Conversion mode
  - `fixed_value`: Set a fixed value
  - `from_original`: Copy value from a specified path in the original message
- **value**: Fixed value used when conversion mode is `fixed_value`
- **original_path**: When conversion mode is `from_original`, specifies the source field path in the original message

### Path Expressions

Path expressions in message conversion support multiple access methods:

- **Object Property Access**: `user.profile.name` - Access properties of nested objects
- **Array Index Access**: `items[0].name` - Access elements at specific array indices
- **Mixed Path Access**: `user.tags[1].value` - Combine object and array access

### Use Cases

Message conversion functionality is suitable for the following scenarios:

- **Field Renaming**: Convert field names in messages to formats required by target systems
- **Data Format Conversion**: Adjust message data structures to adapt to different processing modules
- **Default Value Setting**: Provide default values for missing fields
- **Data Cleansing**: Filter or transform data content that doesn't meet requirements
