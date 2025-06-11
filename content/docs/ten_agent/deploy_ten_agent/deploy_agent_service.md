---
title: Deploy TEN Agent Service
---

Once you have customized your agent (either by using the playground or editing property.json directly), you can deploy it by creating a release docker image for your service.

## Make your agent service into a docker image

The Dockerfile has been prepared in project root folder. You can build the docker image by running the following command:

```shell
docker build -t ten-agent-server .
```

For Apple Silicon, use the following command:

```shell
docker build -t ten-agent-server . --platform linux/amd64
```

In case you are using `demo` or `experimental` folder, you can build the docker image by running the following command:

```shell
docker build --build-arg USE_AGENT=agents/examples/demo -t ten-agent-server .
```

```shell
docker build --build-arg USE_AGENT=agents/examples/experimental -t ten-agent-server .
```

> Note: The `USE_AGENT` argument is optional. If you don't specify it, the default agent will be used.

## Run the docker image

After building the docker image, you can run it by running the following command:

```shell
docker run -itd -p 8083:8080 --env-file .env --name ten-agent-server ten-agent-server
```

The agent service will be running on port 8083 now.

## Test the agent service

The service exposes a list of apis that you can use to interact with the agent. The api reference can be found [https://github.com/TEN-framework/TEN-Agent/tree/main/server](https://github.com/TEN-framework/TEN-Agent/tree/main/server).

You can also test the agent service by running the following command in playground client:

```shell
NEXT_PUBLIC_EDIT_GRAPH_MODE=false AGENT_SERVER_URL=http://localhost:8083 pnpm dev
```

> Note: The `AGENT_SERVER_URL` should be the url where your agent service is running. If you are running the agent service on your server, replace `localhost` with your server ip.
> Note: The `NEXT_PUBLIC_EDIT_GRAPH_MODE` should be set to `false` to use the agent service, as the released docker image has no dev server packaged.

## Test the agent service using playground docker image

Sometimes you may want to deploy the playground along with the agent service. You can do this by running the following command to build your own playground UI into docker image:

```shell
cd playground
docker build --build-arg EDIT_GRAPH_MODE=false -t ten-agent-playground .
```

Then you can run the playground docker image by running the following command:

```shell
docker run -itd -p 4000:3000 -e AGENT_SERVER_URL=http://host.docker.internal:8083 --name ten-agent-playground ten-agent-playground
```

> Note: The `AGENT_SERVER_URL` should be the url where your agent service is running. Since you are running the agent service in another docker container, you can use `host.docker.internal` to access the host machine. If you are running the agent service on your server, replace `host.docker.internal` with your server ip.
> Note: If you are connecting to a released version of agent service, you should set `EDIT_GRAPH_MODE` to `false` when building the playground docker image.
