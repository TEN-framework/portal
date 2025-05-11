---
title: 图（Graph）
---

在 TEN 框架中，存在两种类型的图：

1. 动态图
2. 预定义图（`predefined_graph`）

|          | 动态图                               | 预定义图                                                  |
| -------- | ------------------------------------ | --------------------------------------------------------- |
| 启动时机 | 当 TEN 应用收到 `start_graph` 命令时 | 当 TEN 应用启动时，或当 TEN 应用收到 `start_graph` 命令时 |
| 图的内容 | 在 `start_graph` 命令中指定          | 在 TEN 应用的属性中预先定义                               |
| 图的 ID  | 随机生成的 UUID                      | 随机生成的 UUID                                           |

![两种类型的图](/assets/png/two_types_of_graph.png)

预定义图具有 `auto_start` 属性，用于确定该图是否在 TEN 应用启动时自动启动。

此外，预定义图还有 `singleton` 属性，用于指示该图是否只能在 TEN 应用内生成 _一个_ 对应的实例。

## 图 ID 和图名称

对于每个图实例，TEN 应用内部会使用一个唯一的 UUID4 字符串作为标识，称为**图 ID**。

对于预定义图，可以分配一个有意义且易于记忆的名称，称为**图名称**。当需要指定特定预定义图时，可以直接使用其图名称。如果预定义图具有 `singleton` 属性，则表示该预定义图在 TEN 应用内只能存在一个实例。在这种情况下，TEN 运行平台会使用图名称来唯一标识从该预定义图生成的单一实例。

## 动态图

当 TEN 应用收到 `start_graph` 命令并创建动态图时，系统会分配一个随机 UUID 作为该图的 ID。如果其他客户端获取了此图 ID，它们也可以连接到这个图。

动态图 ID 示例：

`123e4567-e89b-12d3-a456-426614174000`

## 预定义图

预定义图与动态图的工作原理相似，主要区别在于内容定义方式。动态图的内容包含在 `start_graph` 命令中，而预定义图的内容则由 TEN 应用预先定义。客户端只需在 `start_graph` 命令中指定预定义图的名称即可启动该图。

预定义图的主要优势在于简化使用并保护敏感信息。使用预定义图，客户端无需了解图的详细结构，这既提高了可用性，也避免了暴露图中可能包含的敏感信息。

预定义图名称示例：

`http_server`

当 TEN 应用启动时，所有设置了 `auto_start` 属性的预定义图会自动启动。

## 图定义

无论是动态图还是预定义图，其定义结构都是相同的：

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

关键要点：

1. 如果只有一个 TEN 应用，可以省略 `app` 字段。在这种情况下，TEN 运行平台会默认使用 `localhost` 作为 `app` 字段值。如果有多个应用，则必须明确指定 `app` 字段。

2. `nodes` 字段定义图中的节点，如各种扩展（extension）。

3. 每个节点在 `nodes` 字段中只能出现一次。如果多次出现同一节点，TEN 框架会在验证过程中报错。

4. 在 `nodes` 字段中定义扩展的方式如下，其中 `property` 字段为可选：

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

   `addon` 字段表示该扩展是由对应插件生成的实例。

5. `connections` 字段定义图中节点间的通信链路，其中 `extension` 值表示对应节点的名称。

完整示例：

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

预定义图是在 TEN 应用的配置文件（`property.json`）中的 `predefined_graphs` 字段下定义的，包含 `name`，`auto_start`，`singleton` 等属性：

```json
{
  "ten": {
    "predefined_graphs": [
      {
        "name": "default",
        "auto_start": true,
        "singleton": true,
        // 完整的图定义
      }
    ]
  }
}
```

完整示例：

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

动态图是通过向 TEN 应用发送 `start_graph` 命令创建的，将图定义放在命令的 `ten` 字段下：

```json
{
  "ten": {
    "type": "start_graph",
    "seq_id": "55"
    // 完整的图定义
  }
}
```

完整示例：

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

### 使用 `source_uri` 引用图定义

在定义预定义图时，可以使用 `source_uri` 字段引用外部图定义文件：

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

`source_uri` 可以是相对路径，绝对路径或 URL：

- 相对路径：相对于 `property.json` 文件所在目录
- 绝对路径：相对于 TEN 应用所在环境的根目录
- URL：直接作为 URL 路径处理

## 图定义的规范

- **`nodes` 字段**：在图定义中必须提供 `nodes` 数组。相比之下，`connections` 数组虽然可选，但建议提供以定义节点间通信。

