---
title: 图（Graph）
---

在 TEN 框架（Framework）中，有两种类型的图（Graph）：

1. 动态图
2. 预定义图 (`predefined_graph`)

|              | 动态图                                      | 预定义图                                                                |
| ------------ | ------------------------------------------- | ----------------------------------------------------------------------- |
| 启动图的时间 | 当 TEN 应用（app）收到 `start_graph` 命令时 | 当 TEN 应用（app）启动时，或当 TEN 应用（app）收到 `start_graph` 命令时 |
| 图的内容     | 在 `start_graph` 命令中指定                 | 在 TEN 应用（app）的属性中指定                                          |
| 图的 ID      | 随机 UUID                                   | 随机 UUID                                                               |

![两种类型的图](/assets/png/two_types_of_graph.png)

对于预定义图，有一个 `auto_start` 属性，用于确定预定义图是否在 TEN 应用（app）启动时自动启动。

还有一个 `singleton` 属性，用于指示预定义图是否只能在 TEN 应用（app）内生成 _一个_ 对应的图实例。

## 图 ID 和图名称

对于从图定义生成的每个图实例，在 TEN 应用（app）内都有一个唯一的 UUID4 字符串来表示该图实例。此 UUID4 字符串称为该图的**图 ID**。

对于每个预定义图，可以分配一个有意义或易于记忆的名称，称为预定义图的**图名称**。在指定特定的预定义图时，可以使用图名称来表示它。如果预定义图具有 `singleton` 属性，则表示从该预定义图生成的图实例在 TEN 应用（app）内只能存在一个。因此，TEN 运行平台（runtime）将使用图名称来唯一标识从 singleton 预定义图生成的单个图实例。

## 动态图

当 TEN 应用（app）收到 `start_graph` 命令并创建此类型的图时，它将分配一个随机 UUID 值作为新启动的图的 ID。如果其他客户端获取了此图的 ID，它们也可以连接到此图。

动态图 ID 示例：

`123e4567-e89b-12d3-a456-426614174000`

## 预定义图 (`predefined_graph`)

预定义图与动态图非常相似。动态图的内容包含在 `start_graph` 命令中，而预定义图的内容由 TEN 应用（app）定义。客户端只需在 `start_graph` 命令中指定他们想要启动的预定义图的名称。

预定义图的主要目的是为了方便使用和保护信息。预定义图允许客户端避免了解图的详细内容，这可能是出于可用性考虑，或者为了防止客户端知晓图中包含的某些信息。

预定义图名称示例：

`http_server`

当 TEN 应用（app）启动时，设置为自动启动的预定义图也会被启动。

## 图定义

图的定义，无论是动态的还是预定义的，都是相同的。以下是图的定义：

```json
{
  "nodes": [
    // 节点的定义
  ],
  "connections": [
    // 通信链路的定义
  ]
}
```

要点：

1. 如果只有一个 TEN 应用（app），则可以省略 `app` 字段。否则，必须指定。如果只有一个 TEN 应用（app）且未指定 `app` 字段，则 TEN 运行平台（runtime）将默认使用 `localhost` 作为 `app` 字段。
2. `nodes` 字段指定图中的节点，例如扩展（extension）等。
3. 对于图中的每个节点，它只能在 `nodes` 字段中出现一次。如果多次出现，TEN 框架（Framework）将在 TEN 管理器（TEN manager）进行的图验证期间或 TEN 运行平台（runtime）进行的图验证期间抛出错误。
4. 在 `nodes` 字段中指定扩展（extension）的方式如下。

   `property` 字段是可选的。

   - `addon` 字段表示该扩展（extension）是由该插件（addon）生成的实例。

   ```json
   {
     "type": "extension",
     "name": "simple_http_server_cpp",
     "addon": "simple_http_server_cpp",
     "extension_group": "default_extension_group",
     "app": "msgpack://127.0.0.1:8001/",
     "property": {
       "root_key": "player",
       "extra_keys": ["playerName"]
     }
   }
   ```

5. `connections` 字段指定图中节点之间的通信链路。

   在每个链路中，`extension` 的值都是表示相应节点名称的字符串。

一个完整的示例是：

