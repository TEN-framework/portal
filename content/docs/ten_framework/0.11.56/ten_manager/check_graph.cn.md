---
title: 图检查
---

`tman` 提供了 `check graph` 命令，用于验证预定义图或 `start_graph` 命令的正确性。要查看使用细节，请使用以下命令：

```shell
$ tman check graph -h
检查预定义图或 start_graph 命令的图内容是否正确。有关更详细的用法，请运行“graph -h”

用法：tman check graph [选项] --app <APP>

选项：
      --app <APP>
          图中定义的应用程序的绝对路径。默认情况下，将从列表中的第一个应用程序读取预定义图。
      --predefined-graph-name <PREDEFINED_GRAPH_NAME>
          指定要检查的预定义图的名称，否则将检查所有预定义图。
      --graph <GRAPH>
          指定要检查的“start_graph”命令的 JSON 字符串。如果未指定，则将检查第一个应用程序中的预定义图。
  -h, --help
          打印帮助信息
```

`check graph` 命令旨在处理可能跨越多个应用程序的图，因此不需要从特定应用程序的根目录运行。相反，它可以从任何目录执行，并使用 `--app` 参数指定图中涉及的应用程序的文件夹。

## 使用示例

- **检查 `property.json` 中的所有预定义图：**

  ```shell
  tman check graph --app /home/TEN-Agent/agents
  ```

- **检查特定的预定义图：**

  ```shell
  tman check graph --predefined-graph-name va.openai.azure --app /home/TEN-Agent/agents
  ```

- **检查 `start_graph` 命令：**

  ```shell
  tman check graph --graph '{
    "type": "start_graph",
    "seq_id": "55",
    "nodes": [
      {
        "type": "extension",
        "name": "test_extension",
        "addon": "basic_hello_world_2__test_extension",
        "extension_group": "test_extension_group",
        "app": "msgpack://127.0.0.1:8001/"
      },
      {
        "type": "extension",
        "name": "test_extension",
        "addon": "basic_hello_world_1__test_extension",
        "extension_group": "test_extension_group",
        "app": "msgpack://127.0.0.1:8001/"
      }
    ]
  }' --app /home/TEN-Agent/agents
  ```

## 前提条件

- **预定义图定义要求：** 如果指定了预定义图的名称，则将从第一个 `--app` 参数指定的应用程序的 `property.json` 文件中提取其定义。
- **包安装要求：** 在运行 `check graph` 命令之前，必须使用 `tman install` 命令安装应用程序依赖的所有扩展。这是必需的，因为验证过程需要有关图中每个扩展的信息，例如其 `manifest.json` 文件中定义的 API。
- **唯一应用程序 URI 要求：** 在多应用程序图中，每个应用程序的 `property.json` 必须定义唯一的 `ten::uri`。此外，`uri` 值不能设置为 `"localhost"`。

## 验证规则

### 1. 节点 (Nodes) 的存在性

任何图定义中都必须存在 `nodes` 数组。如果缺少该数组，将会抛出错误。

- **示例（未定义节点）：**

  ```shell
  tman check graph --graph '{
    "type": "start_graph",
    "seq_id": "55",
    "nodes": []
  }' --app /home/TEN-Agent/agents
  ```

  **输出：**

  ```text
  Checking graph[0]... ❌. Details:
    No extension node is defined in graph.

  All is done.
  ❌  Error: 1/1 graphs failed.
  ```

### 2. 节点的唯一性

`nodes` 数组中的每个节点表示一个应用程序组中由指定插件创建的特定扩展实例。因此，每个扩展实例都应该由一个单独的节点唯一表示。必须通过 `app`、`extension_group` 和 `name` 的组合来唯一标识一个节点。不允许出现同一扩展实例的多个条目。

