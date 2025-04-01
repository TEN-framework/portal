---
title: 类型系统
---

## 类型

TEN 框架类型系统是 TEN 框架内用于定义值的数据类型的系统。开发者可以通过 TEN 模式声明消息或扩展属性的类型。

TEN 框架类型系统包括基本类型和复合类型。基本类型包括以下内容：

| 类型    | 描述                             | C++ 类型             | Go 类型        | Python 类型            |
| ------- | -------------------------------- | -------------------- | -------------- | ---------------------- |
| int8    | 8 位有符号整数。                 | int8_t               | int8           | int                    |
| int16   | 16 位有符号整数。                | int16_t              | int16          | int                    |
| int32   | 32 位有符号整数。                | int32_t              | int32          | int                    |
| int64   | 64 位有符号整数。                | int64_t              | int64          | int                    |
| uint8   | 8 位无符号整数。                 | uint8_t              | uint8          | int                    |
| uint16  | 16 位无符号整数。                | uint16_t             | uint16         | int                    |
| uint32  | 32 位无符号整数。                | uint32_t             | uint32         | int                    |
| uint64  | 64 位无符号整数。                | uint64_t             | uint64         | int                    |
| float32 | 单精度（32 位）IEEE 754 浮点数。 | float                | float32        | float                  |
| float64 | 双精度（64 位）IEEE 754 浮点数。 | double               | float64        | float                  |
| string  | Unicode 字符序列。               | std::string / char\* | string         | str                    |
| buf     | 8 位无符号字节序列。             | uint8_t\*            | \[\]byte       | bytearray / memoryview |
| bool    | 二进制值，true 或 false。        | bool                 | bool           | bool                   |
| ptr     | 指向内存地址的指针。             | void\*               | unsafe.Pointer |                        |

复合类型包括以下内容：

| 类型   | 描述                                    | C++ 类型 | Go 类型 | Python 类型 |
| ------ | --------------------------------------- | -------- | ------- | ----------- |
| array  | 相同类型的元素集合。                    |          |         |             |
| object | 表示复杂的键/值对。键类型始终为字符串。 |          |         |             |

对于基本类型，可以使用 `get_property()` / `set_property()` 等方法访问或设置属性。例如：

```cpp
// 获取属性值
int32_t value = cmd.get_property_int32("property_name");

// 设置属性值
cmd.set_property("property_name", 100);
```

对于复合类型，通常需要使用相关的序列化方法。例如：

```go
type MyProp struct {
    Name string `json:"name"`
}

var prop MyProp
bytes, _ := json.Marshal(&prop)
cmd.SetPropertyFromJSONBytes("property_name", bytes)
```

## 类型和模式

如果指定了 TEN 模式，则将根据相应的 TEN 模式确定属性类型。如果未指定 TEN 模式，则将根据初始值赋值的类型确定属性类型。例如，如果初始赋值为 `int32_t`，则属性类型为 `int32_t`；如果使用 JSON 完成初始赋值，则将根据 JSON 处理规则确定类型。

## 转换规则

TEN 框架支持不同类型值之间的灵活自动转换。只要转换不会导致值丢失，TEN 框架将自动执行类型转换。但是，如果转换导致值丢失，例如将类型从 `int32_t` 转换为 `int8_t` 时，值超出了 `int8_t` 可以表示的范围，则 TEN 框架将报告错误。例如，对于 `send_<foo>` 操作，TEN 框架将返回一个错误。

### 安全且必须成功的转换

将较低精度类型转换为较高精度类型始终是安全的，并且保证成功，因为较高精度类型可以完全容纳较低精度类型的值而不会丢失数据。此自动转换称为安全转换。例如，当尝试将 `int8` 类型属性作为 `int32` 检索时，TEN 类型系统会自动将属性类型转换为 `int32`。

在 TEN 类型系统中，安全转换规则如下：

1. 在 `int` 类型中，从较低精度到较高精度。
2. 在 `uint` 类型中，从较低精度到较高精度。
3. 在 `float` 类型中，从较低精度到较高精度。

| 从      | 到（允许）               |
| ------- | ------------------------ |
| int8    | int16 / int32 / int64    |
| int16   | int32 / int64            |
| int32   | int64                    |
| uint8   | uint16 / uint32 / uint64 |
| uint16  | uint32 / uint64          |
| uint32  | uint64                   |
| float32 | float64                  |

例如：

```cpp
// 设置属性值。TEN 运行平台中 `property_name` 的类型为 `int32`。
cmd.set_property("property_name", 100);

// 获取属性值。正确。
int32_t value = cmd.get_property_int32("property_name");

// 获取属性值。正确。TEN 类型系统会自动将类型转换为 `int64`。
int64_t value2 = cmd.get_property_int64("property_name");

// 获取属性值。不正确，会抛出一个错误。
int16_t error_type = cmd.get_property_int16("property_name");
```

### 不安全且可能失败的转换

将较高精度类型转换为较低精度类型是不安全的，因为较高精度类型的值可能超出较低精度类型的范围，从而导致数据丢失。此转换称为不安全转换。执行不安全转换时，TEN 运行平台会检查溢出。如果发生溢出，TEN 类型系统将抛出一个错误。

在 TEN 框架类型系统中，不安全转换规则如下：

1. 将 `int64` 转换为较低精度的 `int`。
2. 将 `int64` 转换为任何精度的 `uint`。
3. 将 `float64` 转换为 `float32`。

| 从      | 到      | 从的正确值范围                                      |
| ------- | ------- | --------------------------------------------------- |
| int64   | int8    | \[-2^7, 2^7 - 1\]                                   |
| int64   | int16   | \[-2^15, 2^15 - 1\]                                 |
| int64   | int32   | \[-2^31, 2^31 - 1\]                                 |
| int64   | uint8   | \[0, 2^7 - 1\]                                      |
| int64   | uint16  | \[0, 2^15 - 1\]                                     |
| int64   | uint32  | \[0, 2^31 - 1\]                                     |
| int64   | uint64  | \[0, 2^63 - 1\]                                     |
| float64 | float32 | \[-3.4028234663852886e+38, 3.4028234663852886e+38\] |

重要的是要注意，TEN 运行平台仅在将 JSON 文档反序列化为 TEN 属性且 TEN 属性具有定义的 TEN 模式时才执行不安全转换。例如：

- 加载 `property.json` 时。

  对于整数，默认情况下它们将被解析为 `int64`；对于浮点数，默认情况下它们将被解析为 `float64`。TEN 框架类型系统将根据上面提到的规则执行不安全转换。

- 调用 `set_property_from_json()` 等方法时。

  当传递序列化的 JSON 字符串时，TEN 框架类型系统也将根据上面提到的规则执行不安全转换。
