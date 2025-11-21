---
title: VSCode 开发容器
---

在使用 TEN 进行开发时，通常建议在容器内进行编译和开发。然而，如果在容器外使用 VSCode，可能会遇到符号无法解析的问题。这是因为一些环境依赖项安装在容器内部，而 VSCode 无法识别容器的环境，导致头文件无法解析。

为了解决这个问题，可以将 VSCode 挂载到容器内部，使其能够识别容器的环境并正确解析头文件。本指南将引导您使用 VSCode 的 Dev Containers 和 Docker 扩展来实现此目的。

## 步骤 1：安装 Docker 扩展

首先，在 VSCode 中安装 [Docker 扩展](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-docker)。此扩展允许您直接在 VSCode 中管理 Docker 容器。

## 步骤 2：安装 Dev Containers 扩展

接下来，安装 [Dev Containers 扩展](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers)。此扩展使 VSCode 能够连接到 Docker 容器进行开发。

## 步骤 3：使用 Docker Compose 启动开发环境

此步骤类似于[快速入门](./getting_started)指南中概述的过程。但是，请勿运行：

```shell title="终端"
docker compose up
```

使用 `docker compose up -d` 命令，在分离模式下启动容器：

```shell title="终端"
docker compose up -d
```

执行此命令后，容器应启动。打开 VSCode，切换到 Docker 扩展，您应该会看到正在运行的容器。

![Docker 容器](https://ten-framework-assets.s3.amazonaws.com/doc-assets/docker_containers.png)

## 步骤 4：连接到容器

在 VSCode 中的 Docker 扩展中，在列表中找到 `ten_agent_dev` 容器，然后单击“Attach Visual Studio Code”以连接到容器。然后，VSCode 将打开一个连接到容器的新窗口，您可以在其中继续进行开发。

在连接到容器的 Dev Container 环境中，不会应用您的本地扩展和设置，因为此环境位于容器内。因此，您需要在容器内安装扩展并配置设置。要在容器内安装扩展，请打开新启动的 VSCode 窗口，单击左侧边栏中的“Extensions”，搜索所需的扩展，然后按照提示在容器内安装它。

## 步骤 5：设置断点进行调试

在代码中设置断点是调试时常用的做法。要在代码中设置断点，请单击要设置断点的行号的左侧边距。将出现一个红色圆点，表示已设置断点。

![设置断点](https://ten-framework-assets.s3.amazonaws.com/doc-assets/setting_breakpoint.png)

如果无法设置断点，通常意味着您尚未在容器中安装语言扩展。您可以通过单击左侧边栏中的“Extensions”图标，搜索所需的扩展，然后按照提示安装它来安装语言扩展。

设置断点后，您可以通过单击左侧边栏中的“Run and Debug”图标，选择“debug python”配置，然后单击绿色播放按钮开始调试来开始调试。

![调试配置](https://ten-framework-assets.s3.amazonaws.com/doc-assets/debug_config.png?raw=true)

通过这种方式，VSCode 直接启动智能体应用程序，这意味着 Golang Web 服务器不参与运行。因此，您需要注意以下几点：

### 在此模式下使用哪个图？

Web 服务器将在启动智能体时帮助您操作 `property.json`，以帮助您选择要使用的图。但是，在此模式下，您需要手动修改 `property.json` 以选择要使用的图。Ten 默认会选择**第一个将 `auto_start` 属性设置为 true 的图**进行启动。

### RTC 属性

RTC 功能对于您的客户端与智能体服务器通信是强制性的。Web 服务器将帮助您生成 RTC 令牌和频道，并将这些信息更新到 `property.json` 中。但是，在此模式下，您需要手动修改 `property.json` 以自行更新 RTC 令牌和频道。最简单的方法是先使用 playground/demo 运行，然后会生成一个临时属性文件，您可以从中复制 RTC 令牌和频道。

您应在 ping 请求日志中找到临时属性文件路径，如下所示：

```shell
2024/11/23 08:39:19 INFO handlerPing start channelName=agora_74np6e requestId=218f8e36-f4d0-4c83-a6e8-d3b4dec2a187 service=HTTP_SERVER
2024/11/23 08:39:19 INFO handlerPing end worker="&{ChannelName:agora_74np6e HttpServerPort:10002 LogFile:/tmp/astra/app-agora_74np6e-20241123_083855_000.log Log2Stdout:true PropertyJsonFile:/tmp/astra/property-agora_74np6e-20241123_083855_000.json Pid:5330 QuitTimeoutSeconds:60 CreateTs:1732351135 UpdateTs:1732351159}" requestId=218f8e36-f4d0-4c83-a6e8-d3b4dec2a187 service=HTTP_SERVER
```

临时属性文件路径显示为 `PropertyJsonFile:/tmp/astra/property-agora_74np6e-20241123_083855_000.json`。
