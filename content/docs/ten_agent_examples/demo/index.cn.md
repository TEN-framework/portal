---
title: 运行演示
---

本指南将帮助您运行 TEN-Agent 演示。该演示是一个基于 Web 的界面，允许您与 TEN-Agent 进行交互。演示站点的编排是固定的，无法更改。

## 从预构建的 Docker 镜像运行演示

运行演示的最简单方法是使用预构建的 Docker 镜像。该镜像包含 TEN-Agent 和演示的最新版本。项目 docker compose 文件已包含预构建的镜像，因此您可以按照[入门指南](./getting_started)中的步骤开始。

成功设置后，您需要运行一个额外的命令将图表文件夹切换到演示文件夹，

```bash
task use AGENT=agents/examples/demo
```

完成后，您可以通过打开浏览器并导航到 `http://localhost:3002` 来访问演示界面。

## 从源代码运行演示

如果您想从源代码运行演示，请启动一个新终端，更改到克隆 TEN-Agent 项目的文件夹，然后按照以下步骤操作：

```bash
# 切换到演示目录
cd demo

# 安装依赖项
pnpm install

# 启动演示
pnpm dev
```

演示启动后，您可以通过打开浏览器并导航到 `http://localhost:3001` 来访问它。

> **注意：** 该演示依赖于 golang Web 服务器（位于 `server` 目录中）。在您按照[入门指南](./getting_started)中的步骤操作后，在容器中运行 `task run` 命令时，Web 服务器将启动。
