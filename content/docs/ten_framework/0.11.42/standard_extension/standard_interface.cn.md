---
title: 标准接口
---

在 TEN framework 中，我们鼓励开发者创建自己的扩展（Extension）并将其发布到 TEN 扩展市场，供其他开发者使用。为了让开发者能够轻松地选择和替换扩展，我们需要定义标准化的接口规范，这样开发者就可以根据这些标准接口快速找到符合需求的扩展。

简而言之，标准接口是一种语法糖，它让 TEN 工具（如 TEN Manager）能够更方便地协助开发者进行扩展的选择和替换等操作。

TEN 的接口定义类似于 TypeScript 的 `.d.ts` 文件，让 TypeScript 编译器能够进行类型检查，但在实际运行时，这些接口定义并不会被使用。因此，标准接口设计带来的功能和代码增强，主要体现在 TEN Manager 这类开发工具上，而不是运行时的 TEN Runtime 上。例如，TEN Manager 需要提供相关的 RESTful API 给 tman designer Frontend，让用户可以根据标准接口定义，通过 UI 界面进行扩展的选择和替换。

## 什么是标准接口

在 TEN framework 中，每个扩展的接口都包含以下几个核心组成部分：

1. **Properties（属性）** - 扩展的配置参数
2. **Command（命令）**
   - **Input command** - 输入命令
   - **Output command** - 输出命令
3. **Data（数据）**
   - **Input data** - 输入数据
   - **Output data** - 输出数据
4. **Audio frame（音频帧）**
   - **Input audio frame** - 输入音频帧
   - **Output audio frame** - 输出音频帧
5. **Video frame（视频帧）**
   - **Input video frame** - 输入视频帧
   - **Output video frame** - 输出视频帧

### 标准接口的意义和用途

标准接口就是将这些组成部分进行规范化定义，形成统一的接口标准。开发者可以参考这些接口标准来实现自己的扩展，同时扩展也可以声明自己支持特定的标准接口，这样开发工具就能够根据扩展声明的标准接口提供更好的开发支持，使用户能够根据标准接口来选择或替换所需的扩展。

在标准接口中，Command/Data/Audio frame/Video frame 用于规范扩展之间的交互，实现扩展的互换性和兼容性。而 Properties 则用于规范扩展的配置参数，实现与 tman designer 的配置兼容性。

需要注意的是，规范扩展之间的交互并不是接口本身的功能，这是 Command/Data/Audio frame/Video frame 的功能。接口只是一个用于聚合的语法糖，帮助开发者快速指定扩展的接口定义。

### 接口的检查与报错

在扩展的 Command/Data/Audio frame/Video frame 定义中，如果存在两个同名的消息，且它们的 schema 定义相同，这不算错误，但会被视为重复定义并被忽略。这个规则在标准接口中同样适用，目的是让不同的标准接口可以各自定义共性功能，形成自包含的标准接口定义。当一个扩展实现这些具有相同定义的标准接口时，不会因此产生错误。这个特性在标准接口中非常有用，因为标准接口的定义可以被引用，所以当一个扩展实现多个标准接口时，如果这些标准接口中（或其引用的其他标准接口中）有相同的 message 和相同的 schema，也不会因此产生错误。

由于 TEN framework 采用运行与开发分离的架构（类似于 JavaScript 与 TypeScript 的 .d.ts 文件的关系），标准接口的检查与报错主要发生在开发工具阶段，而不是运行时的 TEN Runtime 上。因此，TEN Runtime 在启动图（start graph）时，不会因为接口错误而报错。

在 tman designer 这个开发工具中，如果扩展的接口定义不完整，会显示某些功能暂时无法在该扩展上使用的提示。例如，在使用某个扩展替代另一个扩展的功能时，如果接口定义不完整，会提示该功能暂时无法在这个扩展上使用，需要等待接口定义完整后才能使用。

另外，由于接口定义可以是一个被引用的独立文件，因此在 TEN Manager 的 publish/install 操作中，接口定义不完整并不算错误。

### 接口的兼容规则

当要将实现接口 A 的扩展替换为实现接口 B 的扩展时，需要接口 A 兼容于接口 B 才能进行替换。接口之间的兼容规则有两种模式：

