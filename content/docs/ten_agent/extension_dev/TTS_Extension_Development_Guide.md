---
title: 创建 TTS 扩展
description: 从零开始创建、开发、测试并发布一个完整的 TTS 扩展
---

# 创建 TTS Extension完整指南

本教程将指导你从零开始创建一个生产级别的 TTS（Text-to-Speech） Extension，涵盖从项目创建、核心开发、测试验证到发布上线的完整流程。

## 什么是 TTS Extension

TTS Extension 是 TEN Framework 生态系统中的一个**标准扩展积木**（Standard Extension），专门用于实现文本转语音（Text-to-Speech）功能。

### 核心功能

TTS Extension 的主要职责包括：

1. **接收文字**: 从上游扩展持续接收需要转换成语音的文字（通常来自于大模型）
2. **实时合成**: 将文字实时转换成对应的音频数据流
3. **发送音频**: 将合成的音频数据传递给下游扩展进行后续处理

### 在对话流中的位置

作为标准积木，TTS Extension 在 TEN Agent 对话流中扮演着**文本到音频转换**的关键角色：

```
[上游积木]  ──文字流──>  [TTS Extension]  ──音频流──>  [下游积木]
```

**典型的上游积木**：
- **LLM Extension**: 生成对话回复文字
- **Translation Extension**: 翻译后的文字结果
- **Text Processing Extension**: 经过预处理的文字内容

**典型的下游积木**：
- **RTC Extension**: 将音频推送到 RTC 频道
- **Audio Playback Extension**: 本地播放音频
- **Audio Processing Extension**: 对音频进行后处理（如混音、音效等）

### 实际应用场景

**场景1: AI 语音对话助手**
```
RTC Extension → ASR Extension → LLM Extension → TTS Extension → RTC Extension
```
从 RTC 频道采集用户的语音，ASR 将语音转写成文字，LLM 理解语义并生成回复，TTS 将回复转换成语音后推送到 RTC 频道。

**场景2: 实时语音翻译**
```
RTC Extension → ASR Extension → Translation Extension → TTS Extension → RTC Extension
```
采集用户的中文语音，ASR 识别成中文文字，Translation 积木转换成目标语言（如英文），TTS 将译文转换成语音输出。

**场景3: 多语言内容播报**
```
Content Extension → TTS Extension → Audio Broadcast Extension
```
从内容源获取文字信息，TTS 转换成多语言音频，Audio Broadcast 进行广播播放。

### 标准化 TTS Extension 的意义

将 TTS 功能封装成标准扩展积木，带来以下核心价值：

- **🔌 即插即用**: 轻松切换不同的 TTS 服务商（ElevenLabs、Azure、Google 等），无需修改上下游积木
- **🔄 灵活组合**: 与其他标准积木自由组合，快速构建各类 AI 应用场景
- **🛠️ 易于维护**: 独立开发、测试、升级，不影响其他积木的稳定性
- **📦 高度复用**: 一次开发，多个项目复用，显著提升开发效率
- **🌐 生态共享**: 发布到 TEN Store，让全球开发者受益

## 📋 你将学到什么

- 🚀 使用 TTS 模板快速创建扩展项目
- ⚙️ 理解 TTS Extension 接口规范  
- 🔧 实现 TTS Extension 核心功能
- 🧪 编写全面的单元测试和集成测试
- 📊 掌握日志记录、错误处理等最佳实践
- 🌐 发布扩展到 TEN Store 供社区使用

## 📚 前置条件

开始本教程前，请确保你已具备：

- **基础知识**: 熟悉 [TEN Agent 架构](/docs/ten_agent/getting_started) 和 TTS 服务基本概念
- **技术能力**: 掌握 Python 异步编程（`asyncio`、`async/await`）
- **开发环境**: 在开发容器内开发（安装好tman）
- **API 资源**: 准备好 TTS 服务商的 API 密钥（用于测试验证）

<Callout type="info">
  **示例说明**: 本教程以 ElevenLabs TTS 为例进行讲解，但所介绍的方法和模式同样适用于其他 TTS 服务商或者本地TTS模型。
</Callout>

### 架构介绍

TTS Extension基于 `AsyncTTS2BaseExtension` 基类构建，该基类提供了：

- **异步消息队列处理**：将来自上游的请求放入TTS请求队列。收到flush之后的请求队列控制。
- **音频数据管理**：统一的音频帧格式和发送机制
- **指标上报**：TTFB（Time To First Byte）、音频时长等指标
- **错误处理**：标准化的错误报告机制
- **生命周期管理**：初始化、启动、停止、销毁的完整生命周期

### 三种实现模式对比

根据TTS供应商的API特性，推荐以下三种实现模式：

| 模式 | 特点 | 适用场景 | 示例供应商 |
|------|------|----------|------------|
| **WebSocket** | 通过WebSocket发送请求，接收流式音频响应 | 支持流式响应的TTS服务 | Elevelabs |
| **HTTP流式** | 使用HTTP流式请求，适合简单的TTS服务 | 传统REST API的TTS服务 | Rime |
| **SDK集成** | 使用官方SDK，提供更丰富的功能 | 大厂提供的完整SDK | Google, Azure |

### 实现模式选择指南

**选择WebSocket模式：**
- 供应商支持WebSocket模式
- 需要极低延迟的TTS响应
- 支持流式文本输入和音频输出

**选择HTTP模式：**
- 供应商只提供REST API
- 不需要保持长连接
- 实现简单，维护成本低

**选择SDK模式：**
- 供应商提供官方SDK
- 需要利用SDK的高级功能
- 追求稳定性和功能完整性

#### 输入输出数据格式

TTS 标准接口（`tts-interface.json`）中除了属性配置外，还定义了输入和输出的数据格式规范：

**输入数据**：
- **文本输入** (`tts_text_input`): 从上游接收的文本数据流
- **刷新请求** (`tts_flush`): 取消当前请求并清空队列

**输出数据**：
- **文本结果** (`tts_text_result`): 包含时间戳的文本结果（当`enable_words=true`时）
- **音频开始** (`tts_audio_start`): 音频开始事件
- **音频结束** (`tts_audio_end`): 音频结束事件，包含时长统计
- **刷新完成** (`tts_flush_end`): 刷新处理完成的通知
- **错误信息** (`error`): 发生错误时的错误详情
- **性能指标** (`metrics`): TTFB、音频时长等性能数据
- **PCM音频帧** (`pcm_frame`): 向下游发送的音频数据流

详细的数据结构定义和字段说明请参考 `tts-interface.json` 文件。

### Extension属性配置

Extension支持以下通用配置属性：

- **`dump`** (bool): 是否启用PCM音频文件导出功能
  - 当设置为`true`时，Extension会将生成的PCM音频数据保存到文件
  - 用于调试和音频质量检查
  
- **`dump_path`** (string): PCM音频文件保存路径
  - 指定导出文件的存储目录
  - 默认值为`/tmp`
  
- **`enable_words`** (bool): 是否启用字幕对齐功能
  - 当设置为`true`时，Extension需要输出字幕带时间戳

### 上游输入接口（data_in）

#### 1. tts_text_input - TTS文本输入

**用途**：接收来自上游Extension（通常是LLM Extension）的文本输入，用于生成语音。

**必需字段**：
- `request_id` (string): 请求唯一标识符，用于追踪和关联请求
- `text` (string): 需要转换为语音的文本内容

**可选字段**：
- `text_input_end` (bool): 标识当前文本输入是否结束
  - `true`: 表示当前轮次文本输入已完成。
  - `false`或不设置: 表示还有后续文本输入
- `metadata` (object): 元数据信息
  - `session_id` (string): 会话ID，用于关联同一会话的多个请求
  - `turn_id` (int64): 轮次ID，用于标识对话轮次
  - 其他需要TTS Extension 透传给下游积木的内容

**处理说明**：
- Extension需要将接收到的文本放入请求队列
- 支持流式文本输入，可以接收多个`tts_text_input`消息
- 当`text_input_end=true`时，开始处理完整的文本输入进行TTS合成

#### 2. tts_flush - 刷新请求

**用途**：取消当前正在处理的TTS请求，清空请求队列。

**字段**：
- `flush_id` (string): 刷新请求的唯一标识符
- `metadata` (object): 元数据信息
  - `session_id` (string): 会话ID
  - 其他需要TTS Extension 在处理完flush之后透传给下游的内容

**处理说明**：
- 收到flush请求时，Extension必须：
  1. 清空输入队列中的所有待处理请求
  2. 取消当前正在进行的TTS合成请求
  3. 调用客户端的`cancel()`方法中断TTS服务调用
  4. 发送`tts_flush_end`响应，通知下游Extension刷新完成

### 下游输出接口（data_out）

#### 1. tts_text_result - TTS文本结果（字幕对齐用）

**用途**：当`enable_words=true`时，输出包含时间戳的文本结果。

**必需字段**：
- `request_id` (string): 请求ID，与输入的`tts_text_input.request_id`对应
- `text` (string): 合成音频对应的文本内容
- `start_ms` (int64): 文本开始时间戳（毫秒）
- `duration_ms` (int64): 文本持续时长（毫秒）
- `words` (array): 含时间戳的文本数组
  - `word` (string): 词语内容
  - `start_ms` (int64): 词语开始时间戳（毫秒）
  - `duration_ms` (int64): 词语持续时长（毫秒）

**可选字段**：
- `text_result_end` (bool): 标识文本结果是否结束
- `metadata` (object): 元数据信息
  - `session_id` (string): 会话ID
  - `turn_id` (int64): 轮次ID
  - 其他上游传入需要透传的内容

**发送说明**：
- 仅在`enable_words=true`时需要发送此消息
- 如果供应商TTS服务支持词级别时间戳，需要在收到供应商响应时提取并发送
- 如果不支持词级别时间戳，可以不发送此消息

#### 2. tts_flush_end - 刷新结束

**用途**：响应`tts_flush`请求，通知下游Extension刷新操作已完成。

**字段**：
- `flush_id` (string): 与输入的`tts_flush.flush_id`对应
- `metadata` (object): 元数据信息, tts_flush 带入的内容透传出去

**发送说明**：
- 在完成flush操作后必须发送，确保下游Extension知道刷新已完成

#### 3. tts_audio_start - 音频开始事件

**用途**：通知下游Extension音频数据开始发送。

**字段**：
- `request_id` (string): 请求ID，与输入的`tts_text_input.request_id`对应
- `metadata` (object): 元数据信息，来自于tts_text_input（每个reqeust id共用一个）
  - `session_id` (string): 会话ID
  - `turn_id` (int64): 轮次ID
  - 其他透传数据

**发送说明**：
- 在开始发送第一个音频数据块之前发送
- 用于下游Extension进行音频播放准备

#### 4. tts_audio_end - 音频结束事件

**用途**：通知下游Extension音频数据发送完成。

**必需字段**：
- `request_id` (string): 请求ID，与输入的`tts_text_input.request_id`对应
- `request_event_interval_ms` (int64): 请求事件间隔时长（毫秒）
  - 从接收第一个`tts_text_input`到发送第一个音频数据块的时间间隔
- `request_total_audio_duration_ms` (int64): 请求总音频时长（毫秒）
  - 整个请求生成的音频总时长
- `reason` (int64): 结束原因
  - `1`: 正常结束（REQUEST_END）
  - `2`: 中断（INTERRUPTED）
  - 其他值根据实际需求定义

