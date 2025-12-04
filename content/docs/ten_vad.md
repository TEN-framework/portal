---
title: TEN VAD
description: Low-latency, high-performance Voice Activity Detector for real-time speech detection
---

# TEN VAD - Voice Activity Detector

TEN VAD is a lightweight, high-performance Voice Activity Detector (VAD) designed for real-time speech detection with superior accuracy and minimal computational overhead.

## Overview

TEN VAD delivers exceptional precision compared to industry alternatives like WebRTC VAD and Silero VAD, while consuming significantly fewer computational resources and memory.

**Key Performance Metrics:**
- Real-Time Factor: 0.015 on AMD Ryzen (exceptionally fast)
- Library Size: Only 306KB (minimal footprint)
- Superior precision compared to WebRTC and Silero VAD
- Frame-level speech activity detection for fine-grained control

## Features

### Multi-Platform Support
- **Desktop**: Linux, Windows, macOS
- **Mobile**: Android, iOS
- **Web**: Browser integration via WebAssembly

### Multi-Language Bindings
Build VAD detection in your preferred language:
- Python (with numpy)
- C/C++
- Java (with JNI support for Android)
- Go
- JavaScript/WebAssembly

### Technology Stack
- **ONNX Model Format** for cross-platform deployment and optimization
- **WebAssembly Support** for seamless browser integration
- **JNI Bindings** for native Android support

## Use Cases

- **Real-time Voice Assistants** — Detect speech onset and offset for responsive interaction
- **Voice Conferencing** — Identify active speakers in multi-party conversations
- **Speech Recognition Preprocessing** — Optimize ASR pipeline by filtering silence
- **Mobile Applications** — Lightweight detection on resource-constrained devices
- **Browser-Based Applications** — Client-side speech detection without server round-trips

## Performance Highlights

TEN VAD outperforms comparable alternatives across diverse hardware platforms:
- Minimal computational complexity
- Reduced memory usage
- Fast inference time (Real-Time Factor < 1)
- Accurate frame-level detection

This makes it ideal for:
- Edge deployment scenarios
- Real-time conversational AI
- Mobile and web applications
- Multi-stream processing

## Getting Started

### Installation

```bash
# Python
pip install ten-vad

# JavaScript/Node.js
npm install ten-vad
```

### Basic Usage

```python
from ten_vad import VAD

# Initialize VAD
vad = VAD()

# Process audio frames
for frame in audio_stream:
    is_speech = vad.detect(frame)
    if is_speech:
        print("Speech detected!")
```

## Integration with TEN Agent

TEN VAD is a core component of TEN Agent's speech processing pipeline:
- Enables natural interruption handling in voice interactions
- Improves responsiveness by detecting speech boundaries
- Reduces unnecessary processing of silence

Use TEN VAD with the TEN framework for:
- **Voice Activity Detection** — Identify when users are speaking
- **Turn Detection** — Combined with TEN Turn Detection for intelligent conversation flow
- **Barge-in Support** — Enable users to interrupt AI responses naturally

## Resources

- **GitHub Repository**: [TEN-framework/ten-vad](https://github.com/TEN-framework/ten-vad)
- **Documentation**: Full API reference and examples
- **Community**: 1.6k stars, 131 forks, active Discord and WeChat communities

## Latest Updates (2025)

Recent releases include:
- Python inference with ONNX models on Linux and macOS
- Full Golang support across major operating systems
- Java support on multiple platforms including Android
- Enhanced model accuracy and performance optimizations

## License

TEN VAD is open-source and community-driven. Check the repository for licensing details.
