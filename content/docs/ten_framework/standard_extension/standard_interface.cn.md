---
title: 标准接口
---

在 TEN 框架中, 我们鼓励用户开发自己的 extensions 并将其发布到 TEN 扩展市场, 供其他用户使用. 为了便于其他用户选择和替换 extension, 我们需要定义标准化的接口规范, 让用户能够根据这些标准接口轻松找到符合需求的 extension.

总结来说, 标准接口是一种语法糖, 让 TEN 工具 (例如 TEN manager) 可以更方便的协助开发者进行例如 extension 的选择和替换.

TEN 的接口定义更像是 TypeScript 的 `.d.ts` 文件, 让 TypeScript 编译器可以进行类型检查, 但在实际运行的过程中, 这些接口定义并不会被使用. 因此标准接口的设计所导致的功能及代码新增, 主要是在 TEN manager 这种开发时期的工具上, 而不是运行态的 TEN runtime 上. 例如 TEN manager 需要提供相关的 restful API 给 TEN designer frontend 用来根据标准接口定义来透过 UI 进行例如 extension 的选择跟替换.

## 什么是标准接口

在 TEN 框架中, 每个 extension 的接口都包含以下几个核心组成部分:

1. **Properties (属性)** - 扩展的配置参数
2. **Command (命令)**
   - Input command - 输入命令
   - Output command - 输出命令
3. **Data (数据)**
   - Input data - 输入数据
   - Output data - 输出数据
4. **Audio frame (音频帧)**
   - Input audio frame - 输入音频帧
   - Output audio frame - 输出音频帧
5. **Video frame (视频帧)**
   - Input video frame - 输入视频帧
   - Output video frame - 输出视频帧

### 标准接口的意义跟用途

标准接口就是将这些组成部分进行规范化定义, 形成固定的接口标准. 开发者可以参考这些接口标准来实现自己的 extensions, 同时 extension 也可以声明自己支持特定的标准接口, 这样开发工具可以根据 extension 声明的标准接口提供更好的开发支持, 使得用户能够根据标准接口来选择或替换所需的 extension.

在标准接口中的 Command/Data/Audio frame/Video frame 用来规范 extension 之间的交互, 用来实现 extension 的互换性和兼容性. 儿在标准接口中的 Properties 则用来规范 extension 的配置参数, 用来实现跟 tman designer 的配置兼容性.

这边值得注意一点的是, 规范 extension 之间的交互并不是 interface 的功能, 这是 Command/Data/Audio frame/Video frame 的功能. Interface 只是一个用来完成聚集目的的语法糖, 用来让开发者快速的指定 extension 的接口定义.

### 接口的检查与报错

一个 extension 的 Command/Data/Audio frame/Video frame 的定义中, 如果有两个同名的 message, 且它们的 schema 定义一样, 那不算错误, 但会被视为重复定义, 会被忽略. 这个在标准接口中也是一样的, 用来让不同的标准接口可以将共性的功能都自行定义, 形成一个自包含的标准接口定义, 且当一个 extension 实现这些具有相同定义的标准接口时, 不至于因此儿产生错误.

由于 TEN framework 是一种运行跟开发分离的框架 (类似于 JavaScript 跟 TypeScript 的 .d.ts 文件的关系), 因此标准接口的检查与报错主要是在开发时期的工具上, 而不是运行态的 TEN runtime 上. 因此在 TEN runtime 在 start graph 的时候, 不会因为接口的错误而报错.

儿在 tman designer 这个开发工具上, 如果一个 extension 的接口定义不完整, 可以显示一些功能暂时无法使用在该 extension 上的提示, 例如用某个 extension 取代另一个 extension 的功能上, 在接口定义不完整的情况下, 需要显示这个功能暂时无法使用在这个 extension 上, 须等待接口定义完整了, 方能使用.

另外, 由于接口定义可以是一个被引用进来的独立文件, 因此在 tman publish/install 的时候, 如果接口定义不完整则不算错误.

## 标准接口的实现方式

TEN extension 支持的 API 定义在其 `manifest.json` 文件中. 标准接口的实现就是将定义好的 API 规范写入独立的 JSON 文件, 然后在 `manifest.json` 中引用这个文件.

