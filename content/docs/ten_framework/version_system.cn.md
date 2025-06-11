---
title: 版本系统
---

TEN 框架遵循 semver 规范。

## TEN 包的版本信息

TEN 包的版本信息记录在其自身的 `manifest.json` 文件的 `version` 字段中。对于每个 TEN 包，此 `version` 字段都是强制性的。

```json
{
  "version": "1.0.0"
}
```

## 依赖项的版本要求

> ⚠️ **注意：**
> 如果未指定依赖项的版本要求，则默认使用最新版本。

```text
└── ten_packages/
    ├── extension/
    ├── extension_group/
    ├── protocol/
    └── system/
```

这些包通过其 `manifest.json` 文件中 `type` 字段的值来区分。

```json
{
  "type": "system" // "extension", "extension_group", "protocol"
}
```

在 TEN 包中，依赖的 TEN 包的版本要求指定如下。

```json
{
  "dependencies": [
    {
      "type": "system",
      "name": "ten_runtime",
      "version": "1.0.1"
    },
    {
      "type": "system",
      "name": "ten_runtime_go",
      "version": "1.0.3"
    },
    {
      "type": "extension",
      "name": "default_http_extension_cpp",
      "version": "1.0.0"
    },
    {
      "type": "extension_group",
      "name": "default_extension_group",
      "version": "1.0.0"
    }
  ]
}
```

## 版本要求规范

版本要求字符串可以包含多个版本要求字符串，以逗号分隔。每个版本要求字符串支持以下运算符：

- `>`、`>=`、`=`

  手动指定版本范围或确切的依赖项版本。

- `~`

  用于指定具有一定更新灵活性的最低版本。如果指定了 major、minor 和 patch 版本，或者仅指定了 major 和 minor 版本，则仅允许 patch 级别的更改。如果仅指定了 major 版本，则允许 minor 和 patch 级别的更改。

- `^`

  可以省略 `^` 运算符，这意味着如果版本要求字符串不包含任何运算符，则默认为 `^`。例如，字符串 `0.1.12` 表示 `^0.1.12`。虽然 `0.1.12` 看起来像一个特定版本，但它实际上指定了一个允许与 SemVer 兼容的更新的版本要求。

  只要不修改 major、minor 或 patch 组合中最左边的非零数字，就允许更新。在这种情况下，如果您升级 TEN 包，它将更新到 `0.1.13` 版本（如果是最新的 `0.1.z` 版本），但不会更新到 `0.2.0`。如果指定的版本字符串为 `1.0`，它将更新到 `1.1`（如果是最新的 `1.y` 版本），但不会更新到 `2.0`。

  > ⚠️ **注意：**
  > 版本 `0.0.x` 被认为与任何其他版本都不兼容。
