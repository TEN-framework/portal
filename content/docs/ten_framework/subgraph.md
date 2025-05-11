---
title: Subgraphs
---

## Subgraph Overview

The TEN framework's core operating mechanism is based on a Graph structure composed of Nodes and Connections. Subgraphs provide a powerful reuse mechanism that allows complex graph structures to be divided into multiple reusable modules, improving code organization and maintainability.

### Basic Graph Structure

Before diving into subgraphs, we first need to understand the TEN framework's basic graph structure.

#### Single Application Graph Example

Here's a simple single application graph definition example that involves just one TEN App:

```json
{
  "nodes": [
    {
      // Define an extension named ext_a
      "type": "extension",
      "name": "ext_a",
      "addon": "addon_a"
    },
    {
      // Define an extension named ext_b
      "type": "extension",
      "name": "ext_b",
      "addon": "addon_b"
    }
  ],
  "connections": [
    {
      // Create a connection: ext_a sends cmd_1 command to ext_b
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

#### Multi-Application Graph Example

When building connections across multiple TEN Apps, the graph definition becomes more complex, as shown below:

```json
{
  "nodes": [
    {
      // Define an extension named ext_a on app_a
      "type": "extension",
      "name": "ext_a",
      "addon": "addon_a",
      "app": "http://app_a"
    },
    {
      // Define an extension named ext_b on app_b
      "type": "extension",
      "name": "ext_b",
      "addon": "addon_b",
      "app": "http://app_b"
    }
  ],
  "connections": [
    {
      // Create a cross-application connection: ext_a on app_a sends cmd_1 command to ext_b on app_b
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

### Subgraph Design Philosophy

A subgraph is essentially syntax sugar that is ultimately flattened into its parent graph and then launched using the same mechanism as a regular graph. This design simplifies complex system development without increasing runtime complexity.

#### Design Principles

Subgraph design follows these core principles:

1. **Independence**: A subgraph is a complete graph itself that can either be launched independently or embedded as a component in other graphs.

2. **Tool-Friendly**: Subgraphs provide additional information to help development tools understand graph structures and improve the development experience without increasing runtime complexity.

3. **Flattening Mechanism**: Subgraphs are ultimately flattened into standard graph structures, ensuring performance and compatibility through a unified runtime mechanism.

4. **Simplicity**: The purpose of introducing subgraphs is to simplify, not complicate. Therefore, the subgraph mechanism avoids increasing the complexity of the graph's JSON structure and instead enhances development efficiency through tooling.

#### Black Box Principle

Subgraphs are designed to allow developers to use a graph as a black box without having to worry about its internal complexity. We've established the following guidelines:

- **No Special Patching Mechanisms**: Subgraph design doesn't provide special mechanisms specifically for adjusting internal subgraph states, avoiding increased complexity in the overall graph structure.

- **Direct Modification of Original Definitions**: When changes to the internal subgraph are needed (such as changing a node's addon, app, extension_group, etc.), the subgraph definition file should be modified directly rather than providing patching mechanisms at the reference point.

- **Avoiding Chain Reactions**: Patching subgraph definitions at reference points leads to spreading complexity and increases the cost of understanding and maintenance.

For example, when incorporating subgraph A (containing multiple extensions and connections) into graph B, if you need to adjust an extension property within subgraph A, the correct approach is to directly modify subgraph A's definition file rather than patching it at the reference point. This maintains the black box nature of subgraphs and simplifies the overall graph structure.

While simple subgraph patching mechanisms may be considered in the future, this requires careful design to avoid excessive complexity. It's difficult to establish clear principles for determining which modifications should be implemented through patching mechanisms and which should directly modify subgraph definitions. Ideally, development tools should provide convenient ways to directly modify subgraph definitions rather than through complex reference patching mechanisms.

### Subgraph Implementation Mechanism

Next, we'll detail the subgraph implementation mechanism, including subgraph definition, reference methods, and the flattening process.

#### Subgraph Definition Example

Here's a `subgraph.json` example that can be used either as a standalone graph or referenced as a subgraph by other graphs:

```json
{
  "nodes": [
    {
      // Define an extension named ext_c
      "type": "extension",
      "name": "ext_c",
      "addon": "extension_c"
    },
    {
      // Define an extension named ext_d
      "type": "extension",
      "name": "ext_d",
      "addon": "extension_d"
    }
  ],
  "connections": [
    {
      // ext_c sends command B to ext_d
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
    // Declares message interfaces exposed by this graph to the outside
    // Mainly used by development tools for finding message definitions and providing intelligent suggestions
    {
      // Command B of ext_d is a message interface exposed by this graph
      "type": "cmd_in",
      "name": "B",
      "extension": "ext_d"
    }
  ]
}
```

Note the `exposed_messages` field, which declares message interfaces that the subgraph exposes to the outside, primarily used to help development tools provide a better user experience.

#### Subgraph Reference Example

Here's a `graph.json` example that demonstrates how to reference and use subgraphs:

```json
{
  "nodes": [
    {
      // Define an extension named ext_a
      "type": "extension",
      "name": "ext_a",
      "addon": "extension_a"
    },
    {
      // Define an extension named ext_b
      "type": "extension",
      "name": "ext_b",
      "addon": "extension_b"
    },
    {
      // Reference a subgraph, naming it graph_any_name in this graph
      "type": "graph",
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
              // First destination is ext_b
              "extension": "ext_b"
            },
            {
              // Second destination is ext_d in the subgraph
              "extension": "graph_any_name:ext_d"
            }
          ]
        }
      ]
    },
    {
      // ext_c in the subgraph sends cmd H to ext_a
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

Although the reference syntax (like `"extension": "graph_any_name:ext_d"`) appears to expose internal details of the subgraph, development tools can use the `exposed_messages` information to shield developers from these details. Development tools can:

1. Present the command interfaces exposed by the subgraph
2. Allow developers to connect directly to these exposed interfaces
3. Automatically handle internal details and generate the correct graph definition

This greatly simplifies the development process, allowing developers to focus on functional logic rather than underlying details.

#### Key Concepts

The subgraph mechanism introduces three key concepts that are crucial for proper use:

1. **Message Exposure** (exposed_messages):
   - Subgraphs declare external message interfaces through the `exposed_messages` field
   - Primarily used by development tools for intelligent suggestions and checks
   - Hides subgraph internal details, improving the development experience

2. **Subgraph References and Naming**:
   - Reference other graph files using `type: "graph"`
   - Each subgraph has a unique identifier name that serves as a namespace
   - Prevents conflicts between elements with the same name in different subgraphs

3. **Cross-Graph Connections**:
   - Reference elements within subgraphs using namespace syntax (e.g., `graph_any_name:ext_d`)
   - Enable elements within subgraphs to interact with the main graph
   - Build complex cross-graph message flows

#### Flattening Mechanism

Eventually, graphs that reference subgraphs are flattened into regular graph structures to ensure runtime uniformity and efficiency. Here's a flattened example:

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
      // ext_c from the subgraph is flattened with the subgraph name as prefix
      "type": "extension",
      "name": "graph_any_name_ext_c",
      "addon": "extension_c"
    },
    {
      // ext_d from the subgraph is flattened with the subgraph name as prefix
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
      // Internal connections from the subgraph are also flattened
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
  // The exposed_messages field is discarded during flattening as it's only used by tools
}
```

The flattening mechanism follows these rules:

1. In pre-flattened graph definitions, the colon (`:`) symbol indicates that an element is located in a subgraph (e.g., `graph_any_name:ext_d`).

2. After flattening, element names from subgraphs are prefixed with the subgraph name (e.g., `graph_any_name_ext_c`) to ensure global uniqueness.

3. Flattened graph definitions no longer contain the colon (`:`) symbol, distinguishing between pre- and post-flattened states.

4. Internal connections within subgraphs are preserved and incorporated into the flattened graph, ensuring functional completeness.

### Advanced Features and Applications

As project complexity increases, advanced subgraph features can help developers better organize and manage systems.

#### Message Conversion and Subgraphs

Subgraphs fully support the message conversion (msg_conversion) mechanism for handling message format conversions between different interfaces:

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

Development tools can use the `exposed_messages` information to prompt compatibility when developers build connections, and provide message conversion configuration interfaces as needed. Once configured, development tools automatically write the conversion rules into the graph definition, simplifying the development process.

After flattening, message conversion rules are correctly preserved, ensuring runtime behavior aligns with design intent:

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

This approach allows developers to flexibly handle message format differences between different components without worrying about underlying implementation details.

### Appendix: Using Graphs in Applications

Finally, let's understand how to use graph definitions in actual applications. In a TEN app's `property.json`, you can define predefined graphs and set how they start:

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

This configuration specifies a predefined graph named "default", referenced from the "graph.json" file, set not to start automatically. TEN apps can control when to start graphs based on their needs, enabling more flexible function organization.

By effectively using the subgraph mechanism, developers can build modular, reusable components that significantly improve development efficiency and code quality.