```json
{
  "nodes": [
    {
      "type": "extension",
      "app": "msgpack://127.0.0.1:8001/",
      "name": "simple_http_server_cpp",
      "addon": "simple_http_server_cpp",
      "extension_group": "default_extension_group",
      "property": {
        "root_key": "player",
        "extra_keys": ["playerName"]
      }
    }
  ],
  "connections": [
    {
      "app": "msgpack://127.0.0.1:8001/",
      "extension": "simple_http_server_cpp",
      "cmd": [
        {
          "name": "start",
          "dest": [
            {
              "app": "msgpack://127.0.0.1:8001/",
              "extension": "gateway"
            }
          ]
        },
        {
          "name": "stop",
          "dest": [
            {
              "app": "msgpack://127.0.0.1:8001/",
              "extension": "gateway"
            }
          ]
        }
      ]
    },
    {
      "app": "msgpack://127.0.0.1:8001/",
      "extension": "gateway",
      "cmd": [
        {
          "name": "push_status_online",
          "dest": [
            {
              "app": "msgpack://127.0.0.1:8001/",
              "extension": "uap"
            }
          ]
        }
      ]
    }
  ]
}
```

## 预定义图的定义

本质上，您将上面的完整图定义放置在 TEN 应用（app）的属性（property.json）中的 `predefined_graphs` 字段下。`predefined_graphs` 字段也将具有其属性，例如 `name`、`auto_start` 等。

```json
{
  "ten": {
    "predefined_graphs": [
      {
        "name": "default",
        "auto_start": true,
        "singleton": true,
        // 将完整的图定义放在此处。
      }
    ]
  }
}
```

所以它看起来像这样：

```json
{
  "ten": {
    "predefined_graphs": [
      {
        "name": "default",
        "auto_start": true,
        "singleton": true,
        "nodes": [
          {
            "type": "extension",
            "name": "simple_http_server_cpp",
            "addon": "simple_http_server_cpp",
            "extension_group": "default_extension_group",
            "property": {
              "root_key": "player",
              "extra_keys": [
                "playerName"
              ]
            }
          }
        ],
        "connections": [
          {
            "app": "msgpack://127.0.0.1:8001/",
            "extension": "simple_http_server_cpp",
            "cmd": [
              {
                "name": "start",
                "dest": [
                  {
                    "app": "msgpack://127.0.0.1:8001/",
                    "extension": "gateway"
                  }
                ]
              },
              {
                "name": "stop",
                "dest": [
                  {
                    "app": "msgpack://127.0.0.1:8001/",
                    "extension": "gateway"
                  }
                ]
              }
            ]
          },
          {
            "app": "msgpack://127.0.0.1:8001/",
            "extension": "gateway",
            "cmd": [
              {
                "name": "push_status_online",
                "dest": [
                  {
                    "app": "msgpack://127.0.0.1:8001/",
                    "extension": "uap"
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  }
}
```

## `start_graph` 命令的定义

本质上，您将上面的完整图定义放置在 `start_graph` 命令的 `ten` 字段下。`start_graph` 命令也将具有其属性，例如 `type`、`seq_id` 等。

```json
{
  "ten": {
    "type": "start_graph",
    "seq_id": "55"
    // 将完整的图定义放在此处。
  }
}
```

以下是 `start_graph` 命令的完整定义：

```json
{
  "ten": {
    "type": "start_graph",
    "seq_id": "55",
    "nodes": [
      {
        "type": "extension",
        "name": "simple_http_server_cpp",
        "addon": "simple_http_server_cpp",
        "extension_group": "default_extension_group",
        "property": {
          "root_key": "player",
          "extra_keys": ["playerName"]
        }
      }
    ],
    "connections": [
      {
        "app": "msgpack://127.0.0.1:8001/",
        "extension": "simple_http_server_cpp",
        "cmd": [
          {
            "name": "start",
            "dest": [
              {
                "app": "msgpack://127.0.0.1:8001/",
                "extension": "gateway"
              }
            ]
          },
          {
            "name": "stop",
            "dest": [
              {
                "app": "msgpack://127.0.0.1:8001/",
                "extension": "gateway"
              }
            ]
          }
        ]
      },
      {
        "extension": "gateway",
        "cmd": [
          {
            "name": "push_status_online",
            "dest": [
              {
                "extension": "uap"
              }
            ]
          }
        ]
      }
    ]
  }
}
```

