---
title: TEN-Agent 中的中断机制
---

## 概述

[TEN-Agent](https://github.com/TEN-framework/TEN-Agent) 中的中断机制由两个主要部分组成：**中断检测**和**中断响应**。本文档详细介绍了这两个部分，并解释了中断命令如何在 AI 智能体的图中传播。

## 第 1 部分：中断检测

### 1. 当前中断检测的实现

当前的([interrupt_detector_python](https://github.com/TEN-framework/TEN-Agent/tree/main/agents/ten_packages/extension/interrupt_detector_python))扩展实现了一种基于文本的中断检测机制：

```python
def on_data(self, ten: TenEnv, data: Data) -> None:
    text = data.get_property_string(TEXT_DATA_TEXT_FIELD)
    final = data.get_property_bool(TEXT_DATA_FINAL_FIELD)

    # 当文本为 final 或达到阈值长度时触发中断
    if final or len(text) >= 2:
        self.send_flush_cmd(ten)
```

中断检测器在以下情况下触发：

1. 当接收到最终文本时 (`is_final = true`)
2. 当文本长度达到阈值时（≥ 2 个字符）

### 2. 自定义中断检测

要实现您自己的中断检测逻辑，您可以参考[interrupt_detector_python](https://github.com/TEN-framework/TEN-Agent/tree/main/agents/ten_packages/extension/interrupt_detector_python)的实现作为示例，并根据您的特定需求自定义中断条件。

## 第 2 部分：中断响应

### AI 智能体图中的链式处理

在典型的 AI 智能体图中，中断命令 (`flush`) 遵循链式处理模式：

```text
   中断检测器
       ↓
    LLM/ChatGPT
       ↓
      TTS
       ↓
   agora_rtc
```

链中的每个扩展在接收到 `flush` 命令时都遵循两个关键步骤：

1. 清理其自身的资源和内部状态
2. 将 `flush` 命令转发到下游扩展

这确保：

- 扩展按正确的顺序清理
- 没有残留数据流经系统
- 每个扩展在下一个操作之前都返回到干净状态

## 结论

[TEN-Agent](https://github.com/TEN-framework/TEN-Agent) 的中断机制使用链式处理模式来确保 AI 智能体图中所有扩展的有序清理。当发生中断时，每个扩展首先清理自身的状态，然后将 `flush` 命令转发到下游扩展，从而确保后续操作的系统状态干净。
