---
title: Standard Interface
---

In the TEN framework, we encourage developers to create their own extensions and publish them to the TEN extension marketplace for other developers to use. To facilitate developers in selecting and replacing extensions, we need to define standardized interface specifications that allow developers to easily find extensions that meet their requirements based on these standard interfaces.

In summary, standard interfaces are syntactic sugar that enables TEN tools (such as TEN Manager) to more conveniently assist developers in operations like extension selection and replacement.

TEN's interface definitions are more like TypeScript's `.d.ts` files, which allow the TypeScript compiler to perform type checking, but these interface definitions are not used during actual runtime. Therefore, the functionality and code additions caused by standard interface design are mainly in development-time tools like TEN Manager, rather than in the runtime TEN Runtime. For example, TEN Manager needs to provide related RESTful APIs for TEN Designer Frontend to perform extension selection and replacement through UI based on standard interface definitions.

## What is a Standard Interface

In the TEN framework, each extension's interface consists of the following core components:

1. **Properties** - Configuration parameters for the extension
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

Standard interfaces involve standardizing these components to form fixed interface standards. Developers can refer to these interface standards to implement their own extensions, and extensions can also declare their support for specific standard interfaces. This way, development tools can provide better development support based on the standard interfaces declared by extensions, enabling users to select or replace the required extensions based on standard interfaces.

Command/Data/Audio frame/Video frame in standard interfaces are used to standardize interactions between extensions, achieving extension interchangeability and compatibility. Properties in standard interfaces are used to standardize extension configuration parameters, achieving configuration compatibility with TEN Designer.

It's important to note that standardizing interactions between extensions is not the function of interfaces - this is the function of Command/Data/Audio frame/Video frame. Interfaces are just syntactic sugar used for aggregation purposes, allowing developers to quickly specify extension interface definitions.

### Interface Checking and Error Reporting

In an extension's Command/Data/Audio frame/Video frame definitions, if there are two messages with the same name and identical schema definitions, this is not considered an error but will be treated as a duplicate definition and ignored. This is the same for standard interfaces, allowing different standard interfaces to define common functionalities themselves, forming self-contained standard interface definitions. When an extension implements these standard interfaces with identical definitions, it won't cause errors.

