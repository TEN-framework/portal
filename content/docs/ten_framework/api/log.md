---
title: Log
---

The TEN framework allows extensions developed in different languages to run within the same process. This creates a need to view logs from all these extensions in a unified log with a consistent format and information, making debugging easier.

To address this, the `ten_env` provides a logging API. Within each callback of an extension, an instance of `ten_env` can be accessed. Using this instance, you can call the logging API to output logs from extensions developed in various languages to a unified log output.

## Log Levels

The TEN framework supports the following log levels in increasing order of severity:

- **VERBOSE** (1): Detailed debugging information
- **DEBUG** (2): Debug information
- **INFO** (3): General information
- **WARN** (4): Warning information
- **ERROR** (5): Error information
- **FATAL** (6): Fatal errors

## API Interface

### C++ Language

```cpp
#include "ten_runtime/binding/cpp/ten.h"

class Extension {
public:
    void on_cmd(ten::ten_env_t& ten_env, std::unique_ptr<ten::cmd_t> cmd) {
        // Using convenience macros
        TEN_ENV_LOG_DEBUG(ten_env, "Processing command");
        TEN_ENV_LOG_INFO(ten_env, "Command name: " + cmd->get_name());
        TEN_ENV_LOG_WARN(ten_env, "Warning message");
        TEN_ENV_LOG_ERROR(ten_env, "Error occurred");

        // Direct method call
        ten_env.log(TEN_LOG_LEVEL_INFO, __func__, __FILE__, __LINE__, "Direct log call");
    }
};
```

C++ provides the following convenience macros:

- `TEN_ENV_LOG_VERBOSE(ten_env, msg)`
- `TEN_ENV_LOG_DEBUG(ten_env, msg)`
- `TEN_ENV_LOG_INFO(ten_env, msg)`
- `TEN_ENV_LOG_WARN(ten_env, msg)`
- `TEN_ENV_LOG_ERROR(ten_env, msg)`
- `TEN_ENV_LOG_FATAL(ten_env, msg)`

### Python Language

```python
from ten_runtime import Extension, TenEnv

class MyExtension(Extension):
    def on_cmd(self, ten_env: TenEnv, cmd):
        # Using different log level methods
        ten_env.log_verbose("Detailed debugging information")
        ten_env.log_debug("Debug information")
        ten_env.log_info("General information")
        ten_env.log_warn("Warning information")
        ten_env.log_error("Error information")
        ten_env.log_fatal("Fatal error")

        # Supports formatted strings
        test_value = "example"
        ten_env.log_info(f"Processing command, test value: {test_value}")
```

Python provides the following methods:

- `log_verbose(msg: str) -> Optional[TenError]`
- `log_debug(msg: str) -> Optional[TenError]`
- `log_info(msg: str) -> Optional[TenError]`
- `log_warn(msg: str) -> Optional[TenError]`
- `log_error(msg: str) -> Optional[TenError]`
- `log_fatal(msg: str) -> Optional[TenError]`

### Go Language

```go
package main

import "ten_runtime/ten"

type MyExtension struct {
    ten.DefaultExtension
}

func (ext *MyExtension) OnCmd(tenEnv ten.TenEnv, cmd ten.Cmd) {
    // Using different log level methods
    tenEnv.LogVerbose("Detailed debugging information")
    tenEnv.LogDebug("Debug information")
    tenEnv.LogInfo("General information")
    tenEnv.LogWarn("Warning information")
    tenEnv.LogError("Error information")
    tenEnv.LogFatal("Fatal error")

    // Supports formatting
    cmdName := cmd.GetName()
    tenEnv.LogInfo("Processing command: " + cmdName)
}
```

Go provides the following methods:

- `LogVerbose(msg string) error`
- `LogDebug(msg string) error`
- `LogInfo(msg string) error`
- `LogWarn(msg string) error`
- `LogError(msg string) error`
- `LogFatal(msg string) error`

