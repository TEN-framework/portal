---
title: Complete Guide to TEN Extension Development
---

TEN Framework provides rich extension templates to help developers quickly create extensions and complete the entire process from development to testing. This guide will demonstrate in detail how to develop extensions using C++, Go, and Python through practical operations.

## Pre-development Preparation

### Environment Requirements

Before starting extension development, please ensure your development environment is properly configured. Verify the installation with the following command:

```bash
tman --version
```

Under normal circumstances, you should see version information output similar to the following:

```bash
TEN Framework version: <version>
```

> **Important Note**: Please ensure you are using `tman` version >= 0.10.12. If the version is too low, please go to [GitHub Releases](https://github.com/TEN-framework/ten-framework/releases) to download the latest version.

### Development Process Overview

Regardless of which programming language is used, TEN extension development follows the following standardized process:

1. **Project Creation** - Use official templates to generate extension project skeleton
2. **Dependency Installation** - Configure runtime environment and install necessary dependency packages
3. **Core Development** - Implement extension business logic and functional code
4. **Build and Test** - Compile project (if needed) and execute unit tests
5. **Debug and Optimize** - Use professional debugging tools to locate and resolve issues

---

## C++ Extension Development

C++ extensions are suitable for application scenarios with extremely high performance requirements, such as real-time audio and video processing, high-frequency data computation, low-level system operations, etc.

### Create Project

Use the official TEN C++ extension template to quickly create a new project:

```bash
tman create extension my_example_ext_cpp --template default_extension_cpp
```

After successful project creation, you will get the following complete project structure:

```bash
my_example_ext_cpp/
├── BUILD.gn              # GN build system configuration file
├── manifest.json         # Extension metadata and configuration information
├── property.json         # Extension properties and parameter configuration
├── src/
│   └── main.cc           # Extension core implementation code
├── tests/
│   ├── basic.cc          # Basic functionality test cases
│   └── gtest_main.cc     # Test framework program entry
├── include/              # Header files directory
├── tools/                # Auxiliary tools and scripts
└── .vscode/
    └── launch.json       # VSCode debug configuration file
```

### Environment Configuration Verification

Enter the project directory and verify that the build tools are working properly:

```bash
cd my_example_ext_cpp
tgn --version
```

> **Expected Output**:

```bash
0.1.0
```

If the command cannot be executed, please check whether the TEN Framework development environment is correctly installed.

### Dependency Package Installation

Install all dependencies required for extension runtime:

```bash
tman install --standalone
```

After successful installation, you will see detailed installation logs similar to the following:

```bash
📦  Get all installed packages...
🔍  Filter compatible packages...
🔒  Creating manifest-lock.json...
📥  Installing packages...
  [00:00:00] [########################################]       3/3       Done

🏆  Install successfully in 1 second
```

### Project Build

TEN framework provides two convenient build methods for you to choose from:

#### Method 1: Manual Step-by-step Build

```bash
# Step 1: Generate build configuration files (enable standalone test mode)
tgn gen linux x64 debug -- ten_enable_standalone_test=true

# Step 2: Execute project build
tgn build linux x64 debug
```

#### Method 2: Use tman Shortcut Command

```bash
tman run build
```

After the build is complete, check the generated executable test file:

```bash
ls -la bin/
# Should see: my_example_ext_cpp_test
```

### Run Tests

Verify that the extension functionality works properly:

#### Method 1: Execute Test File Directly

```bash
./bin/my_example_ext_cpp_test
```

#### Method 2: Use tman Unified Command

```bash
tman run test
```

Example output when test execution is successful:

```bash
Running main() from ../../../tests/gtest_main.cc
[==========] Running 1 test from 1 test case.
[----------] 1 test from Test
[ RUN      ] Test.Basic
[       OK ] Test.Basic (20 ms)
[==========] 1 test from 1 test case ran. (79 ms total)
[  PASSED  ] 1 test.
```

> **Success Indicator**: When you see `[  PASSED  ] 1 test.`, it means all tests have passed.

### Core Code Structure Detailed Explanation

#### Extension Main Implementation (src/main.cc)

The core class of C++ extensions needs to inherit from the `ten::extension_t` base class and implement complete lifecycle management methods:

```cpp
class my_example_ext_cpp_t : public ten::extension_t {
 public:
  // Extension initialization phase - perform basic configuration and resource pre-allocation
  void on_init(ten::ten_env_t &ten_env) override;

  // Extension startup phase - officially begin processing business logic
  void on_start(ten::ten_env_t &ten_env) override;

  // Command handler - process command requests from other extensions or applications
  void on_cmd(ten::ten_env_t &ten_env, std::unique_ptr<ten::cmd_t> cmd) override;

  // Data handler - process generic data streams
  void on_data(ten::ten_env_t &ten_env, std::unique_ptr<ten::data_t> data) override;

  // Audio frame handler - process real-time audio stream data
  void on_audio_frame(ten::ten_env_t &ten_env, std::unique_ptr<ten::audio_frame_t> frame) override;

  // Video frame handler - process real-time video stream data
  void on_video_frame(ten::ten_env_t &ten_env, std::unique_ptr<ten::video_frame_t> frame) override;

  // Extension stop phase - clean up resources and graceful shutdown
  void on_stop(ten::ten_env_t &ten_env) override;
};
```

#### Test Framework Implementation (tests/basic.cc)

Write complete unit tests using the TEN dedicated test framework:

```cpp
class my_example_ext_cpp_tester : public ten::extension_tester_t {
 public:
  void on_start(ten::ten_env_tester_t &ten_env) override {
    // Create command object for testing
    auto new_cmd = ten::cmd_t::create("foo");

    // Send command to extension and verify response results
    ten_env.send_cmd(std::move(new_cmd), [](/* callback parameters */) {
      // Verify the correctness of test results here
    });
  }
};
```

### Debug Environment Configuration

#### VSCode Integrated Debugging

1. Install the **CodeLLDB** extension plugin for VSCode
2. Set breakpoints in the source code
3. Select "standalone test (lldb, launch)" debug configuration
4. Press F5 to start the debug session

Content of the debug configuration file `.vscode/launch.json`:

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

#### Command Line Debugging

Use the classic GDB debugger for command line debugging:

```bash
gdb ./bin/my_example_ext_cpp_test
(gdb) run
(gdb) bt  # View complete function call stack
```

---

## Go Extension Development

Go extensions provide a good balance between high performance and development efficiency, particularly suitable for building network services, concurrent processing, microservice architectures, and other application scenarios.

### Create Project

Create a new project using the Go extension template:

```bash
tman create extension my_example_ext_go --template default_extension_go --template-data class_name_prefix=Example
```

After successful project creation, it will display:

```bash
🏆  Package 'extension:my_example_ext_go' created successfully in '/path/to/your/project' in 1 second.
```

The complete project structure is as follows:

```bash
my_example_ext_go/
├── extension.go             # Extension core implementation code
├── go.mod                   # Go module dependency management configuration
├── manifest.json            # Extension metadata information
├── property.json            # Extension property configuration
├── README.md                # Project documentation
├── tests/                   # Test-related files
│   ├── basic_tester.go      # Test logic implementation
│   ├── basic_tester_test.go # Test case definition
│   ├── main_test.go         # Test program entry
│   └── bin/start            # Test startup script
└── .vscode/launch.json      # VSCode debug configuration
```

### Dependency Package Installation

Install dependency packages required for project runtime:

```bash
tman install --standalone
```

### Run Tests

Verify the correctness of extension functionality:

#### Method 1: Use Startup Script

```bash
./tests/bin/start
```

#### Method 2: Use tman Command

```bash
tman run test
```

Example output for successful test execution:

```bash
=== RUN   TestBasicExtensionTester
--- PASS: TestBasicExtensionTester (0.01s)
PASS
```

### Core Code Structure Detailed Explanation

#### Extension Implementation (extension.go)

Core implementation structure for Go extensions:

```go
import (
    ten "ten_framework/ten_runtime"
)

type ExampleExtension struct {
    ten.DefaultExtension
}

// Extension startup lifecycle
func (e *ExampleExtension) OnStart(tenEnv ten.TenEnv) {
    tenEnv.LogDebug("OnStart")
    tenEnv.OnStartDone()
}

// Command processing logic
func (e *ExampleExtension) OnCmd(tenEnv ten.TenEnv, cmd ten.Cmd) {
    tenEnv.LogDebug("OnCmd")
    cmdResult, _ := ten.NewCmdResult(ten.StatusCodeOk, cmd)
    tenEnv.ReturnResult(cmdResult, nil)
}

// Extension stop lifecycle
func (e *ExampleExtension) OnStop(tenEnv ten.TenEnv) {
    tenEnv.LogDebug("OnStop")
    tenEnv.OnStopDone()
}
```

#### Test Framework (tests/basic_tester.go)

Test framework implementation for Go extensions:

```go
type BasicExtensionTester struct {
    ten.DefaultExtensionTester
}

func (tester *BasicExtensionTester) OnStart(tenEnvTester ten.TenEnvTester) {
    // Create command object for testing
    cmdTest, _ := ten.NewCmd("test")

    // Send command and handle response results
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

### Development Environment Optimization

To improve development experience and debugging convenience, it is recommended to create a `go.work` workspace file in the extension root directory:

```go
go 1.18

use (
    .
    .ten/app/ten_packages/system/ten_runtime_go/interface
)
```

### Debug Environment Configuration

#### VSCode Integrated Debugging

Ensure the official Go extension is installed, then use the following debug configuration:

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

## Python Extension Development

Python extensions have the highest development efficiency, particularly suitable for rapid prototype development, AI/ML application integration, complex business logic implementation, and other scenarios.

### Create Project

Use the Python async extension template to create a project:

```bash
tman create extension my_example_ext_python --template default_async_extension_python --template-data class_name_prefix=Example
```

Complete project structure:

```bash
my_example_ext_python/
├── extension.py         # Extension core implementation code
├── addon.py             # Extension plugin registration entry
├── __init__.py          # Python package initialization file
├── requirements.txt     # Python dependency package list
├── manifest.json        # Extension metadata configuration
├── property.json        # Extension property configuration
├── tests/               # Test-related files
│   ├── test_basic.py    # Basic test cases
│   ├── conftest.py      # pytest configuration file
│   └── bin/start        # Test startup script
└── .vscode/launch.json  # VSCode debug configuration
```

### Dependency Package Installation

Install Python dependency packages required for the project:

```bash
tman install --standalone
```

### Run Tests

Verify Python extension functionality:

#### Method 1: Use Startup Script

```bash
./tests/bin/start
```

#### Method 2: Use tman Command

```bash
tman run test
```

Example output for successful test execution:

```bash
============================================ test session starts ============================================
platform linux -- Python 3.10.17, pytest-8.3.4, pluggy-1.5.0
tests/test_basic.py .                                                                                [100%]
============================================ 1 passed in 0.04s =======================================
```

### Core Code Structure Detailed Explanation

#### Extension Implementation (extension.py)

Python extensions recommend using modern asynchronous programming patterns to achieve better performance and concurrent processing capabilities:

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
        # TODO: Read configuration files here, initialize necessary resources

    async def on_cmd(self, ten_env: AsyncTenEnv, cmd: Cmd) -> None:
        cmd_name = cmd.get_name()
        ten_env.log_debug(f"on_cmd name {cmd_name}")

        # TODO: Implement specific business logic processing here
        cmd_result = CmdResult.create(StatusCode.OK, cmd)
        await ten_env.return_result(cmd_result)

    async def on_stop(self, ten_env: AsyncTenEnv) -> None:
        ten_env.log_debug("on_stop")
        # TODO: Clean up resources here, perform graceful shutdown
```

#### Plugin Registration Entry (addon.py)

Extension plugin registration and creation logic:

```python
from ten_runtime import Addon, register_addon_as_extension, TenEnv
from .extension import ExampleExtension

@register_addon_as_extension("my_example_ext_python")
class ExampleExtensionAddon(Addon):
    def on_create_instance(self, ten_env: TenEnv, name: str, context) -> None:
        ten_env.log_info("on_create_instance")
        ten_env.on_create_instance_done(ExampleExtension(name), context)
```

#### Test Implementation (tests/test_basic.py)

Complete asynchronous test framework implementation:

```python
from ten_runtime import (
    AsyncExtensionTester, AsyncTenEnvTester, Cmd, StatusCode,
    TenError, TenErrorCode
)

class ExtensionTesterBasic(AsyncExtensionTester):
    async def on_start(self, ten_env: AsyncTenEnvTester) -> None:
        # Create command object for testing
        new_cmd = Cmd.create("hello_world")

        ten_env.log_debug("send hello_world")
        result, err = await ten_env.send_cmd(new_cmd)

        # Verify the correctness of test results
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

### Debug Environment Configuration

#### VSCode Integrated Debugging

Ensure the Python extension and debugpy debugger are installed, use the following configuration for debugging:

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

## Development Summary

By following the complete development process provided in this guide, you can efficiently develop, test, and debug TEN extensions. Whether you choose C++, Go, or Python, TEN Framework provides you with a complete toolchain and best practices to help you fully leverage the powerful capabilities of TEN Framework and build high-performance, highly reliable extension applications.

Each language has its unique advantages and applicable scenarios. Please choose the most suitable development solution based on your specific needs and team technology stack. During the development process, it is recommended to make full use of the debugging tools and testing frameworks provided by TEN Framework to ensure the quality and stability of extensions.