### 使用 `source_uri` 字段来引用图定义

在 TEN 应用（app）的 `property.json` 中定义预定义图（predefined_graphs）的时候，可以使用 `source_uri` 字段来引用图定义。

- `source_uri` 字段可以是一个相对路径，也可以是一个绝对路径，也可以是一个 URL 路径。
- 如果 `source_uri` 字段是一个相对路径，则它相对于 TEN 应用（app）的 `property.json` 文件所在的目录。
- 如果 `source_uri` 字段是一个绝对路径，则它相对于 TEN 应用（app）所在的环境的根目录。
- 如果 `source_uri` 字段是一个 URL，则它将被视为一个 URL 路径。

```json
{
  "ten": {
    "uri": "http://localhost:8001",
    "predefined_graphs": [
      {
        "name": "default",
        "auto_start": false,
        "source_uri": "../graph.json"
      }
    ]
  }
}
```

此配置指定了一个名为 "default" 的预定义图（predefined_graphs），引用自 "../graph.json" 文件，设置为不自动启动。TEN 应用（app）可以根据需求来控制图的启动时机，实现更灵活的功能组织。

## 图定义的规范

- **`nodes` 字段的要求：**
  `nodes` 数组在图定义中是强制性的。相反，`connections` 数组是可选的，但鼓励用于定义节点间通信。
- **节点 `app` 字段的验证：**
  在任何情况下，`app` 字段都不能设置为 `localhost`。在单个 TEN 应用（app）图中，不应指定 `app` URI。在多应用（app）图中，`app` 字段的值必须与每个应用（app）的 `property.json` 中定义的 `ten.uri` 字段的值匹配。
- **节点唯一性和标识：**
  `nodes` 数组中的每个节点都表示图中的特定扩展（extension）实例，该实例由指定的插件（addon）创建。因此，每个扩展（extension）实例都应由单个节点唯一表示。节点必须通过 `app` 和 `name` 的组合来唯一标识。不允许同一扩展（extension）实例的多个条目。以下示例**无效**，因为它为同一扩展（extension）实例（都叫做 `some_ext`）定义了多个节点：

  ```json
  {
    "nodes": [
      {
        "type": "extension",
        "name": "some_ext",
        "addon": "addon_1",
        "extension_group": "test"
      },
      {
        "type": "extension",
        "name": "some_ext",
        "addon": "addon_2",
        "extension_group": "test"
      }
    ]
  }
  ```

- **通信链路中扩展（extension）实例定义的一致性：**
  在 `connections` 字段中引用的所有扩展（extension）实例（无论是作为源还是目标）都必须在 `nodes` 字段中显式定义。任何未在 `nodes` 数组中定义的实例都将导致验证错误。

  例如，以下示例无效，因为扩展（extension）实例 `ext_2` 在 `connections` 字段中使用，但未在 `nodes` 字段中定义：

  ```json
  {
    "nodes": [
      {
        "type": "extension",
        "name": "ext_1",
        "addon": "addon_1",
        "extension_group": "some_group"
      }
    ],
    "connections": [
      {
        "extension": "ext_1",
        "cmd": [
          {
            "name": "hello",
            "dest": [
              {
                "extension": "ext_2"
              }
            ]
          }
        ]
      }
    ]
  }
  ```

- **通信链路定义的整合：**
  在 `connections` 数组中，与同一源扩展（extension）实例相关的所有消息必须分组在单个部分中。将同一源扩展（extension）实例的信息拆分为多个部分会导致不一致和错误。

  例如，以下示例不正确，因为来自 `ext_1` 的消息被分为不同的部分：

  ```json
  {
    "connections": [
      {
        "extension": "ext_1",
        "cmd": [
          {
            "name": "hello",
            "dest": [
              {
                "extension": "ext_2"
              }
            ]
          }
        ]
      },
      {
        "extension": "ext_1",
        "data": [
          {
            "name": "hello",
            "dest": [
              {
                "extension": "ext_2"
              }
            ]
          }
        ]
      }
    ]
  }
  ```

  正确的方法是将同一源扩展（extension）实例的所有消息整合到一个部分中：

  ```json
  {
    "connections": [
      {
        "extension": "ext_1",
        "cmd": [
          {
            "name": "hello",
            "dest": [
              {
                "extension": "ext_2"
              }
            ]
          }
        ],
        "data": [
          {
            "name": "hello",
            "dest": [
              {
                "extension": "ext_2"
              }
            ]
          }
        ]
      }
    ]
  }
  ```

