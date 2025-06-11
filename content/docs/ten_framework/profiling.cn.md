---
title: 性能分析
---

## TEN 框架 GO 项目

使用 `gperftools` 来分析您的程序的 CPU 使用率和堆内存使用率。以下步骤介绍了如何准备环境、使用 `gperftools` 来分析您的程序，以及分析性能数据。

### 安装 `gperftools`

要在 Ubuntu 上安装 `gperftools`，请运行以下命令：

```shell
apt update && apt install -y google-perftools

ln -s /usr/lib/x86_64-linux-gnu/libtcmalloc.so.4 /usr/lib/libtcmalloc.so

ln -s /usr/lib/x86_64-linux-gnu/libprofiler.so.0 /usr/lib/libprofiler.so
```

### 使用 `gperftools` 分析 CPU 使用率

要分析您的程序的 CPU 使用率，请运行以下命令：

```shell
export LD_PRELOAD=/usr/lib/libtcmalloc.so
export CPUPROFILE=/.../cpu

exec /.../program
```

程序退出时，将生成一个 CPU 性能数据文件。数据将存储在 `/.../cpu.0001.prof` 文件中。

如果您想定期生成 CPU 性能数据，可以设置 `CPUPROFILE_FREQUENCY` 环境变量。例如，要每 30 秒生成一次 CPU 性能数据，请运行以下命令：

```shell
LD_PRELOAD=/usr/lib/libtcmalloc.so CPUPROFILE=/.../cpu CPUPROFILE_FREQUENCY=30 exec /.../program
```

#### 分析 CPU 性能数据

要分析 CPU 性能数据，请运行以下命令：

```shell
google-pprof --text /.../program /.../cpu.0001.prof > /.../cpu.0001.prof.txt

google-pprof --text --base=/.../cpu.0001.prof /.../program /.../cpu.0002.prof > /.../diff.txt
```

### 使用 `gperftools` 分析堆内存使用率

要分析您的程序的堆内存使用率，请运行以下命令：

```shell
export LD_PRELOAD=/usr/lib/libtcmalloc.so
export HEAPPROFILE=/.../heap
export HEAP_PROFILE_TIME_INTERVAL=30

exec /.../program
```

建议使用 `HEAP_PROFILE_TIME_INTERVAL` 环境变量来定期生成堆内存性能数据。所有堆内存性能数据将存储在 `HEAPPROFILE` 目录中。

#### 分析堆内存性能数据

每个生成的堆内存性能数据文件都将具有 `.heap` 扩展名。要分析堆内存性能数据，您可以将 `.heap` 文件转换为人类可读的文本格式。例如，要将 `/.../heap` 中的 `.heap` 文件转换为文本格式，请运行以下命令：

```shell
google-pprof --text /.../program /.../heap.0001.heap > /.../heap.0001.heap.txt
```

性能数据将如下所示：

```text
Total: 19.7 MB
16.0  81.3%  81.3%     16.0  81.3% lws_zalloc
2.9  14.6%  95.9%      3.3   16.7% setAgoraStreamChannelParameters
...
```

您还可以将 `.heap` 文件转换为其他格式，例如 PDF 或 SVG。例如，要将 `/.../heap` 中的 `.heap` 文件转换为 PDF 格式，请运行以下命令：

```shell
google-pprof --pdf /.../program /.../heap.0001.heap > /.../heap.0001.heap.pdf
```

PDF 格式的性能数据将与文本输出类似，但以图形方式可视化。

此外，您可以比较两组堆内存性能数据。例如，要比较 `/.../heap.0001.heap` 和 `/.../heap.0002.heap` 中的堆内存性能数据，请运行以下命令：

```shell
google-pprof --pdf --base=/.../heap.0001.heap /.../program /.../heap.0002.heap > /.../diff.pdf
```

PDF 将显示两组数据之间堆内存使用率的差异。

如果您定期生成堆内存性能数据，我们提供了一个脚本来分析目录中的所有堆内存性能数据，并生成一个 Excel 文件，显示堆内存使用率趋势。例如，要分析 `/.../heap` 中的所有堆内存性能数据，请运行以下命令：

```shell
python3 tools/profiler/gperftools/dump_heap_info_to_excel.py -heap_dir=/.../heap -bin=/.../program -output=/.../heap.xlsx -sample_interval=30
```

该脚本将在 `/.../raw` 目录中生成带有符号的原始性能数据，在 `/.../text` 目录中生成人类可读的文本性能数据，并在 `/.../heap.xlsx` 中生成 Excel 文件。

您可以绘制折线图以显示堆内存使用率趋势。

```shell
python3 tools/profiler/gperftools/draw_line_chart.py -excel_file=/.../heap.xlsx -output_file=/.../heap_line_chart.png -title=HEAP_MEM -x=time/s -y=total_heap_size/MB
```

### 使用 `pprof` 进行分析

我们建议使用 `pprof` 来分析用 Go 编写的程序。分析 Go 程序的最简单方法是将 `pprof_app_go` 用作您的 TEN 应用程序。激活后，应用程序会读取环境变量，以确定是否激活 `pprof` 服务器和堆分析器。

```shell
export TEN_HEAP_DUMP_DIR=/data/prof
export HEAP_PROFILE_TIME_INTERVAL=30
export TEN_PROFILER_SERVER_PORT=6060
```

### 分析 `pprof` 性能数据

要将堆性能数据转换为文本格式，请使用以下命令：

```shell
python3 tools/profiler/pprof/dump_heap_files_to_text.py -heap_dir=/data/prof -text_dir=/data/text
```

要分析所有堆性能数据并生成 Excel 文件，请运行：

```shell
python3 tools/profiler/pprof/dump_heap_info_to_excel.py -heap_dir=/data/prof -output=/data/heap.xlsx
```

您可以绘制折线图以显示堆内存使用率趋势：

```shell
python3 tools/profiler/gperftools/draw_line_chart.py -excel_file=/data/heap.xlsx -output_file=/data/heap_line_chart.png -title=HEAP_MEM -x=time/s -y=total_heap_size/MB
```

这将为您提供 Go 堆性能数据趋势的可视化表示。
