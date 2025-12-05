---
title: Python 异步扩展
---

**Python 异步扩展**是一个使用 Python 的 `asyncio` 框架的模块化组件。如果您想将使用 `asyncio` 的现有 Python 代码包装到 TEN 扩展中，那么使用 Python 异步扩展是最简单、最方便的选择。

## 示例：默认 Python 异步扩展

以下是 Python 异步扩展的结构方式：

```python
import asyncio
from ten_runtime import AsyncExtension, AsyncTenEnv

class DefaultAsyncExtension(AsyncExtension):
    async def on_configure(self, ten_env: AsyncTenEnv) -> None:
        # 模拟异步操作，例如网络、文件 I/O。
        await asyncio.sleep(0.5)

    async def on_init(self, ten_env: AsyncTenEnv) -> None:
        # 模拟异步操作，例如网络、文件 I/O。
        await asyncio.sleep(0.5)

    async def on_start(self, ten_env: AsyncTenEnv) -> None:
        # 模拟异步操作，例如网络、文件 I/O。
        await asyncio.sleep(0.5)

    async def on_deinit(self, ten_env: AsyncTenEnv) -> None:
        # 模拟异步操作，例如网络、文件 I/O。
        await asyncio.sleep(0.5)

    async def on_cmd(self, ten_env: AsyncTenEnv, cmd: Cmd) -> None:
        cmd_json = cmd.to_json()
        ten_env.log_debug(f"DefaultAsyncExtension on_cmd: {cmd_json}")

        # 模拟异步操作，例如网络、文件 I/O。
        await asyncio.sleep(0.5)

        # 向其他扩展发送新命令并等待结果。结果将返回给原始发送者。
        new_cmd = Cmd.create("hello")
        cmd_result = await ten_env.send_cmd(new_cmd)
        ten_env.return_result(cmd_result, cmd)
```

每种方法都使用 `await asyncio.sleep()` 模拟延迟。

## 常见问题

### 用于事件处理的异步循环

- 创建一个队列：使用 `asyncio.Queue`。
- 创建一个用于事件处理的异步任务。

这是示例代码：

```python
import asyncio
from ten_runtime import AsyncExtension, AsyncTenEnv

class DefaultAsyncExtension(AsyncExtension):
    queue = asyncio.Queue()
    loop:asyncio.AbstractEventLoop = None

    async def on_start(self, ten_env: AsyncTenEnv) -> None:
        self.loop = asyncio.get_event_loop()

        self.loop.create_task(self._consume())

    async def on_stop(self, ten_env: AsyncTenEnv) -> None:
        self.queue.put(None)

    async def _consume(self) -> None:
        while True
            try:
                value = await self.queue.get()
                if value is None:
                    self.ten_env.log_info("async loop exit")
                    break

                # 用于处理从队列检索的值的代码。

            except Exception as e:
                self.ten_env.log_error(f"Failed to handle {e}")
```

## 结论

TEN 的 Python 异步扩展提供了一种以异步方式处理长时间运行任务的强大方法。通过集成 Python 的 `asyncio` 框架，扩展能够确保诸如网络调用或文件处理之类的操作是高效且非阻塞的。这使得 TEN 成为构建具有异步功能的可扩展模块化应用程序的绝佳选择。
