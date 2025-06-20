---
title: 依赖项
---

TEN framework 利用了多个第三方库。有些专门用于测试，而另一些则集成到 TEN 运行平台中。以下是对这些库的描述，以及在 TEN framework 中使用它们所需的任何必要修改。

## Google gn

实例 ID

| 操作系统 | 架构  | 实例 ID                                      |
| -------- | ----- | -------------------------------------------- |
| Linux    | x64   | BzX0zkfwFeUn9MaDVqm6FugmTIy-hFpgNUx43O1fN00C |
| Linux    | arm64 | rT_12w1Iv6ug8CJ4j0VQekA0qTDq6CwoAqGWasIKFcEC |
| Win      | x64   | 1QlqF0FPVt82ba5f48HxHpv5xPqOmyaThoR3TicuJ8QC |

直接从 [Google GN 网页](https://chrome-infra-packages.appspot.com/p/gn/gn/) 下载。

Commit ID

| 操作系统 | 架构      | Commit ID                                |
| -------- | --------- | ---------------------------------------- |
| Mac      | universal | 18602f6cf1168cf78302024043edc02e8bad2ffb |

从[Gn仓库](https://gn.googlesource.com/gn)clone编译。

## Google ninja

版本：1.12.1

直接从 [Ninja 发布页面](https://github.com/ninja-build/ninja/releases) 下载。

## yyjson

版本：0.10.0

[MIT 许可证](https://github.com/ibireme/yyjson/blob/master/LICENSE)

这在 TEN framework 核心中用于解析和生成 JSON 数据。有关详细信息，请参阅 `third_party/yyjson`。

## libuv

版本：1.50.0

[MIT 许可证](https://github.com/libuv/libuv#licensing)

这是 TEN 运行时中使用的一个事件循环库。有关详细信息，请参阅 `third_party/libuv`。

## msgpack-c

版本：6.1.0

[Boost 软件许可证，版本 1.0](https://github.com/msgpack/msgpack-c#license)

用于 C 的 MessagePack 库。有关详细信息，请参阅 `third_party/msgpack`。

## libwebsockets

版本：4.3.2

[MIT 许可证](https://github.com/warmcat/libwebsockets/blob/main/LICENSE)

规范 libwebsockets.org 网络库。有关详细信息，请参阅 `third_party/libwebsockets`。

```diff
--- /home/wei/MyData/Temp/libwebsockets-4.3.2/CMakeLists.txt
+++ libwebsockets/CMakeLists.txt
@@ -851,6 +851,7 @@
  add_definitions(-D_CRT_SECURE_NO_DEPRECATE -D_CRT_NONSTDC_NO_DEPRECATE)
  # Fail the build if any warnings
  add_compile_options(/W3 /WX)
+ add_compile_options(/Zc:preprocessor /wd4819)
  # Unbreak MSVC broken preprocessor __VA_ARGS__ behaviour
  if (MSVC_VERSION GREATER 1925)
   add_compile_options(/Zc:preprocessor /wd5105)
```

应用以下补丁。

```diff
diff --git a/third_party/libwebsockets/cmake/lws_config.h.in b/third_party/libwebsockets/cmake/lws_config.h.in
index f3f4a9d79..e8d36c3ae 100644
--- a/third_party/libwebsockets/cmake/lws_config.h.in
+++ b/third_party/libwebsockets/cmake/lws_config.h.in
@@ -238,3 +238,9 @@
 #cmakedefine LWS_WITH_PLUGINS_API
 #cmakedefine LWS_HAVE_RTA_PREF

+// NOTE (Liu): The libwebsockets library will use external variables from mbedtls
+// if 'LWS_WITH_MBEDTLS' is enabled. On Windows, variable declarations in the header
+// file must start with '__declspec(dllimport)', otherwise, the
+// symbols cannot be accessed.
+// Refer to third_party/mbedtls/include/mbedtls/export.h.
+#define USING_SHARED_MBEDTLS
diff --git a/third_party/libwebsockets/lib/tls/mbedtls/wrapper/platform/ssl_pm.c b/third_party/libwebsockets/lib/tls/mbedtls/wrapper/platform/ssl_pm.c
index e8a0cb2d4..84a164e90 100755
--- a/third_party/libwebsockets/lib/tls/mbedtls/wrapper/platform/ssl_pm.c
+++ b/third_party/libwebsockets/lib/tls/mbedtls/wrapper/platform/ssl_pm.c
@@ -183,7 +183,12 @@ int ssl_pm_new(SSL *ssl)
         mbedtls_ssl_conf_min_version(&ssl_pm->conf, MBEDTLS_SSL_MAJOR_VERSION_3, version);
     } else {
         mbedtls_ssl_conf_max_version(&ssl_pm->conf, MBEDTLS_SSL_MAJOR_VERSION_3, MBEDTLS_SSL_MINOR_VERSION_3);
-    mbedtls_ssl_conf_min_version(&ssl_pm->conf, MBEDTLS_SSL_MAJOR_VERSION_3, 1);
+
+    // NOTE: mbedtls added 'ssl_conf_version_check()' since v3.1.0, and
+    // mbedtls only enables TLS 1.2 by default. So the 'min_tls_version' and
+    // 'max_tls_version' must be '0x303', or 'mbedtls_ssl_setup' will
+    // fail.
+    mbedtls_ssl_conf_min_version(&ssl_pm->conf, MBEDTLS_SSL_MAJOR_VERSION_3, MBEDTLS_SSL_MINOR_VERSION_3);
     }

     mbedtls_ssl_conf_rng(&ssl_pm->conf, mbedtls_ctr_drbg_random, &ssl_pm->ctr_drbg);
```

```diff
diff --git a/third_party/libwebsockets/CMakeLists.txt b/third_party/libwebsockets/CMakeLists.txt
index 92638143a..746f9b6a6 100644
--- a/third_party/libwebsockets/CMakeLists.txt
+++ b/third_party/libwebsockets/CMakeLists.txt
@@ -547,9 +547,12 @@ SET(CMAKE_ARCHIVE_OUTPUT_DIRECTORY "${PROJECT_BINARY_DIR}/lib")

 SET(LWS_INSTALL_PATH "${CMAKE_INSTALL_PREFIX}")

-# Put absolute path of dynamic libraries into the object code. Some
-# architectures, notably Mac OS X, need this.
-SET(CMAKE_INSTALL_NAME_DIR "${CMAKE_INSTALL_PREFIX}/${LWS_INSTALL_LIB_DIR}${LIB_SUFFIX}")
+# Commented out to avoid using absolute paths in the install_name on macOS.
+# When CMAKE_INSTALL_NAME_DIR is set to an absolute path, binaries that link
+# against libwebsockets will hardcode this absolute path, making the library
+# difficult to relocate and potentially causing "library not found" errors at
+# runtime if the library is installed in a different location.
+# SET(CMAKE_INSTALL_NAME_DIR "${CMAKE_INSTALL_PREFIX}/${LWS_INSTALL_LIB_DIR}${LIB_SUFFIX}")
```

### 修复在 Windows 上链接 mbedtls

如果 CMake 版本高于 3.24，请应用以下补丁，因为 `find_package` 自 3.24 起支持 `GLOBAL` 关键字。

```diff
diff --git a/third_party/libwebsockets/lib/tls/mbedtls/CMakeLists.txt b/third_party/libwebsockets/lib/tls/mbedtls/CMakeLists.txt
index e34151724..79b15089d 100644
--- a/third_party/libwebsockets/lib/tls/mbedtls/CMakeLists.txt
+++ b/third_party/libwebsockets/lib/tls/mbedtls/CMakeLists.txt
-        find_library(MBEDTLS_LIBRARY mbedtls)
-        find_library(MBEDX509_LIBRARY mbedx509)
-        find_library(MBEDCRYPTO_LIBRARY mbedcrypto)
+        # find_library(MBEDTLS_LIBRARY mbedtls)
+        # find_library(MBEDX509_LIBRARY mbedx509)
+        # find_library(MBEDCRYPTO_LIBRARY mbedcrypto)
+
+        # set(LWS_MBEDTLS_LIBRARIES "${MBEDTLS_LIBRARY}" "${MBEDX509_LIBRARY}" "${MBEDCRYPTO_LIBRARY}")
+
+        # Set the custom search path.
+        set(MBEDTLS_DIR "${MBEDTLS_BUILD_PATH}/cmake")
+
+        // NOTE (Liu): We should use 'find_package' rather than 'find_library'
+        // to search for the mbedtls libraries. 'find_library' only finds a
+        // library, shared or static, without any settings from the external
+        // library.

-        set(LWS_MBEDTLS_LIBRARIES "${MBEDTLS_LIBRARY}" "${MBEDX509_LIBRARY}" "${MBEDCRYPTO_LIBRARY}")
+        // The 'lib/tls/CMakeLists.txt' depends on the mbedtls libraries, so we set the scope to 'GLOBAL' here.
+        find_package(MbedTLS GLOBAL)
+        set(LWS_MBEDTLS_LIBRARIES MbedTLS::mbedcrypto MbedTLS::mbedx509 MbedTLS::mbedtls)
```

```diff
diff --git a/third_party/libwebsockets/BUILD.gn b/third_party/libwebsockets/BUILD.gn
index 4c89c2e2e..e6d641b9c 100644
--- a/third_party/libwebsockets/BUILD.gn
+++ b/third_party/libwebsockets/BUILD.gn
@@ -84,6 +84,10 @@ cmake_project("websockets") {
   }

   options += [
+  // The libwebsockets will use the 'MBEDTLS_BUILD_PATH' variable to set the
+  // search path of 'find_package'.
+  "MBEDTLS_BUILD_PATH=" + rebase_path("$root_gen_dir/cmake/mbedtls"),
+
```

并删除 `third_party/libwebsockets/cmake/lws_config.h.in` 中的 `#define USING_SHARED_MBEDTLS`。

## curl

版本：8.1.2

[类 MIT 许可证](https://github.com/curl/curl/blob/master/COPYING)

一种使用 URL 语法传输数据的命令行工具和库，支持 DICT、FILE、FTP、FTPS、GOPHER、GOPHERS、HTTP、HTTPS、IMAP、IMAPS、LDAP、LDAPS、MQTT、POP3、POP3S、RTMP、RTMPS、RTSP、SCP、SFTP、SMB、SMBS、SMTP、SMTPS、TELNET 和 TFTP。libcurl 提供了无数强大的功能。

有关详细信息，请参阅 `third_party/curl`。

### curl 的补丁

修补 `lib/CMakeLists.txt`，将共享库名称从 `_imp.lib` 更改为 `.lib`。

```cmake
if(WIN32)
  if(BUILD_SHARED_LIBS)
    if(MSVC)
      // Add "_imp" as a suffix before the extension to avoid conflicting with
      // the statically linked "libcurl.lib"
      //set_target_properties(${LIB_NAME} PROPERTIES IMPORT_SUFFIX "_imp.lib")
      set_target_properties(${LIB_NAME} PROPERTIES IMPORT_SUFFIX ".lib")
    endif()
  endif()
endif()
```

在 `lib/ws.h` 中导出 `Curl_ws_done`，因为需要调用此函数以防止内存泄漏。

```c
CURL_EXTERN void Curl_ws_done(struct Curl_easy *data);
// ^^^^^^^^
```

## clingo

版本：5.8.0

[MIT 许可证](https://github.com/potassco/clingo/blob/master/LICENSE.md)

一种用于逻辑程序的接地器和求解器。

有关详细信息，请参阅 `third_party/clingo`。

ten_manager 实际上使用 clingo-sys crate 来调用 clingo，而 clingo-sys 包含了自己的 clingo 源代码。然而，这个包含的 clingo 源代码是 5.6.2 版本，在 cmake 4 环境中存在编译错误。因此，我们需要使用 cargo 的 patch 功能来使用最新的本地版本 clingo 源代码（已修复了 cmake 4 编译错误）。此外，由于 clingo-sys 已经包含了 clingo 源代码，我们实际上并不需要 third_party/clingo 文件夹。但是，由于 clingo-sys 在 Windows 上仍然将 clingo 编译为共享库，我们目前仍然需要使用 third_party/clingo 文件夹在 Windows 上编译 clingo 的共享库，然后使用 gn 脚本将 Windows 共享库复制到 ten_manager 的最终输出文件夹。未来，我们应该直接使用从 clingo-sys 中包含的 clingo 源代码编译的 Windows 共享库进行复制，这样就可以移除 third_party/clingo 文件夹。

## FFmpeg

版本：6.0

[GPL 或 LGPL 许可证](https://github.com/FFmpeg/FFmpeg/blob/master/LICENSE.md)

FFmpeg 代码库主要采用 LGPL 许可，可选组件采用 GPL 许可。有关详细信息，请参阅 LICENSE 文件。

用于 ffmpeg 扩展，主要用于测试目的。有关详细信息，请参阅 `third_party/ffmpeg`。

## libbacktrace

版本：1.0

[BSD 许可证](https://github.com/ianlancetaylor/libbacktrace/blob/master/LICENSE)

一个可以链接到 C/C++ 程序中以生成符号回溯的 C 库。

> ⚠️ **注意：**
> 我们已经对 `libbacktrace` 进行了重大修改，以符合 TEN framework 的命名约定和文件夹结构。有关详细信息，请参阅 `core/src/ten_utils/backtrace`。

## uthash

版本：2.3.0

[BSD 许可证](https://github.com/troydhanson/uthash/blob/master/LICENSE)

用于哈希表等的 C 宏。

> ⚠️ **注意：**
> 我们已经对 `uthash` 进行了重大修改，以符合 TEN framework 的命名约定和文件夹结构。有关详细信息，请参阅文件头中提到 `uthash` 的 `core/include/ten_utils/container` 下的文件。

## uuid4

[MIT 许可证](https://github.com/gpakosz/uuid4/blob/master/LICENSE.MIT)
[WTFPLv2 许可证](https://github.com/gpakosz/uuid4/blob/master/LICENSE.WTFPLv2)

C 中的 UUID v4 生成。

> ⚠️ **注意：**
> 我们已经对 `uuid4` 进行了重大修改，以符合 TEN framework 的命名约定和文件夹结构。有关详细信息，请参阅 `core/src/ten_utils/lib/sys/general/uuid.c`。

## zf_log

[MIT 许可证](https://github.com/wonder-mice/zf_log/blob/master/LICENSE)

用于 C/ObjC/C++ 的核心日志库。

> ⚠️ **注意：**
> 我们已经对 `zf_log` 进行了重大修改，以符合 TEN framework 的命名约定和文件夹结构。有关详细信息，请参阅 `core/src/ten_utils/log`。
