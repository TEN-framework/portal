---
title: Type System
---

## Types

The TEN framework type system is the system used within the TEN framework to define the data types of values. Developers can declare the types of messages or extension properties through TEN schema.

The TEN framework type system includes basic types and composite types. The basic types include the following:

| Type    | Description                                     |
| ------- | ----------------------------------------------- |
| null    | Null value type.                               |
| bool    | Boolean value, true or false.                  |
| int8    | 8-bit signed integer.                          |
| int16   | 16-bit signed integer.                         |
| int32   | 32-bit signed integer.                         |
| int64   | 64-bit signed integer.                         |
| uint8   | 8-bit unsigned integer.                        |
| uint16  | 16-bit unsigned integer.                       |
| uint32  | 32-bit unsigned integer.                       |
| uint64  | 64-bit unsigned integer.                       |
| float32 | Single precision (32-bit) IEEE 754 floating-point number. |
| float64 | Double precision (64-bit) IEEE 754 floating-point number. |
| string  | Unicode (UTF-8) character sequence.           |
| buf     | Sequence of 8-bit unsigned bytes.             |
| ptr     | Pointer to a memory address.                   |

Composite types include the following:

| Type   | Description                                                    |
| ------ | -------------------------------------------------------------- |
| array  | Collection of elements of the same type.                      |
| object | Represents complex key/value pairs. Key type is always string. |

For basic types, properties can be accessed or set using methods such as `get_property()` / `set_property()`. For example:

```cpp
// Get property value
int32_t value = cmd.get_property_int32("property_name");

// Set property value
cmd.set_property("property_name", 100);
```

For composite types, it is typically necessary to use related serialization methods. For example:

```go
type MyProp struct {
    Name string `json:"name"`
}

var prop MyProp
bytes, _ := json.Marshal(&prop)
cmd.SetPropertyFromJSONBytes("property_name", bytes)
```

## JSON Type Mapping

When creating TEN values from JSON, the TEN framework uses the following mapping rules:

| JSON Type   | TEN Type Mapping Rules |
| ----------- | ---------------------- |
| Integer     | Maps to int32 if the value is within int32 range; otherwise maps to int64 |
| Float       | Maps to float32 if the value is within float32 range; otherwise maps to float64 |
| String      | Maps to string         |
| Boolean     | Maps to bool           |
| null        | Maps to null           |
| Array       | Maps to array          |
| Object      | Maps to object         |

It's important to note that JSON numeric types, when no explicit schema is defined, will automatically select the appropriate TEN type based on the numeric value size. This ensures data precision and efficiency.

## Types and Schema

If a TEN schema is specified, the property type will be determined according to the corresponding TEN schema. If no TEN schema is specified, the property type will be determined based on the type of the initial value assignment. For example, if the initial assignment is C++'s `int32_t`, the property type will be `int32`; if the initial assignment is done using JSON, the type will be determined according to JSON processing rules.

When a TEN schema is defined, JSON data will be forcibly converted to the type specified by the schema. If the conversion fails, an error will be reported.

## Conversion Rules

The TEN framework supports flexible automatic conversion between different types of values. Conversions are divided into two types: safe conversions and unsafe conversions.

### Type Compatibility

The TEN framework uses type compatibility rules to determine whether conversion between two types is possible:

- **Integer type compatibility**: All integer types (int8, int16, int32, int64, uint8, uint16, uint32, uint64) are mutually compatible
- **Float compatible with integer**: Floating-point types can accept values of integer types (when the integer value is within the floating-point representation range)
- **Other types**: bool, ptr, string, array, object, buf, null types are only compatible with themselves

### Safe Conversion (Must Succeed)

Converting a lower precision type to a higher precision type is always safe and guaranteed to succeed, as the higher precision type can fully accommodate the value of the lower precision type without data loss.

In the TEN type system, safe conversion rules are as follows:

1. Within signed integer types, from lower to higher precision
2. Within unsigned integer types, from lower to higher precision
3. From smaller range unsigned integers to larger range signed integers (when the value is within the target type range)
4. Within floating-point types, from float32 to float64

