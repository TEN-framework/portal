---
title: 理解扩展文件夹
---

`ten_packages/extension` 文件夹包含扩展模块。每个扩展模块都是一个独立的 Python/Golang/C++ 包。

扩展文件夹名称通常与扩展模块名称相同，你也可以在扩展文件夹下的 `manifest.json` 文件中找到扩展模块名称。模块名称应在 `property.json` 文件的 `addon` 属性中使用。

以下是扩展文件夹的示例结构：

![扩展文件夹结构](/assets/png/extension_folder_struct.png?raw=true)

## 扩展通用文件

- manifest.json: 此文件包含扩展的元数据。它包括扩展名称、版本、属性和 API（data、audio_frame、video_frame）。
- property.json: 此文件包含扩展的默认属性。它用于定义扩展的默认配置。

## Python 扩展

- extension.py: 此文件包含扩展的主要逻辑。它通常包含扩展的核心实现。
- requirements.txt: 此文件包含扩展所需的 Python 依赖项。当你运行 `task use` 时，将自动安装此文件中指定的依赖项。

## Golang 扩展

- \_extension.go: 此文件包含扩展的主要逻辑。它通常包含扩展的核心实现。
- go.mod: 此文件包含 Go 模块定义。它指定模块名称和扩展的依赖项。

## C++ 扩展

- src/main.cc: 此文件包含扩展的主要逻辑。它通常包含扩展的核心实现。
- BUILD.gn: 此文件包含扩展的构建配置。它指定扩展的目标名称和依赖项。
