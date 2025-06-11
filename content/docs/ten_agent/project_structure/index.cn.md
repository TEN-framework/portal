---
title: 项目结构
---

TEN Agent 项目构建于 TEN 框架之上。有关 TEN 框架项目基本概念，请参考 [TEN 框架项目概览](../ten_framework/concept_overview)。

以下是 TEN Agent 项目的文件夹结构：

![项目结构](https://ten-framework-assets.s3.amazonaws.com/doc-assets/folder_structure.png)

它包含以下重要的文件夹和文件：

- `property.json`: 此文件包含扩展的编排配置。它是主要的运行时配置文件。
- `ten_packages/extension`: 此文件夹包含扩展模块。每个扩展模块都是一个独立的 Python/Golang/C++ 包。
- `server`: 此文件夹包含 Web 服务器代码。它负责处理传入的请求以及 agent 进程的启动/停止。
- `playground`: 此文件夹包含 playground 的 UI 代码。它是一个基于 Web 的界面，用于与 agent 交互。
