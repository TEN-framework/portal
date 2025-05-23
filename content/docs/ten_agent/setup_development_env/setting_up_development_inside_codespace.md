---
title: Cloud Development in Codespace
---

Github Codespace is a cloud-based development environment that allows you to develop your code directly in the cloud. It's a great way to develop your agent without having to set up a local development environment. You don't need to have a great network or powerful machine. This guide will show you how to set up a development environment for TEN Agent using Github CodeSpace.

## Step 1: Create a Codespace with TEN-Agent repository

Navigate to TEN-Agent github repository, and click on the `Code` button. Then, select `Open with Codespaces`. Github will then create a Codespace for you in a new browser tab. The first time you create a Codespace, it may take a few minutes to set up.

![Open with Codespaces](https://ten-framework-assets.s3.amazonaws.com/doc-assets/start_codespace.png?raw=true)

## Step 2: Start working with Codespace

Once the Codespace is ready, you will see the VSCode editor in the browser. You can start working with the TEN-Agent repository in the Codespace. You can open the terminal, create new files, and run commands just like you would in a local development environment.

The steps are similar to the process outlined in the [Quick Start](./getting_started) guide. However, there's no need to run `docker compose up` command with Codespace. You can directly start building agent using,

```bash
# Prepare .env file from .env.example and set your api keys inside it
cp ./env.example .env
# Build the agent after finish key configurations
task use
```

And once successfully built, you can run following command to start server,

```bash
task run
```

## Step 3: Start Front-end UI

As we are not using docker compose with Codespace, you will need to start the front-end UI separately. You can do this by running the following command in the terminal,

```bash
cd playground
pnpm install
pnpm dev
```

This will start the front-end UI at `localhost:3000`.

## Step 4: Access your remote setup

This is a very special step which applies to Codespace only. Codespace will automatically generate a URL for every port you exposed in your Codespace. You can find the URL by clicking on the `Ports` tab in the bottom left corner of the Codespace window.

![Ports](https://ten-framework-assets.s3.amazonaws.com/doc-assets/codespace_ports.png?raw=true)

All ports visibility are by default set to `private`, you can change it to `public` by right click and choose `port visibility`. Once you make it public, you can access the URL in your browser to see the front-end UI. Here we will right click on the visibility column of 3000 port, and change its visibility to `public`.

![Change Visibility](https://ten-framework-assets.s3.amazonaws.com/doc-assets/codespace_visibility.png?raw=true)

Now you can access the front-end UI at the URL generated by Codespace. Find the `Forwarded Address` column for port 3000, click on that and browser should start a new tab for you with your front-end UI.

![Forwarded Address](https://ten-framework-assets.s3.amazonaws.com/doc-assets/codespace_forwarded_addr.png?raw=true)

And that's it! You have successfully set up a development environment for TEN Agent using Github Codespace. You can now start developing your agent directly in the cloud. For debugging and development experience it's basically the same as your local VSCode experience.
