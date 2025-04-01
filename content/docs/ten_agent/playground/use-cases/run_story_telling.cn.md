---
title: 故事讲述者
---

本指南将帮助您在 TEN-Agent Playground 中使用故事大王用例。

## STT + TTS + LLM

### 前提条件

- 确保您已运行 TEN-Agent Playground。如果没有，请按照[运行 Playground](https://doc.theten.ai/ten-agent/quickstart) 指南启动 Playground。
- 您需要准备以下信息：
  - STT 信息，可以使用任何支持的 STT。[Deepgram](https://deepgram.com/) 相对容易注册和上手。
  - TTS 信息，可以使用任何支持的 TTS。[Fish.Audio](https://fish.audio/) 相对容易注册和上手。
  - LLM 信息，对于此用例，仅支持 [OpenAI](https://openai.com) 或与 OpenAI API 兼容的模型。
  - RTC 信息，目前仅支持 Agora RTC。您可以在 [Agora](https://www.agora.io/) 注册您的帐户。我们假设您在配置 `.env` 文件时已准备好您的 App ID 和 App Certificate。

### 步骤

1. 打开 [localhost:3000](http://localhost:3000) 上的 Playground 以配置您的智能体。
2. 选择图表类型 `story_teller`。
3. 单击“模块选择器”以打开模块选择。
4. 如果您首选的 STT/TTS 模块默认未选中，您可以从下拉列表中选择模块。请注意，您需要使用 API 密钥等正确信息配置模块。
5. “LLM”模块已预先配置为选择“OpenAI ChatGPT”，请勿更改它。
6. 单击“保存更改”以将模块应用于图表。
7. 单击图表选择右侧的按钮以打开属性配置。您将看到可以为选定的大型语言模型配置的属性列表。
8. 使用您准备的信息配置属性。
9. 单击“保存更改”以将属性应用于大型语言模型。
10. 如果您看到成功提示，则表示属性已成功应用于大型语言模型。
11. 您已全部设置完毕！现在，您可以单击“连接”按钮开始与语音助手对话。请注意，您需要等待几秒钟才能初始化智能体。

### 使用 Azure STT

Azure STT 集成在 RTC 扩展模块中。因此，如果您想使用 Azure STT，您需要选择 `story_teller_integrated_stt` 图表类型。

### 绑定工具

故事大王用例预先配置为使用 `openai_image_generate_tool`，因此通常您无需进行任何更改。

## 实时 V2V

### 前提条件

- 确保您已运行 TEN-Agent Playground。如果没有，请按照[运行 Playground](https://doc.theten.ai/ten-agent/quickstart) 指南启动 Playground。
- 您需要准备以下信息：
  - 实时 API 密钥
- RTC 信息，目前仅支持 Agora RTC。您可以在 [Agora](https://www.agora.io/) 注册您的帐户。我们假设您在配置 `.env` 文件时已准备好您的 App ID 和 App Certificate。

### 步骤

1. 打开 [localhost:3000](http://localhost:3000) 上的 Playground 以配置您的智能体。
2. 选择图表类型 `story_teller_realtime`。
3. 单击“模块选择器”以打开模块选择。
4. “V2V”模块已预先配置为选择“OpenAI Realtime”。如果需要，您可以从下拉列表中选择其他 V2V 模块。请注意，您需要将 `prompt` 属性从“OpenAI Realtime”模块复制到新模块，因为切换时模块属性将重置为默认值。
5. 如果您更改了 V2V 模块，请单击“保存更改”以将模块应用于图表；如果您未更改 V2V 模块，则可以跳过此步骤。
6. 单击图表选择右侧的按钮以打开属性配置。您将看到可以为选定的 V2V 模块配置的属性列表。
7. 使用您准备的信息配置“实时 API 密钥”属性。如果您在前几步中更改了 V2V 模块，请务必将 `prompt` 属性从“OpenAI Realtime”模块复制到新模块。
8. 单击“保存更改”以将属性应用于 V2V 模块。
9. 如果您看到成功提示，则表示该属性已成功应用于 V2V 模块。
10. 您已全部设置完毕！现在，您可以单击“连接”按钮开始与语音助手对话。请注意，您需要等待几秒钟才能初始化智能体。

### 绑定工具

故事大王实时用例预先配置为使用 `openai_image_generate_tool`，因此通常您无需进行任何更改。
