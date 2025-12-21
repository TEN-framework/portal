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

| JSON 类型   | TEN 类型映射规则      |
| ----------- | ------------------- |
| 整数        | 如果值在 int32 范围内，优先映射为 int32；否则映射为 int64 |
| 浮点数      | 如果值在 float32 范围内，优先映射为 float32；否则映射为 float64 |
| 字符串      | 映射为 string     |
| 布尔值      | 映射为 bool       |
| null        | 映射为 null      |
| 数组        | 映射为 array      |
| 对象        | 映射为 object     |

需要注意的是，JSON 中的数字类型在没有明确 schema 定义的情况下，会根据数值大小自动选择合适的 TEN 类型。这确保了数据的精度和效率。

## 类型和 schema

如果指定了 TEN schema，则将根据相应的 TEN schema 确定属性类型。如果未指定 TEN schema，则将根据初始值赋值的类型确定属性类型。例如，如果初始赋值为 C++ 的 `int32_t`，则属性类型为 `int32`；如果使用 JSON 完成初始赋值，则将根据 JSON 处理规则确定类型。

当有 TEN schema 定义时，JSON 数据会被强制转换为 schema 指定的类型，如果转换失败则会报错。

## 转换规则

TEN framework 支持不同类型值之间的灵活自动转换。转换分为安全转换和不安全转换两种类型。

### 类型兼容性

TEN framework 使用类型兼容性规则来确定两个类型之间是否可以进行转换：

- **整数类型兼容**：所有整数类型（int8, int16, int32, int64, uint8, uint16, uint32, uint64）之间相互兼容
- **浮点数兼容整数**：浮点数类型可以接受整数类型的值（当整数值在浮点数表示范围内时）
- **其他类型**：bool, ptr, string, array, object, buf, null 类型只与自身兼容

### 安全转换（必须成功）

将较低精度类型转换为较高精度类型始终是安全的，并且保证成功，因为较高精度类型可以完全容纳较低精度类型的值而不会丢失数据。

在 TEN 类型系统中，安全转换规则如下：

1. 在有符号整数类型中，从较低精度到较高精度
2. 在无符号整数类型中，从较低精度到较高精度
3. 从较小范围的无符号整数到较大范围的有符号整数（当值在目标类型范围内时）
4. 在浮点数类型中，从 float32 到 float64

| 从      | 到（允许的安全转换）               |
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
// 设置属性值。TEN runtime 中 `property_name` 的类型为 `int32`。
cmd.set_property("property_name", 100);

// 获取属性值。正确。
int32_t value = cmd.get_property_int32("property_name");

// 获取属性值。正确。TEN 类型系统会自动将类型转换为 `int64`。
int64_t value2 = cmd.get_property_int64("property_name");

// 获取属性值。不正确，会抛出一个错误，因为这是不安全转换。
int16_t error_type = cmd.get_property_int16("property_name");
```

### 不安全转换（可能失败）

将较高精度类型转换为较低精度类型是不安全的，因为较高精度类型的值可能超出较低精度类型的范围，从而导致数据丢失。此转换称为不安全转换。执行不安全转换时，TEN runtime 会进行严格的范围检查。如果发生溢出或精度丢失，TEN 类型系统将抛出一个错误。

在 TEN framework 类型系统中，不安全转换包括：

1. 将较高精度整数转换为较低精度整数
2. 将有符号整数转换为无符号整数（当值为负数时）
3. 将无符号整数转换为有符号整数（当值超出有符号整数范围时）
4. 将 `float64` 转换为 `float32`
5. 将浮点数转换为整数（当有小数部分或超出整数范围时）
6. 整数到浮点数的转换（当可能发生精度丢失时）

| 转换类型        | 成功条件                                      |
| --------------- | ----------------------------------------- |
| 高精度 → 低精度 | 值必须在目标类型范围内                    |
| 有符号 → 无符号 | 值必须非负且在目标类型范围内              |
| 无符号 → 有符号 | 值必须在目标类型范围内                    |
| float64 → float32 | 值必须在 float32 范围内且不丢失精度 |
| 浮点数 → 整数   | 值必须在目标整数类型范围内且无小数部分    |
| 整数 → 浮点数   | 整数值必须能被浮点数精确表示，不发生精度丢失 |

#### 范围检查细节

TEN framework 实现了精确的范围检查算法：

- **整数范围检查**：使用标准的 MIN/MAX 常量进行比较
- **浮点数范围检查**：使用 `ldexp` 函数计算精确的边界值
- **精度检查**：对于整数到浮点数的转换，会进行往返转换验证以确保精度不丢失

### 转换触发时机

TEN runtime 在以下情况下执行类型转换：

1. **加载 `property.json` 时**
   - JSON 整数根据数值大小解析为相应的整数类型
   - JSON 浮点数根据数值大小解析为相应的浮点数类型
   - 如果属性有定义的 TEN schema，会根据 schema 进行强制类型转换（可能为不安全转换）

2. **调用 `set_property_from_json()` 等方法时**
   - 传递序列化的 JSON 字符串时，会根据 schema 执行类型转换

3. **属性访问时**
   - 使用 `get_property_xxx()` 方法获取属性时，会尝试将存储类型转换为请求类型
   - 这时可能触发安全或不安全转换

4. **消息传递时**
   - 当消息属性需要在不同类型之间转换时

### 错误处理

当类型转换失败时，TEN framework 会：

- 返回错误状态码和详细的错误信息
- 在错误对象中提供源类型、目标类型和失败原因
- 对于超出范围的转换，错误消息格式为："out of range of [target_type]"
- 对于不兼容的类型转换，错误消息格式为："unsupported conversion from `[source_type]` to `[target_type]`"

#### 常见错误示例

```cpp
// 范围溢出错误
int8_t small_value = cmd.get_property_int8("large_number");  // 如果 large_number = 200
// 错误：out of range of int8

// 类型不兼容错误
std::string str_value = cmd.get_property_string("integer_prop");
// 错误：unsupported conversion from `int32` to `string`

// 精度丢失错误
float float_value = cmd.get_property_float32("precise_double");  // 如果 precise_double 超出 float32 精度
// 错误：out of range of float32
```

## 最佳实践

1. **使用合适的类型**：根据数据的实际范围选择合适的整数和浮点数类型
2. **明确定义 schema**：在 manifest.json 中明确定义属性类型以避免类型转换歧义
3. **处理转换错误**：在代码中适当处理类型转换可能产生的错误
4. **注意 JSON 映射**：了解 JSON 数据到 TEN 类型的映射规则，避免意外的类型转换
