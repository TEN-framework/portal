---
title: Subgraph
---

## Subgraph

The core operating mechanism of TEN is a graph, which can contain multiple nodes and multiple connections. Below is an example of a graph definition involving a single TEN app:

```json
{
  "nodes": [
    {
      // This graph contains an extension named ext_a.
      "type": "extension",
      "name": "ext_a",
      "addon": "addon_a"
    },
    {
      // This graph contains an extension named ext_b.
      "type": "extension",
      "name": "ext_b",
      "addon": "addon_b"
    }
  ],
  "connections": [
    {
      // This graph contains a connection with ext_a as the source, ext_b as the destination, and transmits a command named cmd_1 on this connection.
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

Below is an example of a graph definition involving multiple TEN apps:

```json
{
  "nodes": [
    {
      // This graph contains an extension named ext_a.
      "type": "extension",
      "name": "ext_a",
      "addon": "addon_a",
      "app": "http://app_a"
    },
    {
      // This graph contains an extension named ext_b.
      "type": "extension",
      "name": "ext_b",
      "addon": "addon_b",
      "app": "http://app_b"
    }
  ],
  "connections": [
    {
      // This graph contains a connection with ext_a as the source, ext_b as the destination, and transmits a command named cmd_1 on this connection.
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

However, sometimes we want to split a graph into multiple graphs and want these graphs to be reusable. This is where the concept of a subgraph is introduced. Subgraphs are specifically designed as a syntax sugar; the introduction of subgraphs does not change the original operating mechanism of graphs. Several design principles for subgraphs are as follows:

1. Subgraphs provide additional information that allows tools to more easily understand the structure of the subgraph. Tools can display and use this information to enhance the development experience and make it easier to operate on subgraphs. However, this information is only for tool use and does not make the overall structure of the graph more complex.
2. Subgraphs are ultimately flattened by tools or the TEN runtime into the same graph structure as existing graphs, and then use the same running mechanism to start the entire graph.
3. Although subgraphs can be embedded in other graphs, they are normal graphs themselves and can be started independently if needed.
4. The introduction of subgraphs does not make the JSON structure of the graph more complex. Instead, it keeps the JSON of the graph in a simple form, using tools to enhance the developer experience and development efficiency.

Below is an example of a `subgraph.json`, note that it is also a normal graph that can be used independently:

```json
{
  "nodes": [
    {
      // This graph contains an ext_c.
      "type": "extension",
      "name": "ext_c",
      "addon": "extension_c"
    },
    {
      // This graph contains an ext_d.
      "type": "extension",
      "name": "ext_d",
      "addon": "extension_d"
    }
  ],
  "connections": [
    {
      // Indicates that ext_c transmits command B to ext_d.
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
    // Indicates which messages this graph exposes to the outside for connection. Mainly for use by development tools (such as tman), which can find the actual message definitions based on these expose_msgs, and then use these message definitions for relevant checks and prompts as in normal cases.
    {
      // Indicates that ext_d's command B is a message exposed by this graph to the outside. Development tools can choose to display only type and name by default, and display extension information through certain mechanisms.
      "type": "cmd_in",
      "name": "B",
      "extension": "ext_d"
    }
  ]
}
```

The design purpose of subgraphs is to allow developers to treat a graph as a black box, using the functionality represented by the subgraph without having to deal with its internal complexity. Therefore, the entire design principle of subgraphs is not to make additional designs specifically for adjusting the internal state of the subgraph, as this would increase the complexity of the entire graph structure, which in turn would decrease the development experience. For example, if a node within a subgraph wants to change from addon A to addon B, then the definition of the subgraph itself should be modified directly, rather than providing a method to modify the content of the subgraph in the JSON when referencing the subgraph from another graph. This approach of patching the subgraph definition would increase the complexity of the graph, thus degrading the development experience.

For instance, when introducing a subgraph A into another graph B, assuming that subgraph A contains 3 extensions and 6 connections, if a developer wants to adjust the addon of extension 1 within subgraph A, the appropriate approach is to directly modify the graph definition of the subgraph, rather than patching it at the reference point. This is because it contradicts the original intention of subgraphs, which is to allow developers to view them as black boxes without touching their internal complexity. If there is indeed a need to touch the internal complexity, it means the subgraph is no longer being viewed as a black box.

With the assistance of tools, modifying the content of a subgraph, such as adjusting the property of an extension, adjusting the name of an extension, and other actions that no longer view the subgraph as a black box, can also be easily accomplished by developers. The subgraph mechanism does not specifically design for these adjustments to the definitions within the subgraph.

Below is a `graph.json` that references a subgraph:

```json
{
  "nodes": [
    {
      // This graph contains an ext_a.
      "type": "extension",
      "name": "ext_a",
      "addon": "extension_a"
    },
    {
      // This graph contains an ext_b.
      "type": "extension",
      "name": "ext_b",
      "addon": "extension_b"
    },
    {
      // This graph contains a subgraph, referred to as graph_any_name in this graph, with its actual definition in subgraph.json.
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
            // Indicates that ext_a will transmit cmd B to two destinations.
            {
              // The first destination is ext_b.
              "extension": "ext_b"
            },
            {
              // The second destination is ext_d within the graph represented by graph_any_name.
              "extension": "graph_any_name:ext_d"
            }
          ]
        }
      ]
    },
    {
      // This connection indicates that ext_c of graph_any_name will transmit cmd H to ext_a.
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

Although the graph definition uses descriptions like `"extension": "graph_any_name:ext_d"`, which seems to expose developers to the internal details of the subgraph, with the help of the `expose_msgs` information of the graph and the assistance of development tools, developers can use tools without needing to touch the internal details of the subgraph. When the tool operates according to the developer's intention, it will automatically handle these details for the developer and generate the correct graph definition. This also aligns with the original intention of subgraphs, which are more of a syntax sugar that does not increase the complexity of the graph definition itself but provides information for tools to complete sufficient encapsulation and enhance the development experience.

For example, when a developer sees a graph in a tool, the tool can present the expose_msgs information of the graph, such as a cmd named B exposed by the graph. When the developer uses the tool to connect cmd B of a certain extension to the B cmd exposed by the graph, the tool, through the information in expose_msgs, understands that the target of this command B is actually an extension within the graph, and writes this information into the final graph definition, which is the form shown in the JSON above.

In summary, the subgraph mechanism does not provide a mechanism to patch the subgraph definition at the reference point, because this amounts to touching the content of the subgraph, violating the original intention of subgraphs, and would also make the use of subgraphs complex, which is not necessarily a good thing. Therefore, if developers want to adjust the content of a subgraph, they should directly modify the definition of the subgraph itself, rather than patching it at the reference point.

The subgraph mechanism introduces the following new concepts:

1. A graph can expose which messages are open for external connection (i.e., the `expose_msgs` field).
2. The `nodes` field of a graph can reference other graphs and give them a unique identifier name within this graph.
3. The `connections` field of a graph can use extensions within a graph as its source or destination.

Therefore, the above graph that references a subgraph will ultimately be flattened by tools or the TEN runtime into the following definition:

```json
{
  "nodes": [
    {
      // This graph contains an ext_a.
      "type": "extension",
      "name": "ext_a",
      "addon": "extension_a"
    },
    {
      // This graph contains an ext_b.
      "type": "extension",
      "name": "ext_b",
      "addon": "extension_b"
    },
    {
      // Flatten the node definition of ext_c from the subgraph.
      "type": "extension",
      "name": "graph_any_name_ext_c",
      "addon": "extension_c"
    },
    {
      // Flatten the node definition of ext_d from the subgraph.
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
            // Indicates that ext_a will transmit cmd B to two destinations.
            {
              // The first destination is ext_b.
              "extension": "ext_b"
            },
            {
              // The second destination is ext_d within the graph represented by graph_any_name.
              "extension": "graph_any_name_ext_d"
            }
          ]
        }
      ]
    },
    {
      // This connection indicates that ext_c of graph_any_name will transmit cmd H to ext_a.
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
      // Flatten the connection definition from the subgraph.
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
  // Discard the expose_msgs field of the subgraph, as this field is only used to assist tools and is a kind of syntax sugar.
}
```

Here is how to place a graph in the `predefined_graphs` of an application's `property.json`:

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
