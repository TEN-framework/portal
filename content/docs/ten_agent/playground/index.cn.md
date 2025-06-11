---
title: 运行 Playground
---

本指南将帮助您运行 TEN-Agent Playground。Playground 是一个基于 Web 的界面，允许您与 TEN-Agent 进行交互。您可以在受控环境中替换模块、更改配置并测试智能体的行为。

## 从预构建的 Docker 镜像运行 Playground

运行 Playground 的最简单方法是使用预构建的 Docker 镜像。该镜像包含 TEN-Agent 和 Playground 的最新版本。项目 docker compose 文件已包含预构建的镜像，因此您可以按照[入门指南](./getting_started)中的步骤开始。

完成后，您可以通过打开浏览器并导航到 `http://localhost:3000` 来访问 Playground。

## 从源代码运行 Playground

如果您想从源代码运行 Playground，请启动一个新终端，切换到克隆 TEN-Agent 项目的文件夹，然后按照以下步骤操作：

```bash
# 切换到 Playground 目录
cd playground

# 安装依赖项
pnpm install

# 启动 Playground
pnpm dev
```

Playground 启动后，您可以通过打开浏览器并导航到 `http://localhost:3001` 来访问它。

> **注意：** Playground 依赖于 golang Web 服务器（位于 `server` 目录中）和 ten-dev-server（由 ten framework cli 提供）。默认情况下，当您使用 `docker compose up -d` 命令启动时，会提供 ten-dev-server。在您按照[入门指南](./getting_started)中的步骤操作后，在容器中运行 `task run` 命令时，Web 服务器将启动。
