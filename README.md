# Background servers Github Action

A Github action to run a command (e.g. e2e tests) while also running another commands in the background (e.g. servers).

## Usage

```yml
name: Run E2E tests
on: [ push ]

jobs:
  run-test:
    runs-on: ubuntu-20.04
    steps:
      - name: Checkout
        uses: actions/checkout@v3

      - name: Run E2E Tests
        uses: maximedeoliveira/background-servers@latest
        with:
          command: npm run test
```

## Inputs

### `command` (required)

This parameter is the command to run while everything is ready.

### `build`

You can run a build step before running command or starting your app.

### `start`

If your tests run against a local server, you can use start parameter, the server will run in the background.

You can start multiple servers using comma separations (e.g. npm run web, npm run api).

### `wait-on`

If you are starting local servers, and it takes a while to start, you can use wait-on parameter and pass url to wait for the server to respond.

### `wait-on-timeout`

By default, wait-on will retry for 60 seconds.You can pass a custom timeout in seconds using wait-on-timeout.

### `debug`

You can use debug parameter to print action steps.
