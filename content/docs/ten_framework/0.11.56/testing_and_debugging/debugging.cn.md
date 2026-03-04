---
title: 调试
---

## 适用于 TEN framework 的开发人员

如果您使用 VS Code 开发 TEN framework，则 TEN framework 源代码树中有一个 `launch.json` 文件，其中提供了默认的调试目标。

## 适用于 TEN framework 的用户

如果您使用 VS Code 开发基于 TEN framework 的自己的应用程序，您可以将配置添加到您的 `.vscode/launch.json` 文件，以便您可以使用断点和变量检查来调试您的应用程序，无论您使用的是哪种编程语言（C++/Golang/Python）。

### 在 C++ 应用程序中调试

如果应用程序是用 C++ 编写的，这意味着扩展可以使用 C++ 或 Python 编写。

#### 使用 lldb 或 gdb 调试 C++ 代码

您可以使用以下配置来调试 C++ 代码：

- **使用 lldb 调试 C++ 代码**

  ```json
  {
    "name": "app (C++) (lldb, launch)",
    "type": "lldb",
    "request": "launch", // "launch" or "attach"
    "program": "${workspaceFolder}/bin/worker", // 可执行文件的路径
    "cwd": "${workspaceFolder}/",
    "env": {
      "LD_LIBRARY_PATH": "${workspaceFolder}/ten_packages/system/xxx/lib", // linux
      "DYLD_LIBRARY_PATH": "${workspaceFolder}/ten_packages/system/xxx/lib" // macOS
    }
  }
  ```

- **使用 gdb 调试 C++ 代码**

  ```json
  {
    "name": "app (C++) (gdb, launch)",
    "type": "cppdbg",
    "request": "launch", // "launch" or "attach"
    "program": "${workspaceFolder}/bin/worker", // 可执行文件的路径
    "cwd": "${workspaceFolder}/",
    "MIMode": "gdb",
    "environment": [
      {
        // linux
        "name": "LD_LIBRARY_PATH",
        "value": "${workspaceFolder}/ten_packages/system/xxx/lib"
      },
      {
        // macOS
        "name": "DYLD_LIBRARY_PATH",
        "value": "${workspaceFolder}/ten_packages/system/xxx/lib"
      }
    ]
  }
  ```

#### 使用 debugpy 调试 Python 代码

您可以使用 `debugpy` 调试 Python 代码。 但是，由于程序不是直接通过 Python 解释器启动的，因此 Python 代码由嵌入的 Python 解释器执行。 因此，您只能将调试器附加到正在运行的进程。

首先，您需要在 Python 环境中安装 `debugpy`：

```shell
pip install debugpy
```

然后，您需要使用设置的环境变量 `TEN_ENABLE_PYTHON_DEBUG` 和 `TEN_PYTHON_DEBUG_PORT` 启动应用程序。 例如：

```shell
TEN_ENABLE_PYTHON_DEBUG=true TEN_PYTHON_DEBUG_PORT=5678 ./bin/worker
```

如果环境变量 `TEN_ENABLE_PYTHON_DEBUG` 设置为 `true`，则应用程序将阻塞，直到附加调试器。 如果设置了环境变量 `TEN_PYTHON_DEBUG_PORT`，则调试器服务器将侦听指定端口上的传入连接。

然后，您可以将调试器附加到正在运行的进程。 以下是一个配置示例：

**使用 debugpy 调试 Python 代码**

```json
{
  "name": "app (C++) (debugpy, attach)",
  "type": "debugpy",
  "request": "attach",
  "connect": {
    "host": "localhost",
    "port": 5678
  },
  "justMyCode": false
}
```

#### 同时调试 C++ 和 Python 代码

如果您想在 VSCode 中一键启动同时调试 C++ 和 Python 代码，您可以执行以下操作：

1. 定义一个任务，在附加调试器之前延迟几秒钟：

   ```json
   {
     "label": "delay 3 seconds",
     "type": "shell",
     "command": "sleep 3",
     "windows": {
       "command": "ping 127.0.0.1 -n 3 > nul"
     },
     "group": "none"
   }
   ```

