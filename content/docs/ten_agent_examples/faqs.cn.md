---
title: 常见问题
---

## 为什么我看到 `/app/agnets/bin/start: not found`？

Windows 用户偶尔会遇到行尾问题，这可能会导致诸如 `/app/agnets/bin/start: not found` 之类的错误。

为了获得最佳体验，我们建议将 Git 配置为在 Windows 上自动将行尾转换为 LF。

要解决此问题：

1. 配置 Git 以在 Windows 上自动将行尾转换为 LF：

   ```bash title="终端"
   git config --global core.autocrlf false
   ```

2. 重新克隆存储库

或者，您可以直接从 GitHub 下载并解压缩 ZIP 文件。

## 如何验证我的互联网连接？

请确保您的 **HTTPS** 和 **SSH** 都已连接到互联网。

测试 **HTTPS** 连接：

```bash title="终端"
ping www.google.com

# 您应该看到以下输出：
PING google.com (198.18.1.94): 56 data bytes
64 bytes from 198.18.1.94: icmp_seq=0 ttl=64 time=0.099 ms
64 bytes from 198.18.1.94: icmp_seq=1 ttl=64 time=0.121 ms
```

测试 **SSH** 连接：

```bash title="终端"
curl www.google.com

# 您应该看到以下输出：
<html>
<head><title>301 Moved Permanently</title></head>
<body>
<h1>301 Moved Permanently</h1>
</body>
</html>
```

## 如何刷新 env 文件？

要在开发过程中查看更新的更改，请按照以下步骤操作：

1. 停止服务器
2. 保存对 `.env` 文件的更改
3. 运行 `source .env` 以刷新环境变量

## Windows 上的行尾问题

Windows 用户偶尔会遇到行尾问题，这可能会导致诸如“agent/bin/start is not a valid directory”之类的错误。

要解决此问题：

1. 配置 Git 以在 Windows 上自动将行尾转换为 LF：

   ```bash title="终端"
   git config --global core.autocrlf false
   ```

2. 重新克隆存储库

或者，您可以直接从 GitHub 下载并解压缩 ZIP 文件。
