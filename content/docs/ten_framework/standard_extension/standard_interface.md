---
title: Standard Interface
---

In the TEN framework, we encourage developers to create their own extensions and publish them to the TEN extension marketplace for other developers to use. To enable developers to easily select and replace extensions, we need to define standardized interface specifications so that developers can quickly find extensions that meet their requirements based on these standard interfaces.

In short, standard interfaces are syntactic sugar that allows TEN tools (such as TEN Manager) to more conveniently assist developers in selecting and replacing extensions.

TEN's interface definitions are similar to TypeScript's `.d.ts` files, allowing the TypeScript compiler to perform type checking, but these interface definitions are not used at runtime. Therefore, the functionality and code enhancements brought by standard interface design are mainly reflected in development tools like TEN Manager, rather than the runtime TEN Runtime. For example, TEN Manager needs to provide relevant RESTful APIs to tman designer Frontend, allowing users to select and replace extensions through the UI interface based on standard interface definitions.

## What are Standard Interfaces

In the TEN framework, each extension's interface consists of the following core components:

1. **Properties** - Configuration parameters of the extension
2. **Command**
   - **Input command** - Input commands
   - **Output command** - Output commands
3. **Data**
   - **Input data** - Input data
   - **Output data** - Output data
4. **Audio frame**
   - **Input audio frame** - Input audio frames
   - **Output audio frame** - Output audio frames
5. **Video frame**
   - **Input video frame** - Input video frames
   - **Output video frame** - Output video frames

### Significance and Purpose of Standard Interfaces

Standard interfaces normalize these components into unified interface standards. Developers can refer to these interface standards to implement their own extensions, while extensions can also declare support for specific standard interfaces. This allows development tools to provide better development support based on the standard interfaces declared by extensions, enabling users to select or replace required extensions based on standard interfaces.

In standard interfaces, Command/Data/Audio frame/Video frame are used to standardize interactions between extensions, achieving interchangeability and compatibility of extensions. Properties are used to standardize extension configuration parameters, achieving configuration compatibility with tman designer.

It should be noted that standardizing interactions between extensions is not the function of the interface itself, but the function of Command/Data/Audio frame/Video frame. Interfaces are just syntactic sugar for aggregation purposes, helping developers quickly specify extension interface definitions.

### Interface Checking and Error Reporting

In an extension's Command/Data/Audio frame/Video frame definitions, if there are two messages with the same name and identical schema definitions, this is not considered an error, but will be treated as duplicate definitions and ignored. This rule also applies to standard interfaces, allowing different standard interfaces to define common functionalities themselves, forming self-contained standard interface definitions. When an extension implements these standard interfaces with identical definitions, it won't cause errors. This feature is very useful in standard interfaces because standard interface definitions can be referenced. So when an extension implements multiple standard interfaces, if these standard interfaces (or other standard interfaces they reference) have the same messages and identical schemas, it won't cause errors.

