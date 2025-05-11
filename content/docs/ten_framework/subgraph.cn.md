---
title: 子图
---

## 子图

TEN 的核心运作机制是图（graph），一个图可以包含多个节点（nodes）和多个连接（connections）。

### 基本图结构

以下是一个仅涉及单个 TEN app 的图定义示例：

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

### 子图概念及设计原则

有时我们希望将一个图拆分成多个可复用的部分，这时就需要子图（subgraph）概念。子图本质上是一种语法糖（syntax sugar），它最终会被展平到所属的大图中，然后使用相同的机制启动。子图的设计原则如下：

1. **独立性**：子图本身是一个完整的图，可以单独启动，也可以嵌入到其他图中。

2. **工具友好**：图可以提供额外信息，帮助开发工具理解图结构，提升开发体验，但这些信息不会增加运行时的复杂度。

3. **展平机制**：子图最终会被工具或 TEN runtime 展平为与现有图结构相同的图，使用相同的运行机制。

4. **简洁性**：引入子图不会使图的 JSON 结构变得复杂，而是通过工具提升开发效率。

### 子图示例

以下是一个 `subgraph.json` 的示例，它既是一个正常的图，也可以作为子图被引用：

```json
{
  "nodes": [
    {
      // 该图包含一个 ext_c
      "type": "extension",
      "name": "ext_c",
      "addon": "extension_c"
    },
    {
      // 该图包含一个 ext_d
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
    // 表示该图向外部暴露哪些消息供连接
    // 主要供开发工具使用，便于查找真正的消息定义并进行检查和提示
    {
      // ext_d 的 B 命令是该图暴露给外部的消息
      "type": "cmd_in",
      "name": "B",
      "extension": "ext_d"
    }
  ]
}
```

### 子图的黑盒原则

子图的设计目的是让开发者能够将一个图当作黑盒，无需关注其内部复杂性，直接使用子图所代表的功能。因此，子图设计原则不会专门为调整子图内部状态提供特殊机制，因为这会增加整个图结构的复杂性，反而降低开发体验。

例如，如果需要将子图内部某个节点的 addon 从 A 改为 B，应该直接修改子图的定义，而不是在引用该子图的地方提供修改子图内容的方法。这种在引用处修补子图定义的做法会增加图的复杂度，不利于开发体验。因为这种修改有可能会有连锁反应，导致其他地方的图定义也需要修改，或需要人工的介入，反而增加了理解的成本。

更具体地说，当将子图 A（例如包含 3 个 extensions 和 6 个 connections）引入到图 B 中时，如果需要调整子图 A 内某个 extension 的 addon，正确做法是直接修改子图 A 的定义文件，而不是在引用处进行修补。还有很多其他需要调整子图内部细节的场景，比如调整某个 extension 的名称，或者调整某个 extension 所属的 extension_group，所属的 app，或者调整某个 connection 的 msg_conversion 规则，这些场景都应该直接修改子图的定义文件，而不是在引用处进行修补，因为这会导致修补的逻辑益发复杂，最终导致图的复杂度增加，不利于开发体验。这是因为子图的初衷是作为黑盒使用，如果需要修改其内部细节，则意味着不再将其视为黑盒。

不过未来的确有可能会需要某些简单的在引入子图的地方进行对子图修补的机制，但很难制定出一个原则来说明哪些图的属性是可以修补的，哪些属性是不能修补的。如果属性是可以修补的，那最终有可能会变成所有属性都可以被修补，但这样将会大大的复杂化子图的引入机制，最终会降低引入子图的开发体验。所以另一种可能就是不允许在引入侧进行修补，而是在需要修改子图的内容时直接修改子图的定义。因此子图的修补机制的原则是除非必要不进行过多的设计，这种过多的设计会增加理解的成本以及处理的复杂度，因此只有在真正需要的时候且工具无法简单的协助开发者处理的时候，才真的引入这种在引用处修补子图的机制。理论上，借助开发工具，修改子图内容（如调整某个 extension 的属性或名称）可以变得简单直接，因此子图机制本身不需要为这些针对子图内的调整提供特殊设计。

总结来说，子图的设计目的是让开发者能将其视为黑盒，直接使用其功能而无需关心内部细节。因此：

- 如需修改子图内部（如更改节点的 addon），应直接修改子图定义，而非在引用处提供修补机制。
- 修补子图定义会增加复杂度，违背子图的黑盒原则，降低开发体验。

### 引用子图示例

以下是引用子图的 `graph.json` 示例：

```json
{
  "nodes": [
    {
      // 该图包含一个 ext_a
      "type": "extension",
      "name": "ext_a",
      "addon": "extension_a"
    },
    {
      // 该图包含一个 ext_b
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

1. 呈现子图暴露的命令（如名为 B 的 cmd）
2. 让开发者直接连接到这些暴露的命令
3. 自动处理内部细节并生成正确的图定义

### 子图引入的关键概念

子图机制引入了三个关键概念：

1. **消息暴露**：图可通过 `expose_msgs` 字段对外暴露消息，供开发工具查找和提示，隐藏图内部细节。

2. **子图引用与命名**：图的 `nodes` 字段可引用其他图，并赋予唯一标识名称，作为命名空间防止冲突。

3. **跨图连接**：图的 `connections` 字段可引用子图内的 extension 作为源或目标，通过命名空间区分不同子图中的同名 extension。

### 展平机制

引用子图的图最终会被展平为以下结构：

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
  // expose_msgs 字段被舍弃，因为它仅用于辅助工具
}
```

### 在应用中使用图

以下是将图放入应用程序的 `property.json` 中的方法：

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
