---
title: 概述
---

TEN Framework 具有高度灵活性，提供了丰富的功能，包括 TEN 云商店、软件包管理、多语言支持和多平台支持等。然而，这些功能可能需要较长的学习时间和较高的技术门槛，才能熟练操作 TEN Framework 完成 AI Agent 的开发和定制化。为便于开发者使用，TEN Framework 提供了一个名为 TEN Manager 的命令行工具，使开发者能够简便地修改和定制基于 TEN Framework 构建的 AI Agent。

由于命令行工具不如图形用户界面友好，因此 TEN Manager 除了命令行界面外，还内置了基于 Web UI 的可视化开发界面 — TEN Designer，提供丰富的功能帮助开发者开发和调试 TEN Apps 及 TEN Extension。这意味着开发者只需获取 TEN Manager 这一个工具，就能同时拥有命令行和图形用户界面的完整 TEN Framework 开发环境。

您可以通过以下链接获取 TEN Designer：

```text
https://github.com/TEN-framework/ten-framework/releases
```

TEN Designer 支持以下操作系统及架构，请根据您的平台获取对应版本：

- Windows
  - x86_64
- Linux
  - x86_64
- MacOS
  - x86_64
  - arm64

下载并解压后，使用以下命令启动 TEN Designer：

```shell
tman designer
```

您可以在任何 TEN App 的根目录下执行此命令，也可以在任意位置执行。如果在 TEN App 的根目录下执行，TEN Designer 会默认将该 TEN App 载入。您也可以在 TEN Designer 中手动载入任何 TEN App。因此，在特定 TEN App 根目录下启动 TEN Designer 并非必要操作，但可以简化初始手动载入 TEN App 的步骤。

启动后将看到如下信息，表示 TEN Designer 默认在端口 49483 上启动：

```text
🏆  Starting server at http://0.0.0.0:49483
```

您可以使用以下 URL 与 TEN Designer 交互：

```text
http://127.0.0.1:49483/
```

> 注意：如果您的 TEN Designer 运行在远程机器上，请使用远程机器的 IP 地址访问 TEN Designer。

## 概览

使用浏览器打开 TEN Designer 页面后，会看到如下界面：

![TEN designer 概观](/assets/png/ten_designer_overview.png)

在 TEN Designer 右上方可以看到几个功能按钮：