**可选字段**：
- `metadata` (object): 元数据信息，来自于tts_text_input（每个reqeust id共用一个）
  - `session_id` (string): 会话ID
  - `turn_id` (int64): 轮次ID

**发送说明**：
- 在所有音频数据块发送完成后发送
- 必须准确计算`request_event_interval_ms`和`request_total_audio_duration_ms`
- 如果请求被中断（收到flush），`reason`应设置为中断状态

#### 5. error - 错误信息

**用途**：向上游或下游Extension报告错误信息。

**必需字段**：
- `module` (string): 模块名称，通常为`"tts"`
- `code` (int64): 错误代码
  - `-1000`: 致命错误（FATAL_ERROR）
  - `1000`: 非致命错误（NON_FATAL_ERROR）
- `message` (string): 错误描述信息

**可选字段**：
- `id` (string): 错误唯一标识符
- `vendor_info` (object): 供应商特定的错误信息
  - `vendor` (string): 供应商名称
  - `code` (string): 供应商错误代码
  - `message` (string): 供应商错误消息
- `metadata` (object): 元数据信息，来自于tts_text_input（每个reqeust id共用一个）
  - `session_id` (string): 会话ID
  - `turn_id` (int64): 轮次ID
  - 其他需要透传的参数

**发送说明**：
- 当TTS合成过程中出现错误时必须发送
- `NON_FATAL_ERROR` 是指无法恢复的错误，通常是基本参数问题。
- 'FATAL_ERROR' 是指可以恢复的错误，通常表示当前请求有问题，但不影响后续请求

#### 6. metrics - 指标数据

**用途**：上报TTS Extension的性能和使用量指标。

**必需字段**：
- `module` (string): 模块名称，通常为`"tts"`
- `vendor` (string): 供应商名称
- `metrics` (object): 指标数据对象
  - 可以包含TTFB、音频时长、字符数、请求数等指标

**可选字段**：
- `id` (string): 指标唯一标识符
- `metadata` (object): 元数据信息，来自于tts_text_input（每个reqeust id共用一个）
  - `session_id` (string): 会话ID
  - `turn_id` (int64): 轮次ID
  - 其他需要透传的内容

**发送说明**：
- 用于监控和统计TTS Extension的使用情况
- 通常在请求完成时上报

### 音频输出接口（audio_frame_out）

#### pcm_frame - PCM音频帧

**用途**：向下游Extension发送PCM格式的音频数据。

**字段**：
- `metadata` (object): 元数据信息
  - `session_id` (string): 会话ID
  - `turn_id` (int64): 轮次ID

**音频格式要求**：
- 格式：PCM（脉冲编码调制）
- 采样率：由`synthesize_audio_sample_rate()`方法返回（常见值：16000、24000、44100、48000 Hz）
- 声道数：由`synthesize_audio_channels()`方法返回（默认1，单声道）
- 采样宽度：由`synthesize_audio_sample_width()`方法返回（默认2字节，16-bit）
- 字节序：小端序（Little-Endian）

**发送说明**：
- 音频数据以帧为单位流式发送
- 每个音频帧包含固定时长的音频数据（通常为20-40ms）
- 基类会自动处理不完整的音频帧（leftover_bytes）
- 如果启用了`dump`功能，音频数据会同时保存到文件

### 接口调用流程示例

#### 正常请求流程

```
上游Extension                     TTS Extension                    下游Extension
     |                                  |                                 |
     |---- tts_text_input ------------>|                                 |
     |    (text="Hello")                |                                 |
     |                                  |---- 调用TTS服务 -------->       |
     |                                  |                                 |
     |                                  |<---- 接收音频数据 ---------      |
     |                                  |                                 |
     |                                  |---- tts_audio_start ---------->|
     |                                  |                                 |
     |                                  |---- pcm_frame ----------------|
     |                                  |---- pcm_frame ----------------|
     |                                  |---- pcm_frame ----------------|
     |                                  |    ...                         |
     |                                  |---- tts_audio_end ------------>|
     |                                  |                                 |
     |                                  |---- metrics ------------------>|
```

#### Flush请求流程

```
上游Extension                     TTS Extension                    下游Extension
     |                                  |                                 |
     |---- tts_flush ---------------->|                                 |
     |                                  |---- 取消当前请求 ------->       |
     |                                  |---- 清空队列                  |
     |                                  |                                 |
     |                                  |<---- flush响应 ----------       |
     |                                  |                                 |
     |                                  |---- tts_flush_end ------------>|
```

### 开发注意事项

1. **request_id关联**：必须确保所有输出消息的`request_id`与输入消息的`request_id`一致
2. **元数据传递**：应保留并传递输入的`metadata`信息到输出消息中
3. **错误处理**：出现错误时必须发送`error`消息，不能静默失败
4. **时间戳计算**：准确计算和上报时间相关指标（TTFB、音频时长等）
5. **流式处理**：支持流式文本输入和音频输出，不要等待完整文本才开始处理
6. **资源清理**：正确处理flush请求，及时清理资源和取消请求

### 核心继承关系

```python
AsyncTTS2BaseExtension  # TEN AI Base 提供的抽象基类
    ↓
MyTTSExtension         # 你的具体实现
```

#### 基类功能概述

`AsyncTTS2BaseExtension` 是 TEN AI Base 提供的 TTS 扩展抽象基类，它为所有 TTS Extension 提供了统一的框架和开箱即用的功能：

**核心职责**：

1. **生命周期管理**：自动处理扩展的初始化、启动、停止等生命周期事件
2. **消息队列处理**：
   - 接收上游的文本输入并放入异步队列
   - 根据连接状态自动执行缓冲策略（丢弃或保持）
   - 提取和管理 session_id、metadata 等元信息
3. **Flush 事件处理**：接收 `tts_flush` 数据，调用子类的 `cancel_tts()` 方法
4. **性能指标自动计算**：
   - TTFB（Time To First Byte）：首字节延迟
   - 音频时长统计和定期上报
5. **标准化输出**：提供统一的 API 发送音频数据、错误信息、性能指标等数据
6. **会话管理**：自动为每轮对话生成唯一 ID，管理 metadata 传递

通过继承基类，开发者只需专注于实现与具体 TTS 服务商交互的核心逻辑，无需关心框架层的通用处理。

## 核心代码介绍

### 基类 `AsyncTTS2BaseExtension` 核心功能

TTS Extension基于`AsyncTTS2BaseExtension`基类构建，该基类继承自`AsyncExtension`，提供了TTS Extension的完整基础设施。

```python
class AsyncTTS2BaseExtension(AsyncExtension, ABC):
    """TTS Extension基类"""
    
    # 抽象方法 - 子类必须实现
    @abstractmethod
    async def request_tts(self, t: TTSTextInput) -> None:
        """处理TTS请求 - 子类必须实现
        - 从队列中接收文本输入
        - 调用TTS服务生成音频
        - 使用send_tts_audio_data()发送音频数据
        """
        
    @abstractmethod
    def vendor(self) -> str:
        """返回供应商名称 - 子类必须实现
        - 用于指标上报和错误追踪
        """
        
    @abstractmethod
    def synthesize_audio_sample_rate(self) -> int:
        """返回音频采样率 - 子类必须实现
        - 用于音频帧格式化和时长计算
        """
    
    # 可选重写方法
    async def cancel_tts(self) -> None:
        """取消TTS请求 - 子类可选重写
        - 收到flush请求时调用
        - 用于实现TTS特定的取消逻辑
        - 应该快速执行，避免阻塞主线程
        """
    
    # 已实现的完整功能
    
    # 生命周期管理
    async def on_init(self, ten_env: AsyncTenEnv) -> None:
        """Extension初始化 - 基类已实现
        - 初始化消息队列
        - 初始化指标计数器
        """
        
    async def on_start(self, ten_env: AsyncTenEnv) -> None:
        """Extension启动 - 基类已实现
        - 启动消息队列处理任务
        """
        
    async def on_stop(self, ten_env: AsyncTenEnv) -> None:
        """Extension停止 - 基类已实现
        - 发送最后一批指标
        - 清空消息队列
        - 取消处理任务
        """
        
    async def on_deinit(self, ten_env: AsyncTenEnv) -> None:
        """Extension销毁 - 基类已实现"""
    
    # 消息队列处理
    async def on_data(self, ten_env: AsyncTenEnv, data: Data) -> None:
        """处理接收到的数据 - 基类已实现
        - 处理tts_text_input：放入消息队列
        - 处理tts_flush：清空队列并取消当前任务
        - 使用锁机制防止并发问题
        """
        
    async def _process_input_queue(self, ten_env: AsyncTenEnv) -> None:
        """异步处理队列中的消息 - 基类已实现
        - 从队列中逐个取出消息
        - 调用request_tts()处理每个请求
        """
        
    async def _flush_input_items(self) -> None:
        """清空消息队列 - 基类已实现
        - 清空输入队列
        - 取消当前处理任务
        - 调用cancel_tts()执行TTS特定取消逻辑
        """
    
    # 音频发送方法
    async def send_tts_audio_data(self, audio_data: bytes, timestamp: int = 0) -> None:
        """发送音频数据 - 基类已实现
        - 自动处理不完整的音频帧（leftover_bytes）
        - 格式化音频帧（采样率、声道数、采样宽度）
        - 发送到下游Extension
        """
        
    async def send_tts_audio_start(self, request_id: str, turn_id: int = -1, 
                                   extra_metadata: dict | None = None) -> None:
        """发送音频开始事件 - 基类已实现
        - 通知下游Extension音频开始
        - 支持元数据传递
        """
        
    async def send_tts_audio_end(self, request_id: str, request_event_interval_ms: int, 
                                  request_total_audio_duration_ms: int, turn_id: int = -1, 
                                  reason: TTSAudioEndReason = TTSAudioEndReason.REQUEST_END,
                                  extra_metadata: dict | None = None) -> None:
        """发送音频结束事件 - 基类已实现
        - 通知下游Extension音频结束
        - 包含事件间隔时长和音频总时长
        - 支持不同的结束原因（REQUEST_END, INTERRUPTED等）
        - 清理请求元数据
        """
    
    # 指标上报方法
    async def send_tts_ttfb_metrics(self, request_id: str, ttfb_ms: int, 
                                    turn_id: int = -1, extra_metadata: dict | None = None) -> None:
        """发送TTFB指标 - 基类已实现
        - TTFB（Time To First Byte）指标上报
        - 支持额外元数据
        """
        
    async def send_usage_metrics(self, request_id: str = "", 
                                 extra_metadata: dict | None = None) -> None:
        """发送使用量指标 - 基类已实现
        - 输入字符数、输出字符数
        - 接收的音频时长
        - 总使用量统计
        """
        
    async def send_metrics(self, metrics: ModuleMetrics, request_id: str = "") -> None:
        """发送通用指标 - 基类已实现
        - 发送ModuleMetrics对象
        """
    
    # 错误处理
    async def send_tts_error(self, request_id: str | None, error: ModuleError,
                             turn_id: int = -1, extra_metadata: dict | None = None) -> None:
        """发送错误信息 - 基类已实现
        - 标准化的错误报告格式
        - 包含供应商信息、错误代码、错误消息
        - 支持元数据传递
        """
    
    # 辅助方法
    def synthesize_audio_channels(self) -> int:
        """返回音频声道数 - 基类已实现（默认1）"""
        return 1
    
    def synthesize_audio_sample_width(self) -> int:
        """返回音频采样宽度（字节） - 基类已实现（默认2，16-bit）"""
        return 2
    
    def get_uuid(self) -> str:
        """生成唯一标识符 - 基类已实现"""
    
    def update_metadata(self, request_id: str | None, metadata: dict | None) -> dict:
        """更新元数据 - 基类已实现
        - 合并请求元数据和额外元数据
        """
    
    # 指标辅助方法
    def metrics_add_output_characters(self, characters: int) -> None:
        """添加输出字符数 - 基类已实现"""
    
    def metrics_add_input_characters(self, characters: int) -> None:
        """添加输入字符数 - 基类已实现"""
    
    def metrics_add_recv_audio_chunks(self, chunks: bytes) -> None:
        """添加接收的音频块 - 基类已实现"""
    
    async def metrics_calculate_duration(self) -> None:
        """计算音频时长 - 基类已实现"""
    
    def metrics_reset(self) -> None:
        """重置指标计数器 - 基类已实现"""
```

