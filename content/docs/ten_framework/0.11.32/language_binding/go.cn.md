---
title: Go
---

让我们使用 TEN framework 构建一个 Go 应用程序。

## 创建 TEN 应用

首先，我们将通过集成几个预构建的 TEN 包来创建一个基本的 TEN Go 应用。请按照以下步骤操作：

```shell title="终端"
tman install app default_app_go
cd default_app_go

tman install protocol msgpack
tman install extension_group default_extension_group
```

### 安装默认的 TEN 扩展

接下来，安装一个用 Go 编写的默认 TEN 扩展：

```shell title="终端"
tman install extension default_extension_go
```

### 声明预构建的自动启动图

现在，我们将修改 TEN 应用的 `property.json` 文件，以包含图的声明。这将确保默认扩展在 TEN 应用启动时自动启动。

```json title="property.json"
"predefined_graphs": [
  {
    "name": "default",
    "auto_start": true,
    "nodes": [
      {
        "type": "extension_group",
        "name": "default_extension_group",
        "addon": "default_extension_group"
      },
      {
        "type": "extension",
        "name": "default_extension_go",
        "addon": "default_extension_go",
        "extension_group": "default_extension_group"
      }
    ]
  }
]
```

## 构建应用

与标准的 Go 项目不同，TEN Go 应用使用 CGo，因此您需要在构建之前设置某些环境变量。TEN runtime Go 绑定系统包中已经提供了一个构建脚本，因此您可以使用一个命令构建应用：

```shell title="终端"
go run ten_packages/system/ten_runtime_go/tools/build/main.go
```

编译后的二进制文件 `main` 将在 `/bin` 文件夹中生成。

## 启动应用

由于需要设置一些环境变量，建议使用提供的脚本来启动应用：

```shell title="终端"
./bin/start
```

## 调试

如果您使用 Visual Studio Code (VSCode) 作为开发环境，则可以使用以下配置来调试 Go/C 代码。

### 调试 Go 代码

```json title=".json"
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Go app (launch)",
      "type": "go",
      "request": "launch",
      "mode": "auto",
      "program": "${workspaceFolder}",
      "cwd": "${workspaceFolder}",
      "output": "${workspaceFolder}/bin/tmp",
      "env": {
        "LD_LIBRARY_PATH": "${workspaceFolder}/lib",
        "DYLD_LIBRARY_PATH": "${workspaceFolder}/lib",
        "CGO_LDFLAGS": "-L${workspaceFolder}/lib -lten_runtime_go -Wl,-rpath,@loader_path/lib"
      }
    }
  ]
}
```

### 调试 C 代码

```json title=".json"
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "C (launch)",
      "type": "lldb",
      "request": "launch",
      "program": "${workspaceFolder}/bin/main",
      "cwd": "${workspaceFolder}",
      "env": {
        "LD_LIBRARY_PATH": "${workspaceFolder}/lib",
        "DYLD_LIBRARY_PATH": "${workspaceFolder}/lib",
        "CGO_LDFLAGS": "-L${workspaceFolder}/lib -lten_runtime_go -Wl,-rpath,@loader_path/lib"
      }
    }
  ]
}
```

## CGO

### 生成的代码

当 Go 与 C 接口时，`cgo` 工具至关重要。当从 Go 调用 C 函数时，`cgo` 会将 Go 源文件转换为多个输出文件，包括 Go 和 C 源文件。然后，使用 gcc 或 clang 等编译器编译这些生成的 C 源文件。

使用以下命令生成这些 C/Go 源文件：

```bash title="终端"
mkdir out
go tool cgo -objdir out
```

示例：

```bash title="终端"
go tool cgo -objdir out cmd.go error.go
```

生成的文件包括：

```bash title="终端"
├── _cgo_export.c
├── _cgo_export.h
├── _cgo_flags
├── _cgo_gotypes.go
├── _cgo_main.c
├── _cgo_.o
├── cmd.cgo1.go
├── cmd.cgo2.c
├── error.cgo1.go
└── error.cgo2.c
```

- **`_cgo_export.h`** 是 cgo 上下文中 Go 和 C 之间互操作的关键。它包含可以从 C 访问的 Go 函数的必要声明。

  此文件是根据使用 `//export` 指令显式导出的 Go 函数自动生成的。它还包括与这些函数中使用的 Go 类型对应的 C 类型的定义，确保两种语言之间的兼容性。

  类型定义示例：

```c title=".h"
  typedef signed char GoInt8;
  typedef unsigned char GoUint8;
  typedef short GoInt16;
  typedef unsigned short GoUint16;
  typedef int GoInt32;
  typedef unsigned int GoUint32;
  typedef long long GoInt64;
  typedef unsigned long long GoUint64;
  typedef GoInt64 GoInt;
  typedef GoUint64 GoUint;
  typedef size_t GoUintptr;
  typedef float GoFloat32;
  typedef double GoFloat64;
```

- **`_cgo_gotypes.go`** 包含 C 中定义并在 Go 中使用的相应 Go 类型。

  例如，如果您在头文件 `common.h` 中定义了一个结构体 `ten_go_error_t` 并在 Go 中使用 `C.ten_go_error_t`，则在 `_cgo_gotypes.go` 中会有一个相应的 Go 类型：

