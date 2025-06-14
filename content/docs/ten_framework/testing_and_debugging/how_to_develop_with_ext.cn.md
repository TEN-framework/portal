---
title: TEN 扩展开发完整指南
---

TEN Framework 提供了丰富的扩展模板，帮助开发者快速创建扩展并完成从开发到测试的完整流程。本指南将通过实际操作演示，详细介绍如何使用 C++，Go 和 Python 三种语言进行扩展开发的全流程。

## 开发前准备

### 环境要求

在开始扩展开发之前，请确保您的开发环境已正确配置。通过以下命令验证安装：

```bash
tman --version
```

正常情况下，您应该看到类似以下的版本信息输出：

```bash
TEN Framework version: <version>
```

> **重要提示**：请确保您使用的 `tman` 版本 >= 0.10.12，如果版本过低，请前往 [GitHub Releases](https://github.com/TEN-framework/ten-framework/releases) 下载最新版本。

### 开发流程概览

无论使用哪种编程语言，TEN 扩展开发都遵循以下标准化流程：

1. **项目创建** - 使用官方模板生成扩展项目骨架
2. **依赖安装** - 配置运行环境并安装必要的依赖包
3. **核心开发** - 实现扩展的业务逻辑和功能代码
4. **构建测试** - 编译项目（如需要）并执行单元测试
5. **调试优化** - 使用专业调试工具定位并解决问题

---

## C++ 扩展开发

C++ 扩展适用于对性能要求极高的应用场景，如实时音视频处理、高频数据计算、底层系统操作等。

### 创建项目

使用 TEN 官方提供的 C++ 扩展模板快速创建新项目：

```bash
tman create extension my_example_ext_cpp --template default_extension_cpp
```

项目创建成功后，您会得到以下完整的项目结构：

```bash
my_example_ext_cpp/
├── BUILD.gn              # GN 构建系统配置文件
├── manifest.json         # 扩展元数据和配置信息
├── property.json         # 扩展属性和参数配置
├── src/
│   └── main.cc           # 扩展核心实现代码
├── tests/
│   ├── basic.cc          # 基础功能测试用例
│   └── gtest_main.cc     # 测试框架程序入口
├── include/              # 头文件存放目录
├── tools/                # 辅助工具和脚本
└── .vscode/
    └── launch.json       # VSCode 调试配置文件
```

### 环境配置验证

进入项目目录并验证构建工具是否正常工作：

```bash
cd my_example_ext_cpp
tgn --version
```

> **期望输出**：

```bash
0.1.0
```

如果命令无法执行，请检查 TEN Framework 开发环境是否正确安装。

### 依赖包安装

安装扩展运行时所需的全部依赖包：

```bash
tman install --standalone
```

安装成功后，您将看到类似以下的详细安装日志：

```bash
📦  Get all installed packages...
🔍  Filter compatible packages...
🔒  Creating manifest-lock.json...
📥  Installing packages...
  [00:00:00] [########################################]       3/3       Done

🏆  Install successfully in 1 second
```

### 项目构建

TEN 框架提供了两种便捷的构建方式供您选择：

#### 方式一：手动分步构建

```bash
# 第一步：生成构建配置文件（启用独立测试模式）
tgn gen linux x64 debug -- ten_enable_standalone_test=true

# 第二步：执行项目构建
tgn build linux x64 debug
```

#### 方式二：使用 tman 快捷命令

```bash
tman run build
```

构建完成后，检查生成的可执行测试文件：

```bash
ls -la bin/
# 应该能看到：my_example_ext_cpp_test
```

### 运行测试

验证扩展功能是否正常工作：

#### 方式一：直接执行测试文件

```bash
./bin/my_example_ext_cpp_test
```

#### 方式二：使用 tman 统一命令

```bash
tman run test
```

测试执行成功时的输出示例：

```bash
Running main() from ../../../tests/gtest_main.cc
[==========] Running 1 test from 1 test case.
[----------] 1 test from Test
[ RUN      ] Test.Basic
[       OK ] Test.Basic (20 ms)
[==========] 1 test from 1 test case ran. (79 ms total)
[  PASSED  ] 1 test.
```

> **成功标志**：当您看到 `[  PASSED  ] 1 test.` 时表示测试全部通过。

### 核心代码结构详解

#### 扩展主体实现（src/main.cc）

C++ 扩展的核心类需要继承自 `ten::extension_t` 基类，并实现完整的生命周期管理方法：

```cpp
class my_example_ext_cpp_t : public ten::extension_t {
 public:
  // 扩展初始化阶段 - 进行基础配置和资源预分配
  void on_init(ten::ten_env_t &ten_env) override;

  // 扩展启动阶段 - 正式开始处理业务逻辑
  void on_start(ten::ten_env_t &ten_env) override;

  // 命令处理器 - 处理来自其他扩展或应用的命令请求
  void on_cmd(ten::ten_env_t &ten_env, std::unique_ptr<ten::cmd_t> cmd) override;

  // 数据处理器 - 处理通用数据流
  void on_data(ten::ten_env_t &ten_env, std::unique_ptr<ten::data_t> data) override;

  // 音频帧处理器 - 处理实时音频流数据
  void on_audio_frame(ten::ten_env_t &ten_env, std::unique_ptr<ten::audio_frame_t> frame) override;

  // 视频帧处理器 - 处理实时视频流数据
  void on_video_frame(ten::ten_env_t &ten_env, std::unique_ptr<ten::video_frame_t> frame) override;

  // 扩展停止阶段 - 清理资源和优雅关闭
  void on_stop(ten::ten_env_t &ten_env) override;
};
```

#### 测试框架实现（tests/basic.cc）

使用 TEN 专用测试框架编写完整的单元测试：

```cpp
class my_example_ext_cpp_tester : public ten::extension_tester_t {
 public:
  void on_start(ten::ten_env_tester_t &ten_env) override {
    // 创建测试用的命令对象
    auto new_cmd = ten::cmd_t::create("foo");

    // 发送命令到扩展并验证响应结果
    ten_env.send_cmd(std::move(new_cmd), [](/* callback parameters */) {
      // 在这里验证测试结果的正确性
    });
  }
};
```

### 调试环境配置

#### VSCode 集成调试

1. 安装 VSCode 的 **CodeLLDB** 扩展插件
2. 在源代码中设置断点
3. 选择 "standalone test (lldb, launch)" 调试配置
4. 按 F5 键启动调试会话

调试配置文件 `.vscode/launch.json` 的内容：

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

使用经典的 GDB 调试器进行命令行调试：

```bash
gdb ./bin/my_example_ext_cpp_test
(gdb) run
(gdb) bt  # 查看完整的函数调用栈
```

---

## Go 扩展开发

Go 扩展在高性能和开发效率之间提供了很好的平衡，特别适合构建网络服务、并发处理、微服务架构等应用场景。

### 创建项目

使用 Go 扩展模板创建新项目：

```bash
tman create extension my_example_ext_go --template default_extension_go --template-data class_name_prefix=Example
```

项目创建成功后会显示：

```bash
🏆  Package 'extension:my_example_ext_go' created successfully in '/path/to/your/project' in 1 second.
```

完整的项目结构如下：

```bash
my_example_ext_go/
├── extension.go             # 扩展核心实现代码
├── go.mod                   # Go 模块依赖管理配置
├── manifest.json            # 扩展元数据信息
├── property.json            # 扩展属性配置
├── README.md                # 项目说明文档
├── tests/                   # 测试相关文件
│   ├── basic_tester.go      # 测试逻辑实现
│   ├── basic_tester_test.go # 测试用例定义
│   ├── main_test.go         # 测试程序入口
│   └── bin/start            # 测试启动脚本
└── .vscode/launch.json      # VSCode 调试配置
```

### 依赖包安装

安装项目运行所需的依赖包：

```bash
tman install --standalone
```

### 运行测试

验证扩展功能的正确性：

#### 方式一：使用启动脚本

```bash
./tests/bin/start
```

#### 方式二：使用 tman 命令

```bash
tman run test
```

测试成功执行的输出示例：

```bash
=== RUN   TestBasicExtensionTester
--- PASS: TestBasicExtensionTester (0.01s)
PASS
```

### 核心代码结构详解

#### 扩展实现（extension.go）

Go 扩展的核心实现结构：

```go
import (
    ten "ten_framework/ten_runtime"
)

type ExampleExtension struct {
    ten.DefaultExtension
}

// 扩展启动生命周期
func (e *ExampleExtension) OnStart(tenEnv ten.TenEnv) {
    tenEnv.LogDebug("OnStart")
    tenEnv.OnStartDone()
}

// 命令处理逻辑
func (e *ExampleExtension) OnCmd(tenEnv ten.TenEnv, cmd ten.Cmd) {
    tenEnv.LogDebug("OnCmd")
    cmdResult, _ := ten.NewCmdResult(ten.StatusCodeOk, cmd)
    tenEnv.ReturnResult(cmdResult, nil)
}

// 扩展停止生命周期
func (e *ExampleExtension) OnStop(tenEnv ten.TenEnv) {
    tenEnv.LogDebug("OnStop")
    tenEnv.OnStopDone()
}
```

#### 测试框架（tests/basic_tester.go）

Go 扩展的测试框架实现：

```go
type BasicExtensionTester struct {
    ten.DefaultExtensionTester
}

func (tester *BasicExtensionTester) OnStart(tenEnvTester ten.TenEnvTester) {
    // 创建用于测试的命令对象
    cmdTest, _ := ten.NewCmd("test")

    // 发送命令并处理响应结果
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

### 开发环境优化

为了提升开发体验和调试便利性，建议在扩展根目录创建 `go.work` 工作空间文件：

```go
go 1.18

use (
    .
    .ten/app/ten_packages/system/ten_runtime_go/interface
)
```

### 调试环境配置

#### VSCode 集成调试

确保已安装 Go 官方扩展，然后使用以下调试配置：

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

Python 扩展具有最高的开发效率，特别适合快速原型开发、AI/ML 应用集成、复杂业务逻辑实现等场景。

### 创建项目

使用 Python 异步扩展模板创建项目：

```bash
tman create extension my_example_ext_python --template default_async_extension_python --template-data class_name_prefix=Example
```

完整的项目结构：

```bash
my_example_ext_python/
├── extension.py         # 扩展核心实现代码
├── addon.py             # 扩展插件注册入口
├── __init__.py          # Python 包初始化文件
├── requirements.txt     # Python 依赖包清单
├── manifest.json        # 扩展元数据配置
├── property.json        # 扩展属性配置
├── tests/               # 测试相关文件
│   ├── test_basic.py    # 基础测试用例
│   ├── conftest.py      # pytest 配置文件
│   └── bin/start        # 测试启动脚本
└── .vscode/launch.json  # VSCode 调试配置
```

### 依赖包安装

安装项目所需的 Python 依赖包：

```bash
tman install --standalone
```

### 运行测试

验证 Python 扩展的功能：

#### 方式一：使用启动脚本

```bash
./tests/bin/start
```

#### 方式二：使用 tman 命令

```bash
tman run test
```

测试成功执行的输出示例：

```bash
============================================ test session starts ============================================
platform linux -- Python 3.10.17, pytest-8.3.4, pluggy-1.5.0
tests/test_basic.py .                                                                                [100%]
============================================ 1 passed in 0.04s =======================================
```

### 核心代码结构详解

#### 扩展实现（extension.py）

Python 扩展推荐使用现代异步编程模式，以获得更好的性能和并发处理能力：

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
        # TODO: 在这里读取配置文件，初始化必要的资源

    async def on_cmd(self, ten_env: AsyncTenEnv, cmd: Cmd) -> None:
        cmd_name = cmd.get_name()
        ten_env.log_debug(f"on_cmd name {cmd_name}")

        # TODO: 在这里实现具体的业务逻辑处理
        cmd_result = CmdResult.create(StatusCode.OK, cmd)
        await ten_env.return_result(cmd_result)

    async def on_stop(self, ten_env: AsyncTenEnv) -> None:
        ten_env.log_debug("on_stop")
        # TODO: 在这里清理资源，进行优雅关闭
```

#### 插件注册入口（addon.py）

扩展插件的注册和创建逻辑：

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

完整的异步测试框架实现：

```python
from ten_runtime import (
    AsyncExtensionTester, AsyncTenEnvTester, Cmd, StatusCode,
    TenError, TenErrorCode
)

class ExtensionTesterBasic(AsyncExtensionTester):
    async def on_start(self, ten_env: AsyncTenEnvTester) -> None:
        # 创建用于测试的命令对象
        new_cmd = Cmd.create("hello_world")

        ten_env.log_debug("send hello_world")
        result, err = await ten_env.send_cmd(new_cmd)

        # 验证测试结果的正确性
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

### 调试环境配置

#### VSCode 集成调试

确保已安装 Python 扩展和 debugpy 调试器，使用以下配置进行调试：

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

## 开发总结

通过遵循本指南提供的完整开发流程，您可以高效地进行 TEN 扩展的开发、测试和调试工作。无论选择 C++，Go 还是 Python，TEN Framework 都为您提供了完整的工具链和最佳实践，帮助您充分发挥 TEN Framework 的强大功能，构建出高性能、高可靠性的扩展应用。

每种语言都有其独特的优势和适用场景，请根据您的具体需求和团队技术栈选择最合适的开发方案。在开发过程中，建议充分利用 TEN Framework 提供的调试工具和测试框架，以确保扩展的质量和稳定性。