#### 基类提供的完整功能

`AsyncTTS2BaseExtension`基类已经完整实现了以下功能，开发者无需重复实现：

1. **生命周期管理**
   - `on_init()`: 初始化消息队列和指标计数器
   - `on_start()`: 启动消息队列处理任务
   - `on_stop()`: 发送最后一批指标、清空队列、取消任务
   - `on_deinit()`: 销毁处理

2. **异步消息队列处理**
   - `on_data()`: 处理上游发送的`tts_text_input`和`tts_flush`数据
   - `_process_input_queue()`: 异步处理队列中的消息，调用`request_tts()`
   - `_flush_input_items()`: 收到flush后清空队列并取消当前任务
   - 使用锁机制防止并发问题，确保flush时不会继续接收新请求

3. **音频数据管理**
   - `send_tts_audio_data()`: 自动处理不完整音频帧，格式化并发送
   - `send_tts_audio_start()`: 发送音频开始事件
   - `send_tts_audio_end()`: 发送音频结束事件，包含时长和原因

4. **指标上报**
   - `send_tts_ttfb_metrics()`: TTFB指标上报
   - `send_usage_metrics()`: 使用量指标上报（字符数、音频时长等）
   - `send_metrics()`: 通用指标上报
   - 自动计算音频时长和统计使用量

5. **错误处理**
   - `send_tts_error()`: 标准化的错误报告机制
   - 包含供应商信息、错误代码、错误消息

6. **辅助功能**
   - 音频参数获取（声道数、采样宽度）
   - 元数据管理
   - UUID生成
   - 指标统计和重置

#### 子类需要实现的方法

开发者只需要实现以下3个抽象方法（以及可选的`cancel_tts()`）：

1. **`async def request_tts(t: TTSTextInput) -> None`**
   - 处理TTS请求的核心逻辑
   - 从配置或服务获取音频数据
   - 使用`send_tts_audio_data()`发送音频
   - 使用`send_tts_audio_start()`和`send_tts_audio_end()`发送事件
   - 使用`send_tts_ttfb_metrics()`上报TTFB指标
   - 使用`send_tts_error()`报告错误

2. **`def vendor() -> str`**
   - 返回供应商名称，用于指标和错误追踪

3. **`def synthesize_audio_sample_rate() -> int`**
   - 返回音频采样率，用于音频帧格式化

4. **`async def cancel_tts() -> None`**（可选）
   - 实现TTS特定的取消逻辑
   - 例如：关闭连接、停止请求等
   - 应该快速执行，避免阻塞


### 基类 `AsyncTTS2HttpExtension` 核心功能

HTTP模式基于`AsyncTTS2HttpExtension`基类实现，该基类继承自`AsyncTTS2BaseExtension`，并提供了HTTP模式的完整实现。

```python
class AsyncTTS2HttpExtension(AsyncTTS2BaseExtension):
    """HTTP模式TTS Extension基类"""
    
    # 抽象方法 - 子类必须实现
    @abstractmethod
    async def create_config(self, config_json_str: str) -> AsyncTTS2HttpConfig:
        """从JSON字符串创建配置对象 - 子类必须实现"""
        
    @abstractmethod
    async def create_client(self, config: AsyncTTS2HttpConfig, ten_env: AsyncTenEnv) -> AsyncTTS2HttpClient:
        """创建客户端对象 - 子类必须实现"""
    
    @abstractmethod
    def vendor(self) -> str:
        """返回供应商名称 - 子类必须实现（继承自基类）"""
        
    @abstractmethod
    def synthesize_audio_sample_rate(self) -> int:
        """返回音频采样率 - 子类必须实现（继承自基类）"""

    async def request_tts(self, t: TTSTextInput) -> None:
        """处理TTS请求 - 基类已完整实现
        包含完整的请求处理逻辑：
        - 请求状态管理（request_id、turn_id等）
        - 客户端自动重连机制
        - PCMWriter管理（创建、清理）
        - 调用client.get()获取音频流
        - 音频数据处理和发送
        - TTFB计算和上报（首次音频块时）
        - 音频时长计算
        - 音频开始/结束事件发送
        - 错误处理和上报
        """
        
    def _calculate_audio_duration_ms(self) -> int:
        """计算音频时长（毫秒）- 基类已实现
        根据音频字节数、采样率、声道数计算
        """
```

#### 基类提供的完整功能

`AsyncTTS2HttpExtension`基类已经完整实现了以下功能，开发者无需重复实现：

1. **生命周期管理**
   - `on_init()`: 配置加载、验证和客户端创建
   - `on_stop()`: 资源清理
   - `on_deinit()`: 销毁处理

2. **请求处理逻辑**（在`request_tts()`中实现）
   - 请求状态跟踪（request_id、turn_id、first_chunk等）
   - 客户端自动重连（client为None时自动重新创建）
   - PCMWriter生命周期管理（创建、清理）
   - 调用客户端获取音频流
   - 音频数据流式处理
   - TTFB指标计算和上报（首次音频块时）
   - 音频时长计算
   - 音频开始/结束事件发送
   - 错误处理和上报

3. **资源管理**
   - PCMWriter自动管理（按request_id）
   - 客户端资源清理
   - 状态重置

#### 子类需要实现的方法

开发者只需要实现以下4个抽象方法：

1. **`create_config(config_json_str: str) -> AsyncTTS2HttpConfig`**
   - 从JSON字符串创建配置对象

2. **`create_client(config: AsyncTTS2HttpConfig, ten_env: AsyncTenEnv) -> AsyncTTS2HttpClient`**
   - 创建客户端对象

3. **`vendor() -> str`**
   - 返回供应商名称

4. **`synthesize_audio_sample_rate() -> int`**
   - 返回音频采样率

#### 配置接口 `AsyncTTS2HttpConfig`

配置类必须继承`AsyncTTS2HttpConfig`并实现以下抽象方法：

```python
class AsyncTTS2HttpConfig(BaseModel):
    """HTTP模式配置基类"""
    
    dump: bool = False
    dump_path: str = "/tmp"
    
    @abstractmethod
    def update_params(self) -> None:
        """更新配置参数 - 子类必须实现
        - 从params字典中提取配置项
        - 处理参数映射和转换
        - 删除黑名单参数
        """
        
    @abstractmethod
    def to_str(self, sensitive_handling: bool = True) -> str:
        """转换为字符串 - 子类必须实现
        - 支持敏感信息加密
        - 用于日志记录
        """
        
    @abstractmethod
    def validate(self) -> None:
        """验证配置 - 子类必须实现
        - 检查必需参数
        - 验证参数范围和格式
        """
```

#### 客户端接口 `AsyncTTS2HttpClient`

客户端类必须实现`AsyncTTS2HttpClient`接口：

```python
class AsyncTTS2HttpClient:
    """HTTP模式客户端接口"""
    
    @abstractmethod
    async def clean(self) -> None:
        """清理资源 - 子类必须实现
        - 清理HTTP客户端连接
        - 释放相关资源
        """
        
    @abstractmethod
    async def cancel(self) -> None:
        """取消当前请求 - 子类必须实现
        - 设置取消标志
        - 中断正在进行的请求
        """
        
    @abstractmethod
    async def get(
        self, text: str, request_id: str
    ) -> AsyncIterator[Tuple[bytes | None, TTS2HttpResponseEventType]]:
        """获取音频流 - 子类必须实现
        - 发送HTTP POST请求
        - 处理流式响应
        - 返回音频块和事件类型
        - 使用TTS2HttpResponseEventType枚举
        """
        
    @abstractmethod
    def get_extra_metadata(self) -> dict[str, Any]:
        """获取额外元数据 - 子类必须实现
        - 返回供应商特定的元数据
        - 用于TTFB指标上报
        - 如voice_id、model_id等
        """
```

### 基类与子类职责

#### 基本区分
**路径1：直接继承AsyncTTS2BaseExtension（WebSocket模式、SDK模式等）**

```
┌─────────────────────────────────────────────────────────────┐
│                    AsyncTTS2BaseExtension                    │
│  【通用基类】提供TTS Extension的基础设施                      │
│  - 消息队列管理                                               │
│  - 生命周期管理                                               │
│  - 音频数据发送                                               │
│  - 指标上报                                                   │
│  - 错误处理                                                   │
└─────────────────────────────────────────────────────────────┘
                              ↑ 继承（路径1）
┌─────────────────────────────────────────────────────────────┐
│        VendorTTSExtension (WebSocket/SDK模式子类)             │
│  【子类实现】实现厂商特定逻辑                                   │
│  - 完整的request_tts()实现                                     │
│  - WebSocket/SDK客户端实现                                     │
│  - 配置类实现                                                  │
│  - 供应商信息                                                  │
│  - 采样率配置                                                  │
└─────────────────────────────────────────────────────────────┘
```

**路径2：继承AsyncTTS2HttpExtension（HTTP模式）**

```
┌─────────────────────────────────────────────────────────────┐
│                    AsyncTTS2BaseExtension                    │
│  【通用基类】提供TTS Extension的基础设施                      │
│  - 消息队列管理                                               │
│  - 生命周期管理                                               │
│  - 音频数据发送                                               │
│  - 指标上报                                                   │
│  - 错误处理                                                   │
└─────────────────────────────────────────────────────────────┘
                              ↑ 继承
┌─────────────────────────────────────────────────────────────┐
│               AsyncTTS2HttpExtension (HTTP模式)              │
│  【模式基类】提供HTTP模式的完整实现                             │
│  - 配置加载和验证                                              │
│  - 客户端管理                                                  │
│  - 请求处理逻辑（完整的request_tts()实现）                     │
│  - TTFB计算和上报                                              │
│  - PCMWriter管理                                              │
└─────────────────────────────────────────────────────────────┘
                              ↑ 继承（路径2）
┌─────────────────────────────────────────────────────────────┐
│              VendorTTSExtension (HTTP模式子类)                 │
│  【子类实现】实现厂商特定逻辑                                   │
│  - 配置类实现（create_config()）                               │
│  - 客户端实现（create_client()）                               │
│  - 供应商信息（vendor()）                                      │
│  - 采样率配置（synthesize_audio_sample_rate()）               │
└─────────────────────────────────────────────────────────────┘
```


#### 详细说明

**1. AsyncTTS2BaseExtension（通用基类）**

**职责**：提供TTS Extension的基础设施，所有TTS Extension共享的功能。

**负责**：
- ✅ 消息队列的完整管理（接收、处理、flush）
- ✅ Extension生命周期管理（init、start、stop、deinit）
- ✅ 音频数据发送和格式化
- ✅ 指标上报（TTFB、使用量等）
- ✅ 错误处理和上报
- ✅ 元数据管理