2. 将以下配置添加到 `launch.json` 文件：

   ```json
   "configurations": [
        {
            "name": "app (C++) (lldb, launch with debugpy)",
            "type": "lldb",
            "request": "launch", // "launch" or "attach"
            "program": "${workspaceFolder}/bin/worker", // 可执行文件的路径
            "cwd": "${workspaceFolder}/",
            "env": {
                "LD_LIBRARY_PATH": "${workspaceFolder}/ten_packages/system/xxx/lib", // linux
                "DYLD_LIBRARY_PATH": "${workspaceFolder}/ten_packages/system/xxx/lib", // macOS
                "TEN_ENABLE_PYTHON_DEBUG": "true",
                "TEN_PYTHON_DEBUG_PORT": "5678"
            }
        },
        {
            "name": "app (C++) (debugpy, attach with delay)",
            "type": "debugpy",
            "request": "attach",
            "connect": {
                "host": "localhost",
                "port": 5678
            },
            "justMyCode": false,
            "preLaunchTask": "delay 3 seconds"
        }
   ],
   "compounds": [
        {
            "name": "app (C++) (lldb, launch) and app (C++) (debugpy, attach)",
            "configurations": [
                "app (C++) (lldb, launch with debugpy)",
                "app (C++) (debugpy, attach with delay)"
            ]
        }
   ]
   ```

然后，您可以使用复合配置 `app (C++) (lldb, launch) and app (C++) (debugpy, attach)` 启动调试 C++ 和 Python 代码。

### 在 Go 应用程序中调试

如果应用程序是用 Go 编写的，这意味着扩展可以使用 Go 或 C++ 或 Python 编写。

#### 使用 delve 调试 Go 代码

您可以使用以下配置在您的 Go 扩展中进行调试：

```json
{
  "name": "app (golang) (go, launch)",
  "type": "go",
  "request": "launch",
  "mode": "exec",
  "cwd": "${workspaceFolder}/",
  "program": "${workspaceFolder}/bin/worker", // 可执行文件的路径
  "env": {
    "LD_LIBRARY_PATH": "${workspaceFolder}/ten_packages/system/xxx/lib", // linux
    "DYLD_LIBRARY_PATH": "${workspaceFolder}/ten_packages/system/xxx/lib", // macOS
    "TEN_APP_BASE_DIR": "${workspaceFolder}"
  }
}
```

#### 使用 lldb 或 gdb 调试 C++ 代码

您可以使用以下配置来调试 C++ 代码：

- **使用 lldb 调试 C++ 代码**

  ```json
  {
    "name": "app (Go) (lldb, launch)",
    "type": "lldb",
    "request": "launch", // "launch" or "attach"
    "program": "${workspaceFolder}/bin/worker", // 可执行文件的路径
    "cwd": "${workspaceFolder}/",
    "env": {
      "LD_LIBRARY_PATH": "${workspaceFolder}/ten_packages/system/xxx/lib", // linux
      "DYLD_LIBRARY_PATH": "${workspaceFolder}/ten_packages/system/xxx/lib" // macOS
    },
    "initCommands": ["process handle SIGURG --stop false --pass true"]
  }
  ```

- **使用 gdb 调试 C++ 代码**

  ```json
  {
    "name": "app (Go) (gdb, launch)",
    "type": "cppdbg",
    "request": "launch", // "launch" or "attach"
    "program": "${workspaceFolder}/bin/worker", // 可执行文件的路径
    "cwd": "${workspaceFolder}/",
    "MIMode": "gdb",
    "environment": [
      {
        // linux
        "name": "LD_LIBRARY_PATH",
        "value": "${workspaceFolder}/ten_packages/system/xxx/lib"
      },
      {
        // macOS
        "name": "DYLD_LIBRARY_PATH",
        "value": "${workspaceFolder}/ten_packages/system/xxx/lib"
      }
    ]
  }
  ```

#### 使用 debugpy 调试 Python 代码

请参阅上面的部分，了解如何使用 debugpy 调试 Python 代码。 使用设置的环境变量 `TEN_ENABLE_PYTHON_DEBUG` 和 `TEN_PYTHON_DEBUG_PORT` 启动应用程序。

```shell
TEN_ENABLE_PYTHON_DEBUG=true TEN_PYTHON_DEBUG_PORT=5678 ./bin/worker
```

然后，您可以将调试器附加到正在运行的进程。 以下是一个配置示例：

```json
{
  "name": "app (C++) (debugpy, attach)",
  "type": "debugpy",
  "request": "attach",
  "connect": {
    "host": "localhost",
    "port": 5678
  },
  "justMyCode": false
}
```

#### 同时调试 C++、Go 和 Python 代码

如果您想在 VSCode 中一键启动同时调试 C++、Go 和 Python 代码，您可以执行以下操作：

1. 定义一个任务，在附加调试器之前延迟几秒钟：

   ```json
   {
     "label": "delay 3 seconds",
     "type": "shell",
     "command": "sleep 3",
     "windows": {
       "command": "ping 127.0.0.1 -n 3 > nul"
     },
     "group": "none"
   }
   ```

