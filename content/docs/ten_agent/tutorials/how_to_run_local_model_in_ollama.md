---
title: How to Use a Local LLM with Ollama in TEN Agent
---

Ten Agent enables integration with various LLMs that support the OpenAI request-response format. This guide outlines how to use Ollama models locally with Ten Agent by leveraging OpenAI-compatible endpoints.

## Step 1: Verify Hardware Requirements

Ensure your hardware meets the necessary requirements before running an AI model locally. Key components to check include:

- **CPU/GPU**: Verify the processing power required by the model.
- **Memory**: Confirm sufficient memory is available to load and run the model.

This ensures smooth operation of the model on your system.

## Step 2: Install Required Software and Dependencies

Prepare your environment by installing the necessary software and dependencies:

1. **Install Ollama**: Download and install Ollama on your local machine. Refer to [Ollama](https://ollama.com/).
2. **Download the Model**: Use the command `ollama pull {model name}` to download the desired LLM model. For example, `ollama pull deepseek-r1`
3. **Set Up Ten Agent**: Ensure Ten Agent Dev and Ten Agent Playground are properly configured. Refer to [Ten Agent: Getting Started](../ten_agent/getting_started.md)

## Step 3: Start the Ollama Server

After setting up Ollama and downloading the required models, start the Ollama server by running the following command in your terminal:

```bash
OLLAMA_HOST=0.0.0.0 ollama serve
```

This launches the Ollama server on your local machine. Since the Ten Agent runs in a Docker container, you’ll need your private IP address to access the Ollama server. Retrieve your private IP for the LLM endpoint.

## Step 4: Configure Ten Agent

Integrate Ollama with Ten Agent using its OpenAI API compatibility:

1. Open Ten Agent Playground and navigate to the **Voice Assistance Graph (voice_assistant)**.
2. Select **OpenAI** as the LLM.
3. Set the Ollama API endpoint as the LLM `base_url`: `http://<your-local-machine-private-ip>:11434/v1/`.

Replace `<your-local-machine-private-ip>` with the private IP address of your local machine.

4. Provide a `prompt`, e.g., "You're a helpful assistant."
5. Specify the `model` name used in Ollama (e.g., `deepseek-r1`).

## Step 5: Test the Integration

Once configured, Ten Agent will interact with Ollama using the same flow as OpenAI’s API. Test queries to ensure proper functionality.

## Additional Resources

For more information on Ollama’s OpenAI compatibility, refer to their official blog post: [Ollama OpenAI Compatibility](https://ollama.com/blog/openai-compatibility).

## Summary

Integrating a local model with Ten Agent is straightforward, thanks to its support for the OpenAI API format. The same process can be applied to connect with cloud-hosted LLMs or any LLMs supporting OpenAI API compatibility.