**不负责**：
- ❌ 具体的TTS服务调用
- ❌ 配置加载（由模式基类或子类负责）
- ❌ 客户端管理（由模式基类负责）
- ❌ 厂商特定的逻辑

**2. AsyncTTS2HttpExtension（HTTP模式基类）**

**职责**：提供HTTP模式的完整实现，所有HTTP模式TTS Extension共享的逻辑。

**负责**：
- ✅ 配置加载和验证（调用子类的`create_config()`）
- ✅ 客户端创建和管理（调用子类的`create_client()`）
- ✅ HTTP请求处理逻辑（完整的`request_tts()`实现）
- ✅ TTFB计算和上报
- ✅ **PCMWriter生命周期管理（如启用dump功能）**
  - **初始化**：基类在`request_tts()`中自动检测新请求ID时初始化
  - **写入**：基类在处理音频流时自动写入
  - **销毁/刷新**：基类在请求完成时自动刷新
- ✅ 请求状态跟踪（request_id、turn_id等）
- ✅ 音频流处理（调用子类的`client.get()`）
- ✅ 错误处理和事件发送

**不负责**：
- ❌ 厂商特定的配置结构（由子类配置类实现）
- ❌ 厂商特定的HTTP通信逻辑（由子类客户端类实现）
- ❌ 供应商信息（由子类实现）

**3. VendorTTSExtension（子类实现）**

**职责**：实现厂商特定的逻辑，与具体TTS服务提供商交互。

根据继承路径的不同，子类的职责也不同：

**路径1：直接继承AsyncTTS2BaseExtension（WebSocket/SDK模式）**

**负责**：
- ✅ **完整的`request_tts()`实现**
  - 请求状态管理（request_id、turn_id等）
  - WebSocket连接管理或SDK调用
  - 音频流处理和发送
  - TTFB计算和上报
  - 音频开始/结束事件发送
  - 错误处理和上报
  - **PCMWriter管理（如启用dump功能）**
    - **初始化**：在`request_tts()`中检测到新的`request_id`时，创建`PCMWriter`实例并保存到字典中（按`request_id`索引），同时清理旧的PCMWriter
    - **写入**：每次收到音频数据块时，在调用`send_tts_audio_data()`之前，使用`PCMWriter.write()`写入音频数据
    - **销毁/刷新**：请求完成时（包括正常完成和中断），在发送`audio_end`事件之前，使用`PCMWriter.flush()`刷新缓冲区
- ✅ **客户端类实现**
  - WebSocket连接管理
  - 或SDK客户端封装
  - 资源清理
  - 请求取消
- ✅ **配置类实现**
  - 参数提取和映射
  - 日志输出格式
  - 参数验证
- ✅ **Extension类实现**
  - `vendor()`: 返回供应商名称
  - `synthesize_audio_sample_rate()`: 返回采样率
  - `cancel_tts()`: 可选实现取消逻辑

**不负责**：
- ❌ 消息队列管理（基类已实现）
- ❌ 音频数据发送（基类已实现）
- ❌ 指标上报（基类已实现）
- ❌ 错误处理格式（基类已实现）

**路径2：继承AsyncTTS2HttpExtension（HTTP模式）**

**负责**：
- ✅ **配置类实现（`VendorTTSConfig`）**
  - `update_params()`: 参数提取和映射
  - `to_str()`: 日志输出格式
  - `validate()`: 参数验证
- ✅ **客户端类实现（`VendorTTSClient`）**
  - `get()`: HTTP请求发送和响应处理
  - `clean()`: 资源清理
  - `cancel()`: 请求取消
  - `get_extra_metadata()`: 元数据获取
- ✅ **Extension类实现**
  - `create_config()`: 创建配置对象
  - `create_client()`: 创建客户端对象
  - `vendor()`: 返回供应商名称
  - `synthesize_audio_sample_rate()`: 返回采样率

**不负责**：
- ❌ 消息队列管理（基类已实现）
- ❌ 音频数据发送（基类已实现）
- ❌ 指标上报（基类已实现）
- ❌ 错误处理格式（基类已实现）
- ❌ **请求处理流程（HTTP模式基类已实现）**
- ❌ **PCMWriter管理（HTTP模式基类已实现）**

**注意**：两种路径都需要在配置类中支持`dump`和`dump_path`参数来启用PCM功能。

## 1. 🚀 项目初始化

### 创建扩展项目

使用 TMan 的 TTS 专用模板快速创建项目骨架：

```bash title="Terminal"
# 进入扩展目录
cd ten-framework/ai_agents/agents/ten_packages/extension

# 创建TTS扩展项目
tman create extension my_tts_extension --template default_tts_python --template-data class_name_prefix=MyTts
```

创建成功后会显示：

```bash title="输出信息"
Package 'extension:my_tts_extension' created successfully in 'my_tts_extension' in 2 seconds.
```

### 安装项目依赖

#### 添加第三方库依赖

首先在 `requirements.txt` 中添加所需的第三方库依赖：

```text title="requirements.txt"
websockets~=14.0
pydantic
requests
httpx
aiofiles
```

#### 安装 TEN 依赖

进入创建的扩展目录并安装依赖：

```bash title="Terminal"
cd my_tts_extension
tman install --standalone
```

这会根据 `manifest.json` 中声明的依赖构建依赖树，并安装到 `.ten` 目录下。

## 2. 🏗️ 扩展架构设计

### 项目结构概览

```
my_tts_extension/
├── .vscode/               # VS Code 调试配置
│   └── launch.json       # 调试启动配置
├── manifest.json          # 扩展元数据和依赖声明
├── property.json          # 默认配置参数  
├── requirements.txt       # Python 依赖
├── config.py              # 配置管理类
├── {vendor}_tts.py        # TTS客户端核心实现
├── extension.py           # 主要实现文件
└── tests/                 # 测试文件
    ├── bin/start          # 测试启动脚本
    ├── test_basic.py      # 单元测试
    └── configs/           # 测试配置
```

### TTS Extension 接口规范

TTS Extension 遵循 TEN Framework 的标准接口规范。使用模板创建的 TTS Extension 会自动配置好接口继承关系和必要的 API 声明。

#### Manifest 配置

TTS Extension 的 `manifest.json` 文件中需要正确配置接口和属性声明：

**1. Interface 继承**

在 `manifest.json` 的 `api.interface` 中声明继承自 `ten_ai_base` 系统包下的标准 TTS 接口：

```json title="manifest.json"
{
  "api": {
    "interface": [
      {
        "import_uri": "../../system/ten_ai_base/api/tts-interface.json"
      }
    ]
  }
}
```

该接口文件（`tts-interface.json`）中定义了所有 TTS Extension 必须遵循的标准属性，包括：
- `dump`: 布尔值，配置是否开启音频 dump
- `dump_path`: 字符串，音频 dump 的存储路径
- `enable_words`: 布尔值，配置是否启用字幕对齐功能

**2. Property 声明**

除了继承标准接口外，每个 TTS Extension 还需要在 `api.property` 中声明自己特有的配置属性，特别是 `params` 对象中的必填字段。

**关键说明**：
- **标准属性**（如 `dump`、`dump_path`、`enable_words`）：通过 `interface` 继承自 `tts-interface.json`，所有 TTS Extension 共有
- **扩展属性**（如 `params.api_key`、`params.voice_id`）：在 `api.property` 中声明，根据不同的 TTS 服务商而异

使用模板创建 TTS Extension 时，这些配置会自动生成，但需要根据实际的服务商需求调整 `params` 中的属性。

## 3. ⚙️ 配置管理设计

### 设计配置类

创建灵活的配置类，支持必填参数和可选透传参数：

```python title="config.py"
from pydantic import BaseModel
from typing import Dict, Optional

class MyTTSConfig(BaseModel):
    # 所有TTS参数都在params中，包括必填和可选参数
    params: Dict[str, Optional[str]] = {}
    
    # 音频dump相关配置 - 所有TTS扩展的标准实现
    dump: bool = False
    dump_path: Optional[str] = None
```

### 读取扩展配置

在 `on_init` 阶段读取和初始化配置：

```python title="extension.py"
from ten_ai_base.const import LOG_CATEGORY_KEY_POINT, LOG_CATEGORY_VENDOR
from ten_ai_base.message import ModuleError, ModuleErrorCode

@override
async def on_init(self, ten_env: AsyncTenEnv) -> None:
    await super().on_init(ten_env)
    
    # 读取完整的扩展配置
    config_json, _ = await ten_env.get_property_to_json("")
    
    try:
        # 反序列化配置为配置类实例
        self.config = MyTTSConfig.model_validate_json(config_json)
        
        # 打印配置信息（敏感信息脱敏）
        ten_env.log_info(
            f"config: {self.config.to_json(sensitive_handling=True)}",
            category=LOG_CATEGORY_KEY_POINT,
        )
            
    except Exception as e:
        ten_env.log_error(
            f"invalid property: {e}",
            category=LOG_CATEGORY_KEY_POINT
        )
        # 配置错误时使用默认配置
        self.config = MyTTSConfig.model_validate_json("{}")
        # 发送致命错误
        await self.send_tts_error(
            ModuleError(
                module=MODULE_NAME_TTS,
                code=ModuleErrorCode.FATAL_ERROR.value,
                message=str(e),
            ),
        )
```

### 配置敏感信息脱敏

为配置类添加脱敏方法，保护敏感信息：

```python title="config.py"
from ten_ai_base.utils import encrypt

class MyTTSConfig(BaseModel):
    params: Dict[str, Optional[str]] = {}
    dump: bool = False
    dump_path: Optional[str] = None
    
    def to_json(self, sensitive_handling: bool = False) -> str:
        """
        序列化配置为 JSON，支持敏感信息脱敏
        
        Args:
            sensitive_handling: 是否对敏感信息进行脱敏处理
        """
        if not sensitive_handling:
            return self.model_dump_json()
        
        # 深拷贝配置对象
        config = self.model_copy(deep=True)
        
        # 对 params 中的敏感字段进行脱敏
        if config.params:
            encrypted_params = {}
            for key, value in config.params.items():
                # 对包含 'key'、'token'、'secret' 等敏感词的字段进行加密
                if (key in ['api_key', 'key', 'token', 'secret', 'password'] 
                    and isinstance(value, str) and value):
                    encrypted_params[key] = encrypt(value)
                else:
                    encrypted_params[key] = value
            config.params = encrypted_params
            
        return config.model_dump_json()
```

### 配置默认参数

在 `property.json` 中提供默认配置：

```json title="property.json"
{
  "params": {
    "api_key": "your_tts_api_key_here",
    "voice_id": "default_voice",
    "model": "default_model",
    "sample_rate": "24000"
  },
  "dump": false,
  "dump_path": "/tmp/tts_audio_dump"
}
```

## 4. 🔧 核心功能实现

### 实现基础方法

```python title="extension.py"
class MyTTSExtension(AsyncTTS2BaseExtension):
    def __init__(self, name: str):
        super().__init__(name)
        self.config: MyTTSConfig = MyTTSConfig()
        
    @override
    def vendor(self) -> str:
        """返回TTS服务商名称"""
        return "vendor_name"
    
    @override
    def synthesize_audio_sample_rate(self) -> int:
        """返回音频采样率"""
        return int(self.config.params.get("sample_rate", 24000) or 24000)
```

## WebSocket模式规范

