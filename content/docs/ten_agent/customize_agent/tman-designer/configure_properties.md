---
title: Configure Extension Properties
---

Every extension has a set of configurable properties. The configurable properties can be checked via the extension's `manifest.json` file.
The properties can be used to customize the behavior of the extension during runtime.

You can follow [this guide](/docs/ten-agent/customize_agent/tman-designer/) to learn to launch TMAN Designer if you haven't done so already.

## Configure Node Properties

1. Right click on a node you want to configure, in the context menu, select "Update Properties"
2. In the popup window, you may see a set of properties displayed as a form for you to edit.
3. Make the necessary changes and click "Save Change" to apply the updates.

![Properties Dialog](https://ten-framework-assets.s3.amazonaws.com/blog/main-control/properties_dialog.png)



## Dynamic Fields

"Dynamic fields" are essentially a way to define an object without strictly specifying all of its possible keys upfront. Instead of enforcing a fixed schema, the object can accept and carry through any extra properties provided at runtime.

The main purpose is **flexibility and extensibility**:

* You can design an object with only the core or required fields defined.
* Any additional fields can be passed in dynamically, without changing the original object definition.
* When the object is handed off to an external SDK or API, those dynamic fields are transparently forwarded along with the known fields.

This means you don’t have to constantly update your object definition whenever new attributes are needed by the external system—you can just attach them on the fly.

To set a dynamic field, you can follow these steps:

1. Right click on a node you want to configure, in the context menu, select "Update Properties"
2. In the popup window, click on top tab to switch to "Dynamic Fields"
3. Choose the object key route where you want to add the dynamic field, set the name of the field, choose the data type and default value.
4. Confirm "Add Field" to finish adding the dynamic field.
5. Back to "Node Properties", you should see the newly added dynamic field in the "View Form Values" preview.

![Dynamic Fields](https://ten-framework-assets.s3.amazonaws.com/blog/main-control/dynamic_fields.png)