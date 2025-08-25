---
title: LLM 工具扩展
---

## 使用 tman 创建 AsyncLLMToolBaseExtension

运行以下命令，

```bash
tman install extension default_async_llm_tool_extension_python --template-mode --template-data package_name=llm_tool_extension --template-data class_name_prefix
=LLMToolExtension
```

## 要实现的抽象 API

### get_tool_metadata(self, ten_env: TenEnv) -> list[LLMToolMetadata]

当 LLM 扩展要向任何已连接的 LLM 注册自身时，会调用此方法。它应该返回一个 LLMToolMetadata 列表。

### run_tool(self, ten_env: AsyncTenEnv, name: str, args: dict) -> LLMToolResult

当 LLM 扩展接收到工具调用请求时，会调用此方法。它应该执行工具函数并返回结果。

## APIs

### cmd_out: tool_register

此 API 用于发送工具注册请求。从 `get_tool_metadata` 返回的 LLMToolMetadata 数组将作为输出发送。

### cmd_in: tool_call

此 API 用于接收工具调用请求。当收到 cmd_in 时，将执行 `run_tool`。
