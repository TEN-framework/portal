---
title: FAQs
---

## Why do I see `/app/agent/bin/start: not found`?

Windows users occasionally encounter line-ending issues, which may result in errors like `/app/agent/bin/start: not found`.

For best practices, we recommend configuring Git to automatically convert line endings to LF on Windows.

To fix this:

1. Configure Git to automatically convert line endings to LF on Windows:

```bash title="Terminal"
git config --global core.autocrlf false
```

2. Re-clone the repository

Alternatively, you can download and extract the ZIP file directly from GitHub.

## How to verify my internet connection?

Please make sure that both of you your **HTTPS** and **SSH** are connected to the internet.

Test **HTTPS** connection:

```bash title="Terminal"
ping www.google.com

# You should see the following output:
PING google.com (198.18.1.94): 56 data bytes
64 bytes from 198.18.1.94: icmp_seq=0 ttl=64 time=0.099 ms
64 bytes from 198.18.1.94: icmp_seq=1 ttl=64 time=0.121 ms
```

Test **SSH** connection:

```bash title="Terminal"
curl www.google.com

# You should see the following output:
<html>
<head><title>301 Moved Permanently</title></head>
<body>
<h1>301 Moved Permanently</h1>
</body>
</html>
```

## How to refresh env file?

To see updated changes during development, follow these steps:

1. Stop the server
2. Save changes to the `.env` file
3. Run `source .env` to refresh the environment variables

## Line-ending Issues on Windows

Windows users occasionally encounter line-ending issues, which may result in errors like "agent/bin/start is not a valid directory".

To fix this:

1. Configure Git to automatically convert line endings to LF on Windows:

```bash title="Terminal"
git config --global core.autocrlf false
```

2. Re-clone the repository

Alternatively, you can download and extract the ZIP file directly from GitHub.
