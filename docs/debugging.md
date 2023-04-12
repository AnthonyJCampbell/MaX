# VSCode Debugging

## VSCode debugging for Electron and React

- Create a `.vscode` folder in the root directory of electron-ui project

- Create a `launch.json` file with these contents:

```json
{
  // Use IntelliSense to learn about possible attributes.
  // Hover to view descriptions of existing attributes.
  // For more information, visit: https://go.microsoft.com/fwlink/?linkid=830387
  "version": "0.2.0",
  "configurations": [
  {
    "name": "Electron: Main",
    "type": "node",
    "request": "launch",
    "cwd": "${workspaceFolder}",
    "runtimeExecutable": "${workspaceFolder}/node_modules/.bin/electron",
    "windows": {
    "runtimeExecutable": "${workspaceFolder}/node_modules/.bin/electron.cmd"
    },
    "program": "${workspaceFolder}/build/node-server/electron.js",
    "runtimeArgs": [
    ".",
    "--enable-logging",
    "--remote-debugging-port=9223"
    ],
    "outputCapture": "std",
    "preLaunchTask": "Build and Start"
  },
  {
    "name": "Electron: React",
    "type": "chrome",
    "request": "attach",
    "port": 9223,
    "webRoot": "${workspaceFolder}",
    "timeout": 60000,
  }
  ]
}
```

- Then create a `tasks.json` file with these content:

```json
{
  "version": "2.0.0",
  "tasks": [
    {
      "type": "npm",
      "label": "Start react",
      "script": "react-start",
      "group": "test",
      "isBackground": true,
      "options": {
        "cwd": "${workspaceFolder}",
        "env": {
          "BROWSER": "none",
        }
      },
      "problemMatcher": {
        "owner": "custom",
        "pattern": {
          "regexp": "^$"
        },
        "background": {
          "activeOnStart": true,
          "beginsPattern": "Compiling...",
          "endsPattern": "Compiled .*"
        }
       }
    },
    {
      "type": "shell",
      "label": "Build node-server",
      "command": "npx webpack --config node-server/webpack.dev.js",
      "group": "test",
      "isBackground": true,
      "options": {
        "cwd": "${workspaceFolder}",
      },
      "problemMatcher": {
        "owner": "custom",
        "pattern": {
          "regexp": "^$"
        },
        "background": {
          "activeOnStart": true,
          "beginsPattern": "Compiling...",
          "endsPattern": "Compiled .*"
        }
      }
    },
    {
      "label": "Build and Start",
      "dependsOn": ["Start react", "Build node-server"]
    }
  ]
}
```

- When you want to debug, use the VS Code interface and run both: `Electron: Main` and `Electron: React`. The first one debugs the electron code, and the last one, the react code.

## VSCode debugging for Java client

- Install the [Java Extensions Pack](https://marketplace.visualstudio.com/items?itemName=vscjava.vscode-java-pack) extension as it includes all required Java extensions and is the most reliable choice (or you can install only [Debugger for Java](https://marketplace.visualstudio.com/items?itemName=vscjava.vscode-java-debug) and [Language Support for Java(TM) by Red Hat](https://marketplace.visualstudio.com/items?itemName=redhat.java), but this is discouraged)
- Create a `.vscode` folder in the root directory of AccessionDesktop and create a `launch.json` file with these contents:

```json
{
  "version": "0.2.0",
  "configurations": [
  {
    "type": "java",
    "name": "AD attach",
    "projectName": "Accession Desktop",
    "request": "attach",
    "hostName": "localhost",
    "port": 8001
  }
  ]
}
```

- When you want to debug, run the `./run.sh` command in a terminal (any terminal, doesn't have to be the VSCode one) and when the application has started go into VSCode and hit F5 (or Run -> Start Debugging).
- It should automatically recognise the Debugging configuration. If it doesn't, click the Configurations and select AD attach.
- If debugging start-up issues, the VM should start in suspended state - it will sit waiting for the debugger to attach and only then start the main process. To start in suspend mode, use suspend.bat (it doesn't build anything, it just starts the app).