```json
{
  "type": "extension",
  "name": "foo_extension",
  "version": "0.1.0",
  "dependencies": [
    {
      "type": "system",
      "name": "ten_runtime",
      "version": "0.1"
    }
  ],
  "api": {
    "interface": [
      {
        "import_uri": "https://xxx/asr_interface.json"  // <= 引用标准接口定义文件
      },
      {
        "import_uri": "https://xxx/tts_interface.json"  // <= 引用标准接口定义文件
      }
    ],
    "property": {
      "bar": {
        "type": "string"
      }
    },
    "cmd_in": [
      {
        "name": "query_vector",
        "property": {
          "collection_name": {
            "type": "string"
          },
          "top_k": {
            "type": "int64"
          },
          "embedding": {
            "type": "array",
            "items": {
              "type": "float64"
            }
          }
        },
        "required": [
          "collection_name",
          "top_k",
          "embedding"
        ],
        "result": {
          "property": {
            "response": {
              "type": "array",
              "items": {
                "type": "object",
                "properties": {
                  "content": {
                    "type": "string"
                  },
                  "score": {
                    "type": "float64"
                  }
                }
              }
            }
          }
        }
      }
    ],
    "cmd_out": [
      {
        "name": "publish",
        "property": {
          "message": {
            "type": "buf"
          }
        }
      },
      {
        "name": "set_presence_state"
      }
    ],
    "data_in": [
      {
        "name": "data"
      }
    ]
  }
}
```

### 标准接口定义文件示例

当 TEN 系统 (包括 TEN runtime, TEN manager 等) 解析 `manifest.json` 时, 会根据 `import_uri` 下载对应的 JSON 文件, 并将其内容合并到 `manifest.json` 中. 被引用的标准接口文件内容示例如下, 可以看到就跟 manifest.json 内的 `api` 字段内容一样, 只是被独立成一个文件, 方便引用. 并且这个独立的标准接口文件, 里面也可以再引用其他的标准接口文件.

```json
{
  "interface": [
    {
      "import_uri": "https://xxx/stt_interface.json"// <= 引用其他的标准接口定义文件
    }
  ],
  "property": {
    "bar": {
      "type": "string"
    }
  },
  "cmd_in": [
    {
      "name": "query_vector",
      "property": {
        "collection_name": {
          "type": "string"
        },
        "top_k": {
          "type": "int64"
        },
        "embedding": {
          "type": "array",
          "items": {
            "type": "float64"
          }
        }
      },
      "required": [
        "collection_name",
        "top_k",
        "embedding"
      ],
      "result": {
        "property": {
          "response": {
            "type": "array",
            "items": {
              "type": "object",
              "properties": {
                "content": {
                  "type": "string"
                },
                "score": {
                  "type": "float64"
                }
              }
            }
          }
        }
      }
    }
  ],
  "cmd_out": [
    {
      "name": "publish",
      "property": {
        "message": {
          "type": "buf"
        }
      }
    },
    {
      "name": "set_presence_state"
    }
  ],
  "data_in": [
    {
      "name": "data"
    }
  ]
}
```

### 接口合并规则

系统会将 `import_uri` 指向的 JSON 文件内容合并到 `manifest.json` 的 `api` 字段中, 具体包括:

- `property`
- `cmd_in`, `cmd_out`
- `data_in`, `data_out`
- `audio_frame_in`, `audio_frame_out`
- `video_frame_in`, `video_frame_out`

**重要规则:**

1. **冲突检测**: 如果合并过程中发现同名的同类字段 (比如同名的 `cmd_in` 或同名的 `property`), 如果 schema 一样不算错, 否则系统会报错.
2. **递归合并**: 合并过程是递归进行的, 如果检测到循环引用, 系统会报错.
3. **多接口支持**: 一个 extension 可以支持多个标准接口, 在 `manifest.json` 中定义多个 `interface` 字段即可.
4. **重复引用检测**: 如果不同的 `interface` 字段引用了相同的 `import_uri`, 系统会报错.

## 标准接口的存储方式

标准接口文件支持以下几种存储方式:

### 1. TEN System Package

这种方式是将标准接口定义文件打包成 TEN system package, 然后在 `manifest.json` 中引用. 并且同时也可以在 manifest.json 的 dependencies 字段内依赖这个系统包, 使得可以在安装这个 extension 的时候就一并的安装所依赖的标准接口系统包, 达到最佳的开发体验. 借由这个方法, 可以利用 TEN package 的版本机制来实现标准接口的版本管理, 并且可以利用 TEN package 的依赖机制来实现标准接口的自动安装.

使用 TEN system package, 除了标准接口的 json 定义文件外, 还可以包含相关的资源, 例如模型文件, 公共工具函数库, 配套工具等. 因此在所有这些资源如果有不相容的变更的时候, 都可以借由 TEN system package 的版本号变更来更好的呈现这样的事实. 例如系统包内的 json file 的摆放位置或者文件名称的不同, 也算是该系统包的 breaking changes, 所以应该要升级该系统包的大阪号.

