---
title: 构建系统
---

## 构建系统

### C++

TEN 框架使用 `ten_gn` 构建系统来编译 C++ 应用程序和 C++ 扩展。 `ten_gn` 是一个基于 Google GN 的构建系统。

### Golang

TEN 框架使用标准的 go 命令来构建 TEN 框架 Golang 项目。

## 构建

### C++ 应用程序

要构建 TEN 框架 C++ 应用程序，请在 TEN 框架 C++ 应用程序的根目录中运行以下命令。

`<os>` 可以是以下之一：

- linux
- mac
- win

`<arch>` 可以是以下之一：

- x86
- x64
- arm
- arm64

`<build_type>` 可以是以下之一：

- debug
- release

```shell
ten_gn gen <os> <arch> <build_type>
ten_gn build <os> <arch> <build_type>
```

### C++ 插件

此处的术语 `addon` 包括以下内容：

- 扩展
- 扩展组
- 协议

构建 TEN 框架 C++ 插件的方法与构建 TEN 框架 C++ 应用程序的方法相同。

### Golang 应用程序

要构建 TEN Golang 项目，请在 TEN Golang 项目的根目录中运行以下命令：

```shell
go run ten_packages/system/ten_runtime_go/tools/build/main.go
```
