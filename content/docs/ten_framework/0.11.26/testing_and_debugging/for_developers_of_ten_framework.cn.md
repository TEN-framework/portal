---
title: 面向 TEN framework 开发者
---

TEN framework 包括三种类型的测试套件：

- 单元测试
- 冒烟测试
- 集成测试

TEN framework 使用 `gtest` 作为单元测试和冒烟测试的测试框架，使用 `pytest` 作为集成测试的测试框架。

## 单元测试

单元测试的源目录是 `tests/ten_runtime/unit`。如果您需要添加新的单元测试用例，请将它们放在 `tests/ten_runtime/unit directory` 中。

对于 C++ 项目，在成功编译后，您可以导航到输出目录（例如，`out/linux/x64/tests/standalone/`，具体取决于目标操作系统和 CPU）并执行以下命令：

```shell
./ten_runtime_unit_test
```

## 冒烟测试

冒烟测试的源目录是 `tests/ten_runtime/smoke`。如果您需要添加新的冒烟测试用例，请将它们放在 `tests/ten_runtime/smoke` 目录中。

导航到输出目录（例如，`out/linux/x64/tests/standalone`，具体取决于目标操作系统和 CPU）并执行以下命令：

```shell
./ten_runtime_smoke_test
```

## 循环测试

您可以使用以下命令执行多轮测试。

仅运行单元测试：

```shell
failed=0; for i in {1..100}; do if [ ${failed} != 0 ]; then echo "error occurred:" ${failed}; break; fi; ./ten_runtime_unit_test; failed=$?; done;
```

仅运行冒烟测试：

```shell
failed=0; for i in {1..100}; do if [ ${failed} != 0 ]; then echo "error occurred:" ${failed}; break; fi; ./ten_runtime_smoke_test; failed=$?; done;
```

同时运行单元测试和冒烟测试：

```shell
failed=0; for i in {1..100}; do if [ ${failed} != 0 ]; then echo "error occurred:" ${failed}; break; fi; ./ten_runtime_unit_test; failed=$?; if [ ${failed} != 0 ]; then echo "error occurred:" ${failed}; break; fi; ./ten_runtime_smoke_test; failed=$?; done;
```

## 集成测试

集成测试是 TEN framework 的黑盒测试。集成测试的源目录是 `tests/ten_runtime/integration`。这些测试用于验证实际的执行场景。

集成测试的文件结构如下：

```text
tests/ten_runtime/integration/
  ├── test_1/
  │    ├── test_case.py
  │    └── ...
  ├── test_2/
  │    ├── test_case.py
  │    └── ...
  └── ...
```

要执行集成测试，请使用以下命令：

```shell
cd path/to/out/
pytest tests/ten_runtime/integration/
```

## 测试技巧

### Linux

在 Linux 上，您可以使用以下技术来减慢 TEN 的执行速度，这有助于触发与时序相关的错误。

```shell
sudo apt install util-linux
cpulimit -f -l 50 -- taskset 0x3 ...
```

- `taskset 0x1`: 仅使用 1 个 CPU 核心来运行程序。
- `taskset 0x3`: 仅使用 2 个 CPU 核心来运行程序。
