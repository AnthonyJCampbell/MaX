// Copyright 2021 Metaswitch Networks - Highly Confidential Material

// Contains the webpack config which is shared between all types of clients
const path = require("path");
const nodeExternals = require("webpack-node-externals");

module.exports = {
  entry: {
    main: "./node-server/electron.js",
  },
  output: {
    path: path.resolve(__dirname, "../build/node-server"),
    filename: "node-server.js",
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
  externals: [
    { "../config/dev-tools": "require('../../node-server/config/dev-tools')" },
    nodeExternals(),
  ],
  target: "electron-main",
  node: {
    __dirname: false,
  },
  module: {
    rules: [
      {
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
};
