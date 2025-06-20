---
title: 概述
---

一个基本的 TEN framework 软件包的目录结构如下所示。

```text
.
├── bin/
├── src/
├── manifest.json
├── manifest-lock.json
├── property.json
└── ten_packages/
    ├── extension/
    │   ├── <extension_foo>/
    │   └── <extension_bar>/
    ├── extension_group/
    │   └── <extension_group_x>/
    ├── protocol/
    │   └── <protocol_a>/
    └── system/
        ├── <system_package_1>/
        └── <system_package_2>/
```

根据编程语言的不同，可能还会存在其他必需的文件。例如，在 C++ 项目中，由于构建系统是 `ten_gn`，因此会存在一个 `BUILD.gn` 文件。在 Go 项目中，会存在诸如 `go.mod` 和 `go.sum` 之类的文件。在 Python 项目中，你可能会找到 `requirements.txt` 文件。

## TEN framework 软件包类型

| 类型                     | 描述                      |
| ------------------------ | ------------------------- |
| 应用 (App)               | 包含一个 TEN 应用。       |
| 扩展组 (Extension group) | 包含一个 TEN 扩展组。     |
| 扩展 (Extension)         | 包含一个 TEN 扩展。       |
| 协议 (Protocol)          | 包含一个 TEN 协议。       |
| 系统 (System)            | 包含一个 TEN 系统软件包。 |

## TEN framework 软件包种类

有两种类型的软件包：

- 发布包 (Release package)
- 开发包 (Development package)

这两种软件包之间的关系如下：

- 发布包可以通过构建过程从开发包生成。
- 如果我们将与源代码相关的内容添加到发布包中，它就会变成一个开发包。
- 如果我们从开发包中删除与源代码相关的内容，它就会变成一个发布包。

简而言之，开发包和发布包的目录结构非常相似，区别在于开发包包含与源代码相关的内容，而发布包则不包含。

### 开发包

开发包的主要目的是开发 TEN 软件包。例如，如果您想创建一个新的 TEN 扩展，您可以修改现有的开发包来实现此目的。这是因为开发包包含所有与源代码相关的内容，可以从中创建新的 TEN 软件包。

### 发布包

发布包的主要目的是创建和运行图。由于不需要构建任务，因此可以使用发布包来执行这些操作。但是，开发包也可以用于这些任务。本质上，开发包的应用范围比发布包更广泛。