**严格模式：**

- 接口 A 的所有消息都必须出现在接口 B 中，且接口 A 中消息的 schema 必须兼容于接口 B 中对应消息的 schema。

**宽松模式：**

- 只有存在连线（即有 connection）的接口 A 中的消息必须出现在接口 B 中，且接口 A 中这些消息的 schema 必须兼容于接口 B 中同名消息的 schema。

严格模式和宽松模式供用户选择，适用于不同的场景。例如，如果确定扩展实现的接口 A 中的某个消息 X 一定不会被使用，那么因为消息 X 的不兼容或不存在而导致无法替换为想要的另一个扩展可能过于严格。

## 标准接口的实现方式

TEN 扩展支持的 API 定义在其 `manifest.json` 文件中。标准接口的实现就是将定义好的 API 规范写入独立的 JSON 文件，然后在 `manifest.json` 中引用这个文件。

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

当 TEN 系统（包括 TEN Runtime、TEN Manager 等）解析 `manifest.json` 时，会根据 `import_uri` 下载对应的 JSON 文件，并将其内容合并到 `manifest.json` 中。被引用的标准接口文件内容示例如下，可以看到内容与 manifest.json 中的 `api` 字段相同，只是被独立成一个文件以便引用。并且这个独立的标准接口文件也可以再引用其他的标准接口文件。

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

系统会将 `import_uri` 指向的 JSON 文件内容合并到 `manifest.json` 的 `api` 字段中，具体包括：

- `property`
- `cmd_in`、`cmd_out`
- `data_in`、`data_out`
- `audio_frame_in`、`audio_frame_out`
- `video_frame_in`、`video_frame_out`

**重要规则：**

1. **冲突检测**：如果合并过程中发现同名的同类字段（比如同名的 `cmd_in` 或同名的 `property`），如果 schema 相同则不算错误，否则系统会报错。
2. **递归合并**：合并过程是递归进行的，如果检测到循环引用，系统会报错。
3. **多接口支持**：一个扩展可以支持多个标准接口，在 `manifest.json` 中定义多个 `interface` 字段即可。
4. **重复引用检测**：如果不同的 `interface` 字段引用了相同的 `import_uri`，系统会报错。

## 标准接口的存储方式

标准接口文件支持以下几种存储方式：

### 1. TEN 系统包（TEN System Package）

**概述**：这种方式是将标准接口定义文件打包成 TEN 系统包，然后在 `manifest.json` 中引用。同时也可以在 manifest.json 的 dependencies 字段中依赖这个系统包，这样在安装扩展时就会一并安装所依赖的标准接口系统包，从而提供最佳的开发体验。通过这种方法，可以利用 TEN 包的版本机制来实现标准接口的版本管理，并且可以利用 TEN 包的依赖机制来实现标准接口的自动安装。

使用 TEN 系统包，除了标准接口的 JSON 定义文件外，还可以包含相关的资源，例如模型文件、公共工具函数库、配套工具等。因此，当所有这些资源出现不兼容的变更时，都可以通过 TEN 系统包的版本号变更来更好地体现这种变化。例如，系统包内 JSON 文件的存放位置或者文件名称的变化，也算是该系统包的破坏性变更，因此应该升级该系统包的主版本号。

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

**使用 TEN 系统包的优势：**

1. **易于分发**：系统包可以上传到 TEN 扩展市场，用户可以直接下载使用
2. **资源丰富**：包中不仅包含接口定义文件，还可以包含相关资源，如：
   - 模型文件
   - 公共工具函数库
   - 配套工具等
3. **依赖管理**：系统包可以作为扩展的依赖项，当扩展被下载时，相关的系统包也会自动下载
4. **版本管理**：不仅限于标准接口协议本身，该系统包内的任何资源都是该系统包版本管理的一部分

需要注意的是，TEN 系统包的版本号并不仅仅代表标准接口的版本号，而是代表整个系统包的版本号。因此，如果系统包内的资源有破坏性变更，就应该升级系统包的主版本号。例如，系统包内 JSON 文件的存放位置或者文件名称的变化，即使没有改变 JSON 文件的内容，也算是该系统包的破坏性变更，因为对使用者来说，使用方式需要改变，所以应该升级该系统包的主版本号。