- **唯一消息目标地的整合：**
  对于特定类型（例如，`cmd` 或 `data`）的每条消息，目标扩展（extension）实例必须归类在针对该消息的单个条目下。为同一消息名称重复设置不同目的地会导致不一致和验证错误。

  例如，下面的例子是错误的，因为消息 `hello` **存在多个独立的条目**：

  ```json
  {
    "connections": [
      {
        "extension": "ext_1",
        "cmd": [
          {
            "name": "hello",
            "dest": [
              {
                "extension": "ext_2"
              }
            ]
          },
          {
            "name": "hello",
            "dest": [
              {
                "extension": "ext_3"
              }
            ]
          }
        ]
      }
    ]
  }
  ```

  正确的方法是将同一消息的所有目地的整合到一个条目下：

  ```json
  {
    "connections": [
      {
        "extension": "ext_1",
        "cmd": [
          {
            "name": "hello",
            "dest": [
              {
                "extension": "ext_2"
              },
              {
                "extension": "ext_3"
              }
            ]
          }
        ]
      }
    ]
  }
  ```

  但是，具有相同名称的消息可以跨不同类型（例如，`cmd` 和 `data`）存在，而不会导致冲突。

有关更多示例，请参阅 TEN 框架（Framework）`tman` 中的 `check graph` 命令文档。

## 子图（Subgraph）

TEN 框架（Framework）的核心运作机制是基于图（Graph）结构，该结构由节点（Nodes）和连接（Connections）组成。子图（Subgraph）是一种强大的复用机制，允许将复杂的图结构拆分成多个可重用的模块，从而提高代码组织性和可维护性。

### 子图设计思想

图（Graph）基本上就是指定不同的扩展（extension）之间的数据流动的方式。子图并不会改变这种基本原理，子图本质上是一种语法糖（Syntax Sugar），它最终会被展平到所属的大图中，然后使用与普通图相同的机制启动。这种设计既简化了复杂系统的开发，又不增加运行时的复杂度。

#### 设计原则

子图的设计遵循以下核心原则：

1. **独立性**：子图本身是一个完整的图，既可以单独启动，也可以作为组件嵌入到其他图中。

2. **工具友好**：子图提供额外信息帮助开发工具理解图结构，提升开发体验，同时不增加运行时的复杂度。

3. **展平机制**：子图最终会被展平为标准图结构，使用相同的运行机制，确保性能和兼容性。

4. **简洁性**：引入子图的目的是简化，而非复杂化。因此，子图机制尽量避免增加图的 JSON 结构复杂度，而是通过工具提升开发效率。

#### 黑盒原则

子图的设计目的是让开发者能够将一个图当作黑盒使用，无需关注其内部复杂性。为此，我们制定了以下准则：

- **不提供特殊修补机制**：子图设计不专门为调整子图内部状态提供特殊机制，避免增加整体图结构的复杂性。

- **直接修改原始定义**：当需要修改子图内部（如更改节点的 addon, app 等），应直接修改子图定义文件，而非在引用处提供修补机制。

- **避免连锁反应**：在引用处修补子图定义会导致复杂性蔓延，增加理解和维护成本。

例如，当将子图 A（包含多个 extensions 和 connections）引入到图 B 中时，如果需要调整子图 A 内的某个扩展（extension）属性，正确做法是直接修改子图 A 的定义文件，而不是在引用处进行修补。这保持了子图作为黑盒的特性，简化了整体图的结构。

虽然未来可能会考虑简单的子图修补机制，但这需要谨慎设计，避免过度复杂化。因为很难制定一个明确的原则来区分哪些修改应通过修补机制实现，哪些应直接修改子图定义。理想情况下，开发工具应该提供便捷方式直接修改子图定义，而不是通过复杂的引用修补机制。

### 子图实现机制

接下来，我们将详细介绍子图的实现机制，包括子图定义、引用方式和展平过程。

#### 子图定义示例