Since the TEN framework is a framework that separates runtime from development (similar to the relationship between JavaScript and TypeScript's .d.ts files), interface checking and error reporting mainly occur in development-time tools rather than in the runtime TEN Runtime. Therefore, TEN Runtime won't report errors due to interface issues when starting a graph.

In development tools like TEN Designer, if an extension's interface definition is incomplete, it can display hints that certain functionalities are temporarily unavailable for that extension. For example, when replacing one extension with another, if the interface definition is incomplete, it should display that this functionality is temporarily unavailable for this extension until the interface definition is complete.

Additionally, since interface definitions can be independent files referenced from elsewhere, incomplete interface definitions are not considered errors during TEN Manager publish/install operations.

### Interface Compatibility Rules

When replacing an extension that implements interface A with interface B, interface A must be compatible with interface B for the replacement to occur. There are two modes for interface compatibility rules:

**Strict Mode:**

- All messages in interface A must appear in interface B, and the schemas of messages in interface A must be compatible with the schemas of messages in interface B.

**Relaxed Mode:**

- Only messages in interface A that have connections must appear in interface B, and the schemas of these messages in interface A must be compatible with the schemas of the corresponding messages in interface B.

Strict mode and relaxed mode are user-selectable, suitable for different situations. For example, if it's certain that a particular message X in interface A implemented by an extension will never be used, then being unable to replace it with another desired extension due to message X's incompatibility or non-existence might be too strict.

## Implementation of Standard Interfaces

The APIs supported by TEN extensions are defined in their `manifest.json` files. Standard interface implementation involves writing the defined API specifications into independent JSON files and then referencing these files in `manifest.json`.

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

### Standard Interface Definition File Example

When TEN systems (including TEN Runtime, TEN Manager, etc.) parse `manifest.json`, they download the corresponding JSON files based on `import_uri` and merge their contents into `manifest.json`. The referenced standard interface file content example is shown below. As you can see, it's the same as the content within the `api` field in manifest.json, just separated into an independent file for easy reference. This independent standard interface file can also reference other standard interface files.

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

The system merges the JSON file content referenced by `import_uri` into the `api` field of `manifest.json`, specifically including:

- `property`
- `cmd_in`, `cmd_out`
- `data_in`, `data_out`
- `audio_frame_in`, `audio_frame_out`
- `video_frame_in`, `video_frame_out`

**Important Rules:**

1. **Conflict Detection**: If the merging process discovers fields of the same type with the same name (such as `cmd_in` with the same name or `property` with the same name), if the schemas are identical, it's not an error; otherwise, the system will report an error.
2. **Recursive Merging**: The merging process is recursive. If circular references are detected, the system will report an error.
3. **Multiple Interface Support**: An extension can support multiple standard interfaces by defining multiple `interface` fields in `manifest.json`.
4. **Duplicate Reference Detection**: If different `interface` fields reference the same `import_uri`, the system will report an error.

## Storage Methods for Standard Interfaces

Standard interface files support the following storage methods:

### 1. TEN System Package

**Overview**: This method involves packaging standard interface definition files into TEN system packages and then referencing them in `manifest.json`. Additionally, these system packages can be depended upon in the dependencies field of manifest.json, allowing the dependent standard interface system packages to be installed together when installing the extension, achieving the best development experience. Through this method, TEN package version mechanisms can be used to implement standard interface version management, and TEN package dependency mechanisms can be used to implement automatic installation of standard interfaces.

Using TEN system packages, in addition to standard interface JSON definition files, can also include related resources such as model files, common utility function libraries, supporting tools, etc. Therefore, when any of these resources have incompatible changes, this can be better represented through TEN system package version number changes. For example, different placement positions or file names of JSON files within the system package are also considered breaking changes to the system package, so the major version number of the system package should be upgraded.

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

1. **Easy Distribution**: System packages can be uploaded to the TEN extension marketplace for direct user download
2. **Rich Resources**: Packages contain not only interface definition files but also related resources such as:
   - Model files
   - Common utility function libraries
   - Supporting tools, etc.
3. **Dependency Management**: System packages can serve as extension dependencies, automatically downloading when extensions are downloaded
4. **Version Management**: Not limited to the standard interface protocol itself, any resources within the system package are part of the system package's version management.

It's important to note that TEN system package version numbers don't only represent standard interface version numbers but represent the entire system package version number. Therefore, if resources within the system package have breaking changes, the system package's major version number should be upgraded. For example, different placement positions or file names of JSON files within the system package, even without changing the JSON file content, are considered breaking changes to the system package because the usage method needs to change for users, so the system package's major version number should be upgraded.

Therefore, system package version numbers alone cannot be used to determine standard interface compatibility. Standard interface compatibility still needs to be determined through interface compatibility rules.

#### Supporting Multi-Version Coexistence

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

In the `manifest.json` of extensions that depend on the system package, also declare the use of multi-version coexistence:

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

During the entire dependency tree construction process, if a system package's coinstallable is true, all places that depend on the system package must declare coinstallable, otherwise the system will report an error.

**File System Path:**

After enabling multi-version coexistence, the system package path in the file system becomes:

```text
ten_packages/system/<hash_value>_foo_extension_0_1_0/
```

> **Note**: A mapping mechanism might be introduced in the future so users don't need to explicitly specify hash_value during use, but can automatically find the corresponding system package through some mapping mechanism. However, for this mechanism to be useful, it would require modifying the module loading mechanisms in the languages supported by TEN, so developers don't need to specify hash_value in the language's module loading mechanism but can automatically find the corresponding system package through some mapping mechanism. Such deep language-level modifications are one of the reasons why single-package multi-version coexistence mechanisms are basically not implemented.
> **Note**: If you really need to use multiple versions of the same standard interface within a TEN application, you can use the several methods described below. If a standard interface has accompanying shared resources such as model files, common utility function libraries, supporting tools, etc., many of these resources cannot achieve multi-version coexistence within a TEN application, which is another reason why single-package multi-version coexistence mechanisms are basically not implemented.

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

> **Note**: When TEN Manager handles this type of reference, it can download to its own cache and then use some mapping mechanism to allow TEN Manager to find the definition.

**Applicable Scenarios:**

- **Lightweight Interfaces**: Interface definitions without accompanying shared resources
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

- **Lightweight Interfaces**: Suitable for interface definitions without accompanying shared resources
- **Version Flexibility**: Need to reference different versions of the same standard interface in one `manifest.json`

## How to Filter Desired Extensions from the Cloud Store

The relationship between standard interfaces and the cloud store involves packaging standard interfaces into TEN system packages. There are two ways to search for extensions that meet certain criteria:

1. **Dependency Search**: Search for extensions that depend on a certain system package. Since the metadata of extensions in the cloud store contains information about which packages they depend on, the cloud store can filter all packages that depend on a certain system package based on this information.

2. **Tag Search**: Quickly search for extensions that meet certain criteria through TEN package tags, then install and perform replacement operations. For TEN officially certified extensions, tags starting with `ten:` can even be used to indicate that this is an officially certified extension that indeed complies with the declared standard interface definitions.
