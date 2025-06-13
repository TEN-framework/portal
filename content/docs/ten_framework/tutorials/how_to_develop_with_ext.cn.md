---
title: TEN 扩展开发完整指南
---

TEN Framework 提供了丰富的扩展模板，帮助开发者从零开始创建扩展并完成完整的开发测试流程。本指南将通过实践操作，详细介绍 C++、Go 和 Python 三种语言的扩展开发全流程。

## 前置准备

### 环境要求

在开始开发之前，请确保您的开发环境已正确配置：

```bash
tman --version
```

您应该看到类似以下的输出：

```bash
TEN Framework version: <version>
...
```

> **注意**：请确保您使用的 `tman` 版本 >= 0.10.12，否则请从 [GitHub Releases](https://github.com/TEN-framework/ten-framework/releases) 下载最新版本。

### 基本流程概述

每种语言的扩展开发都遵循以下标准流程：

1. **创建扩展** - 使用模板生成扩展骨架
2. **安装依赖** - 配置运行时环境和依赖包
3. **开发实现** - 编写扩展逻辑和业务代码
4. **构建测试** - 编译（如需要）并运行测试
5. **调试优化** - 使用调试工具定位和解决问题

---

## C++ 扩展开发

C++ 扩展适合对性能要求极高的场景，如实时音视频处理、高频计算等。

### 创建项目

使用 TEN 提供的 C++ 扩展模板创建新项目：

```bash
tman create extension my_example_ext_cpp --template default_extension_cpp
```

创建成功后，项目结构如下：

```
my_example_ext_cpp/
├── BUILD.gn              # GN 构建配置文件
├── manifest.json         # 扩展元数据配置
├── property.json         # 扩展属性配置
├── src/
│   └── main.cc          # 扩展主要实现代码
├── tests/
│   ├── basic.cc         # 基础测试用例
│   └── gtest_main.cc    # 测试框架入口
├── include/             # 头文件目录
├── tools/               # 工具脚本
└── .vscode/
    └── launch.json      # VSCode 调试配置
```

### 环境配置

进入项目目录并验证构建工具：

```bash
cd my_example_ext_cpp
tgn --version
```

> **提示**：预期输出
```bash
0.1.0
```
如果命令不存在，请确保已正确安装 TEN Framework 开发环境。

### 安装依赖

安装扩展运行所需的依赖包：

```bash
tman install --standalone
```

成功安装后的输出示例：

```bash
📦  Get all installed packages...
🔍  Filter compatible packages...
🔒  Creating manifest-lock.json...
📥  Installing packages...
  [00:00:00] [########################################]       3/3       Done

🏆  Install successfully in 1 second
```

### 构建扩展

TEN 提供两种构建方式：

**方式一：手动构建**

```bash
# 生成构建配置（启用独立测试）
tgn gen linux x64 debug -- ten_enable_standalone_test=true

# 执行构建
tgn build linux x64 debug
```

**方式二：tman 快捷命令**

```bash
tman run build
```

构建成功后，检查生成的测试文件：

```bash
ls -la bin/
# 应该包含：my_example_ext_cpp_test
```

### 运行测试

**方式一：直接执行**

```bash
./bin/my_example_ext_cpp_test
```

**方式二：tman 命令**

```bash
tman run test
```

测试成功的输出示例：

```bash
Running main() from ../../../tests/gtest_main.cc
[==========] Running 1 test from 1 test case.
[----------] 1 test from Test
[ RUN      ] Test.Basic
[       OK ] Test.Basic (20 ms)
[==========] 1 test from 1 test case ran. (79 ms total)
[  PASSED  ] 1 test.
```

> **成功**：看到 `[  PASSED  ] 1 test.` 表示测试成功通过。

### 代码结构解析

#### 扩展主体（src/main.cc）

C++ 扩展的核心类继承自 `ten::extension_t`，主要实现以下生命周期方法：

```cpp
class my_example_ext_cpp_t : public ten::extension_t {
 public:
  // 扩展初始化 - 设置配置和资源
  void on_init(ten::ten_env_t &ten_env) override;
  
  // 扩展启动 - 开始处理业务逻辑
  void on_start(ten::ten_env_t &ten_env) override;
  
  // 命令处理 - 处理来自其他扩展的命令
  void on_cmd(ten::ten_env_t &ten_env, std::unique_ptr<ten::cmd_t> cmd) override;
  
  // 数据处理 - 处理数据流
  void on_data(ten::ten_env_t &ten_env, std::unique_ptr<ten::data_t> data) override;
  
  // 音频帧处理 - 处理实时音频数据
  void on_audio_frame(ten::ten_env_t &ten_env, std::unique_ptr<ten::audio_frame_t> frame) override;
  
  // 视频帧处理 - 处理实时视频数据  
  void on_video_frame(ten::ten_env_t &ten_env, std::unique_ptr<ten::video_frame_t> frame) override;
  
  // 扩展停止 - 清理资源
  void on_stop(ten::ten_env_t &ten_env) override;
};
```

#### 测试框架（tests/basic.cc）

使用 TEN 提供的测试框架编写单元测试：

```cpp
class my_example_ext_cpp_tester : public ten::extension_tester_t {
 public:
  void on_start(ten::ten_env_tester_t &ten_env) override {
    // 创建测试命令
    auto new_cmd = ten::cmd_t::create("foo");
    
    // 发送命令并验证响应
    ten_env.send_cmd(std::move(new_cmd), [](/* callback parameters */) {
      // 验证测试结果
    });
  }
};
```

### 调试配置

#### VSCode 调试

1. 安装 **CodeLLDB** 扩展
2. 在代码中设置断点
3. 选择 "standalone test (lldb, launch)" 配置
4. 按 F5 开始调试

调试配置文件 `.vscode/launch.json`：

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "standalone test (lldb, launch)",
      "type": "lldb",
      "request": "launch",
      "program": "${workspaceFolder}/bin/my_example_ext_cpp_test",
      "cwd": "${workspaceFolder}"
    }
  ]
}
```

#### 命令行调试

使用 GDB 进行命令行调试：

```bash
gdb ./bin/my_example_ext_cpp_test
(gdb) run
(gdb) bt  # 查看调用栈
```

---

## Go 扩展开发

Go 扩展平衡了性能和开发效率，适合网络服务、并发处理等场景。

### 创建项目

```bash
tman create extension my_example_ext_go --template default_extension_go --template-data class_name_prefix=Example
```

成功创建后的输出：

```bash
🏆  Package 'extension:my_example_ext_go' created successfully in '/path/to/your/project' in 1 second.
```

项目结构：

```
my_example_ext_go/
├── extension.go          # 扩展实现代码
├── go.mod               # Go 模块配置
├── manifest.json        # 扩展元数据
├── property.json        # 扩展属性
├── README.md           # 项目说明
├── tests/              # 测试目录
│   ├── basic_tester.go      # 测试实现
│   ├── basic_tester_test.go # 测试用例
│   ├── main_test.go         # 测试入口
│   └── bin/start           # 测试启动脚本
└── .vscode/launch.json     # 调试配置
```

### 安装依赖

```bash
tman install --standalone
```

### 运行测试

**方式一：启动脚本**

```bash
./tests/bin/start
```

**方式二：tman 命令**

```bash
tman run test
```

测试成功输出：

```bash
=== RUN   TestBasicExtensionTester
--- PASS: TestBasicExtensionTester (0.01s)
PASS
```

### 代码结构解析

#### 扩展实现（extension.go）

```go
import (
    ten "ten_framework/ten_runtime"
)