以下是一个 `subgraph.json` 示例，它既可作为独立图使用，也可作为子图被其他图引用：

```json
{
  "nodes": [
    {
      // 定义一个名为 ext_c 的 extension
      "type": "extension",
      "name": "ext_c",
      "addon": "extension_c"
    },
    {
      // 定义一个名为 ext_d 的 extension
      "type": "extension",
      "name": "ext_d",
      "addon": "extension_d"
    }
  ],
  "connections": [
    {
      // ext_c 将 B 命令传输到 ext_d
      "extension": "ext_c",
      "cmd": [
        {
          "name": "B",
          "dest": [
            {
              "extension": "ext_d"
            }
          ]
        }
      ]
    }
  ],
  "exposed_messages": [
    // 表示该图向外部暴露的消息接口
    // 主要供开发工具使用，便于查找消息定义并提供智能提示
    {
      // ext_d 的 B 命令是该图暴露给外部的消息接口
      "type": "cmd_in",
      "name": "B",
      "extension": "ext_d"
    }
  ]
}
```

特别注意 `exposed_messages` 字段，它声明了子图对外部暴露的消息接口，主要用于辅助开发工具提供更好的用户体验。

#### 子图引用示例

以下是引用子图的 `graph.json` 示例，展示了如何在一个图中引用和使用子图：

```json
{
  "nodes": [
    {
      // 定义一个名为 ext_a 的 extension
      "type": "extension",
      "name": "ext_a",
      "addon": "extension_a"
    },
    {
      // 定义一个名为 ext_b 的 extension
      "type": "extension",
      "name": "ext_b",
      "addon": "extension_b"
    },
    {
      // 引用子图，在此图中命名为 graph_any_name
      "type": "subgraph",
      "name": "graph_any_name",
      "source_uri": "./ten_packages/extension/aaa/subgraph.json"
    }
  ],
  "connections": [
    {
      "extension": "ext_a",
      "cmd": [
        {
          "name": "B",
          "dest": [
            {
              // 第一个目标是 ext_b
              "extension": "ext_b"
            },
            {
              // 第二个目标是子图中的 ext_d
              "extension": "graph_any_name:ext_d"
            }
          ]
        }
      ]
    },
    {
      // 子图中的 ext_c 将 cmd H 传输给 ext_a
      "extension": "graph_any_name:ext_c",
      "cmd": [
        {
          "name": "H",
          "dest": [
            {
              "extension": "ext_a"
            }
          ]
        }
      ]
    }
  ]
}
```

虽然引用语法（如 `"extension": "graph_any_name:ext_d"`）看似暴露了子图内部细节，但实际上开发工具可以借助 `exposed_messages` 信息，使开发者无需了解这些细节。开发工具可以：

1. 呈现子图暴露的命令接口
2. 让开发者直接连接到这些暴露的接口
3. 自动处理内部细节并生成正确的图定义

这大大简化了开发过程，让开发者能够专注于功能逻辑而非底层细节。

#### 关键概念

子图机制引入了三个关键概念，理解这些概念对于正确使用子图至关重要：

1. **消息暴露**（exposed_messages）：
   - 子图通过 `exposed_messages` 字段声明对外暴露的消息接口
   - 主要供开发工具使用，实现智能提示和检查
   - 隐藏子图内部细节，提升开发体验

2. **子图引用与命名**：
   - 通过 `"type": "subgraph"` 引用其他图文件
   - 每个子图有唯一标识名称，作为命名空间
   - 防止不同子图中的同名元素冲突

3. **跨图连接**：
   - 通过命名空间语法（如 `graph_any_name:ext_d`）引用子图内的元素
   - 使子图内的元素可以与主图进行交互
   - 构建复杂的跨图消息流

总之，一个图借由 exposed_messages 字段用来描述如何从图的边界往内流动消息。而工具则借由 exposed_messages 字段来提供智能提示，让开发者可以方便的指定如何将消息流动到图的边界。

#### 展平机制

最终，引用子图的图会被展平为普通图结构，以保证运行时的统一性和高效性。以下是展平后的示例：

