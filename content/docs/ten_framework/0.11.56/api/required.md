---
title: required
---

## Principles of the `required` Field

1. **In a communication link, the source's `required` field must be a superset of the target's `required` field**

   This means that if a target extension requires a field to be mandatory, then the source extension must also mark that field as required. This ensures that messages will not lack necessary fields during transmission.

2. **Fields with the same name in both source and target `required` fields must have compatible types**

   The framework validates field type compatibility to ensure data can be correctly transmitted and parsed. Type compatibility checks include basic type matching, array item type matching, and object property type matching.

3. **Graph Check validates the integrity of the entire message transmission path**

   - Checks whether the output message schema of the source extension is compatible with the input message schema of the target extension
   - Verifies the consistency of `required` fields throughout the transmission path
   - Ensures that message transformation rules (if any) correctly handle all required fields

Graph Check is performed before deployment, helping developers identify potential message transmission issues early and avoid runtime errors.

## Usage of the `required` Field

### When Extensions Send Messages

When an extension calls `send_<foo>(msg_X)` or `return_result(result_Y)`, the framework checks `msg_X` or `result_Y` against the corresponding schema in the extension. If `msg_X` or `result_Y` lacks any field marked as `required` in the schema, the schema check will fail.

The following three scenarios are handled in the same way:

1. **When sending a command and schema check fails**

   `send_<foo>` will immediately return `false`, and the error message will contain the schema check failure details.

2. **When `return_result` fails schema check**

   `return_result` will return `false`, and the error message will contain the schema check failure details, typically showing the missing required fields, such as: "the required properties are absent: 'foo'".

3. **When sending data-like messages (such as data, audio frames, or video frames)**

   `send_<foo>` will return `false`, and the error message will contain the schema check failure details.

**Note:** The framework's schema system only takes effect when fields are present. If a field is defined in the schema but does not exist in the message, and that field is not listed in `required`, no type checking will be performed. Type validation only occurs when fields exist both in the message and in the schema definition.

### When Extensions Receive Messages

Before the TEN runtime passes `msg_X` or `result_Y` to the extension's `on_<foo>()` or result handler, it checks whether all `required` fields defined in the schema of `msg_X` or `result_Y` are present. If any `required` fields are missing, the schema check will fail.

1. **When the incoming message is a command**

   The TEN runtime will return an error to the previous extension, with an error message indicating the missing required fields.

2. **When the incoming message is a TEN command result**

   The TEN runtime will change the result's `status_code` to error, add the missing `required` fields, and set the values of these fields to default values based on their types.

3. **When the incoming message is a data-type TEN message**

   The TEN runtime will directly discard the data-type message.

### Error Message Format

When `required` field validation fails, the framework provides detailed error information:

- Single missing field: `"the required properties are absent: 'field_name'"`
- Multiple missing fields: `"the required properties are absent: 'field1', 'field2'"`
- Missing fields in nested objects: `".nested_object: the required properties are absent: 'field_name'"`
