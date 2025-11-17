---
title: 插件系统
---

TEN framework 是一个软件模块系统，其中每个软件模块都由 **插件 (addon)** 的概念定义。本质上，TEN framework 中的每个软件模块都是一个插件。例如，用户可以定义以下类型的 TEN framework 插件：

1. TEN **扩展 (extension)** 插件
2. TEN **扩展组 (extension group)** 插件
3. TEN **协议 (protocol)** 插件

## 加载插件所需的信息

要将插件加载到 TEN runtime，需要三个信息：

1. **插件名称**

    插件名称在整个 TEN 应用中必须全局唯一。将多个同名插件加载到 TEN runtime 是未定义行为，可能会导致第二个插件实例无法正确加载。

2. **插件文件夹位置**

    在 TEN framework 中，加载插件时，用户必须告知 TEN runtime 插件目录的所在位置。此目录将作为插件的 `base_dir`。TEN runtime 将使用此基本目录加载与插件相关的其他文件，例如插件的 `manifest.json` 和 `property.json` 文件。

    基本上，在设计 TEN framework 的插件注册 API 时，其目标是自动检测插件所在的目录，因此用户无需显式指定 `base_dir`。但是，在某些 TEN framework 无法自动检测 `base_dir` 的特殊情况下，用户将需要为 TEN runtime 显式指定插件所在的文件夹。

3. **插件实例本身**

## 将插件注册到 TEN runtime

有两种方法可以将插件注册到 TEN runtime ：

1. 显式调用 API 以将插件的 `base_dir` 注册到 TEN runtime。

    **注意：** 目前，只有独立测试框架提供此类 API。

2. 将插件放置在 TEN 应用文件夹树中的指定位置。

通过将插件放置在指定位置，TEN 应用将在启动时自动加载这些插件。目前，此指定位置位于 TEN 应用的 `ten_packages/` 目录下。如果插件以此格式放置，它们将在 TEN 应用启动时自动加载。

```text
.
└── ten_packages/
    ├── extension/
    │   ├── <extension_foo>/
    │   └── <extension_bar>/
    ├── extension_group/
    │   └── <extension_group_x>/
    └── protocol/
        └── <protocol_a>/
```