### 模式特点

WebSocket模式支持websocket通信，允许流式音频响应，实现最低延迟的TTS响应。典型实现如ElevenLabs TTS2。

### 核心架构

```
┌─────────────────┐    WebSocket     ┌─────────────────┐
│   Extension     │─────────────────►│  TTS Provider   │
│                 │  发送请求         │                 │
│ - 请求管理       │                  │ - 流式音频响应   │
│ - 响应处理       │◄─────────────────│ - 任务状态管理   │
│ - 连接复用       │  接收响应         │ - 错误处理      │
└─────────────────┘                  └─────────────────┘
```

### 实现规范

#### 1. 连接管理策略

**连接生命周期管理：**
```python
class VendorTTS2Synthesizer:
    def __init__(self, config, ten_env, error_callback, response_msgs):
        # 连接状态管理
        self._session_closing = False
        self._connect_exp_cnt = 0
        self.websocket_task = None
        self.channel_tasks = []
        self._session_started = False
        
        # 事件同步机制
        self._connection_event = asyncio.Event()
        self._connection_success = False
        self._receive_ready_event = asyncio.Event()
        
        # 启动WebSocket连接监控
        self.websocket_task = asyncio.create_task(self._process_websocket())
```

**自动重连机制：**
```python
async def _process_websocket(self) -> None:
    """主WebSocket连接监控和重连逻辑"""
    try:
        # 使用websockets.connect的自动重连机制
        async for ws in websockets.connect(
            uri=self.uri,
            ...
        ):
            self.ws = ws
            try:
                # 启动发送和接收任务
                self.channel_tasks = [
                    #支持双向流的厂商，可以发送和接收两个loop。如果厂商只支持一个请求结束再发第二个，发送功能就不要用loop
                    asyncio.create_task(self._send_loop(ws)),
                    asyncio.create_task(self._receive_loop(ws)),
                ]
                
                # 等待接收循环准备就绪
                await self._receive_ready_event.wait()
                await self.start_connection()
                
                await self._await_channel_tasks()
                
            except websockets.ConnectionClosed as e:
                if not self._session_closing:
                    # 重置所有事件状态
                    self._receive_ready_event.clear()
                    self._connection_event.clear()
                    self._connection_success = False
                    self._session_started = False
                    continue
    except Exception as e:
        self.ten_env.log_error(f"WebSocket connection error: {e}")
```

#### 2. 消息队列处理

**文本输入队列：**
```python
async def _send_loop(self, ws: ClientConnection) -> None:
    """文本发送循环"""
    try:
        # 发送初始化消息
        init_msg = ...
        await ws.send(json.dumps(init_msg))
        
        while not self._session_closing:
            """发送文本"""
                
    except asyncio.CancelledError:
        raise
    except Exception as e:
        self.ten_env.log_error(f"Exception in send_loop: {e}")
        raise
```

**音频接收处理：**
```python
async def _receive_loop(self, ws: ClientConnection) -> None:
    """消息接收循环"""
    try:
        self._receive_ready_event.set()
        
        while self._session_closing == False:
            message = await ws.recv()
            #解析response
                
    except asyncio.CancelledError:
        raise
    except Exception as e:
        self.ten_env.log_error(f"Exception in receive_loop: {e}")
        raise
```

#### 3. 错误处理和重连机制

**异常处理策略：**
```python
def _process_ws_exception(self, exp) -> None | Exception:
    """处理WebSocket连接异常并决定是否重连"""
    self.ten_env.log_debug(f"Websocket internal error: {exp}")
    self._connect_exp_cnt += 1
    
    if self._connect_exp_cnt > 5:  # 最大重试次数
        self.ten_env.log_error(f"Max retries exceeded: {str(exp)}")
        return exp
    return None  # 继续重连
```

**错误回调处理：**
```python
if self.error_callback:
    module_error = ModuleError(
        message=data["error"],
        module=ModuleType.TTS,
        code=error_code,
        vendor_info=error_info,
    )
    await self.error_callback("", module_error)
```

#### 4. 资源管理和清理

**连接取消和清理：**
```python
def cancel(self) -> None:
    """取消当前连接，用于flush场景"""


def _clear_queues(self) -> None:
    """清理所有队列以防止旧数据处理，用于收到flush之后的操作"""

```

### 最佳实践

1. **连接预热**：在初始化时建立WebSocket连接，减少首次请求延迟
2. **自动重连**：实现指数退避的重连策略
3. **资源清理**：及时清理取消的合成器，避免内存泄漏
4. **错误分类**：区分网络错误、认证错误和业务错误
5. **队列管理**：使用有界队列防止内存溢出
6. **超时处理**：设置合理的超时时间，避免长时间阻塞

## HTTP模式规范

### 模式特点

HTTP模式使用标准的HTTP流式请求，适合传统的REST API TTS服务。实现简单，维护成本低，但延迟相对较高。典型实现如Rime TTS。

### 核心架构

```
┌─────────────────┐    HTTP Request  ┌─────────────────┐
│   Extension     │─────────────────►│  TTS Provider    │
│                 │  POST请求         │                 │
│ - HTTP客户端     │                  │ - REST API       │
│ - 流式响应处理    │◄─────────────────│ - 流式音频响应    │
│ - 错误重试       │  HTTP Response  │ - 错误处理       │
└─────────────────┘                  └─────────────────┘
```

### 实现规范

HTTP模式基于`AsyncTTS2HttpExtension`基类实现，该基类已经提供了完整的请求处理逻辑、TTFB计算、音频数据处理等功能。开发者只需要实现客户端接口和配置类即可。

#### 1. HTTP客户端接口实现

**客户端必须实现`AsyncTTS2HttpClient`接口：**
```python
from ten_ai_base.tts2_http import AsyncTTS2HttpClient
from ten_ai_base.struct import TTS2HttpResponseEventType
from httpx import AsyncClient, Timeout, Limits

class VendorTTSClient(AsyncTTS2HttpClient):
    """HTTP流式TTS客户端，实现AsyncTTS2HttpClient接口"""
    
    def __init__(self, config: VendorTTSConfig, ten_env: AsyncTenEnv):

        # API端点配置（使用抽象方法）
        self.endpoint = self._get_api_endpoint()
        
        # 请求头配置（使用抽象方法）
        self.headers = self._create_headers()
        
        # HTTP客户端配置
        self.client = AsyncClient(
            http2=True,  # 启用HTTP/2
            follow_redirects=True,
        )
    
    def _get_api_endpoint(self) -> str:
        """获取API端点 - 子类实现"""
        raise NotImplementedError("Subclasses must implement _get_api_endpoint")
    
    def _create_headers(self) -> dict:
        """创建请求头 - 子类实现"""
        raise NotImplementedError("Subclasses must implement _create_headers")
```

**资源管理方法：**
```python
async def clean(self) -> None:
    """清理资源 - AsyncTTS2HttpClient接口要求"""
    if self.client:
        self.ten_env.log_debug("Cleaning HTTP client")
        # 注意：根据实际实现，可能只需要设置client为None
        # 或者调用await self.client.aclose()
        self.client = None

async def cancel(self) -> None:
    """取消当前请求 - AsyncTTS2HttpClient接口要求"""
    self.ten_env.log_debug("VendorTTS: cancel() called.")
    self._is_cancelled = True
```

#### 2. 流式请求处理

**TTS请求处理（实现AsyncTTS2HttpClient接口）：**
```python
from typing import AsyncIterator, Tuple
from ten_ai_base.struct import TTS2HttpResponseEventType

async def get(
    self, text: str, request_id: str
) -> AsyncIterator[Tuple[bytes | None, TTS2HttpResponseEventType]]:
    """处理单个TTS请求 - AsyncTTS2HttpClient接口要求
    
    注意：返回类型使用TTS2HttpResponseEventType枚举，而不是整数
    """
    self._is_cancelled = False
    
    if not self.client:
        return
    
    try:
        # 构建请求数据（使用抽象方法）
        request_data = self._create_request_data(text)
        
        # 发送流式请求
        async with self.client.stream(
            "POST",
            self.endpoint,
            headers=self.headers,
            json=request_data,
        ) as response:
            # 处理响应
            async for chunk in response.aiter_bytes(chunk_size=4096):
                """"处理response，准备音频"""
            
            # 请求完成
            if not self._is_cancelled:
                yield None, TTS2HttpResponseEventType.END
    
    except Exception as e:
        """错误处理"""

def _create_request_data(self, text: str) -> dict:
    """创建请求数据 - 子类实现"""
    raise NotImplementedError("Subclasses must implement _create_request_data")

```

#### 3. Extension实现

**Extension必须继承`AsyncTTS2HttpExtension`：**
```python
from ten_ai_base.tts2_http import AsyncTTS2HttpExtension, AsyncTTS2HttpConfig, AsyncTTS2HttpClient

class VendorTTSExtension(AsyncTTS2HttpExtension):
    """TTS Extension实现，继承AsyncTTS2HttpExtension基类"""
    
    async def create_config(self, config_json_str: str) -> AsyncTTS2HttpConfig:
        """创建配置对象 - AsyncTTS2HttpExtension接口要求"""
        return VendorTTSConfig.model_validate_json(config_json_str)
    
    async def create_client(
        self, config: AsyncTTS2HttpConfig, ten_env: AsyncTenEnv
    ) -> AsyncTTS2HttpClient:
        """创建客户端对象 - AsyncTTS2HttpExtension接口要求"""
        return VendorTTSClient(config=config, ten_env=ten_env)
    
    def vendor(self) -> str:
        """返回供应商名称"""
        return "vendor_name"
    
    def synthesize_audio_sample_rate(self) -> int:
        """返回音频采样率"""
        return self.config.sample_rate if self.config else 16000
```

**注意**：`AsyncTTS2HttpExtension`基类已经实现了完整的`request_tts()`方法，包括：
- 请求处理逻辑
- TTFB计算和上报
- 音频数据处理
- 错误处理
- PCM文件写入

开发者只需要实现上述抽象方法即可。

#### 4. 请求优化

**连接复用：**
```python
class VendorTTSClient:
    def __init__(self, config, ten_env):
        # 使用连接池
        self.client = AsyncClient(
            timeout=Timeout(
                connect=10.0,  # 连接超时
                read=30.0,     # 读取超时
                write=10.0,    # 写入超时
                pool=5.0       # 连接池超时
            ),
            limits=Limits(
                max_connections=100,
                max_keepalive_connections=20,
                keepalive_expiry=600.0,
            ),
            http2=True,
            follow_redirects=True,
        )
```

**请求压缩：**
```python
def _get_headers(self) -> dict:
    """获取优化的请求头"""
    return {
        "Authorization": f"Bearer {self.api_key}",
        "Content-Type": "application/json",
        "Accept": "audio/pcm",
        "Accept-Encoding": "gzip, deflate",  # 启用压缩
        "User-Agent": "TEN-Framework-TTS/1.0",
    }
```

### 最佳实践

1. **使用基类**：继承`AsyncTTS2HttpExtension`基类，避免重复实现请求处理逻辑
2. **接口实现**：严格按照`AsyncTTS2HttpClient`接口实现客户端
3. **事件类型**：使用`TTS2HttpResponseEventType`枚举，确保类型安全
4. **抽象方法**：使用抽象方法（`_get_api_endpoint()`, `_create_headers()`等）分离厂商特定逻辑
5. **连接池管理**：使用HTTP连接池，减少连接建立开销
6. **超时控制**：设置合理的超时时间
7. **错误处理**：正确返回事件类型，让Extension基类统一处理错误
8. **元数据上报**：实现`get_extra_metadata()`方法，支持TTFB指标上报