- **节点 `app` 字段**：`app` 字段不能设置为 `localhost`。在单应用图中，应省略 `app` URI；在多应用图中，`app` 字段值必须与各应用 `property.json` 中的 `ten.uri` 值匹配。

- **节点唯一性**：`nodes` 数组中的每个节点表示一个特定扩展实例，必须通过 `app` 和 `name` 组合唯一标识。不允许出现重复定义，如以下无效示例：

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

- **连接定义的一致性**：`connections` 中引用的所有扩展实例必须在 `nodes` 中明确定义。以下示例无效，因为 `ext_2` 未在 `nodes` 中定义：

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

- **通信链路整合**：同一源扩展的所有消息应分组在单个部分中，不应分散在多个定义中。以下示例不正确：

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

  正确做法是将同一源扩展的所有消息整合在一起：

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

- **消息目标整合**：对于特定类型的每条消息，所有目标扩展应归类在单个条目下。以下示例不正确：

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

  正确做法是将同一消息的所有目标整合在一起：

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

  注意，相同名称的消息可以在不同类型（如 `cmd` 和 `data`）中共存，不会导致冲突。

更多示例和详细信息，请参阅 TEN 框架中 `tman` 的 `check graph` 命令文档。

## 子图（Subgraph）

TEN 框架的核心机制是基于图结构，该结构由节点和连接组成。子图是一种强大的复用机制，允许将复杂图结构拆分为可重用模块，提高代码组织性和可维护性。

### 子图设计思想

图本质上是定义扩展之间数据流动方式的机制。子图不改变这一基本原理，而是作为一种语法糖，最终会被展平到所属的大图中，使用与普通图相同的机制启动。这种设计既简化了复杂系统开发，又不增加运行时复杂度。

#### 设计原则

子图设计遵循以下核心原则：

1. **独立性**：子图本身是完整的图，可单独启动，也可作为组件嵌入其他图中。

2. **工具友好**：子图提供额外信息帮助开发工具理解图结构，提升开发体验，不增加运行时复杂度。

3. **展平机制**：子图最终被展平为标准图结构，确保性能和兼容性。

4. **简洁性**：子图旨在简化而非复杂化开发，避免增加 JSON 结构复杂度。

#### 黑盒原则

子图设计目的是让开发者能将一个图作为黑盒使用，无需关注内部复杂性：

- **不提供特殊修补机制**：避免为调整子图内部状态提供特殊机制，减少复杂性。

- **直接修改原始定义**：当需要修改子图内部时，应直接修改子图定义文件，而非在引用处提供修补机制。

- **避免连锁反应**：在引用处修补子图会导致复杂性蔓延，增加维护成本。

例如，将子图 A 引入图 B 时，如需调整子图 A 内部扩展属性，应直接修改子图 A 的定义文件，保持黑盒特性，简化整体结构。

### 子图实现机制

接下来，我们将详细介绍子图的实现机制，包括子图定义、引用方式和展平过程。

#### 子图定义示例

以下是 `subgraph.json` 示例，可作为独立图使用，也可作为子图被其他图引用：

```json
{
  "nodes": [
    {
      // 定义名为 ext_c 的扩展
      "type": "extension",
      "name": "ext_c",
      "addon": "extension_c"
    },
    {
      // 定义名为 ext_d 的扩展
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
    // 表示图向外部暴露的消息接口
    // 主要供开发工具使用，提供智能提示
    {
      // ext_d 的 B 命令暴露给外部
      "type": "cmd_in",
      "name": "B",
      "extension": "ext_d"
    }
  ]
}
```

特别注意 `exposed_messages` 字段，它声明了子图对外暴露的消息接口，主要用于辅助开发工具提供更好的用户体验。

#### 子图引用示例

引用子图的 `graph.json` 示例：

