---
title: LLM 扩展
---

## 使用 tman 创建 AsyncLLMBaseExtension

运行以下命令，

```bash
tman install extension default_async_llm_extension_python --template-mode --template-data package_name=llm_extension --template-data class_name_prefix
=LLMExtension
```

## 要实现的抽象 API

### on_data_chat_completion(self, ten_env: TenEnv, \*\*kargs: LLMDataCompletionArgs) -> None

当 LLM 扩展接收到数据补全请求时，会调用此方法。当以流模式通过数据协议传递数据时使用。

### on_call_chat_completion(self, ten_env: TenEnv, \*\*kargs: LLMCallCompletionArgs) -> any

当 LLM 扩展接收到调用补全请求时，会调用此方法。当以非流模式通过调用协议传递数据时使用。

### on_tools_update(self, ten_env: TenEnv, tool: LLMToolMetadata) -> None

当 LLM 扩展接收到工具更新请求时，会调用此方法。

## APIs

### cmd_in: tool_register

此 API 用于接收工具注册请求。将接收 LLMToolMetadata 数组作为输入。这些工具将附加到 `self.available_tools` 以供将来使用。

### cmd_out: tool_call

此 API 用于发送工具调用请求。您可以将此 API 连接到任何 LLMTool 扩展目的地以获取工具调用结果。