## SDK模式规范

### 模式特点

SDK模式使用供应商提供的官方SDK，提供更丰富的功能和更好的稳定性。适合大厂提供的完整SDK，如Google Cloud TTS、Azure Cognitive Services等。

### 核心架构

```
┌─────────────────┐    SDK API        ┌─────────────────┐
│   Extension     │─────────────────►│  Vendor SDK      │
│                 │  异步调用          │                 │
│ - SDK客户端      │                  │ - 官方SDK        │
│ - 流式处理       │◄─────────────────│ - 流式合成       │
│ - 配置映射       │  音频流           │ - 错误处理       │
└─────────────────┘                  └─────────────────┘
```

### 实现规范

#### 1. SDK集成方式

**SDK客户端初始化：**
```python
class VendorTTS:
    def __init__(self, config: VendorTTSConfig, ten_env: AsyncTenEnv):
        self.config = config
        self.ten_env = ten_env
        self.client = None
        self._initialize_client()
        self.send_text_in_connection = False
        self.cur_request_id = ""
        self.streaming_enabled = False
        self.streaming_config = None
        self._should_stop_streaming = False

    def _initialize_client(self):
        """初始化供应商SDK客户端"""
        try:
            # 解析认证信息
            credentials = self._parse_credentials()
            
            # 创建SDK客户端
            self.client = vendor_sdk.TextToSpeechClient(
                credentials=credentials
            )
            
            self.ten_env.log_debug("Vendor TTS client initialized successfully")
            
        except Exception as e:
            self.ten_env.log_error(f"Failed to initialize Vendor TTS client: {e}")
            raise

```

#### 2. 流式合成处理

**流式配置创建：**
```python
def _create_streaming_config(self) -> vendor_sdk.StreamingSynthesizeConfig:
    """从配置参数创建流式配置"""
    """根据厂商行为，讲参数设置到对应地方。保证参数透传，黑名单，白名单"""
```

**请求生成器：**
```python
def _create_request_generator(self, text: str) -> Iterator[vendor_sdk.RequestFunction]:
    """为流式合成创建请求生成器"""
    # 第一个请求包含配置
    config_request = vendor_sdk.RequestFunction(
        streaming_config=self.streaming_config
    )
    yield config_request
    
    # 发送文本块
    text_chunks = [text]  # 可以优化为分割成更小的块
    
    for chunk in text_chunks:
        if chunk.strip():  # 只发送非空块
            yield vendor_sdk.RequestFunction(
                input=vendor_sdk.StreamingSynthesisInput(text=chunk)
            )
```

#### 3. 异步处理策略

**异步生成器实现：**
```python
async def get_streaming(self, text: str, request_id: str) -> AsyncIterator[tuple[bytes | None, int, int | None]]:
    """使用流式合成生成TTS音频"""
    
    if not self.client:
        error_msg = "Vendor TTS client not initialized"
        self.ten_env.log_error(error_msg)
        yield error_msg.encode("utf-8"), EVENT_TTS_ERROR
        return
    
    # 初始化流式配置
    if not self.streaming_config:
        self.streaming_config = self._create_streaming_config()
    
    # 重试配置
    max_retries = 3
    retry_delay = 1.0
    
    # 重试循环
    for attempt in range(max_retries):
        ttfb_ms = None
        try:
            start_ts = None
            if request_id != self.cur_request_id:
                start_ts = time.time()
                self.cur_request_id = request_id
            
            """发送请求"""
            """处理结果"""
            
            if audio_received:
                yield None, EVENT_TTS_REQUEST_END, ttfb_ms
                return  # 成功，退出重试循环
            else:
                error_msg = "No audio content received from Vendor TTS streaming"
                yield error_msg.encode("utf-8"), EVENT_TTS_ERROR, ttfb_ms
                return
        
        except Exception as e:
            """"error message"""
```

#### 4. 资源管理和清理

**客户端清理和重置：**
```python
def clean(self):
    """清理资源"""
    self.ten_env.log_info("VendorTTS: clean() called.")
    # 设置标志停止任何正在进行的流式处理
    self._should_stop_streaming = True
    if self.client:
        self.client = None
        self.ten_env.log_debug("Vendor TTS client cleaned")
    # 重置流式配置
    self.streaming_config = None

async def reset(self):
    """重置客户端"""
    self.ten_env.log_info("Resetting Vendor TTS client")
    self.client = None
    self.streaming_config = None
    # 为新请求重置停止标志
    self._should_stop_streaming = False
    self._initialize_client()
    self.ten_env.log_debug("Vendor TTS client reset completed")
```

### 最佳实践

1. **SDK版本管理**：使用稳定的SDK版本，避免频繁更新
2. **认证管理**：安全处理认证信息，支持多种认证方式
3. **配置映射**：将框架参数映射到SDK特定参数
4. **错误处理**：区分SDK错误和网络错误，采用不同处理策略
5. **资源管理**：及时清理SDK资源，避免内存泄漏
6. **重试策略**：实现智能重试机制，处理临时性错误
7. **性能优化**：使用流式处理，减少延迟
8. **兼容性**：确保SDK版本兼容性，处理API变更

## 5. ⚙️ 配置管理设计

### 配置类功能

`config.py`文件负责管理TTS Extension的所有配置参数，包括认证信息、API参数、调试设置等。配置类必须继承自`pydantic.BaseModel`，提供类型验证和序列化功能。

### 必须实现的功能

#### 1. 配置类结构

配置类需要包含以下基本字段：
- **认证信息**：`api_key`等认证相关参数
- **调试设置**：`dump`（是否启用PCM dump）、`dump_path`（PCM文件保存路径）
- **音频参数**：`sample_rate`（采样率）、`channels`（声道数）等
- **供应商特定参数**：`params`（字典类型，存储供应商特定的参数）
- **黑名单参数**：`black_list_keys`（从params中删除的键列表，如`["api_key"]`）

#### 2. update_params()方法

**功能**：从`params`字典中提取配置项并更新到配置类的属性中。

**需要实现**：
- 提取API密钥等认证信息到独立字段
- 处理音频设置（采样率、声道数等）
- 设置固定参数（如音频格式为"pcm"）
- 删除黑名单中的参数键

#### 3. to_str()方法（可选，但推荐实现）

**功能**：将配置对象转换为字符串，用于日志输出。

**需要实现**：
- 支持敏感信息处理模式（`sensitive_handling=True`时）
- 使用`utils.encrypt()`加密敏感字段（如`api_key`、`credentials`等）
- 返回配置的字符串表示

#### 4. validate()方法

**功能**：验证配置参数的有效性。

**需要实现**：
- 检查必需参数是否存在且非空（如`api_key`）
- 验证参数类型和范围（如采样率是否在支持的范围内）
- 验证参数格式（如环境变量格式`${env:VAR_NAME}`）
- 抛出清晰的错误信息，便于调试

#### 5. 参数验证器（可选，使用pydantic装饰器）

**功能**：使用pydantic的`@field_validator`装饰器验证字段值。

**示例场景**：
- 验证采样率是否在支持的范围（如`[8000, 16000, 22050, 24000, 44100, 48000]`）
- 验证声道数是否为1或2
- 验证其他参数的有效范围

### HTTP模式特殊要求

如果使用HTTP模式，配置类需要继承自`AsyncTTS2HttpConfig`，并实现以下抽象方法：
- `update_params()`：更新配置参数
- `to_str()`：转换为字符串
- `validate()`：验证配置

### 配置功能最佳实践

1. **类型安全**：使用pydantic的类型验证，确保参数类型正确
2. **必需参数检查**：在`validate()`方法中检查必需参数
3. **参数范围验证**：验证采样率、声道数等参数的有效范围
4. **敏感信息保护**：使用`to_str()`方法的安全模式处理敏感信息
5. **环境变量支持**：支持从环境变量读取配置（解析`${env:VAR_NAME}`格式）
6. **参数映射**：将通用参数映射到供应商特定参数
7. **默认值设置**：为所有参数提供合理的默认值
8. **错误信息清晰**：提供清晰的错误信息，便于调试

## 6. 🔧 核心功能实现

### 客户端类功能

`{vendor}_tts.py`文件是TTS Extension的核心实现文件，负责与供应商API的通信、音频数据处理和错误处理。根据不同的实现模式（WebSocket、HTTP、SDK），客户端类的设计会有所不同。

### 必须实现的功能

#### 1. 初始化方法

- **`__init__(config, ten_env, error_callback)`**：初始化客户端，接收配置对象、环境对象和错误回调函数
- **`_initialize_client()`**：初始化具体的客户端连接（WebSocket连接、HTTP客户端、SDK客户端等）

#### 2. 核心请求处理

**WebSocket/SDK模式：**
- **`async def get(text, request_id) -> AsyncIterator[tuple[bytes | None, int, int | None]]`**：处理TTS请求，返回异步迭代器，每次yield音频数据块、事件类型和TTFB时间（首次音频块时）
  - 返回值：`(audio_data, event_type, ttfb_ms)`
  - 事件类型：`EVENT_TTS_RESPONSE`（音频数据）、`EVENT_TTS_REQUEST_END`（请求结束）、`EVENT_TTS_ERROR`（错误）、`EVENT_TTS_INVALID_KEY_ERROR`（认证错误）

**HTTP模式：**
- **`async def get(text, request_id) -> AsyncIterator[Tuple[bytes | None, TTS2HttpResponseEventType]]`**：处理TTS请求，返回异步迭代器，使用`TTS2HttpResponseEventType`枚举
  - 返回值：`(audio_data, event_type)`
  - 事件类型：`TTS2HttpResponseEventType.RESPONSE`、`TTS2HttpResponseEventType.END`、`TTS2HttpResponseEventType.ERROR`、`TTS2HttpResponseEventType.INVALID_KEY_ERROR`、`TTS2HttpResponseEventType.FLUSH`

#### 3. 抽象方法（用于解耦厂商特定逻辑）

**WebSocket模式：**
- **`_get_websocket_uri() -> str`**：获取WebSocket连接URI
- **`_create_request_data(text) -> dict`**：创建请求数据格式
- **`_parse_response(data) -> tuple`**：解析响应数据，返回音频数据和事件类型
- **`_receive_responses() -> AsyncIterator`**：接收WebSocket响应流

**HTTP模式（继承`AsyncTTS2HttpClient`时）：**
- **`_get_api_endpoint() -> str`**：获取API端点URL
- **`_create_headers() -> dict`**：创建HTTP请求头（包含认证信息）
- **`_create_request_data(text) -> dict`**：创建HTTP请求体数据
- **`_is_authentication_error(error_message) -> bool`**：判断是否为认证错误

**SDK模式：**
- **`_parse_credentials()`**：解析认证信息（证书文件、服务账号等）
- **`_create_streaming_config()`**：创建流式配置对象
- **`_create_request_generator(text)`**：创建请求生成器（第一个请求包含配置，后续发送文本）
- **`_call_streaming_api(request_generator)`**：调用SDK的流式API
- **`_extract_audio_content(response)`**：从SDK响应中提取音频数据

#### 4. 资源管理方法

- **`async def stop()`**：停止客户端，关闭连接和清理资源
- **`def cancel()`**：取消当前请求，设置取消标志，清理队列和关闭连接
- **`async def clean()`**（HTTP模式）：清理HTTP客户端资源
- **`async def reset()`**（WebSocket/SDK模式，可选）：重置客户端连接

