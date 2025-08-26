---
title: RTC First - Design Rationale
---

This document explains why our system adopts an **RTC First** strategy, instead of building primarily on WebSockets.
For developers, this means you get a **low-latency, media-first pipeline** that is already built in, with no need to implement device capture, codecs, or transport logic from scratch.

---

## Why RTC First?

* **Low latency:** RTC avoids TCP head-of-line blocking by using UDP + SRTP.
* **Media-native:** Direct microphone, camera, and screen capture.
* **Codec integration:** Opus, VP8/VP9/AV1, H.264 with hardware acceleration.
* **Synchronization:** Audio, video, and data channels aligned in one session.
* **Cross-platform:** Works on browsers, mobile, and native apps.

By contrast, **WebSockets** are best for structured data exchange but lack:

* Native media capture
* Encoding/decoding support
* Bandwidth adaptation
* Built-in synchronization

---

## RTC vs WebSocket

| Feature           | RTC                                         | WebSocket                      |
| ----------------- | ------------------------------------------- | ------------------------------ |
| Transport         | UDP (SRTP, DTLS, ICE, congestion control)   | TCP (single ordered stream)    |
| Latency           | \~50–150ms (optimized for real-time)        | Higher (head-of-line blocking) |
| Media Support     | Native mic/camera/screen capture            | None (raw binary/text only)    |
| Encoding/Decoding | Built-in codecs (Opus, VP8, H.264, AV1)     | External / manual              |
| Synchronization   | Multi-stream A/V sync + data channels       | Manual implementation          |
| Adaptation        | Bandwidth estimation, adaptive bitrate, FEC | Not supported                  |
| Best For          | Calls, streaming, AI agents, real-time apps | Chat, signaling, async events  |

---

Our system includes an RTC module powered by [Agora RTC](https://www.agora.io/en/) as the default provider, so developers don’t need to worry about device capture, encoding/decoding, or transport internals.

From a practical perspective:

* **Setup is minimal:** RTC is ready out of the box.
* **WebSockets remain useful:** Ideal for signaling, configuration, or occasional async updates.
* **RTC is the recommended channel:** For real-time, multimodal interaction where latency, synchronization, and quality matter most.

By adopting **RTC First**, we ensure:

* Real-time performance across devices and platforms.
* A consistent developer experience with built-in media pipelines.
* Flexibility to extend with async features without losing RTC guarantees.

In short, developers can focus on **building features**, not rebuilding a transport stack.
