---
title: 类型系统
---

## 类型

TEN framework 类型系统是 TEN framework 内用于定义值的数据类型的系统。开发者可以通过 TEN schema 声明 message 或 extension property 的类型。

TEN framework 类型系统包括基本类型和复合类型。基本类型包括以下内容：

| 类型    | 描述                             |
| ------- | -------------------------------- |
| null    | 空值类型。                       |
| bool    | 布尔值，true 或 false。          |
| int8    | 8 位有符号整数。                 |
| int16   | 16 位有符号整数。                |
| int32   | 32 位有符号整数。                |
| int64   | 64 位有符号整数。                |
| uint8   | 8 位无符号整数。                 |
| uint16  | 16 位无符号整数。                |
| uint32  | 32 位无符号整数。                |
| uint64  | 64 位无符号整数。                |
| float32 | 单精度（32 位）IEEE 754 浮点数。 |
| float64 | 双精度（64 位）IEEE 754 浮点数。 |
| string  | Unicode (UTF-8) 字符序列。       |
| buf     | 8 位无符号字节序列。             |
| ptr     | 指向内存地址的指针。             |

复合类型包括以下内容：

| 类型   | 描述                                    |
| ------ | --------------------------------------- |
| array  | 相同类型的元素集合。                    |
| object | 表示复杂的键/值对。键类型始终为字符串。 |

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

## JSON 类型映射

当从 JSON 创建 TEN value 时，TEN framework 使用以下映射规则：

| JSON 类型   | TEN 类型映射      |
| ----------- | -------------   |
| 整数        | 映射为 int64      |
| 浮点数      | 映射为 float64    |
| 字符串      | 映射为 string     |
| 布尔值      | 映射为 bool       |
| null        | 映射为 null      |
| 数组        | 映射为 array      |
| 对象        | 映射为 object     |

## 类型和 schema

如果指定了 TEN schema，则将根据相应的 TEN schema 确定属性类型。如果未指定 TEN schema，则将根据初始值赋值的类型确定属性类型。例如，如果初始赋值为 C++ 的 `int32_t`，则属性类型为 `int32`；如果使用 JSON 完成初始赋值，则将根据 JSON 处理规则确定类型。

## 转换规则

TEN framework 支持不同类型值之间的灵活自动转换。转换分为安全转换和不安全转换两种类型。

### 类型兼容性

TEN framework 使用类型兼容性规则来确定两个类型之间是否可以进行转换：

- **整数类型兼容**：所有整数类型（int8, int16, int32, int64, uint8, uint16, uint32, uint64）之间相互兼容
- **浮点数兼容整数**：浮点数类型可以接受整数类型的值
- **其他类型**：bool, ptr, string, array, object, buf, null 类型只与自身兼容

### 安全转换（必须成功）

将较低精度类型转换为较高精度类型始终是安全的，并且保证成功，因为较高精度类型可以完全容纳较低精度类型的值而不会丢失数据。

在 TEN 类型系统中，安全转换规则如下：

1. 在有符号整数类型中，从较低精度到较高精度
2. 在无符号整数类型中，从较低精度到较高精度
3. 在浮点数类型中，从较低精度到较高精度
4. 从较小范围的无符号整数到较大范围的有符号整数

| 从      | 到（允许）               |
| ------- | ------------------------ |
| int8    | int16 / int32 / int64    |
| int16   | int32 / int64            |
| int32   | int64                    |
| uint8   | uint16 / uint32 / uint64 / int16 / int32 / int64 |
| uint16  | uint32 / uint64 / int32 / int64 |
| uint32  | uint64 / int64           |
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

### 不安全转换（可能失败）

将较高精度类型转换为较低精度类型是不安全的，因为较高精度类型的值可能超出较低精度类型的范围，从而导致数据丢失。此转换称为不安全转换。执行不安全转换时，TEN 运行平台会检查溢出。如果发生溢出，TEN 类型系统将抛出一个错误。

在 TEN framework 类型系统中，不安全转换包括：

1. 将较高精度整数转换为较低精度整数
2. 将有符号整数转换为无符号整数（当值为负数时）
3. 将无符号整数转换为有符号整数（当值超出有符号整数范围时）
4. 将 `float64` 转换为 `float32`
5. 将浮点数转换为整数（当有小数部分或超出整数范围时）

| 转换类型        | 条件                                      |
| --------------- | ----------------------------------------- |
| 高精度 → 低精度 | 值必须在目标类型范围内                    |
| 有符号 → 无符号 | 值必须非负且在目标类型范围内              |
| 无符号 → 有符号 | 值必须在目标类型范围内                    |
| float64 → float32 | 值必须在 float32 范围内：\[-3.4028234663852886e+38, 3.4028234663852886e+38\] |
| 浮点数 → 整数   | 值必须在目标整数类型范围内且无小数部分    |

### 转换触发时机

TEN 运行平台在以下情况下执行类型转换：

1. **加载 `property.json` 时**
   - JSON 整数默认解析为 `int64`
   - JSON 浮点数默认解析为 `float64`
   - 如果属性有定义的 TEN schema，会根据 schema 进行不安全转换

2. **调用 `set_property_from_json()` 等方法时**
   - 传递序列化的 JSON 字符串时，也会根据 schema 执行不安全转换

3. **属性访问时**
   - 使用 `get_property_xxx()` 方法获取属性时，会尝试将存储类型转换为请求类型

### 错误处理

当类型转换失败时，TEN framework 会：

- 返回错误状态（如 `send_<foo>` 操作返回错误）
- 在错误对象中提供详细的错误信息，包括源类型、目标类型和失败原因
- 对于超出范围的转换，错误消息类似："out of range of int8"
- 对于不兼容的类型转换，错误消息类似："unsupported conversion from `uint64` to `string`"