| From    | To (Allowed Safe Conversions)                  |
| ------- | ---------------------------------------------- |
| int8    | int16 / int32 / int64                         |
| int16   | int32 / int64                                 |
| int32   | int64                                         |
| uint8   | uint16 / uint32 / uint64 / int16 / int32 / int64 |
| uint16  | uint32 / uint64 / int32 / int64              |
| uint32  | uint64 / int64                               |
| float32 | float64                                       |

For example:

```cpp
// Set property value. The type of `property_name` in TEN runtime is `int32`.
cmd.set_property("property_name", 100);

// Get property value. Correct.
int32_t value = cmd.get_property_int32("property_name");

// Get property value. Correct. TEN type system will automatically convert the type to `int64`.
int64_t value2 = cmd.get_property_int64("property_name");

// Get property value. Incorrect, an error will be thrown because this is an unsafe conversion.
int16_t error_type = cmd.get_property_int16("property_name");
```

### Unsafe Conversion (May Fail)

Converting a higher precision type to a lower precision type is unsafe because the value of the higher precision type may exceed the range of the lower precision type, leading to data loss. This conversion is called unsafe conversion. When performing unsafe conversion, the TEN runtime performs strict range checking. If an overflow or precision loss occurs, the TEN type system will throw an error.

In the TEN framework type system, unsafe conversions include:

1. Converting higher precision integers to lower precision integers
2. Converting signed integers to unsigned integers (when the value is negative)
3. Converting unsigned integers to signed integers (when the value exceeds the signed integer range)
4. Converting `float64` to `float32`
5. Converting floating-point numbers to integers (when there are decimal parts or the value exceeds integer range)
6. Converting integers to floating-point numbers (when precision loss may occur)

| Conversion Type         | Success Condition                                    |
| ----------------------- | ---------------------------------------------------- |
| High precision → Low precision | Value must be within target type range         |
| Signed → Unsigned       | Value must be non-negative and within target type range |
| Unsigned → Signed       | Value must be within target type range              |
| float64 → float32       | Value must be within float32 range without precision loss |
| Floating-point → Integer | Value must be within target integer type range and have no decimal part |
| Integer → Floating-point | Integer value must be exactly representable in floating-point without precision loss |

#### Range Check Details

TEN framework implements precise range checking algorithms:

- **Integer range checking**: Uses standard MIN/MAX constants for comparison
- **Floating-point range checking**: Uses `ldexp` function to calculate precise boundary values
- **Precision checking**: For integer to floating-point conversion, performs round-trip conversion verification to ensure no precision loss

### When Conversion Is Triggered

The TEN runtime performs type conversion in the following situations:

1. **When loading `property.json`**
   - JSON integers are parsed to appropriate integer types based on numeric value size
   - JSON floating-point numbers are parsed to appropriate floating-point types based on numeric value size
   - If the property has a defined TEN schema, forced type conversion will be performed according to the schema (may be unsafe conversion)

2. **When calling methods like `set_property_from_json()`**
   - When passing serialized JSON strings, type conversion will be performed according to the schema

3. **During property access**
   - When using `get_property_xxx()` methods to get properties, the system will attempt to convert the stored type to the requested type
   - This may trigger safe or unsafe conversions

4. **During message passing**
   - When message properties need to be converted between different types

### Error Handling

When type conversion fails, the TEN framework will:

- Return error status codes and detailed error information
- Provide source type, target type, and failure reason in the error object
- For out-of-range conversions, the error message format is: "out of range of [target_type]"
- For incompatible type conversions, the error message format is: "unsupported conversion from `[source_type]` to `[target_type]`"

#### Common Error Examples

```cpp
// Range overflow error
int8_t small_value = cmd.get_property_int8("large_number");  // If large_number = 200
// Error: out of range of int8

// Type incompatibility error
std::string str_value = cmd.get_property_string("integer_prop");
// Error: unsupported conversion from `int32` to `string`

// Precision loss error
float float_value = cmd.get_property_float32("precise_double");  // If precise_double exceeds float32 precision
// Error: out of range of float32
```

## Best Practices

1. **Use appropriate types**: Choose suitable integer and floating-point types based on the actual data range
2. **Explicitly define schema**: Clearly define property types in manifest.json to avoid type conversion ambiguity
3. **Handle conversion errors**: Properly handle potential errors from type conversions in your code
4. **Understand JSON mapping**: Be aware of JSON data to TEN type mapping rules to avoid unexpected type conversions
