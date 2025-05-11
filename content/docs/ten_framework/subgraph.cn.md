---
title: 子图（Subgraph）
---

## 子图概述

TEN 的核心运作机制是图（Graph），图结构由节点（Nodes）和连接（Connections）组成。子图（Subgraph）是一种复用机制，允许将图拆分成多个可重用的模块。

### 基本图结构

在了解子图之前，我们先来了解基本的图结构。

#### 单应用图示例

以下是一个仅涉及单个 TEN App 的图定义示例：

```json
{
  "nodes": [
    {
      // 定义一个名为 ext_a 的 extension
      "type": "extension",
      "name": "ext_a",
      "addon": "addon_a"
    },
    {
      // 定义一个名为 ext_b 的 extension
      "type": "extension",
      "name": "ext_b",
      "addon": "addon_b"
    }
  ],
  "connections": [
    {
      // 创建一个连接：ext_a 向 ext_b 发送 cmd_1 命令
      "extension": "ext_a",
      "cmd": [
        {
          "name": "cmd_1",
          "dest": [
            {
              "extension": "ext_b"
            }
          ]
        }
      ]
    }
  ]
}
```

#### 多应用图示例

以下是一个涉及多个 TEN App 的图定义示例：

```json
{
  "nodes": [
    {
      // 定义一个名为 ext_a 的 extension，位于 app_a 上
      "type": "extension",
      "name": "ext_a",
      "addon": "addon_a",
      "app": "http://app_a"
    },
    {
      // 定义一个名为 ext_b 的 extension，位于 app_b 上
      "type": "extension",
      "name": "ext_b",
      "addon": "addon_b",
      "app": "http://app_b"
    }
  ],
  "connections": [
    {
      // 创建一个跨应用连接：app_a 上的 ext_a 向 app_b 上的 ext_b 发送 cmd_1 命令
      "app": "http://app_a",
      "extension": "ext_a",
      "cmd": [
        {
          "name": "cmd_1",
          "dest": [
            {
              "app": "http://app_b",
              "extension": "ext_b"
            }
          ]
        }
      ]
    }
  ]
}
```

### 子图设计思想

子图本质上是一种语法糖（Syntax Sugar），它最终会被展平到所属的大图中，然后使用与普通图相同的机制启动。

#### 设计原则

子图的设计遵循以下核心原则：

1. **独立性**：子图本身是一个完整的图，可以单独启动，也可以作为组件嵌入到其他图中。

2. **工具友好**：子图提供额外信息帮助开发工具理解图结构，提升开发体验，但不增加运行时的复杂度。

3. **展平机制**：子图最终会被展平为标准图结构，使用相同的运行机制。

4. **简洁性**：引入子图不会使图的 JSON 结构变得复杂，而是通过工具提升开发效率。

#### 黑盒原则

子图的设计目的是让开发者能够将一个图当作黑盒使用，无需关注其内部复杂性。因此：

- **不提供特殊修补机制**：子图设计不专门为调整子图内部状态提供特殊机制，避免增加整体图结构的复杂性。

- **直接修改原始定义**：当需要修改子图内部（如更改节点的 addon），应直接修改子图定义文件，而非在引用处提供修补机制。

- **避免连锁反应**：在引用处修补子图定义会导致复杂性蔓延，增加理解和维护成本。

例如，当将子图 A（包含多个 extensions 和 connections）引入到图 B 中时，如果需要调整子图 A 内的某个 extension 属性，正确做法是直接修改子图 A 的定义文件，而不是在引用处进行修补。这保持了子图作为黑盒的特性，简化了整体图的结构。

虽然未来可能会考虑简单的子图修补机制，但这需要谨慎设计，避免过度复杂化。因为很难有一个明确的原则说明什么修补应该要通过修补机制来实现，什么修补应该要直接修改子图定义。理想情况下，开发工具应该提供便捷方式直接修改子图定义，而不是通过复杂的引用修补机制。

### 子图实现机制

#### 子图定义示例

以下是一个 `subgraph.json` 示例，它既可作为独立图使用，也可作为子图被引用：

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
  "expose_msgs": [
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

#### 子图引用示例

以下是引用子图的 `graph.json` 示例：

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
      "type": "graph",
      "name": "graph_any_name",
      "ref": "subgraph.json"
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

虽然引用语法（如 `"extension": "graph_any_name:ext_d"`）看似暴露了子图内部细节，但实际上开发工具可以借助 `expose_msgs` 信息，使开发者无需了解这些细节。开发工具可以：

1. 呈现子图暴露的命令接口
2. 让开发者直接连接到这些暴露的接口
3. 自动处理内部细节并生成正确的图定义

#### 关键概念

子图机制引入了三个关键概念：

1. **消息暴露**（expose_msgs）：
   - 子图通过 `expose_msgs` 字段声明对外暴露的消息接口
   - 主要供开发工具使用，实现智能提示和检查
   - 隐藏子图内部细节，提升开发体验

2. **子图引用与命名**：
   - 通过 `type: "graph"` 引用其他图文件
   - 每个子图有唯一标识名称，作为命名空间
   - 防止不同子图中的同名元素冲突

3. **跨图连接**：
   - 通过命名空间语法（如 `graph_any_name:ext_d`）引用子图内的元素
   - 使子图内的元素可以与主图进行交互

#### 展平机制

最终，引用子图的图会被展平为普通图结构。以下是展平后的示例：

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
  // expose_msgs 字段在展平过程中被舍弃，因为它仅用于辅助工具
}
```

展平机制遵循以下规则：

1. 展平前的图定义中，冒号（`:`）符号表示该元素位于子图中（如 `graph_any_name:ext_d`）。

2. 展平后，子图中元素的名称添加子图名称作为前缀（如 `graph_any_name_ext_c`）。

3. 展平后的图定义不再包含冒号（`:`）符号，以此区分展平前后的状态。

### 高级功能与应用

#### 消息转换与子图

子图支持消息转换（msg_conversion）机制，用于处理不同接口之间的消息格式转换：

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
      "type": "graph",
      "name": "graph_any_name",
      "ref": "subgraph.json"
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

开发工具可以借助 `expose_msgs` 信息，在开发者构建连接时提示兼容性，并按需提供消息转换配置界面。配置完成后，开发工具会自动将转换规则写入图定义中。

展平后，消息转换规则也会被正确保留：

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

### 附录：在应用中使用图

在应用程序的 `property.json` 中可以定义预置图并设置启动方式：

```json
{
  "ten": {
    "uri": "http://localhost:8001",
    "predefined_graphs": [
      {
        "name": "default",
        "auto_start": false,
        "ref": "graph.json"
      }
    ]
  }
}
```

此配置指定了一个名为 "default" 的预置图，引用自 "graph.json" 文件，设置为不自动启动。
