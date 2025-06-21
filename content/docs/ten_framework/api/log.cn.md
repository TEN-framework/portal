---
title: 日志
---

TEN framework 允许使用不同语言开发的 extension 在同一进程中运行。这使得需要以统一的日志格式和信息在统一的日志中查看所有这些 extension 的日志，从而简化调试。

为了解决这个问题，`ten_env` 提供了一个日志 API。在 extension 的每个回调中，都可以访问 `ten_env` 的实例。使用此实例，您可以调用日志 API，将使用各种语言开发的 extension 的日志输出到统一的日志输出中。

## 日志级别

TEN framework 支持以下日志级别，按严重程度递增：

- **VERBOSE** (1): 详细调试信息
- **DEBUG** (2): 调试信息
- **INFO** (3): 一般信息
- **WARN** (4): 警告信息
- **ERROR** (5): 错误信息
- **FATAL** (6): 致命错误

## API 接口

### C++ 语言

```cpp
#include "ten_runtime/binding/cpp/ten.h"

class Extension {
public:
    void on_cmd(ten::ten_env_t& ten_env, std::unique_ptr<ten::cmd_t> cmd) {
        // 使用便捷宏
        TEN_ENV_LOG_DEBUG(ten_env, "Processing command");
        TEN_ENV_LOG_INFO(ten_env, "Command name: " + cmd->get_name());
        TEN_ENV_LOG_WARN(ten_env, "Warning message");
        TEN_ENV_LOG_ERROR(ten_env, "Error occurred");

        // 直接调用方法
        ten_env.log(TEN_LOG_LEVEL_INFO, __func__, __FILE__, __LINE__, "Direct log call");
    }
};
```

C++ 提供了以下便捷宏：

- `TEN_ENV_LOG_VERBOSE(ten_env, msg)`
- `TEN_ENV_LOG_DEBUG(ten_env, msg)`
- `TEN_ENV_LOG_INFO(ten_env, msg)`
- `TEN_ENV_LOG_WARN(ten_env, msg)`
- `TEN_ENV_LOG_ERROR(ten_env, msg)`
- `TEN_ENV_LOG_FATAL(ten_env, msg)`

### Python 语言

```python
from ten_runtime import Extension, TenEnv

class MyExtension(Extension):
    def on_cmd(self, ten_env: TenEnv, cmd):
        # 使用不同级别的日志方法
        ten_env.log_verbose("详细调试信息")
        ten_env.log_debug("调试信息")
        ten_env.log_info("一般信息")
        ten_env.log_warn("警告信息")
        ten_env.log_error("错误信息")
        ten_env.log_fatal("严重错误")

        # 支持格式化字符串
        test_value = "example"
        ten_env.log_info(f"处理命令，测试值: {test_value}")
```

Python 提供了以下方法：

- `log_verbose(msg: str) -> Optional[TenError]`
- `log_debug(msg: str) -> Optional[TenError]`
- `log_info(msg: str) -> Optional[TenError]`
- `log_warn(msg: str) -> Optional[TenError]`
- `log_error(msg: str) -> Optional[TenError]`
- `log_fatal(msg: str) -> Optional[TenError]`

### Go 语言

```go
package main

import "ten_runtime/ten"

type MyExtension struct {
    ten.DefaultExtension
}

func (ext *MyExtension) OnCmd(tenEnv ten.TenEnv, cmd ten.Cmd) {
    // 使用不同级别的日志方法
    tenEnv.LogVerbose("详细调试信息")
    tenEnv.LogDebug("调试信息")
    tenEnv.LogInfo("一般信息")
    tenEnv.LogWarn("警告信息")
    tenEnv.LogError("错误信息")
    tenEnv.LogFatal("严重错误")

    // 支持格式化
    cmdName := cmd.GetName()
    tenEnv.LogInfo("处理命令: " + cmdName)
}
```

Go 提供了以下方法：

- `LogVerbose(msg string) error`
- `LogDebug(msg string) error`
- `LogInfo(msg string) error`
- `LogWarn(msg string) error`
- `LogError(msg string) error`
- `LogFatal(msg string) error`

