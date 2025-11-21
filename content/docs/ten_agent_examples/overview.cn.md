---
title: TEN Agent 示例概述
---

TEN Agent 示例是您学习使用 TEN 框架构建对话式 AI 代理的综合指南。这些示例演示了创建实时、多模态语音代理的最佳实践，并与 Gemini 2.0 Live 和 OpenAI Realtime API 等现代 LLM 集成。

## 您将学到什么

TEN Agent 示例部分提供实际、实践性的文档，帮助您：

- **快速开始** — 在 10 分钟内设置并运行您的第一个语音代理
- **理解架构** — 了解 TEN Agent 如何编排 ASR、LLM、TTS 和 RTC 组件
- **自定义代理** — 通过模块化的"main"扩展来扩展和修改代理行为
- **构建扩展** — 为 LLM、语音服务和外部 API 创建自定义扩展
- **部署代理** — 在生产环境中打包和部署您的代理

## 文档结构

### 快速开始
如果您是 TEN Agent 的新手，请从这里开始。您将设置开发环境并运行您的第一个语音代理。

### 架构与设计
了解 TEN Agent 的工作原理，包括实时通信流、事件处理和组件交互。

### 自定义指南
学习如何通过灵活的 main 扩展模式来修改和扩展代理以满足您的特定需求。

### 扩展开发
为 LLM、STT/TTS 提供商和自定义集成构建自己的扩展。

### API 参考
事件、架构和配置选项的完整参考文档。

### 教程与示例
演示特定用例和模式的真实示例。

## 核心概念

**实时语音代理**：TEN Agent 支持全双工对话，具有自然的中断处理，提供无缝的语音交互。

**模块化架构**：通过自包含的扩展来扩展功能。核心代理逻辑位于"main"扩展中，您可以根据自己的用例进行定制。

**多语言支持**：使用 Python、Node.js、Go 或 C++ 构建扩展。在单个代理中混合和匹配语言。

**生产就绪**：TEN Agent 提供了大规模部署对话式 AI 所需的基础设施和模式。

## 相关资源

- [TEN Agent 仓库](https://github.com/TEN-framework/TEN-Agent) — 源代码和示例
- [TEN Framework 文档](/docs/ten_framework) — 框架深入探讨
- [TEN Framework 仓库](https://github.com/TEN-framework/ten-framework) — 核心框架
