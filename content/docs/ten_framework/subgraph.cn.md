---
title: 子图
---

## 子图

TEN 的核心运作机制是图 (graph)，一个图可以包含多个节点 (nodes) 以及多个连接 (connections)。以下是一个仅涉及单个 TEN app 的图定义示例：

```json
{
  "nodes": [
    {
      // 该图包含一个名为 ext_a 的 extension。
      "type": "extension",
      "name": "ext_a",
      "addon": "addon_a"
    },
    {
      // 该图包含一个名为 ext_b 的 extension。
      "type": "extension",
      "name": "ext_b",
      "addon": "addon_b"
    }
  ],
  "connections": [
    {
      // 该图包含一个连接，其源为 ext_a，目标为 ext_b，并在该连接上传输名为 cmd_1 的命令。
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
      // 该图包含一个名为 ext_a 的 extension。
      "type": "extension",
      "name": "ext_a",
      "addon": "addon_a",
      "app": "http://app_a"
    },
    {
      // 该图包含一个名为 ext_b 的 extension。
      "type": "extension",
      "name": "ext_b",
      "addon": "addon_b",
      "app": "http://app_b"
    }
  ],
  "connections": [
    {
      // 该图包含一个连接，其源为 ext_a，目标为 ext_b，并在该连接上传输名为 cmd_1 的命令。
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

然而，有时我们希望将一个图拆分成多个图，并且希望这些图可以被复用。这时就引入了子图 (subgraph) 的概念。子图在设计时，特别被设计为一种语法糖 (syntax sugar)，子图的引入并不会改变图原本的运作机制。子图设计的幾个原则如下：

1. 子图会提供额外的信息，使工具能更容易理解子图的结构，工具可以显示并使用这些信息来提升开发体验，并且更容易对子图进行操作。但这些信息仅供工具使用，不会导致图的整体结构变得复杂。
2. 子图最终会被工具或 TEN runtime 展平成跟现有的圖結構相同的图，继而使用相同的运行机制来启动整個图。
3. 子图虽然可以嵌入到其他图中，但本身就是一个正常的图，如有需要可以单独启动。
4. 引入子图不会使图的 JSON 結構变得复杂，而是让图的 JSON 本身仍保持简单的形态，通过工具来提升开发者体验和开发效率。

以下是一个 `subgraph.json` 的示例，注意它同时也是一个正常的图，可以单独使用：

```json
{
  "nodes": [
    {
      // 该图包含一个 ext_c。
      "type": "extension",
      "name": "ext_c",
      "addon": "extension_c"
    },
    {
      // 该图包含一个 ext_d。
      "type": "extension",
      "name": "ext_d",
      "addon": "extension_d"
    }
  ],
  "connections": [
    {
      // 表示 ext_c 将 B 命令传输到 ext_d。
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
    // 表示该图向外部暴露哪些消息以供连接。主要供开发工具使用（如 tman），开发工具可根据这些 expose_msgs 信息找到真正的消息定义，然后像正常情况一样，利用这些消息定义进行相关检查和提示。
    {
      // 表示 ext_d 的 B 命令是该图暴露给外部的消息。开发工具可以选择默认只显示 type 和 name，并通过某些机制额外显示 extension 的信息。
      "type": "cmd_in",
      "name": "B",
      "extension": "ext_d"
    }
  ]
}
```

子图的设计目的是让开发者能够将一个图当作黑盒，无需触及其内部复杂性，直接使用子图所代表的功能。因此整个子图的设计原則是不会特别为调整子图内部状态而做额外设计，因为这会导致整个图结构的复杂性提高，而这种复杂性的提高反而会降低开发体验。例如，如果子图内部某个 node 想由 addon A 改为 addon B，那就需要直接修改子图的定义本身，而不是在其他图引入该子图时在 JSON 内提供修改子图内容的方法。这种修补子图定义的做法会导致图的复杂度提高，从而降低开发体验。

例如，当将一个子图 A 引入到另一个图 B 中时，假设该子图 A 内有 3 个 extensions 和 6 个 connections。如果开发者想要调整子图 A 内的 extension 1 的 addon，那么适合的做法是直接修改子图的图定义，而不是在引用处进行修补。因为这与子图的初衷不符，子图的初衷是让开发者将子图视为一个黑盒，无需触及其内部复杂性。如果确实需要触及其内部复杂性，那就意味着不再将子图视为黑盒。

藉由工具的協助，修改一個子圖的內容，例如調整某個 extension 的 property，調整某個 extension 的 name 等等這些不再視子圖為黑盒的行為，開發者也可以輕鬆地完成。子圖的機制不特別為這些調整子圖內的定義做額外的設計。

以下是引用了一个子图的 `graph.json`：

```json
{
  "nodes": [
    {
      // 该图包含一个 ext_a。
      "type": "extension",
      "name": "ext_a",
      "addon": "extension_a"
    },
    {
      // 该图包含一个 ext_b。
      "type": "extension",
      "name": "ext_b",
      "addon": "extension_b"
    },
    {
      // 该图包含一个子图，在此图中称该子图为 graph_any_name，该子图的实际定义在 subgraph.json 中。
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
            // 表示 ext_a 会将 cmd B 传输给两个目标。
            {
              // 第一个目标是 ext_b。
              "extension": "ext_b"
            },
            {
              // 第二个目标是 graph_any_name 所代表的图内的 ext_d。
              "extension": "graph_any_name:ext_d"
            }
          ]
        }
      ]
    },
    {
      // 该连接表示 graph_any_name 的 ext_c 会将 cmd H 传输给 ext_a。
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

虽然在图的定义中使用了 `"extension": "graph_any_name:ext_d"` 这种描述，看似让开发者接触到了子图内部的细节，但借助图的 `expose_msgs` 信息以及开发工具的辅助，开发者在使用工具时可以不需接触子图内部的细节。当工具按照开发者的意图操作时，工具最终会自动为开发者处理好这些细节，并生成正确的图定义。这也符合子图的初衷，子图更多是一种语法糖，不增加图定义本身的复杂度，而是提供信息让工具完成足够的封装，提升开发体验。

例如，当开发者在工具中看到一个图时，工具可以呈现该图的 expose_msgs 信息，如该图暴露了一个名为 B 的 cmd。当开发者通过工具将某个 extension 的 cmd B 连接到图所暴露的 B cmd 时，工具会通过 expose_msgs 的信息了解到这个命令 B 要连接的目标实际上是图内的某个 extension，并将这个信息写入最终的图定义中，也就是上面 JSON 中呈现的样子。

总结来说，子图机制并没有在引用处提供修补子图定义的机制，因为这相当于触及了子图的内容，违反了子图的初衷，而且也会使子图的使用变得复杂，并不一定是好事。因此，开发者如果想要调整子图的内容，应该直接修改子图的定义本身，而不是在引用处进行修补。

子图机制总共引入了以下几个新概念：

1。图可以对外暴露开放了哪些消息供外界连接（即 `expose_msgs` 字段）。
2。图的 `nodes` 字段可以引用其他图，并给予一个在此图内的唯一标识名称。
3。图的 `connections` 字段可以使用图内的 extension 作为其源或目标。

因此，上述引用了子图的图最终会被工具或 TEN runtime 展平成以下定义：

```json
{
  "nodes": [
    {
      // 该图包含一个 ext_a。
      "type": "extension",
      "name": "ext_a",
      "addon": "extension_a"
    },
    {
      // 该图包含一个 ext_b。
      "type": "extension",
      "name": "ext_b",
      "addon": "extension_b"
    },
    {
      // 将子图的 ext_c 节点定义展平纳入。
      "type": "extension",
      "name": "graph_any_name_ext_c",
      "addon": "extension_c"
    },
    {
      // 将子图的 ext_d 节点定义展平纳入。
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
            // 表示 ext_a 会将 cmd B 传输给两个目标。
            {
              // 第一个目标是 ext_b。
              "extension": "ext_b"
            },
            {
              // 第二个目标是 graph_any_name 所代表的图内的 ext_d。
              "extension": "graph_any_name_ext_d"
            }
          ]
        }
      ]
    },
    {
      // 该连接表示 graph_any_name 的 ext_c 会将 cmd H 传输给 ext_a。
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
      // 将子图的连接定义展平纳入。
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
  // 舍弃子图的 expose_msgs 字段，因为该字段仅用于辅助工具，是一种语法糖。
}
```

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