2. 将以下配置添加到 `launch.json` 文件：

   ```json
   "configurations": [
        {
            "name": "app (golang) (debugpy, remote attach with delay)",
            "type": "debugpy",
            "request": "attach",
            "connect": {
                "host": "localhost",
                "port": 5678
            },
            "preLaunchTask": "delay 3 seconds",
            "justMyCode": false
        },
        {
            "name": "app (golang) (go, launch with debugpy)",
            "type": "go",
            "request": "launch",
            "mode": "exec",
            "cwd": "${workspaceFolder}/",
            "program": "${workspaceFolder}/bin/worker",
            "env": {
                "TEN_APP_BASE_DIR": "${workspaceFolder}",
                "TEN_ENABLE_PYTHON_DEBUG": "true",
                "TEN_PYTHON_DEBUG_PORT": "5678"
            }
        },
        {
            "name": "app (golang) (lldb, launch with debugpy)",
            "type": "lldb",
            "request": "launch",
            "program": "${workspaceFolder}/bin/worker",
            "cwd": "${workspaceFolder}/",
            "env": {
                "TEN_ENABLE_PYTHON_DEBUG": "true",
                "TEN_PYTHON_DEBUG_PORT": "5678"
            },
            "initCommands": [
                "process handle SIGURG --stop false --pass true"
            ]
        },
   ],
   "compounds": [
        {
            "name": "Mixed Go/Python",
            "configurations": [
                "app (golang) (go, launch with debugpy)",
                "app (golang) (debugpy, remote attach with delay)"
            ],
        },
        {
            "name": "Mixed Go/Python/C++ (lldb)",
            "configurations": [
                "app (golang) (lldb, launch with debugpy)",
                "app (golang) (debugpy, remote attach with delay)"
            ]
        }
   ]
   ```

如果您想同时调试 C++ 和 Python 代码，您可以使用复合配置 `Mixed Go/Python/C++ (lldb)`。 使用此配置，您可以同时对 C++、Go 和 Python 代码执行断点调试。 但是，变量检查仅支持 C++ 和 Python 代码，而不支持 Go 代码。

如果您想同时调试 Go 和 Python 代码，您可以使用复合配置 `Mixed Go/Python`。 使用此配置，您可以同时对 Go 和 Python 代码执行断点调试，并检查 Go 和 Python 代码的变量。

### 在 Python 应用程序中调试

如果应用程序是用 Python 编写的，这意味着扩展可以使用 Python 或 C++ 编写。

#### 使用 lldb 或 gdb 调试 C++ 代码

您可以使用以下配置来调试 C++ 代码：

```json
{
  "name": "app (Python) (cpp, launch)",
  "type": "cppdbg", //
  "request": "launch", // "launch" or "attach"
  "program": "/usr/bin/python3", // Python 解释器路径
  "args": ["main.py"],
  "cwd": "${workspaceFolder}/",
  "environment": [
    {
      "name": "PYTHONPATH",
      "value": "${workspaceFolder}/ten_packages/system/ten_runtime_python/lib:${workspaceFolder}/ten_packages/system/ten_runtime_python/interface"
    },
    {
      "name": "TEN_APP_BASE_DIR",
      "value": "${workspaceFolder}/"
    }
  ],
  "MIMode": "gdb" // "gdb" 或 "lldb"
}
```

#### 使用 debugpy 调试 Python 代码

请参阅上面的部分，了解如何使用 debugpy 调试 Python 代码。 您可以使用以下配置来调试 Python 代码：

```json
{
  "name": "app (Python) (debugpy, launch)",
  "type": "debugpy",
  "python": "/usr/bin/python3",
  "request": "launch",
  "program": "${workspaceFolder}/main.py",
  "console": "integratedTerminal",
  "cwd": "${workspaceFolder}/",
  "env": {
    "PYTHONPATH": "${workspaceFolder}/ten_packages/system/ten_runtime_python/lib:${workspaceFolder}/ten_packages/system/ten_runtime_python/interface",
    "TEN_APP_BASE_DIR": "${workspaceFolder}/",
    "TEN_ENABLE_PYTHON_DEBUG": "true"
  }
}
```

#### 同时调试 C++ 和 Python 代码

如果您想同时启动 C++ 和 Python 代码的调试，您可以使用配置 `app (Python) (debugpy, launch)` 启动应用程序，并使用以下配置将调试器附加到正在运行的进程：

```json
{
  "name": "app (Python) (cpp, attach)",
  "type": "cppdbg",
  "request": "attach", // "launch" 或 "attach"
  "program": "${workspaceFolder}/bin/worker", // 可执行文件的路径
  "cwd": "${workspaceFolder}/",
  "MIMode": "gdb",
  "environment": [
    {
      "name": "LD_LIBRARY_PATH",
      "value": "${workspaceFolder}/ten_packages/system/xxx/lib"
    },
    {
      "name": "DYLD_LIBRARY_PATH",
      "value": "${workspaceFolder}/ten_packages/system/xxx/lib"
    }
  ]
}
```