type ExampleExtension struct {
    ten.DefaultExtension
}

// 扩展启动
func (e *ExampleExtension) OnStart(tenEnv ten.TenEnv) {
    tenEnv.LogDebug("OnStart")
    tenEnv.OnStartDone()
}

// 命令处理
func (e *ExampleExtension) OnCmd(tenEnv ten.TenEnv, cmd ten.Cmd) {
    tenEnv.LogDebug("OnCmd")
    cmdResult, _ := ten.NewCmdResult(ten.StatusCodeOk, cmd)
    tenEnv.ReturnResult(cmdResult, nil)
}

// 扩展停止
func (e *ExampleExtension) OnStop(tenEnv ten.TenEnv) {
    tenEnv.LogDebug("OnStop")
    tenEnv.OnStopDone()
}
```

#### 测试框架（tests/basic_tester.go）

```go
type BasicExtensionTester struct {
    ten.DefaultExtensionTester
}

func (tester *BasicExtensionTester) OnStart(tenEnvTester ten.TenEnvTester) {
    // 创建测试命令
    cmdTest, _ := ten.NewCmd("test")
    
    // 发送命令并处理响应
    tenEnvTester.SendCmd(cmdTest, func(tet ten.TenEnvTester, cr ten.CmdResult, err error) {
        if err != nil {
            panic(err)
        }
        statusCode, _ := cr.GetStatusCode()
        if statusCode != ten.StatusCodeOk {
            panic(statusCode)
        }
        tenEnvTester.StopTest(nil)
    })
    
    tenEnvTester.OnStartDone()
}
```

### 开发环境配置

为便于开发和调试，在扩展根目录创建 `go.work` 文件：

```go
go 1.18

use (
    .
    .ten/app/ten_packages/system/ten_runtime_go/interface
)
```

### 调试配置

#### VSCode 调试

确保安装 Go 扩展，然后使用以下配置：

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "standalone test (go, launch)",
      "type": "go",
      "request": "launch",
      "mode": "test",
      "program": "${workspaceFolder}/tests/",
      "env": {
        "CGO_LDFLAGS": "-L${workspaceFolder}/.ten/app/ten_packages/system/ten_runtime/lib -L${workspaceFolder}/.ten/app/ten_packages/system/ten_runtime_go/lib -lten_runtime -lten_runtime_go",
        "LD_LIBRARY_PATH": "${workspaceFolder}/.ten/app/ten_packages/system/ten_runtime/lib:${workspaceFolder}/.ten/app/ten_packages/system/ten_runtime_go/lib"
      },
      "args": ["-test.v"]
    }
  ]
}
```

