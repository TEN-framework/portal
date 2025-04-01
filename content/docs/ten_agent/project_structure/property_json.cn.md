---
title: 理解 property.json
---

此文件包含扩展的编排配置。它是主要的运行时配置文件。

![图表概览](/assets/png/graph_at_a_glance.png?raw=true)

`property.json` 文件包含以下编排信息：

- 图 (Graphs)
- 节点 (Nodes)
- 连接 (Connections)

## 图 (Graphs)

`predefined_graphs` 属性包含了可用图的列表。每个图定义了 agent 在特定场景中的行为方式。每个图都有一个 `name` 属性，用于标识图。

每个图包含 `nodes` 和 `connections` 属性。

## 节点 (Nodes)

`nodes` 部分包含图中包含的扩展列表。每个节点都有一个 `name` 属性，用于标识节点，以及一个 `addon` 属性，用于指定它将使用的扩展模块。你可以在一个图中拥有多个相同扩展类型的节点。例如，你可以拥有多个具有相同 `addon` 属性的 `chatgpt_openai_python` 扩展，而每个节点将具有不同的 `name` 属性。它的工作方式类似于同一扩展的多个实例。

#### 节点属性

节点的 `property` 部分包含扩展的配置。每个扩展都有其特定的属性，这些可用的属性在扩展文件夹下的 `manifest.json` 文件中定义。你可以使用定义扩展的运行时属性来自定义其行为。以下是如何配置 `chatgpt_openai_python` 扩展的示例：

```json
{
  "name": "chatgpt_openai_python",
  "addon": "chatgpt_openai_python",
  "property": {
    "api_key": "${env:OPENAI_API_KEY|}",
    "model": "gpt-3.5-turbo",
    "temperature": 0.5,
    "max_tokens": 100,
    "prompt": "You are a helpful assistant"
  }
}
```

![Property JSON 节点](/assets/png/property_json_connections.png?raw=true)

#### 读取环境变量

扩展通常需要 `api_key` 才能工作。如果你不想在 `property.json` 文件中硬编码 `api_key`，可以使用环境变量。你可以使用 `${env:<env_var_name>|<default_value>}` 语法来读取环境变量。以下是如何读取 `OPENAI_API_KEY` 环境变量的示例：

```json
{
  "name": "chatgpt_openai_python",
  "addon": "chatgpt_openai_python",
  "property": {
    "api_key": "${env:OPENAI_API_KEY|}"
  }
}
```

## 通信链路 (Connections)

> `connections`部分包含节点之间通信链路的列表。每个通信链路分别指定了源节点和目标节点。每个通信链路都有一个 `extension_group` 和 `extension` 属性，用于指定源节点，并定义了 TEN 框架支持的一组多模态数据协议（`audio_frame`、`video_frame`、`data`、`cmd`）。对于每个数据协议，它都有一个目标定义列表，并且每个目标定义都有一个 `name` 属性（它是属性数据的键）和一个 `dest` 属性（它定义了目标节点列表）。下面是如何连接两个节点的示例，

```json
{
  "extension_group": "default",
  "extension": "agora_rtc",
  "audio_frame": [
    {
      "name": "pcm_frame",
      "dest": [
        {
          "extension_group": "default",
          "extension": "deepgram_asr"
        }
      ]
    }
  ]
}
```

![Property JSON 连接](/assets/png/property_json_nodes.png?raw=true)

在上面的示例中，我们将 `agora_rtc` 扩展连接到 `deepgram_asr` 扩展。`agora_rtc` 扩展正在向 `deepgram_asr` 扩展发送 `pcm_frame` 数据。
