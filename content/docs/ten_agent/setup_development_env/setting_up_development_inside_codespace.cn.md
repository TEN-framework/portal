---
title: 在 Codespace 中云端开发
---

Github Codespace 是一个基于云的开发环境，允许您直接在云中开发代码。这是开发智能体的好方法，无需设置本地开发环境。您不需要强大的网络或强大的机器。本指南将向您展示如何使用 Github CodeSpace 为 TEN Agent 设置开发环境。

## 步骤 1：使用 TEN-Agent 存储库创建 Codespace

导航到 TEN-Agent github 存储库，然后单击“Code”按钮。然后，选择“Open with Codespaces”。Github 将在新的浏览器选项卡中为您创建一个 Codespace。首次创建 Codespace 时，可能需要几分钟才能设置完成。

![使用 Codespaces 打开](/assets/png/start_codespace.png?raw=true)

## 步骤 2：开始使用 Codespace

一旦 Codespace 准备就绪，您将在浏览器中看到 VSCode 编辑器。您可以开始在 Codespace 中使用 TEN-Agent 库。您可以像在本地开发环境中一样打开终端、创建新文件和运行命令。

这些步骤类似于[快速入门](./getting_started)指南中概述的过程。但是，无需使用 Codespace 运行 `docker compose up` 命令。您可以直接使用以下命令开始构建智能体：

```bash
# 从 .env.example 准备 .env 文件并在其中设置您的 API 密钥
cp ./env.example .env
# 完成密钥配置后构建智能体
task use
```

成功构建后，您可以运行以下命令来启动服务器：

```bash
task run
```

## 步骤 3：启动前端 UI

由于我们没有在 Codespace 中使用 docker compose，因此您需要单独启动前端 UI。您可以通过在终端中运行以下命令来执行此操作：

```bash
cd playground
pnpm install
pnpm dev
```

这将启动 `localhost:3000` 上的前端 UI。

## 步骤 4：访问您的远程设置

这是一个仅适用于 Codespace 的特殊步骤。Codespace 将自动为您在 Codespace 中公开的每个端口生成一个 URL。您可以通过单击 Codespace 窗口左下角的“Ports”选项卡来找到 URL。

![端口](/assets/png/codespace_ports.png?raw=true)

所有端口的可见性默认设置为“private”，您可以通过右键单击并选择“port visibility”将其更改为“public”。将其公开后，您可以在浏览器中访问该 URL 以查看前端 UI。在这里，我们将右键单击 3000 端口的可见性列，并将其可见性更改为“public”。

![更改可见性](/assets/png/codespace_visibility.png?raw=true)

现在，您可以访问 Codespace 生成的 URL 中的前端 UI。找到端口 3000 的“Forwarded Address”列，单击该列，浏览器应为您启动一个新选项卡，其中包含您的前端 UI。

![转发地址](/assets/png/codespace_forwarded_addr.png?raw=true)

OK！您已成功使用 Github Codespace 为 TEN Agent 设置了开发环境。现在，您可以直接在云中开始开发您的智能体。对于调试和开发体验，它基本上与您的本地 VSCode 体验相同。