### Node.js/TypeScript Language

```typescript
import { Extension, TenEnv, Cmd } from "ten-runtime-nodejs";

class MyExtension extends Extension {
    async onCmd(tenEnv: TenEnv, cmd: Cmd): Promise<void> {
        // Using different log level methods
        tenEnv.logVerbose("Detailed debugging information");
        tenEnv.logDebug("Debug information");
        tenEnv.logInfo("General information");
        tenEnv.logWarn("Warning information");
        tenEnv.logError("Error information");
        tenEnv.logFatal("Fatal error");

        // Supports string concatenation
        const cmdName = cmd.getName();
        tenEnv.logInfo("Processing command: " + cmdName);
    }
}
```

Node.js provides the following methods:

- `logVerbose(msg: string): TenError | undefined`
- `logDebug(msg: string): TenError | undefined`
- `logInfo(msg: string): TenError | undefined`
- `logWarn(msg: string): TenError | undefined`
- `logError(msg: string): TenError | undefined`
- `logFatal(msg: string): TenError | undefined`

## Usage Examples

### Basic Usage

```python
# Python example
def on_start(self, ten_env: TenEnv):
    ten_env.log_info("Extension starting")
    ten_env.on_start_done()

def on_cmd(self, ten_env: TenEnv, cmd):
    cmd_name = cmd.get_name()
    ten_env.log_debug(f"Received command: {cmd_name}")

    # Command processing logic
    if cmd_name == "hello":
        ten_env.log_info("Processing hello command")
        # ... processing logic
    else:
        ten_env.log_warn(f"Unknown command: {cmd_name}")
```

### Using in Threads

```python
import threading
import time

def log_routine(self, ten_env: TenEnv):
    """Log messages in a separate thread"""
    while not self.stop_flag:
        self.log_count += 1
        ten_env.log_info(f"Log message {self.log_count}")
        time.sleep(0.05)

def on_start(self, ten_env: TenEnv):
    # Start logging thread
    self.log_thread = threading.Thread(
        target=self.log_routine, args=(ten_env,)
    )
    self.log_thread.start()
    ten_env.on_start_done()
```

### Error Handling

```python
def on_cmd(self, ten_env: TenEnv, cmd):
    try:
        # Business logic
        result = self.process_command(cmd)
        ten_env.log_info("Command processed successfully")
    except ValueError as e:
        ten_env.log_error(f"Parameter error: {str(e)}")
    except Exception as e:
        ten_env.log_fatal(f"Fatal error: {str(e)}")
        raise
```

## Log Format and Output

The TEN framework's logging system automatically includes the following information:

- **Timestamp**: Time when the log was recorded
- **Log Level**: VERBOSE, DEBUG, INFO, WARN, ERROR, FATAL
- **Function Name**: Name of the function that called the log
- **File Name**: Source file name where the log was called
- **Line Number**: Code line number where the log was called
- **Message Content**: User-provided log message

The output format is similar to:

```bash
2025-01-01 12:00:00.123 [INFO] [function_name@file.py:123] User log message
```

## Best Practices

1. **Choose appropriate log levels**:
   - Use `DEBUG` for detailed debugging information
   - Use `INFO` for normal business processes
   - Use `WARN` for potential issues
   - Use `ERROR` for errors that are not fatal
   - Use `FATAL` for serious errors

2. **Provide meaningful log messages**:
   - Include contextual information (such as command names, parameter values, etc.)
   - Use descriptive messages rather than simple identifiers

3. **Avoid excessive logging**:
   - Don't use too many logs in high-frequency loops
   - Appropriately adjust log levels in production environments

4. **Thread safety**:
   - The TEN framework's logging API is thread-safe
   - Log methods can be safely called from any thread

The overall effect is shown in the image below:

![Unified log output for multi-language extensions](https://ten-framework-assets.s3.amazonaws.com/doc-assets/log.png)