```json
{
  "nodes": [
    {
      "type": "extension",
      "name": "ext_a",
      "addon": "extension_a"
    },
    {
      "type": "extension",
      "name": "ext_b",
      "addon": "extension_b"
    },
    {
      // 子图中的 ext_c 被展平，名称前缀为子图名称
      "type": "extension",
      "name": "graph_any_name_ext_c",
      "addon": "extension_c"
    },
    {
      // 子图中的 ext_d 被展平，名称前缀为子图名称
      "type": "extension",
      "name": "graph_any_name_ext_d",
      "addon": "extension_d"
    }
  ],
  "connections": [
    {
      "extension": "ext_a",
      "cmd": [
        {
          "name": "B",
          "dest": [
            {
              "extension": "ext_b"
            },
            {
              "extension": "graph_any_name_ext_d"
            }
          ]
        }
      ]
    },
    {
      "extension": "graph_any_name_ext_c",
      "cmd": [
        {
          "name": "H",
          "dest": [
            {
              "extension": "ext_a"
            }
          ]
        }
      ]
    },
    {
      // 子图内部连接也被展平纳入
      "extension": "graph_any_name_ext_c",
      "cmd": [
        {
          "name": "B",
          "dest": [
            {
              "extension": "graph_any_name_ext_d"
            }
          ]
        }
      ]
    }
  ]
  // exposed_messages 字段在展平过程中被舍弃，因为它仅用于辅助工具
}
```

子图（Subgraph）的展平机制遵循以下规则：

1. 展平前的图定义中，冒号（`:`）符号表示该元素位于子图中（如 `graph_any_name:ext_d`）。

2. 展平后，子图中元素的名称添加子图名称作为前缀（如 `graph_any_name_ext_c`），以确保全局唯一性。

3. 展平后的图定义不再包含冒号（`:`）符号，以此区分展平前后的状态。

4. 子图中的内部连接会被保留并纳入展平后的图中，保证功能完整性。

### 高级功能与应用

随着项目复杂度的增加，子图的高级功能可以帮助开发者更好地组织和管理系统。

#### 消息转换与子图

子图完全支持消息转换（msg_conversion）机制，用于处理不同接口之间的消息格式转换：

```json
{
  "nodes": [
    {
      "type": "extension",
      "name": "ext_a",
      "addon": "addon_a"
    },
    {
      "type": "extension",
      "name": "ext_b",
      "addon": "addon_b"
    },
    {
      "type": "subgraph",
      "name": "graph_any_name",
      "source_uri": "http://a.b.c.d/subgraph.json"
    }
  ],
  "connections": [
    {
      "extension": "ext_a",
      "cmd": [
        {
          "name": "B",
          "dest": [
            {
              "extension": "ext_b",
              "msg_conversion": {
                "type": "per_property",
                "rules": [
                  {
                    "path": "extra_data",
                    "conversion_mode": "fixed_value",
                    "value": "tool_call"
                  }
                ],
                "keep_original": true
              }
            },
            {
              "extension": "graph_any_name:ext_d",
              "msg_conversion": {
                "type": "per_property",
                "rules": [
                  {
                    "path": "extra_data",
                    "conversion_mode": "fixed_value",
                    "value": "tool_call"
                  }
                ],
                "keep_original": true
              }
            }
          ]
        }
      ]
    }
  ]
}
```

开发工具可以借助 `exposed_messages` 信息，在开发者构建连接时提示兼容性，并按需提供消息转换配置界面。配置完成后，开发工具会自动将转换规则写入图定义中，简化开发流程。

展平后，消息转换规则也会被正确保留，确保运行时行为与设计意图一致：

```json
{
  "nodes": [
    {
      "type": "extension",
      "name": "ext_a",
      "addon": "addon_a"
    },
    {
      "type": "extension",
      "name": "ext_b",
      "addon": "addon_b"
    },
    {
      "type": "extension",
      "name": "graph_any_name_ext_c",
      "addon": "addon_c"
    },
    {
      "type": "extension",
      "name": "graph_any_name_ext_d",
      "addon": "addon_d"
    }
  ],
  "connections": [
    {
      "extension": "ext_a",
      "cmd": [
        {
          "name": "B",
          "dest": [
            {
              "extension": "ext_b",
              "msg_conversion": {
                "type": "per_property",
                "rules": [
                  {
                    "path": "extra_data",
                    "conversion_mode": "fixed_value",
                    "value": "tool_call"
                  }
                ],
                "keep_original": true
              }
            },
            {
              "extension": "graph_any_name_ext_d",
              "msg_conversion": {
                "type": "per_property",
                "rules": [
                  {
                    "path": "extra_data",
                    "conversion_mode": "fixed_value",
                    "value": "tool_call"
                  }
                ],
                "keep_original": true
              }
            }
          ]
        }
      ]
    }
  ]
}
```

