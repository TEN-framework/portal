---
title: Deploy TEN Agent Service
---

Once you have customized your agent (either by using the playground or editing property.json directly), you can deploy it by creating a release docker image for your service.

## Make your agent service into a docker image

The Dockerfile has been prepared in every example folder. You can build the docker image by running the following command:

```shell
cd ai_agents
docker build -f agents/examples/<example-name>/Dockerfile -t example-app .
```

For Apple Silicon, use the following command:

```shell
docker build -f agents/examples/<example-name>/Dockerfile -t example-app . --platform linux/amd64
```


> Note: The above docker build commands need to be executed outside of Docker container.

## Run the docker image

After building the docker image, you can run it by running the following command:

```shell
docker run --rm -it --env-file .env -p 8080:8080 -p 3000:3000 example-app
```

The agent service will be running on http://localhost:8080, and a frontend will be ready for access on http://localhost:3000.

## Test the agent service

The service exposes a list of apis that you can use to interact with the agent. The api reference can be found [https://github.com/TEN-framework/TEN-Agent/tree/main/server](https://github.com/TEN-framework/TEN-Agent/tree/main/server).

You can also test the agent service by accessing http://localhost:3000.
