---
title: Dify 聊天机器人
---

在本教程中，我们将向您展示如何在 TEN-Agent Playground 中让 Dify 机器人说话。

## 前提条件

- 确保您已运行 TEN-Agent Playground。如果没有，请按照[运行 Playground](./getting_started) 指南启动 Playground。
- 您需要准备以下信息：
  - Dify 信息：
    - Dify API 密钥
  - STT 信息，可以使用任何支持的 STT。[Deepgram](https://deepgram.com/) 相对容易注册和上手。
  - TTS 信息，可以使用任何支持的 TTS。[Fish.Audio](https://fish.audio/) 相对容易注册和上手。
  - RTC 信息，目前仅支持 Agora RTC。您可以在 [Agora](https://www.agora.io/) 注册您的帐户。我们假设您在配置 `.env` 文件时已准备好您的 App ID 和 App Certificate。

> 您可以使用在 Dify 平台中定义的任何智能体/聊天助手。每个智能体/聊天助手都有自己的 API 密钥。

## 步骤

1. 打开 [localhost:3000](http://localhost:3000) 上的 Playground 以配置您的智能体。
2. 选择图表类型 `voice_assistant`。
3. 单击“模块选择器”以打开模块选择。
4. 如果您首选的 STT/TTS 模块默认未选中，您可以从下拉列表中选择模块。请注意，您需要使用 API 密钥等正确信息配置模块。
5. 从“LLM”模块中，单击下拉列表并选择“Dify 聊天机器人”。
6. 单击“保存更改”以将模块应用于图表。
7. 单击图表选择右侧的按钮以打开属性配置。您将看到可以为“Dify 聊天机器人”模块配置的属性列表。
8. 使用您准备的信息配置“Dify API 密钥”属性。
9. 单击“保存更改”以将属性应用于“Dify 聊天机器人”模块。
10. 如果您看到成功提示，则表示该属性已成功应用于“Dify 聊天机器人”模块。
11. 您已全部设置完毕！现在，您可以单击“连接”按钮开始与 Dify 机器人对话。请注意，您需要等待几秒钟才能初始化智能体。

## 使用 Azure STT

Azure STT 集成在 RTC 扩展模块中。因此，如果您想使用 Azure STT，您需要选择 `voice_assistant_integrated_stt` 图表类型。

## 故障排除

如果您遇到任何问题，请检查以下各项：

- 确保您具有 Dify 聊天机器人的正确 API 密钥。
- 确保在 Dify 中，您的聊天助手配置了有效的模型密钥。
- 确保您选择了并配置了正确的 STT 和 TTS 模块。
- 确保您选择了正确的图表类型。
