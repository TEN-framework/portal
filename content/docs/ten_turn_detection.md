---
title: TEN Turn Detection
description: Intelligent turn detection for conversation state analysis in human-AI dialogue
---

# TEN Turn Detection

Intelligent model for detecting conversation turns in human-AI dialogue systems, identifying three key utterance states for natural conversation flow.

## Core Functionality

Classifies user text into three states:

- **Finished**: Complete thought expressed; user expects a response
- **Unfinished**: Clearly unfinished utterance where user pauses but intends to continue
- **Wait**: User requests AI to pause or stop speaking

## Technology

- **Model**: Transformer-based (Qwen2.5-7B)
- **Languages**: English and Chinese
- **Inference**: Production-ready deployment scripts included

## Performance Metrics

Strong accuracy across all detection categories:

| Metric | Accuracy |
|--------|----------|
| Finished (English) | 90.64% |
| Unfinished (English) | 98.44% |
| Wait State | 91% |

Performance exceeds comparable open-source alternatives.

## Use Cases

- **Full-Duplex Conversation** — Enable interruption detection and natural turn-taking
- **Conversation Flow Management** — Determine when to wait for user continuation vs. respond
- **Pause/Stop Handling** — Recognize when users request the AI to pause or stop
- **Multi-Language Support** — Deploy in English and Chinese speaking applications

## Getting Started

```python
# Basic usage
from ten_turn_detection import TurnDetection

detector = TurnDetection()
state = detector.detect("user input text")
# Returns: "finished", "unfinished", or "wait"
```

## Integration with TEN Agent

TEN Turn Detection works seamlessly with TEN VAD for complete conversation management:

1. **TEN VAD** detects speech activity (when user is speaking)
2. **TEN Turn Detection** analyzes utterance to determine conversation state
3. **Agent** responds appropriately based on detected turn state

This enables natural, responsive voice conversations with proper turn-taking.

## Datasets

Bilingual test datasets (TEN-Turn-TestSet) are available for:
- Validation and testing
- Fine-tuning on domain-specific language
- Benchmarking model performance

## Resources

- **GitHub Repository**: [TEN-framework/ten-turn-detection](https://github.com/TEN-framework/ten-turn-detection)
- **Model Weights**: Available via Hugging Face
- **Datasets**: Bilingual test datasets included

## License

Apache 2.0 (see repository for details)