### Node.js/TypeScript 语言

```typescript
import { Extension, TenEnv, Cmd } from "ten-runtime-nodejs";

class MyExtension extends Extension {
    async onCmd(tenEnv: TenEnv, cmd: Cmd): Promise<void> {
        // 使用不同级别的日志方法
        tenEnv.logVerbose("详细调试信息");
        tenEnv.logDebug("调试信息");
        tenEnv.logInfo("一般信息");
        tenEnv.logWarn("警告信息");
        tenEnv.logError("错误信息");
        tenEnv.logFatal("严重错误");

        // 支持字符串拼接
        const cmdName = cmd.getName();
        tenEnv.logInfo("处理命令: " + cmdName);
    }
}
```

Node.js 提供了以下方法：

- `logVerbose(msg: string): TenError | undefined`
- `logDebug(msg: string): TenError | undefined`
- `logInfo(msg: string): TenError | undefined`
- `logWarn(msg: string): TenError | undefined`
- `logError(msg: string): TenError | undefined`
- `logFatal(msg: string): TenError | undefined`

## 使用示例

### 基本使用

```python
# Python 示例
def on_start(self, ten_env: TenEnv):
    ten_env.log_info(" extension 启动")
    ten_env.on_start_done()

def on_cmd(self, ten_env: TenEnv, cmd):
    cmd_name = cmd.get_name()
    ten_env.log_debug(f"收到命令: {cmd_name}")

    # 处理命令逻辑
    if cmd_name == "hello":
        ten_env.log_info("处理 hello 命令")
        # ... 处理逻辑
    else:
        ten_env.log_warn(f"未知命令: {cmd_name}")
```

### 在线程中使用

```python
import threading
import time

def log_routine(self, ten_env: TenEnv):
    """在单独线程中记录日志"""
    while not self.stop_flag:
        self.log_count += 1
        ten_env.log_info(f"日志消息 {self.log_count}")
        time.sleep(0.05)

def on_start(self, ten_env: TenEnv):
    # 启动日志线程
    self.log_thread = threading.Thread(
        target=self.log_routine, args=(ten_env,)
    )
    self.log_thread.start()
    ten_env.on_start_done()
```

### 错误处理

```python
def on_cmd(self, ten_env: TenEnv, cmd):
    try:
        # 业务逻辑
        result = self.process_command(cmd)
        ten_env.log_info("命令处理成功")
    except ValueError as e:
        ten_env.log_error(f"参数错误: {str(e)}")
    except Exception as e:
        ten_env.log_fatal(f"严重错误: {str(e)}")
        raise
```

## 日志格式和输出

TEN framework 的日志系统会自动包含以下信息：

- **时间戳**: 日志记录的时间
- **日志级别**: VERBOSE、DEBUG、INFO、WARN、ERROR、FATAL
- **函数名**: 调用日志的函数名
- **文件名**: 调用日志的源文件名
- **行号**: 调用日志的代码行号
- **消息内容**: 用户提供的日志消息

输出格式类似：

```bash
2025-01-01 12:00:00.123 [INFO] [function_name@file.py:123] 用户日志消息
```

## 最佳实践

1. **选择合适的日志级别**：
   - 使用 `DEBUG` 记录详细的调试信息
   - 使用 `INFO` 记录正常的业务流程
   - 使用 `WARN` 记录潜在问题
   - 使用 `ERROR` 记录错误但不致命的问题
   - 使用 `FATAL` 记录严重错误

2. **提供有意义的日志消息**：
   - 包含上下文信息（如命令名称、参数值等）
   - 使用描述性的消息而不是简单的标识符

3. **避免过度日志记录**：
   - 不要在高频循环中使用过多的日志
   - 在生产环境中适当调整日志级别

4. **线程安全**：
   - TEN framework 的日志 API 是线程安全的
   - 可以在任何线程中安全调用日志方法

整体效果如下图所示：

![多语言 extension 的统一日志输出](https://ten-framework-assets.s3.amazonaws.com/doc-assets/log.png)
