---
title: How to Debug with Logs
---

We will introduce how to view logs, as they are now ported to stdout, making them very easy to view.

For example, if a TEN Agent is running on localhost:3000, you might see output similar to the following in the logs:

```bash
...
[GIN] 2024/09/29 - 09:29:42 | 200 |     634.458µs |    192.168.65.1 | POST     "/ping"
[agora_5bnxv1] 09-29 09:29:42.895  7463  7505 I AZURE_TTS_EXTENSION SpeechText@tts.cc:182 task finished for text: [ How about you?], text_recv_ts: 1727602181374572, read_bytes: 37200, sent_frames: 117, first_frame_latency: 306ms, finish_latency: 428ms, synthesis_first_byte_latency: 300ms, synthesis_finish_latency: 332ms
[agora_5bnxv1] 09-29 09:29:43.350  7463  7505 I AZURE_TTS_EXTENSION SpeechText@tts.cc:182 task finished for text: [ Anything exciting happening?], text_recv_ts: 1727602181383864, read_bytes: 63600, sent_frames: 199, first_frame_latency: 300ms, finish_latency: 452ms, synthesis_first_byte_latency: 295ms, synthesis_finish_latency: 332ms
2024/09/29 09:29:45 INFO handlerPing start channelName=agora_5bnxv1 requestId=691f0b48-12f3-4cdf-b1ff-f1923149b31c service=HTTP_SERVER
2024/09/29 09:29:45 INFO handlerPing end worker="&{ChannelName:agora_5bnxv1 HttpServerPort:10024 LogFile:/tmp/astra/app-9dc076369ea0cc310a3026a2c4c4cacd-1727602125678030593.log Log2Stdout:true PropertyJsonFile:/tmp/astra/property-9dc076369ea0cc310a3026a2c4c4cacd-1727602125678030593.json Pid:7455 QuitTimeoutSeconds:60 CreateTs:1727602125 UpdateTs:1727602185}" requestId=691f0b48-12f3-4cdf-b1ff-f1923149b31c service=HTTP_SERVER
[GIN] 2024/09/29 - 09:29:45 | 200 |    1.038208ms |    192.168.65.1 | POST     "/ping"
2024/09/29 09:29:45 INFO handlerPing start channelName=agora_7j2nlb requestId=f8491f0c-324d-4b4d-bbf1-73f4008620e5 service=HTTP_SERVER
2024/09/29 09:29:45 ERROR handlerPing channel not existed channelName=agora_7j2nlb requestId=f8491f0c-324d-4b4d-bbf1-73f4008620e5 service=HTTP_SERVER
[GIN] 2024/09/29 - 09:29:45 | 200 |     442.375µs |    192.168.65.1 | POST     "/ping"
2024/09/29 09:29:48 INFO handlerPing start channelName=agora_5bnxv1 requestId=6fb07d85-
...
```

Once you interact with the TEN Agent, you should see entries like the following:

```bash title="Bash"
[agora_5bnxv1] 09-29 09:35:25.049  7463  7505 I AZURE_TTS_EXTENSION SpeechText@tts.cc:182 task finished for text: [ and the World Cup in Russia.], text_recv_ts: 1727602522313774, read_bytes: 64000, sent_frames: 200, first_frame_latency: 418ms, finish_latency: 568ms, synthesis_first_byte_latency: 413ms, synthesis_finish_latency: 458ms
[agora_5bnxv1] 09-29 09:35:25.570  7463  7505 I AZURE_TTS_EXTENSION SpeechText@tts.cc:182 task finished for text: [ In tech,], text_recv_ts: 1727602522347918, read_bytes: 29200, sent_frames: 92, first_frame_latency: 427ms, finish_latency: 515ms, synthesis_first_byte_latency: 419ms, synthesis_finish_latency: 460ms
[agora_5bnxv1] 09-29 09:35:26.502  7463  7505 I AZURE_TTS_EXTENSION SpeechText@tts.cc:182 task finished for text: [ we saw some big advancements like the rise of AI and electric cars becoming more mainstream.], text_recv_ts: 1727602522461866, read_bytes: 178800, sent_frames: 559, first_frame_latency: 510ms, finish_latency: 928ms, synthesis_first_byte_latency: 503ms, synthesis_finish_latency: 800ms
[agora_5bnxv1] 09-29 09:35:27.029  7463  7505 I AZURE_TTS_EXTENSION SpeechText@tts.cc:182 task finished for text: [ Personally,], text_recv_ts: 1727602522468652, read_bytes: 34400, sent_frames: 108, first_frame_latency: 442ms, finish_latency: 524ms, synthesis_first_byte_latency: 436ms, synthesis_finish_latency: 463ms
```

When you see logs like these, it means the system is working properly and is logging every sentence you speak.