- **示例（重复节点）：**

  ```shell
  tman check graph --graph '{
    "type": "start_graph",
    "seq_id": "55",
    "nodes": [
      {
        "type": "extension",
        "name": "test_extension",
        "addon": "basic_hello_world_2__test_extension",
        "extension_group": "test_extension_group",
        "app": "msgpack://127.0.0.1:8001/"
      },
      {
        "type": "extension",
        "name": "test_extension",
        "addon": "basic_hello_world_1__test_extension",
        "extension_group": "test_extension_group",
        "app": "msgpack://127.0.0.1:8001/"
      }
    ]
  }' --app /home/TEN-Agent/agents
  ```

  **输出：**

  ```text
  Checking graph[0]... ❌. Details:
    Duplicated extension was found in nodes[1], addon: basic_hello_world_1__test_extension, name: test_extension.

  All is done.
  ❌  Error: 1/1 graphs failed.
  ```

### 3. 在通信链路中使用的扩展应在 nodes 中定义

`connections` 字段中引用的所有扩展实例（无论是作为源还是目标）都必须在 `nodes` 字段中显式定义。任何未在 `nodes` 数组中定义的实例都会导致验证错误。

- **示例（未定义源扩展）：**

  假设一个 TEN 应用程序的 `property.json` 文件的内容如下。

  ```json
  {
    "ten": {
      "predefined_graphs": [
        {
          "name": "default",
          "auto_start": false,
          "nodes": [
            {
              "type": "extension",
              "name": "some_extension",
              "addon": "default_extension_go",
              "extension_group": "some_group"
            }
          ],
          "connections": [
            {
              "extension": "some_extension",
              "cmd": [
                {
                  "name": "hello",
                  "dest": [
                    {
                      "extension": "some_extension"
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

  ```shell
  tman check graph --app /home/TEN-Agent/agents
  ```

  **输出：**

  ```text
  Checking graph[0]... ❌. Details:
    The extension declared in connections[0] is not defined in nodes, extension_group: producer, extension: some_extension.

  All is done.
  ❌  Error: 1/1 graphs failed.
  ```

- **示例（未定义目标扩展）：**

  假设一个 TEN 应用程序的 `property.json` 文件的内容如下。

  ```json
  {
    "ten": {
      "predefined_graphs": [
        {
          "name": "default",
          "auto_start": false,
          "nodes": [
            {
              "type": "extension",
              "name": "some_extension",
              "addon": "default_extension_go",
              "extension_group": "some_group"
            },
            {
              "type": "extension",
              "name": "some_extension_1",
              "addon": "default_extension_go",
              "extension_group": "some_group"
            }
          ],
          "connections": [
            {
              "extension": "some_extension",
              "cmd": [
                {
                  "name": "hello",
                  "dest": [
                    {
                      "extension": "some_extension_1"
                    }
                  ]
                },
                {
                  "name": "world",
                  "dest": [
                    {
                      "extension": "some_extension_1"
                    },
                    {
                      "extension": "consumer"
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

  ```shell
  tman check graph --app /home/TEN-Agent/agents
  ```

  **输出：**

  ```text
  Checking graph[0]... ❌. Details:
    The extension declared in connections[0].cmd[1] is not defined in nodes extension_group: some_group, extension: consumer.

  All is done.
  ❌  Error: 1/1 graphs failed.
  ```

### 4. 在 `nodes` 中声明的插件必须安装在应用中

- **示例（`property.json` 中的 `ten::uri` 与 `nodes` 中的 `app` 字段不相等）：**

  假设一个 TEN 应用程序的 `property.json` 文件的内容如下。

  ```json
  {
    "ten": {
      "predefined_graphs": [
        {
          "name": "default",
          "auto_start": false,
          "nodes": [
            {
              "type": "extension",
              "name": "some_extension",
              "addon": "default_extension_go",
              "extension_group": "some_group"
            }
          ]
        }
      ],
      "uri": "http://localhost:8001"
    }
  }
  ```

  ```shell
  tman check graph --app /home/TEN-Agent/agents
  ```

  **输出：**

  ```text
  Checking graph[0]... ❌. Details:
    The following packages are declared in nodes but not installed: [("localhost", Extension, "default_extension_go")].

  All is done.
  ❌  Error: 1/1 graphs failed.
  ```

  问题在于，应用程序中的所有包都将存储在以应用程序的 `uri` 为键的映射中，并且图中的每个节点都将通过 `app` 字段（默认为 `localhost`）检索。节点中的 `app`（即 `localhost`）与应用程序的 `uri`（即 `http://localhost:8001`）不匹配。

- **示例（由于未执行 `tman install` 而导致 `ten_packages` 目录不存在）：**

  假设一个 TEN 应用程序的 `property.json` 文件的内容如下。

  ```json
  {
    "ten": {
      "predefined_graphs": [
        {
          "name": "default",
          "auto_start": false,
          "nodes": [
            {
              "type": "extension",
              "name": "some_extension",
              "addon": "default_extension_go",
              "extension_group": "some_group"
            }
          ]
        }
      ]
    }
  }
  ```

  并且 `ten_packages` 目录**不存在**。

  ```shell
  tman check graph --app /home/TEN-Agent/agents
  ```

  **输出：**

  ```text
  Checking graph[0]... ❌. Details:
    The following packages are declared in nodes but not installed: [("localhost", Extension, "default_extension_go")].

  All is done.
  ❌  Error: 1/1 graphs failed.
  ```

### 5. 在 通信链路中，从一个扩展发送的消息应在同一部分中定义

- **示例：**

  假设所有包都已安装。

  ```shell
  tman check graph --graph '{
    "nodes": [
      {
        "type": "extension",
        "name": "some_extension",
        "addon": "default_extension_go",
        "extension_group": "some_group"
      },
      {
        "type": "extension",
        "name": "another_ext",
        "addon": "default_extension_go",
        "extension_group": "some_group"
      }
    ],
    "connections": [
      {
        "extension": "some_extension",
        "cmd": [
          {
            "name": "hello",
            "dest": [
              {
                "extension": "another_ext"
              }
            ]
          }
        ]
      },
      {
        "extension": "some_extension",
        "cmd": [
          {
            "name": "hello_2",
            "dest": [
              {
                "extension": "another_ext"
              }
            ]
          }
        ]
      }
    ]
  }' --app /home/TEN-Agent/agents
  ```

  **输出：**

  ```text
  Checking graph[0]... ❌. Details:
    extension 'some_extension' is defined in connection[0] and connection[1], merge them into one section.

  All is done.
  ❌  Error: 1/1 graphs failed.
  ```

### 6. 在 通信链路中，从一个扩展发出的消息在每个类型中应具有唯一的名称

- **示例：**

  假设所有包都已安装。

  ```shell
  tman check graph --graph '{
    "nodes": [
      {
        "type": "extension",
        "name": "some_extension",
        "addon": "addon_a",
        "extension_group": "some_group"
      },
      {
        "type": "extension",
        "name": "another_ext",
        "addon": "addon_b",
        "extension_group": "some_group"
      }
    ],
    "connections": [
      {
        "extension": "some_extension",
        "cmd": [
          {
            "name": "hello",
            "dest": [
              {
                "extension": "another_ext"
              }
            ]
          },
          {
            "name": "hello",
            "dest": [
              {
                "extension": "some_extension"
              }
            ]
          }
        ]
      }
    ]
  }' --app /home/TEN-Agent/agents
  ```

  **输出：**

  ```text
  Checking graph[0]... ❌. Details:
    - connection[0]:
     - Merge the following cmd into one section:
        'hello' is defined in flow[0] and flow[1].

  All is done.
  ❌  Error: 1/1 graphs failed.
  ```

### 7. 通信链路中声明的消息应兼容

根据扩展的 `manifest.json` 文件中的模式定义，将检查在 `connections` 中的每个消息流中声明的消息的模式是否兼容。消息兼容的规则如下。

- 如果在源扩展和目标扩展中都找不到消息模式，则消息是兼容的。
- 如果仅在其中一个扩展中找到消息模式，则该消息不兼容。
- 只有满足以下条件，消息才是兼容的：

  - 属性类型兼容。
    - 如果属性是一个对象，则源模式和目标模式中的字段都必须具有兼容的类型。
    - 如果在目标模式中定义了 `required` 关键字，则源模式中必须存在一个 `required` 关键字，该关键字是目标中 `required` 的超集。

- **示例：**

  假设所有包都已安装。

  `addon_a` 中的 `manifest.json` 的内容如下。

  ```json
  {
    "type": "extension",
    "name": "addon_a",
    "version": "0.1.0",
    "dependencies": [
      {
        "type": "system",
        "name": "ten_runtime_go",
        "version": "0.1.0"
      }
    ],
    "package": {
      "include": ["**"]
    },
    "api": {
      "cmd_out": [
        {
          "name": "cmd_1",
          "property": {
            "foo": {
              "type": "string"
            }
          }
        }
      ]
    }
  }
  ```

  并且，`addon_b` 中的 `manifest.json` 的内容如下。

  ```json
  {
    "type": "extension",
    "name": "addon_b",
    "version": "0.1.0",
    "dependencies": [
      {
        "type": "system",
        "name": "ten_runtime_go",
        "version": "0.1.0"
      }
    ],
    "package": {
      "include": ["**"]
    },
    "api": {
      "cmd_in": [
        {
          "name": "cmd_1",
          "property": {
            "foo": {
              "type": "int8"
            }
          }
        }
      ]
    }
  }
  ```

  使用以下命令检查图。

  ```shell
  tman check graph --graph '{
    "nodes": [
      {
        "type": "extension",
        "name": "some_extension",
        "addon": "addon_a",
        "extension_group": "some_group"
      },
      {
        "type": "extension",
        "name": "another_ext",
        "addon": "addon_b",
        "extension_group": "some_group"
      }
    ],
    "connections": [
      {
        "extension": "some_extension",
        "cmd": [
          {
            "name": "cmd_1",
            "dest": [
              {
                "extension": "another_ext"
              }
            ]
          }
        ]
      }
    ]
  }' --app /home/TEN-Agent/agents
  ```

  **输出：**

  ```text
  Checking graph[0]... ❌. Details:
    - connections[0]:
      - cmd[0]:  Schema incompatible to [extension_group: some_group, extension: another_ext], { .foo: type is incompatible, source is [string], but target is [int8] }

  All is done.
  ❌ Error: 1/1 graphs failed.
  ```

### 8. 节点中的 `app` 必须明确

每个节点中的 `app` 字段必须满足以下规则。

- `app` 字段必须等于相应 TEN 应用程序的 `ten::uri`。
- 要么所有节点都应该声明 `app`，要么都不应该声明。
- `app` 字段不能为 `localhost`。
- `app` 字段不能为空字符串。
- **示例（某些节点指定了 `app` 字段）：**

  使用以下命令检查图。

  ```shell
  tman check graph --graph '{
    "nodes": [
      {
        "type": "extension",
        "name": "some_extension",
        "addon": "addon_a",
        "extension_group": "some_group"
      },
      {
        "type": "extension",
        "name": "another_ext",
        "addon": "addon_b",
        "extension_group": "some_group",
        "app": "http://localhost:8000"
      }
    ]
  }' --app /home/TEN-Agent/agents
  ```

  **输出：**

  ```text
  ❌  Error: The graph json string is invalid

  Caused by:
    Either all nodes should have 'app' declared, or none should, but not a mix of both.
  ```

- **示例（所有节点均未指定 `app`，但某些源扩展在通信链路中指定了 `app`）：**

  使用以下命令检查图。

  ```shell
  tman check graph --graph '{
    "nodes": [
      {
        "type": "extension",
        "name": "some_extension",
        "addon": "addon_a",
        "extension_group": "some_group"
      },
      {
        "type": "extension",
        "name": "another_ext",
        "addon": "addon_b",
        "extension_group": "some_group"
      }
    ],
    "connections": [
     {
        "extension": "some_extension",
        "app": "http://localhost:8000",
        "cmd": [
          {
            "name": "cmd_1",
            "dest": [
              {
                "extension": "another_ext"
              }
            ]
          }
        ]
      }
    ]
  }' --app /home/TEN-Agent/agents
  ```

  **输出：**

  ```text
  ❌  Error: The graph json string is invalid

  Caused by:
    connections[0].the 'app' should not be declared, as not any node has declared it
  ```

- **示例（所有节点均未指定 `app`，但某些目标扩展在通信链路中指定了 `app`）：**

  使用以下命令检查图。

  ```shell
  tman check graph --graph '{
    "nodes": [
      {
        "type": "extension",
        "name": "some_extension",
        "addon": "addon_a",
        "extension_group": "some_group"
      },
      {
        "type": "extension",
        "name": "another_ext",
        "addon": "addon_b",
        "extension_group": "some_group"
      }
    ],
    "connections": [
      {
        "extension": "some_extension",
        "cmd": [
          {
            "name": "cmd_1",
            "dest": [
              {
                "extension": "another_ext",
                "app": "http://localhost:8000"
              }
            ]
          }
        ]
      }
    ]
  }' --app /home/TEN-Agent/agents
  ```

  **输出：**

  ```text
  ❌  Error: The graph json string is invalid

  Caused by:
    connections[0].cmd[0].dest[0]: the 'app' should not be declared, as not any node has declared it
  ```

- **示例 (节点中的 `app` 字段与应用程序的 `ten::uri` 不相等)：**

  与 [规则 4](#id-4.-the-addons-declared-in-the-nodes-must-be-installed-in-the-app) 相同。

- **示例（单应用图中 `app` 字段为 `localhost`）：**

  使用以下命令检查图。

  ```shell
  tman check graph --graph '{
    "nodes": [
      {
        "type": "extension",
        "name": "some_extension",
        "addon": "addon_a",
        "extension_group": "some_group"
      },
      {
        "type": "extension",
        "name": "another_ext",
        "addon": "addon_b",
        "extension_group": "some_group",
        "app": "localhost"
      }
    ],
    "connections": [
      {
        "extension": "some_extension",
        "cmd": [
          {
            "name": "cmd_1",
            "dest": [
              {
                "extension": "another_ext"
              }
            ]
          }
        ]
      }
    ]
  }' --app /home/TEN-Agent/agents
  ```

  **输出：**

  ```text
  ❌  Error: Failed to parse graph string, nodes[1]: 'localhost' is not allowed in graph definition, and the graph seems to be a single-app graph, just remove the 'app' field
  ```

- **示例（多应用图中 `app` 字段为 `localhost`）：**

  使用以下命令检查图。

  ```shell
  tman check graph --graph '{
    "nodes": [
      {
        "type": "extension",
        "name": "some_extension",
        "addon": "addon_a",
        "extension_group": "some_group",
        "app": "http://localhost:8000"
      },
      {
        "type": "extension",
        "name": "another_ext",
        "addon": "addon_b",
        "extension_group": "some_group",
        "app": "localhost"
      }
    ],
    "connections": [
      {
        "extension": "some_extension",
        "app": "http://localhost:8000",
        "cmd": [
          {
            "name": "cmd_1",
            "dest": [
              {
                "extension": "another_ext"
              }
            ]
          }
        ]
      }
    ]
  }' --app /home/TEN-Agent/agents
  ```

  **输出：**

  ```text
  ❌  Error: Failed to parse graph string, nodes[1]: 'localhost' is not allowed in graph definition, change the content of 'app' field to be consistent with 'ten::uri'
  ```