```json
{
  "nodes": [
    {
      // 定义名为 ext_a 的扩展
      "type": "extension",
      "name": "ext_a",
      "addon": "extension_a"
    },
    {
      // 定义名为 ext_b 的扩展
      "type": "extension",
      "name": "ext_b",
      "addon": "extension_b"
    },
    {
      // 引用子图，命名为 graph_any_name
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

虽然引用语法（如 `"extension": "graph_any_name:ext_d"`）看似暴露子图内部细节，但开发工具可利用 `exposed_messages` 信息，使开发者无需了解这些细节。开发工具可以：

1. 呈现子图暴露的命令接口
2. 让开发者直接连接到这些接口
3. 自动处理内部细节生成正确的图定义

这大大简化了开发过程，让开发者专注于功能逻辑而非底层细节。

#### 关键概念

子图机制引入三个关键概念：

1. **消息暴露**（exposed_messages）：
   - 子图通过 `exposed_messages` 字段声明对外暴露的接口
   - 主要供开发工具使用，实现智能提示和检查
   - 隐藏子图内部细节，提升开发体验

2. **子图引用与命名**：
   - 通过 `"type": "subgraph"` 引用其他图文件
   - 每个子图有唯一标识名称，作为命名空间
   - 防止不同子图中的同名元素冲突

3. **跨图连接**：
   - 通过命名空间语法（如 `graph_any_name:ext_d`）引用子图内元素
   - 使子图内元素可与主图交互
   - 构建复杂的跨图消息流

总之，`exposed_messages` 字段描述了如何从图的边界向内流动消息，开发工具则利用此字段提供智能提示，便于开发者指定消息如何流向图的边界。

#### 展平机制

最终，引用子图的图会被展平为普通图结构，确保运行时统一性和高效性：

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
  // exposed_messages 字段在展平过程中被舍弃
}
```

子图展平机制遵循以下规则：

1. 展平前，冒号（`:`）符号表示元素位于子图中（如 `graph_any_name:ext_d`）。

2. 展平后，子图中元素名称添加子图名称作为前缀（如 `graph_any_name_ext_c`），确保全局唯一性。

3. 展平后的图定义不再包含冒号符号，以区分展平前后的状态。

4. 子图中的内部连接会保留并纳入展平后的图中，保证功能完整性。

### 高级功能与应用

随着项目复杂度增加，子图的高级功能可帮助更好地组织和管理系统。

#### 消息转换与子图

子图完全支持消息转换（msg_conversion）机制，用于处理不同接口间的消息格式转换：

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

开发工具可利用 `exposed_messages` 信息，提示兼容性并提供消息转换配置界面。配置完成后，转换规则会自动写入图定义，简化开发流程。

展平后，消息转换规则会正确保留，确保运行时行为与设计意图一致：

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

通过这种方式，开发者可灵活处理不同组件间的消息格式差异，无需关心底层实现细节。

## "graph_any_name:ext_c" 的意义

在前面的示例中，`graph_any_name:ext_c` 中的 `graph_any_name` 不是表示子图本身，而是引用 `nodes` 字段中的一个元素。在子图应用中，`graph_any_name` 可视为一个命名空间。

通过这种机制，可以在图的连接中指定不同位置的扩展作为源或目标，实现跨多个图的连接。

核心概念是：图的连接本质上是扩展之间的连接。通过这种机制，可以在 `nodes` 字段中指定不同类型的元素作为连接的源或目标，实现跨多个子图甚至多个图的连接。

## 跨多个图的连接

除了子图外，还可以通过类似机制在一个图中指定与其他图的连接。

### 与同一 TEN 应用中的预定义图连接

示例：如何在一个图中连接到同一 TEN 应用中的预定义图：

```json
{
  "nodes": [
    {
      // 定义名为 ext_a 的扩展
      "type": "extension",
      "name": "ext_a",
      "addon": "extension_a"
    },
    {
      // 定义名为 ext_b 的扩展
      "type": "extension",
      "name": "ext_b",
      "addon": "extension_b"
    },
    {
      // 引用其他图，命名为 graph_any_name
      "type": "predefined_graph",
      "name": "graph_any_name",
      "predefined_graph_name": "default"
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

### 与其他 TEN 应用中的预定义图连接

示例：如何在一个图中连接到其他 TEN 应用中的预定义图：

```json
{
  "nodes": [
    {
      // 定义名为 ext_a 的扩展
      "type": "extension",
      "name": "ext_a",
      "addon": "extension_a"
    },
    {
      // 定义名为 ext_b 的扩展
      "type": "extension",
      "name": "ext_b",
      "addon": "extension_b"
    },
    {
      // 引用其他应用中的图，命名为 graph_any_name
      "type": "predefined_graph",
      "name": "graph_any_name",
      "app": "msgpack://127.0.0.1:8002/",
      "predefined_graph_name": "default"
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
              // 第二个目标是其他应用子图中的 ext_d
              "extension": "graph_any_name:ext_d"
            }
          ]
        }
      ]
    },
    {
      // 其他应用子图中的 ext_c 将 cmd H 传输给 ext_a
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