通过这种方式，开发者可以灵活处理不同组件之间的消息格式差异，而无需关心底层实现细节。

## "graph_any_name:ext_c" 的意义

在上面示例中的 `graph_any_name:ext_c` 中的 `graph_any_name` 代表的不是一个子图，代表的是一个引用到 `nodes` 字段中的一个元素。而在子图的应用中，`graph_any_name` 代表的是一个子图，也可以看成是一个命名空间。

借由这种机制，可以实现在图的连接（connections）中指定不同地方的扩展（extension）作为源扩展（source extension）或目标扩展（destinationextension），实现跨多个图（Graph）的连接。

核心的概念是，图的连接一定是不同的扩展（extension）之间的连接，这是图的连接的本质。但可借由这种机制，在 nodes 字段中指定不同型态的元素作为连接的源扩展（source extension）或目标扩展（destination extension），实现跨多个子图（Subgraph）甚至多个图（Graph）的连接。

## 跨多个图（Graph）的连接

除了子图（Subgraph）外，也可以借由类似的机制来在一个图中指定如何跟其他图进行连接。

### 与同一个 TEN 应用（app）中的预定意图（predefined_graph）进行连接

以下展示了如何在一个图（Graph）连接到同一个 TEN 应用（app）中的预定意图（predefined_graph）：

```json
{
  "nodes": [
    {
      // 定义一个名为 ext_a 的 extension
      "type": "extension",
      "name": "ext_a",
      "addon": "extension_a"
    },
    {
      // 定义一个名为 ext_b 的 extension
      "type": "extension",
      "name": "ext_b",
      "addon": "extension_b"
    },
    {
      // 引用其他图，在此图中命名为 graph_any_name
      "type": "predefined_graph",
      "name": "graph_any_name",
    }
  ],
  "connections": [
    {
      "extension": "ext_a",
      "cmd": [
        {
          "name": "B",
          "dest": [
            {
              // 第一个目标是 ext_b
              "extension": "ext_b"
            },
            {
              // 第二个目标是子图中的 ext_d
              "extension": "graph_any_name:ext_d"
            }
          ]
        }
      ]
    },
    {
      // 子图中的 ext_c 将 cmd H 传输给 ext_a
      "extension": "graph_any_name:ext_c",
      "cmd": [
        {
          "name": "H",
          "dest": [
            {
              "extension": "ext_a"
            }
          ]
        }
      ]
    }
  ]
}
```

### 与其他 TEN 应用（app）中的预定意图（predefined_graph）进行连接

以下展示了如何在一个图（Graph）连接到其他 TEN 应用（app）中的预定意图（predefined_graph）：

```json
{
  "nodes": [
    {
      // 定义一个名为 ext_a 的 extension
      "type": "extension",
      "name": "ext_a",
      "addon": "extension_a"
    },
    {
      // 定义一个名为 ext_b 的 extension
      "type": "extension",
      "name": "ext_b",
      "addon": "extension_b"
    },
    {
      // 引用其他图，在此图中命名为 graph_any_name
      "type": "predefined_graph",
      "name": "graph_any_name",
      "app": "msgpack://127.0.0.1:8002/"
    }
  ],
  "connections": [
    {
      "extension": "ext_a",
      "cmd": [
        {
          "name": "B",
          "dest": [
            {
              // 第一个目标是 ext_b
              "extension": "ext_b"
            },
            {
              // 第二个目标是子图中的 ext_d
              "extension": "graph_any_name:ext_d"
            }
          ]
        }
      ]
    },
    {
      // 子图中的 ext_c 将 cmd H 传输给 ext_a
      "extension": "graph_any_name:ext_c",
      "cmd": [
        {
          "name": "H",
          "dest": [
            {
              "extension": "ext_a"
            }
          ]
        }
      ]
    }
  ]
}
```