```go title=".go"
  package ten

  type _Ctype_ten_go_status_t = _Ctype_struct_ten_go_status_t

  type _Ctype_struct_ten_go_status_t struct {
      err_no   _Ctype_int
      msg_size _Ctype_uint8_t
      err_msg  [256]_Ctype_char
      _        [3]byte
  }
```

- **`cmd.cgo1.go`** 是 `cgo` 生成的与原始 Go 源文件 `cmd.go` 对应的文件。它将对 C 函数和类型的直接调用替换为对 `cgo` 提供的生成的 Go 函数和类型的调用。

  示例：

```go title=".go"
  package ten

  func NewCmd(cmdName string) (Cmd, error) {
      // ...
      cStatus := func() _Ctype_struct_ten_go_status_t {
          var _cgo0 _cgo_unsafe.Pointer = unsafe.Pointer(unsafe.StringData(cmdName))
          var _cgo1 _Ctype_int = _Ctype_int(len(cmdName))
          _cgoBase2 := &bridge
          _cgo2 := _cgoBase2
          _cgoCheckPointer(_cgoBase2, 0 == 0)
          return _Cfunc_ten_go_cmd_create_custom_cmd(_cgo0, _cgo1, _cgo2)
      }()
      // ...
  }
```

- **`cmd.cgo2.c`** 是从 Go 调用的原始 C 函数的包装器。

  示例：

```c title=".c"
  CGO_NO_SANITIZE_THREAD void _cgo_cb1b98e39356_Cfunc_ten_go_cmd_create_custom_cmd(void *v) {
      struct {
          const void* p0;
          int p1;
          char __pad12[4];
          ten_go_msg_t** p2;
          ten_go_error_t r;
      } __attribute__((__packed__, __gcc_struct__)) *_cgo_a = v;
      char *_cgo_stktop = _cgo_topofstack();
      __typeof__(_cgo_a->r) _cgo_r;
      _cgo_tsan_acquire();
      _cgo_r = ten_go_cmd_create_cmd(_cgo_a->p0, _cgo_a->p1, _cgo_a->p2);
      _cgo_tsan_release();
      _cgo_a = (void*)((char*)_cgo_a + (_cgo_topofstack() - _cgo_stktop));
      _cgo_a->r = _cgo_r;
      _cgo_msan_write(&_cgo_a->r, sizeof(_cgo_a->r));
  }
```

因此，从 Go 调用 `C.ten_go_cmd_create_cmd()` 的调用顺序为：

```text
_Cfunc_ten_go_cmd_create_custom_cmd (自动生成的 Go)
           |
           V
   _cgo_runtime_cgocall (Go)
           |
           V
      entrysyscall     // 将 Go 堆栈切换到 C 堆栈
           |
           V
_cgo_cb1b98e39356_Cfunc_ten_go_cmd_create_custom_cmd (自动生成的 C)
           |
           V
   ten_go_cmd_create_cmd (C)
           |
           V
      exitsyscall
```

### 不完整类型

如前所述，`cgo` 工具会根据通过 `import "C"` 导入的 C 头文件在 `_cgo_gotypes.go` 中生成相应的 Go 类型。如果结构体在 C 头文件中是不透明的，则 `cgo` 工具会生成一个不完整类型。

不透明 C 结构体的示例：

```c title=".h"
typedef struct ten_go_msg_t ten_go_msg_t;
```

`cgo` 工具将在 Go 中生成一个不完整类型：

```go title=".go"
type _Ctype_ten_go_msg_t = _Ctype_struct_ten_go_msg_t
type _Ctype_struct_ten_go_msg_t _cgopackage.Incomplete
```

#### 如果在 Go 中使用不完整类型会发生什么？

- **无法分配不完整类型。**

  由于 `sys.NotInHeap` 无法在 Go 堆上分配，因此 `new` 或 `make` 等操作将不起作用。尝试在 Go 中创建不透明结构体的新实例将导致编译器错误：

```go title=".go"
  msg := new(C.ten_go_msg_t) // 错误：无法在 Go 中分配；它是不完整的（或不可分配的）
```

- **无法将指向不完整类型的指针直接传递给 C。**

  如果您的 C 函数具有指向不透明结构体的指针作为参数，则根据 cgo 规则，将 Go 指针直接传递给此不完整类型的 C 函数将不起作用。Go 编译器将要求指针“固定”，以确保它符合 Go 的垃圾收集器 (GC) 约束。

### 使用 `C.uintptr_t` 而不是指向不透明结构体的指针的规则

- **优点：**

  - Go 中的 `C.uintptr_t` 和 `uintptr` 是足够大的整数，可以保存 C 指针，从而避免从 Go 传递到 C 时进行内存分配或转换。

- **限制：**

  - `uintptr` 是一个整数，而不是指针。它表示没有指针运算的地址的位模式。
  - `uintptr` 无法在 Go 中解引用。将其转换为 `unsafe.Pointer` 可能会导致 Go 的 GC 出现问题。
  - 由于 `uintptr` 是一个整数，因此无法将 `nil` 或 `NULL` 传递给 C。使用 `0` 而不是 `nil` 来表示空地址。