```json
{
  "dependencies": [
    {
      "type": "system",
      "name": "foo_interface",
      "version": "0.1.0"
    }
  ],
  "api": {
    "interface": [
      {
        "import_uri": "../../../ten_packages/system/foo_interface/interface.json"
      }
    ]
  }
}
```

**使用 TEN System Package 的优势:**

1. **易于分发**: System package 可以上传到 TEN 扩展市场, 用户可以直接下载使用
2. **资源丰富**: Package 中不仅包含接口定义文件, 还可以包含相关资源, 如:
   - 模型文件
   - 公共工具函数库
   - 配套工具等
3. **依赖管理**: System package 可以作为 extension 的依赖项, 当 extension 被下载时, 相关的 system package 也会自动下载
4. 版本管理也不限于标准接口协议本身, 任何该系统包内的资源都算是该系统包的版本管理的一部分.

#### 支持多版本共存

> **注意**: 这一节所描述的功能, 基本上不会实现, 只是描述如果之后要做的话, 可能的实现方法以及需要考虑的点.

在某些场景下, 一个 TEN App 可能需要同时使用同一标准接口的不同版本. 为了支持这种需求, TEN 允许在同一个 App 内安装同一个 system package 的多个版本.

**System Package 配置:**

首先, 在 system package 的 `manifest.json` 中声明支持多版本共存:

```json
{
  "type": "system",
  "name": "foo_interface",
  "version": "0.1.0",
  "install_policy": {
    "coinstallable": "true"
  }
}
```

**Extension 依赖配置:**

在依赖该 system package 的 extension 的 `manifest.json` 中, 也需要声明使用多版本共存:

```json
{
  "dependencies": [
    {
      "type": "system",
      "name": "foo_interface",
      "version": "=0.1.0", // 注意: 这边只能是 equal 的语法, 不能用 >= 之类的语法
      "install_policy": {
        "coinstallable": "true"
      }
    }
  ],
}
```

并且在整个依赖树的构件过程中, 如果一个系统包的 coinstallable 为 true, 则需要全部依赖该系统包的的地方都声明是 coinstallable, 不然系统会报错.

**文件系统路径:**

启用多版本共存后, system package 在文件系统中的路径会变为:

```text
ten_packages/system/<hash_value>_foo_extension_0_1_0/
```

> **注意**: 未来可能会引入映射机制, 让用户在使用时不需要明确指定 hash_value, 而是通过某种映射机制自动找到对应的 system package. 但这种机制如果要好用, 还需要修改 TEN 所支援的语言中的模块载入机制, 使得开发者可以不用在该语言中的模块载入机制中指定 hash_value, 而是通过某种映射机制自动找到对应的 system package. 这种深入语言内的改动也是这种单包多版本共存的机制基本上不会被实现的原因之一.
> **注意**: 如果真的需要在一个 TEN app 内使用多个版本的一个标准接口, 可以使用下述的几种方式来实现. 如果一个标准接口有搭配的公用资源, 例如模型文件, 公共工具函数库, 配套工具等, 则它们这些资源很多没办法作到在一个 TEN app 内的多版本共存, 这也是这种单包多版本共存的机制基本上不会被实现的原因之一.

### 2. 网络地址

将标准接口定义文件部署到网络服务器上, 通过 HTTP/HTTPS 地址引用:

```json
{
  "interface": [
    {
      "import_uri": "http://xxx/asr_1.0_interface/interface.json"
    }
  ]
}
```

> **注意**: tman 在处理这种引用方式时, 可以下载到自己的 cache, 然后透过某种 mapping 机制, 让 tman 可以找到定义.

**适用场景:**

- 没有配套的公共资源的接口定义
- 需要在一个 `manifest.json` 中引用同一标准接口的不同版本

### 3. 本地路径

引用本地文件系统中的标准接口定义文件:

绝对路径:

```json
{
  "interface": [
    {
      "import_uri": "file://c:/asr_1.0_interface/interface.json"
    }
  ]
}
```

相对路径:

```json
{
  "interface": [
    {
      "import_uri": "../asr_1.0_interface/interface.json"
    }
  ]
}
```

**适用场景:**

与网络地址方式类似:

- 适合没有配套的公共资源的接口定义
- 需要在一个 `manifest.json` 中引用同一标准接口的不同版本