#### 5. 辅助方法

**HTTP模式：**
- **`def get_extra_metadata() -> dict[str, Any]`**：返回供应商特定的元数据（如voice_id、model_id），用于TTFB指标上报

**WebSocket/SDK模式（可选）：**
- **`async def start()`**：启动客户端连接（WebSocket单向流模式中，连接已在`__init__`中启动）
- **`_process_ws_exception(exception)`**：处理WebSocket异常
- **`_await_connection_tasks()`**：等待连接任务完成

### 事件类型定义

**基础事件类型（WebSocket/SDK模式）：**
- `EVENT_TTS_RESPONSE = 1`：音频数据响应
- `EVENT_TTS_REQUEST_END = 2`：请求结束
- `EVENT_TTS_ERROR = 3`：一般错误
- `EVENT_TTS_INVALID_KEY_ERROR = 4`：认证错误
- `EVENT_TTS_FLUSH = 5`：刷新请求

**WebSocket特定事件（可选）：**
- `EVENT_TTSSentenceStart = 350`：句子开始
- `EVENT_TTSSentenceEnd = 351`：句子结束
- `EVENT_TTSTaskFinished = 353`：任务完成
- `EVENT_TTS_TTFB_METRIC = 355`：TTFB指标

**HTTP模式事件类型：**
- 使用`TTS2HttpResponseEventType`枚举：`RESPONSE`、`END`、`ERROR`、`INVALID_KEY_ERROR`、`FLUSH`

### 不同模式的特殊要求

#### WebSocket模式
- 通过WebSocket发送请求，接收流式音频响应
- 需要实现文本发送队列管理
- 需要实现自动重连机制

#### HTTP模式
- 客户端类需要实现`AsyncTTS2HttpClient`接口
- 必须实现`get()`、`clean()`、`cancel()`、`get_extra_metadata()`方法
- 使用抽象方法分离厂商特定逻辑

#### SDK模式
- 封装供应商官方SDK
- 实现流式合成配置和请求生成器
- 处理SDK特定的错误和异常

### 客户端设计最佳实践

1. **状态管理**：使用清晰的状态标志管理连接和请求状态
2. **事件驱动**：使用事件系统解耦不同组件
3. **错误分类**：区分不同类型的错误，采用不同的处理策略
4. **资源清理**：及时清理资源，避免内存泄漏
5. **重试机制**：实现智能重试，处理临时性错误
6. **超时控制**：设置合理的超时时间
7. **日志记录**：记录关键操作和错误信息
8. **异步处理**：使用异步编程提高性能


## 7. 🧪 单元测试

### 测试文件结构

TTS Extension的测试目录应包含完整的测试套件，确保代码质量和功能正确性。

```
tests/
├── __init__.py                    # 测试包初始化
├── conftest.py                   # pytest配置和fixtures
├── test_basic.py                 # 基础功能测试
├── test_error_msg.py             # 错误处理测试，主要检测出现错误时error message的生成
├── test_params.py                # 参数配置测试，主要检测配置参数的检查功能
├── test_robustness.py            # 健壮性测试，主要检测对于异常情况的处理
├── test_metrics.py               # 指标测试
└── configs/                      # 测试配置文件
    ├── test_config.json          # 测试配置
    ├── invalid_config.json       # 无效配置测试
    └── mock_config.json          # Mock测试配置
```

### 测试最佳实践

1. **测试覆盖**：确保所有主要功能都有测试覆盖
2. **Mock使用**：合理使用Mock避免依赖外部服务
3. **异步测试**：正确处理异步测试和等待
4. **资源清理**：确保测试后正确清理资源
5. **错误场景**：测试各种错误和异常情况
6. **边界测试**：测试边界条件和极限情况
7. **并发测试**：测试并发请求处理能力
8. **配置测试**：测试各种配置参数组合


## 8. 🔗 集成测试（Guarder）

### 环境变量配置

创建 `.env` 文件配置真实 API 密钥：

```bash title=".env"
# TTS Vendor Services API Key
VENDOR_TTS_API_KEY=your_api_key_here
# 例如：
ELEVENLABS_TTS_API_KEY=your_elevenlabs_api_key
```

### 测试配置

在 `tests/configs/` 目录下创建以下测试配置文件，Guarder 测试会使用这些配置：

#### 1. 基础音频设置配置

**`property_basic_audio_setting1.json`** - 用于基础音频设置测试、边界输入测试、指标测试、无效文本处理测试：

```json title="tests/configs/property_basic_audio_setting1.json"
{
  "dump": true,
  "dump_path": "./tests/keep_dump_output/",
  "params": {
    "output_format": "pcm_44100",
    "key": "${env:VENDOR_TTS_API_KEY}"
  }
}
```

**`property_basic_audio_setting2.json`** - 用于基础音频设置测试（对比不同的采样率配置）：

```json title="tests/configs/property_basic_audio_setting2.json"
{
  "dump": true,
  "dump_path": "./tests/keep_dump_output/",
  "params": {
    "output_format": "pcm_44100",
    "key": "${env:VENDOR_TTS_API_KEY}"
  }
}
```

**注意**：根据你的 TTS 服务商，可能需要调整参数名称（如 `key`、`api_key`、`sample_rate`、`output_format` 等）。

#### 2. Dump 功能测试配置

**`property_dump.json`** - 用于 dump 功能测试、flush 测试、按请求ID导出测试：

```json title="tests/configs/property_dump.json"
{
  "dump": true,
  "dump_path": "./tests/dump_output/",
  "params": {
    "key": "${env:VENDOR_TTS_API_KEY}"
  }
}
```

#### 3. 错误处理测试配置

**`property_invalid.json`** - 用于无效必需参数测试（测试无效的 API Key）：

```json title="tests/configs/property_invalid.json"
{
  "params": {
    "key": "invalid"
  }
}
```

**`property_miss_required.json`** - 用于缺少必需参数测试（测试缺少 API Key）：

```json title="tests/configs/property_miss_required.json"
{
  "params": {
    "key": ""
  }
}
```

#### 4. 完整配置示例（可选）

**`property_bechmarl.json`** - 完整配置示例，包含多个参数，可用于基准测试：

```json title="tests/configs/property_bechmarl.json"
{
  "dump": true,
  "dump_path": "./tests/keep_dump_output/",
  "params": {
    "output_format": "pcm_44100",
    "language": "en",
    "voice_id": "your_voice_id",
    "model_id": "your_model_id",
    "key": "${env:VENDOR_TTS_API_KEY}"
  }
}
```

### 配置文件说明

**关键配置项**：

- **`params.key`** 或 **`params.api_key`**：TTS 服务商的 API Key，使用 `${env:VENDOR_TTS_API_KEY}` 从环境变量读取
- **`dump`**：是否启用音频 dump 功能（`true` 或 `false`）
- **`dump_path`**：音频 dump 文件的保存路径
- **`params.sample_rate`** 或 **`params.output_format`**：音频采样率配置，根据服务商不同而不同

**环境变量支持**：

配置文件中可以使用 `${env:VARIABLE_NAME}` 格式从环境变量读取值，这样可以在不修改配置文件的情况下切换不同的 API Key。

### 运行 Guarder 测试

使用真实 API 密钥运行完整集成测试：

```bash title="Terminal"
cd ai_agents
task tts-guarder-test EXTENSION=your_extension_name CONFIG_DIR=tests/configs
```

## 9. 🌐 端到端测试

完成开发后，可以使用 TMan Designer 快速替换 TEN Agent 对话图中的 TTS 扩展，验证在实际对话场景下的效果。

### 使用 TMan Designer 替换 TTS 扩展

```bash title="Terminal"
# 在 TEN Agent 项目目录下启动
cd /path/to/your/ten-agent-project
tman designer
```

TMan Designer 会打开可视化界面，你可以：

1. **选择 TTS 节点**: 点击现有的 TTS 扩展积木
2. **替换为你的扩展**: 选择 `my_tts_extension`
3. **配置参数**: 设置 API Key、语音ID等参数
4. **一键应用**: 完成替换并启动测试

替换完成后，通过真实对话验证扩展的音频质量、响应速度和稳定性。

## 10. 📊 最佳实践

### 配置管理

- ✅ 使用 `params` 字典统一管理供应商参数
- ✅ 通过 `@property` 方法提供类型安全的参数访问
- ✅ 提供合理的默认值

### 错误处理

- ✅ 实现指数退避重连机制
- ✅ 正确处理网络异常和 API 错误
- ✅ 提供详细的错误日志和状态上报
- ✅ 优雅处理连接中断和恢复

### 性能优化

- ✅ 异步处理文本流，避免阻塞
- ✅ 实现音频缓存和批量发送
- ✅ 合理管理 WebSocket 连接生命周期
- ✅ 监控和报告关键性能指标

### 日志打印

- ✅ 使用 `ten_env.log_debug/info/warn/error` API 打印日志
- ✅ 通过指定 `category` 让日志更加清晰
- ✅ 对敏感信息（如 API Key）进行脱敏处理
- ✅ 在关键节点记录状态变化和错误信息

#### 日志分类说明

- **KEY_POINT**: 关键节点日志，用于记录重要的配置和状态信息
- **VENDOR**: 供应商相关日志，包括连接状态、结果处理、错误信息
- **默认分类**: 业务逻辑相关的一般日志

### 错误上报

除了日志记录，还需要通过 `self.send_tts_error` API 进行结构化的错误上报

#### 错误分类策略

**🔥 致命错误 (FATAL_ERROR)**
- 配置解析失败
- 无效的API密钥
- 无法建立初始连接
- 扩展无法继续工作的情况

**⚠️ 非致命错误 (NON_FATAL_ERROR)** 
- 临时的网络连接问题
- 供应商服务暂时不可用
- 音频处理错误
- 可通过重试恢复的错误

#### 供应商信息 (VendorInfo)

对于供应商返回的错误，应包含详细的供应商信息：

```python
ModuleErrorVendorInfo(
    vendor="elevenlabs",           # 供应商名称
    code="400",                    # 供应商错误码
    message="Invalid API key",     # 供应商错误消息
)
```

这样可以帮助运维团队快速定位问题来源，区分是扩展问题还是供应商服务问题。

### 调试支持

- ✅ 提供音频 Dump 功能用于问题排查
- ✅ 记录详细的事件和状态变化日志
- ✅ 支持不同日志级别和分类
- ✅ 提供性能和质量指标

## 11. 🌟 扩展和贡献

### 适配其他 TTS 服务

基于本教程的框架，你可以参考 TEN Framework 仓库下的其他成品 TTS 扩展：

1. **ElevenLabs TTS**: 参考 `elevenlabs_tts2_python` 扩展的实现
2. **Azure Cognitive Services**: 参考 `azure_tts_python` 扩展的实现  
3. **Google Cloud TTS**: 参考 `google_tts_python` 扩展的实现
4. **其他供应商**: 在 `ai_agents/agents/ten_packages/extension/` 目录下查看更多TTS扩展实现

这些成品扩展都遵循相同的架构模式，可以作为适配新TTS服务的参考模板。

### 贡献到社区

完成开发后，欢迎将你的 TTS 扩展贡献给 TEN Agent 社区：

1. **代码规范**: 遵循项目的代码风格和命名约定
2. **测试覆盖**: 确保单元测试和集成测试通过
3. **文档完善**: 提供清晰的 README 和配置说明
4. **性能验证**: 通过 Guarder 测试验证生产可用性

