---
title: 概述
---

TEN Agent 是一个由 TEN 驱动的对话式 AI 代理，集成了 Gemini 2.0 Live、OpenAI Realtime、RTC 等技术。它提供实时的视觉、听觉和语音能力，同时完全兼容 Dify 和 Coze 等流行的工作流平台。

## 链接

- [TEN Agent](https://github.com/TEN-framework/TEN-Agent)
- [TEN Framework](https://github.com/TEN-framework/ten-framework)

## 架构

TEN Agent 项目由以下主要组件组成，为开发者提供清晰的结构和可扩展性：

1. **Agents**：包含构建和运行 AI 代理所需的核心逻辑、二进制文件和示例。在 Agents 文件夹中，有一个名为 `ten_packages` 的子文件夹，其中包含各种即用型扩展。通过利用这些扩展，开发者可以构建和定制适合特定任务或工作流的强大代理。

2. **Dev Server**：后端服务，负责编排代理和处理扩展。
3. **Web Server**：运行在 8080 端口，提供前端界面。Web 服务器处理 HTTP 请求并提供资源文件。
4. **Extensions**：用于 LLM、TTS/STT 和外部 API 的模块化集成，支持轻松定制。
5. **Playground**：用于测试、配置和微调代理的交互式环境。
6. **Demo**：展示 TEN Agent 实际应用的部署就绪设置。

## Docker 容器

TEN Agent 包含以下 Docker 容器：

- `ten_agent_dev`：驱动 TEN Agent 的主要开发容器。它包含运行环境、开发工具和构建运行代理所需的依赖项。该容器允许您执行 `task use` 命令来构建代理，以及 `task run` 命令来启动 Web 服务器。

- `ten_agent_playground`：运行在 3000 端口，专用于 Web 前端界面的容器。它提供编译后的前端资源，并提供一个交互式环境，用户可以在其中配置模块、选择扩展和测试代理。playground 界面允许您可视化选择图类型（如语音代理或实时代理）、选择模块和配置 API 设置。

- `ten_agent_demo`：运行在 3002 端口，面向部署的容器，提供生产就绪的示例设置。它展示了用户如何在实际场景中部署配置好的代理，所有必要组件都打包在一起，便于部署。

## Agents

Agents 文件夹是项目的核心，包含：

- 定义代理行为的核心二进制文件和示例。
- 支持各种 AI 用例灵活配置的脚本和输出。
- 供开发者创建、修改和增强 AI 代理的工具。

通过其结构化设计，Agents 文件夹使您能够构建适合特定应用的代理，无论是语音助手、聊天机器人还是任务自动化。

## Demo

Demo 文件夹提供了展示 TEN Agent 运行的部署就绪环境，包括：

- 在生产环境中运行代理的示例配置。
- 展示框架功能的预构建代理和工作流。
- 向用户、客户或合作者展示实际应用的工具。

## Playground

当 playground 启动并运行后，用户可以利用模块选择器来：

- 从预构建模块中选择和配置扩展。
- 试验不同的 AI 模型、TTS/STT 系统和实时通信工具。
- 在安全的交互式环境中测试代理行为。

playground 作为创新中心，使开发者能够轻松探索和微调他们的 AI 系统。