因此，不能仅仅通过系统包的版本号来判断标准接口的兼容性。标准接口的兼容性还是需要通过接口的兼容规则来判断。

#### 支持多版本共存

> **注意**：这一节所描述的功能，基本上不会实现，只是描述如果之后要做的话，可能的实现方法以及需要考虑的点。

**概述**：在某些场景下，一个 TEN 应用可能需要同时使用同一标准接口的不同版本。为了支持这种需求，TEN 允许在同一个应用内安装同一个系统包的多个版本。

**系统包配置：**

首先，在系统包的 `manifest.json` 中声明支持多版本共存：

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

**扩展依赖配置：**

在依赖该系统包的扩展的 `manifest.json` 中，也需要声明使用多版本共存：

```json
{
  "dependencies": [
    {
      "type": "system",
      "name": "foo_interface",
      "version": "=0.1.0", // 注意：这里只能是 equal 的语法，不能用 >= 之类的语法
      "install_policy": {
        "coinstallable": "true"
      }
    }
  ],
}
```

并且在整个依赖树的构建过程中，如果一个系统包的 coinstallable 为 true，则需要所有依赖该系统包的地方都声明是 coinstallable，否则系统会报错。

**文件系统路径：**

启用多版本共存后，系统包在文件系统中的路径会变为：

```text
ten_packages/system/<hash_value>_foo_extension_0_1_0/
```

> **注意**：未来可能会引入映射机制，让用户在使用时不需要明确指定 hash_value，而是通过某种映射机制自动找到对应的系统包。但这种机制如果要好用，还需要修改 TEN 所支持的语言中的模块加载机制，使得开发者可以不用在该语言中的模块加载机制中指定 hash_value，而是通过某种映射机制自动找到对应的系统包。这种深入语言内部的改动也是这种单包多版本共存的机制基本上不会被实现的原因之一。
>
> **注意**：如果真的需要在一个 TEN 应用内使用多个版本的一个标准接口，可以使用下述的几种方式来实现。如果一个标准接口有配套的公用资源，例如模型文件、公共工具函数库、配套工具等，那么这些资源很多无法做到在一个 TEN 应用内的多版本共存，这也是这种单包多版本共存的机制基本上不会被实现的原因之一。

### 2. 网络地址

**概述**：将标准接口定义文件部署到网络服务器上，通过 HTTP/HTTPS 地址引用：

```json
{
  "interface": [
    {
      "import_uri": "http://xxx/asr_1.0_interface/interface.json"
    }
  ]
}
```

> **注意**：TEN Manager 在处理这种引用方式时，可以将文件下载到自己的缓存中，然后通过某种映射机制，让 TEN Manager 能够找到定义。

**适用场景：**

- **轻量级接口**：没有配套的公共资源的接口定义
- **版本灵活性**：需要在一个 `manifest.json` 中引用同一标准接口的不同版本

### 3. 本地路径

**概述**：引用本地文件系统中的标准接口定义文件：

**绝对路径：**

```json
{
  "interface": [
    {
      "import_uri": "file://c:/asr_1.0_interface/interface.json"
    }
  ]
}
```

**相对路径：**

```json
{
  "interface": [
    {
      "import_uri": "../asr_1.0_interface/interface.json"
    }
  ]
}
```

**适用场景：**

与网络地址方式类似：

- **轻量级接口**：适合没有配套的公共资源的接口定义
- **版本灵活性**：需要在一个 `manifest.json` 中引用同一标准接口的不同版本

## 如何从云商店中筛选想要的扩展

标准接口与云商店的关系体现在将标准接口包装成 TEN 系统包。有以下两种方式可以搜索出符合特定条件的扩展：

1. **依赖搜索**：搜索依赖某个系统包的扩展。由于云商店中扩展的元数据包含了依赖信息，所以云商店可以据此筛选出依赖某个系统包的所有扩展。

2. **标签搜索**：通过 TEN package 的 tag 来快速搜索出符合某些条件的扩展，选择安装后，再进行替换操作。如果是 TEN 官方认证过的扩展，甚至可以打上 `ten:` 开头的标签来表明这是一个官方认证过的扩展，确实符合所声明的标准接口定义。