- 最右侧按钮显示当前 TEN Designer 的版本号，并自动检测是否有新版本发布。如有更新，会显示一个向上的箭头，点击后将打开新版本的下载页面。
- 左侧第一个按钮是 [TEN Agent](https://agent.theten.ai/) 按钮，点击后将打开 TEN Agent 页面。TEN Agent 是使用 TEN Framework 构建的完整 AI Agent 实现，TEN Designer 的主要目标之一是让开发者能够轻松地通过 TEN Designer 开发、调试和定制 TEN Agent。
- 左侧第二个按钮是 [TEN Framework](https://github.com/TEN-framework/ten-framework) 的 GitHub 页面，点击后将打开 TEN Framework 的 GitHub 仓库。如需了解更多关于 TEN Framework 的信息、源代码或提交问题，可以访问此页面。
- 最左侧有两个按钮，分别用于切换明暗模式和选择语言。

在 TEN Designer 的左上方有几个下拉菜单，开发者可以通过这些菜单使用 TEN Designer 的各项功能。

## 处理 TEN App

### 载入已有的 TEN App

通过 App 菜单的 Load App 按钮，可以载入已有的 TEN App。点击按钮后，会看到如下界面：

![载入已有的 TEN app](/assets/png/ten_designer_load_app.png)

通过此文件浏览对话框，开发者可以指定已有 TEN App 的根目录来载入应用。

### 管理已载入的 TEN App

通过 App 菜单的 Manage Loaded App(s) 按钮，可以管理已载入的 TEN App。点击按钮后，会看到如下 Apps Manager 界面：

![管理已经载入的 TEN app](/assets/png/ten_designer_manage_loaded_apps.png)

开发者可以通过此对话框：

- 卸载已载入的 TEN App
- 重新载入指定的 TEN App
- 重新载入所有已载入的 TEN App
- 安装指定 App 的所有依赖
- 运行指定 App 的功能

### 安装指定 App 的所有依赖

开发者可以在 TEN App 中安装各种 TEN 软件包，一个 TEN App 所依赖的所有 TEN 软件包都会记录在 `manifest.json` 文件中。以下是一个 `manifest.json` 文件的示例：

```json
{
  "type": "app",
  "name": "aaa",
  "version": "0.8.18",
  "dependencies": [
    {
      "type": "system",
      "name": "ten_runtime",
      "version": "0.8.18"
    },
    {
      "type": "extension",
      "name": "ffmpeg_muxer",
      "version": "^0.1.0"
    },
    {
      "type": "extension",
      "name": "ffmpeg_demuxer",
      "version": "^0.1.0"
    },
    {
      "type": "extension",
      "name": "ffmpeg_client",
      "version": "^0.1.0"
    },
    {
      "type": "protocol",
      "name": "msgpack",
      "version": "^0.8.18"
    }
  ],
  "scripts": {
    "start": "python3 tools/run_script.py start",
    "build": "python3 tools/run_script.py build"
  }
}
```

从上述配置可以看出，该 TEN App 依赖以下几个 TEN 软件包：

- `ten_runtime`：TEN Framework 的系统软件包
- `ffmpeg_demuxer`：用于解码音频和视频的 TEN Extension 软件包
- `ffmpeg_muxer`：用于编码音频和视频的 TEN Extension 软件包
- `ffmpeg_client`：用于使用另外两个 ffmpeg extension 软件包处理音频和视频的 TEN Extension 软件包
- `msgpack`：用于使用 MessagePack 协议进行消息序列化和反序列化的 TEN Protocol 软件包

实际上，在完成 TEN App 所有依赖的安装后，系统中的 TEN 软件包文件结构如下：

```text
├── ten_packages
│   ├── extension
│   │   ├── ffmpeg_client
│   │   ├── ffmpeg_demuxer
│   │   └── ffmpeg_muxer
│   ├── protocol
│   │   └── msgpack
│   └── system
│       ├── ffmpeg
│       └── ten_runtime
```

值得注意的是，尽管没有在 `manifest.json` 中显式声明，系统中还多了一个 `ffmpeg` 系统软件包。这是因为 `ffmpeg_demuxer` 和 `ffmpeg_muxer` 依赖了 `ffmpeg` 这个系统软件包，TEN Manager 会自动识别并安装这些传递依赖。

通过 TEN Designer 的 Apps Manager 界面，开发者可以对指定的 App 执行 Install All 操作，轻松完成上述所有依赖的安装过程。点击按钮后，会看到如下界面，显示安装进度：

![安装指定 App 的所有依赖](/assets/png/ten_designer_app_install_all.png)

### 从云商店安装 TEN Extension

通过 Graph 菜单的 Open Extension Store 按钮，可以打开 TEN 云商店，并从云商店安装 TEN Extension 到当前的 TEN App。点击按钮后，会看到如下界面：

![TEN 云商店](/assets/png/ten_designer_extension_store.png)

在 TEN 云商店中，开发者可以搜索所需的 TEN Extension，并点击 Install 按钮安装到当前的 TEN App。安装完成后，可以在当前 TEN App 中查看已安装的 TEN Extension。

### 运行 TEN App

在 Apps Manager 中，可以对指定的 App 执行预设的运行操作。在 Apps Manager 中点击 Run 按钮后，会看到如下界面：

![运行 TEN app](/assets/png/ten_designer_app_run.png)

在对话框中，开发者可以从下拉菜单中选择要执行的预设操作。通常包括以下几种操作：

- 运行 App：启动 App 并在 TEN Designer 的消息窗口中显示 App 的输出信息。
- 编译 App：对 App 进行编译。由于 TEN Framework 支持多种编程语言，有些语言需要编译，有些则无需编译。例如，基于 C++ 开发的 TEN App 需要编译，而基于 Python 开发的 TEN App 则无需编译。

以下是一个基于 C++ 开发的 TEN App 的编译界面：

![编译 TEN app](/assets/png/ten_designer_app_build.png)

编译完成后，可以继续执行 TEN App 的启动操作，系统会弹出一个窗口，实时显示 TEN App 的运行日志：

![启动 TEN app](/assets/png/ten_designer_app_start.png)

## 处理 TEN Graph

### 载入已有的 TEN Graph

通过 Graph 菜单的 Open Existing Graph 按钮，可以载入已有的 TEN Graph。载入成功后，会看到类似如下界面：

![TEN Graph](/assets/png/ten_designer_graph_overview.png)

以这个 Graph 为例，它包含 3 个 TEN Extensions，分别是：

- `ffmpeg_demuxer`
- `ffmpeg_muxer`
- `ffmpeg_client`

每个 TEN Extension 都有其对应的输入和输出。以 `ffmpeg_demuxer` 为例，它具有以下输入与输出：

- 2 个 cmd 输入
- 1 个 cmd 输出
- 1 个 audio_frame 输出
- 1 个 video_frame 输出

点击输入输出的数字按钮，可以打开如下对话框，用于管理输入输出的连接：

![TEN Message Input/Output Dialog](/assets/png/ten_designer_msg_info_dialog.png)

### 自动排布 Graph

当开发者手动调整 TEN Graph 中的 TEN Extension 位置后，可以点击 Graph 菜单中的 Auto Layout 按钮，自动排布 TEN Graph 中的 TEN Extension。

### 打开 TEN Extension 的上下文菜单

在 Graph 中，对每个 TEN Extension 右键点击，可以打开 TEN Extension 的上下文菜单：

![TEN extension context menu](/assets/png/ten_designer_extension_context_menu.png)

在上下文菜单中，可以打开 TEN Extension 的 `manifest.json` 文件、`property.json` 文件，也可以直接在 TEN Extension 的根目录下启动终端，方便开发者对该 TEN Extension 进行修改和定制：

![Open Manifest](/assets/png/ten_designer_context_menu_effect.png)
