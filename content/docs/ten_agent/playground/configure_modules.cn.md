---
title: 配置模块
---

本指南将帮助您在 TEN-Agent Playground 中配置模块。

## 配置模块

1. 打开 [localhost:3000](http://localhost:3000) 上的 Playground 以配置您的智能体。
2. 选择一种图表类型（例如，语音智能体、实时对话智能体）。
3. 单击图表选择右侧的按钮以打开模块选择。
4. 根据图表类型，您可以从下拉列表中选择可用的模块。
5. 单击“保存更改”以将模块应用于图表。
6. 如果您看到成功提示，则表示该模块已成功应用于图表。

## 可用模块

以下模块类型可用于 TEN-Agent Playground：

### 语音识别 (STT)

语音识别模块将语音转换为文本。

### 文本转语音 (TTS)

文本转语音模块将文本转换为语音。

### 大型语言模型 (LLM)

大型语言模型模块基于相关输入文本生成文本。

### 语音转语音模型 (V2V)

语音转语音模型模块基于相关输入语音生成语音。

### 工具 (TOOL)

工具模块提供一组供智能体使用的工具。这些工具可以绑定到 `LLM` 模块或 `V2V` 模块。

## 绑定工具模块

您可以在 TEN-Agent Playground 中将工具模块绑定到 `LLM` 或 `V2V` 模块。
工具可以为智能体提供其他功能，例如天气检查、新闻更新等。如果需要，您也可以编写自己的工具扩展。

1. 打开 [localhost:3000](http://localhost:3000) 上的 Playground 以配置您的智能体。
2. 选择一种图表类型（例如，语音智能体、实时智能体）。
3. 单击图表选择右侧的按钮以打开模块选择。
4. 根据图表类型，您将在模块选择器中看到 `LLM` 或 `V2V` 模块。
5. 单击模块右侧的按钮以打开工具选择。
6. 选择可绑定到模块的可用工具。
7. 单击“保存更改”以将工具应用于模块。
8. 如果您看到成功提示，则表示该工具已成功应用于模块。