Since the TEN framework adopts a runtime-development separation architecture (similar to the relationship between JavaScript and TypeScript's .d.ts files), standard interface checking and error reporting mainly occur during the development tool phase, not at runtime in TEN Runtime. Therefore, TEN Runtime will not report errors due to interface errors when starting the graph.

In the tman designer development tool, if an extension's interface definition is incomplete, prompts will be displayed indicating that certain functions are temporarily unavailable for that extension. For example, when using one extension to replace another extension's functionality, if the interface definition is incomplete, a prompt will indicate that this function is temporarily unavailable for this extension and needs to wait for the interface definition to be complete before use.

Additionally, since interface definitions can be independent files that are referenced, incomplete interface definitions are not considered errors during TEN Manager's publish/install operations.

### Interface Compatibility Rules

When replacing an extension that implements interface A with an extension that implements interface B, interface A must be compatible with interface B for the replacement to be possible. There are two modes of compatibility rules between interfaces:

**Strict Mode:**

- All messages in interface A must appear in interface B, and the schema of messages in interface A must be compatible with the schema of corresponding messages in interface B.

**Relaxed Mode:**

- Only messages in interface A that have connections must appear in interface B, and the schemas of these messages in interface A must be compatible with the schemas of messages with the same names in interface B.

Strict mode and relaxed mode are user-selectable, suitable for different scenarios. For example, if it's certain that a specific message X in interface A implemented by an extension will never be used, then being unable to replace with another desired extension due to message X's incompatibility or non-existence might be too strict.

## Implementation of Standard Interfaces

The APIs supported by TEN extensions are defined in their `manifest.json` files. The implementation of standard interfaces involves writing the defined API specifications into independent JSON files and then referencing these files in `manifest.json`.

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
        "import_uri": "https://xxx/asr_interface.json"  // <= Reference to standard interface definition file
      },
      {
        "import_uri": "https://xxx/tts_interface.json"  // <= Reference to standard interface definition file
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

### Example of Standard Interface Definition File

When TEN systems (including TEN Runtime, TEN Manager, etc.) parse `manifest.json`, they download the corresponding JSON files based on `import_uri` and merge their contents into `manifest.json`. The example content of the referenced standard interface file is shown below. As you can see, the content is the same as the `api` field in manifest.json, just separated into an independent file for easy reference. This independent standard interface file can also reference other standard interface files.

```json
{
  "interface": [
    {
      "import_uri": "https://xxx/stt_interface.json"// <= Reference to other standard interface definition files
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

### Interface Merging Rules

The system merges the content of JSON files pointed to by `import_uri` into the `api` field of `manifest.json`, specifically including:

- `property`
- `cmd_in`, `cmd_out`
- `data_in`, `data_out`
- `audio_frame_in`, `audio_frame_out`
- `video_frame_in`, `video_frame_out`

**Important Rules:**

1. **Conflict Detection**: If fields of the same name and type are found during merging (such as `cmd_in` or `property` with the same name), it's not considered an error if the schemas are identical, otherwise the system will report an error.
2. **Recursive Merging**: The merging process is recursive, and the system will report an error if circular references are detected.
3. **Multiple Interface Support**: An extension can support multiple standard interfaces by defining multiple `interface` fields in `manifest.json`.
4. **Duplicate Reference Detection**: If different `interface` fields reference the same `import_uri`, the system will report an error.

## Storage Methods for Standard Interfaces

Standard interface files support the following storage methods:

### 1. TEN System Package

**Overview**: This method packages standard interface definition files into TEN system packages and then references them in `manifest.json`. You can also depend on this system package in the dependencies field of manifest.json, so that when installing the extension, the dependent standard interface system package will be installed together, providing the best development experience. Through this method, you can use TEN package's version mechanism to implement version management of standard interfaces, and use TEN package's dependency mechanism to implement automatic installation of standard interfaces.

Using TEN system packages, in addition to standard interface JSON definition files, can also include related resources such as model files, common utility function libraries, supporting tools, etc. Therefore, when any of these resources have incompatible changes, they can be better reflected through TEN system package version number changes. For example, changes in the storage location or file names of JSON files within the system package are also considered breaking changes to the system package, so the major version number of the system package should be upgraded.

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

**Advantages of Using TEN System Packages:**

1. **Easy Distribution**: System packages can be uploaded to the TEN extension marketplace for users to download directly
2. **Rich Resources**: The package not only contains interface definition files but can also include related resources such as:
   - Model files
   - Common utility function libraries
   - Supporting tools, etc.
3. **Dependency Management**: System packages can serve as dependencies of extensions. When extensions are downloaded, related system packages will also be automatically downloaded
4. **Version Management**: Not limited to standard interface protocols themselves, any resources within the system package are part of the system package's version management

It should be noted that the version number of TEN system packages does not only represent the version number of standard interfaces, but represents the version number of the entire system package. Therefore, if resources within the system package have breaking changes, the major version number of the system package should be upgraded. For example, changes in the storage location or file names of JSON files within the system package, even if the content of JSON files hasn't changed, are considered breaking changes to the system package because the usage method needs to change for users, so the major version number of the system package should be upgraded.

Therefore, you cannot judge the compatibility of standard interfaces solely based on the version number of system packages. The compatibility of standard interfaces still needs to be judged through interface compatibility rules.

#### Support for Multi-Version Coexistence

> **Note**: The functionality described in this section will basically not be implemented. It only describes possible implementation methods and considerations if it were to be done in the future.

**Overview**: In some scenarios, a TEN application might need to use different versions of the same standard interface simultaneously. To support this requirement, TEN allows installing multiple versions of the same system package within the same application.

**System Package Configuration:**

First, declare support for multi-version coexistence in the system package's `manifest.json`:

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

**Extension Dependency Configuration:**

In the `manifest.json` of extensions that depend on this system package, you also need to declare the use of multi-version coexistence:

```json
{
  "dependencies": [
    {
      "type": "system",
      "name": "foo_interface",
      "version": "=0.1.0", // Note: Only equal syntax can be used here, not >= syntax
      "install_policy": {
        "coinstallable": "true"
      }
    }
  ],
}
```

And during the entire dependency tree construction process, if a system package's coinstallable is true, then all places that depend on this system package need to declare coinstallable, otherwise the system will report an error.

**File System Path:**

After enabling multi-version coexistence, the path of system packages in the file system becomes:

```text
ten_packages/system/<hash_value>_foo_extension_0_1_0/
```

> **Note**: A mapping mechanism might be introduced in the future to allow users not to explicitly specify hash_value during usage, but to automatically find corresponding system packages through some mapping mechanism. However, for this mechanism to work well, it would also require modifying the module loading mechanisms in languages supported by TEN, so that developers don't need to specify hash_value in the module loading mechanisms of those languages, but can automatically find corresponding system packages through some mapping mechanism. This kind of deep language-internal modification is also one of the reasons why this single-package multi-version coexistence mechanism will basically not be implemented.
>
> **Note**: If there's really a need to use multiple versions of a standard interface within a TEN application, you can use the several methods described below. If a standard interface has accompanying common resources such as model files, common utility function libraries, supporting tools, etc., then many of these resources cannot achieve multi-version coexistence within a TEN application, which is also one of the reasons why this single-package multi-version coexistence mechanism will basically not be implemented.

### 2. Network Address

**Overview**: Deploy standard interface definition files to network servers and reference them through HTTP/HTTPS addresses:

```json
{
  "interface": [
    {
      "import_uri": "http://xxx/asr_1.0_interface/interface.json"
    }
  ]
}
```

> **Note**: When TEN Manager handles this type of reference, it can download files to its own cache and then use some mapping mechanism to allow TEN Manager to find the definitions.

**Applicable Scenarios:**

- **Lightweight Interfaces**: Interface definitions without accompanying common resources
- **Version Flexibility**: Need to reference different versions of the same standard interface in one `manifest.json`

### 3. Local Path

**Overview**: Reference standard interface definition files in the local file system:

**Absolute Path:**

```json
{
  "interface": [
    {
      "import_uri": "file://c:/asr_1.0_interface/interface.json"
    }
  ]
}
```

**Relative Path:**

```json
{
  "interface": [
    {
      "import_uri": "../asr_1.0_interface/interface.json"
    }
  ]
}
```

**Applicable Scenarios:**

Similar to the network address method:

- **Lightweight Interfaces**: Suitable for interface definitions without accompanying common resources
- **Version Flexibility**: Need to reference different versions of the same standard interface in one `manifest.json`

## How to Filter Desired Extensions from the Cloud Store

The relationship between standard interfaces and the cloud store is reflected in packaging standard interfaces into TEN system packages. There are two ways to search for extensions that meet specific conditions:

1. **Dependency Search**: Search for extensions that depend on a certain system package. Since the metadata of extensions in the cloud store contains dependency information, the cloud store can filter out all extensions that depend on a certain system package accordingly.

2. **Tag Search**: Quickly search for extensions that meet certain conditions through TEN package tags, select and install them, then perform replacement operations. If they are TEN officially certified extensions, they can even be tagged with `ten:` prefix to indicate that this is an officially certified extension that indeed conforms to the declared standard interface definition.
