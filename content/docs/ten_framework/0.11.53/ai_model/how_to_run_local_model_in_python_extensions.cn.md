---
title: 如何在 Python 扩展中运行本地 AI 模型
---

在 TEN framework 中，扩展可以使用第三方 AI 服务或在本地运行 AI 模型，以提高性能并降低成本。本教程介绍了如何在 Python 扩展中运行本地 AI 模型，以及如何在扩展中与之交互。

## 步骤 1：检查硬件要求

在本地运行 AI 模型之前，请确保您的硬件满足必要的要求。要验证的关键组件包括：

- **CPU/GPU**：检查模型是否需要特定的处理能力。
- **内存**：确保有足够的内存来加载和运行模型。

验证您的系统是否可以支持模型的需求，以确保顺利运行。

## 步骤 2：安装必要的软件和依赖项

硬件准备就绪后，安装所需的软件和依赖项。请按照以下步骤操作：

1. **操作系统**：确保与您的模型兼容。大多数 AI 框架都支持 Windows、macOS 和 Linux，尽管可能需要特定版本。
2. **Python 版本**：确保与 TEN Python 运行平台和模型兼容。
3. **所需的库**：安装必要的库，例如：

   - TensorFlow
   - PyTorch
   - Numpy
   - vllm

   您可以将所需的依赖项列在 `requirements.txt` 文件中，以便轻松安装。

4. **下载模型**：获取您计划运行的 AI 模型的本地版本。

## 步骤 3：实现您的 Python 扩展

以下示例说明了如何在 Python 扩展中使用 `vllm` 推理引擎实现基本的文本生成功能。

首先，在扩展中初始化本地模型：

```python
from ten_runtime import (
    Extension,
    TenEnv,
    Cmd,
    CmdResult,
)
from vllm import LLM

class TextGenerationExtension(Extension):
    def on_init(self, ten_env: TenEnv) -> None:
        self.llm = LLM(model="<model_path>")
        ten_env.on_init_done()
```

接下来，实现 `on_cmd` 方法以根据提供的输入处理文本生成：

```python
    def on_cmd(self, ten_env: TenEnv, cmd: Cmd) -> None:
        prompt = cmd.get_property_string("prompt")

        outputs = self.llm.generate(prompt)
        generated_text = outputs[0].outputs[0].text

        cmd_result = CmdResult.create(StatusCode.OK)
        cmd_result.set_property_string("result", generated_text)
        ten_env.return_result(cmd_result, cmd)
```

在此代码中，`on_cmd` 方法检索 `prompt`，使用模型生成文本，并将生成的文本作为命令结果返回。

您可以通过处理相关的输入类型来调整此方法，以实现其他功能，例如图像识别或语音转文本。

## 步骤 4：卸载模型

在扩展清理期间卸载模型以释放资源非常重要：

```python
import gc
import torch

class TextGenerationExtension(Extension):
    ...

    def on_deinit(self, ten_env: TenEnv) -> None:
        del self.llm
        gc.collect()
        torch.cuda.empty_cache()
        torch.distributed.destroy_process_group()
        print("Successfully deleted the LLM pipeline and freed GPU memory!")
        ten_env.on_deinit_done()
```

这确保了有效的内存管理，尤其是在使用 GPU 资源时。

## 总结

在 TEN Python 扩展中运行本地模型类似于原生 Python 开发。通过在适当的扩展生命周期方法中加载和卸载模型，您可以轻松集成本地 AI 模型并有效地与之交互。
