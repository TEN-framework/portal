---
title: 子图
---

## 子图

TEN 的核心运作机制是图（graph），一个图可以包含多个节点（nodes）以及多个连接（connections）。以下是一个仅涉及单个 TEN app 的图定义示例：

```json
{
  "nodes": [
    {
      // 该图包含一个名为 ext_a 的 extension
      "type": "extension",
      "name": "ext_a",
      "addon": "addon_a"
    },
    {
      // 该图包含一个名为 ext_b 的 extension
      "type": "extension",
      "name": "ext_b",
      "addon": "addon_b"
    }
  ],
  "connections": [
    {
      // 该图包含一个连接，其源为 ext_a，目标为 ext_b，并在该连接上传输名为 cmd_1 的命令
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

以下是一个涉及多个 TEN app 的图定义示例：

```json
{
  "nodes": [
    {
      // 该图包含一个名为 ext_a 的 extension，注意 ext_a 位于 app_a 上
      "type": "extension",
      "name": "ext_a",
      "addon": "addon_a",
      "app": "http://app_a"
    },
    {
      // 该图包含一个名为 ext_b 的 extension，注意 ext_b 位于 app_b 上
      "type": "extension",
      "name": "ext_b",
      "addon": "addon_b",
      "app": "http://app_b"
    }
  ],
  "connections": [
    {
      // 该图包含一个连接，其源为 ext_a，目标为 ext_b，并在该连接上传输名为 cmd_1 的命令
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

有时我们希望将一个图拆分成多个可复用的小图，这时就引入了子图（subgraph）的概念。子图被设计为一种语法糖（syntax sugar），子图最终会先被展平到所属的大图中，然后再使用与普通图相同的机制来启动。换言之，子图的引入并不会改变图的基本运作机制。

子图机制的设计原则如下：

1. 子图虽然可以嵌入到其他图中，但本身就是一个正常的图，如有需要可以单独启动。
2. 图可以提供额外的信息，帮助工具更容易理解其结构，提升开发体验。这些信息仅供工具使用，不会增加运行时图结构的复杂性。
3. 子图最终会被工具或 TEN runtime 展平成与现有图结构相同的格式，使用相同的运行机制来启动。
4. 引入子图不会使图的 JSON 结构变得复杂，而是保持其简单形态，通过工具来提升开发者体验和效率。虽然理解展平前的 JSON 可能需要一些人工转换，但我们依赖工具来自动处理这些细节，从而在不增加图复杂度的同时提升开发体验。

以下是一个 `subgraph.json` 的示例，它同时也是一个完整的图，可以单独使用：

```json
{
  "nodes": [
    {
      // 该图包含一个 ext_c
      "type": "extension",
      "name": "ext_c",
      "addon": "addon_c"
    },
    {
      // 该图包含一个 ext_d
      "type": "extension",
      "name": "ext_d",
      "addon": "addon_d"
    }
  ],
  "connections": [
    {
      // 表示 ext_c 将 B 命令传输到 ext_d
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
    // 表示该图向外部暴露哪些消息以供连接。主要供开发工具使用（如 tman）
    // 开发工具可根据这些信息找到真正的消息定义，进行相关检查和提示
    {
      // 表示 ext_d 的 B 命令是该图暴露给外部的消息
      // 开发工具可默认只显示 type 和 name，并通过特定机制额外显示 extension 信息
      "type": "cmd_in",
      "name": "B",
      "extension": "ext_d"
    }
  ]
}
```

子图的设计目的是让开发者能够将一个图当作黑盒，无需关注其内部复杂性，直接使用子图所代表的功能。因此，子图设计原则不会专门为调整子图内部状态提供特殊机制，因为这会增加整个图结构的复杂性，反而降低开发体验。

例如，如果需要将子图内部某个节点的 addon 从 A 改为 B，应该直接修改子图的定义，而不是在引用该子图的地方提供修改子图内容的方法。这种在引用处修补子图定义的做法会增加图的复杂度，不利于开发体验。因为这种修改有可能会有连锁反应，导致其他地方的图定义也需要修改，或需要人工的介入，反而增加了理解的成本。

更具体地说，当将子图 A（例如包含 3 个 extensions 和 6 个 connections）引入到图 B 中时，如果需要调整子图 A 内某个 extension 的 addon，正确做法是直接修改子图 A 的定义文件，而不是在引用处进行修补。还有很多其他需要调整子图内部细节的场景，比如调整某个 extension 的名称，或者调整某个 extension 所属的 extension_group，所属的 app，或者调整某个 connection 的 msg_conversion 规则，这些场景都应该直接修改子图的定义文件，而不是在引用处进行修补，因为这会导致修补的逻辑益发复杂，最终导致图的复杂度增加，不利于开发体验。这是因为子图的初衷是作为黑盒使用，如果需要修改其内部细节，则意味着不再将其视为黑盒。

不过未来的确有可能会需要某些简单的在引入子图的地方进行对子图修补的机制，但很难制定出一个原则来说明哪些图的属性是可以修补的，哪些属性是不能修补的。如果属性是可以修补的，那最终有可能会变成所有属性都可以被修补，但这样将会大大的复杂化子图的引入机制，最终会降低引入子图的开发体验。所以另一种可能就是不允许在引入侧进行修补，而是在需要修改子图的内容时直接修改子图的定义。因此子图的修补机制的原则是除非必要不进行过多的设计，这种过多的设计会增加理解的成本以及处理的复杂度，因此只有在真正需要的时候且工具无法简单的协助开发者处理的时候，才真的引入这种在引用处修补子图的机制。理论上，借助开发工具，修改子图内容（如调整某个 extension 的属性或名称）可以变得简单直接，因此子图机制本身不需要为这些针对子图内的调整提供特殊设计。

以下是引用子图的 `graph.json` 示例：

```json
{
  "nodes": [
    {
      // 该图包含一个 ext_a
      "type": "extension",
      "name": "ext_a",
      "addon": "addon_a"
    },
    {
      // 该图包含一个 ext_b
      "type": "extension",
      "name": "ext_b",
      "addon": "addon_b"
    },
    {
      // 该图包含一个子图，在此图中称为 graph_any_name
      // 该子图的实际定义在 subgraph.json 中
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
            // 表示 ext_a 会将 cmd B 传输给两个目标
            {
              // 第一个目标是 ext_b
              "extension": "ext_b"
            },
            {
              // 第二个目标是 graph_any_name 所代表的图内的 ext_d
              "extension": "graph_any_name:ext_d"
            }
          ]
        }
      ]
    },
    {
      // 该连接表示 graph_any_name 的 ext_c 会将 cmd H 传输给 ext_a
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

虽然在图定义中使用了 `"extension": "graph_any_name:ext_d"` 这种形式，看似让开发者接触到了子图内部细节，但借助 `expose_msgs` 信息和开发工具，开发者实际上可以不直接接触这些细节。当开发者使用工具构建连接时，工具会根据开发意图自动处理这些细节，生成正确的图定义。这符合子图作为语法糖的初衷：不增加图定义的复杂度，而是通过提供信息让工具完成封装，复用图定义，并提升开发体验。

例如，当开发者在工具中查看一个图时，工具会展示该图的 `expose_msgs` 信息，比如 "该图暴露了一个名为 B 的命令"。当开发者将某个 extension 的命令 B 连接到该图暴露的命令 B 时，工具会通过 `expose_msgs` 了解到这个命令实际上要连接到图内的特定 extension，并将这个信息写入最终的图定义中。

总结来说，子图机制没有在引用处提供修改子图定义的功能，因为这违反了子图作为黑盒使用的初衷，也会使子图使用变得复杂。如果需要调整子图内容，应直接修改子图的定义文件。

子图机制引入了以下几个新概念：

1. 图可以通过 `expose_msgs` 字段对外暴露消息，供外界连接。
2. 图的 `nodes` 字段可以引用其他图，并给予一个在此图内的唯一标识名称。
3. 图的 `connections` 字段可以使用引用的子图内的 extension 作为源或目标。

### 展平后的图定义

上述引用子图的图最终会被工具或 TEN runtime 展平成以下定义：

```json
{
  "nodes": [
    {
      // 该图包含一个 ext_a
      "type": "extension",
      "name": "ext_a",
      "addon": "addon_a"
    },
    {
      // 该图包含一个 ext_b
      "type": "extension",
      "name": "ext_b",
      "addon": "addon_b"
    },
    {
      // 将子图的 ext_c 节点定义展平纳入
      "type": "extension",
      "name": "graph_any_name_ext_c",
      "addon": "addon_c"
    },
    {
      // 将子图的 ext_d 节点定义展平纳入
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
            // 表示 ext_a 会将 cmd B 传输给两个目标
            {
              // 第一个目标是 ext_b
              "extension": "ext_b"
            },
            {
              // 第二个目标是 graph_any_name 所代表的图内的 ext_d
              "extension": "graph_any_name_ext_d"
            }
          ]
        }
      ]
    },
    {
      // 该连接表示 graph_any_name 的 ext_c 会将 cmd H 传输给 ext_a
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
      // 将子图的连接定义展平纳入
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
  // 舍弃子图的 expose_msgs 字段，因为该字段仅用于辅助工具，是一种语法糖
}
```

### 包含 msg_conversion 的例子

底下是一个包含了 msg_conversion 机制的例子，展示了如何将 msg_conversion 机制应用到子图的连接上。

```json
{
  "nodes": [
    {
      // 该图包含一个名为 ext_a 的 extension
      "type": "extension",
      "name": "ext_a",
      "addon": "addon_a"
    },
    {
      // 该图包含一个名为 ext_b 的 extension
      "type": "extension",
      "name": "ext_b",
      "addon": "addon_b"
    },
    {
      // 该图包含一个子图，在此图中称为 graph_any_name
      // 该子图的实际定义在 subgraph.json 中
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
              // 第二个目标是 graph_any_name 所代表的图内的 ext_d
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

开发工具可以借由 `expose_msgs` 信息，在开发者构建连接的时候，提示是否是 compatible 的 msgs，并且按需的跳出 msg_conversion 的配置界面。如果开发者选择不进行 msg_conversion，则保持原 msg 不变。反之，在开发者完成了 msg_conversion 的配置后，开发工具会自动将 msg_conversion 的配置写入最终的图定义中。

上图经过展平后，会得到如下的完整图定义：

```json
{
  "nodes": [
    {
      // 该图包含一个名为 ext_a 的 extension
      "type": "extension",
      "name": "ext_a",
      "addon": "addon_a"
    },
    {
      // 该图包含一个名为 ext_b 的 extension
      "type": "extension",
      "name": "ext_b",
      "addon": "addon_b"
    },
    {
      // 将子图的 ext_c 节点定义展平纳入
      "type": "extension",
      "name": "graph_any_name_ext_c",
      "addon": "addon_c"
    },
    {
      // 将子图的 ext_d 节点定义展平纳入
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
              // 第二个目标是 graph_any_name 所代表的图内的 ext_d
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

### 将图放入应用程序的 property.json 中

以上这种使用 `ref` 字段来引用子图的方法，也可以在应用程序的 `property.json` 的 `predefined_graphs` 中使用。

以下是将图放入应用程序的 `property.json` 中的 `predefined_graphs` 的方法：

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