---

## Python 扩展开发

Python 扩展开发效率最高，适合快速原型开发、AI/ML 应用和复杂业务逻辑。

### 创建项目

```bash
tman create extension my_example_ext_python --template default_async_extension_python --template-data class_name_prefix=Example
```

项目结构：

```
my_example_ext_python/
├── extension.py         # 扩展实现代码
├── addon.py            # 扩展插件入口
├── __init__.py         # Python 包初始化
├── requirements.txt    # Python 依赖
├── manifest.json       # 扩展元数据
├── property.json       # 扩展属性
├── tests/             # 测试目录
│   ├── test_basic.py      # 测试用例
│   ├── conftest.py        # pytest 配置
│   └── bin/start         # 测试启动脚本
└── .vscode/launch.json   # 调试配置
```

### 安装依赖

```bash
tman install --standalone
```

### 运行测试

**方式一：启动脚本**

```bash
./tests/bin/start
```

**方式二：tman 命令**

```bash
tman run test
```

测试成功输出：

```bash
============================================ test session starts ============================================
platform linux -- Python 3.10.17, pytest-8.3.4, pluggy-1.5.0
tests/test_basic.py .                                                                                [100%]
============================================ 1 passed in 0.04s =======================================
```

### 代码结构解析

#### 扩展实现（extension.py）

Python 扩展推荐使用异步编程模式：

```python
from ten_runtime import (
    AudioFrame, VideoFrame, AsyncExtension, AsyncTenEnv,
    Cmd, StatusCode, CmdResult, Data
)

class ExampleExtension(AsyncExtension):
    async def on_init(self, ten_env: AsyncTenEnv) -> None:
        ten_env.log_debug("on_init")

    async def on_start(self, ten_env: AsyncTenEnv) -> None:
        ten_env.log_debug("on_start")
        # TODO: 读取配置，初始化资源

    async def on_cmd(self, ten_env: AsyncTenEnv, cmd: Cmd) -> None:
        cmd_name = cmd.get_name()
        ten_env.log_debug(f"on_cmd name {cmd_name}")
        
        # TODO: 处理业务逻辑
        cmd_result = CmdResult.create(StatusCode.OK, cmd)
        await ten_env.return_result(cmd_result)

    async def on_stop(self, ten_env: AsyncTenEnv) -> None:
        ten_env.log_debug("on_stop")
        # TODO: 清理资源
```

#### 插件入口（addon.py）

```python
from ten_runtime import Addon, register_addon_as_extension, TenEnv
from .extension import ExampleExtension

@register_addon_as_extension("my_example_ext_python")
class ExampleExtensionAddon(Addon):
    def on_create_instance(self, ten_env: TenEnv, name: str, context) -> None:
        ten_env.log_info("on_create_instance")
        ten_env.on_create_instance_done(ExampleExtension(name), context)
```

#### 测试实现（tests/test_basic.py）

```python
from ten_runtime import (
    AsyncExtensionTester, AsyncTenEnvTester, Cmd, StatusCode,
    TenError, TenErrorCode
)

class ExtensionTesterBasic(AsyncExtensionTester):
    async def on_start(self, ten_env: AsyncTenEnvTester) -> None:
        # 创建测试命令
        new_cmd = Cmd.create("hello_world")
        
        ten_env.log_debug("send hello_world")
        result, err = await ten_env.send_cmd(new_cmd)
        
        # 验证测试结果
        if (err is not None or result is None 
            or result.get_status_code() != StatusCode.OK):
            ten_env.stop_test(TenError.create(
                TenErrorCode.ErrorCodeGeneric,
                "Failed to send hello_world"
            ))
        else:
            ten_env.stop_test()

def test_basic():
    tester = ExtensionTesterBasic()
    tester.set_test_mode_single("my_example_ext_python")
    err = tester.run()
    if err is not None:
        assert False, err.error_message()
```

### 调试配置

#### VSCode 调试

确保安装 Python 扩展和 debugpy，使用以下配置：

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "standalone test (debugpy, launch)",
      "type": "debugpy",
      "request": "launch",
      "python": "/usr/bin/python3",
      "module": "pytest",
      "args": ["-s", "${workspaceFolder}/tests/test_basic.py"],
      "env": {
        "TEN_ENABLE_PYTHON_DEBUG": "true",
        "PYTHONPATH": "${workspaceFolder}/.ten/app/ten_packages/system/ten_runtime_python/lib:${workspaceFolder}/.ten/app/ten_packages/system/ten_runtime_python/interface:${workspaceFolder}"
      },
      "console": "integratedTerminal"
    }
  ]
}
```

## 总结

通过遵循本指南的完整开发流程，您可以高效地开发、测试和调试 TEN 扩展，充分发挥 TEN Framework 的强大能力。