## 提Pull Request前检查清单

在提交Pull Request之前，请确保已完成以下所有检查项：

### 1. 功能实现 ✅

**要求**：完成所有核心功能的实现

**检查项**：
- [ ] 实现`request_tts()`方法，能够正确处理文本输入并生成音频
- [ ] 实现`vendor()`方法，返回正确的供应商名称
- [ ] 实现`synthesize_audio_sample_rate()`方法，返回正确的采样率
- [ ] 如果使用HTTP模式，实现`create_config()`和`create_client()`方法
- [ ] 如果使用HTTP模式，实现配置类和客户端类的所有必需方法
- [ ] 正确实现错误处理，区分`FATAL_ERROR`和`NON_FATAL_ERROR`
- [ ] 正确处理flush请求，实现`cancel_tts()`方法
- [ ] 正确发送`tts_audio_start`和`tts_audio_end`事件
- [ ] 正确计算和上报TTFB指标
- [ ] 正确计算和上报音频时长
- [ ] 正确发送metrics数据

### 2. 单元测试（UT）✅

**要求**：完成所有单元测试，确保代码质量

**检查项**：
- [ ] 所有单元测试通过
- [ ] 测试所有主要功能路径
- [ ] 测试错误处理逻辑
- [ ] 测试边界条件
- [ ] 测试参数验证逻辑
- [ ] 测试配置加载和验证

**运行命令**：
```bash
# 方式1：使用task命令（推荐）
# 在项目根目录（ten-framework/ai_agents）下运行
task test-extension EXTENSION=agents/ten_packages/extension/your_extension_name

# 方式2：手动运行
cd agents/ten_packages/extension/your_extension_name
tman -y install --standalone
./tests/bin/start

# 方式3：运行所有Extension的测试
task test-agent-extensions
```

**注意**：
- 确保在项目根目录（`ten-framework/ai_agents`）下运行task命令
- 如果Extension没有安装依赖，task命令会自动安装
- 测试配置文件应在`tests/configs/`目录下


### 3. Ten Agent自测 ✅

**要求**：在Ten Agent中完成自测，确保Extension能够正常工作

**检查项**：
- [ ] 在Ten Agent中成功加载Extension
- [ ] 能够听到Agent声音
- [ ] 能够正常多轮对话
- [ ] 能够正常打断对话



### 4. Guarder集成测试 ✅

**要求**：通过所有Guarder集成测试，并将测试结果贴在PR评论中

**测试位置**：`ten-framework/ai_agents/agents/integration_tests/tts_guarder`

**运行命令**：
```bash
# 方式1：使用task命令（推荐）
# 在项目根目录（ten-framework/ai_agents）下运行
task tts-guarder-test EXTENSION=your_extension_name CONFIG_DIR=tests/configs

# 方式2：手动运行
cd agents/integration_tests/tts_guarder
./scripts/install_deps_and_build.sh linux x64
./tests/bin/start --extension_name your_extension_name --config_dir agents/ten_packages/extension/your_extension_name/tests/configs

# 运行单个测试文件
./tests/bin/start --extension_name your_extension_name --config_dir agents/ten_packages/extension/your_extension_name/tests/configs tests/test_basic_audio_setting.py
```

**环境变量设置**：
```bash
# 在项目根目录创建.env文件，或设置环境变量
# 根据实际供应商设置API Key
export VENDOR_TTS_API_KEY=your_api_key_here
# 例如：
export ELEVENLABS_TTS_API_KEY=your_elevenlabs_api_key
# 或在.env文件中：
# ELEVENLABS_TTS_API_KEY=your_elevenlabs_api_key
```

**注意**：
- 确保在项目根目录（`ten-framework/ai_agents`）下运行task命令
- 测试配置文件应在Extension目录下的`tests/configs/`目录中
- 如果使用task命令，会自动从`.env`文件读取环境变量
- 确保Extension已正确安装依赖

**测试结果要求**：
- [ ] 所有Guarder测试通过
- [ ] 在PR评论中粘贴guarder 测试结果
- [ ] 如有测试失败，说明原因并提供解决方案


### Guarder测试点说明

Guarder集成测试包含以下测试点，确保Extension符合TEN Framework的标准：

#### 1. **基础音频设置测试** (`test_basic_audio_setting.py`)

**测试目标**：验证Extension能够根据配置正确设置音频参数

**测试点**：
- 验证不同配置文件的采样率设置是否正确
- 验证Extension能够正确读取和响应不同的采样率配置
- 验证音频帧的采样率与实际配置一致

**预期结果**：
- 不同配置文件产生不同的采样率输出
- 所有音频帧的采样率保持一致
- 没有错误或异常

#### 2. **边界输入测试** (`test_corner_input.py`)

**测试目标**：验证Extension对边界输入的处理

**测试点**：
- 验证Extension能够处理边界输入
- 验证Extension能够正确上报metrics数据
- 验证metrics在`tts_audio_end`之前上报

**预期结果**：
- Extension能够处理边界输入并生成音频
- 能够接收到metrics数据
- metrics在`tts_audio_end`之前发送

#### 3. **PCM Dump功能测试** (`test_dump.py`)

**测试目标**：验证PCM音频文件导出功能

**测试点**：
- 验证启用dump功能时，能够生成PCM文件
- 验证PCM文件保存在指定路径
- 验证PCM文件不为空

**预期结果**：
- 当`dump=true`时，在`dump_path`目录下生成PCM文件
- PCM文件包含音频数据
- 文件命名符合规范

#### 4. **按请求ID导出测试** (`test_dump_each_request_id.py`)

**测试目标**：验证每个请求ID都能生成独立的dump文件

**测试点**：
- 验证多个请求能够生成多个独立的dump文件
- 验证每个请求ID对应一个dump文件
- 验证dump文件数量正确

**预期结果**：
- 发送N个请求，生成N个dump文件
- 每个dump文件对应一个request_id
- 文件命名包含request_id信息

#### 5. **Flush功能测试** (`test_flush.py`)

**测试目标**：验证flush请求的处理

**测试点**：
- 验证收到flush请求时，能够正确中断当前请求
- 验证flush时发送的`tts_audio_end`事件，`reason`应为`2`（INTERRUPTED）
- 验证flush完成后发送`tts_flush_end`事件
- 验证事件顺序：`tts_audio_end`在`tts_flush_end`之前

**预期结果**：
- 收到flush请求后，能够中断当前TTS合成
- 发送`tts_audio_end`事件，`reason=2`（INTERRUPTED）
- 发送`tts_flush_end`事件
- 事件顺序正确

#### 6. **指标上报测试** (`test_metrics.py`)

**测试目标**：验证指标数据的正确上报

**测试点**：
- 验证Extension能够上报metrics数据
- 验证metrics在`tts_audio_end`之前发送
- 验证metrics包含必需字段（module、vendor、metrics等）

**预期结果**：
- 能够接收到metrics数据
- metrics在`tts_audio_end`之前发送
- metrics数据格式正确，包含必需字段

#### 7. **无效必需参数测试** (`test_invalid_required_params.py`)

**测试目标**：验证对无效必需参数的错误处理

**测试点**：
- 验证当配置参数无效时（如API key格式错误），能够正确返回错误
- 验证错误代码为`FATAL_ERROR`（-1000）
- 验证错误消息清晰，便于用户定位问题

**预期结果**：
- Extension能够检测到无效的必需参数
- 返回错误，错误代码为`-1000`（FATAL_ERROR）
- 错误消息包含问题描述

#### 8. **无效文本处理测试** (`test_invalid_text_handling.py`)

**测试目标**：验证Extension对无效文本的处理能力

**测试点**：
- 验证当文本无效时（如空字符串、纯标点、纯空格等），能够正确处理
- 验证返回错误代码为`NON_FATAL_ERROR`（1000）
- 验证错误包含`vendor_info`字段
- 验证在错误后，发送有效文本能够正常工作

**测试的无效文本类型**：
- 空字符串
- 纯空格、制表符、换行符
- 纯标点符号（中英文）
- 表情符号和特殊字符
- 数学公式、化学方程式
- 混合无效字符

**预期结果**：
- 无效文本返回错误，错误代码为`1000`（NON_FATAL_ERROR）
- 错误包含`vendor_info`，包含供应商名称、错误代码和消息
- 错误后，发送有效文本能够正常生成音频

#### 9. **缺少必需参数测试** (`test_miss_required_params.py`)

**测试目标**：验证对缺少必需参数的错误处理

**测试点**：
- 验证当缺少必需参数时（如缺少API key），能够正确返回错误
- 验证错误代码为`FATAL_ERROR`（-1000）
- 验证错误消息提示缺少的参数

**预期结果**：
- Extension能够检测到缺少的必需参数
- 返回错误，错误代码为`-1000`（FATAL_ERROR）
- 错误消息明确提示缺少的参数

### 测试注意事项

1. **环境准备**：确保设置正确的环境变量（API key等）
2. **配置准备**：确保测试配置文件正确，包含有效的API凭证
3. **网络连接**：确保能够访问TTS供应商的API服务
4. **测试隔离**：每次测试运行前清理dump目录，确保测试结果准确
5. **错误分析**：如果测试失败，仔细查看日志输出，定位问题原因
6. **测试顺序**：某些测试可能有依赖关系，建议按顺序运行
7. **资源清理**：测试完成后清理临时文件和资源

### PR提交检查清单总结

在提交PR之前，请确认以下所有项目已完成：

- [ ] **功能实现**：所有核心功能已实现并通过自测
- [ ] **单元测试**：所有UT通过，覆盖率达标
- [ ] **Ten Agent自测**：在Ten Agent中验证功能正常
- [ ] **Guarder测试**：所有Guarder测试通过
- [ ] **测试结果**：在PR评论中粘贴Guarder测试结果
- [ ] **代码审查**：代码已自检，符合编码规范
- [ ] **提交信息**：PR描述清晰，包含变更说明和测试结果

## 📚 总结

恭喜你完成了 TTS 扩展开发的完整学习之旅！

### 🎯 掌握的核心技能

- ✅ **项目搭建**: 使用 TTS 模板快速创建项目骨架
- ✅ **架构设计**: 深入理解 TTS Extension 接口规范和基类功能
- ✅ **功能开发**: 实现请求处理、音频处理、事件处理等核心功能
- ✅ **高级特性**: 集成重连机制、音频调试、指标上报等高级特性
- ✅ **质量保证**: 编写单元测试、集成测试、端到端测试的完整覆盖
- ✅ **生产就绪**: 掌握日志记录、错误处理、性能优化等最佳实践

### 🚀 下一步行动

现在你可以：

1. **实践应用**: 选择你熟悉的 TTS 服务商，创建自己的扩展
2. **深入学习**: 研究其他 TEN 扩展类型（ASR、LLM等）的实现模式  
3. **贡献社区**: 提交 PR 到 TEN Framework，分享你的成果
4. **生态建设**: 发布到 TEN Store，让更多开发者受益

<Callout type="success">
  **开发愉快！** 如果在开发过程中遇到问题，欢迎在 [TEN Framework GitHub](https://github.com/TEN-framework/TEN-Agent) 上提 Issue 或参与讨论。
</Callout>

<Callout title="下一步">
  推荐阅读 [ASR 扩展开发指南] 和 [LLM 扩展开发指南]，掌握完整的 AI Agent 扩展开发技能。
</Callout>