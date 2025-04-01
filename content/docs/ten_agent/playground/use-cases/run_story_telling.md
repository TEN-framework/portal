---
title: Story Teller
---

This guide will help you to run the Story Teller usecase with Large Language Model in the TEN-Agent Playground.

## STT + TTS + LLM

### Prerequisites

- Make sure you have the TEN-Agent playground running. If not, follow the [Run Playground](https://doc.theten.ai/ten-agent/quickstart) guide to start the playground.
- You will need following information prepared:
  - STT info, any supported STT can be used. [Deepgram](https://deepgram.com/) is relatively easy to register and get started with.
  - TTS info, any supported TTS can be used. [Fish.Audio](https://fish.audio/) is relatively easy to register and get started with.
  - LLM info, For this use case only [OpenAI](https://openai.com) or OpenAI API compatible models are supported.
  - RTC info, currently only Agora RTC is supported. You can register your account at [Agora](https://www.agora.io/). We assume you have your App ID and App Certificate ready when you configure your `.env` file.

### Steps

1. Open the playground at [localhost:3000](http://localhost:3000) to configure your agent.
2. Select the graph type `story_teller`.
3. Click on `Module Picker` to open the module selection.
4. If you preferred STT/TTS module is not by default selected, you can select the module from the dropdown list. Note you will need to configure the module with the correct information like API key, etc.
5. The `LLM` module is preconfigured to have `OpenAI ChatGPT` selected, don't change it.
6. Click on `Save Change` to apply the module to the graph.
7. Click on the Button to the right of the graph selection to open the property configuration. You will see a list of properties that can be configured for the selected Large Language Model.
8. Configure the properties with the information you prepared.
9. Click on `Save Change` to apply the properties to the Large Language Model.
10. If you see the success toast, the properties are successfully applied to the Large Language Model.
11. You are all set! Now you can start speaking to the Voice Assistant by clicking on the `Connect` button. Note you will need to wait a few seconds for agent to initialzie itself.

### Using Azure STT

Azure STT is integrated within RTC extension module. That's why if you want to use Azure STT, you will need to select `story_teller_integrated_stt` graph type.

### Bind Tools

The story_teller use case is preconfigured to use `openai_image_generate_tool`, so usually you don't need to change anything.

## Realtime V2V

### Prerequisites

- Make sure you have the TEN-Agent playground running. If not, follow the [Run Playground](https://doc.theten.ai/ten-agent/quickstart) guide to start the playground.
- You will need following information prepared:
  - Realtime API Key
- RTC info, currently only Agora RTC is supported. You can register your account at [Agora](https://www.agora.io/). We assume you have your App ID and App Certificate ready when you configure your `.env` file.

### Steps

1. Open the playground at [localhost:3000](http://localhost:3000) to configure your agent.
2. Select the graph type `story_teller_realtime`.
3. Click on `Module Picker` to open the module selection.
4. The `V2V` module is preconfigured to have `OpenAI Realtime` selected. You can select other V2V modules from the dropdown list if needed. Note you will need to copy the `prompt` property from the `OpenAI Realtime` module to the new module, as module properties will be reset to default when switching.
5. Click on `Save Change` to apply the module to the graph if you have changed the V2V module, or if you have not changed the V2V module, you can skip this step.
6. Click on the Button to the right of the graph selection to open the property configuration. You will see a list of properties that can be configured for the selected V2V module.
7. Configure the `Realtime API Key` property with the information you prepared. If you have changed the V2V module in previous steps, do remember to copy the `prompt` property from the `OpenAI Realtime` module to the new module.
8. Click on `Save Change` to apply the property to the V2V module.
9. If you see the success toast, the property is successfully applied to the V2V module.
10. You are all set! Now you can start speaking to the Voice Assistant by clicking on the `Connect` button. Note you will need to wait a few seconds for agent to initialzie itself.

### Bind Tools

The story_teller_realtime use case is preconfigured to use `openai_image_generate_tool`, so usually you don't need to change anything.
